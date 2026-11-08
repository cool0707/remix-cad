import { AcDbDatabase, AcDbLinetypeTableRecord } from '@mlightcad/data-model'

import { acapDrawingHatchScale } from './AcApDrawingSheet'

/**
 * A linetype the viewer can add to any drawing on demand, so line type
 * selectors are not limited to what the opened file happens to define.
 */
export interface AcApStandardLineType {
  /** Linetype table name. */
  name: string
  /** Description stored in the linetype record (DXF group 3). */
  description: string
  /**
   * Dash (> 0), gap (< 0) and dot (0) lengths in paper millimetres. Records
   * get them in drawing units (see {@link acapStandardLineTypeScale}).
   */
  pattern: number[]
}

/**
 * Generic linetypes offered in every drawing. Patterns are the ISO ones of
 * acadiso.lin, so drawings exchanged with other CAD software look the same.
 */
export const ACAP_GENERIC_LINE_TYPES: readonly AcApStandardLineType[] = [
  { name: 'DASHED', description: 'Dashed __ __ __ __', pattern: [12.7, -6.35] },
  {
    name: 'HIDDEN',
    description: 'Hidden __ __ __ __',
    pattern: [6.35, -3.175]
  },
  { name: 'DOT', description: 'Dot . . . . . . . .', pattern: [0, -6.35] },
  {
    name: 'CENTER',
    description: 'Center ____ _ ____ _',
    pattern: [31.75, -6.35, 6.35, -6.35]
  },
  {
    name: 'PHANTOM',
    description: 'Phantom ____ _ _ ____',
    pattern: [31.75, -6.35, 6.35, -6.35, 6.35, -6.35]
  }
]

/**
 * Jw_cad line types (2–9 and the double-length ones), named and shaped as the
 * JWW reader (ezjww) writes them, so they match the records of an opened JWW
 * and export back to the same Jw_cad line type.
 */
export const ACAP_JWW_LINE_TYPES: readonly AcApStandardLineType[] = [
  {
    name: 'JWW_DASHED1',
    description: 'Jw_cad dashed line 1',
    pattern: [0.625, -0.625]
  },
  {
    name: 'JWW_DASHED2',
    description: 'Jw_cad dashed line 2',
    pattern: [1.25, -1.25]
  },
  {
    name: 'JWW_DASHED3',
    description: 'Jw_cad dashed line 3',
    pattern: [1.875, -0.625]
  },
  {
    name: 'JWW_DASHDOT1',
    description: 'Jw_cad chain line 1',
    pattern: [3.125, -0.625, 0.625, -0.625]
  },
  {
    name: 'JWW_DASHDOT2',
    description: 'Jw_cad chain line 2',
    pattern: [8.125, -0.625, 0.625, -0.625]
  },
  {
    name: 'JWW_DIVIDE1',
    description: 'Jw_cad double-dot chain line 1',
    pattern: [2.5, -0.625, 0.3125, -0.625, 0.3125, -0.625]
  },
  {
    name: 'JWW_DIVIDE2',
    description: 'Jw_cad double-dot chain line 2',
    pattern: [7.5, -0.625, 0.3125, -0.625, 0.3125, -0.625]
  },
  {
    name: 'JWW_CONSTRUCTION',
    description: 'Jw_cad construction line (not printed)',
    pattern: [0.3125, -0.9375]
  },
  {
    name: 'JWW_DASHED_X2',
    description: 'Jw_cad double-length dashed line',
    pattern: [18.75, -1.25]
  },
  {
    name: 'JWW_DASHED_X4',
    description: 'Jw_cad quadruple-length dashed line',
    pattern: [37.5, -2.5]
  },
  {
    name: 'JWW_DASHDOT_X2',
    description: 'Jw_cad double-length chain line',
    pattern: [16.25, -1.25, 1.25, -1.25]
  },
  {
    name: 'JWW_DIVIDE_X2',
    description: 'Jw_cad double-length double-dot chain line',
    pattern: [15, -1.25, 0.625, -1.25, 0.625, -1.25]
  }
]

const JWW_FILE_NAME = /\.(jww|jwc)$/i
const JWW_LINE_TYPE_NAME = /^JWW_/i

/**
 * Whether a drawing came from Jw_cad: opened from a `.jww` / `.jwc` file, or
 * it already uses Jw_cad line types (e.g. a JWW saved as DXF).
 */
export function acapIsJwwDrawing(db: AcDbDatabase, fileName?: string) {
  if (fileName && JWW_FILE_NAME.test(fileName.trim())) return true
  for (const record of db.tables.linetypeTable.newIterator()) {
    if (JWW_LINE_TYPE_NAME.test(record.name)) return true
  }
  return false
}

/**
 * Linetypes offered for a drawing: the generic ones, plus the Jw_cad ones
 * when the drawing came from Jw_cad.
 */
export function acapStandardLineTypes(
  db: AcDbDatabase,
  fileName?: string
): AcApStandardLineType[] {
  return acapIsJwwDrawing(db, fileName)
    ? [...ACAP_GENERIC_LINE_TYPES, ...ACAP_JWW_LINE_TYPES]
    : [...ACAP_GENERIC_LINE_TYPES]
}

/**
 * Drawing units per paper millimetre of a standard pattern: the sheet scale
 * of drawings whose limits are a sheet (JWW, SXF; e.g. 100 for 1/100 in
 * millimetres, the same factor as the hatch scale), else 1 — in inches for
 * imperial drawings, like acad.lin.
 */
export function acapStandardLineTypeScale(db: AcDbDatabase) {
  const sheetScale = acapDrawingHatchScale(db)
  if (sheetScale !== 1) return sheetScale
  return db.measurement === 0 ? 1 / 25.4 : 1
}

/**
 * Looks up a standard linetype by name (case-insensitive) among those
 * offered for the drawing.
 */
export function acapFindStandardLineType(
  db: AcDbDatabase,
  name: string,
  fileName?: string
) {
  const key = name.trim().toUpperCase()
  return acapStandardLineTypes(db, fileName).find(lt => lt.name === key)
}

/**
 * Builds the linetype record of a standard linetype for a drawing, with the
 * pattern in its drawing units. The record is not added to the drawing.
 */
export function acapStandardLineTypeRecord(
  db: AcDbDatabase,
  lineType: AcApStandardLineType
) {
  const scale = acapStandardLineTypeScale(db)
  const pattern = lineType.pattern.map(length => ({
    elementLength: length * scale,
    elementTypeFlag: 0
  }))
  return new AcDbLinetypeTableRecord({
    name: lineType.name,
    description: lineType.description,
    standardFlag: 0,
    totalPatternLength: pattern.reduce(
      (sum, element) => sum + Math.abs(element.elementLength),
      0
    ),
    pattern
  })
}

/**
 * Makes sure the drawing defines a linetype before it is assigned: adds the
 * standard linetype of that name when the drawing does not define it yet.
 *
 * @returns `true` when a record was added.
 */
export function acapEnsureStandardLineType(
  db: AcDbDatabase,
  name: string,
  fileName?: string
) {
  if (!name || hasLineType(db, name)) return false
  const lineType = acapFindStandardLineType(db, name, fileName)
  if (!lineType) return false
  db.tables.linetypeTable.add(acapStandardLineTypeRecord(db, lineType))
  return true
}

/** Linetype names are case-insensitive (`Continuous` vs `CONTINUOUS`). */
function hasLineType(db: AcDbDatabase, name: string) {
  if (db.tables.linetypeTable.has(name)) return true
  const key = name.trim().toLowerCase()
  for (const record of db.tables.linetypeTable.newIterator()) {
    if (record.name.toLowerCase() === key) return true
  }
  return false
}
