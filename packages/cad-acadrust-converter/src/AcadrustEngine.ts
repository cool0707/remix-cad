import {
  type AcadrustJobOptions,
  type AcadrustJobResult,
  type AcadrustProgress,
  type AcadrustReport,
  compileAcadrustEngine,
  prepareAcadrustJob
} from './engineHost'
import { AcadrustEngineError } from './engineHost'
import type { AcadrustWorkerJob, AcadrustWorkerMessage } from './engineProtocol'

/** Where the engine's WebAssembly comes from when no worker is used. */
export type AcadrustWasmSource =
  | BufferSource
  | WebAssembly.Module
  | Response
  | (() => Promise<BufferSource | WebAssembly.Module | Response>)

/** Configuration of {@link AcadrustEngine}. */
export interface AcadrustEngineConfig {
  /**
   * URL of `acadrust-worker.js`. With it (and `Worker` available) jobs run in
   * a worker; without it they run on the calling thread.
   */
  workerUrl?: string | URL
  /**
   * URL of `acadrust-engine.wasm`. A worker looks next to its own script by
   * default; without a worker either this or {@link wasm} is required.
   */
  wasmUrl?: string | URL
  /** The engine itself (bytes, a compiled module, or a loader), for Node. */
  wasm?: AcadrustWasmSource
  /** Set to `false` to run on the calling thread even with a worker URL. */
  useWorker?: boolean
  /**
   * How long an idle worker is kept before it is ended, in milliseconds.
   * Ending it returns the engine's memory; the next job starts a new one
   * (the wasm comes from the HTTP cache). @default 20000
   */
  idleTimeoutMs?: number
}

/** Per-job options of {@link AcadrustEngine.convert}. */
export interface AcadrustConvertHooks {
  onProgress?: AcadrustProgress
  /** Give up (and end the worker) after this many milliseconds. */
  timeout?: number
  /**
   * When the job fails in the worker, attach the input to the error
   * ({@link AcadrustJobError.input}) so another reader can be tried.
   */
  returnInputOnError?: boolean
}

/** Why a job failed. */
export type AcadrustFailure =
  /** The engine read the file and rejected it. */
  | 'rejected'
  /** The engine aborted (a bug in the decoder, or a badly damaged file). */
  | 'trapped'
  | 'out-of-memory'
  | 'timeout'
  /** The worker or the wasm could not be loaded. */
  | 'unavailable'

/** A failed {@link AcadrustEngine.convert}. */
export class AcadrustJobError extends Error {
  constructor(
    message: string,
    readonly failure: AcadrustFailure,
    readonly report?: AcadrustReport,
    /** The job's input, when it was asked for and could be recovered. */
    readonly input?: ArrayBuffer
  ) {
    super(message)
    this.name = 'AcadrustJobError'
  }
}

interface PendingJob {
  resolve: (result: AcadrustJobResult) => void
  reject: (error: AcadrustJobError) => void
  onProgress?: AcadrustProgress
  timer?: ReturnType<typeof setTimeout>
}

const DEFAULT_IDLE_TIMEOUT_MS = 20_000

/**
 * Runs DWG / DXF conversions in the acadrust engine.
 *
 * - Jobs run **one at a time**: two large drawings parsed at once would double
 *   the peak memory for no gain on the main thread, which reads the results
 *   one after the other anyway.
 * - The worker is started on the first job and **ended when idle**, so the
 *   engine holds no memory between drawings.
 * - Buffers move between threads by transfer, never by copy.
 */
export class AcadrustEngine {
  private worker?: Worker
  private workerReady?: Promise<Worker>
  private idleTimer?: ReturnType<typeof setTimeout>
  private nextId = 1
  private readonly pending = new Map<number, PendingJob>()
  private queue: Promise<unknown> = Promise.resolve()
  private queued = 0
  private localModule?: Promise<WebAssembly.Module>

  constructor(readonly config: AcadrustEngineConfig = {}) {}

  /** Jobs run in a worker (rather than on the calling thread). */
  get usesWorker(): boolean {
    return (
      this.config.useWorker !== false &&
      !!this.config.workerUrl &&
      typeof Worker !== 'undefined'
    )
  }

  /**
   * Converts a drawing.
   *
   * With a worker the input buffer is **transferred** (the caller's
   * `ArrayBuffer` is detached). Pass a copy to keep it, or ask for it back on
   * failure with {@link AcadrustConvertHooks.returnInputOnError}.
   */
  convert(
    input: ArrayBuffer | Uint8Array,
    options: AcadrustJobOptions = {},
    hooks: AcadrustConvertHooks = {}
  ): Promise<AcadrustJobResult> {
    this.queued++
    this.cancelIdleTimer()
    const run = () =>
      this.usesWorker
        ? this.convertInWorker(input, options, hooks)
        : this.convertHere(input, options, hooks)
    const job = this.queue.then(run, run)
    this.queue = job.then(
      () => this.jobSettled(),
      () => this.jobSettled()
    )
    return job
  }

  /** Ends the worker and drops the compiled engine. */
  dispose() {
    this.cancelIdleTimer()
    this.endWorker(
      new AcadrustJobError('The DWG / DXF engine was stopped', 'unavailable')
    )
    this.localModule = undefined
  }

  private jobSettled() {
    this.queued--
    if (this.queued === 0 && this.worker) {
      const delay = this.config.idleTimeoutMs ?? DEFAULT_IDLE_TIMEOUT_MS
      if (delay <= 0) {
        this.endWorker()
        return
      }
      this.idleTimer = setTimeout(() => this.endWorker(), delay)
      // Never keep a Node process alive for this.
      ;(this.idleTimer as { unref?: () => void }).unref?.()
    }
  }

  private cancelIdleTimer() {
    if (this.idleTimer !== undefined) {
      clearTimeout(this.idleTimer)
      this.idleTimer = undefined
    }
  }

  private endWorker(error?: AcadrustJobError) {
    this.cancelIdleTimer()
    this.worker?.terminate()
    this.worker = undefined
    this.workerReady = undefined
    if (this.pending.size > 0) {
      const reason =
        error ??
        new AcadrustJobError('The DWG / DXF engine was stopped', 'unavailable')
      for (const job of this.pending.values()) {
        if (job.timer !== undefined) clearTimeout(job.timer)
        job.reject(reason)
      }
      this.pending.clear()
    }
  }

  /** Starts the worker and waits until its script has loaded. */
  private ensureWorker(): Promise<Worker> {
    if (this.workerReady) return this.workerReady
    const ready = new Promise<Worker>((resolve, reject) => {
      let worker: Worker
      try {
        worker = new Worker(this.config.workerUrl!)
      } catch (error) {
        reject(
          new AcadrustJobError(
            `The DWG / DXF engine could not be started: ${describe(error)}`,
            'unavailable'
          )
        )
        return
      }
      this.worker = worker
      worker.onmessage = (event: MessageEvent<AcadrustWorkerMessage>) => {
        const message = event.data
        if (message.type === 'ready') {
          resolve(worker)
          return
        }
        this.handleMessage(message)
      }
      worker.onerror = event => {
        event.preventDefault?.()
        const error = new AcadrustJobError(
          `The DWG / DXF engine failed: ${event.message || 'the worker could not be loaded'}`,
          'unavailable'
        )
        if (this.worker === worker) this.endWorker(error)
        reject(error)
      }
    })
    // A worker that failed to start is not remembered.
    ready.catch(() => {
      if (this.workerReady === ready) this.workerReady = undefined
    })
    this.workerReady = ready
    return ready
  }

  private handleMessage(message: AcadrustWorkerMessage) {
    if (message.type === 'ready') return
    const job = this.pending.get(message.id)
    if (!job) return
    if (message.type === 'progress') {
      job.onProgress?.(message.stage, message.ratio)
      return
    }
    this.pending.delete(message.id)
    if (job.timer !== undefined) clearTimeout(job.timer)
    if (message.type === 'done') {
      job.resolve({
        output: new Uint8Array(message.output),
        preview: message.preview ? new Uint8Array(message.preview) : undefined,
        report: message.report,
        memoryBytes: message.memoryBytes
      })
      return
    }
    job.reject(
      new AcadrustJobError(
        message.message,
        message.unavailable
          ? 'unavailable'
          : message.outOfMemory
            ? 'out-of-memory'
            : message.trapped
              ? 'trapped'
              : 'rejected',
        message.report,
        message.input
      )
    )
  }

  private async convertInWorker(
    input: ArrayBuffer | Uint8Array,
    options: AcadrustJobOptions,
    hooks: AcadrustConvertHooks
  ): Promise<AcadrustJobResult> {
    // Start the worker before touching the input: if it cannot start, the
    // caller still has its buffer for another reader.
    const worker = await this.ensureWorker()
    const buffer = ownedBuffer(input)
    const id = this.nextId++
    return new Promise<AcadrustJobResult>((resolve, reject) => {
      const job: PendingJob = { resolve, reject, onProgress: hooks.onProgress }
      if (hooks.timeout && hooks.timeout > 0) {
        job.timer = setTimeout(() => {
          this.pending.delete(id)
          // A wasm call cannot be interrupted; end the worker instead.
          this.endWorker()
          reject(
            new AcadrustJobError(
              `Reading the drawing timed out after ${hooks.timeout} ms`,
              'timeout'
            )
          )
        }, hooks.timeout)
      }
      this.pending.set(id, job)
      const message: AcadrustWorkerJob = {
        type: 'job',
        id,
        input: buffer,
        options,
        wasmUrl: this.config.wasmUrl
          ? new URL(String(this.config.wasmUrl), globalThis.location?.href).href
          : undefined,
        returnInputOnError: hooks.returnInputOnError
      }
      worker.postMessage(message, [buffer])
    })
  }

  private async convertHere(
    input: ArrayBuffer | Uint8Array,
    options: AcadrustJobOptions,
    hooks: AcadrustConvertHooks
  ): Promise<AcadrustJobResult> {
    let module: WebAssembly.Module
    try {
      module = await this.loadLocalModule()
    } catch (error) {
      throw new AcadrustJobError(
        `The DWG / DXF engine could not be loaded: ${describe(error)}`,
        'unavailable'
      )
    }
    try {
      const bytes = input instanceof Uint8Array ? input : new Uint8Array(input)
      return (
        await prepareAcadrustJob(module, bytes, options, hooks.onProgress)
      ).run()
    } catch (error) {
      if (error instanceof AcadrustEngineError) {
        throw new AcadrustJobError(
          error.message,
          error.outOfMemory
            ? 'out-of-memory'
            : error.trapped
              ? 'trapped'
              : 'rejected',
          error.report
        )
      }
      throw new AcadrustJobError(
        describe(error),
        error instanceof RangeError ? 'out-of-memory' : 'trapped'
      )
    }
  }

  private loadLocalModule(): Promise<WebAssembly.Module> {
    if (!this.localModule) {
      const { wasm, wasmUrl } = this.config
      const load = async () => {
        if (wasm !== undefined) {
          return compileAcadrustEngine(
            typeof wasm === 'function' ? await wasm() : wasm
          )
        }
        if (!wasmUrl) {
          throw new Error(
            'set workerUrl, wasmUrl or wasm to load acadrust-engine.wasm'
          )
        }
        return compileAcadrustEngine(await fetch(wasmUrl))
      }
      const loading = load()
      loading.catch(() => {
        if (this.localModule === loading) this.localModule = undefined
      })
      this.localModule = loading
    }
    return this.localModule
  }
}

/** A buffer that can be transferred without detaching anything it shares. */
function ownedBuffer(input: ArrayBuffer | Uint8Array): ArrayBuffer {
  if (input instanceof ArrayBuffer) return input
  const whole =
    input.byteOffset === 0 && input.byteLength === input.buffer.byteLength
  return whole && input.buffer instanceof ArrayBuffer
    ? input.buffer
    : (input.slice().buffer as ArrayBuffer)
}

function describe(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
