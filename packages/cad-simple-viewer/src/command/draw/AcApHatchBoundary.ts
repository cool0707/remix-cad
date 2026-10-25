/*
 * Planar regions for HATCH: find the closed boundary around a point from a
 * soup of curves.
 *
 * Ported to TypeScript from CADCraft `crates/geom/src/region.rs`
 * (https://github.com/storytold/cadcraft). Additions here: collinear
 * overlapping segments are split at each other's ends, vertices are merged
 * across neighbouring tolerance bins, `snapEnds` uses a grid, and
 * `closedOutlines` returns every closed group (HATCH "select objects").
 *
 * MIT License
 *
 * Copyright (c) 2026 ArtCraft Team and the CADCraft contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * How it works: the curves arrive as polylines. Segments are split at every
 * crossing, vertices merged within a tolerance, and the face to the left of
 * the edge hit by a ray from the point is traced by always taking the sharpest
 * left turn.
 *
 * Islands are the connected groups of curves that lie inside that face without
 * touching its boundary; each one contributes the outline of its outside
 * (traced the same way, clockwise around the group), so a square drawn as four
 * separate lines is as much an island as a closed polyline.
 */

/** A 2D point. */
export interface AcApHatchPoint {
  x: number
  y: number
}

/** A curve flattened to a polyline. */
export type AcApHatchPolyline = AcApHatchPoint[]

/**
 * Default upper bound on input segments (keeps the split bounded on huge
 * input); the HATCH command takes its limit from the settings.
 */
export const ACAP_HATCH_MAX_SEGMENTS = 60_000

/** Upper bound on islands reported for one boundary. */
const MAX_ISLANDS = 4096

/** Upper bound on open curve ends considered for closing gaps, and on the pairs compared. */
const MAX_GAP_ENDS = 50_000
const MAX_GAP_PAIRS = 5_000_000

/**
 * Upper bound on candidate segment pairs visited while splitting, per allowed
 * segment (a raised segment limit raises it too).
 */
const PAIR_VISITS_PER_SEGMENT = 1000

/** Upper bound on edges traced for one face. */
const MAX_TRACE_STEPS = 2_000_000

const TAU = Math.PI * 2

/** The closed boundary around a point and the islands inside it. */
export interface AcApHatchBoundaryResult {
  /** Counter-clockwise outer loop. */
  outer: AcApHatchPolyline
  /** Groups of curves inside `outer` that don't touch it and don't surround the point. */
  islands: AcApHatchIsland[]
  /** Indices into the input polylines that make up `outer`, ascending. */
  outerSources: number[]
}

/** One island (or one closed group): the outside outline of connected curves. */
export interface AcApHatchIsland {
  /** Counter-clockwise outline (dangling ends removed). */
  outline: AcApHatchPolyline
  /** Indices into the input polylines that make up the group, ascending. */
  sources: number[]
}

interface Graph {
  pts: AcApHatchPoint[]
  adj: number[][]
  /** (graph vertex, input polyline) for every input segment: which curve touches which group. */
  src: Array<[number, number]>
  /** The input polyline of every edge, keyed by {@link edgeKey}. */
  edgeSrc: Map<number, number>
}

const edgeKey = (u: number, v: number) =>
  Math.min(u, v) * 67_108_864 + Math.max(u, v)

const isFinitePoint = (p: AcApHatchPoint) =>
  Number.isFinite(p.x) && Number.isFinite(p.y)

const dist = (a: AcApHatchPoint, b: AcApHatchPoint) =>
  Math.hypot(a.x - b.x, a.y - b.y)

const near = (a: AcApHatchPoint, b: AcApHatchPoint, tol: number) =>
  dist(a, b) <= tol

const cross = (ax: number, ay: number, bx: number, by: number) =>
  ax * by - ay * bx

const normAngle = (a: number) => {
  if (!Number.isFinite(a)) return 0
  const r = ((a % TAU) + TAU) % TAU
  return r >= TAU ? 0 : r
}

const angleOf = (from: AcApHatchPoint, to: AcApHatchPoint) =>
  normAngle(Math.atan2(to.y - from.y, to.x - from.x))

/** Parameter of the projection of `p` on the segment a→b (unclamped). */
const paramOf = (a: AcApHatchPoint, b: AcApHatchPoint, p: AcApHatchPoint) => {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len2 = dx * dx + dy * dy
  return len2 > 0 ? ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2 : 0
}

const pointAt = (a: AcApHatchPoint, b: AcApHatchPoint, t: number) => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t
})

/** Signed area (positive when counter-clockwise). */
export function acapHatchSignedArea(poly: ReadonlyArray<AcApHatchPoint>) {
  if (poly.length < 3) return 0
  let sum = 0
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    sum += poly[j].x * poly[i].y - poly[i].x * poly[j].y
  }
  return sum / 2
}

/** Even-odd point in polygon test. */
export function acapHatchPointInPolygon(
  poly: ReadonlyArray<AcApHatchPoint>,
  p: AcApHatchPoint
) {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i]
    const b = poly[j]
    if (
      a.y > p.y !== b.y > p.y &&
      p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x
    ) {
      inside = !inside
    }
  }
  return inside
}

/** Axis-aligned bounds. */
export interface AcApHatchBounds {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

export function acapHatchBounds(
  points: Iterable<AcApHatchPoint>
): AcApHatchBounds {
  const b = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
  for (const p of points) {
    if (!isFinitePoint(p)) continue
    if (p.x < b.minX) b.minX = p.x
    if (p.y < b.minY) b.minY = p.y
    if (p.x > b.maxX) b.maxX = p.x
    if (p.y > b.maxY) b.maxY = p.y
  }
  return b
}

const boundsEmpty = (b: AcApHatchBounds) =>
  !(b.minX <= b.maxX && b.minY <= b.maxY)

const boundsContains = (b: AcApHatchBounds, p: AcApHatchPoint) =>
  p.x >= b.minX && p.x <= b.maxX && p.y >= b.minY && p.y <= b.maxY

const boundsContainsBox = (b: AcApHatchBounds, o: AcApHatchBounds) =>
  o.minX >= b.minX && o.maxX <= b.maxX && o.minY >= b.minY && o.maxY <= b.maxY

/**
 * Records where segments `i` and `j` cross (or, when collinear, where each
 * one's ends lie on the other) as split parameters on both.
 */
function splitPair(
  segs: ReadonlyArray<[AcApHatchPoint, AcApHatchPoint]>,
  splits: number[][],
  i: number,
  j: number,
  tol: number
) {
  const [a1, a2] = segs[i]
  const [b1, b2] = segs[j]
  const rx = a2.x - a1.x
  const ry = a2.y - a1.y
  const sx = b2.x - b1.x
  const sy = b2.y - b1.y
  const den = cross(rx, ry, sx, sy)
  const rl = Math.hypot(rx, ry)
  const sl = Math.hypot(sx, sy)
  if (Math.abs(den) < 1e-14 * Math.max(rl * sl, 1e-300)) {
    // Parallel: split where collinear overlapping segments end on each other.
    if (Math.abs(cross(rx, ry, b1.x - a1.x, b1.y - a1.y)) > tol * rl) return
    for (const [seg, other, k] of [
      [segs[i], segs[j], i],
      [segs[j], segs[i], j]
    ] as const) {
      for (const p of other) {
        const t = paramOf(seg[0], seg[1], p)
        if (t > 0 && t < 1) splits[k].push(t)
      }
    }
    return
  }
  const qx = b1.x - a1.x
  const qy = b1.y - a1.y
  const t = cross(qx, qy, sx, sy) / den
  const u = cross(qx, qy, rx, ry) / den
  // Parametric slack plus the merge tolerance, so a line that stops on
  // another (a T junction drawn a hair short) still meets it.
  const ta = 1e-9 + tol / Math.max(rl, 1e-300)
  const tb = 1e-9 + tol / Math.max(sl, 1e-300)
  if (t < -ta || t > 1 + ta || u < -tb || u > 1 + tb) return
  splits[i].push(Math.min(1, Math.max(0, t)))
  splits[j].push(Math.min(1, Math.max(0, u)))
}

/** Planar graph of the curves: segments split at crossings, vertices merged within `tol`. */
function build(
  polys: ReadonlyArray<AcApHatchPolyline>,
  tol: number,
  maxSegments: number
): Graph | undefined {
  const segs: Array<[AcApHatchPoint, AcApHatchPoint]> = []
  const owner: number[] = []
  for (let k = 0; k < polys.length; k++) {
    const pl = polys[k]
    for (let w = 0; w + 1 < pl.length; w++) {
      const a = pl[w]
      const b = pl[w + 1]
      if (isFinitePoint(a) && isFinitePoint(b) && !near(a, b, tol)) {
        segs.push([a, b])
        owner.push(k)
      }
    }
    if (segs.length > maxSegments) return undefined
  }
  if (segs.length === 0) return undefined

  // Split points per segment (parameters), found with a uniform grid.
  const bb = acapHatchBounds(segs.flat())
  const n = segs.length
  const cells = Math.min(512, Math.max(1, Math.ceil(Math.sqrt(n))))
  const cw = Math.max((bb.maxX - bb.minX) / cells, 1e-12)
  const ch = Math.max((bb.maxY - bb.minY) / cells, 1e-12)
  const cellX = (x: number) =>
    Math.min(cells - 1, Math.max(0, Math.floor((x - bb.minX) / cw)))
  const cellY = (y: number) =>
    Math.min(cells - 1, Math.max(0, Math.floor((y - bb.minY) / ch)))
  const grid = new Map<number, number[]>()
  const long: number[] = []
  for (let i = 0; i < n; i++) {
    const [a, b] = segs[i]
    const x0 = cellX(Math.min(a.x, b.x) - tol)
    const x1 = cellX(Math.max(a.x, b.x) + tol)
    const y0 = cellY(Math.min(a.y, b.y) - tol)
    const y1 = cellY(Math.max(a.y, b.y) + tol)
    if ((x1 - x0 + 1) * (y1 - y0 + 1) > 4096) {
      // Very long segment: tested against every segment below.
      long.push(i)
      continue
    }
    for (let gx = x0; gx <= x1; gx++) {
      for (let gy = y0; gy <= y1; gy++) {
        const key = gx * 512 + gy
        let list = grid.get(key)
        if (!list) grid.set(key, (list = []))
        list.push(i)
      }
    }
  }
  const maxPairVisits = maxSegments * PAIR_VISITS_PER_SEGMENT
  const splits: number[][] = Array.from({ length: n }, () => [0, 1])
  const tested = new Set<number>()
  let visits = 0
  for (const list of grid.values()) {
    for (let a = 0; a < list.length; a++) {
      for (let b = a + 1; b < list.length; b++) {
        if (++visits > maxPairVisits) return undefined
        const i = list[a]
        const j = list[b]
        const key = Math.min(i, j) * n + Math.max(i, j)
        if (i === j || tested.has(key)) continue
        tested.add(key)
        splitPair(segs, splits, i, j, tol)
      }
    }
  }
  for (const i of long) {
    for (let j = 0; j < n; j++) {
      if (++visits > maxPairVisits) return undefined
      const key = Math.min(i, j) * n + Math.max(i, j)
      if (i === j || tested.has(key)) continue
      tested.add(key)
      splitPair(segs, splits, i, j, tol)
    }
  }

  const g: Graph = { pts: [], adj: [], src: [], edgeSrc: new Map() }
  // Vertices in tolerance-sized bins (relative to the bounds, so drawings far
  // from the origin keep their precision); a point merges with a vertex in its
  // own or a neighbouring bin when it lies within `tol`.
  const index = new Map<string, number[]>()
  const bin = (v: number, o: number) => Math.round((v - o) / tol)
  const vid = (p: AcApHatchPoint) => {
    const bx = bin(p.x, bb.minX)
    const by = bin(p.y, bb.minY)
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const list = index.get(`${bx + dx},${by + dy}`)
        if (!list) continue
        for (const id of list) {
          if (near(g.pts[id], p, tol)) return id
        }
      }
    }
    const id = g.pts.length
    g.pts.push(p)
    g.adj.push([])
    const key = `${bx},${by}`
    const list = index.get(key)
    if (list) list.push(id)
    else index.set(key, [id])
    return id
  }
  for (let i = 0; i < n; i++) {
    const [a, b] = segs[i]
    const ts = splits[i].sort((x, y) => x - y)
    const first = vid(a)
    g.src.push([first, owner[i]])
    let prev = first
    let prevT = 0
    for (const t of ts) {
      if (t - prevT < 1e-12 && t !== 0) continue
      const v = t === 0 ? first : vid(pointAt(a, b, t))
      prevT = t
      if (v === prev) continue
      const key = edgeKey(prev, v)
      if (!g.edgeSrc.has(key)) g.edgeSrc.set(key, owner[i])
      if (!g.adj[prev].includes(v)) g.adj[prev].push(v)
      if (!g.adj[v].includes(prev)) g.adj[v].push(prev)
      prev = v
    }
  }
  return g
}

/**
 * The graph of the curves with gaps of up to `gap` between open ends bridged:
 * each open end joins the nearest other open end within reach.
 */
function buildGap(
  polys: ReadonlyArray<AcApHatchPolyline>,
  tol: number,
  gap: number,
  maxSegments: number
): Graph | undefined {
  const g = build(polys, Math.max(tol, 1e-12), maxSegments)
  if (!g || !(Number.isFinite(gap) && gap > tol)) return g
  const ends: Array<[AcApHatchPoint, number]> = []
  for (let u = 0; u < g.adj.length && ends.length < MAX_GAP_ENDS; u++) {
    if (g.adj[u].length === 1) ends.push([g.pts[u], u])
  }
  ends.sort((a, b) => a[0].x - b[0].x)
  const joined = new Array<boolean>(ends.length).fill(false)
  let budget = MAX_GAP_PAIRS
  for (let i = 0; i < ends.length; i++) {
    if (joined[i]) continue
    const [pu, u] = ends[i]
    let lo = 0
    let hi = ends.length
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (ends[mid][0].x < pu.x - gap) lo = mid + 1
      else hi = mid
    }
    let best: [number, number] | undefined
    for (let j = lo; j < ends.length; j++) {
      const [pv, v] = ends[j]
      if (pv.x > pu.x + gap || budget === 0) break
      budget--
      if (j === i || joined[j] || g.adj[u].includes(v)) continue
      const d = dist(pu, pv)
      if (d <= gap && (!best || d < best[0])) best = [d, j]
    }
    if (!best) continue
    const j = best[1]
    const v = ends[j][1]
    const w = g.adj[u][0]
    const owner = w === undefined ? undefined : g.edgeSrc.get(edgeKey(u, w))
    g.adj[u].push(v)
    g.adj[v].push(u)
    if (owner !== undefined) g.edgeSrc.set(edgeKey(u, v), owner)
    joined[i] = true
    joined[j] = true
  }
  return g
}

/** Trace the face left of half-edge u→v (vertex indices), giving up after `maxSteps` edges. */
function trace(g: Graph, u0: number, v0: number, maxSteps: number) {
  let u = u0
  let v = v0
  const out = [u]
  for (let step = 0; step < maxSteps; step++) {
    out.push(v)
    const pv = g.pts[v]
    const back = angleOf(pv, g.pts[u])
    const ns = g.adj[v]
    let best: [number, number] | undefined
    for (const w of ns) {
      if (w === u && ns.length > 1) continue
      let cw = normAngle(back - angleOf(pv, g.pts[w]))
      if (cw < 1e-12) cw = TAU
      if (!best || cw < best[0]) best = [cw, w]
    }
    if (!best) return undefined
    u = v
    v = best[1]
    if (u === u0 && v === v0) {
      out.pop()
      return out
    }
  }
  return undefined
}

const points = (g: Graph, ids: ReadonlyArray<number>) => ids.map(i => g.pts[i])

/** The face around `p`, as vertex indices (counter-clockwise). */
function outerFace(g: Graph, p: AcApHatchPoint) {
  // Try hits along a ray to +X from nearest outward, so nested faces resolve to the innermost.
  const hits: Array<[number, number, number]> = []
  for (let u = 0; u < g.adj.length; u++) {
    for (const v of g.adj[u]) {
      if (u >= v) continue
      const a = g.pts[u]
      const b = g.pts[v]
      if (a.y > p.y !== b.y > p.y) {
        const x = a.x + ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y)
        if (x > p.x) hits.push([x, u, v])
      }
    }
  }
  hits.sort((x, y) => x[0] - y[0])
  const maxSteps = Math.min(MAX_TRACE_STEPS, Math.max(16, g.pts.length * 2))
  for (const [, a, b] of hits.slice(0, 64)) {
    const pa = g.pts[a]
    const pb = g.pts[b]
    const [u, v] =
      cross(pb.x - pa.x, pb.y - pa.y, p.x - pa.x, p.y - pa.y) > 0
        ? [a, b]
        : [b, a]
    const ids = trace(g, u, v, maxSteps)
    if (!ids || ids.length < 3) continue
    const lp = points(g, ids)
    if (acapHatchSignedArea(lp) > 0 && acapHatchPointInPolygon(lp, p)) {
      return ids
    }
  }
  return undefined
}

/** Connected component id of every vertex. */
function components(g: Graph) {
  const comp = new Array<number>(g.pts.length).fill(-1)
  let next = 0
  const stack: number[] = []
  for (let start = 0; start < g.pts.length; start++) {
    if (comp[start] !== -1) continue
    stack.push(start)
    while (stack.length) {
      const u = stack.pop()!
      if (comp[u] !== -1) continue
      comp[u] = next
      for (const w of g.adj[u]) if (comp[w] === -1) stack.push(w)
    }
    next++
  }
  return comp
}

/**
 * The graph without dangling ends: vertices of degree one are removed until
 * none remain, so only edges on cycles are left.
 */
function prune(g: Graph): Graph {
  const adj = g.adj.map(l => l.slice())
  const stack: number[] = []
  for (let u = 0; u < adj.length; u++) if (adj[u].length === 1) stack.push(u)
  while (stack.length) {
    const u = stack.pop()!
    const l = adj[u]
    if (l.length !== 1) continue
    adj[u] = []
    for (const v of l) {
      adj[v] = adj[v].filter(w => w !== u)
      if (adj[v].length === 1) stack.push(v)
    }
  }
  return { pts: g.pts, adj, src: [], edgeSrc: new Map() }
}

/**
 * The outline of the outside of a group of curves on cycles, traced
 * counter-clockwise from its leftmost (then lowest) vertex `u`, giving up after
 * `steps` edges.
 */
function outside(core: Graph, u: number, steps: number) {
  const pu = core.pts[u]
  // Every neighbour lies to the right of the leftmost vertex; the one turned
  // furthest counter-clockwise has the outside of the group on its left.
  let best: [number, number] | undefined
  for (const w of core.adj[u]) {
    let a = angleOf(pu, core.pts[w])
    if (a > Math.PI) a -= TAU
    if (!best || a > best[0]) best = [a, w]
  }
  if (!best) return undefined
  const ids = trace(core, u, best[1], steps)
  if (!ids) return undefined
  return points(core, ids).reverse()
}

/** Leftmost (then lowest) vertex still on a cycle and the edge count, per component. */
function componentStarts(core: Graph, comp: ReadonlyArray<number>) {
  const start = new Map<number, number>()
  const edges = new Map<number, number>()
  for (let u = 0; u < core.adj.length; u++) {
    const ns = core.adj[u]
    if (!ns.length) continue
    const c = comp[u]
    edges.set(c, (edges.get(c) ?? 0) + ns.length)
    const s = start.get(c)
    const q = core.pts[u]
    if (s === undefined) {
      start.set(c, u)
    } else {
      const b = core.pts[s]
      if (q.x < b.x || (q.x === b.x && q.y < b.y)) start.set(c, u)
    }
  }
  return { start, edges }
}

function componentSources(g: Graph, comp: ReadonlyArray<number>) {
  const sources = new Map<number, Set<number>>()
  for (const [v, k] of g.src) {
    const c = comp[v]
    let set = sources.get(c)
    if (!set) sources.set(c, (set = new Set()))
    set.add(k)
  }
  return sources
}

/** Outlines of the groups of curves inside the face `outer` (vertex indices into `g`). */
function islands(g: Graph, outer: ReadonlyArray<number>, p: AcApHatchPoint) {
  const comp = components(g)
  const outerComp = new Set(outer.map(i => comp[i]))
  const outerPts = points(g, outer)
  const ob = acapHatchBounds(outerPts)
  const core = prune(g)
  const { start, edges } = componentStarts(core, comp)
  const sources = componentSources(g, comp)
  const out: AcApHatchIsland[] = []
  const starts = [...start.entries()].sort((a, b) => a[0] - b[0])
  for (const [c, u] of starts) {
    if (out.length >= MAX_ISLANDS) break
    if (outerComp.has(c)) continue
    const pu = core.pts[u]
    if (!boundsContains(ob, pu) || !acapHatchPointInPolygon(outerPts, pu)) {
      continue
    }
    const lp = outside(core, u, (edges.get(c) ?? 0) + 4)
    if (!lp || lp.length < 3) continue
    const area = acapHatchSignedArea(lp)
    if (!Number.isFinite(area) || area <= 0) continue
    if (!boundsContainsBox(ob, acapHatchBounds(lp))) continue
    if (acapHatchPointInPolygon(lp, p)) continue
    const src = [...(sources.get(c) ?? [])].sort((a, b) => a - b)
    out.push({ outline: lp, sources: src })
  }
  return out
}

/**
 * The curves with each open end that stops within `snap` of another curve
 * moved onto that curve (which gains a vertex there), so the two meet exactly.
 * A curve that is flattened into chords (an arc, an ellipse) lies up to the
 * flattening tolerance off the true curve, so a line that ends on the true
 * curve can stop just short of the chords.
 *
 * An end is moved onto another curve's own end only within `endSnap`: two
 * ends facing each other across a wider gap are left for the finder to bridge
 * with a straight segment, instead of both being pulled onto each other.
 */
export function acapHatchSnapEnds(
  polys: ReadonlyArray<AcApHatchPolyline>,
  snap: number,
  tol: number,
  maxSegments = ACAP_HATCH_MAX_SEGMENTS,
  endSnap = snap
): AcApHatchPolyline[] {
  const out = polys.map(p => p.slice())
  if (!(Number.isFinite(snap) && snap > tol)) return out
  let total = 0
  for (const p of polys) total += Math.max(0, p.length - 1)
  if (total > maxSegments || total === 0) return out

  // Segments in a grid of `snap`-sized (at least) cells.
  const all = polys.flat()
  const bb = acapHatchBounds(all)
  if (boundsEmpty(bb)) return out
  const size = Math.max(
    snap,
    Math.max(bb.maxX - bb.minX, bb.maxY - bb.minY) / 512,
    1e-12
  )
  const cell = (v: number, o: number) => Math.floor((v - o) / size)
  const grid = new Map<string, Array<[number, number]>>()
  polys.forEach((pl, j) => {
    for (let k = 0; k + 1 < pl.length; k++) {
      const a = pl[k]
      const b = pl[k + 1]
      if (!isFinitePoint(a) || !isFinitePoint(b)) continue
      const x0 = cell(Math.min(a.x, b.x) - snap, bb.minX)
      const x1 = cell(Math.max(a.x, b.x) + snap, bb.minX)
      const y0 = cell(Math.min(a.y, b.y) - snap, bb.minY)
      const y1 = cell(Math.max(a.y, b.y) + snap, bb.minY)
      if ((x1 - x0 + 1) * (y1 - y0 + 1) > 4096) continue
      for (let x = x0; x <= x1; x++) {
        for (let y = y0; y <= y1; y++) {
          const key = `${x},${y}`
          let list = grid.get(key)
          if (!list) grid.set(key, (list = []))
          list.push([j, k])
        }
      }
    }
  })

  // (target polyline, segment index, parameter on it, the point) for every vertex to insert.
  const inserts: Array<[number, number, number, AcApHatchPoint]> = []
  let budget = MAX_GAP_PAIRS
  polys.forEach((pl, i) => {
    if (pl.length < 2) return
    const first = pl[0]
    const last = pl[pl.length - 1]
    if (near(first, last, tol)) return
    for (const atEnd of [false, true]) {
      const e = atEnd ? last : first
      if (!isFinitePoint(e)) continue
      const candidates = grid.get(`${cell(e.x, bb.minX)},${cell(e.y, bb.minY)}`)
      if (!candidates) continue
      let best: [number, number, number, number, AcApHatchPoint] | undefined
      let touching = false
      for (const [j, k] of candidates) {
        if (j === i || budget-- <= 0) continue
        const a = polys[j][k]
        const b = polys[j][k + 1]
        const t = Math.min(1, Math.max(0, paramOf(a, b, e)))
        const q = pointAt(a, b, t)
        const d = dist(q, e)
        const atCurveEnd =
          (k === 0 && t === 0) || (k === polys[j].length - 2 && t === 1)
        const reach = atCurveEnd ? Math.min(snap, endSnap) : snap
        if (d <= tol) touching = true
        else if (d <= reach && (!best || d < best[0])) best = [d, j, k, t, q]
      }
      if (!best || touching) continue
      const [, j, k, t, q] = best
      out[i][atEnd ? out[i].length - 1 : 0] = q
      const a = polys[j][k]
      const b = polys[j][k + 1]
      if (!near(q, a, tol) && !near(q, b, tol)) inserts.push([j, k, t, q])
    }
  })
  // Later segments and larger parameters first, so earlier indices stay valid.
  inserts.sort((x, y) => y[0] - x[0] || y[1] - x[1] || y[2] - x[2])
  for (const [j, k, , q] of inserts) {
    if (k < out[j].length) out[j].splice(k + 1, 0, q)
  }
  return out
}

/**
 * A boundary finder over one set of curves. The planar graph is built once and
 * reused for every point asked about.
 */
export class AcApHatchBoundaryFinder {
  private _graph: Graph | undefined | null = null

  /**
   * @param polys - The curves, flattened to polylines.
   * @param tol - Vertex merge tolerance.
   * @param gap - Widest gap between open ends that still closes a boundary.
   * @param maxSegments - Most segments the graph is built from.
   */
  constructor(
    private readonly polys: ReadonlyArray<AcApHatchPolyline>,
    private readonly tol: number,
    private readonly gap = 0,
    private readonly maxSegments = ACAP_HATCH_MAX_SEGMENTS
  ) {}

  /** False when there are too many segments to build the graph. */
  get usable() {
    return this.graph != null
  }

  private get graph() {
    if (this._graph === null) {
      this._graph = buildGap(this.polys, this.tol, this.gap, this.maxSegments)
    }
    return this._graph
  }

  /** The closed loop enclosing `p` plus the islands inside it, or `undefined`. */
  boundaryAt(p: AcApHatchPoint): AcApHatchBoundaryResult | undefined {
    const g = this.graph
    if (!g) return undefined
    const ids = outerFace(g, p)
    if (!ids) return undefined
    const outer = points(g, ids)
    const outerSources = new Set<number>()
    for (let i = 0; i < ids.length; i++) {
      const k = g.edgeSrc.get(edgeKey(ids[i], ids[(i + 1) % ids.length]))
      if (k !== undefined) outerSources.add(k)
    }
    return {
      outer,
      islands: islands(g, ids, p),
      outerSources: [...outerSources].sort((a, b) => a - b)
    }
  }

  /**
   * The outside outline of every group of curves that encloses an area
   * (counter-clockwise, dangling ends removed).
   */
  closedOutlines(): AcApHatchIsland[] {
    const g = this.graph
    if (!g) return []
    const comp = components(g)
    const core = prune(g)
    const { start, edges } = componentStarts(core, comp)
    const sources = componentSources(g, comp)
    const out: AcApHatchIsland[] = []
    const starts = [...start.entries()].sort((a, b) => a[0] - b[0])
    for (const [c, u] of starts) {
      const lp = outside(core, u, (edges.get(c) ?? 0) + 4)
      if (!lp || lp.length < 3 || !(acapHatchSignedArea(lp) > 0)) continue
      out.push({
        outline: lp,
        sources: [...(sources.get(c) ?? [])].sort((a, b) => a - b)
      })
    }
    return out
  }
}
