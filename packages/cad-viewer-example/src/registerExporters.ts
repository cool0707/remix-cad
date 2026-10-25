/**
 * Opt into JWW / SXF export for this example app: each format gets a command
 * (`cjww`, `csfc`, `cp21`) and an entry in File → Export.
 */
import type { AcDbJwwConverter } from '@mlightcad/cad-jww-converter'
import { acapRegisterDrawingExporter } from '@mlightcad/cad-simple-viewer'
import { exportSxf } from '@mlightcad/cad-sxf-converter'

export function registerDrawingExporters(jww: AcDbJwwConverter): void {
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
