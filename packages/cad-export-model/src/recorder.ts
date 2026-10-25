import {
  AcCmColor,
  AcCmTransparency,
  type AcGeArea2d,
  type AcGeCircArc3d,
  type AcGeEllipseArc3d,
  AcGeMatrix3d,
  type AcGePoint3d,
  type AcGePoint3dLike,
  AcGiContext,
  type AcGiEntity,
  type AcGiFontMapping,
  type AcGiHatchStyle,
  type AcGiImageStyle,
  type AcGiLineStyle,
  AcGiLineWeight,
  type AcGiMTextData,
  type AcGiPointStyle,
  type AcGiRenderer,
  type AcGiShapeData,
  type AcGiSubEntityTraits,
  type AcGiTextStyle
} from '@mlightcad/data-model'

import {
  type Affine,
  affineFromMatrix3d,
  apply,
  curvePoint,
  length,
  transformCurve,
  transformText
} from './geometry'
import type { ExportCurve, Vec2 } from './types'

/** Traits of a recorded primitive (copied when the primitive is drawn). */
export interface RecordedTraits {
  layer: string
  /** 0xRRGGBB. */
  rgb: number
  foreground: boolean
  lineType: AcGiLineStyle
  lineTypeScale: number
  lineWeight: number
}

export type RecordedPrimitive =
  | {
      kind: 'polyline'
      traits: RecordedTraits
      points: Vec2[]
      closed: boolean
    }
  | { kind: 'curve'; traits: RecordedTraits; curve: ExportCurve }
  | { kind: 'point'; traits: RecordedTraits; position: Vec2 }
  | {
      kind: 'area'
      traits: RecordedTraits
      loops: Vec2[][]
      fill: AcGiHatchStyle
    }
  | {
      kind: 'text'
      traits: RecordedTraits
      text: string
      position: Vec2
      height: number
      widthFactor: number
      rotation: number
      attachment: number
      font: string
    }

/**
 * Drawable produced by {@link AcExRecordingRenderer}: a list of primitives in
 * world coordinates. Block references draw through the shared rendering
 * cache, which clones templates and calls {@link applyMatrix}, so the
 * transform is applied to the stored geometry directly.
 */
export class AcExRecordedEntity implements AcGiEntity {
  objectId = ''
  ownerId = ''
  layerName = ''
  visible = true
  userData: object = {}
  primitives: RecordedPrimitive[]
  private children: AcExRecordedEntity[] = []

  constructor(primitives: RecordedPrimitive[] = []) {
    this.primitives = primitives
  }

  get childCount() {
    return this.children.length
  }

  addChild(child: AcGiEntity) {
    if (child instanceof AcExRecordedEntity) this.children.push(child)
  }

  applyMatrix(matrix: AcGeMatrix3d) {
    const t = affineFromMatrix3d(matrix.elements)
    this.primitives = this.primitives.map(p => transformPrimitive(t, p))
    for (const child of this.children) child.applyMatrix(matrix)
  }

  /** All primitives of this drawable and its children. */
  collect(out: RecordedPrimitive[] = []) {
    out.push(...this.primitives)
    for (const child of this.children) child.collect(out)
    return out
  }

  highlight() {}
  unhighlight() {}

  fastDeepClone(): AcExRecordedEntity {
    const clone = new AcExRecordedEntity(this.primitives)
    clone.objectId = this.objectId
    clone.ownerId = this.ownerId
    clone.layerName = this.layerName
    clone.visible = this.visible
    clone.userData = this.userData
    clone.children = this.children.map(c => c.fastDeepClone())
    return clone
  }
}

export function transformPrimitive(
  t: Affine,
  p: RecordedPrimitive
): RecordedPrimitive {
  switch (p.kind) {
    case 'polyline':
      return { ...p, points: p.points.map(q => apply(t, q)) }
    case 'curve':
      return { ...p, curve: transformCurve(t, p.curve) }
    case 'point':
      return { ...p, position: apply(t, p.position) }
    case 'area':
      return { ...p, loops: p.loops.map(loop => loop.map(q => apply(t, q))) }
    case 'text': {
      const placed = transformText(
        t,
        p.position,
        p.height,
        p.widthFactor,
        p.rotation
      )
      return { ...p, ...placed }
    }
  }
}

const xy = (p: AcGePoint3dLike): Vec2 => [p.x, p.y]

/**
 * Chooses the parameter range of `curve` that passes through `mid`, given
 * the parameters of the two end points.
 */
function arcRange(
  base: Omit<ExportCurve, 'start' | 'end'>,
  start: number,
  end: number,
  mid: Vec2
): ExportCurve {
  const TAU = Math.PI * 2
  let e = end
  while (e <= start + 1e-12) e += TAU
  const ccw = { ...base, start, end: e }
  const m = curvePoint(ccw, (start + e) / 2)
  if (
    Math.hypot(m[0] - mid[0], m[1] - mid[1]) <=
    1e-6 * Math.max(1, length(base.u))
  ) {
    return ccw
  }
  let s = start
  while (s <= end + 1e-12) s += TAU
  return { ...base, start: end, end: s }
}

/**
 * An {@link AcGiRenderer} that records what entities draw instead of
 * displaying it, in world coordinates of the block being drawn. Used for entities the exporters do not convert themselves
 * (dimensions, leaders, splines, tables, …).
 */
export class AcExRecordingRenderer implements AcGiRenderer<AcExRecordedEntity> {
  readonly subEntityTraits: AcGiSubEntityTraits
  readonly context: AcGiContext

  constructor(database?: unknown) {
    // A light background: ACI 7 resolves to black.
    this.context = AcGiContext.fromBackgroundColor(0xffffff, database)
    this.subEntityTraits = {
      color: new AcCmColor(),
      lineType: {
        type: 'ByLayer',
        name: 'Continuous',
        standardFlag: 0,
        description: '',
        totalPatternLength: 0
      } as AcGiLineStyle,
      lineTypeScale: 1,
      lineWeight: AcGiLineWeight.ByLayer,
      fillType: { solidFill: true, patternAngle: 0, definitionLines: [] },
      transparency: new AcCmTransparency(),
      thickness: 0,
      layer: '0',
      drawOrder: 0
    }
  }

  private traits(): RecordedTraits {
    const t = this.subEntityTraits
    const rgb = this.context.resolveSubEntityTraitsRgb(t)
    return {
      layer: t.layer,
      rgb,
      foreground:
        t.color.isForeground ||
        t.color.colorIndex === 7 ||
        rgb === 0 ||
        rgb === 0xffffff,
      lineType: t.lineType,
      lineTypeScale: t.lineTypeScale,
      lineWeight: t.lineWeight
    }
  }

  private add(primitive: RecordedPrimitive) {
    return new AcExRecordedEntity([primitive])
  }

  group(entities: AcExRecordedEntity[]) {
    const group = new AcExRecordedEntity()
    for (const entity of entities) group.addChild(entity)
    return group
  }

  point(point: AcGePoint3d, _style: AcGiPointStyle) {
    return this.add({
      kind: 'point',
      traits: this.traits(),
      position: xy(point)
    })
  }

  circularArc(arc: AcGeCircArc3d) {
    const n = arc.normal
    const ref = arc.refVec
    const sign = n.z < 0 ? -1 : 1
    const r = arc.radius
    const u: Vec2 = [ref.x * r, ref.y * r]
    // normal × ref, projected on the XY plane.
    const v: Vec2 = [-ref.y * r * sign, ref.x * r * sign]
    const base = { center: xy(arc.center), u, v }
    const curve =
      arc.closed || Math.abs(arc.deltaAngle) >= Math.PI * 2 - 1e-9
        ? { ...base, start: 0, end: Math.PI * 2 }
        : arcRange(base, arc.startAngle, arc.endAngle, xy(arc.midPoint))
    return this.add({ kind: 'curve', traits: this.traits(), curve })
  }

  ellipticalArc(arc: AcGeEllipseArc3d) {
    const major = arc.majorAxis.clone().normalize()
    const minor = arc.minorAxis.clone().normalize()
    const u: Vec2 = [
      major.x * arc.majorAxisRadius,
      major.y * arc.majorAxisRadius
    ]
    const v: Vec2 = [
      minor.x * arc.minorAxisRadius,
      minor.y * arc.minorAxisRadius
    ]
    const base = { center: xy(arc.center), u, v }
    const curve =
      arc.closed || Math.abs(arc.deltaAngle) >= Math.PI * 2 - 1e-9
        ? { ...base, start: 0, end: Math.PI * 2 }
        : arcRange(base, arc.startAngle, arc.endAngle, xy(arc.midPoint))
    return this.add({ kind: 'curve', traits: this.traits(), curve })
  }

  lines(points: AcGePoint3dLike[]) {
    return this.add({
      kind: 'polyline',
      traits: this.traits(),
      points: points.map(xy),
      closed: false
    })
  }

  lineSegments(array: Float32Array, itemSize: number, indices: Uint16Array) {
    const traits = this.traits()
    const group = new AcExRecordedEntity()
    for (let i = 0; i + 1 < indices.length; i += 2) {
      const a = indices[i] * itemSize
      const b = indices[i + 1] * itemSize
      group.primitives.push({
        kind: 'polyline',
        traits,
        points: [
          [array[a], array[a + 1]],
          [array[b], array[b + 1]]
        ],
        closed: false
      })
    }
    return group
  }

  area(area: AcGeArea2d) {
    const loops = area
      .tessellate()
      .map(loop => loop.map(p => [p.x, p.y] as Vec2))
      .filter(loop => loop.length >= 3)
    return this.add({
      kind: 'area',
      traits: this.traits(),
      loops,
      fill: { ...this.subEntityTraits.fillType }
    })
  }

  offsetRing(outer: AcGePoint3dLike[], inner: AcGePoint3dLike[]) {
    return this.add({
      kind: 'area',
      traits: this.traits(),
      loops: [outer.map(xy), inner.map(xy)],
      fill: { solidFill: true, patternAngle: 0, definitionLines: [] }
    })
  }

  mtext(mtext: AcGiMTextData, style: AcGiTextStyle) {
    const rotation =
      mtext.directionVector != null
        ? Math.atan2(mtext.directionVector.y, mtext.directionVector.x)
        : (mtext.rotation ?? 0)
    return this.add({
      kind: 'text',
      traits: this.traits(),
      text: mtext.text,
      position: xy(mtext.position),
      height: mtext.height,
      widthFactor: mtext.widthFactor ?? style.widthFactor ?? 1,
      rotation,
      attachment: mtext.attachmentPoint ?? 1,
      font: style.extendedFont || style.font || ''
    })
  }

  shape(_shape: AcGiShapeData, _style?: AcGiTextStyle) {
    return new AcExRecordedEntity()
  }

  image(_blob: Blob, _style: AcGiImageStyle) {
    return new AcExRecordedEntity()
  }

  setFontMapping(_mapping: AcGiFontMapping) {}
}
