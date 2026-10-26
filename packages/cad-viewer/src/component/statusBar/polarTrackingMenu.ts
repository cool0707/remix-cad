/** Common POLARANG values shown in the status bar polar tracking menu. */
export const POLAR_TRACKING_INCREMENTS = [
  90, 45, 30, 22.5, 18, 15, 10, 5
] as const

export type PolarTrackingIncrement = (typeof POLAR_TRACKING_INCREMENTS)[number]

/** Formats an angle in degrees with at most one decimal (e.g. `22.5°`). */
export function formatPolarAngle(degrees: number): string {
  return `${Math.round(degrees * 10) / 10}°`
}

/**
 * Formats the preview of the angles a polar increment snaps to
 * (e.g. `45°, 90°, 135°, 180°…`).
 */
export function formatPolarIncrementMenuLabel(increment: number): string {
  const preview = []
  for (let i = 1; i <= 4; i++) {
    preview.push(formatPolarAngle(i * increment))
  }
  return `${preview.join(', ')}…`
}

export function isSamePolarIncrement(
  current: number,
  increment: number
): boolean {
  return Math.abs(current - increment) < 0.001
}
