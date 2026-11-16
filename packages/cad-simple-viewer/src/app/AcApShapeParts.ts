import {
  AcDb2dPolyline,
  AcDb3dPolyline,
  AcDbArc,
  AcDbAttribute,
  AcDbAttributeDefinition,
  AcDbBlockReference,
  AcDbBlockTableRecord,
  AcDbCircle,
  AcDbEllipse,
  AcDbEntity,
  AcDbHatch,
  AcDbLine,
  AcDbMText,
  AcDbPoint,
  AcDbPolyline,
  AcDbText
} from '@mlightcad/data-model'

import type {
  AcApShapePart,
  AcApShapePoint,
  AcApShapeTransform
} from './AcApShapeMatch'

/**
 * Breaks entities into the comparable parts of {@link AcApShapePart}, in
 * world XY (the drawing is compared as a plan; Z is not looked at).
 *
 * - A polyline gives one part per segment (a line or an arc), so it compares
 *   equal to the same lines drawn one by one (what EXPLODE makes of it).
 * - A symbol (block reference) gives the parts of its definition, placed
 *   where it is; nested symbols are opened too. Its properties (attributes)
 *   are left out: their values differ from one symbol to the next. Constant
 *   visible property definitions count as text, as EXPLODE draws them.
 * - Text compares its contents, insertion point and height.
 * - Other entities compare their grip points.
 */

const IDENTITY: AcApShapeTransform = { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 }

/** Deepest symbol nesting opened (a definition that contains itself stops). */
const MAX_DEPTH = 16

/** Number of points sampled on an elliptical arc. */
const ELLIPSE_ARC_POINTS = 5

/**
 * Parts of symbol definitions, in definition coordinates, by name. Reuse one
 * cache for one search: placing a symbol then only moves its parts.
 */
export type AcApShapePartCache = Map<string, AcApShapePart[]>

function point(p: { x: number; y: number }): AcApShapePoint {
  return { x: p.x, y: p.y }
}

function same(p: AcApShapePoint, q: AcApShapePoint) {
  return p.x === q.x && p.y === q.y
}

function lineOrPoint(p: AcApShapePoint, q: AcApShapePoint): AcApShapePart {
  if (same(p, q)) return { kind: 'point', points: [p], order: 'fixed' }
  return { kind: 'line', points: [p, q], order: 'reversible' }
}

/** Geometry behind an arc / ellipse entity (points in world coordinates). */
interface AcApCurveGeometry {
  startPoint: AcApShapePoint
  endPoint: AcApShapePoint
  midPoint: AcApShapePoint
  getPointAtAngle?: (angle: number) => AcApShapePoint
  startAngle: number
  endAngle: number
}

function curveGeometry(entity: AcDbEntity): AcApCurveGeometry | undefined {
  return (entity as unknown as { _geo?: AcApCurveGeometry })._geo
}

/**
 * Start, middle and end of an arc. Taken from its geometry: the entity's
 * angles are measured from a reference direction that turns with the arc.
 */
function arcPart(entity: AcDbArc): AcApShapePart | undefined {
  if (!(entity.radius > 0)) return undefined
  const geo = curveGeometry(entity)
  if (!geo) return undefined
  return {
    kind: 'arc',
    points: [point(geo.startPoint), point(geo.midPoint), point(geo.endPoint)],
    order: 'reversible'
  }
}

/** A polyline segment from `p` to `q` with a bulge (0 = straight). */
function bulgePart(
  p: AcApShapePoint,
  q: AcApShapePoint,
  bulge: number
): AcApShapePart | undefined {
  if (same(p, q)) return undefined
  if (!bulge) return lineOrPoint(p, q)
  const dx = q.x - p.x
  const dy = q.y - p.y
  const chord = Math.hypot(dx, dy)
  // The arc's middle is off the chord's middle by the sagitta, to the right
  // of p → q for a positive (counter-clockwise) bulge.
  const sagitta = (bulge * chord) / 2
  const nx = -dy / chord
  const ny = dx / chord
  const mid = {
    x: (p.x + q.x) / 2 - nx * sagitta,
    y: (p.y + q.y) / 2 - ny * sagitta
  }
  return { kind: 'arc', points: [p, mid, q], order: 'reversible' }
}

function polylineParts(
  vertices: { x: number; y: number; bulge: number }[],
  closed: boolean
): AcApShapePart[] {
  const parts: AcApShapePart[] = []
  const n = vertices.length
  if (n === 1)
    return [{ kind: 'point', points: [point(vertices[0])], order: 'fixed' }]
  const count = closed ? n : n - 1
  for (let i = 0; i < count; i++) {
    const v = vertices[i]
    const w = vertices[(i + 1) % n]
    const part = bulgePart(point(v), point(w), v.bulge)
    if (part) parts.push(part)
  }
  return parts
}

function lightweightVertices(entity: AcDbPolyline) {
  const runtime = (
    entity as unknown as {
      _geo?: { vertices?: Array<{ x: number; y: number; bulge?: number }> }
    }
  )._geo?.vertices
  if (runtime && runtime.length === entity.numberOfVertices) {
    return runtime.map(v => ({ x: v.x, y: v.y, bulge: v.bulge ?? 0 }))
  }
  return Array.from({ length: entity.numberOfVertices }, (_, i) => {
    const p = entity.getPoint2dAt(i)
    return { x: p.x, y: p.y, bulge: 0 }
  })
}

function ellipseParts(entity: AcDbEllipse): AcApShapePart[] {
  const geo = curveGeometry(entity)
  if (!geo?.getPointAtAngle) return []
  const at = (angle: number) => point(geo.getPointAtAngle!(angle))
  let sweep = (geo.endAngle - geo.startAngle) % (Math.PI * 2)
  if (sweep <= 1e-12) sweep += Math.PI * 2
  if (Math.abs(sweep - Math.PI * 2) < 1e-9) {
    return [
      {
        kind: 'ellipse',
        points: [0, 1, 2, 3].map(i => at((i * Math.PI) / 2)),
        order: 'cyclic'
      }
    ]
  }
  const points: AcApShapePoint[] = []
  for (let i = 0; i < ELLIPSE_ARC_POINTS; i++) {
    points.push(at(geo.startAngle + (sweep * i) / (ELLIPSE_ARC_POINTS - 1)))
  }
  return [{ kind: 'ellipse-arc', points, order: 'reversible' }]
}

function textPart(
  contents: string,
  at: { x: number; y: number },
  height: number
) {
  return {
    kind: `text:${contents}`,
    points: [point(at)],
    order: 'fixed',
    size: height
  } satisfies AcApShapePart
}

function gripParts(entity: AcDbEntity, kind: string): AcApShapePart[] {
  let points: { x: number; y: number }[] = []
  try {
    const hatch = entity as unknown as {
      collectBoundaryGripPoints?: () => { x: number; y: number }[]
    }
    points =
      entity instanceof AcDbHatch && hatch.collectBoundaryGripPoints
        ? hatch.collectBoundaryGripPoints()
        : entity.subGetGripPoints()
  } catch {
    return []
  }
  const finite = points
    .filter(p => Number.isFinite(p.x) && Number.isFinite(p.y))
    .map(point)
  if (!finite.length) return []
  return [{ kind, points: finite, order: 'any' }]
}

/** Transform of a placed symbol, from its definition to the drawing (XY). */
export function acapBlockReferenceShapeTransform(
  ref: AcDbBlockReference
): AcApShapeTransform {
  const e = ref.blockTransform.elements
  const t = { a: e[0], b: e[1], c: e[4], d: e[5], tx: e[12], ty: e[13] }
  // A symbol seen from below (normal -Z) is mirrored in X.
  if ((ref.normal?.z ?? 1) < 0) {
    return { a: -t.a, b: t.b, c: -t.c, d: t.d, tx: -t.tx, ty: t.ty }
  }
  return t
}

/** Moves parts with a transform (sizes scale with it). */
export function acapTransformShapeParts(
  parts: AcApShapePart[],
  t: AcApShapeTransform
): AcApShapePart[] {
  const scale = Math.sqrt(Math.abs(t.a * t.d - t.b * t.c))
  const move = (p: AcApShapePoint) => ({
    x: t.a * p.x + t.c * p.y + t.tx,
    y: t.b * p.x + t.d * p.y + t.ty
  })
  return parts.map(part => ({
    kind: part.kind,
    points: part.points.map(move),
    order: part.order,
    ...(part.size != null ? { size: part.size * scale } : {})
  }))
}

function blockParts(
  record: AcDbBlockTableRecord,
  cache: AcApShapePartCache,
  depth: number
): AcApShapePart[] {
  const key = record.name
  const cached = cache.get(key)
  if (cached) return cached
  // Mark it while reading: a definition that contains itself gives nothing.
  cache.set(key, [])
  const parts: AcApShapePart[] = []
  for (const child of record.newIterator()) {
    if (child instanceof AcDbAttributeDefinition) {
      if (child.isConst && !child.isInvisible && child.textString) {
        parts.push(textPart(child.textString, child.position, child.height))
      }
      continue
    }
    parts.push(...entityParts(child, cache, depth + 1))
  }
  cache.set(key, parts)
  return parts
}

function entityParts(
  entity: AcDbEntity,
  cache: AcApShapePartCache,
  depth: number
): AcApShapePart[] {
  if (depth > MAX_DEPTH) return []
  if (entity instanceof AcDbBlockReference) {
    const record = entity.blockTableRecord
    if (!record) return []
    const inner = blockParts(record, cache, depth)
    if (!inner.length) return []
    const base = acapBlockReferenceShapeTransform(entity)
    const cols = Math.max(1, entity.columnCount || 1)
    const rows = Math.max(1, entity.rowCount || 1)
    if (cols === 1 && rows === 1) return acapTransformShapeParts(inner, base)
    const out: AcApShapePart[] = []
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const dx = col * (entity.columnSpacing || 0)
        const dy = row * (entity.rowSpacing || 0)
        out.push(
          ...acapTransformShapeParts(inner, {
            ...base,
            tx: base.a * dx + base.c * dy + base.tx,
            ty: base.b * dx + base.d * dy + base.ty
          })
        )
      }
    }
    return out
  }
  if (
    entity instanceof AcDbAttributeDefinition ||
    entity instanceof AcDbAttribute
  ) {
    return []
  }
  if (entity instanceof AcDbLine) {
    return [lineOrPoint(point(entity.startPoint), point(entity.endPoint))]
  }
  if (entity instanceof AcDbArc) {
    const part = arcPart(entity)
    return part ? [part] : []
  }
  if (entity instanceof AcDbCircle) {
    if (!(entity.radius > 0)) return []
    return [
      {
        kind: 'circle',
        points: [point(entity.center)],
        order: 'fixed',
        size: entity.radius
      }
    ]
  }
  if (entity instanceof AcDbEllipse) return ellipseParts(entity)
  if (entity instanceof AcDbPolyline) {
    return polylineParts(lightweightVertices(entity), entity.closed)
  }
  if (entity instanceof AcDb2dPolyline) {
    const vertices = Array.from({ length: entity.numberOfVertices }, (_, i) => {
      const p = entity.getPointAt(i)
      return { x: p.x, y: p.y, bulge: entity.getBulgeAt(i) }
    })
    return polylineParts(vertices, entity.closed)
  }
  if (entity instanceof AcDb3dPolyline) {
    const vertices = Array.from({ length: entity.numberOfVertices }, (_, i) => {
      const p = entity.getPointAt(i)
      return { x: p.x, y: p.y, bulge: 0 }
    })
    return polylineParts(vertices, entity.closed)
  }
  if (entity instanceof AcDbText) {
    if (!entity.textString) return []
    return [textPart(entity.textString, entity.position, entity.height)]
  }
  if (entity instanceof AcDbMText) {
    if (!entity.contents) return []
    return [textPart(entity.contents, entity.location, entity.height)]
  }
  if (entity instanceof AcDbPoint) {
    return [{ kind: 'point', points: [point(entity.position)], order: 'fixed' }]
  }
  if (entity instanceof AcDbHatch) {
    return gripParts(entity, `hatch:${entity.patternName ?? ''}`)
  }
  return gripParts(entity, `grip:${entity.type}`)
}

/**
 * Comparable parts of an entity, in world XY.
 *
 * @param entity - Entity to break down.
 * @param cache - Parts of symbol definitions, shared during one search.
 * @returns Its parts; none for entities that are not compared (symbol
 *   properties, empty text, entities without points).
 */
export function acapShapePartsOf(
  entity: AcDbEntity,
  cache: AcApShapePartCache = new Map()
): AcApShapePart[] {
  try {
    return entityParts(entity, cache, 0)
  } catch {
    return []
  }
}

/** The identity transform. */
export const ACAP_SHAPE_IDENTITY: Readonly<AcApShapeTransform> = IDENTITY
