/**
 * Pure helpers for the simple profile's direct manipulation: drag move,
 * arrow-key nudge, bounding-box scale / rotate and alignment guides.
 *
 * Everything here works in world (WCS) units and has no DOM or database
 * access, so it can be unit tested.
 */

/** Axis-aligned box in WCS. */
export interface AcEdBox {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

export interface AcEdXY {
  x: number
  y: number
}

/**
 * Arrow-key nudge distance: the smallest 1 / 2 / 5 × 10ⁿ that is at least
 * one screen pixel at the current zoom, so a nudge is always visible and
 * lands on round numbers.
 *
 * @param unitsPerPixel - Drawing units covered by one screen pixel.
 */
export function acedNudgeStep(unitsPerPixel: number): number {
  if (!(unitsPerPixel > 0) || !Number.isFinite(unitsPerPixel)) return 1
  const exponent = Math.floor(Math.log10(unitsPerPixel))
  const base = Math.pow(10, exponent)
  for (const mantissa of [1, 2, 5, 10]) {
    const step = mantissa * base
    // Tolerance for floating point (log10(0.3) etc.).
    if (step >= unitsPerPixel * (1 - 1e-9)) return roundSignificant(step)
  }
  return roundSignificant(10 * base)
}

function roundSignificant(value: number) {
  return Number(value.toPrecision(12))
}

/**
 * Keeps only the larger component of a drag (Shift: move horizontally or
 * vertically only).
 */
export function acedConstrainToAxis(dx: number, dy: number): AcEdXY {
  return Math.abs(dx) >= Math.abs(dy) ? { x: dx, y: 0 } : { x: 0, y: dy }
}

/** Corner of a box: 0 = min side, 1 = max side. */
export interface AcEdCorner {
  x: 0 | 1
  y: 0 | 1
}

/** WCS position of a box corner. */
export function acedBoxCorner(box: AcEdBox, corner: AcEdCorner): AcEdXY {
  return {
    x: corner.x === 0 ? box.minX : box.maxX,
    y: corner.y === 0 ? box.minY : box.maxY
  }
}

/** Center of a box. */
export function acedBoxCenter(box: AcEdBox): AcEdXY {
  return { x: (box.minX + box.maxX) / 2, y: (box.minY + box.maxY) / 2 }
}

/** Smallest scale factor a corner drag may produce (no flipping). */
export const ACED_MIN_SCALE = 1e-3

/**
 * Uniform scale factor for dragging a corner handle.
 *
 * The cursor is projected onto the line from `base` to the dragged corner,
 * so the box keeps its aspect ratio (CAD entities such as circles, text and
 * symbols cannot be stretched in one direction). Factors are clamped to
 * {@link ACED_MIN_SCALE}: dragging past the base point does not mirror.
 *
 * @param base - Fixed point: the opposite corner, or the center with Alt.
 * @param corner - Corner being dragged, at drag start.
 * @param cursor - Current cursor position.
 * @returns Scale factor, or `undefined` when the box has no size.
 */
export function acedCornerScaleFactor(
  base: AcEdXY,
  corner: AcEdXY,
  cursor: AcEdXY
): number | undefined {
  const vx = corner.x - base.x
  const vy = corner.y - base.y
  const lengthSq = vx * vx + vy * vy
  if (!(lengthSq > 0)) return undefined
  const factor =
    ((cursor.x - base.x) * vx + (cursor.y - base.y) * vy) / lengthSq
  if (!Number.isFinite(factor)) return undefined
  return Math.max(ACED_MIN_SCALE, factor)
}

/**
 * Rotation angle (radians, counter-clockwise) from dragging a rotate handle
 * around `center`.
 *
 * @param snapDegrees - When set (Shift), the angle snaps to this step.
 */
export function acedRotationAngle(
  center: AcEdXY,
  start: AcEdXY,
  current: AcEdXY,
  snapDegrees?: number
): number {
  const a0 = Math.atan2(start.y - center.y, start.x - center.x)
  const a1 = Math.atan2(current.y - center.y, current.x - center.x)
  let angle = a1 - a0
  // Normalize to (-π, π].
  while (angle <= -Math.PI) angle += 2 * Math.PI
  while (angle > Math.PI) angle -= 2 * Math.PI
  if (snapDegrees && snapDegrees > 0) {
    const step = (snapDegrees * Math.PI) / 180
    angle = Math.round(angle / step) * step
  }
  return angle
}

/** Angle in degrees for display, normalized to (-180, 180]. */
export function acedRadToDisplayDegrees(angle: number): number {
  let deg = (angle * 180) / Math.PI
  while (deg <= -180) deg += 360
  while (deg > 180) deg -= 360
  return Math.abs(deg) < 1e-9 ? 0 : deg
}

/* ===================== alignment guides ===================== */

/**
 * A line other geometry can align to: `value` is the X (vertical guide) or
 * Y (horizontal guide); `from` / `to` is the extent along the guide.
 */
export interface AcEdGuideCandidate {
  value: number
  from: number
  to: number
}

/** Guide lines collected from the boxes of other entities. */
export interface AcEdGuideCandidates {
  xs: AcEdGuideCandidate[]
  ys: AcEdGuideCandidate[]
}

/** A guide shown on screen: a vertical (`axis: 'x'`) or horizontal line. */
export interface AcEdGuideLine {
  axis: 'x' | 'y'
  value: number
  from: number
  to: number
}

export interface AcEdGuideSnap {
  /** Adjusted displacement */
  dx: number
  dy: number
  guides: AcEdGuideLine[]
}

/**
 * Builds alignment candidates (left / center / right, bottom / middle / top)
 * from entity boxes.
 */
export function acedGuideCandidates(
  boxes: Iterable<AcEdBox>
): AcEdGuideCandidates {
  const xs: AcEdGuideCandidate[] = []
  const ys: AcEdGuideCandidate[] = []
  for (const box of boxes) {
    const center = acedBoxCenter(box)
    for (const x of [box.minX, center.x, box.maxX]) {
      xs.push({ value: x, from: box.minY, to: box.maxY })
    }
    for (const y of [box.minY, center.y, box.maxY]) {
      ys.push({ value: y, from: box.minX, to: box.maxX })
    }
  }
  return { xs, ys }
}

/**
 * Snaps a box moved by (`dx`, `dy`) so that its left / center / right edge
 * lines up with the nearest X candidate, and its bottom / middle / top with
 * the nearest Y candidate, when they are within `threshold`.
 *
 * Returns the adjusted displacement and the guides to draw. A guide spans
 * the moved box and every candidate box that lies on the same line.
 */
export function acedSnapBoxToGuides(
  box: AcEdBox,
  dx: number,
  dy: number,
  candidates: AcEdGuideCandidates,
  threshold: number
): AcEdGuideSnap {
  const moved: AcEdBox = {
    minX: box.minX + dx,
    minY: box.minY + dy,
    maxX: box.maxX + dx,
    maxY: box.maxY + dy
  }
  const center = acedBoxCenter(moved)
  const snapX = nearest(
    [moved.minX, center.x, moved.maxX],
    candidates.xs,
    threshold
  )
  const snapY = nearest(
    [moved.minY, center.y, moved.maxY],
    candidates.ys,
    threshold
  )

  const outDx = dx + (snapX?.offset ?? 0)
  const outDy = dy + (snapY?.offset ?? 0)
  const guides: AcEdGuideLine[] = []
  const tol = Math.max(threshold * 1e-6, 1e-9)

  if (snapX) {
    const finalMinY = box.minY + outDy
    const finalMaxY = box.maxY + outDy
    guides.push(
      spanGuide('x', snapX.value, finalMinY, finalMaxY, candidates.xs, tol)
    )
  }
  if (snapY) {
    const finalMinX = box.minX + outDx
    const finalMaxX = box.maxX + outDx
    guides.push(
      spanGuide('y', snapY.value, finalMinX, finalMaxX, candidates.ys, tol)
    )
  }
  return { dx: outDx, dy: outDy, guides }
}

function nearest(
  features: number[],
  candidates: AcEdGuideCandidate[],
  threshold: number
): { value: number; offset: number } | undefined {
  let best: { value: number; offset: number } | undefined
  for (const feature of features) {
    for (const candidate of candidates) {
      const offset = candidate.value - feature
      if (Math.abs(offset) > threshold) continue
      if (!best || Math.abs(offset) < Math.abs(best.offset)) {
        best = { value: candidate.value, offset }
      }
    }
  }
  return best
}

function spanGuide(
  axis: 'x' | 'y',
  value: number,
  from: number,
  to: number,
  candidates: AcEdGuideCandidate[],
  tol: number
): AcEdGuideLine {
  let min = from
  let max = to
  for (const candidate of candidates) {
    if (Math.abs(candidate.value - value) > tol) continue
    min = Math.min(min, candidate.from)
    max = Math.max(max, candidate.to)
  }
  return { axis, value, from: min, to: max }
}
