import type { ExportCurve, Vec2 } from './types'

/** Affine transform `[a, b, c, d, e, f]`: x' = a·x + c·y + e, y' = b·x + d·y + f. */
export type Affine = [number, number, number, number, number, number]

export const IDENTITY: Affine = [1, 0, 0, 1, 0, 0]

const TAU = Math.PI * 2

export function apply(t: Affine, p: Vec2): Vec2 {
  return [t[0] * p[0] + t[2] * p[1] + t[4], t[1] * p[0] + t[3] * p[1] + t[5]]
}

export function applyVector(t: Affine, v: Vec2): Vec2 {
  return [t[0] * v[0] + t[2] * v[1], t[1] * v[0] + t[3] * v[1]]
}

/** `a ∘ b`: applies `b` first, then `a`. */
export function compose(a: Affine, b: Affine): Affine {
  return [
    a[0] * b[0] + a[2] * b[1],
    a[1] * b[0] + a[3] * b[1],
    a[0] * b[2] + a[2] * b[3],
    a[1] * b[2] + a[3] * b[3],
    a[0] * b[4] + a[2] * b[5] + a[4],
    a[1] * b[4] + a[3] * b[5] + a[5]
  ]
}

export function isIdentity(t: Affine) {
  return t.every((v, i) => v === IDENTITY[i])
}

/**
 * The 2D part of a 4×4 column-major matrix (`AcGeMatrix3d.elements`), as used
 * by block references and the renderer's `applyMatrix`.
 */
export function affineFromMatrix3d(elements: ArrayLike<number>): Affine {
  return [
    elements[0],
    elements[1],
    elements[4],
    elements[5],
    elements[12],
    elements[13]
  ]
}

export function cross(a: Vec2, b: Vec2) {
  return a[0] * b[1] - a[1] * b[0]
}

export function dot(a: Vec2, b: Vec2) {
  return a[0] * b[0] + a[1] * b[1]
}

export function length(v: Vec2) {
  return Math.hypot(v[0], v[1])
}

/** Circular or elliptical arc from AutoCAD-style angles (radians, CCW). */
export function curveFromAxes(
  center: Vec2,
  major: Vec2,
  ratio: number,
  start: number,
  end: number
): ExportCurve {
  const minor: Vec2 = [-major[1] * ratio, major[0] * ratio]
  let e = end
  while (e <= start) e += TAU
  if (e - start > TAU) e -= TAU
  return { center, u: major, v: minor, start, end: e }
}

export function isFullCurve(curve: ExportCurve) {
  return curve.end - curve.start >= TAU - 1e-9
}

/** Applies an affine transform to a curve (exact for any transform). */
export function transformCurve(t: Affine, curve: ExportCurve): ExportCurve {
  const u = applyVector(t, curve.u)
  let v = applyVector(t, curve.v)
  let { start, end } = curve
  if (cross(u, v) < 0) {
    // Mirrored: c + u·cos(t) + v·sin(t) = c + u·cos(−t) + (−v)·sin(−t).
    v = [-v[0], -v[1]]
    ;[start, end] = [-end, -start]
  }
  return { center: apply(t, curve.center), u, v, start, end }
}

export function curvePoint(curve: ExportCurve, t: number): Vec2 {
  const c = Math.cos(t)
  const s = Math.sin(t)
  return [
    curve.center[0] + curve.u[0] * c + curve.v[0] * s,
    curve.center[1] + curve.u[1] * c + curve.v[1] * s
  ]
}

/**
 * Principal axes of a curve. `start` / `end` are parameters on the principal
 * ellipse `center + major·cos(s) + minor·sin(s)`, where `minor` is `major`
 * turned 90° counter-clockwise and scaled by `ratio`.
 */
export interface PrincipalCurve {
  center: Vec2
  /** Semi-major axis vector. */
  major: Vec2
  /** Semi-major and semi-minor lengths (`radiusX ≥ radiusY`). */
  radiusX: number
  radiusY: number
  /** Direction of the major axis, radians. */
  rotation: number
  start: number
  end: number
  full: boolean
  /** True when both radii are equal (within 1e-9 relative). */
  circular: boolean
}

export function principalCurve(curve: ExportCurve): PrincipalCurve {
  const { u, v } = curve
  const uu = dot(u, u)
  const vv = dot(v, v)
  const uv = dot(u, v)
  // Parameter where |u·cos t + v·sin t| is extreme.
  const t0 = 0.5 * Math.atan2(2 * uv, uu - vv)
  const c = Math.cos(t0)
  const s = Math.sin(t0)
  let major: Vec2 = [u[0] * c + v[0] * s, u[1] * c + v[1] * s]
  let minor: Vec2 = [-u[0] * s + v[0] * c, -u[1] * s + v[1] * c]
  let shift = t0
  if (length(minor) > length(major)) {
    // The extreme found is the minimum: take the axis 90° further.
    const next = minor
    minor = [-major[0], -major[1]]
    major = next
    shift = t0 + Math.PI / 2
  }
  const radiusX = length(major)
  const radiusY = length(minor)
  const full = isFullCurve(curve)
  return {
    center: curve.center,
    major,
    radiusX,
    radiusY,
    rotation: Math.atan2(major[1], major[0]),
    start: full ? 0 : curve.start - shift,
    end: full ? TAU : curve.end - shift,
    full,
    circular: Math.abs(radiusX - radiusY) <= 1e-9 * Math.max(radiusX, 1)
  }
}

/** Normalizes an angle to [0, 2π). */
export function normalizeAngle(a: number) {
  const r = a % TAU
  return r < 0 ? r + TAU : r
}

/** Points along a curve, at most `maxAngle` apart (closed curves repeat the first point). */
export function sampleCurve(curve: ExportCurve, maxAngle = Math.PI / 36) {
  const n = Math.max(
    2,
    Math.ceil((curve.end - curve.start) / Math.max(maxAngle, 1e-3))
  )
  const points: Vec2[] = []
  for (let i = 0; i <= n; i++) {
    points.push(
      curvePoint(curve, curve.start + ((curve.end - curve.start) * i) / n)
    )
  }
  return points
}

/**
 * Arc between two polyline vertices with a DXF bulge (tan of a quarter of the
 * included angle; positive = counter-clockwise).
 */
export function bulgeArc(a: Vec2, b: Vec2, bulge: number): ExportCurve {
  const chord = length([b[0] - a[0], b[1] - a[1]])
  const angle = 4 * Math.atan(bulge)
  const radius = chord / (2 * Math.sin(Math.abs(angle) / 2))
  const mid: Vec2 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
  // Distance from the chord midpoint to the centre (signed towards the left).
  const sagitta = Math.sqrt(Math.max(radius * radius - (chord * chord) / 4, 0))
  const dir: Vec2 = [(b[0] - a[0]) / chord, (b[1] - a[1]) / chord]
  const left: Vec2 = [-dir[1], dir[0]]
  // For |angle| < π the centre is on the left of a CCW arc.
  const side = (bulge > 0 ? 1 : -1) * (Math.abs(angle) < Math.PI ? 1 : -1)
  const center: Vec2 = [
    mid[0] + left[0] * sagitta * side,
    mid[1] + left[1] * sagitta * side
  ]
  const sa = Math.atan2(a[1] - center[1], a[0] - center[0])
  const ea = Math.atan2(b[1] - center[1], b[0] - center[0])
  if (bulge > 0) {
    return curveFromAxes(center, [radius, 0], 1, sa, ea)
  }
  // Clockwise from a to b = counter-clockwise from b to a.
  return curveFromAxes(center, [radius, 0], 1, ea, sa)
}

/** Text placement after an affine transform. */
export function transformText(
  t: Affine,
  position: Vec2,
  height: number,
  widthFactor: number,
  rotation: number
) {
  const dir = applyVector(t, [Math.cos(rotation), Math.sin(rotation)])
  const up = applyVector(t, [-Math.sin(rotation), Math.cos(rotation)])
  const sx = length(dir)
  const newRotation = Math.atan2(dir[1], dir[0])
  // Height scale: the part of the transformed up vector perpendicular to the
  // new baseline (mirroring keeps the text readable, like MIRRTEXT = 0).
  const sy = sx > 0 ? Math.abs(cross(dir, up)) / sx : length(up)
  return {
    position: apply(t, position),
    height: height * sy,
    widthFactor: sy > 0 ? (widthFactor * sx) / sy : widthFactor,
    rotation: newRotation
  }
}
