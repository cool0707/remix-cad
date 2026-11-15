/**
 * Opt into DWG / JWW / SXF export for this example app: each format gets a
 * command (`cdwg`, `cjww`, `csfc`, `cp21`) and an entry in File → Export, and
 * the built-in DXF export gets a version list.
 */
import {
  ACADRUST_VERSION_LABELS,
  type AcadrustVersion,
  type AcDbAcadrustConverter
} from '@mlightcad/cad-acadrust-converter'
import type { AcDbJwwConverter } from '@mlightcad/cad-jww-converter'
import {
  acapHasSheetOptions,
  acapRegisterDrawingExporter,
  acapResolveDrawingSheet,
  acapSetDxfVersionWriter,
  type AcApSheetOptions
} from '@mlightcad/cad-simple-viewer'
import { exportSxf } from '@mlightcad/cad-sxf-converter'
import type { AcDbDatabase } from '@mlightcad/data-model'

/** DWG versions offered, newest first (what current CAD software reads). */
const DWG_VERSIONS: AcadrustVersion[] = [
  'AC1032',
  'AC1027',
  'AC1024',
  'AC1021',
  'AC1018',
  'AC1015'
]

/**
 * DXF versions offered besides the drawing's own. R12 is what older CAD and
 * CAM software (and Jw_cad's DXF import) understands best.
 */
const DXF_VERSIONS: AcadrustVersion[] = [...DWG_VERSIONS, 'AC1009']

function versionChoices(versions: AcadrustVersion[]) {
  return versions.map(version => ({
    value: version,
    label:
      version === 'AC1009'
        ? ACADRUST_VERSION_LABELS[version]
        : `AutoCAD ${ACADRUST_VERSION_LABELS[version]}`
  }))
}

/**
 * The sheet the user chose, as drawing limits. Nothing chosen = keep the
 * limits the drawing already has.
 */
function chosenLimits(db: AcDbDatabase, sheet: AcApSheetOptions) {
  if (!acapHasSheetOptions(sheet)) return undefined
  const { min, max } = acapResolveDrawingSheet(db, sheet)
  return { min, max }
}

export function registerDrawingExporters(
  jww: AcDbJwwConverter,
  acadrust: AcDbAcadrustConverter
): void {
  acapRegisterDrawingExporter({
    command: 'cdwg',
    extension: 'dwg',
    formatName: 'DWG',
    mimeType: 'application/acad',
    autoKeepsDrawing: true,
    variants: versionChoices(DWG_VERSIONS),
    defaultVariant: 'AC1032',
    export: async (db, _title, sheet, variant) => {
      const result = await acadrust.exportDatabase(db, {
        format: 'dwg',
        version: (variant as AcadrustVersion | undefined) ?? 'AC1032',
        limits: chosenLimits(db, sheet)
      })
      return { bytes: result.bytes, warnings: result.warnings }
    }
  })
  // DXF in another version (the built-in export writes the drawing's own).
  acapSetDxfVersionWriter({
    versions: versionChoices(DXF_VERSIONS),
    write: async (db, version, limits) => {
      const result = await acadrust.exportDatabase(db, {
        format: 'dxf',
        version: version as AcadrustVersion,
        limits
      })
      return { bytes: result.bytes, warnings: result.warnings }
    }
  })
  acapRegisterDrawingExporter({
    command: 'cjww',
    extension: 'jww',
    formatName: 'JWW',
    // Jw_cad sheets are landscape.
    landscapeOnly: true,
    export: (db, title, { portrait: _portrait, ...sheet }) =>
      jww.exportDatabase(db, { ...sheet, title })
  })
  acapRegisterDrawingExporter({
    command: 'csfc',
    extension: 'sfc',
    formatName: 'SFC',
    export: async (db, title, sheet) =>
      exportSxf(db, 'sfc', { ...sheet, title, fileName: `${title}.sfc` })
  })
  acapRegisterDrawingExporter({
    command: 'cp21',
    extension: 'p21',
    formatName: 'P21',
    export: async (db, title, sheet) =>
      exportSxf(db, 'p21', { ...sheet, title, fileName: `${title}.p21` })
  })
}
