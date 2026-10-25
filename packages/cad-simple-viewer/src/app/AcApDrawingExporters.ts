import type { AcDbDatabase } from '@mlightcad/data-model'

import type { AcApSheetOptions } from './AcApDrawingSheet'

/** Result of {@link AcApDrawingExporter.export}. */
export interface AcApDrawingExportResult {
  /** File contents. */
  bytes: Uint8Array
  /** Parts of the drawing that were written only approximately. */
  warnings?: string[]
}

/**
 * A drawing file format the viewer can save to, besides the built-in DXF
 * (for example JWW or SXF). Register exporters with
 * {@link acapRegisterDrawingExporter}; each one gets a command and an entry in
 * the export menu.
 */
export interface AcApDrawingExporter {
  /** Command name (`cjww`, `csfc`, …). */
  command: string
  /** File extension without the dot. */
  extension: string
  /** Format name shown in menus (`JWW`, `SFC`). */
  formatName: string
  /** MIME type of the download. @default 'application/octet-stream' */
  mimeType?: string
  /** The format has landscape sheets only (Jw_cad). */
  landscapeOnly?: boolean
  /**
   * Writes the drawing.
   *
   * @param database - Drawing to write
   * @param title - Drawing title (file name without extension)
   * @param sheet - Paper, orientation and scale chosen by the user; unset
   *   fields are chosen automatically
   */
  export(
    database: AcDbDatabase,
    title: string,
    sheet: AcApSheetOptions
  ): Promise<AcApDrawingExportResult>
}

const exporters = new Map<string, AcApDrawingExporter>()
const listeners = new Set<(exporter: AcApDrawingExporter) => void>()

/**
 * Registers a drawing exporter. Exporters registered before the viewer starts
 * get their command when it registers its commands; later ones immediately.
 */
export function acapRegisterDrawingExporter(exporter: AcApDrawingExporter) {
  exporters.set(exporter.command.toLowerCase(), exporter)
  for (const listener of listeners) listener(exporter)
}

/** Removes a drawing exporter registered with {@link acapRegisterDrawingExporter}. */
export function acapUnregisterDrawingExporter(command: string) {
  exporters.delete(command.toLowerCase())
}

/** Registered drawing exporters, in registration order. */
export function acapDrawingExporters(): AcApDrawingExporter[] {
  return [...exporters.values()]
}

/**
 * Calls `listener` for each exporter registered from now on.
 *
 * @returns A function that removes the listener
 */
export function acapOnDrawingExporterRegistered(
  listener: (exporter: AcApDrawingExporter) => void
) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
