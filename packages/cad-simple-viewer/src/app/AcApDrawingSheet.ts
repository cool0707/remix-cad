import {
  chooseSheet,
  type ExportPaperName,
  type ExportSheet,
  sheetFromLimits,
  type SheetOptions,
  STANDARD_SCALES,
  unitsToMillimetres
} from '@mlightcad/cad-export-model'
import type { AcDbDatabase } from '@mlightcad/data-model'

export type { ExportPaperName as AcApPaperName, SheetOptions as AcApSheetOptions }

/** Sheet of a drawing, in millimetres and in drawing units. */
export interface AcApDrawingSheet {
  /** Paper, orientation and scale; `origin` in model millimetres. */
  sheet: ExportSheet
  /** Millimetres per drawing unit (`$INSUNITS`). */
  unit: number
  /** The sheet rectangle in drawing units (the area printed on the paper). */
  min: { x: number; y: number }
  max: { x: number; y: number }
}

/** Whether any of the sheet options is set (all unset = automatic). */
export function acapHasSheetOptions(options: SheetOptions | undefined) {
  return (
    !!options &&
    (options.paper != null || options.portrait != null || options.scale != null)
  )
}

/**
 * Model-space extents of the visible entities, in drawing units. Cheaper than
 * flattening the drawing; used to propose a sheet.
 */
export function acapModelSpaceExtents(db: AcDbDatabase) {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const entity of db.tables.blockTable.modelSpace.newIterator()) {
    if (!entity.visibility || !db.isLayerDrawable(entity.layer)) continue
    let box
    try {
      box = entity.geometricExtents
    } catch {
      continue
    }
    if (!box || box.isEmpty()) continue
    const values = [box.min.x, box.min.y, box.max.x, box.max.y]
    if (!values.every(Number.isFinite)) continue
    minX = Math.min(minX, box.min.x)
    minY = Math.min(minY, box.min.y)
    maxX = Math.max(maxX, box.max.x)
    maxY = Math.max(maxY, box.max.y)
  }
  if (!Number.isFinite(minX)) return undefined
  return { min: { x: minX, y: minY }, max: { x: maxX, y: maxY } }
}

/**
 * Resolves the sheet a drawing is exported on: the drawing limits when they
 * describe a sheet, otherwise the requested paper (A3 by default) at the
 * smallest standard scale that fits (see `chooseSheet` in
 * `@mlightcad/cad-export-model`, which the JWW / SXF writers use too).
 *
 * @param extents - Model-space extents in drawing units, when already known
 *   (see {@link acapModelSpaceExtents})
 */
export function acapResolveDrawingSheet(
  db: AcDbDatabase,
  options: SheetOptions = {},
  extents = acapModelSpaceExtents(db)
): AcApDrawingSheet {
  const unit = unitsToMillimetres(db.insunits)
  const limits = db as unknown as {
    limmin?: { x: number; y: number }
    limmax?: { x: number; y: number }
  }
  const mm = (p: { x: number; y: number }): [number, number] => [
    p.x * unit,
    p.y * unit
  ]
  const sheet = chooseSheet(
    extents ? { min: mm(extents.min), max: mm(extents.max) } : undefined,
    limits.limmin && limits.limmax
      ? { min: mm(limits.limmin), max: mm(limits.limmax) }
      : undefined,
    options
  )
  const min = { x: sheet.origin[0] / unit, y: sheet.origin[1] / unit }
  return {
    sheet,
    unit,
    min,
    max: {
      x: min.x + (sheet.width * sheet.scale) / unit,
      y: min.y + (sheet.height * sheet.scale) / unit
    }
  }
}

/**
 * Hatch pattern scale (`HPSCALE`) that keeps patterns at their paper size on
 * the drawing's sheet: the scale of the sheet the drawing limits describe
 * (drawings read from JWW and SXF in real-world units, e.g. 100 for 1/100),
 * in drawing units. 1 when the limits are not a sheet at a standard scale.
 */
export function acapDrawingHatchScale(db: AcDbDatabase) {
  const unit = unitsToMillimetres(db.insunits)
  const limits = db as unknown as {
    limmin?: { x: number; y: number }
    limmax?: { x: number; y: number }
  }
  if (!limits.limmin || !limits.limmax) return 1
  const sheet = sheetFromLimits({
    min: [limits.limmin.x * unit, limits.limmin.y * unit],
    max: [limits.limmax.x * unit, limits.limmax.y * unit]
  })
  if (!sheet || !STANDARD_SCALES.includes(sheet.scale)) return 1
  return sheet.scale / unit
}

/**
 * Writes `$LIMMIN` / `$LIMMAX` into the HEADER section of ASCII DXF text,
 * replacing existing values.
 */
export function acapSetDxfLimits(
  dxf: string,
  min: { x: number; y: number },
  max: { x: number; y: number }
): string {
  const eol = dxf.includes('\r\n') ? '\r\n' : '\n'
  const lines = dxf.split(/\r?\n/)
  const value = (n: number) => String(Number(n.toFixed(10)))
  const variable = (name: string, p: { x: number; y: number }) => [
    '  9',
    name,
    ' 10',
    value(p.x),
    ' 20',
    value(p.y)
  ]
  // Remove existing $LIMMIN / $LIMMAX (a name and its 10 / 20 pairs).
  for (const name of ['$LIMMIN', '$LIMMAX']) {
    const i = lines.findIndex(
      (line, index) => index % 2 === 1 && line.trim() === name
    )
    if (i < 0) continue
    let end = i + 1
    while (
      end + 1 < lines.length &&
      ['10', '20', '30'].includes(lines[end].trim())
    ) {
      end += 2
    }
    lines.splice(i - 1, end - i + 1)
  }
  const header = lines.findIndex(
    (line, index) =>
      index % 2 === 1 &&
      line.trim() === 'HEADER' &&
      lines[index - 1].trim() === '2'
  )
  if (header < 0) return dxf
  lines.splice(
    header + 1,
    0,
    ...variable('$LIMMIN', min),
    ...variable('$LIMMAX', max)
  )
  return lines.join(eol)
}

/** What an export asks the user before it runs. */
export interface AcApExportSheetRequest {
  /** Format name shown in the dialog title (`DXF`, `JWW`, …). */
  formatName: string
  /** The format has landscape sheets only (Jw_cad). */
  landscapeOnly?: boolean
  /**
   * The automatic choice keeps the file as it is instead of picking a sheet
   * (DXF: the drawing limits are left unchanged).
   */
  autoKeepsDrawing?: boolean
}

/** Asks for the sheet; resolves `undefined` when the user cancels. */
export type AcApExportSheetPrompt = (
  request: AcApExportSheetRequest
) => Promise<SheetOptions | undefined>

let sheetPrompt: AcApExportSheetPrompt | undefined

/**
 * Installs the UI that asks for the paper and scale before DXF / JWW / SXF
 * export (cad-viewer installs a dialog). Without one, exports use the
 * automatic sheet.
 */
export function acapSetExportSheetPrompt(prompt?: AcApExportSheetPrompt) {
  sheetPrompt = prompt
}

/** Asks for the export sheet through the installed prompt (automatic without one). */
export async function acapPromptExportSheet(
  request: AcApExportSheetRequest
): Promise<SheetOptions | undefined> {
  return sheetPrompt ? sheetPrompt(request) : {}
}
