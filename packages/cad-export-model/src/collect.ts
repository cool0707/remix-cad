import {
  AcCmColor,
  AcDbArc,
  AcDbAttributeDefinition,
  AcDbBlockReference,
  AcDbCircle,
  type AcDbDatabase,
  AcDbEllipse,
  type AcDbEntity,
  AcDbLine,
  AcDbMText,
  AcDbPoint,
  AcDbPolyline,
  AcDbRasterImage,
  AcDbRenderingCache,
  AcDbText,
  AcDbTrace,
  AcDbViewport,
  AcDbWipeout,
  type AcGiLineStyle
} from '@mlightcad/data-model'

import {
  type Affine,
  affineFromMatrix3d,
  apply,
  bulgeArc,
  compose,
  curveFromAxes,
  transformCurve,
  transformText
} from './geometry'
import { hatchPatternSegments } from './hatch'
import {
  AcExRecordingRenderer,
  type RecordedPrimitive,
  type RecordedTraits,
  transformPrimitive
} from './recorder'
import {
  type Box,
  chooseSheet,
  type SheetOptions,
  unitsToMillimetres
} from './sheet'
import { cellFontMetrics, mtextLines, textCells } from './text'
import type {
  ExportDrawing,
  ExportEntity,
  ExportLayer,
  ExportStyle,
  ExportText,
  Rgb,
  Vec2
} from './types'

export interface CollectOptions extends SheetOptions {
  /** Drawing title written to the file header. */
  title?: string
}

/** What an entity inside a block reference inherits from the reference. */
interface InsertContext {
  layer: string
  color: { rgb: number; foreground: boolean }
  lineType: string
  lineWeight: number
}

const BY_LAYER = -1
const BY_BLOCK = -2

function rgbOf(value: number): Rgb {
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff]
}

function isInkRgb(value: number) {
  return value === 0 || value === 0xffffff
}

/**
 * Flattens the model space of a drawing into {@link ExportDrawing}.
 *
 * Lines, arcs, circles, ellipses, polylines, text, MTEXT, points, solids and
 * block references are converted directly (block references are expanded).
 * Everything else is drawn through a recording renderer, so dimensions,
 * leaders, splines, hatches and tables come out as the lines, curves, text
 * and fills the viewer shows.
 */
export function collectExportDrawing(
  db: AcDbDatabase,
  options: CollectOptions = {}
): ExportDrawing {
  const collector = new Collector(db)
  AcDbRenderingCache.instance.clear()
  try {
    collector.run()
  } finally {
    // The cache now holds recorded drawables; the viewer must not reuse them.
    AcDbRenderingCache.instance.clear()
  }
  const unit = collector.unit
  const rawLimits = db as unknown as {
    limmin?: { x: number; y: number }
    limmax?: { x: number; y: number }
  }
  const limits: Box | undefined =
    rawLimits.limmin && rawLimits.limmax
      ? {
          min: [rawLimits.limmin.x * unit, rawLimits.limmin.y * unit],
          max: [rawLimits.limmax.x * unit, rawLimits.limmax.y * unit]
        }
      : undefined
  return {
    title: options.title ?? '',
    layers: collector.layers(),
    entities: collector.entities,
    sheet: chooseSheet(entityExtents(collector.entities), limits, options),
    warnings: collector.warnings
  }
}

/**
 * Reads the pixels of exported raster images (`blob` → `data`). Call before
 * handing the drawing to a writer or a worker.
 */
export async function resolveExportImages(drawing: ExportDrawing) {
  for (const entity of drawing.entities) {
    if (entity.kind !== 'image' || !entity.blob) continue
    if (!entity.data) {
      entity.data = new Uint8Array(await entity.blob.arrayBuffer())
      entity.mimeType ||= entity.blob.type || undefined
    }
    delete entity.blob
  }
}

/** Bounding box of exported entities (curves by their control box). */
export function entityExtents(entities: ExportEntity[]): Box | undefined {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  const add = (p: Vec2) => {
    if (!Number.isFinite(p[0]) || !Number.isFinite(p[1])) return
    minX = Math.min(minX, p[0])
    minY = Math.min(minY, p[1])
    maxX = Math.max(maxX, p[0])
    maxY = Math.max(maxY, p[1])
  }
  for (const e of entities) {
    switch (e.kind) {
      case 'polyline':
        e.points.forEach(add)
        break
      case 'curve': {
        const { center, u, v } = e.curve
        const rx = Math.hypot(u[0], v[0])
        const ry = Math.hypot(u[1], v[1])
        add([center[0] - rx, center[1] - ry])
        add([center[0] + rx, center[1] + ry])
        break
      }
      case 'text':
      case 'point':
        add(e.position)
        break
      case 'fill':
        e.loops.forEach(loop => loop.forEach(add))
        break
      case 'image':
        add(e.origin)
        add([e.origin[0] + e.u[0] + e.v[0], e.origin[1] + e.u[1] + e.v[1]])
        break
    }
  }
  if (!Number.isFinite(minX)) return undefined
  return { min: [minX, minY], max: [maxX, maxY] }
}

class Collector {
  readonly entities: ExportEntity[] = []
  readonly warnings: string[] = []
  readonly unit: number
  private readonly renderer: AcExRecordingRenderer
  private readonly ltscale: number
  private readonly usedLayers = new Set<string>()
  private readonly blockStack: string[] = []

  constructor(private readonly db: AcDbDatabase) {
    this.unit = unitsToMillimetres(db.insunits)
    this.renderer = new AcExRecordingRenderer(db)
    this.ltscale = db.ltscale > 0 ? db.ltscale : 1
  }

  run() {
    const base: Affine = [this.unit, 0, 0, this.unit, 0, 0]
    for (const entity of this.db.tables.blockTable.modelSpace.newIterator()) {
      this.visit(entity, base, undefined)
    }
  }

  layers(): ExportLayer[] {
    const result: ExportLayer[] = []
    for (const layer of this.db.tables.layerTable.newIterator()) {
      if (!this.usedLayers.has(layer.name) && layer.name !== '0') continue
      const { rgb, foreground } = this.colorRgb(layer.color)
      result.push({
        name: layer.name,
        color: rgbOf(rgb),
        foreground,
        hidden: layer.isOff || layer.isFrozen,
        locked: layer.isLocked
      })
    }
    // Layers referenced by entities but missing from the table.
    for (const name of this.usedLayers) {
      if (result.some(l => l.name === name)) continue
      result.push({
        name,
        color: [0, 0, 0],
        foreground: true,
        hidden: false,
        locked: false
      })
    }
    return result
  }

  warnOnce(message: string) {
    if (!this.warnings.includes(message)) this.warnings.push(message)
  }

  private visit(entity: AcDbEntity, t: Affine, ctx: InsertContext | undefined) {
    if (!entity.visibility) return
    try {
      this.visitEntity(entity, t, ctx)
    } catch (error) {
      this.warnOnce(
        `Some ${entity.dxfTypeName} entities could not be exported: ${String(error)}`
      )
    }
  }

  private visitEntity(
    entity: AcDbEntity,
    t: Affine,
    ctx: InsertContext | undefined
  ) {
    const normal = (entity as unknown as { normal?: { z: number } }).normal
    // Entities in a mirrored object coordinate system are left to worldDraw.
    const flipped = normal != null && normal.z < 0
    if (entity instanceof AcDbBlockReference) {
      this.visitInsert(entity, t, ctx)
      return
    }
    if (entity instanceof AcDbViewport || entity instanceof AcDbWipeout) return
    if (entity instanceof AcDbAttributeDefinition) return
    if (entity instanceof AcDbRasterImage) {
      this.visitImage(entity, t, ctx)
      return
    }
    if (!flipped) {
      if (entity instanceof AcDbLine) {
        const s = entity.startPoint
        const e = entity.endPoint
        this.push(entity, ctx, {
          kind: 'polyline',
          points: [apply(t, [s.x, s.y]), apply(t, [e.x, e.y])],
          closed: false
        })
        return
      }
      if (entity instanceof AcDbArc) {
        const c = entity.center
        const curve = curveFromAxes(
          [c.x, c.y],
          [entity.radius, 0],
          1,
          entity.startAngle,
          entity.endAngle
        )
        this.push(entity, ctx, {
          kind: 'curve',
          curve: transformCurve(t, curve)
        })
        return
      }
      if (entity instanceof AcDbCircle) {
        const c = entity.center
        const r = entity.radius
        const curve = {
          center: [c.x, c.y] as Vec2,
          u: [r, 0] as Vec2,
          v: [0, r] as Vec2,
          start: 0,
          end: Math.PI * 2
        }
        this.push(entity, ctx, {
          kind: 'curve',
          curve: transformCurve(t, curve)
        })
        return
      }
      if (entity instanceof AcDbEllipse) {
        const c = entity.center
        const axis = entity.majorAxis
        const len = Math.hypot(axis.x, axis.y) || 1
        const major: Vec2 = [
          (axis.x / len) * entity.majorAxisRadius,
          (axis.y / len) * entity.majorAxisRadius
        ]
        const ratio = entity.minorAxisRadius / entity.majorAxisRadius
        const full =
          Math.abs(entity.endAngle - entity.startAngle) >= Math.PI * 2 - 1e-9
        const curve = full
          ? curveFromAxes([c.x, c.y], major, ratio, 0, Math.PI * 2)
          : curveFromAxes(
              [c.x, c.y],
              major,
              ratio,
              entity.startAngle,
              entity.endAngle
            )
        this.push(entity, ctx, {
          kind: 'curve',
          curve: transformCurve(t, curve)
        })
        return
      }
      if (
        entity instanceof AcDbPolyline &&
        this.visitPolyline(entity, t, ctx)
      ) {
        return
      }
      if (entity instanceof AcDbMText) {
        this.visitMText(entity, t, ctx)
        return
      }
      if (entity instanceof AcDbText) {
        this.visitText(entity, t, ctx)
        return
      }
      if (entity instanceof AcDbPoint) {
        const p = entity.position
        this.push(entity, ctx, {
          kind: 'point',
          position: apply(t, [p.x, p.y])
        })
        return
      }
      if (entity instanceof AcDbTrace) {
        const corners = [0, 1, 3, 2].map(i => {
          const p = entity.getPointAt(i)
          return apply(t, [p.x, p.y])
        })
        this.push(entity, ctx, { kind: 'fill', loops: [dedupe(corners)] })
        return
      }
    }
    this.visitRecorded(entity, t, ctx)
  }

  private visitInsert(
    ref: AcDbBlockReference,
    t: Affine,
    ctx: InsertContext | undefined
  ) {
    const block = ref.blockTableRecord
    if (!block) return
    if (this.blockStack.includes(block.name) || this.blockStack.length > 32) {
      this.warnOnce('Recursive block references are skipped')
      return
    }
    const layer = this.effectiveLayer(ref.layer, ctx)
    this.usedLayers.add(layer)
    const inner: InsertContext = {
      layer,
      color: this.resolveColor(ref.color, layer, ctx),
      lineType: this.lineTypeName(ref.lineType, layer, ctx),
      lineWeight: this.lineWeightMm(ref.lineWeight, layer, ctx)
    }
    const transform = affineFromMatrix3d(ref.blockTransform.elements)
    const cols = Math.max(1, ref.columnCount)
    const rows = Math.max(1, ref.rowCount)
    this.blockStack.push(block.name)
    try {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const offset: Affine = [
            1,
            0,
            0,
            1,
            col * ref.columnSpacing,
            row * ref.rowSpacing
          ]
          const m = compose(t, compose(transform, offset))
          for (const entity of block.newIterator()) {
            this.visit(entity, m, inner)
          }
        }
      }
    } finally {
      this.blockStack.pop()
    }
    // Attributes are stored in world coordinates.
    for (const attrib of ref.attributeIterator()) {
      if (attrib.isInvisible || !attrib.visibility) continue
      this.visitText(attrib, t, ctx)
    }
  }

  private visitImage(
    image: AcDbRasterImage,
    t: Affine,
    ctx: InsertContext | undefined
  ) {
    if (!(image.width > 0 && image.height > 0)) return
    if (image.isClipped) {
      this.warnOnce('Clipped raster images are exported whole')
    }
    const p = image.position
    const r = image.rotation
    const origin = apply(t, [p.x, p.y])
    const corner = (x: number, y: number) => {
      const q = apply(t, [
        p.x + x * Math.cos(r) - y * Math.sin(r),
        p.y + x * Math.sin(r) + y * Math.cos(r)
      ])
      return [q[0] - origin[0], q[1] - origin[1]] as Vec2
    }
    const fileName =
      image.imageFileName.split(/[\\/]/).pop() || image.imageDisplayName || 'image'
    this.push(image, ctx, {
      kind: 'image',
      origin,
      u: corner(image.width, 0),
      v: corner(0, image.height),
      fileName,
      blob: image.image
    })
  }

  /** Returns false to fall back to worldDraw (wide polylines). */
  private visitPolyline(
    pl: AcDbPolyline,
    t: Affine,
    ctx: InsertContext | undefined
  ) {
    const geo = (
      pl as unknown as {
        _geo?: {
          vertices: {
            x: number
            y: number
            bulge?: number
            startWidth?: number
            endWidth?: number
          }[]
        }
      }
    )._geo
    const vertices = geo?.vertices
    if (!vertices) return false
    if (vertices.some(v => (v.startWidth ?? 0) > 0 || (v.endWidth ?? 0) > 0)) {
      return false
    }
    const n = vertices.length
    if (n === 0) return true
    const closed = pl.closed
    const segments = closed ? n : n - 1
    if (
      !vertices.some((v, i) => i < segments && Math.abs(v.bulge ?? 0) > 1e-12)
    ) {
      this.push(pl, ctx, {
        kind: 'polyline',
        points: vertices.map(v => apply(t, [v.x, v.y])),
        closed: closed && n > 2
      })
      return true
    }
    let run: Vec2[] = []
    const flush = () => {
      if (run.length >= 2) {
        this.push(pl, ctx, { kind: 'polyline', points: run, closed: false })
      }
      run = []
    }
    for (let i = 0; i < segments; i++) {
      const a = vertices[i]
      const b = vertices[(i + 1) % n]
      const bulge = a.bulge ?? 0
      if (Math.abs(bulge) > 1e-12 && (a.x !== b.x || a.y !== b.y)) {
        flush()
        const curve = bulgeArc([a.x, a.y], [b.x, b.y], bulge)
        this.push(pl, ctx, { kind: 'curve', curve: transformCurve(t, curve) })
      } else {
        if (run.length === 0) run.push(apply(t, [a.x, a.y]))
        run.push(apply(t, [b.x, b.y]))
      }
    }
    flush()
    return true
  }

  private textStyle(name: string) {
    const record = this.db.tables.textStyleTable.getAt(name)
    const style = record?.textStyle
    const font = style?.extendedFont || style?.font || record?.fileName || ''
    return {
      font,
      vertical: record?.isVertical ?? false,
      widthFactor: record?.xScale && record.xScale > 0 ? record.xScale : 1
    }
  }

  private visitText(text: AcDbText, t: Affine, ctx: InsertContext | undefined) {
    const content = text.textString
    if (!content || !content.trim() || !(text.height > 0)) return
    const style = this.textStyle(text.styleName)
    const h = text.height
    const wf = text.widthFactor > 0 ? text.widthFactor : style.widthFactor
    const r = text.rotation
    const hm = text.horizontalMode as number
    const vm = text.verticalMode as number
    let position: Vec2
    if ((hm === 0 && vm === 0) || hm === 3 || hm === 5) {
      position = [text.position.x, text.position.y]
    } else {
      const anchor = text.hasAlignmentPoint
        ? text.alignmentPoint
        : text.position
      const plain = decodeText(content)
      const em = h / cellFontMetrics(style.font).capHeight
      const width = textCells(plain) * em * wf
      const dx = hm === 1 || hm === 4 ? -width / 2 : hm === 2 ? -width : 0
      const dy =
        hm === 4 || vm === 2
          ? -h / 2
          : vm === 3
            ? -h
            : vm === 1
              ? em * cellFontMetrics(style.font).descender
              : 0
      position = [
        anchor.x + dx * Math.cos(r) - dy * Math.sin(r),
        anchor.y + dx * Math.sin(r) + dy * Math.cos(r)
      ]
    }
    const placed = transformText(t, position, h, wf, r)
    this.push(text, ctx, {
      kind: 'text',
      text: decodeText(content),
      position: placed.position,
      height: placed.height,
      widthFactor: placed.widthFactor,
      rotation: placed.rotation,
      oblique: text.oblique,
      font: style.font,
      vertical: style.vertical
    })
  }

  private visitMText(
    mtext: AcDbMText,
    t: Affine,
    ctx: InsertContext | undefined
  ) {
    const style = this.textStyle(mtext.styleName)
    const dir = mtext.direction
    const rotation =
      dir && Math.hypot(dir.x, dir.y) > 1e-12
        ? Math.atan2(dir.y, dir.x)
        : mtext.rotation
    const loc = mtext.location
    for (const line of layoutTextLines(
      mtextLines(mtext.contents),
      [loc.x, loc.y],
      mtext.height,
      style.widthFactor,
      rotation,
      mtext.attachmentPoint as number,
      mtext.lineSpacingFactor,
      style.font
    )) {
      const placed = transformText(
        t,
        line.position,
        mtext.height,
        style.widthFactor,
        rotation
      )
      this.push(mtext, ctx, {
        kind: 'text',
        text: line.text,
        position: placed.position,
        height: placed.height,
        widthFactor: placed.widthFactor,
        rotation: placed.rotation,
        oblique: 0,
        font: style.font,
        vertical: false
      })
    }
  }

  private visitRecorded(
    entity: AcDbEntity,
    t: Affine,
    ctx: InsertContext | undefined
  ) {
    const drawable = entity.worldDraw(this.renderer)
    if (!drawable || !('collect' in drawable)) return
    const primitives = (
      drawable as { collect(): RecordedPrimitive[] }
    ).collect()
    for (const raw of primitives) {
      const p = transformPrimitive(t, raw)
      const style = this.recordedStyle(p.traits, ctx)
      switch (p.kind) {
        case 'polyline': {
          if (p.points.length < 2) break
          const first = p.points[0]
          const last = p.points[p.points.length - 1]
          const closed =
            p.closed ||
            (p.points.length > 3 &&
              first[0] === last[0] &&
              first[1] === last[1])
          this.entities.push({
            kind: 'polyline',
            style,
            points: closed && !p.closed ? p.points.slice(0, -1) : p.points,
            closed
          })
          break
        }
        case 'curve':
          this.entities.push({ kind: 'curve', style, curve: p.curve })
          break
        case 'point':
          this.entities.push({ kind: 'point', style, position: p.position })
          break
        case 'area':
          this.pushArea(style, p.loops, p.fill)
          break
        case 'text': {
          for (const line of layoutTextLines(
            mtextLines(p.text),
            p.position,
            p.height,
            p.widthFactor,
            p.rotation,
            p.attachment,
            1,
            p.font
          )) {
            this.entities.push({
              kind: 'text',
              style,
              text: line.text,
              position: line.position,
              height: p.height,
              widthFactor: p.widthFactor,
              rotation: p.rotation,
              oblique: 0,
              font: p.font,
              vertical: false
            })
          }
          break
        }
      }
    }
  }

  private pushArea(
    style: ExportStyle,
    loops: Vec2[][],
    fill: Extract<RecordedPrimitive, { kind: 'area' }>['fill']
  ) {
    const usable = loops.map(dedupe).filter(loop => loop.length >= 3)
    if (usable.length === 0) return
    if (fill.solidFill || fill.gradient || fill.definitionLines.length === 0) {
      this.entities.push({ kind: 'fill', style, loops: usable })
      return
    }
    const segments = hatchPatternSegments(
      usable,
      fill.definitionLines,
      fill.patternAngle
    )
    if (!segments) {
      this.warnOnce(
        'Very dense hatch patterns are exported as their boundary only'
      )
      for (const loop of usable) {
        this.entities.push({
          kind: 'polyline',
          style,
          points: loop,
          closed: true
        })
      }
      return
    }
    const lineStyle = { ...style, lineType: 'CONTINUOUS', lineTypePattern: [] }
    for (const [a, b] of segments) {
      this.entities.push({
        kind: 'polyline',
        style: lineStyle,
        points: [a, b],
        closed: false
      })
    }
  }

  private push(
    entity: AcDbEntity,
    ctx: InsertContext | undefined,
    geometry: DistributiveOmit<ExportEntity, 'style'>
  ) {
    this.entities.push({
      ...geometry,
      style: this.entityStyle(entity, ctx)
    } as ExportEntity)
  }

  private effectiveLayer(layer: string, ctx: InsertContext | undefined) {
    return layer === '0' && ctx ? ctx.layer : layer
  }

  private entityStyle(
    entity: AcDbEntity,
    ctx: InsertContext | undefined
  ): ExportStyle {
    const layer = this.effectiveLayer(entity.layer, ctx)
    this.usedLayers.add(layer)
    const { rgb, foreground } = this.resolveColor(entity.color, layer, ctx)
    const lineType = this.lineTypeName(entity.lineType, layer, ctx)
    const scale = entity.linetypeScale > 0 ? entity.linetypeScale : 1
    return {
      layer,
      color: rgbOf(rgb),
      foreground,
      lineType: lineType.toUpperCase(),
      lineTypePattern: this.lineTypePattern(lineType, scale),
      lineWeight: this.lineWeightMm(entity.lineWeight, layer, ctx)
    }
  }

  private recordedStyle(
    traits: RecordedTraits,
    ctx: InsertContext | undefined
  ): ExportStyle {
    const layer = this.effectiveLayer(traits.layer, ctx)
    this.usedLayers.add(layer)
    const lineStyle = traits.lineType as AcGiLineStyle | undefined
    let name = lineStyle?.name ?? 'CONTINUOUS'
    if (/^byblock$/i.test(name)) name = ctx?.lineType ?? 'CONTINUOUS'
    if (/^bylayer$/i.test(name)) name = this.layerLineType(layer)
    const scale = traits.lineTypeScale > 0 ? traits.lineTypeScale : 1
    return {
      layer,
      color: rgbOf(traits.rgb),
      foreground: traits.foreground,
      lineType: name.toUpperCase(),
      lineTypePattern: this.lineTypePattern(name, scale),
      lineWeight: this.lineWeightMm(traits.lineWeight, layer, ctx)
    }
  }

  private colorRgb(color: AcCmColor) {
    const rgb = color.RGB ?? 0xffffff
    return {
      rgb,
      foreground: color.isForeground || color.colorIndex === 7 || isInkRgb(rgb)
    }
  }

  private resolveColor(
    color: AcCmColor,
    layer: string,
    ctx: InsertContext | undefined
  ) {
    if (color.isByBlock) return ctx?.color ?? { rgb: 0, foreground: true }
    if (color.isByLayer) {
      const record = this.db.tables.layerTable.getAt(layer)
      return record ? this.colorRgb(record.color) : { rgb: 0, foreground: true }
    }
    return this.colorRgb(color)
  }

  private layerLineType(layer: string) {
    return this.db.tables.layerTable.getAt(layer)?.linetype || 'CONTINUOUS'
  }

  private lineTypeName(
    name: string,
    layer: string,
    ctx: InsertContext | undefined
  ) {
    if (/^byblock$/i.test(name)) return ctx?.lineType ?? 'CONTINUOUS'
    if (!name || /^bylayer$/i.test(name)) return this.layerLineType(layer)
    return name
  }

  private lineTypePattern(name: string, scale: number): number[] {
    if (/^continuous$/i.test(name)) return []
    const record = this.db.tables.linetypeTable.getAt(name)
    const pattern = record?.linetype?.pattern
    if (!pattern || pattern.length === 0) return []
    const factor = this.ltscale * scale * this.unit
    return pattern.map(e => e.elementLength * factor)
  }

  private lineWeightMm(
    weight: number,
    layer: string,
    ctx: InsertContext | undefined
  ): number {
    if (weight === BY_BLOCK) return ctx?.lineWeight ?? 0
    if (weight === BY_LAYER) {
      const w = this.db.tables.layerTable.getAt(layer)?.lineWeight ?? -3
      return w > 0 ? w / 100 : 0
    }
    return weight > 0 ? weight / 100 : 0
  }
}

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never

function decodeText(value: string) {
  return mtextLines(value.replace(/\\P/g, ' ')).join(' ')
}

function dedupe(points: Vec2[]) {
  const out: Vec2[] = []
  for (const p of points) {
    const last = out[out.length - 1]
    if (!last || Math.hypot(p[0] - last[0], p[1] - last[1]) > 1e-9) out.push(p)
  }
  if (out.length > 1) {
    const a = out[0]
    const b = out[out.length - 1]
    if (Math.hypot(a[0] - b[0], a[1] - b[1]) <= 1e-9) out.pop()
  }
  return out
}

/**
 * Baseline-left positions of the lines of an MTEXT-style block anchored at
 * `anchor` with an attachment point (1–9 top/middle/bottom × left/centre/
 * right; 10–12 baseline). Widths are estimated from character cells.
 */
export function layoutTextLines(
  lines: string[],
  anchor: Vec2,
  height: number,
  widthFactor: number,
  rotation: number,
  attachment: number,
  lineSpacingFactor: number,
  font: string
): Pick<ExportText, 'text' | 'position'>[] {
  const visible = lines
  if (visible.every(line => !line.trim())) return []
  const metrics = cellFontMetrics(font)
  const em = height / metrics.capHeight
  const spacing =
    height * (5 / 3) * (lineSpacingFactor > 0 ? lineSpacingFactor : 1)
  const total = (visible.length - 1) * spacing
  const a = Math.min(12, Math.max(1, Math.round(attachment) || 1))
  const column = a >= 10 ? (a - 10) % 3 : (a - 1) % 3
  const row = a >= 10 ? 3 : Math.floor((a - 1) / 3)
  // Baseline of the first line, relative to the anchor.
  const firstBaseline =
    row === 0
      ? -height
      : row === 1
        ? total / 2 - height / 2
        : row === 2
          ? total
          : 0
  const cos = Math.cos(rotation)
  const sin = Math.sin(rotation)
  const result: Pick<ExportText, 'text' | 'position'>[] = []
  visible.forEach((text, i) => {
    if (!text.trim()) return
    const width = textCells(text) * em * widthFactor
    const dx = column === 1 ? -width / 2 : column === 2 ? -width : 0
    const dy = firstBaseline - i * spacing
    result.push({
      text,
      position: [
        anchor[0] + dx * cos - dy * sin,
        anchor[1] + dx * sin + dy * cos
      ]
    })
  })
  return result
}
