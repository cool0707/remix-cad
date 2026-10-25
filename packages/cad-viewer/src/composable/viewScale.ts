/**
 * Display scale of the view, as a drawing scale: length on screen over real
 * length (`1/100` = 1 mm on screen shows 100 mm of the drawing).
 *
 * Real length comes from the drawing units (`INSUNITS`, unitless counts as
 * millimetres) and screen length from CSS pixels (96 per inch), so the scale
 * matches a print at that scale on a typical screen.
 */

/** Millimetres per CSS pixel (96 px per inch). */
export const MM_PER_CSS_PIXEL = 25.4 / 96

/** Scales offered in the menu (screen / real). */
export const VIEW_SCALE_PRESETS: readonly number[] = [
  1,
  1 / 2,
  1 / 5,
  1 / 10,
  1 / 20,
  1 / 50,
  1 / 100,
  1 / 200,
  1 / 500,
  1 / 1000,
  1 / 5000
]

/** Slider range, in log10 of the scale (1/100000 … 10/1). */
export const VIEW_SCALE_LOG_MIN = -5
export const VIEW_SCALE_LOG_MAX = 1

/**
 * Scale for a view showing `worldPerPixel` drawing units per CSS pixel.
 *
 * @param worldPerPixel - Drawing units per CSS pixel.
 * @param mmPerUnit - Millimetres per drawing unit.
 */
export function viewScaleFromWorldPerPixel(
  worldPerPixel: number,
  mmPerUnit: number
) {
  return MM_PER_CSS_PIXEL / (worldPerPixel * mmPerUnit)
}

/** Inverse of {@link viewScaleFromWorldPerPixel}. */
export function worldPerPixelFromViewScale(scale: number, mmPerUnit: number) {
  return MM_PER_CSS_PIXEL / (scale * mmPerUnit)
}

const formatRatioPart = (value: number) =>
  value >= 10
    ? String(Math.round(value))
    : String(Math.round(value * 10) / 10)

/**
 * Formats a scale the way drawings write it: `1/100`, `1/2.5`, `1/1`, `2/1`.
 *
 * @param scale - Screen length over real length.
 */
export function formatViewScale(scale: number) {
  if (!Number.isFinite(scale) || scale <= 0) return '-'
  return scale >= 1
    ? `${formatRatioPart(scale)}/1`
    : `1/${formatRatioPart(1 / scale)}`
}
