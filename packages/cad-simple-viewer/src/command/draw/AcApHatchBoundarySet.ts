import {
  AcDb3dSolid,
  AcDbBlockReference,
  AcDbCircle,
  AcDbDatabase,
  AcDbEntity,
  AcDbFace,
  AcDbHatch,
  AcDbOle2Frame,
  AcDbPolyFaceMesh,
  AcDbPolygonMesh,
  AcDbPolyline,
  AcDbRasterImage,
  AcDbViewport,
  AcGeBoundaryEdgeType,
  AcGeCircArc2d,
  AcGeLine2d,
  AcGeLoop2d,
  AcGeLoop2dType,
  AcGeMatrix3d,
  AcGePolyline2d
} from '@mlightcad/data-model'

import {
  ACAP_HATCH_MAX_SEGMENTS,
  type AcApHatchBounds,
  acapHatchBounds,
  type AcApHatchPoint,
  type AcApHatchPolyline,
  acapHatchSignedArea
} from './AcApHatchBoundary'

/** One curve primitive as returned by `AcDbEntity.subGetIntersectCurves()`. */
type AcApCurvePrimitive = ReturnType<
  AcDbEntity['subGetIntersectCurves']
>[number]

/** Deepest block nesting followed when collecting curves. */
const MAX_BLOCK_DEPTH = 16

/** Upper bound on segments per curve when flattening. */
const MAX_CURVE_SEGMENTS = 1024

/**
 * The hatch boundary set: the curves HATCH traces boundaries from, flattened
 * to polylines, each remembering the top-level entity it came from.
 */
export interface AcApHatchBoundarySet {
  /** The curves, flattened. */
  polys: AcApHatchPolyline[]
  /** The top-level entity of each polyline. */
  owners: AcDbEntity[]
  /** Vertex merge tolerance. */
  tol: number
  /** Flattening tolerance; line ends this close to another curve are snapped onto it. */
  outlineTol: number
  /** Number of segments in {@link polys}. */
  segmentCount: number
}

/**
 * Objects that never bound a hatch: other hatches, images and wipeouts, OLE
 * frames, viewports and 3D objects. Text, mtext and dimensions give no curves.
 */
function isBoundaryCandidate(entity: AcDbEntity) {
  return !(
    entity instanceof AcDbHatch ||
    entity instanceof AcDbRasterImage ||
    entity instanceof AcDbOle2Frame ||
    entity instanceof AcDbViewport ||
    entity instanceof AcDb3dSolid ||
    entity instanceof AcDbPolyFaceMesh ||
    entity instanceof AcDbPolygonMesh ||
    entity instanceof AcDbFace
  )
}

/** Whether entities on `layerName` are shown (layer on, thawed and drawable). */
function isLayerShown(db: AcDbDatabase, layerName: string) {
  const layer = db.tables.layerTable.getAt(layerName)
  if (layer && (layer.isOff || layer.isFrozen)) return false
  try {
    return db.isLayerDrawable(layerName)
  } catch {
    return true
  }
}

/** Applies a column-major 4x4 matrix to a point (z = 0 afterwards). */
function transformPoint(
  p: { x: number; y: number; z?: number },
  m: AcGeMatrix3d | undefined
): AcApHatchPoint {
  if (!m) return { x: p.x, y: p.y }
  const e = m.elements
  const z = p.z ?? 0
  return {
    x: e[0] * p.x + e[4] * p.y + e[8] * z + e[12],
    y: e[1] * p.x + e[5] * p.y + e[9] * z + e[13]
  }
}

interface Piece {
  prim: AcApCurvePrimitive
  matrix?: AcGeMatrix3d
  owner: AcDbEntity
}

/**
 * Collects the curve primitives of one entity, expanding block references
 * (and their arrays) with nested layer "0" entities taking the reference's
 * layer.
 */
function collectPieces(
  db: AcDbDatabase,
  entity: AcDbEntity,
  owner: AcDbEntity,
  matrix: AcGeMatrix3d | undefined,
  inheritedLayer: string | undefined,
  checkVisibility: boolean,
  depth: number,
  out: Piece[]
) {
  if (checkVisibility && !entity.visibility) return
  const layer =
    inheritedLayer !== undefined && entity.layer === '0'
      ? inheritedLayer
      : entity.layer
  if (checkVisibility && !isLayerShown(db, layer)) return
  if (!isBoundaryCandidate(entity)) return

  if (entity instanceof AcDbBlockReference) {
    const record = entity.drawableBlockTableRecord
    if (!record || depth >= MAX_BLOCK_DEPTH) return
    const insert = new AcGeMatrix3d().multiplyMatrices(
      new AcGeMatrix3d().setFromExtrusionDirection(entity.normal),
      entity.blockTransform
    )
    const cols = Math.max(1, entity.columnCount)
    const rows = Math.max(1, entity.rowCount)
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const offset = new AcGeMatrix3d().makeTranslation(
          col * entity.columnSpacing,
          row * entity.rowSpacing,
          0
        )
        let full = new AcGeMatrix3d().multiplyMatrices(insert, offset)
        if (matrix) full = new AcGeMatrix3d().multiplyMatrices(matrix, full)
        for (const child of record.newIterator()) {
          collectPieces(
            db,
            child,
            owner,
            full,
            layer,
            checkVisibility,
            depth + 1,
            out
          )
        }
      }
    }
    return
  }

  let prims: AcApCurvePrimitive[]
  try {
    prims = entity.subGetIntersectCurves()
  } catch {
    return
  }
  for (const prim of prims) out.push({ prim, matrix, owner })
}

/** Flattens one primitive into a polyline in WCS. */
function flatten(
  piece: Piece,
  deviation: number,
  reach: number
): AcApHatchPolyline | undefined {
  const { prim, matrix } = piece
  // Deviation is asked in the block's own units.
  const scale = matrix ? Math.max(matrix.getMaxScaleOnAxis(), 1e-12) : 1
  const local = deviation / scale
  let pts: Array<{ x: number; y: number; z?: number }>
  switch (prim.kind) {
    case 'line': {
      const s = prim.line.startPoint
      const e = prim.line.endPoint
      if (prim.extent === 'bounded') {
        pts = [s, e]
        break
      }
      const len = Math.hypot(e.x - s.x, e.y - s.y)
      if (!(len > 0)) return undefined
      const r = reach / scale
      const dx = ((e.x - s.x) / len) * r
      const dy = ((e.y - s.y) / len) * r
      const back = prim.extent === 'ray' ? 0 : 1
      pts = [
        { x: s.x - dx * back, y: s.y - dy * back },
        { x: s.x + dx, y: s.y + dy }
      ]
      break
    }
    case 'circArc': {
      const r = prim.arc.radius
      pts = prim.arc.tessellate({
        deviation: Math.min(local, Math.max(r * 0.01, 1e-9)),
        maxSegments: MAX_CURVE_SEGMENTS
      })
      break
    }
    case 'ellipseArc': {
      const r = prim.arc.majorAxisRadius
      pts = prim.arc.tessellate({
        deviation: Math.min(local, Math.max(r * 0.01, 1e-9)),
        maxSegments: MAX_CURVE_SEGMENTS
      })
      break
    }
    case 'spline':
      pts = prim.spline.tessellate({
        deviation: local,
        maxSegments: MAX_CURVE_SEGMENTS
      })
      break
    default:
      return undefined
  }
  const out = pts.map(p => transformPoint(p, matrix))
  return out.length >= 2 ? out : undefined
}

/** Extents of the entities, from their geometric extents. */
function entityBounds(entities: ReadonlyArray<AcDbEntity>): AcApHatchBounds {
  const corners: AcApHatchPoint[] = []
  for (const entity of entities) {
    try {
      const box = entity.geometricExtents
      if (!box || box.isEmpty()) continue
      corners.push(
        { x: box.min.x, y: box.min.y },
        { x: box.max.x, y: box.max.y }
      )
    } catch {
      // Entities without extents add nothing.
    }
  }
  return acapHatchBounds(corners)
}

/**
 * Builds the boundary set from `entities` (top-level objects).
 *
 * @param checkVisibility - Skip hidden objects and objects on layers that are
 *   off or frozen (pick points); selected objects are used as they are.
 */
export function acapCollectHatchBoundarySet(
  db: AcDbDatabase,
  entities: Iterable<AcDbEntity>,
  checkVisibility = true
): AcApHatchBoundarySet {
  const pieces: Piece[] = []
  const tops: AcDbEntity[] = []
  for (const entity of entities) {
    const before = pieces.length
    collectPieces(
      db,
      entity,
      entity,
      undefined,
      undefined,
      checkVisibility,
      0,
      pieces
    )
    if (pieces.length > before) tops.push(entity)
  }
  let b = entityBounds(tops)
  if (!(b.minX <= b.maxX)) b = { minX: 0, minY: 0, maxX: 1, maxY: 1 }
  const size = Math.max(b.maxX - b.minX + (b.maxY - b.minY), 1e-9)
  const tol = Math.max(size * 1e-9, 1e-9)
  const outlineTol = size / 20000
  const reach = size * 4

  const polys: AcApHatchPolyline[] = []
  const owners: AcDbEntity[] = []
  let segmentCount = 0
  for (const piece of pieces) {
    const pl = flatten(piece, outlineTol, reach)
    if (!pl) continue
    polys.push(pl)
    owners.push(piece.owner)
    segmentCount += pl.length - 1
    // Past the limit the set is unusable anyway: stop flattening.
    if (segmentCount > ACAP_HATCH_MAX_SEGMENTS) break
  }
  return { polys, owners, tol, outlineTol, segmentCount }
}

/** Converts a closed polyline entity (keeping its arcs) into boundary edges. */
function polylineEdges(entity: AcDbPolyline): AcGeBoundaryEdgeType[] {
  if (!entity.closed || entity.numberOfVertices < 2) return []
  // Runtime polyline geometry keeps bulge data; typed API does not expose it.
  const runtimeVertices = (
    entity as unknown as {
      _geo?: { vertices?: Array<{ x: number; y: number; bulge?: number }> }
    }
  )._geo?.vertices
  const vertices =
    runtimeVertices && runtimeVertices.length > 1
      ? runtimeVertices.map(v => ({ x: v.x, y: v.y, bulge: v.bulge }))
      : Array.from({ length: entity.numberOfVertices }, (_, i) => {
          const p = entity.getPoint2dAt(i)
          return { x: p.x, y: p.y, bulge: 0 }
        })
  const edges: AcGeBoundaryEdgeType[] = []
  for (let i = 0; i < vertices.length; i++) {
    const start = vertices[i]
    const end = vertices[(i + 1) % vertices.length]
    const bulge = start.bulge ?? 0
    edges.push(
      Math.abs(bulge) > 1e-12
        ? new AcGeCircArc2d(start, end, bulge)
        : new AcGeLine2d(start, end)
    )
  }
  return edges
}

/**
 * The exact loop of a closed object (a circle, a closed polyline with its
 * arcs), or `undefined` when it has none.
 */
export function acapExactHatchLoop(entity: AcDbEntity): AcGeLoop2d | undefined {
  if (entity instanceof AcDbCircle) {
    const c = entity.center
    return new AcGeLoop2d([
      new AcGeCircArc2d(
        { x: c.x, y: c.y },
        entity.radius,
        0,
        Math.PI * 2,
        false
      )
    ])
  }
  if (entity instanceof AcDbPolyline) {
    const edges = polylineEdges(entity)
    return edges.length ? new AcGeLoop2d(edges) : undefined
  }
  return undefined
}

/**
 * The loop to store for a traced outline: the exact loop of the object when
 * the outline is the whole of one closed object, otherwise the outline itself.
 *
 * @param outline - The traced outline (counter-clockwise).
 * @param sources - Indices into `set.polys` that make up the outline.
 */
export function acapHatchLoopFor(
  set: AcApHatchBoundarySet,
  outline: AcApHatchPolyline,
  sources: ReadonlyArray<number>
): AcGeLoop2dType {
  const owners = new Set(sources.map(i => set.owners[i]))
  if (owners.size === 1) {
    const [owner] = owners
    const exact = acapExactHatchLoop(owner)
    if (exact) {
      const area = Math.abs(acapHatchSignedArea(exact.tessellate()))
      const traced = Math.abs(acapHatchSignedArea(outline))
      if (area > 0 && Math.abs(area - traced) <= area * 0.01) return exact
    }
  }
  return new AcGePolyline2d(
    outline.map(p => ({ x: p.x, y: p.y })),
    true
  )
}
