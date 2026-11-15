/// <reference lib="webworker" />
/**
 * Web Worker that runs the acadrust engine. Built as a standalone bundle
 * (`acadrust-worker.js`); `acadrust-engine.wasm` is fetched from the same
 * directory on the first job.
 *
 * The compiled module is kept for as long as the worker lives, and every job
 * gets a fresh instance of it. The page ends the worker when it has been idle
 * for a while, which returns all of its memory.
 */
import { ACADRUST_WASM_FILE } from './constants'
import {
  AcadrustEngineError,
  compileAcadrustEngine,
  prepareAcadrustJob
} from './engineHost'
import type { AcadrustWorkerJob, AcadrustWorkerMessage } from './engineProtocol'

const scope = self as unknown as DedicatedWorkerGlobalScope

let modulePromise: Promise<WebAssembly.Module> | undefined

function loadModule(wasmUrl?: string): Promise<WebAssembly.Module> {
  if (!modulePromise) {
    const url = new URL(wasmUrl ?? ACADRUST_WASM_FILE, scope.location.href)
    modulePromise = fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load ${url.href} (HTTP ${response.status})`)
      }
      return compileAcadrustEngine(response)
    })
    // A failed load (offline, a deploy in progress) may work next time.
    modulePromise.catch(() => {
      modulePromise = undefined
    })
  }
  return modulePromise
}

function post(message: AcadrustWorkerMessage, transfer: Transferable[] = []) {
  scope.postMessage(message, transfer)
}

scope.onmessage = async (event: MessageEvent<AcadrustWorkerJob>) => {
  const job = event.data
  if (!job || job.type !== 'job') return
  const { id } = job
  let input: ArrayBuffer | undefined = job.input
  // Drop the message's own reference so only `input` keeps the buffer alive.
  ;(job as { input?: ArrayBuffer }).input = undefined

  let module: WebAssembly.Module
  try {
    module = await loadModule(job.wasmUrl)
  } catch (error) {
    post(
      {
        type: 'error',
        id,
        message: error instanceof Error ? error.message : String(error),
        trapped: false,
        outOfMemory: false,
        unavailable: true,
        input: job.returnInputOnError ? input : undefined
      },
      job.returnInputOnError && input ? [input] : []
    )
    return
  }

  try {
    // Progress crosses threads only when it moves a whole percent.
    let lastStage = ''
    let lastPercent = -1
    const prepared = await prepareAcadrustJob(
      module,
      new Uint8Array(input),
      job.options,
      (stage, ratio) => {
        const percent = Math.floor(ratio * 100)
        if (stage === lastStage && percent <= lastPercent) return
        lastStage = stage
        lastPercent = percent
        post({ type: 'progress', id, stage, ratio })
      }
    )
    // The instance has its own copy now. Unless the caller wants the input
    // back on failure, let it go before the (memory-hungry) parse.
    if (!job.returnInputOnError) input = undefined
    const result = prepared.run()
    const output = result.output.buffer as ArrayBuffer
    const preview = result.preview?.buffer as ArrayBuffer | undefined
    post(
      {
        type: 'done',
        id,
        output,
        preview,
        report: result.report,
        memoryBytes: result.memoryBytes
      },
      preview ? [output, preview] : [output]
    )
  } catch (error) {
    const engineError = error instanceof AcadrustEngineError ? error : undefined
    post(
      {
        type: 'error',
        id,
        message: error instanceof Error ? error.message : String(error),
        trapped: engineError?.trapped ?? false,
        outOfMemory: engineError?.outOfMemory ?? error instanceof RangeError,
        unavailable: false,
        report: engineError?.report,
        input
      },
      input ? [input] : []
    )
  }
}

post({ type: 'ready' })
