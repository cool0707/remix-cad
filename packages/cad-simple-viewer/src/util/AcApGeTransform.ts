import { AcGeMatrix3d, AcGePoint3dLike } from '@mlightcad/data-model'

/**
 * Builds a world-space rotation matrix around a given base point.
 *
 * @param basePoint - Rotation origin.
 * @param angleRad - Rotation angle in radians.
 * @returns Composite transform that rotates around `basePoint`.
 */
export function createRotationMatrix(
  basePoint: AcGePoint3dLike,
  angleRad: number
) {
  return new AcGeMatrix3d()
    .makeTranslation(basePoint.x, basePoint.y, basePoint.z)
    .multiply(new AcGeMatrix3d().makeRotationZ(angleRad))
    .multiply(
      new AcGeMatrix3d().makeTranslation(
        -basePoint.x,
        -basePoint.y,
        -basePoint.z
      )
    )
}

/**
 * Builds a world-space uniform scale matrix around a base point.
 *
 * @param basePoint - Point that stays in place.
 * @param factor - Scale factor (> 0).
 */
export function createScaleMatrix(basePoint: AcGePoint3dLike, factor: number) {
  return new AcGeMatrix3d()
    .makeTranslation(basePoint.x, basePoint.y, basePoint.z)
    .multiply(new AcGeMatrix3d().makeScale(factor, factor, factor))
    .multiply(
      new AcGeMatrix3d().makeTranslation(
        -basePoint.x,
        -basePoint.y,
        -basePoint.z
      )
    )
}

/**
 * Builds a world-space reflection across the line through `p1` and `p2`
 * (in the XY plane). Returns the identity when the points coincide.
 */
export function createMirrorMatrix(p1: AcGePoint3dLike, p2: AcGePoint3dLike) {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  if (Math.hypot(dx, dy) < 1e-12) return new AcGeMatrix3d()
  const a = Math.atan2(dy, dx)
  const c = Math.cos(2 * a)
  const s = Math.sin(2 * a)
  // x' = R (x - p1) + p1
  const tx = p1.x - (c * p1.x + s * p1.y)
  const ty = p1.y - (s * p1.x - c * p1.y)
  return new AcGeMatrix3d().set(
    c, s, 0, tx,
    s, -c, 0, ty,
    0, 0, 1, 0,
    0, 0, 0, 1
  )
}
