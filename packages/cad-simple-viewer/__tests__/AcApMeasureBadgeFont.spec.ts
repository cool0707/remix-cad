/** @jest-environment jsdom */

import {
  ACAP_MEASURE_BADGE_HEIGHT_EM,
  acapClampMeasureBadgeFontSize,
  acapEstimateMeasureBadgeWidthPx,
  acapMeasureBadgeChromePx,
  acapMeasureBadgeOverflowsSegment,
  acapScaleMeasureOverlayPx,
  acapScreenAngleBadgeRefLengthPx,
  acapScreenArcLengthPx,
  acapScreenAreaBadgeRefLengthPx,
  acapSegmentMeasureBadgeFontSize,
  acapSegmentMeasureBadgeWorld
} from '../src/util/AcApMeasureBadgeFont'

const originalGetContext = HTMLCanvasElement.prototype.getContext

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn(() => null)
})

afterAll(() => {
  HTMLCanvasElement.prototype.getContext = originalGetContext
})

describe('acapClampMeasureBadgeFontSize', () => {
  it('keeps the preferred size when the capsule fits in half the segment', () => {
    const text = '12.34'
    const fontSize = 13
    const width = acapEstimateMeasureBadgeWidthPx(text, fontSize)
    const linePx = width * 2 + 20
    expect(acapClampMeasureBadgeFontSize(text, fontSize, linePx)).toBe(fontSize)
  })

  it('shrinks the font so the capsule is at most half the segment', () => {
    const text = '1234.567 m'
    const fontSize = 24
    const preferredWidth = acapEstimateMeasureBadgeWidthPx(text, fontSize)
    const linePx = preferredWidth * 0.6
    const clamped = acapClampMeasureBadgeFontSize(text, fontSize, linePx)
    expect(clamped).toBeLessThan(fontSize)
    const clampedWidth = acapEstimateMeasureBadgeWidthPx(text, clamped)
    expect(clampedWidth).toBeLessThanOrEqual(linePx * 0.5 + 0.5)
  })

  it('scales capsule chrome with font size', () => {
    const at13 = acapMeasureBadgeChromePx(13)
    const at6_5 = acapMeasureBadgeChromePx(6.5)
    expect(at6_5).toBeLessThan(at13)
    expect(at6_5).toBeCloseTo(at13 / 2, 5)
  })

  it('returns a minimal size when the segment is empty', () => {
    expect(acapClampMeasureBadgeFontSize('1', 13, 0.5)).toBe(1)
  })
})

describe('acapScaleMeasureOverlayPx', () => {
  it('scales arrows with the font clamp ratio', () => {
    expect(acapScaleMeasureOverlayPx(12, 13, 13)).toBe(12)
    expect(acapScaleMeasureOverlayPx(12, 13, 6.5)).toBeCloseTo(6, 5)
  })
})

const identity = (p: { x: number; y: number }) => p

describe('acap screen badge reference lengths', () => {
  it('uses half the shorter angle arm (arc radius)', () => {
    expect(
      acapScreenAngleBadgeRefLengthPx(
        identity,
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 0, y: 40 }
      )
    ).toBe(20)
  })

  it('scales arc length by screen radius ratio', () => {
    const worldToScreen = (p: { x: number; y: number }) => ({
      x: p.x * 2,
      y: p.y * 2
    })
    expect(
      acapScreenArcLengthPx(worldToScreen, { x: 0, y: 0 }, 10, Math.PI * 10)
    ).toBeCloseTo(Math.PI * 20, 5)
  })

  it('uses the shorter of min edge and twice centroid-to-edge for area', () => {
    const square = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ]
    // Centroid is (50,50); nearest edge distance is 50; 2× = 100; min edge = 100.
    expect(acapScreenAreaBadgeRefLengthPx(identity, square)).toBe(100)
  })
})

describe('acapSegmentMeasureBadgeFontSize', () => {
  const style = { fontSize: 13, textHeightMode: 'adaptive' as const }

  it('shrinks slightly to stay on a moderately short segment', () => {
    const text = '12.34'
    const full = acapEstimateMeasureBadgeWidthPx(text, 13)
    const size = acapSegmentMeasureBadgeFontSize(text, style, full * 2 * 0.9)
    expect(size.fontSize).toBeLessThan(13)
    expect(size.fontSize).toBe(size.fitFontSize)
  })

  it('keeps the preferred size once the fit would be too small to read', () => {
    const size = acapSegmentMeasureBadgeFontSize('1234.56', style, 20)
    expect(size.fontSize).toBe(13)
    expect(size.fitFontSize).toBeLessThan(13 * 0.75)
  })

  it('leaves custom heights alone', () => {
    const size = acapSegmentMeasureBadgeFontSize(
      '1234.56',
      { fontSize: 13, textHeightMode: 'custom' },
      20
    )
    expect(size).toEqual({ fontSize: 13, fitFontSize: 13 })
  })
})

describe('acapMeasureBadgeOverflowsSegment', () => {
  it('is false for a capsule clamped to the line limit', () => {
    const text = '12.34'
    const linePx = 40
    const clamped = acapClampMeasureBadgeFontSize(text, 13, linePx)
    expect(acapMeasureBadgeOverflowsSegment(text, clamped, linePx)).toBe(false)
    expect(acapMeasureBadgeOverflowsSegment(text, 13, linePx)).toBe(true)
  })
})

describe('acapSegmentMeasureBadgeWorld', () => {
  it('stays on the midpoint when on the line', () => {
    expect(
      acapSegmentMeasureBadgeWorld({ x: 0, y: 0 }, { x: 4, y: 2 }, '1', 1, false)
    ).toEqual({ x: 2, y: 1 })
  })

  it('moves above a horizontal segment, clearing half the capsule height', () => {
    const p = acapSegmentMeasureBadgeWorld(
      { x: 4, y: 0 },
      { x: 0, y: 0 },
      '12.34',
      2,
      true
    )
    expect(p.x).toBeCloseTo(2)
    expect(p.y).toBeGreaterThan((ACAP_MEASURE_BADGE_HEIGHT_EM / 2) * 2)
  })

  it('moves right of a vertical segment, clearing half the capsule width', () => {
    const text = '12.34'
    const p = acapSegmentMeasureBadgeWorld(
      { x: 0, y: 0 },
      { x: 0, y: 4 },
      text,
      1,
      true
    )
    expect(p.y).toBeCloseTo(2)
    expect(p.x).toBeGreaterThan(acapEstimateMeasureBadgeWidthPx(text, 100) / 200)
  })
})
