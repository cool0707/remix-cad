import {
  cellFontMetrics,
  cellFontName,
  type ExportDrawing,
  type ExportEntity,
  type ExportStyle,
  type PrincipalCurve,
  principalCurve,
  type Rgb,
  textCells,
  type Vec2
} from '@mlightcad/cad-export-model'
import type {
  EntityBase,
  JwwWriteDocument,
  JwwWriteEntity,
  JwwWriteImage
} from 'ezjww'
import { gzipSync } from 'fflate'

import type { JwwWriteResult } from './jwwWorkerProtocol'

/** The part of the `ezjww` API the writer needs (see {@link EzjwwApi}). */
export interface EzjwwWriterApi {
  newJwwDocument(): JwwWriteDocument
  toJwwBytes(document: JwwWriteDocument): Uint8Array
}

/**
 * How entity colours become Jw_cad pens.
 *
 * - `pen`: the nearest of the standard pens 1–9 (black / white = pen 2). Line
 *   widths then follow Jw_cad's pen settings, as in a drawing made in Jw_cad.
 * - `exact`: colours that are not a standard pen get an SXF extended pen
 *   (117–356) with the exact RGB.
 *
 * Fills always keep their exact colour.
 */
export type JwwColorMode = 'pen' | 'exact'

export interface JwwWriteOptions {
  /** @default 'pen' */
  colorMode?: JwwColorMode
  /** Text stored in the drawing memo. */
  memo?: string
}

export interface JwwBuildResult {
  document: JwwWriteDocument
  warnings: string[]
}

const TAU = Math.PI * 2

/** Jw_cad paper size codes of ISO A sheets. */
const PAPER_CODES: Record<string, number> = {
  A0: 0,
  A1: 1,
  A2: 2,
  A3: 3,
  A4: 4
}

/** DXF line type names the JWW reader (ezjww) gives Jw_cad line types. */
const JWW_LINE_TYPES: Record<string, number> = {
  JWW_DASHED1: 2,
  JWW_DASHED2: 3,
  JWW_DASHED3: 4,
  JWW_DASHDOT1: 5,
  JWW_DASHDOT2: 6,
  JWW_DIVIDE1: 7,
  JWW_DIVIDE2: 8,
  JWW_CONSTRUCTION: 9,
  JWW_DASHDOT_X2: 16,
  JWW_DIVIDE_X2: 17,
  JWW_DASHED_X2: 18,
  JWW_DASHED_X4: 19
}

/**
 * Jw_cad line type for any other pattern, by its shape: dashes only (fine /
 * even / long), dash + dot (chain) or dash + two dots or more (double chain).
 * Lengths are paper millimetres.
 */
export function jwwPenStyle(style: ExportStyle, scale: number): number {
  const known = JWW_LINE_TYPES[style.lineType]
  if (known) return known
  const pattern = style.lineTypePattern.map(v => v / scale)
  if (pattern.length < 2) return 1
  const dashes = pattern.filter(v => v >= 0)
  const gaps = pattern.filter(v => v < 0).map(v => -v)
  if (dashes.length === 0 || gaps.length === 0) return 1
  const longest = Math.max(...dashes)
  // Short marks (dots) are less than a third of the longest dash.
  const dots = dashes.filter(v => v < longest / 3).length
  if (dots >= 2) return 7
  if (dots === 1) return 5
  const gap = Math.max(...gaps)
  if (longest <= gap) return longest < 1 ? 2 : 3
  return longest >= gap * 2 ? 4 : 3
}

/** COLORREF (0x00BBGGRR) of an RGB colour. */
function colorRef([r, g, b]: Rgb) {
  return (b << 16) | (g << 8) | r
}

function rgbOfColorRef(value: number): Rgb {
  return [value & 0xff, (value >> 8) & 0xff, (value >> 16) & 0xff]
}

function distance2(a: Rgb, b: Rgb) {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2
}

function isInk(color: Rgb) {
  const max = Math.max(...color)
  const min = Math.min(...color)
  return max - min < 24 && (max < 40 || min > 215)
}

interface LayerSlot {
  group: number
  layer: number
}

/**
 * Builds a Jw_cad drawing (ezjww writer input) from an exported drawing.
 *
 * - Paper and scale come from `drawing.sheet` (JWW sheets are landscape A0–A4;
 *   a portrait sheet uses the same paper turned). Every layer group gets the
 *   sheet scale; coordinates are paper millimetres from the sheet centre.
 * - Layers named like the JWW reader names them (`<group>-<layer> <group
 *   name> - <layer name>`) go back to their group and layer; other layers fill
 *   the 16 × 16 slots in order.
 * - Polylines become lines; circles, arcs and ellipses stay curves; fills
 *   become solids with their exact colour (polygons are split into
 *   triangles).
 *
 * @param template - A fresh document from ezjww's `newJwwDocument()`.
 */
export function buildJwwDocument(
  template: JwwWriteDocument,
  drawing: ExportDrawing,
  options: JwwWriteOptions = {}
): JwwBuildResult {
  return new JwwBuilder(template, drawing, options).build()
}

/** Writes an exported drawing as JWW bytes with ezjww's writer. */
export function writeJwwBytes(
  ez: EzjwwWriterApi,
  drawing: ExportDrawing,
  options?: JwwWriteOptions
): JwwWriteResult {
  const { document, warnings } = buildJwwDocument(
    ez.newJwwDocument(),
    drawing,
    options
  )
  return { bytes: ez.toJwwBytes(document), warnings }
}

class JwwBuilder {
  private readonly warnings: string[] = []
  private readonly scale: number
  private readonly center: Vec2
  private readonly slots = new Map<string, LayerSlot>()
  private readonly penColors: Rgb[]
  private readonly entities: JwwWriteEntity[] = []
  private readonly images: JwwWriteImage[] = []
  /** Embedded image name by file name + contents. */
  private readonly imageNames = new Map<string, string>()

  constructor(
    private readonly doc: JwwWriteDocument,
    private readonly drawing: ExportDrawing,
    private readonly options: JwwWriteOptions
  ) {
    const sheet = drawing.sheet
    this.scale = sheet.scale > 0 ? sheet.scale : 1
    this.center = [
      sheet.origin[0] + (sheet.width * this.scale) / 2,
      sheet.origin[1] + (sheet.height * this.scale) / 2
    ]
    this.penColors = (doc.options.palette?.pen_colors ?? []).map(rgbOfColorRef)
  }

  build(): JwwBuildResult {
    const options = this.doc.options
    const sheet = this.drawing.sheet
    options.paper_size = PAPER_CODES[sheet.paper] ?? 3
    if (sheet.portrait) {
      this.warnOnce(
        'Jw_cad sheets are landscape; the portrait sheet is written as landscape'
      )
    }
    if (this.options.memo != null) options.memo = this.options.memo
    this.assignLayers()
    for (const entity of this.drawing.entities) this.add(entity)
    this.doc.entities = this.entities
    this.doc.block_defs = []
    this.doc.images = this.images
    return {
      document: this.doc,
      warnings: [...this.drawing.warnings, ...this.warnings]
    }
  }

  private warnOnce(message: string) {
    if (!this.warnings.includes(message)) this.warnings.push(message)
  }

  private assignLayers() {
    const groups = this.doc.options.layer_groups
    const used = new Set<number>()
    const named: {
      name: string
      slot: LayerSlot
      group?: string
      layer?: string
    }[] = []
    const others: string[] = []
    for (const layer of this.drawing.layers) {
      const match = /^([0-9A-F])-([0-9A-F])(?: (.*))?$/.exec(layer.name)
      if (match) {
        const slot = {
          group: parseInt(match[1], 16),
          layer: parseInt(match[2], 16)
        }
        const key = slot.group * 16 + slot.layer
        if (!used.has(key)) {
          used.add(key)
          const label = match[3] ?? ''
          const split = label.indexOf(' - ')
          named.push({
            name: layer.name,
            slot,
            group: split >= 0 ? label.slice(0, split) : label || undefined,
            layer: split >= 0 ? label.slice(split + 3) : undefined
          })
          continue
        }
      }
      others.push(layer.name)
    }
    for (const n of named) {
      this.slots.set(n.name, n.slot)
      const group = groups[n.slot.group]
      if (n.group && !group.name) group.name = n.group
      const fallback = `${n.slot.group.toString(16).toUpperCase()}-${n.slot.layer.toString(16).toUpperCase()}`
      if (n.layer && n.layer !== fallback)
        group.layers[n.slot.layer].name = n.layer
    }
    let next = 0
    for (const name of others) {
      while (next < 256 && used.has(next)) next++
      if (next >= 256) {
        this.warnOnce(
          'Jw_cad has 256 layers; the remaining layers share layer F-F'
        )
        this.slots.set(name, { group: 15, layer: 15 })
        continue
      }
      used.add(next)
      const slot = { group: next >> 4, layer: next & 15 }
      this.slots.set(name, slot)
      groups[slot.group].layers[slot.layer].name = name
    }
    // States: hidden layers 0, others editable (2); one current layer (3) per
    // group, and the current group (3) is the first one in use.
    const hidden = new Set(
      this.drawing.layers.filter(l => l.hidden).map(l => l.name)
    )
    const hiddenSlots = new Set(
      [...this.slots]
        .filter(([name]) => hidden.has(name))
        .map(([, s]) => s.group * 16 + s.layer)
    )
    const firstUsed = Math.min(...used, 0)
    groups.forEach((group, g) => {
      group.scale = this.scale
      group.layers.forEach((layer, l) => {
        layer.state = hiddenSlots.has(g * 16 + l) ? 0 : 2
      })
      let write = group.layers.findIndex(
        (_, l) => used.has(g * 16 + l) && !hiddenSlots.has(g * 16 + l)
      )
      if (write < 0) write = 0
      group.write_layer = write
      group.layers[write].state = 3
      group.state = 2
    })
    const writeGroup =
      used.size > 0
        ? Math.floor([...used].sort((a, b) => a - b)[0] / 16)
        : firstUsed
    this.doc.options.write_layer_group = writeGroup
    groups[writeGroup].state = 3
  }

  private base(
    style: ExportStyle,
    kind: 'line' | 'text' | 'point' | 'fill'
  ): EntityBase {
    const slot = this.slots.get(style.layer) ?? { group: 0, layer: 0 }
    return {
      group: 0,
      pen_style: kind === 'line' ? jwwPenStyle(style, this.scale) : 1,
      pen_color: kind === 'fill' ? 10 : this.penColor(style),
      pen_width: 0,
      layer: slot.layer,
      layer_group: slot.group,
      flag: 0
    }
  }

  /** Standard pen of a colour (`pen` mode), or 0 for an inline colour. */
  private penColor(style: ExportStyle) {
    if (style.foreground || isInk(style.color)) return 2
    let best = 2
    let bestDistance = Infinity
    for (let pen = 1; pen <= 9; pen++) {
      const color = this.penColors[pen]
      if (!color) continue
      const d = distance2(color, style.color)
      if (d < bestDistance) {
        best = pen
        bestDistance = d
      }
    }
    return best
  }

  private colorField(style: ExportStyle) {
    if (
      this.options.colorMode !== 'exact' ||
      style.foreground ||
      isInk(style.color)
    ) {
      return {}
    }
    const pen = this.penColors[this.penColor(style)]
    if (pen && distance2(pen, style.color) === 0) return {}
    return { color: colorRef(style.color) }
  }

  private paper(p: Vec2): Vec2 {
    return [
      (p[0] - this.center[0]) / this.scale,
      (p[1] - this.center[1]) / this.scale
    ]
  }

  private add(entity: ExportEntity) {
    switch (entity.kind) {
      case 'polyline':
        this.addPolyline(entity.style, entity.points, entity.closed)
        break
      case 'curve':
        this.addCurve(entity.style, principalCurve(entity.curve))
        break
      case 'point': {
        const [x, y] = this.paper(entity.position)
        this.entities.push({
          type: 'POINT',
          base: this.base(entity.style, 'point'),
          x,
          y,
          is_temporary: false,
          code: 0,
          angle: 0,
          scale: 0,
          ...this.colorField(entity.style)
        })
        break
      }
      case 'text':
        this.addText(entity)
        break
      case 'fill':
        this.addFill(entity.style, entity.loops)
        break
      case 'image':
        this.addImage(entity)
        break
    }
  }

  private addPolyline(style: ExportStyle, points: Vec2[], closed: boolean) {
    const base = this.base(style, 'line')
    const color = this.colorField(style)
    const paper = points.map(p => this.paper(p))
    const count = closed ? paper.length : paper.length - 1
    for (let i = 0; i < count; i++) {
      const a = paper[i]
      const b = paper[(i + 1) % paper.length]
      if (a[0] === b[0] && a[1] === b[1]) continue
      this.entities.push({
        type: 'LINE',
        base: { ...base },
        start_x: a[0],
        start_y: a[1],
        end_x: b[0],
        end_y: b[1],
        ...color
      })
    }
  }

  private addCurve(style: ExportStyle, c: PrincipalCurve) {
    if (!(c.radiusX > 0)) return
    const [cx, cy] = this.paper(c.center)
    const radius = c.radiusX / this.scale
    const flatness = Math.min(1, Math.max(c.radiusY / c.radiusX, 1e-6))
    // Circles have no axis direction; ellipses keep theirs.
    const tilt = c.circular ? 0 : normalizeAngle(c.rotation)
    const start = c.circular ? c.rotation + c.start : c.start
    const geometry = {
      base: this.base(style, 'line'),
      center_x: cx,
      center_y: cy,
      radius,
      flatness: c.circular ? 1 : flatness,
      tilt_angle: tilt,
      ...this.colorField(style)
    }
    if (c.full) {
      this.entities.push({
        type: 'CIRCLE',
        is_full_circle: true,
        start_angle: 0,
        arc_angle: TAU,
        ...geometry
      })
      return
    }
    const sweep = c.end - c.start
    if (!(sweep > 1e-12)) return
    this.entities.push({
      type: 'ARC',
      is_full_circle: false,
      start_angle: normalizeAngle(start),
      arc_angle: Math.min(sweep, TAU - 1e-9),
      ...geometry
    })
  }

  private addText(text: Extract<ExportEntity, { kind: 'text' }>) {
    // Jw_cad text is one line without control characters; `^@` starts
    // Jw_cad commands.
    const content = text.text.replace(/[\p{Cc}]/gu, ' ').replace(/^\^@/, '^ @')
    if (!content.trim() || !(text.height > 0)) return
    const font = cellFontName(text.font)
    const vertical = font.startsWith('@')
    const metrics = cellFontMetrics(font)
    const em = text.height / metrics.capHeight / this.scale
    const r = text.rotation
    const rise = em * metrics.descender
    const [px, py] = this.paper(text.position)
    // The JWW point is the bottom of the character cell.
    const sx = px + Math.sin(r) * rise
    const sy = py - Math.cos(r) * rise
    const sizeX = em * (text.widthFactor > 0 ? text.widthFactor : 1)
    const length = textCells(content) * sizeX
    // 縦字 (`@` font) runs along the string; its characters stand 90° to it.
    const angle =
      (((((vertical ? r + Math.PI / 2 : r) * 180) / Math.PI) % 360) + 360) % 360
    this.entities.push({
      type: 'TEXT',
      base: this.base(text.style, 'text'),
      start_x: sx,
      start_y: sy,
      end_x: sx + Math.cos(r) * length,
      end_y: sy + Math.sin(r) * length,
      text_type: 0,
      size_x: sizeX,
      size_y: em,
      spacing: 0,
      angle: angle >= 360 - 1e-9 ? 0 : angle,
      font_name: font,
      content,
      ...this.colorField(text.style)
    })
  }

  /**
   * Places an image with a `^@BM` text (lower-left corner at the text point,
   * width × height in paper millimetres along the text angle). Images with
   * pixels are embedded gzip-compressed, like Jw_cad does; others keep their
   * file name as an external reference.
   */
  private addImage(image: Extract<ExportEntity, { kind: 'image' }>) {
    const width = Math.hypot(image.u[0], image.u[1]) / this.scale
    const height = Math.hypot(image.v[0], image.v[1]) / this.scale
    if (!(width > 0 && height > 0)) return
    // Commas separate the placement parameters.
    const fileName = image.fileName.replace(/[,\p{Cc}]/gu, '_') || 'image'
    let path = fileName
    if (image.data) {
      const key = `${fileName}\u0000${image.data.length}\u0000${checksum(image.data)}`
      let name = this.imageNames.get(key)
      if (!name) {
        name = fileName
        const taken = new Set(this.imageNames.values())
        for (let n = 2; taken.has(name); n++) {
          name = fileName.replace(/(\.[^.]*)?$/, `~${n}$1`)
        }
        this.imageNames.set(key, name)
        this.images.push({
          name: `${name}.gz`,
          data: base64(gzipSync(image.data)),
          compressed: true
        })
      }
      path = `%temp%${name}`
    } else {
      this.warnOnce('Images without pixels are written as references to their file name')
    }
    const [x, y] = this.paper(image.origin)
    const angle = ((Math.atan2(image.u[1], image.u[0]) * 180) / Math.PI + 360) % 360
    const size = 2.5
    this.entities.push({
      type: 'TEXT',
      base: this.base(image.style, 'text'),
      start_x: x,
      start_y: y,
      end_x: x,
      end_y: y,
      text_type: 0,
      size_x: size,
      size_y: size,
      spacing: 0,
      angle: angle >= 360 - 1e-9 ? 0 : angle,
      font_name: 'ＭＳ ゴシック',
      content: `^@BM${path},${trimNumber(width)},${trimNumber(height)},0,0,1,0,255,255,255`
    })
  }

  private addFill(style: ExportStyle, loops: Vec2[][]) {
    const base = this.base(style, 'fill')
    const color = colorRef(style.foreground ? [0, 0, 0] : style.color)
    for (const triangle of triangulate(
      loops.map(loop => loop.map(p => this.paper(p)))
    )) {
      const [a, b, c] = triangle
      // Native field order is point1 → point4 → point2 → point3; a triangle
      // repeats its last vertex.
      this.entities.push({
        type: 'SOLID',
        base: { ...base },
        point1_x: a[0],
        point1_y: a[1],
        point4_x: b[0],
        point4_y: b[1],
        point2_x: c[0],
        point2_y: c[1],
        point3_x: c[0],
        point3_y: c[1],
        color
      })
    }
  }
}

function trimNumber(value: number) {
  return String(Number(value.toFixed(6)))
}

function checksum(data: Uint8Array) {
  let hash = 2166136261
  for (let i = 0; i < data.length; i++) {
    hash = Math.imul(hash ^ data[i], 16777619)
  }
  return (hash >>> 0).toString(16)
}

function base64(data: Uint8Array) {
  let binary = ''
  for (let i = 0; i < data.length; i += 0x8000) {
    binary += String.fromCharCode(...data.subarray(i, i + 0x8000))
  }
  return btoa(binary)
}

function normalizeAngle(a: number) {
  const r = a % TAU
  const n = r < 0 ? r + TAU : r
  return n >= TAU - 1e-12 ? 0 : n
}

function area2(a: Vec2, b: Vec2, c: Vec2) {
  return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
}

/**
 * Triangles covering polygons with holes (even-odd): holes are bridged into
 * their outer loop, then the polygon is ear-clipped.
 */
export function triangulate(loops: Vec2[][]): [Vec2, Vec2, Vec2][] {
  const rings = loops.filter(loop => loop.length >= 3)
  if (rings.length === 0) return []
  const signed = (ring: Vec2[]) => {
    let s = 0
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i]
      const b = ring[(i + 1) % ring.length]
      s += a[0] * b[1] - b[0] * a[1]
    }
    return s / 2
  }
  // The largest loop is the outer one; others are holes (other outer loops
  // are triangulated on their own).
  const sorted = [...rings].sort(
    (a, b) => Math.abs(signed(b)) - Math.abs(signed(a))
  )
  const outers: { ring: Vec2[]; holes: Vec2[][] }[] = []
  for (const ring of sorted) {
    const parent = outers.find(
      o =>
        pointInRing(ring[0], o.ring) &&
        !o.holes.some(h => pointInRing(ring[0], h))
    )
    if (parent) parent.holes.push(ring)
    else outers.push({ ring, holes: [] })
  }
  const triangles: [Vec2, Vec2, Vec2][] = []
  for (const { ring, holes } of outers) {
    let polygon = signed(ring) < 0 ? [...ring].reverse() : [...ring]
    for (const hole of holes.sort((a, b) => maxX(b) - maxX(a))) {
      polygon = bridge(polygon, signed(hole) > 0 ? [...hole].reverse() : hole)
    }
    earClip(polygon, triangles)
  }
  return triangles
}

function maxX(ring: Vec2[]) {
  return Math.max(...ring.map(p => p[0]))
}

function pointInRing(p: Vec2, ring: Vec2[]) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i]
    const b = ring[j]
    if (
      a[1] > p[1] !== b[1] > p[1] &&
      p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]
    ) {
      inside = !inside
    }
  }
  return inside
}

/** Joins a (clockwise) hole into a counter-clockwise polygon with a bridge edge. */
function bridge(polygon: Vec2[], hole: Vec2[]): Vec2[] {
  let hi = 0
  for (let i = 1; i < hole.length; i++) if (hole[i][0] > hole[hi][0]) hi = i
  const h = hole[hi]
  // Closest polygon vertex (preferably to the right) that the bridge can
  // reach without touching another edge.
  let best = -1
  let bestDistance = Infinity
  for (const rightOnly of [true, false]) {
    for (let i = 0; i < polygon.length; i++) {
      const p = polygon[i]
      if (rightOnly && p[0] < h[0]) continue
      const d = (p[0] - h[0]) ** 2 + (p[1] - h[1]) ** 2
      if (d >= bestDistance) continue
      if (crossesAny(h, p, polygon) || crossesAny(h, p, hole)) continue
      best = i
      bestDistance = d
    }
    if (best >= 0) break
  }
  if (best < 0) best = 0
  const rotatedHole = [...hole.slice(hi), ...hole.slice(0, hi), h]
  return [
    ...polygon.slice(0, best + 1),
    ...rotatedHole,
    polygon[best],
    ...polygon.slice(best + 1)
  ]
}

/** Whether segment a–b touches an edge of `ring` that does not end at a or b. */
function crossesAny(a: Vec2, b: Vec2, ring: Vec2[]) {
  for (let i = 0; i < ring.length; i++) {
    const c = ring[i]
    const d = ring[(i + 1) % ring.length]
    if (same(c, a) || same(c, b) || same(d, a) || same(d, b)) continue
    const d1 = area2(a, b, c)
    const d2 = area2(a, b, d)
    const d3 = area2(c, d, a)
    const d4 = area2(c, d, b)
    if (d1 * d2 <= 0 && d3 * d4 <= 0) {
      // Collinear but disjoint segments do not touch.
      if (d1 === 0 && d2 === 0 && !overlaps(a, b, c, d)) continue
      return true
    }
  }
  return false
}

function overlaps(a: Vec2, b: Vec2, c: Vec2, d: Vec2) {
  const axis = Math.abs(b[0] - a[0]) >= Math.abs(b[1] - a[1]) ? 0 : 1
  const [lo1, hi1] = [Math.min(a[axis], b[axis]), Math.max(a[axis], b[axis])]
  const [lo2, hi2] = [Math.min(c[axis], d[axis]), Math.max(c[axis], d[axis])]
  return lo1 <= hi2 && lo2 <= hi1
}

function same(p: Vec2, q: Vec2) {
  return p[0] === q[0] && p[1] === q[1]
}

function earClip(polygon: Vec2[], out: [Vec2, Vec2, Vec2][]) {
  const points = [...polygon]
  let guard = points.length * points.length + 10
  while (points.length > 3 && guard-- > 0) {
    let clipped = false
    for (let i = 0; i < points.length; i++) {
      const a = points[(i + points.length - 1) % points.length]
      const b = points[i]
      const c = points[(i + 1) % points.length]
      const area = area2(a, b, c)
      if (area <= 1e-14) {
        if (Math.abs(area) <= 1e-14) {
          // Collinear vertex: drop it.
          points.splice(i, 1)
          clipped = true
          break
        }
        continue
      }
      const blocked = points.some(
        p =>
          !same(p, a) &&
          !same(p, b) &&
          !same(p, c) &&
          area2(a, b, p) >= 0 &&
          area2(b, c, p) >= 0 &&
          area2(c, a, p) >= 0
      )
      if (blocked) continue
      out.push([a, b, c])
      points.splice(i, 1)
      clipped = true
      break
    }
    if (!clipped) break
  }
  if (
    points.length === 3 &&
    Math.abs(area2(points[0], points[1], points[2])) > 1e-14
  ) {
    out.push([points[0], points[1], points[2]])
  }
}
