import { AcGeMatrix3d, AcGePoint3d, AcGeVector3d } from '@mlightcad/data-model'

/** The parts of a block reference that place its contents. */
export interface AcApSymbolPlacement {
  /** INSERT transform in its object coordinate system (see data-model). */
  blockTransform: AcGeMatrix3d
  /** Extrusion direction of the INSERT. */
  normal: AcGeVector3d
}

/** How far the dimmed colour moves from the background (0 = invisible). */
const DIM_CONTRAST = 0.4

/** Relative tolerance when comparing the axes of a symbol's transform. */
const AXIS_TOLERANCE = 1e-9

/**
 * Transform from the coordinates of a symbol's definition to the drawing,
 * as the definition contents are shown while the symbol is edited in place.
 *
 * A symbol placed with one scale and not mirrored is edited exactly where
 * it stands (the transform is the INSERT's own). Entities cannot be
 * stretched one way or mirrored and brought back unchanged, so a symbol
 * placed with different X / Y scales or mirrored is shown at its insertion
 * point with its rotation and X scale only.
 *
 * @returns The transform, or `undefined` when the symbol has no size
 *   (zero scale) or is tilted out of the drawing plane.
 */
export function acapSymbolEditTransform(
  placement: AcApSymbolPlacement
): AcGeMatrix3d | undefined {
  const full = new AcGeMatrix3d().multiplyMatrices(
    new AcGeMatrix3d().setFromExtrusionDirection(placement.normal),
    placement.blockTransform
  )
  const origin = new AcGePoint3d(0, 0, 0).applyMatrix4(full)
  const xPoint = new AcGePoint3d(1, 0, 0).applyMatrix4(full)
  const yPoint = new AcGePoint3d(0, 1, 0).applyMatrix4(full)
  const x = { x: xPoint.x - origin.x, y: xPoint.y - origin.y }
  const y = { x: yPoint.x - origin.x, y: yPoint.y - origin.y }
  const xLength = Math.hypot(x.x, x.y)
  const yLength = Math.hypot(y.x, y.y)
  if (!(xLength > 0) || !(yLength > 0)) return undefined
  if (![origin.x, origin.y, xLength, yLength].every(Number.isFinite)) {
    return undefined
  }
  // Tilted out of the plane: an axis leaves it.
  const tilt = Math.max(
    Math.abs(xPoint.z - origin.z),
    Math.abs(yPoint.z - origin.z)
  )
  if (tilt > AXIS_TOLERANCE * Math.max(xLength, yLength)) return undefined

  const scale = Math.max(xLength, yLength)
  const cross = x.x * y.y - x.y * y.x
  const dot = x.x * y.x + x.y * y.y
  const exact =
    cross > 0 &&
    Math.abs(xLength - yLength) <= AXIS_TOLERANCE * scale &&
    Math.abs(dot) <= AXIS_TOLERANCE * xLength * yLength
  if (exact) return full

  return new AcGeMatrix3d()
    .makeTranslation(origin.x, origin.y, 0)
    .multiply(new AcGeMatrix3d().makeRotationZ(Math.atan2(x.y, x.x)))
    .multiply(new AcGeMatrix3d().makeScale(xLength, xLength, xLength))
}

/**
 * Colour of everything outside the symbol being edited: the background with
 * a little of the opposite (white on dark, black on light) mixed in, so the
 * surroundings stay readable but clearly step back.
 *
 * @param background - Canvas background as 0xRRGGBB.
 */
export function acapSymbolEditDimColor(background: number): number {
  const r = (background >> 16) & 0xff
  const g = (background >> 8) & 0xff
  const b = background & 0xff
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  const toward = luminance < 0.5 ? 255 : 0
  const mix = (channel: number) =>
    Math.round(channel + (toward - channel) * DIM_CONTRAST)
  return (mix(r) << 16) | (mix(g) << 8) | mix(b)
}
