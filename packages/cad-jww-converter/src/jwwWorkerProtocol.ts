import type { ExportDrawing } from '@mlightcad/cad-export-model'

import type { JwwWriteOptions } from './jwwExport'
import type { JwwConversionResult, JwwScaleMode } from './jwwToDxf'

/** Message posted to the JWW parser worker: read a file … */
export interface JwwWorkerReadRequest {
  id: number
  kind?: 'read'
  data: ArrayBuffer
  /** Overrides the wasm location (resolved against the worker URL). */
  wasmUrl?: string
  scaleMode?: JwwScaleMode
}

/** … or write one. */
export interface JwwWorkerWriteRequest {
  id: number
  kind: 'write'
  drawing: ExportDrawing
  options?: JwwWriteOptions
  wasmUrl?: string
}

export type JwwWorkerRequest = JwwWorkerReadRequest | JwwWorkerWriteRequest

/** Result of writing a JWW file. */
export interface JwwWriteResult {
  bytes: Uint8Array
  /** Parts of the drawing that were written only approximately. */
  warnings: string[]
}

/**
 * A read result as it crosses threads: the DXF as UTF-8 bytes, so it is
 * transferred instead of cloned as a string and encoded again on the page.
 */
export type JwwWorkerReadResult = Omit<JwwConversionResult, 'dxf'> & {
  dxf: ArrayBuffer
}

/** Message the JWW parser worker posts back. */
export type JwwWorkerResponse =
  | ({ id: number; ok: true; kind?: 'read' } & JwwWorkerReadResult)
  | ({ id: number; ok: true; kind: 'write' } & JwwWriteResult)
  | { id: number; ok: false; error: string }
