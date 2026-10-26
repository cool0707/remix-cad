import {
  AcDbEntity,
  AcDbLine,
  AcDbPolyline,
  AcGePoint3dLike
} from '@mlightcad/data-model'

/**
 * What dragging a grip does, so the handle can look different:
 *
 * - `point`: moves one point (a polyline vertex, a line end, …).
 * - `edge`: moves a whole segment, both ends together (a polyline segment
 *   midpoint, a line midpoint). `from` / `to` are the segment ends in WCS
 *   so the handle can lie along the segment.
 */
export type AcEdGripKind =
  | { kind: 'point' }
  | { kind: 'edge'; from: AcGePoint3dLike; to: AcGePoint3dLike }

const POINT_GRIP: AcEdGripKind = { kind: 'point' }

/**
 * Tells vertex grips from segment-midpoint grips.
 *
 * `AcDbPolyline` lists its vertices first and then, when `GRIPS` is `2`, one
 * midpoint per segment; dragging a midpoint moves both ends of that segment.
 * `AcDbLine` puts its midpoint (moves the whole line) at index `0`.
 *
 * @param entity - Entity that owns the grip.
 * @param gripIndex - Index into `entity.subGetGripPoints()`.
 */
export function acedGripKind(
  entity: AcDbEntity,
  gripIndex: number
): AcEdGripKind {
  if (entity instanceof AcDbPolyline) {
    const vertexCount = entity.numberOfVertices
    const segmentIndex = gripIndex - vertexCount
    if (segmentIndex < 0 || vertexCount < 2) return POINT_GRIP
    const segmentCount = entity.closed ? vertexCount : vertexCount - 1
    if (segmentIndex >= segmentCount) return POINT_GRIP
    return {
      kind: 'edge',
      from: entity.getPoint3dAt(segmentIndex),
      to: entity.getPoint3dAt((segmentIndex + 1) % vertexCount)
    }
  }
  if (entity instanceof AcDbLine && gripIndex === 0) {
    return { kind: 'edge', from: entity.startPoint, to: entity.endPoint }
  }
  return POINT_GRIP
}
