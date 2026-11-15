/**
 * Host side of the acadrust engine (`acadrust-engine.wasm`).
 *
 * The engine is a plain `wasm32-wasip1` module: no generated JS glue, six WASI
 * imports and two of its own. That keeps this file the whole runtime, and it
 * runs unchanged in a Web Worker, on the main thread and in Node.
 *
 * Memory model: **one instance per job**. WebAssembly memory only grows, so an
 * instance that has read a large drawing keeps its peak forever. A job gets a
 * fresh instance (instantiating a compiled module costs about a millisecond),
 * copies its output out, and lets the instance go; the compiled module is what
 * gets reused.
 */
import type { AcadrustVersion } from './constants'

/** What the input is. `auto` looks at the file signature. */
export type AcadrustSource = 'auto' | 'dwg' | 'dxf'

/** What to produce. */
export type AcadrustTarget = 'dxf-binary' | 'dxf-ascii' | 'dwg'

/** One conversion. */
export interface AcadrustJobOptions {
  /** @default 'auto' */
  source?: AcadrustSource
  /** @default 'dxf-binary' */
  target?: AcadrustTarget
  /** Version to write. Omit to keep the version of the input. */
  version?: AcadrustVersion
  /**
   * Fail on the first malformed record. By default such records are skipped
   * and listed in {@link AcadrustReport.diagnostics}.
   */
  strict?: boolean
  /**
   * Text encoding of an ASCII DXF (`shift_jis`, `cp949`, `ANSI_1251`, …).
   * Omit to detect it from the bytes and the header.
   */
  encoding?: string
}

/** A record the engine skipped or repaired while reading. */
export interface AcadrustDiagnostic {
  code: string
  message: string
}

/** What the engine did, read back after a job. */
export interface AcadrustReport {
  ok: boolean
  /** Set when {@link ok} is false. */
  error?: string
  /** `dwg`, `dxf` (ASCII) or `dxf-binary`. */
  source: string
  sourceVersion: string
  outputVersion: string
  /** Encoding an ASCII DXF was read as. */
  textEncoding?: string
  /** Format of {@link AcadrustJobResult.preview}: `png` or `dib`. */
  previewFormat?: 'png' | 'dib'
  inputBytes: number
  outputBytes: number
  readMs: number
  writeMs: number
  entities: number
  objects: number
  tableRecords: number
  skippedRecords: number
  recoveredErrors: number
  /** The file was damaged and read in recovery mode. */
  recovered: boolean
  /** Total number of diagnostics; {@link diagnostics} holds the first few. */
  diagnosticsTotal: number
  diagnostics: AcadrustDiagnostic[]
}

/** Result of a successful job. */
export interface AcadrustJobResult {
  /** The converted drawing, in a buffer of its own (safe to transfer). */
  output: Uint8Array
  /**
   * The thumbnail embedded in a DWG (PNG, or a Windows DIB), when the output
   * is DXF, which has no place for it.
   */
  preview?: Uint8Array
  report: AcadrustReport
  /** Linear memory the instance ended with, in bytes. */
  memoryBytes: number
}

/** `stage` runs 0 → 1 for reading, then 0 → 1 for writing. */
export type AcadrustProgress = (stage: 'read' | 'write', ratio: number) => void

/** A job that failed: the engine reported an error, or trapped. */
export class AcadrustEngineError extends Error {
  constructor(
    message: string,
    /** The engine's own report, when it got far enough to write one. */
    readonly report?: AcadrustReport,
    /** The instance aborted (a panic) instead of returning an error. */
    readonly trapped = false,
    /** The instance ran out of memory. */
    readonly outOfMemory = false
  ) {
    super(message)
    this.name = 'AcadrustEngineError'
  }
}

const SOURCE_CODES: Record<AcadrustSource, number> = { auto: 0, dwg: 1, dxf: 2 }
const TARGET_CODES: Record<AcadrustTarget, number> = {
  'dxf-binary': 0,
  'dxf-ascii': 1,
  dwg: 2
}
const FLAG_STRICT = 1

const WASI_ERRNO_SUCCESS = 0
const WASI_ERRNO_NOSYS = 52

interface EngineExports {
  memory: WebAssembly.Memory
  cad_alloc(len: number): number
  cad_free(ptr: number, len: number): void
  cad_convert(
    input: number,
    inputLen: number,
    source: number,
    target: number,
    version: number,
    flags: number,
    encoding: number,
    encodingLen: number
  ): number
  cad_output_ptr(): number
  cad_output_len(): number
  cad_report_ptr(): number
  cad_report_len(): number
  cad_preview_ptr(): number
  cad_preview_len(): number
  cad_release(): void
}

/**
 * Compiles the engine. Accepts the bytes, a fetch `Response` (compiled while
 * it streams) or an already compiled module.
 */
export async function compileAcadrustEngine(
  source: BufferSource | Response | WebAssembly.Module
): Promise<WebAssembly.Module> {
  if (source instanceof WebAssembly.Module) return source
  if (typeof Response !== 'undefined' && source instanceof Response) {
    if (!source.ok) {
      throw new Error(
        `Failed to load the DWG / DXF engine (HTTP ${source.status})`
      )
    }
    // Streaming needs `Content-Type: application/wasm`; fall back to bytes.
    const type = source.headers.get('content-type') ?? ''
    if (
      typeof WebAssembly.compileStreaming === 'function' &&
      type.startsWith('application/wasm')
    ) {
      return WebAssembly.compileStreaming(source)
    }
    return WebAssembly.compile(await source.arrayBuffer())
  }
  return WebAssembly.compile(source as BufferSource)
}

/** An instance with the input loaded, ready to run. */
export interface AcadrustPreparedJob {
  /**
   * Converts the drawing. Synchronous: it returns when the engine is done
   * (run it in a worker to keep a page responsive).
   */
  run(): AcadrustJobResult
}

/**
 * Creates a fresh instance of `module` and copies `input` into it.
 *
 * After this resolves the instance holds its own copy, so the caller may drop
 * `input` before calling {@link AcadrustPreparedJob.run} — worth doing for a
 * large drawing, which would otherwise sit in memory twice while it is parsed.
 */
export async function prepareAcadrustJob(
  module: WebAssembly.Module,
  input: Uint8Array,
  options: AcadrustJobOptions = {},
  onProgress?: AcadrustProgress
): Promise<AcadrustPreparedJob> {
  // Filled in once the instance exists; the import functions below run later.
  const host: { memory?: WebAssembly.Memory } = {}
  let panicMessage: string | undefined
  let stderr = ''
  const decoder = new TextDecoder()
  const bytes = () => new Uint8Array(host.memory!.buffer)
  const view = () => new DataView(host.memory!.buffer)
  const readText = (ptr: number, len: number) =>
    // Copy first: the memory may grow (and its buffer be replaced) under a
    // live view.
    decoder.decode(bytes().slice(ptr, ptr + len))

  const wasi: Record<string, (...args: number[]) => number> = {
    random_get(ptr, len) {
      fillRandom(bytes().subarray(ptr, ptr + len))
      return WASI_ERRNO_SUCCESS
    },
    environ_get() {
      return WASI_ERRNO_SUCCESS
    },
    environ_sizes_get(countPtr, sizePtr) {
      view().setUint32(countPtr, 0, true)
      view().setUint32(sizePtr, 0, true)
      return WASI_ERRNO_SUCCESS
    },
    // (clock id, precision: i64 — arrives as a BigInt, result pointer)
    clock_time_get(_id, _precision, resultPtr) {
      const nanos = BigInt(Math.round(now() * 1e6))
      view().setBigUint64(Number(resultPtr), nanos, true)
      return WASI_ERRNO_SUCCESS
    },
    fd_write(_fd, iovs, iovsLen, writtenPtr) {
      let written = 0
      for (let index = 0; index < iovsLen; index++) {
        const ptr = view().getUint32(iovs + index * 8, true)
        const len = view().getUint32(iovs + index * 8 + 4, true)
        if (stderr.length < 8192) stderr += readText(ptr, len)
        written += len
      }
      view().setUint32(writtenPtr, written, true)
      return WASI_ERRNO_SUCCESS
    },
    proc_exit(code) {
      throw new AcadrustEngineError(
        `The DWG / DXF engine exited (code ${code})`,
        undefined,
        true
      )
    }
  }
  const env: Record<string, (...args: number[]) => void> = {
    cad_progress(stage, permille) {
      onProgress?.(stage === 2 ? 'write' : 'read', Math.min(1, permille / 1000))
    },
    cad_panic(ptr, len) {
      panicMessage = readText(ptr, len)
    }
  }
  // Anything else the module asks of WASI (a rebuild with a newer toolchain
  // may pull in a few more calls) answers "not supported" instead of failing
  // to instantiate.
  const wasiImports: Record<string, (...args: number[]) => number> = {}
  for (const item of WebAssembly.Module.imports(module)) {
    if (item.kind !== 'function') continue
    if (item.module === 'wasi_snapshot_preview1') {
      wasiImports[item.name] = wasi[item.name] ?? (() => WASI_ERRNO_NOSYS)
    } else if (item.module === 'env' && !(item.name in env)) {
      env[item.name] = () => {}
    }
  }

  const instance = await WebAssembly.instantiate(module, {
    env,
    wasi_snapshot_preview1: wasiImports
  })
  const engine = instance.exports as unknown as EngineExports
  host.memory = engine.memory

  const inputLen = input.byteLength
  const inputPtr = engine.cad_alloc(inputLen)
  if (inputPtr === 0) {
    throw new AcadrustEngineError(
      'Not enough memory to load the drawing into the DWG / DXF engine'
    )
  }
  bytes().set(input, inputPtr)

  let encodingPtr = 0
  let encodingLen = 0
  if (options.encoding) {
    const label = new TextEncoder().encode(options.encoding)
    encodingPtr = engine.cad_alloc(label.byteLength)
    encodingLen = label.byteLength
    bytes().set(label, encodingPtr)
  }
  const version = versionCode(options.version)

  return {
    run() {
      let status: number
      try {
        // The engine takes ownership of the input buffer and frees it as soon
        // as the document is parsed.
        status = engine.cad_convert(
          inputPtr,
          inputLen,
          SOURCE_CODES[options.source ?? 'auto'],
          TARGET_CODES[options.target ?? 'dxf-binary'],
          version,
          options.strict ? FLAG_STRICT : 0,
          encodingPtr,
          encodingLen
        )
      } catch (error) {
        if (error instanceof AcadrustEngineError) throw error
        // A trap (panic, out of memory). The instance goes with the job.
        const raw = error instanceof Error ? error.message : String(error)
        const outOfMemory = isOutOfMemory(error, stderr)
        const detail = outOfMemory
          ? 'the drawing is too large for the memory available'
          : (panicMessage ?? (stderr.trim() || raw))
        throw new AcadrustEngineError(
          `The DWG / DXF engine stopped: ${detail}`,
          undefined,
          true,
          outOfMemory
        )
      }
      if (encodingPtr) engine.cad_free(encodingPtr, encodingLen)

      const report = JSON.parse(
        readText(engine.cad_report_ptr(), engine.cad_report_len())
      ) as AcadrustReport
      if (status !== 0 || !report.ok) {
        throw new AcadrustEngineError(
          report.error || 'The drawing could not be converted',
          report
        )
      }
      const outputPtr = engine.cad_output_ptr()
      const output = bytes().slice(
        outputPtr,
        outputPtr + engine.cad_output_len()
      )
      const previewLen = engine.cad_preview_len()
      const previewPtr = engine.cad_preview_ptr()
      const preview =
        previewLen > 0
          ? bytes().slice(previewPtr, previewPtr + previewLen)
          : undefined
      const memoryBytes = engine.memory.buffer.byteLength
      engine.cad_release()
      return { output, preview, report, memoryBytes }
    }
  }
}

/**
 * Runs one conversion in a fresh instance of `module`
 * ({@link prepareAcadrustJob} + `run()`).
 */
export async function runAcadrustJob(
  module: WebAssembly.Module,
  input: Uint8Array,
  options: AcadrustJobOptions = {},
  onProgress?: AcadrustProgress
): Promise<AcadrustJobResult> {
  return (await prepareAcadrustJob(module, input, options, onProgress)).run()
}

function versionCode(version: AcadrustVersion | undefined): number {
  if (!version) return 0
  const code = Number(version.slice(2))
  if (!/^AC\d{4}$/.test(version) || !Number.isFinite(code)) {
    throw new AcadrustEngineError(`Unsupported drawing version ${version}`)
  }
  return code
}

/**
 * The instance ran out of linear memory: `memory.grow` failed in the host
 * (RangeError), or Rust's allocator gave up (it prints
 * "memory allocation of N bytes failed" and aborts).
 */
function isOutOfMemory(error: unknown, stderr: string): boolean {
  if (error instanceof RangeError) return true
  if (/memory allocation of \d+ bytes failed/.test(stderr)) return true
  const message = error instanceof Error ? error.message : String(error)
  return /out of memory/i.test(message)
}

function now(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now()
}

function fillRandom(target: Uint8Array) {
  const source = (globalThis as { crypto?: Crypto }).crypto
  if (source?.getRandomValues) {
    // getRandomValues takes at most 65536 bytes, and not a view of wasm
    // memory in every engine: fill a scratch buffer and copy.
    const scratch = new Uint8Array(Math.min(target.length, 65536))
    for (let offset = 0; offset < target.length; offset += scratch.length) {
      const chunk = scratch.subarray(
        0,
        Math.min(scratch.length, target.length - offset)
      )
      source.getRandomValues(chunk)
      target.set(chunk, offset)
    }
    return
  }
  // Only seeds hash maps; any spread of values will do.
  for (let index = 0; index < target.length; index++) {
    target[index] = (Math.random() * 256) | 0
  }
}
