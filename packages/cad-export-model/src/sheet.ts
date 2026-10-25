import type { ExportPaperName, ExportSheet, Vec2 } from './types'

/** ISO A sheets, landscape (width ≥ height), millimetres. */
export const PAPER_SIZES: Record<ExportPaperName, [number, number]> = {
  A0: [1189, 841],
  A1: [841, 594],
  A2: [594, 420],
  A3: [420, 297],
  A4: [297, 210]
}

/** Scale denominators offered when the scale is chosen automatically. */
export const STANDARD_SCALES = [
  1, 2, 2.5, 5, 10, 20, 25, 30, 40, 50, 60, 100, 150, 200, 250, 300, 400, 500,
  600, 1000, 1200, 1500, 2000, 2500, 3000, 5000, 10000, 20000, 25000, 50000,
  100000
]

export interface SheetOptions {
  /** Paper size; chosen from the drawing limits, else A3. */
  paper?: ExportPaperName
  /** Paper orientation; from the limits or the shape of the drawing. */
  portrait?: boolean
  /** Scale denominator; from the limits, else the smallest standard scale that fits. */
  scale?: number
}

export interface Box {
  min: Vec2
  max: Vec2
}

/**
 * The paper / scale the drawing limits describe, when they are exactly a
 * sheet multiplied by a scale (drawings read from JWW and SXF, and drawings
 * set up with LIMITS for a sheet).
 */
export function sheetFromLimits(
  limits: Box | undefined
): ExportSheet | undefined {
  if (!limits) return undefined
  const w = limits.max[0] - limits.min[0]
  const h = limits.max[1] - limits.min[1]
  if (!(w > 0 && h > 0)) return undefined
  // A2 and A4 have exactly proportional sizes (594 × 420 = 2 × 297 × 210):
  // prefer a standard scale, then the smaller sheet.
  let found: ExportSheet | undefined
  const papers = (Object.keys(PAPER_SIZES) as ExportPaperName[]).reverse()
  for (const paper of papers) {
    for (const portrait of [false, true]) {
      const [lw, lh] = PAPER_SIZES[paper]
      const [pw, ph] = portrait ? [lh, lw] : [lw, lh]
      const scale = w / pw
      if (Math.abs(h / ph - scale) > 1e-6 * scale) continue
      const sheet: ExportSheet = {
        paper,
        portrait,
        width: pw,
        height: ph,
        scale: Number(scale.toPrecision(10)),
        origin: [limits.min[0], limits.min[1]]
      }
      if (STANDARD_SCALES.includes(sheet.scale)) return sheet
      found ??= sheet
    }
  }
  return found
}

/**
 * Chooses the sheet for a drawing: the limits when they describe one, else
 * the requested paper (A3 by default) at the smallest standard scale where
 * the drawing fits with a margin, centred on the drawing.
 */
export function chooseSheet(
  extents: Box | undefined,
  limits: Box | undefined,
  options: SheetOptions = {}
): ExportSheet {
  const fromLimits = sheetFromLimits(limits)
  if (
    fromLimits &&
    (options.paper == null || options.paper === fromLimits.paper) &&
    (options.portrait == null || options.portrait === fromLimits.portrait) &&
    (options.scale == null || options.scale === fromLimits.scale)
  ) {
    return fromLimits
  }
  const box = extents ?? { min: [0, 0], max: [0, 0] }
  const w = Math.max(box.max[0] - box.min[0], 0)
  const h = Math.max(box.max[1] - box.min[1], 0)
  const paper = options.paper ?? fromLimits?.paper ?? 'A3'
  const portrait = options.portrait ?? fromLimits?.portrait ?? h > w * 1.05
  const [lw, lh] = PAPER_SIZES[paper]
  const [pw, ph] = portrait ? [lh, lw] : [lw, lh]
  let scale = options.scale
  if (!(scale && scale > 0)) {
    // Leave 7.5 % of the sheet as a margin on each side.
    const needed = Math.max(w / (pw * 0.85), h / (ph * 0.85), 1e-9)
    scale =
      STANDARD_SCALES.find(s => s >= needed - 1e-9) ??
      Math.ceil(needed / 100000) * 100000
  }
  const cx = (box.min[0] + box.max[0]) / 2
  const cy = (box.min[1] + box.max[1]) / 2
  return {
    paper,
    portrait,
    width: pw,
    height: ph,
    scale,
    origin: [cx - (pw * scale) / 2, cy - (ph * scale) / 2]
  }
}

/** Millimetres per drawing unit for an `$INSUNITS` value (unitless = mm). */
export function unitsToMillimetres(insunits: number | undefined) {
  switch (insunits) {
    case 1:
      return 25.4
    case 2:
      return 304.8
    case 3:
      return 1609344
    case 5:
      return 10
    case 6:
      return 1000
    case 7:
      return 1000000
    case 8:
      return 0.0000254
    case 9:
      return 0.0254
    case 10:
      return 914.4
    case 11:
      return 1e-7
    case 12:
      return 1e-6
    case 13:
      return 0.001
    case 14:
      return 100
    case 15:
      return 10000
    case 16:
      return 100000
    default:
      return 1
  }
}
