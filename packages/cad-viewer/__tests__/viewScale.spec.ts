import {
  formatViewScale,
  MM_PER_CSS_PIXEL,
  viewScaleFromWorldPerPixel,
  worldPerPixelFromViewScale
} from '../src/composable/viewScale'

describe('viewScale', () => {
  test('real size is 1/1', () => {
    // One CSS pixel is 0.2646 mm; showing 0.2646 mm of drawing per pixel is real size.
    expect(viewScaleFromWorldPerPixel(MM_PER_CSS_PIXEL, 1)).toBeCloseTo(1)
  })

  test('takes the drawing units into account', () => {
    // 1 m units: 1000 times fewer units per pixel than mm for the same scale.
    const mm = worldPerPixelFromViewScale(1 / 100, 1)
    const m = worldPerPixelFromViewScale(1 / 100, 1000)
    expect(mm / m).toBeCloseTo(1000)
    expect(viewScaleFromWorldPerPixel(m, 1000)).toBeCloseTo(1 / 100)
  })

  test('formats like a drawing scale', () => {
    expect(formatViewScale(1 / 100)).toBe('1/100')
    expect(formatViewScale(1 / 87.34)).toBe('1/87')
    expect(formatViewScale(1 / 2.5)).toBe('1/2.5')
    expect(formatViewScale(1)).toBe('1/1')
    expect(formatViewScale(2)).toBe('2/1')
    expect(formatViewScale(0)).toBe('-')
  })
})
