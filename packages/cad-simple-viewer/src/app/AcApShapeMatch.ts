/**
 * Finds other places in a drawing where the same shape is drawn: copies of a
 * group of entities, symbols (block references) placed elsewhere, and symbols
 * that were exploded into loose entities.
 *
 * Every entity is broken down into comparable *parts* (a line segment, an arc,
 * a circle, a text …, see `AcApShapeParts.ts`), so that a symbol, its
 * exploded pieces and a polyline drawn over the same lines all compare equal.
 * This module is pure (no database): it compares parts.
 *
 * How a match is found: one part of the pattern (the *anchor*, the one with
 * the fewest look-alikes) is tried on every candidate part of the same kind.
 * Each try gives the transform (position, and when allowed, rotation, mirror
 * and scale) that would carry the pattern there; the transform is accepted
 * when every other part of the pattern lands on a candidate part, and every
 * candidate entity touched is used up completely (a longer polyline that only
 * shares a few segments with the pattern is not a match).
 */

/** A 2D point. */
export interface AcApShapePoint {
  x: number
  y: number
}

/**
 * How the points of a part correspond:
 * - `fixed`: point by point.
 * - `reversible`: point by point, or in reverse order (a line, an arc).
 * - `cyclic`: as a loop, from any point, either way round (a full ellipse).
 * - `any`: as a set (the boundary points of a hatch).
 */
export type AcApShapePartOrder = 'fixed' | 'reversible' | 'cyclic' | 'any'

/** One comparable piece of an entity, in world coordinates. */
export interface AcApShapePart {
  /** What it is: `line`, `arc`, `circle`, `text:<contents>` … */
  kind: string
  /** Points that pin it down (moved with the shape). */
  points: AcApShapePoint[]
  /** How the points correspond (see {@link AcApShapePartOrder}). */
  order: AcApShapePartOrder
  /** A length that scales with the shape (circle radius, text height). */
  size?: number
}

/** A candidate entity (or anything that is taken or left as a whole). */
export interface AcApShapeUnit<K> {
  key: K
  parts: AcApShapePart[]
}

/** Which differences still count as the same shape. */
export interface AcApShapeMatchOptions {
  /** Turned (rotated) copies */
  rotate: boolean
  /** Mirrored copies */
  mirror: boolean
  /** Larger or smaller copies */
  scale: boolean
}

/**
 * A 2D similarity: `x' = a·x + c·y + tx`, `y' = b·x + d·y + ty`.
 */
export interface AcApShapeTransform {
  a: number
  b: number
  c: number
  d: number
  tx: number
  ty: number
}

/** One place where the shape is found. */
export interface AcApShapeMatch<K> {
  /** Units (entities) that make it up */
  keys: K[]
  /** Carries the pattern onto this place */
  transform: AcApShapeTransform
  /** Angle in radians (after the mirror, when mirrored) */
  rotation: number
  /** Size compared with the pattern */
  scale: number
  /** Drawn mirrored */
  mirrored: boolean
}

/** Limits that keep a search on a huge drawing bounded. */
export interface AcApShapeMatchLimits {
  /** Stop after this many matches (default 5000) */
  maxMatches?: number
  /** Stop after this many part comparisons (default 5 000 000) */
  maxWork?: number
  /**
   * Distance under which points are the same. By default a
   * millionth-and-a-bit of the pattern's size (see {@link acapShapeTolerance}).
   */
  tolerance?: number
}

/** Result of {@link acapMatchShapes}. */
export interface AcApShapeMatchResult<K> {
  matches: AcApShapeMatch<K>[]
  /** A limit was reached: there may be more */
  truncated: boolean
}

/** Default number of matches. */
const MAX_MATCHES = 5000
/** Default number of part comparisons. */
const MAX_WORK = 5_000_000

const TWO_PI = Math.PI * 2

/**
 * Distance under which two points of a pattern are taken as the same:
 * 10⁻⁵ of the pattern's size, and enough for the rounding of large
 * coordinates.
 */
export function acapShapeTolerance(parts: AcApShapePart[]): number {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  let size = 0
  for (const part of parts) {
    for (const p of part.points) {
      minX = Math.min(minX, p.x)
      minY = Math.min(minY, p.y)
      maxX = Math.max(maxX, p.x)
      maxY = Math.max(maxY, p.y)
    }
    size = Math.max(size, part.size ?? 0)
  }
  if (!Number.isFinite(minX)) return 1e-9
  const diag = Math.max(Math.hypot(maxX - minX, maxY - minY), size * 2)
  const far = Math.max(
    Math.abs(minX),
    Math.abs(minY),
    Math.abs(maxX),
    Math.abs(maxY)
  )
  return Math.max(diag * 1e-5, far * 1e-12, 1e-9)
}

/** A part ready for comparing. */
interface Prepared {
  kind: string
  points: AcApShapePoint[]
  order: AcApShapePartOrder
  size: number
  /** Centroid of the points */
  cx: number
  cy: number
  /** Mean distance of the points from the centroid */
  spread: number
  /** Index of the point farthest from the centroid */
  far: number
  /** Index of the unit that owns it (-1 for the pattern) */
  unit: number
  /** Index among all candidate parts */
  id: number
}

function prepare(part: AcApShapePart, unit: number, id: number): Prepared {
  const n = part.points.length
  let cx = 0
  let cy = 0
  for (const p of part.points) {
    cx += p.x
    cy += p.y
  }
  cx /= Math.max(n, 1)
  cy /= Math.max(n, 1)
  let spread = 0
  let far = 0
  let farDist = -1
  part.points.forEach((p, i) => {
    const dist = Math.hypot(p.x - cx, p.y - cy)
    spread += dist
    if (dist > farDist) {
      farDist = dist
      far = i
    }
  })
  return {
    kind: part.kind,
    points: part.points,
    order: part.order,
    size: part.size ?? 0,
    cx,
    cy,
    spread: spread / Math.max(n, 1),
    far,
    unit,
    id
  }
}

/** Candidate parts of one kind, looked up by place. */
class PartGrid {
  private readonly cells = new Map<string, Prepared[]>()

  constructor(private readonly cell: number) {}

  add(part: Prepared) {
    const key = this.key(
      Math.floor(part.cx / this.cell),
      Math.floor(part.cy / this.cell)
    )
    const list = this.cells.get(key)
    if (list) list.push(part)
    else this.cells.set(key, [part])
  }

  /** Parts whose centroid may be within `radius` of the point. */
  *near(x: number, y: number, radius: number): Generator<Prepared> {
    const x0 = Math.floor((x - radius) / this.cell)
    const x1 = Math.floor((x + radius) / this.cell)
    const y0 = Math.floor((y - radius) / this.cell)
    const y1 = Math.floor((y + radius) / this.cell)
    if ((x1 - x0 + 1) * (y1 - y0 + 1) > this.cells.size) {
      for (const list of this.cells.values()) yield* list
      return
    }
    for (let i = x0; i <= x1; i++) {
      for (let j = y0; j <= y1; j++) {
        const list = this.cells.get(this.key(i, j))
        if (list) yield* list
      }
    }
  }

  private key(i: number, j: number) {
    return `${i},${j}`
  }
}

function apply(t: AcApShapeTransform, p: AcApShapePoint): AcApShapePoint {
  return { x: t.a * p.x + t.c * p.y + t.tx, y: t.b * p.x + t.d * p.y + t.ty }
}

/** Angle in (-π, π]. */
function wrapAngle(angle: number) {
  let a = angle % TWO_PI
  if (a <= -Math.PI) a += TWO_PI
  if (a > Math.PI) a -= TWO_PI
  return a
}

function close(p: AcApShapePoint, q: AcApShapePoint, tol: number) {
  return Math.abs(p.x - q.x) <= tol && Math.abs(p.y - q.y) <= tol
}

/** Whether transformed pattern points lie on a candidate part's points. */
function pointsMatch(
  q: AcApShapePoint[],
  c: AcApShapePoint[],
  order: AcApShapePartOrder,
  tol: number
): boolean {
  const n = q.length
  if (c.length !== n) return false
  const forward = () => q.every((p, i) => close(p, c[i], tol))
  const backward = () => q.every((p, i) => close(p, c[n - 1 - i], tol))
  switch (order) {
    case 'fixed':
      return forward()
    case 'reversible':
      return forward() || backward()
    case 'cyclic': {
      for (let shift = 0; shift < n; shift++) {
        if (q.every((p, i) => close(p, c[(i + shift) % n], tol))) return true
        if (q.every((p, i) => close(p, c[(shift - i + n * 2) % n], tol))) {
          return true
        }
      }
      return false
    }
    case 'any': {
      const used = new Array<boolean>(n).fill(false)
      return q.every(p => {
        for (let i = 0; i < n; i++) {
          if (!used[i] && close(p, c[i], tol)) {
            used[i] = true
            return true
          }
        }
        return false
      })
    }
  }
}

/**
 * The similarities that carry `a0 → c0` and `a1 → c1`: one turning, one
 * mirroring.
 */
function similarities(
  a0: AcApShapePoint,
  a1: AcApShapePoint,
  c0: AcApShapePoint,
  c1: AcApShapePoint
) {
  const ux = a1.x - a0.x
  const uy = a1.y - a0.y
  const vx = c1.x - c0.x
  const vy = c1.y - c0.y
  const lu = Math.hypot(ux, uy)
  const lv = Math.hypot(vx, vy)
  const s = lv / lu
  const alpha = Math.atan2(uy, ux)
  const beta = Math.atan2(vy, vx)
  const make = (mirrored: boolean) => {
    // Direct: s·R(θ). Mirrored: s·R(φ)·diag(1, -1).
    const angle = wrapAngle(mirrored ? beta + alpha : beta - alpha)
    const cos = Math.cos(angle) * s
    const sin = Math.sin(angle) * s
    const t = mirrored
      ? { a: cos, b: sin, c: sin, d: -cos, tx: 0, ty: 0 }
      : { a: cos, b: sin, c: -sin, d: cos, tx: 0, ty: 0 }
    const moved = apply(t, a0)
    t.tx = c0.x - moved.x
    t.ty = c0.y - moved.y
    return { transform: t, rotation: angle, scale: s, mirrored }
  }
  return { direct: make(false), mirrored: make(true), base: lu }
}

interface Candidate {
  transform: AcApShapeTransform
  rotation: number
  scale: number
  mirrored: boolean
}

/** Lower is better: plain copies first, then mirrored, then larger turns. */
function preference(c: Candidate) {
  return (
    (c.mirrored ? 10 : 0) + Math.abs(c.rotation) + Math.abs(Math.log(c.scale))
  )
}

/**
 * Finds the places where the pattern's shape is drawn among the candidates.
 *
 * @param pattern - Parts of the shape to look for, in world coordinates.
 * @param units - Entities that may make up a match (leave the pattern's own
 *   entities out). A match takes units as a whole.
 * @param options - Differences that still count as the same shape.
 * @param limits - Bounds for huge drawings.
 */
export function acapMatchShapes<K>(
  pattern: AcApShapePart[],
  units: AcApShapeUnit<K>[],
  options: AcApShapeMatchOptions,
  limits: AcApShapeMatchLimits = {}
): AcApShapeMatchResult<K> {
  const result: AcApShapeMatchResult<K> = { matches: [], truncated: false }
  if (!pattern.length) return result
  const tol = limits.tolerance ?? acapShapeTolerance(pattern)
  const maxMatches = limits.maxMatches ?? MAX_MATCHES
  let work = limits.maxWork ?? MAX_WORK

  const pat = pattern.map((part, i) => prepare(part, -1, i))
  const kinds = new Set(pat.map(p => p.kind))

  // Units that could be used up by the pattern: no more parts than the
  // pattern has, and only kinds the pattern has.
  const viable = units.map(
    unit =>
      unit.parts.length > 0 &&
      unit.parts.length <= pattern.length &&
      unit.parts.every(part => kinds.has(part.kind))
  )

  // Candidate parts, by kind: a grid by place and a list by spread.
  const all: Prepared[] = []
  units.forEach((unit, u) => {
    if (!viable[u]) return
    for (const part of unit.parts) all.push(prepare(part, u, all.length))
  })
  if (!all.length) return result
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const p of all) {
    minX = Math.min(minX, p.cx)
    minY = Math.min(minY, p.cy)
    maxX = Math.max(maxX, p.cx)
    maxY = Math.max(maxY, p.cy)
  }
  const cell = Math.max(
    tol * 8,
    Math.hypot(maxX - minX, maxY - minY) / Math.sqrt(all.length + 1)
  )
  const grids = new Map<string, PartGrid>()
  const bySpread = new Map<string, Prepared[]>()
  for (const p of all) {
    let grid = grids.get(p.kind)
    if (!grid) {
      grid = new PartGrid(cell)
      grids.set(p.kind, grid)
      bySpread.set(p.kind, [])
    }
    grid.add(p)
    bySpread.get(p.kind)!.push(p)
  }
  for (const list of bySpread.values()) list.sort((p, q) => p.spread - q.spread)

  /** Candidate parts that could be the given pattern part (any place). */
  const lookAlikes = (p: Prepared): Prepared[] => {
    const list = bySpread.get(p.kind) ?? []
    if (options.scale) {
      return p.spread > tol ? list.filter(c => c.spread > tol) : list
    }
    // Sorted by spread: the range within the tolerance.
    let lo = 0
    let hi = list.length
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (list[mid].spread < p.spread - tol * 2) lo = mid + 1
      else hi = mid
    }
    const out: Prepared[] = []
    for (
      let i = lo;
      i < list.length && list[i].spread <= p.spread + tol * 2;
      i++
    ) {
      if (Math.abs(list[i].size - p.size) <= tol * 2) out.push(list[i])
    }
    return out
  }

  const claimed = new Array<boolean>(units.length).fill(false)

  /**
   * Places every pattern part with the transform. Returns the units used,
   * or `undefined` when a part has nowhere to go or a unit is not used up.
   */
  const verify = (
    t: Candidate,
    order: Prepared[],
    within?: Set<number>
  ): number[] | undefined => {
    const tolT = tol * Math.max(t.scale, 1)
    const used = new Set<number>()
    const counts = new Map<number, number>()
    for (const p of order) {
      const grid = grids.get(p.kind)
      if (!grid) return undefined
      const center = apply(t.transform, { x: p.cx, y: p.cy })
      const size = p.size * t.scale
      let points: AcApShapePoint[] | undefined
      let found: Prepared | undefined
      for (const c of grid.near(center.x, center.y, tolT * 2)) {
        if (--work <= 0) return undefined
        if (used.has(c.id) || claimed[c.unit]) continue
        if (within && !within.has(c.unit)) continue
        if (Math.abs(c.cx - center.x) > tolT * 2) continue
        if (Math.abs(c.cy - center.y) > tolT * 2) continue
        if (Math.abs(c.size - size) > tolT * 2) continue
        points ??= p.points.map(q => apply(t.transform, q))
        if (!pointsMatch(points, c.points, p.order, tolT)) continue
        found = c
        break
      }
      if (!found) return undefined
      used.add(found.id)
      counts.set(found.unit, (counts.get(found.unit) ?? 0) + 1)
    }
    for (const [unit, count] of counts) {
      if (count !== units[unit].parts.length) return undefined
    }
    return [...counts.keys()]
  }

  /** Whether the transform is one the options allow. */
  const allowed = (t: Candidate, base: number) => {
    const angleTol = (tol * 4) / Math.max(base, tol)
    if (
      !options.scale &&
      Math.abs(t.scale - 1) > (tol * 4) / Math.max(base, tol)
    ) {
      return false
    }
    if (t.mirrored && !options.mirror) return false
    if (!options.rotate) {
      const r = Math.abs(wrapAngle(t.rotation))
      // Without turning, a mirror is only about a horizontal (φ = 0) or a
      // vertical (φ = π) axis.
      const turned = t.mirrored
        ? Math.min(r, Math.PI - r) > angleTol
        : r > angleTol
      if (turned) return false
    }
    return t.scale > 0 && Number.isFinite(t.scale)
  }

  // Anchor: a part with two distinct points pins position and angle; the
  // one with the fewest look-alikes is tried first.
  const counts = pat.map(p => lookAlikes(p).length)
  if (counts.some(c => c === 0)) return result
  const pick = (filter: (p: Prepared) => boolean) => {
    let best = -1
    pat.forEach((p, i) => {
      if (!filter(p)) return
      if (best < 0 || counts[i] < counts[best]) best = i
    })
    return best
  }
  const shaped = pick(p => p.spread > tol)
  const anchorIndex = shaped >= 0 ? shaped : pick(() => true)
  const anchor = pat[anchorIndex]
  const order = [anchor, ...pat.filter((_, i) => i !== anchorIndex)]

  /** Tries the transforms; keeps the best one that places the pattern. */
  const accept = (tries: Candidate[], base: number): boolean => {
    for (const t of tries.sort((p, q) => preference(p) - preference(q))) {
      if (!allowed(t, base)) continue
      const used = verify(t, order)
      if (!used) continue
      const best = refine(t, used, base)
      result.matches.push({
        keys: used.map(u => units[u].key),
        transform: best.transform,
        rotation: best.rotation,
        scale: best.scale,
        mirrored: best.mirrored
      })
      for (const u of used) claimed[u] = true
      return true
    }
    return false
  }

  // A symmetric shape fits the same place in several ways (a square: four
  // turns, four mirrors). Take the plainest one: try the anchor on every
  // look-alike part of the units found.
  const refine = (
    found: Candidate,
    used: number[],
    base: number
  ): Candidate => {
    if (anchor.spread <= tol) return found
    const within = new Set(used)
    let best = found
    for (const u of used) {
      for (const part of units[u].parts) {
        const c = prepare(part, u, -1)
        if (c.kind !== anchor.kind) continue
        for (const t of anchorTries(c)) {
          if (preference(t) >= preference(best) || !allowed(t, base)) continue
          if (verify(t, order, within)) best = t
        }
      }
    }
    return best
  }

  /** Transforms that put the anchor (with two distinct points) on c. */
  const anchorTries = (c: Prepared): Candidate[] => {
    const a0 = { x: anchor.cx, y: anchor.cy }
    const a1 = anchor.points[anchor.far]
    const reach = Math.hypot(a1.x - a0.x, a1.y - a0.y)
    const n = anchor.points.length
    if (c.points.length !== n) return []
    let ends: number[]
    switch (anchor.order) {
      case 'fixed':
        ends = [anchor.far]
        break
      case 'reversible':
        ends = [...new Set([anchor.far, n - 1 - anchor.far])]
        break
      default:
        ends = c.points.map((_, i) => i)
    }
    const tries: Candidate[] = []
    for (const m of ends) {
      const c1 = c.points[m]
      const dist = Math.hypot(c1.x - c.cx, c1.y - c.cy)
      if (dist <= tol) continue
      if (!options.scale && Math.abs(dist - reach) > tol * 2) continue
      const { direct, mirrored } = similarities(
        a0,
        a1,
        { x: c.cx, y: c.cy },
        c1
      )
      tries.push(direct, mirrored)
    }
    return tries
  }

  const stop = () => {
    if (result.matches.length >= maxMatches || work <= 0) {
      result.truncated = true
      return true
    }
    return false
  }

  const anchorCandidates = lookAlikes(anchor)
  if (anchor.spread > tol) {
    for (const c of anchorCandidates) {
      if (stop()) break
      if (claimed[c.unit]) continue
      const tries = anchorTries(c)
      const reach = Math.hypot(
        anchor.points[anchor.far].x - anchor.cx,
        anchor.points[anchor.far].y - anchor.cy
      )
      accept(tries, reach)
    }
    return result
  }

  // Only single-place parts (circles, points, texts). Pick a second part as
  // far from the anchor as possible to fix the angle.
  let second: Prepared | undefined
  let reach = 0
  for (const p of pat) {
    const dist = Math.hypot(p.cx - anchor.cx, p.cy - anchor.cy)
    if (dist > reach) {
      reach = dist
      second = p
    }
  }
  if (!second || reach <= tol) {
    // All in one place (a circle, concentric circles): only position, and
    // size when larger or smaller copies count.
    for (const c of anchorCandidates) {
      if (stop()) break
      if (claimed[c.unit]) continue
      const s = options.scale && anchor.size > 0 ? c.size / anchor.size : 1
      const t: Candidate = {
        transform: {
          a: s,
          b: 0,
          c: 0,
          d: s,
          tx: c.cx - s * anchor.cx,
          ty: c.cy - s * anchor.cy
        },
        rotation: 0,
        scale: s,
        mirrored: false
      }
      accept([t], Math.max(anchor.size, tol))
    }
    return result
  }
  const secondGrid = grids.get(second.kind)!
  const secondAll = lookAlikes(second)
  for (const c of anchorCandidates) {
    if (stop()) break
    if (claimed[c.unit]) continue
    const partners = options.scale
      ? secondAll
      : secondGrid.near(c.cx, c.cy, reach + tol * 2)
    for (const e of partners) {
      if (claimed[c.unit] || stop()) break
      if (e.id === c.id || claimed[e.unit]) continue
      const dist = Math.hypot(e.cx - c.cx, e.cy - c.cy)
      if (dist <= tol) continue
      if (!options.scale && Math.abs(dist - reach) > tol * 2) continue
      const { direct, mirrored } = similarities(
        { x: anchor.cx, y: anchor.cy },
        { x: second.cx, y: second.cy },
        { x: c.cx, y: c.cy },
        { x: e.cx, y: e.cy }
      )
      accept([direct, mirrored], reach)
    }
  }
  return result
}

/** Applies a transform to a point (for callers placing things by a match). */
export function acapApplyShapeTransform(
  t: AcApShapeTransform,
  p: AcApShapePoint
): AcApShapePoint {
  return apply(t, p)
}

/** `outer ∘ inner`. */
export function acapComposeShapeTransforms(
  outer: AcApShapeTransform,
  inner: AcApShapeTransform
): AcApShapeTransform {
  return {
    a: outer.a * inner.a + outer.c * inner.b,
    b: outer.b * inner.a + outer.d * inner.b,
    c: outer.a * inner.c + outer.c * inner.d,
    d: outer.b * inner.c + outer.d * inner.d,
    tx: outer.a * inner.tx + outer.c * inner.ty + outer.tx,
    ty: outer.b * inner.tx + outer.d * inner.ty + outer.ty
  }
}

/** Inverse of an (invertible) transform. */
export function acapInvertShapeTransform(
  t: AcApShapeTransform
): AcApShapeTransform {
  const det = t.a * t.d - t.b * t.c
  const a = t.d / det
  const b = -t.b / det
  const c = -t.c / det
  const d = t.a / det
  return {
    a,
    b,
    c,
    d,
    tx: -(a * t.tx + c * t.ty),
    ty: -(b * t.tx + d * t.ty)
  }
}
