import {
  type AcDbConversionProgressCallback,
  AcDbDatabase,
  AcDbDatabaseConverter,
  type AcDbDatabaseConverterConfig,
  type AcDbDatabaseConverterReadOptions,
  AcDbNativeDxfConverter,
  AcDbOpenDatabaseError,
  log
} from '@mlightcad/data-model'

import {
  AcadrustEngine,
  type AcadrustEngineConfig,
  AcadrustJobError
} from './AcadrustEngine'
import type { AcadrustVersion } from './constants'
import type { AcadrustReport, AcadrustTarget } from './engineHost'

/** How DXF files are read. */
export type AcadrustDxfMode =
  /**
   * The data model's own DXF reader, on the page. It streams the file
   * straight into the database, so it is the fastest path and needs the least
   * memory. The default.
   */
  | 'native'
  /**
   * Through acadrust, like DWG (and back to the native reader if acadrust
   * cannot read the file). About twice the time for a large file, in exchange
   * for acadrust's recovery of damaged files.
   */
  | 'engine'

/** Configuration of {@link AcDbAcadrustConverter}. */
export interface AcDbAcadrustConverterConfig
  extends AcDbDatabaseConverterConfig, Omit<AcadrustEngineConfig, 'workerUrl'> {
  /** @default 'native' */
  dxf?: AcadrustDxfMode
  /**
   * Stop at the first malformed record instead of skipping it and reading
   * the rest of the drawing. @default false
   */
  strict?: boolean
}

/** Options of {@link AcDbAcadrustConverter.exportDatabase}. */
export interface AcadrustExportOptions {
  /** `dwg`, ASCII `dxf`, or binary DXF. */
  format: 'dwg' | 'dxf' | 'dxf-binary'
  /**
   * Version to write (`AC1015` = 2000 … `AC1032` = 2018; `AC1009` = R12,
   * ASCII DXF and DWG only). @default 'AC1032' for DWG, the drawing's own for DXF
   */
  version?: AcadrustVersion
  /**
   * Drawing limits (`$LIMMIN` / `$LIMMAX`) to store instead of the
   * database's own, in drawing units.
   */
  limits?: {
    min: { x: number; y: number }
    max: { x: number; y: number }
  }
  /** Give up after this many milliseconds. @default 120000 */
  timeout?: number
}

/** Result of {@link AcDbAcadrustConverter.exportDatabase}. */
export interface AcadrustExportResult {
  bytes: Uint8Array
  /** What could not be written as it is in the drawing. */
  warnings: string[]
  report: AcadrustReport
}

/** Share of the progress bar the engine gets before the database is filled. */
const ENGINE_END_PCT = 10
/** The native reader's own PARSE range (see AcDbNativeDxfConverter). */
const NATIVE_PARSE_START_PCT = 1
const NATIVE_PARSE_END_PCT = 18

type Limits = { x: number; y: number }
type DatabaseLimits = {
  limmin?: Limits
  limmax?: Limits
}

/**
 * Reads DWG and DXF drawings with acadrust (MPL-2.0, Rust → WebAssembly) and
 * writes them back.
 *
 * **Reading.** The engine runs in a worker and turns the file into *binary
 * DXF*, which is handed to the page by transfer and read by the data model's
 * DXF reader. Nothing is copied between threads, and no intermediate object
 * tree is built: the binary pairs go straight into the database.
 *
 * **Writing.** The database writes binary DXF, and the engine turns that into
 * DWG, or into DXF of another version.
 *
 * @example
 * ```ts
 * const converter = new AcDbAcadrustConverter({
 *   parserWorkerUrl: './assets/acadrust-worker.js'
 * })
 * AcDbDatabaseConverterManager.instance.register(AcDbFileType.DWG, converter)
 * ```
 */
export class AcDbAcadrustConverter extends AcDbDatabaseConverter {
  readonly engine: AcadrustEngine
  /** What the engine reported for the drawing read last. */
  lastReport?: AcadrustReport
  private readonly native = new AcDbNativeDxfConverter()

  constructor(config: AcDbAcadrustConverterConfig = {}) {
    super({ useWorker: true, ...config })
    this.engine = new AcadrustEngine({
      workerUrl: config.parserWorkerUrl,
      wasmUrl: config.wasmUrl,
      wasm: config.wasm,
      useWorker: config.useWorker,
      idleTimeoutMs: config.idleTimeoutMs
    })
  }

  private get acadrustConfig() {
    return this.config as AcDbAcadrustConverterConfig
  }

  override async read(
    data: ArrayBuffer,
    db: AcDbDatabase,
    options: AcDbDatabaseConverterReadOptions = {}
  ): Promise<void> {
    const isDwg = acadrustIsDwg(data)
    if (!isDwg && (this.acadrustConfig.dxf ?? 'native') === 'native') {
      await this.native.read(data, db, options)
      return
    }
    await this.readThroughEngine(data, db, options, isDwg)
  }

  private async readThroughEngine(
    data: ArrayBuffer,
    db: AcDbDatabase,
    options: AcDbDatabaseConverterReadOptions,
    isDwg: boolean
  ) {
    const progress = options.progress
    this.progress = progress
    await progress?.(0, 'START', 'START')
    await progress?.(NATIVE_PARSE_START_PCT, 'PARSE', 'START')

    // Progress from the worker arrives as events; keep the callbacks in order.
    let relay: Promise<void> = Promise.resolve()
    let lastPct = NATIVE_PARSE_START_PCT
    const onProgress = (stage: 'read' | 'write', ratio: number) => {
      if (!progress) return
      // Reading is most of the engine's work; writing the binary DXF the rest.
      const share = stage === 'read' ? ratio * 0.8 : 0.8 + ratio * 0.2
      const pct = Math.floor(
        NATIVE_PARSE_START_PCT +
          share * (ENGINE_END_PCT - NATIVE_PARSE_START_PCT)
      )
      if (pct <= lastPct) return
      lastPct = pct
      relay = relay.then(() => progress(pct, 'PARSE', 'IN-PROGRESS'))
    }

    const timeout = this.getParserWorkerTimeout(data, options.timeout)
    let output: Uint8Array
    let preview: Uint8Array | undefined
    try {
      const result = await this.engine.convert(
        data,
        {
          source: isDwg ? 'dwg' : 'dxf',
          target: 'dxf-binary',
          strict: this.acadrustConfig.strict,
          encoding: isDwg ? undefined : options.encoding
        },
        // A DXF the engine cannot read still has the native reader to fall
        // back on, which needs the bytes back.
        { timeout, onProgress, returnInputOnError: !isDwg }
      )
      await relay
      this.lastReport = result.report
      this.logReport(result.report)
      output = result.output
      preview = result.preview
    } catch (error) {
      await relay.catch(() => {})
      const original = recoverInput(error, data)
      if (!isDwg && original) {
        log.warn(
          `[acadrust] DXF read with the built-in reader instead: ${describe(error)}`
        )
        await this.native.read(original, db, {
          ...options,
          progress: withoutStart(progress)
        })
        return
      }
      throw toOpenError(error)
    }

    await this.native.read(output.buffer as ArrayBuffer, db, {
      ...options,
      // The engine writes UTF-8 (binary DXF is R2010 or later).
      encoding: 'utf-8',
      progress: afterEngine(progress)
    })
    dropEmptyLimits(db)
    // The thumbnail stored in the DWG (file browsers, HTML export preview).
    if (preview && !db.thumbnailImage) db.thumbnailImage = preview
  }

  /**
   * Writes a drawing database as DWG, or as DXF of a chosen version.
   *
   * The database writes itself as binary DXF (R2018), which the engine
   * converts; the page never holds the drawing as text.
   */
  async exportDatabase(
    db: AcDbDatabase,
    options: AcadrustExportOptions
  ): Promise<AcadrustExportResult> {
    const holder = db as unknown as DatabaseLimits
    const saved = { limmin: holder.limmin, limmax: holder.limmax }
    let dxf: Uint8Array
    try {
      if (options.limits) {
        holder.limmin = { ...options.limits.min }
        holder.limmax = { ...options.limits.max }
      }
      dxf = db.dxfOut(undefined, 16, 'AC1032', {
        format: 'binary'
      }) as Uint8Array
    } finally {
      holder.limmin = saved.limmin
      holder.limmax = saved.limmax
    }
    const target: AcadrustTarget =
      options.format === 'dxf' ? 'dxf-ascii' : options.format
    const version =
      options.version ?? (options.format === 'dwg' ? 'AC1032' : undefined)
    const result = await this.engine.convert(
      dxf,
      { source: 'dxf', target, version },
      { timeout: options.timeout ?? 120_000 }
    )
    const warnings = result.report.diagnostics.map(
      diagnostic => diagnostic.message
    )
    if (result.report.diagnosticsTotal > warnings.length) {
      warnings.push(
        `… ${result.report.diagnosticsTotal - warnings.length} more`
      )
    }
    return { bytes: result.output, warnings, report: result.report }
  }

  /** Ends the engine's worker. A later read or export starts a new one. */
  dispose() {
    this.engine.dispose()
  }

  private logReport(report: AcadrustReport) {
    if (report.diagnosticsTotal === 0) return
    const shown = report.diagnostics
      .map(diagnostic => `${diagnostic.code}: ${diagnostic.message}`)
      .join('\n  ')
    log.warn(
      `[acadrust] ${report.diagnosticsTotal} record(s) skipped or repaired` +
        (report.recovered ? ' (the file is damaged)' : '') +
        `:\n  ${shown}`
    )
  }
}

/** DWG files start with a version tag (`AC1015`, `AC1.50`, …). */
export function acadrustIsDwg(data: ArrayBuffer | Uint8Array): boolean {
  const bytes =
    data instanceof Uint8Array
      ? data
      : new Uint8Array(data, 0, Math.min(6, data.byteLength))
  if (bytes.length < 6 || bytes[0] !== 0x41 || bytes[1] !== 0x43) return false
  for (let index = 2; index < 6; index++) {
    const byte = bytes[index]
    const digit = byte >= 0x30 && byte <= 0x39
    if (!digit && byte !== 0x2e) return false
  }
  return true
}

/** The input of a failed job: handed back by the worker, or never sent. */
function recoverInput(error: unknown, data: ArrayBuffer) {
  if (error instanceof AcadrustJobError && error.input) return error.input
  // A transferred buffer is detached (length 0).
  return data.byteLength > 0 ? data : undefined
}

/** Progress for the native reader when START / PARSE START were already sent. */
function withoutStart(
  progress: AcDbConversionProgressCallback | undefined
): AcDbConversionProgressCallback | undefined {
  if (!progress) return undefined
  return async (percentage, stage, status, data, error) => {
    if (stage === 'START') return
    if (stage === 'PARSE' && status === 'START') return
    await progress(percentage, stage, status, data, error)
  }
}

/**
 * Progress for the native reader running after the engine: its PARSE range
 * (1–18 %) is squeezed into what the engine left (10–18 %).
 */
function afterEngine(
  progress: AcDbConversionProgressCallback | undefined
): AcDbConversionProgressCallback | undefined {
  if (!progress) return undefined
  return async (percentage, stage, status, data, error) => {
    if (stage === 'START') return
    if (stage === 'PARSE' && status === 'START') return
    if (stage === 'PARSE' && status === 'IN-PROGRESS') {
      const ratio =
        (percentage - NATIVE_PARSE_START_PCT) /
        (NATIVE_PARSE_END_PCT - NATIVE_PARSE_START_PCT)
      percentage = Math.floor(
        ENGINE_END_PCT +
          Math.max(0, Math.min(1, ratio)) *
            (NATIVE_PARSE_END_PCT - ENGINE_END_PCT)
      )
    }
    await progress(percentage, stage, status, data, error)
  }
}

/**
 * A drawing without limits comes out of the engine with `$LIMMIN` and
 * `$LIMMAX` both at the origin. That is "no limits", not a sheet of size zero.
 */
function dropEmptyLimits(db: AcDbDatabase) {
  const holder = db as unknown as DatabaseLimits
  const { limmin, limmax } = holder
  if (limmin && limmax && limmin.x === limmax.x && limmin.y === limmax.y) {
    holder.limmin = undefined
    holder.limmax = undefined
  }
}

function toOpenError(error: unknown): Error {
  if (error instanceof AcDbOpenDatabaseError) return error
  if (error instanceof AcadrustJobError) {
    const code =
      error.failure === 'out-of-memory'
        ? 'worker_oom'
        : error.failure === 'timeout'
          ? 'worker_timeout'
          : error.failure === 'unavailable'
            ? 'worker_error'
            : 'parse_failed'
    return new AcDbOpenDatabaseError(error.message, code, {
      stage: 'PARSE',
      cause: error
    })
  }
  return error instanceof Error ? error : new Error(String(error))
}

function describe(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
