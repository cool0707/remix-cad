import type { AcGiHatchPatternLine } from '@mlightcad/data-model'

import type { Vec2 } from './types'

/**
 * Lines of a hatch pattern clipped to its boundary (even-odd rule), the same
 * model as the viewer's hatch shader: each definition line is repeated every
 * `offset` (measured in the line's frame after rotating by `lineAngle +
 * patternAngle`), dashes start at `base` and shift by `offset.x` per line.
 *
 * Returns undefined when the pattern would produce more than `limit`
 * segments.
 */
export function hatchPatternSegments(
  loops: Vec2[][],
  lines: AcGiHatchPatternLine[],
  patternAngle: number,
  limit = 200000
): [Vec2, Vec2][] | undefined {
  const segments: [Vec2, Vec2][] = []
  for (const line of lines) {
    const angle = line.angle + patternAngle
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    // The offset is a WCS vector of the definition line (before the hatch
    // pattern angle); express it in the line frame.
    const ox =
      line.offset.x * Math.cos(line.angle) +
      line.offset.y * Math.sin(line.angle)
    const oy =
      -line.offset.x * Math.sin(line.angle) +
      line.offset.y * Math.cos(line.angle)
    if (!(Math.abs(oy) > 1e-12)) continue
    const bx = line.base.x
    const by = line.base.y
    const toLocal = (p: Vec2): Vec2 => {
      const dx = p[0] - bx
      const dy = p[1] - by
      return [dx * cos + dy * sin, -dx * sin + dy * cos]
    }
    const toWorld = (p: Vec2): Vec2 => [
      bx + p[0] * cos - p[1] * sin,
      by + p[0] * sin + p[1] * cos
    ]
    const local = loops.map(loop => loop.map(toLocal))
    let ymin = Infinity
    let ymax = -Infinity
    for (const loop of local) {
      for (const p of loop) {
        ymin = Math.min(ymin, p[1])
        ymax = Math.max(ymax, p[1])
      }
    }
    if (!Number.isFinite(ymin)) continue
    const k0 = Math.ceil(Math.min(ymin / oy, ymax / oy))
    const k1 = Math.floor(Math.max(ymin / oy, ymax / oy))
    if (k1 - k0 > limit) return undefined
    const dashes = line.dashLengths
    const period = dashes.reduce((sum, d) => sum + Math.abs(d), 0)
    for (let k = k0; k <= k1; k++) {
      const y = k * oy
      const xs: number[] = []
      for (const loop of local) {
        for (let i = 0; i < loop.length; i++) {
          const a = loop[i]
          const b = loop[(i + 1) % loop.length]
          if (a[1] > y !== b[1] > y) {
            xs.push(a[0] + ((y - a[1]) * (b[0] - a[0])) / (b[1] - a[1]))
          }
        }
      }
      xs.sort((a, b) => a - b)
      const phase = k * ox
      for (let i = 0; i + 1 < xs.length; i += 2) {
        const x0 = xs[i]
        const x1 = xs[i + 1]
        if (!(x1 > x0)) continue
        if (dashes.length === 0 || !(period > 0)) {
          segments.push([toWorld([x0, y]), toWorld([x1, y])])
        } else {
          // First period that reaches x0.
          let start = phase + Math.floor((x0 - phase) / period) * period
          while (start < x1) {
            let x = start
            for (const d of dashes) {
              const len = Math.abs(d)
              if (d >= 0) {
                const a = Math.max(x, x0)
                // A dot is drawn as a very short dash.
                const b = Math.min(d === 0 ? x + period * 1e-3 : x + len, x1)
                if (b > a) segments.push([toWorld([a, y]), toWorld([b, y])])
              }
              x += len
              if (x >= x1) break
            }
            start += period
            if (segments.length > limit) return undefined
          }
        }
        if (segments.length > limit) return undefined
      }
    }
  }
  return segments
}
