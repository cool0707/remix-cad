import {
  ACED_MIN_SCALE,
  acedBoxCorner,
  acedConstrainToAxis,
  acedCornerScaleFactor,
  acedGuideCandidates,
  acedNudgeStep,
  acedRadToDisplayDegrees,
  acedRotationAngle,
  acedSnapBoxToGuides} from '../src/editor/transform/AcEdTransformMath'

describe('acedNudgeStep', () => {
  it('rounds one pixel up to 1 / 2 / 5 × 10ⁿ', () => {
    expect(acedNudgeStep(1)).toBe(1)
    expect(acedNudgeStep(1.3)).toBe(2)
    expect(acedNudgeStep(3)).toBe(5)
    expect(acedNudgeStep(7)).toBe(10)
    expect(acedNudgeStep(0.03)).toBe(0.05)
    expect(acedNudgeStep(0.1)).toBe(0.1)
    expect(acedNudgeStep(42)).toBe(50)
  })

  it('falls back to 1 for invalid input', () => {
    expect(acedNudgeStep(0)).toBe(1)
    expect(acedNudgeStep(NaN)).toBe(1)
  })
})

describe('acedConstrainToAxis', () => {
  it('keeps the larger component', () => {
    expect(acedConstrainToAxis(5, -2)).toEqual({ x: 5, y: 0 })
    expect(acedConstrainToAxis(1, -3)).toEqual({ x: 0, y: -3 })
  })
})

describe('acedCornerScaleFactor', () => {
  const box = { minX: 0, minY: 0, maxX: 10, maxY: 5 }
  const base = acedBoxCorner(box, { x: 0, y: 0 })
  const corner = acedBoxCorner(box, { x: 1, y: 1 })

  it('projects the cursor on the diagonal', () => {
    expect(acedCornerScaleFactor(base, corner, { x: 20, y: 10 })).toBeCloseTo(2)
    // Off-diagonal cursor: projection keeps the aspect ratio.
    expect(acedCornerScaleFactor(base, corner, { x: 20, y: 0 })).toBeCloseTo(
      200 / 125
    )
  })

  it('does not mirror past the base point', () => {
    expect(acedCornerScaleFactor(base, corner, { x: -5, y: -5 })).toBe(
      ACED_MIN_SCALE
    )
  })

  it('works for a box without height (a horizontal line)', () => {
    expect(
      acedCornerScaleFactor({ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 5, y: 3 })
    ).toBeCloseTo(0.5)
  })

  it('returns undefined for an empty box', () => {
    expect(acedCornerScaleFactor(base, base, { x: 1, y: 1 })).toBeUndefined()
  })
})

describe('acedRotationAngle', () => {
  const center = { x: 0, y: 0 }

  it('measures the counter-clockwise angle', () => {
    expect(
      acedRotationAngle(center, { x: 1, y: 0 }, { x: 0, y: 1 })
    ).toBeCloseTo(Math.PI / 2)
    expect(
      acedRotationAngle(center, { x: 1, y: 0 }, { x: 0, y: -1 })
    ).toBeCloseTo(-Math.PI / 2)
  })

  it('snaps to the step with Shift', () => {
    const a = acedRotationAngle(
      center,
      { x: 1, y: 0 },
      { x: Math.cos(0.3), y: Math.sin(0.3) },
      15
    )
    expect(acedRadToDisplayDegrees(a)).toBeCloseTo(15)
  })
})

describe('acedSnapBoxToGuides', () => {
  const other = { minX: 100, minY: 0, maxX: 120, maxY: 20 }
  const candidates = acedGuideCandidates([other])
  const box = { minX: 0, minY: 50, maxX: 10, maxY: 60 }

  it('aligns the nearest edge within the threshold', () => {
    // Moved box: x 99.5..109.5 → its left edge is 0.5 from 100.
    const snap = acedSnapBoxToGuides(box, 99.5, 0, candidates, 4)
    expect(snap.dx).toBeCloseTo(100)
    expect(snap.dy).toBe(0)
    expect(snap.guides).toEqual([{ axis: 'x', value: 100, from: 0, to: 60 }])
  })

  it('aligns centers too', () => {
    // Moved center y = 55 + dy; other center y = 10.
    const snap = acedSnapBoxToGuides(box, 0, -44, candidates, 2)
    expect(snap.dy).toBeCloseTo(-45)
    expect(snap.guides[0]).toMatchObject({ axis: 'y', value: 10 })
  })

  it('leaves the displacement alone when nothing is near', () => {
    const snap = acedSnapBoxToGuides(box, 30, 0, candidates, 2)
    expect(snap).toEqual({ dx: 30, dy: 0, guides: [] })
  })
})
