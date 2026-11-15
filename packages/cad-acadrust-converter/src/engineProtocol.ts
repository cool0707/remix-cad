import type { AcadrustJobOptions, AcadrustReport } from './engineHost'

/** Main thread → worker: convert one drawing. */
export interface AcadrustWorkerJob {
  type: 'job'
  id: number
  /** The drawing. Transferred, so the sender's buffer is detached. */
  input: ArrayBuffer
  options: AcadrustJobOptions
  /** Overrides the wasm location (resolved against the worker URL). */
  wasmUrl?: string
  /**
   * Send the input back when the job fails, so the caller can try another
   * reader without having kept a copy.
   */
  returnInputOnError?: boolean
}

/** Worker → main thread. */
export type AcadrustWorkerMessage =
  /** The worker script loaded; jobs may be posted. */
  | { type: 'ready' }
  | { type: 'progress'; id: number; stage: 'read' | 'write'; ratio: number }
  | {
      type: 'done'
      id: number
      /** Transferred. */
      output: ArrayBuffer
      /** The drawing's thumbnail, when it has one. Transferred. */
      preview?: ArrayBuffer
      report: AcadrustReport
      memoryBytes: number
    }
  | {
      type: 'error'
      id: number
      message: string
      /** The engine aborted rather than returning an error. */
      trapped: boolean
      outOfMemory: boolean
      /** The engine could not be loaded at all (fetch / compile failed). */
      unavailable: boolean
      report?: AcadrustReport
      /** The job's input, handed back when it asked for that. Transferred. */
      input?: ArrayBuffer
    }
