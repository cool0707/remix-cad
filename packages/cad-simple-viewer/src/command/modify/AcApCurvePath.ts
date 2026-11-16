import {
  AcDbArc,
  AcDbCircle,
  AcDbEntity,
  AcDbLine,
  AcDbPolyline,
  AcGePoint2d,
  AcGePoint3d
} from '@mlightcad/data-model'

/**
 * Plane geometry shared by TRIM / EXTEND / BREAK / FILLET / CHAMFER / STRETCH.
 *
 * A supported curve (line, arc, circle, lightweight polyline in the XY plane)
 * is read into a {@link AcApCurvePath}: a chain of straight and circular
 * segments. A position on the path is the parameter `t = segment index +
 * fraction along that segment` (`0 … segs.length`); closed paths (circle,
 * closed polyline) wrap around. The edits work on parameters and write the
 * result back into entities of the same kind.
 */

/** 2D point */
export interface AcApXY {
  x: number
  y: number
}

/** Straight segment from `a` to `b` */
export interface AcApLineSeg {
  kind: 'line'
  a: AcApXY
  b: AcApXY
  /** Polyline widths at the start / end of the segment */
  sw?: number
  ew?: number
}

/** Circular segment: starts at angle `a0`, turns by `sweep` (+ = CCW) */
export interface AcApArcSeg {
  kind: 'arc'
  c: AcApXY
  r: number
  a0: number
  sweep: number
  sw?: number
  ew?: number
}

export type AcApSeg = AcApLineSeg | AcApArcSeg

/** Kind of entity a path was read from (and is written back to) */
export type AcApCurveKind = 'line' | 'arc' | 'circle' | 'polyline'

export interface AcApCurvePath {
  kind: AcApCurveKind
  segs: AcApSeg[]
  closed: boolean
  /** Elevation (Z) of the curve */
  z: number
}

export const ACAP_GEOM_EPS = 1e-9
const TWO_PI = Math.PI * 2

const sub = (a: AcApXY, b: AcApXY): AcApXY => ({ x: a.x - b.x, y: a.y - b.y })
const add = (a: AcApXY, b: AcApXY): AcApXY => ({ x: a.x + b.x, y: a.y + b.y })
const mul = (a: AcApXY, s: number): AcApXY => ({ x: a.x * s, y: a.y * s })
const dot = (a: AcApXY, b: AcApXY) => a.x * b.x + a.y * b.y
const cross = (a: AcApXY, b: AcApXY) => a.x * b.y - a.y * b.x
const len = (a: AcApXY) => Math.hypot(a.x, a.y)
export const acapDist = (a: AcApXY, b: AcApXY) => len(sub(a, b))

/** Angle normalized to `[0, 2π)` */
export function acapNormAngle(a: number) {
  const r = a % TWO_PI
  return r < 0 ? r + TWO_PI : r
}

/** Length tolerance relative to the size of the geometry */
function tolFor(path: AcApCurvePath) {
  let size = 0
  for (const seg of path.segs) {
    size = Math.max(
      size,
      seg.kind === 'line' ? acapDist(seg.a, seg.b) : seg.r * 2
    )
  }
  return Math.max(size * 1e-9, 1e-9)
}

// ---------------------------------------------------------------------------
// Reading entities
// ---------------------------------------------------------------------------

interface RawPolylineVertex {
  x: number
  y: number
  bulge?: number
  startWidth?: number
  endWidth?: number
}

/** Vertices of a lightweight polyline, including bulges and widths. */
export function acapPolylineVertices(
  entity: AcDbPolyline
): RawPolylineVertex[] {
  const runtime = (
    entity as unknown as { _geo?: { vertices?: RawPolylineVertex[] } }
  )._geo?.vertices
  if (runtime && runtime.length === entity.numberOfVertices) {
    return runtime.map(v => ({ ...v }))
  }
  return Array.from({ length: entity.numberOfVertices }, (_, i) => {
    const p = entity.getPoint2dAt(i)
    return { x: p.x, y: p.y, bulge: 0 }
  })
}

/** Segment between two polyline vertices with a bulge. */
export function acapBulgeSeg(
  a: AcApXY,
  b: AcApXY,
  bulge: number,
  sw?: number,
  ew?: number
): AcApSeg {
  const d = acapDist(a, b)
  if (Math.abs(bulge) < 1e-12 || d < ACAP_GEOM_EPS) {
    return { kind: 'line', a: { ...a }, b: { ...b }, sw, ew }
  }
  const u = mul(sub(b, a), 1 / d)
  const n = { x: -u.y, y: u.x }
  const h = (d * (1 - bulge * bulge)) / (4 * bulge)
  const c = add(mul(add(a, b), 0.5), mul(n, h))
  const r = (d * (1 + bulge * bulge)) / (4 * Math.abs(bulge))
  return {
    kind: 'arc',
    c,
    r,
    a0: Math.atan2(a.y - c.y, a.x - c.x),
    sweep: 4 * Math.atan(bulge),
    sw,
    ew
  }
}

/** True when the normal points along +Z or −Z (the curve lies in the XY plane). */
function isPlanView(normal: { x: number; y: number; z: number } | undefined) {
  if (!normal) return true
  return Math.abs(normal.x) < 1e-9 && Math.abs(normal.y) < 1e-9
}

/**
 * Reads a supported entity into a path, or `undefined` for anything else
 * (ellipse, spline, 3D polylines, curves not in the XY plane…).
 */
export function acapReadCurvePath(
  entity: AcDbEntity
): AcApCurvePath | undefined {
  if (entity instanceof AcDbLine) {
    const s = entity.startPoint
    const e = entity.endPoint
    if (Math.abs(s.z - e.z) > 1e-9) return undefined
    return {
      kind: 'line',
      segs: [{ kind: 'line', a: { x: s.x, y: s.y }, b: { x: e.x, y: e.y } }],
      closed: false,
      z: s.z
    }
  }
  if (entity instanceof AcDbArc) {
    if (!isPlanView(entity.normal)) return undefined
    const c = entity.center
    const s = entity.startPoint
    const e = entity.endPoint
    const m = entity.midPoint
    const a0 = Math.atan2(s.y - c.y, s.x - c.x)
    const a1 = Math.atan2(e.y - c.y, e.x - c.x)
    const am = Math.atan2(m.y - c.y, m.x - c.x)
    const ccwSweep = acapNormAngle(a1 - a0) || TWO_PI
    const ccw = acapNormAngle(am - a0) <= ccwSweep + 1e-12
    return {
      kind: 'arc',
      segs: [
        {
          kind: 'arc',
          c: { x: c.x, y: c.y },
          r: entity.radius,
          a0,
          sweep: ccw ? ccwSweep : -(acapNormAngle(a0 - a1) || TWO_PI)
        }
      ],
      closed: false,
      z: c.z
    }
  }
  if (entity instanceof AcDbCircle) {
    if (!isPlanView(entity.normal)) return undefined
    const c = entity.center
    return {
      kind: 'circle',
      segs: [
        { kind: 'arc', c: { x: c.x, y: c.y }, r: entity.radius, a0: 0, sweep: TWO_PI }
      ],
      closed: true,
      z: c.z
    }
  }
  if (entity instanceof AcDbPolyline) {
    const normal = entity.normal
    if (!normal || Math.abs(normal.z - 1) > 1e-9) return undefined
    const vertices = acapPolylineVertices(entity)
    const n = vertices.length
    if (n < 2) return undefined
    const closed = entity.closed
    const segs: AcApSeg[] = []
    const count = closed ? n : n - 1
    for (let i = 0; i < count; i++) {
      const v = vertices[i]
      const w = vertices[(i + 1) % n]
      segs.push(acapBulgeSeg(v, w, v.bulge ?? 0, v.startWidth, v.endWidth))
    }
    return { kind: 'polyline', segs, closed, z: entity.elevation }
  }
  return undefined
}

// ---------------------------------------------------------------------------
// Points and parameters
// ---------------------------------------------------------------------------

export function acapSegPointAt(seg: AcApSeg, f: number): AcApXY {
  if (seg.kind === 'line') return add(seg.a, mul(sub(seg.b, seg.a), f))
  const a = seg.a0 + seg.sweep * f
  return { x: seg.c.x + seg.r * Math.cos(a), y: seg.c.y + seg.r * Math.sin(a) }
}

export function acapSegStart(seg: AcApSeg) {
  return acapSegPointAt(seg, 0)
}

export function acapSegEnd(seg: AcApSeg) {
  return acapSegPointAt(seg, 1)
}

/** Unit tangent of a segment at fraction `f`, in the direction of travel. */
export function acapSegTangent(seg: AcApSeg, f: number): AcApXY {
  if (seg.kind === 'line') {
    const d = sub(seg.b, seg.a)
    const l = len(d) || 1
    return mul(d, 1 / l)
  }
  const a = seg.a0 + seg.sweep * f
  const s = Math.sign(seg.sweep) || 1
  return { x: -Math.sin(a) * s, y: Math.cos(a) * s }
}

/** Number of segments = parameter length of the path */
export function acapPathLength(path: AcApCurvePath) {
  return path.segs.length
}

export function acapPathPointAt(path: AcApCurvePath, t: number): AcApXY {
  const n = path.segs.length
  if (path.closed) t = ((t % n) + n) % n
  t = Math.min(Math.max(t, 0), n)
  const i = Math.min(Math.floor(t), n - 1)
  return acapSegPointAt(path.segs[i], t - i)
}

/** Closest fraction on one segment and its distance to `p`. */
function projectOnSeg(seg: AcApSeg, p: AcApXY): { f: number; d: number } {
  if (seg.kind === 'line') {
    const d = sub(seg.b, seg.a)
    const l2 = dot(d, d)
    const f = l2 > 0 ? Math.min(Math.max(dot(sub(p, seg.a), d) / l2, 0), 1) : 0
    return { f, d: acapDist(p, acapSegPointAt(seg, f)) }
  }
  const ang = Math.atan2(p.y - seg.c.y, p.x - seg.c.x)
  const delta =
    seg.sweep >= 0 ? acapNormAngle(ang - seg.a0) : acapNormAngle(seg.a0 - ang)
  const span = Math.abs(seg.sweep)
  let f: number
  if (delta <= span) {
    f = span > 0 ? delta / span : 0
  } else {
    // Outside the arc: the nearer end.
    const s = acapSegStart(seg)
    const e = acapSegEnd(seg)
    f = acapDist(p, s) <= acapDist(p, e) ? 0 : 1
  }
  return { f, d: acapDist(p, acapSegPointAt(seg, f)) }
}

/** Parameter of the point on the path closest to `p`, and the distance. */
export function acapProjectOnPath(
  path: AcApCurvePath,
  p: AcApXY
): { t: number; d: number } {
  let best = { t: 0, d: Infinity }
  path.segs.forEach((seg, i) => {
    const r = projectOnSeg(seg, p)
    if (r.d < best.d - 1e-12) best = { t: i + r.f, d: r.d }
  })
  if (path.closed && best.t >= path.segs.length) best.t = 0
  return best
}

/**
 * Parameters of the given points that lie on the path (sorted, without
 * duplicates). Points farther than `tol` from the path are dropped.
 */
export function acapParamsOfPoints(
  path: AcApCurvePath,
  points: AcApXY[],
  tol?: number
): number[] {
  const eps = tol ?? Math.max(tolFor(path) * 1e3, 1e-6)
  const out: number[] = []
  for (const p of points) {
    const r = acapProjectOnPath(path, p)
    if (r.d > eps) continue
    if (out.some(t => Math.abs(t - r.t) < 1e-9)) continue
    out.push(r.t)
  }
  return out.sort((a, b) => a - b)
}

// ---------------------------------------------------------------------------
// Sub paths
// ---------------------------------------------------------------------------

function subSeg(seg: AcApSeg, f0: number, f1: number): AcApSeg {
  const lerpW = (f: number) =>
    seg.sw == null && seg.ew == null
      ? undefined
      : (seg.sw ?? 0) + ((seg.ew ?? 0) - (seg.sw ?? 0)) * f
  const sw = lerpW(f0)
  const ew = lerpW(f1)
  if (seg.kind === 'line') {
    return {
      kind: 'line',
      a: acapSegPointAt(seg, f0),
      b: acapSegPointAt(seg, f1),
      sw,
      ew
    }
  }
  return {
    kind: 'arc',
    c: { ...seg.c },
    r: seg.r,
    a0: seg.a0 + seg.sweep * f0,
    sweep: seg.sweep * (f1 - f0),
    sw,
    ew
  }
}

/**
 * Segments of the path between parameters `t0 < t1`. On a closed path `t1`
 * may exceed the path length (the range wraps past the start).
 */
export function acapSubPath(
  path: AcApCurvePath,
  t0: number,
  t1: number
): AcApSeg[] {
  const n = path.segs.length
  const out: AcApSeg[] = []
  if (!(t1 > t0)) return out
  const first = Math.floor(t0 + 1e-12)
  for (let k = first; k < t1 - 1e-12; k++) {
    const idx = ((k % n) + n) % n
    if (!path.closed && (k < 0 || k >= n)) continue
    const f0 = Math.max(t0 - k, 0)
    const f1 = Math.min(t1 - k, 1)
    if (f1 - f0 < 1e-12) continue
    out.push(subSeg(path.segs[idx], f0, f1))
  }
  return out
}

/** True when the segments have (nearly) no length. */
export function acapSegsDegenerate(segs: AcApSeg[], tol = 1e-9) {
  let total = 0
  for (const seg of segs) {
    total +=
      seg.kind === 'line' ? acapDist(seg.a, seg.b) : Math.abs(seg.sweep) * seg.r
  }
  return total <= tol
}

// ---------------------------------------------------------------------------
// Edits on parameters
// ---------------------------------------------------------------------------

/** Pieces that remain after removing a range, or `null` when it cannot be done. */
export type AcApPieces = AcApSeg[][] | null

/**
 * TRIM: removes the part of the path around `pickT` delimited by the nearest
 * cut parameters. Without any cut the whole object goes (the "quick" trim).
 * A closed path needs two cuts; with one, `null` is returned.
 */
export function acapTrimPieces(
  path: AcApCurvePath,
  cuts: number[],
  pickT: number
): AcApPieces {
  const n = path.segs.length
  const eps = 1e-9
  if (!path.closed) {
    const inner = cuts.filter(t => t > eps && t < n - eps)
    if (inner.length === 0) return []
    let lo = 0
    let hi = n
    for (const t of inner) {
      if (t < pickT && t > lo) lo = t
      if (t > pickT && t < hi) hi = t
    }
    const pieces: AcApSeg[][] = []
    if (lo > eps) pieces.push(acapSubPath(path, 0, lo))
    if (hi < n - eps) pieces.push(acapSubPath(path, hi, n))
    return pieces.filter(p => !acapSegsDegenerate(p))
  }
  const unique = [...new Set(cuts.map(t => ((t % n) + n) % n))].sort(
    (a, b) => a - b
  )
  if (unique.length === 0) return []
  if (unique.length === 1) return null
  // Nearest cut before and after the pick, going around.
  let lo = -Infinity
  let hi = Infinity
  for (const t of unique) {
    if (t <= pickT && t > lo) lo = t
    if (t > pickT && t < hi) hi = t
  }
  if (lo === -Infinity) lo = unique[unique.length - 1] - n
  if (hi === Infinity) hi = unique[0] + n
  const piece = acapSubPath(path, hi, lo + n)
  return acapSegsDegenerate(piece) ? [] : [piece]
}

/**
 * BREAK: removes the part between `t1` and `t2`. On an open path the order
 * does not matter and equal parameters split the path in two. On a closed
 * path the part from `t1` to `t2` in the path direction (CCW for circles)
 * is removed.
 */
export function acapBreakPieces(
  path: AcApCurvePath,
  t1: number,
  t2: number
): AcApPieces {
  const n = path.segs.length
  if (!path.closed) {
    const lo = Math.min(t1, t2)
    const hi = Math.max(t1, t2)
    const pieces: AcApSeg[][] = []
    if (lo > 1e-9) pieces.push(acapSubPath(path, 0, lo))
    if (hi < n - 1e-9) pieces.push(acapSubPath(path, hi, n))
    const kept = pieces.filter(p => !acapSegsDegenerate(p))
    if (Math.abs(hi - lo) < 1e-9 && kept.length < 2) return null
    return kept
  }
  const a = ((t1 % n) + n) % n
  let b = ((t2 % n) + n) % n
  if (Math.abs(a - b) < 1e-9) return null
  if (b < a) b += n
  // Keep from b around to a.
  const piece = acapSubPath(path, b, a + n)
  return acapSegsDegenerate(piece) ? [] : [piece]
}

/** Which end of an open path is nearer to parameter `t`. */
export function acapNearerEnd(path: AcApCurvePath, t: number): 'start' | 'end' {
  return t < path.segs.length / 2 ? 'start' : 'end'
}

/**
 * EXTEND helper: the segment at one end of an open path as a stand-alone
 * entity (line or arc), so that `intersectWith(…, ExtendThis)` can find where
 * its extension meets a boundary.
 */
export function acapEndSegEntity(
  path: AcApCurvePath,
  end: 'start' | 'end'
): AcDbEntity {
  const seg = end === 'start' ? path.segs[0] : path.segs[path.segs.length - 1]
  return segToEntity(seg, path.z)
}

/**
 * EXTEND: the path with its `end` segment lengthened to the nearest of the
 * given points that lies on the extension, or `undefined` when none does.
 */
export function acapExtendPath(
  path: AcApCurvePath,
  end: 'start' | 'end',
  hits: AcApXY[]
): AcApCurvePath | undefined {
  if (path.closed) return undefined
  const segs = path.segs.map(s => ({ ...s }))
  const index = end === 'start' ? 0 : segs.length - 1
  const seg = segs[index]
  const tol = Math.max(tolFor(path) * 1e3, 1e-7)
  if (seg.kind === 'line') {
    const d = sub(seg.b, seg.a)
    const l = len(d)
    if (l < ACAP_GEOM_EPS) return undefined
    const u = mul(d, 1 / l)
    const from = end === 'end' ? seg.b : seg.a
    const dir = end === 'end' ? u : mul(u, -1)
    let best = Infinity
    for (const p of hits) {
      const v = sub(p, from)
      const s = dot(v, dir)
      if (s <= tol) continue
      if (Math.abs(cross(dir, v)) > tol * 10 + s * 1e-7) continue
      if (s < best) best = s
    }
    if (best === Infinity) return undefined
    const target = add(from, mul(dir, best))
    if (end === 'end') seg.b = target
    else seg.a = target
  } else {
    const span = Math.abs(seg.sweep)
    const sgn = Math.sign(seg.sweep) || 1
    const endAngle = seg.a0 + seg.sweep
    let best = Infinity
    for (const p of hits) {
      if (Math.abs(acapDist(p, seg.c) - seg.r) > tol * 10) continue
      const ang = Math.atan2(p.y - seg.c.y, p.x - seg.c.x)
      // Angle travelled beyond the end (forwards) or before the start (backwards).
      const delta =
        end === 'end'
          ? acapNormAngle(sgn * (ang - endAngle))
          : acapNormAngle(-sgn * (ang - seg.a0))
      if (delta <= 1e-9 || delta >= TWO_PI - span - 1e-9) continue
      if (delta < best) best = delta
    }
    if (best === Infinity) return undefined
    if (end === 'end') {
      seg.sweep = sgn * (span + best)
    } else {
      seg.a0 = seg.a0 - sgn * best
      seg.sweep = sgn * (span + best)
    }
  }
  segs[index] = seg
  return { ...path, segs }
}

// ---------------------------------------------------------------------------
// Writing back
// ---------------------------------------------------------------------------

function toPoint3d(p: AcApXY, z: number) {
  return new AcGePoint3d(p.x, p.y, z)
}

function arcAngles(seg: AcApArcSeg) {
  // AcDbArc runs CCW from startAngle to endAngle.
  return seg.sweep >= 0
    ? { start: seg.a0, end: seg.a0 + seg.sweep }
    : { start: seg.a0 + seg.sweep, end: seg.a0 }
}

function segToEntity(seg: AcApSeg, z: number): AcDbEntity {
  if (seg.kind === 'line') {
    return new AcDbLine(toPoint3d(seg.a, z), toPoint3d(seg.b, z))
  }
  const { start, end } = arcAngles(seg)
  return new AcDbArc(
    toPoint3d(seg.c, z),
    seg.r,
    acapNormAngle(start),
    acapNormAngle(end)
  )
}

/**
 * Writes segments into `target` when it is of a kind that can hold them
 * (line ← one line segment, arc ← one arc segment, polyline ← any chain).
 * Returns `false` when it cannot, e.g. a circle that became an arc.
 */
export function acapWriteSegs(
  target: AcDbEntity,
  segs: AcApSeg[],
  z: number
): boolean {
  if (segs.length === 0) return false
  if (target instanceof AcDbLine) {
    if (segs.length !== 1 || segs[0].kind !== 'line') return false
    target.startPoint = toPoint3d(segs[0].a, z)
    target.endPoint = toPoint3d(segs[0].b, z)
    return true
  }
  if (target instanceof AcDbArc) {
    if (segs.length !== 1 || segs[0].kind !== 'arc') return false
    const seg = segs[0]
    const { start, end } = arcAngles(seg)
    if (target.normal.z < 0) target.normal = { x: 0, y: 0, z: 1 }
    target.center = toPoint3d(seg.c, z)
    target.radius = seg.r
    target.startAngle = acapNormAngle(start)
    target.endAngle = acapNormAngle(end)
    return true
  }
  if (target instanceof AcDbPolyline) {
    target.reset(false)
    segs.forEach((seg, i) => {
      const s = acapSegStart(seg)
      const bulge = seg.kind === 'arc' ? Math.tan(seg.sweep / 4) : 0
      target.addVertexAt(i, new AcGePoint2d(s.x, s.y), bulge, seg.sw, seg.ew)
    })
    const last = segs[segs.length - 1]
    const e = acapSegEnd(last)
    target.addVertexAt(segs.length, new AcGePoint2d(e.x, e.y), 0, last.ew, last.ew)
    target.closed = false
    target.elevation = z
    return true
  }
  return false
}

/**
 * Creates a new entity for segments (line, arc, or polyline for chains).
 * `template` decides the kind: a polyline stays a polyline even with one
 * segment so that widths survive.
 */
export function acapEntityFromSegs(
  kind: AcApCurveKind,
  segs: AcApSeg[],
  z: number
): AcDbEntity {
  if (kind !== 'polyline' && segs.length === 1) return segToEntity(segs[0], z)
  const pl = new AcDbPolyline()
  acapWriteSegs(pl, segs, z)
  return pl
}

/** True when the path is a single closed loop that `segs` covers completely. */
export function acapIsWholeClosed(path: AcApCurvePath, segs: AcApSeg[]) {
  if (!path.closed || segs.length === 0) return false
  const s = acapSegStart(segs[0])
  const e = acapSegEnd(segs[segs.length - 1])
  return acapDist(s, e) < 1e-9
}

// ---------------------------------------------------------------------------
// Corners (FILLET / CHAMFER)
// ---------------------------------------------------------------------------

/** Intersection of two infinite lines, or `undefined` when parallel. */
export function acapLineLineIntersection(
  p1: AcApXY,
  d1: AcApXY,
  p2: AcApXY,
  d2: AcApXY
): AcApXY | undefined {
  const den = cross(d1, d2)
  if (Math.abs(den) < 1e-12 * len(d1) * len(d2)) return undefined
  const t = cross(sub(p2, p1), d2) / den
  return add(p1, mul(d1, t))
}

export interface AcApCornerResult {
  /** New end of the first line (where it meets the fillet / chamfer) */
  t1: AcApXY
  /** New end of the second line */
  t2: AcApXY
  /** Fillet arc from t1 to t2 (absent for chamfers and radius 0) */
  arc?: AcApArcSeg
}

/**
 * Corner between two lines that meet at `p`; `u1` / `u2` are the unit
 * directions from `p` along the parts that are kept.
 *
 * - Fillet: `mode = { radius }`
 * - Chamfer: `mode = { d1, d2 }`
 *
 * Returns `undefined` when the lines are collinear.
 */
export function acapCorner(
  p: AcApXY,
  u1: AcApXY,
  u2: AcApXY,
  mode: { radius: number } | { d1: number; d2: number }
): AcApCornerResult | undefined {
  const cosT = Math.min(Math.max(dot(u1, u2), -1), 1)
  const theta = Math.acos(cosT)
  if (theta < 1e-9 || Math.PI - theta < 1e-9) return undefined
  if ('radius' in mode) {
    if (mode.radius <= 0) return { t1: { ...p }, t2: { ...p } }
    const t = mode.radius / Math.tan(theta / 2)
    const t1 = add(p, mul(u1, t))
    const t2 = add(p, mul(u2, t))
    const bis = add(u1, u2)
    const c = add(p, mul(bis, mode.radius / Math.sin(theta / 2) / len(bis)))
    const a0 = Math.atan2(t1.y - c.y, t1.x - c.x)
    const a1 = Math.atan2(t2.y - c.y, t2.x - c.x)
    let sweep = acapNormAngle(a1 - a0)
    if (sweep > Math.PI) sweep -= TWO_PI
    return { t1, t2, arc: { kind: 'arc', c, r: mode.radius, a0, sweep } }
  }
  return { t1: add(p, mul(u1, mode.d1)), t2: add(p, mul(u2, mode.d2)) }
}

/** Distance along `u` from `p` to the corner point a fillet / chamfer needs. */
export function acapCornerReach(
  u1: AcApXY,
  u2: AcApXY,
  mode: { radius: number } | { d1: number; d2: number }
): [number, number] {
  if ('radius' in mode) {
    const theta = Math.acos(Math.min(Math.max(dot(u1, u2), -1), 1))
    const t = mode.radius > 0 ? mode.radius / Math.tan(theta / 2) : 0
    return [t, t]
  }
  return [mode.d1, mode.d2]
}

export const acapVec = { sub, add, mul, dot, cross, len }
