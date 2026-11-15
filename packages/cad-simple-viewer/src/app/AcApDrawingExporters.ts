import type { AcDbDatabase } from '@mlightcad/data-model'

import type { AcApExportVariant, AcApSheetOptions } from './AcApDrawingSheet'

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
   * With the sheet left on automatic the drawing's own limits are kept
   * (DWG), instead of a sheet being picked for it (JWW, SXF).
   */
  autoKeepsDrawing?: boolean
  /** Versions the user can choose from (DWG 2018, 2013, …). */
  variants?: AcApExportVariant[]
  /** Variant selected at first. @default the first of {@link variants} */
  defaultVariant?: string
  /**
   * Writes the drawing.
   *
   * @param database - Drawing to write
   * @param title - Drawing title (file name without extension)
   * @param sheet - Paper, orientation and scale chosen by the user; unset
   *   fields are chosen automatically
   * @param variant - The chosen one of {@link variants}
   */
  export(
    database: AcDbDatabase,
    title: string,
    sheet: AcApSheetOptions,
    variant?: string
  ): Promise<AcApDrawingExportResult>
}

/**
 * Writes DXF in a version other than the drawing's own (R12 for old CAD and
 * CAM software, …). Install one with {@link acapSetDxfVersionWriter} and the
 * DXF export offers its versions.
 */
export interface AcApDxfVersionWriter {
  /** Versions to offer, newest first. */
  versions: AcApExportVariant[]
  /**
   * @param version - One of {@link versions}
   * @param limits - Drawing limits to store (the sheet chosen by the user),
   *   in drawing units
   */
  write(
    database: AcDbDatabase,
    version: string,
    limits?: {
      min: { x: number; y: number }
      max: { x: number; y: number }
    }
  ): Promise<AcApDrawingExportResult>
}

let dxfVersionWriter: AcApDxfVersionWriter | undefined

/** Installs (or removes) the writer behind the DXF export's version list. */
export function acapSetDxfVersionWriter(writer?: AcApDxfVersionWriter) {
  dxfVersionWriter = writer
}

/** The installed DXF version writer, if any. */
export function acapDxfVersionWriter(): AcApDxfVersionWriter | undefined {
  return dxfVersionWriter
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
