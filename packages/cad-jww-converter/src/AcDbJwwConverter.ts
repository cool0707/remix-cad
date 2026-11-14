import {
  collectExportDrawing,
  type CollectOptions,
  type ExportDrawing,
  resolveExportImages
} from '@mlightcad/cad-export-model'
import {
  AcDbDatabase,
  AcDbDatabaseConverter,
  type AcDbDatabaseConverterConfig,
  type AcDbDatabaseConverterReadOptions,
  AcDbNativeDxfConverter,
  AcDbRasterImage,
  log
} from '@mlightcad/data-model'

import { type JwwWriteOptions, writeJwwBytes } from './jwwExport'
import { imageMimeType, type JwwImageFile, jwwImageKey } from './jwwImage'
import {
  convertJwwToDxf,
  cropJwwImages,
  type JwwConversionResult,
  type JwwScaleMode
} from './jwwToDxf'
import type {
  JwwWorkerRequest,
  JwwWorkerResponse,
  JwwWriteResult
} from './jwwWorkerProtocol'

/** Configuration of {@link AcDbJwwConverter}. */
export interface AcDbJwwConverterConfig extends AcDbDatabaseConverterConfig {
  /**
   * URL of the ezjww wasm (`jww-parser.wasm`).
   *
   * With a worker it defaults to the file next to the worker script. Without
   * a worker it is required unless ezjww has already been initialized.
   */
  wasmUrl?: string | URL
  /**
   * How paper millimetres become drawing units.
   *
   * @default 'drawing'
   */
  scaleMode?: JwwScaleMode
  /**
   * How long an idle worker is kept before it is ended, in milliseconds.
   * Ending it returns the wasm's memory (WebAssembly memory never shrinks);
   * the next file starts a new worker. @default 20000
   */
  idleTimeoutMs?: number
}

/** A conversion result with the DXF still as UTF-8 bytes. */
type JwwDxfBytes = Omit<JwwConversionResult, 'dxf'> & { dxf: Uint8Array }

const DEFAULT_IDLE_TIMEOUT_MS = 20_000

/**
 * Reads Jw_cad drawings (`.jww`, and the older `.jwc`).
 *
 * The file is parsed by ezjww (MIT, Rust → WebAssembly), converted to DXF in
 * real-world millimetres, and then loaded by the data model's DXF reader, so
 * layers, blocks and text styles follow the regular DXF path.
 *
 * @example
 * ```ts
 * AcDbDatabaseConverterManager.instance.register(
 *   'jww',
 *   new AcDbJwwConverter({ parserWorkerUrl: './assets/jww-parser-worker.js' })
 * )
 * ```
 */
export class AcDbJwwConverter extends AcDbDatabaseConverter {
  private worker?: Worker
  private idleTimer?: ReturnType<typeof setTimeout>
  // Always the built-in reader, whatever is registered for `.dxf`: the DXF
  // written here is made for it.
  private readonly dxfReader = new AcDbNativeDxfConverter()
  private nextRequestId = 1
  private readonly pending = new Map<
    number,
    {
      resolve: (response: JwwWorkerResponse & { ok: true }) => void
      reject: (error: Error) => void
    }
  >()

  constructor(config: AcDbJwwConverterConfig = {}) {
    super({ useWorker: true, ...config })
  }

  override async read(
    data: ArrayBuffer,
    db: AcDbDatabase,
    options?: AcDbDatabaseConverterReadOptions
  ): Promise<void> {
    const timeout = this.getParserWorkerTimeout(data, options?.timeout)
    const result = await this.toDxfBytes(data, timeout)
    if (result.unsupportedEntities.length > 0) {
      log.warn(
        `[JWW] ${result.unsupportedEntities.length} entities were not converted:`,
        [...new Set(result.unsupportedEntities)].join(', ')
      )
    }
    for (const warning of result.warnings) log.warn(`[JWW] ${warning}`)
    await this.dxfReader.read(ownBuffer(result.dxf), db, {
      ...options,
      encoding: 'utf-8',
      // The viewer draws entities while the DXF converter flushes them, so
      // images get their pixels between parsing and that flush.
      progress: async (percentage, stage, status, data) => {
        if (stage === 'ENTITY' && status === 'START') {
          attachJwwImages(db, result.images)
        }
        await options?.progress?.(percentage, stage, status, data)
      }
    })
    // Fallback for a DXF converter without that stage: redraw late images.
    for (const entity of attachJwwImages(db, result.images)) {
      db.events.entityModified.dispatch({ database: db, entity })
    }
  }

  /** Converts JWW bytes to DXF text (in the worker when configured). */
  async toDxf(
    data: ArrayBuffer,
    timeout = 30000
  ): Promise<JwwConversionResult> {
    const result = await this.toDxfBytes(data, timeout)
    return { ...result, dxf: new TextDecoder().decode(result.dxf) }
  }

  /**
   * Converts JWW bytes to DXF as UTF-8 bytes. From the worker they arrive by
   * transfer, so the drawing is never held as a string on the page.
   */
  private async toDxfBytes(
    data: ArrayBuffer,
    timeout: number
  ): Promise<JwwDxfBytes> {
    const config = this.config as AcDbJwwConverterConfig
    if (this.usesWorker) {
      // Copy so the caller's buffer is not detached by the transfer.
      const copy = data.slice(0)
      const response = await this.postToWorker(
        { id: 0, data: copy, scaleMode: config.scaleMode },
        [copy],
        timeout,
        'JWW parsing'
      )
      if (response.kind === 'write') throw new Error('Unexpected response')
      return {
        dxf: new Uint8Array(response.dxf),
        unsupportedEntities: response.unsupportedEntities,
        images: response.images,
        warnings: response.warnings
      }
    }
    const ezjww = await this.loadEzjww()
    const result = await cropJwwImages(
      convertJwwToDxf(ezjww, new Uint8Array(data), {
        scaleMode: config.scaleMode
      })
    )
    return { ...result, dxf: new TextEncoder().encode(result.dxf) }
  }

  /**
   * Writes an exported drawing (see `collectExportDrawing` in
   * `@mlightcad/cad-export-model`) as a JWW file with ezjww's writer, in the
   * worker when configured.
   */
  async writeJww(
    drawing: ExportDrawing,
    options?: JwwWriteOptions,
    timeout = 60000
  ): Promise<JwwWriteResult> {
    if (this.usesWorker) {
      const response = await this.postToWorker(
        { id: 0, kind: 'write', drawing, options },
        [],
        timeout,
        'JWW writing'
      )
      if (response.kind !== 'write') throw new Error('Unexpected response')
      return { bytes: response.bytes, warnings: response.warnings }
    }
    return writeJwwBytes(await this.loadEzjww(), drawing, options)
  }

  /**
   * Writes a drawing database as a JWW file: flattens it on this thread and
   * writes it with {@link writeJww}. Jw_cad sheets are landscape.
   */
  async exportDatabase(
    db: AcDbDatabase,
    options: Omit<CollectOptions, 'portrait'> & JwwWriteOptions = {}
  ): Promise<JwwWriteResult> {
    const { colorMode, memo, ...collect } = options
    const drawing = collectExportDrawing(db, { ...collect, portrait: false })
    await resolveExportImages(drawing)
    return this.writeJww(drawing, { colorMode, memo })
  }

  private get usesWorker() {
    return this.config.useWorker !== false && !!this.config.parserWorkerUrl
  }

  private async loadEzjww() {
    const config = this.config as AcDbJwwConverterConfig
    const ezjww = await import('ezjww')
    if (!ezjww.isInitialized()) {
      if (!config.wasmUrl) {
        throw new Error(
          'AcDbJwwConverter: set parserWorkerUrl or wasmUrl to load the JWW parser'
        )
      }
      const response = await fetch(config.wasmUrl)
      if (!response.ok) {
        throw new Error(
          `Failed to load ${String(config.wasmUrl)} (HTTP ${response.status})`
        )
      }
      await ezjww.initAsync(await response.arrayBuffer())
    }
    return ezjww
  }

  /** Stops the parser worker. A later read starts a new one. */
  dispose() {
    if (this.idleTimer !== undefined) {
      clearTimeout(this.idleTimer)
      this.idleTimer = undefined
    }
    this.worker?.terminate()
    this.worker = undefined
    for (const { reject } of this.pending.values()) {
      reject(new Error('JWW parser worker was terminated'))
    }
    this.pending.clear()
  }

  private postToWorker(
    request: JwwWorkerRequest,
    transfer: Transferable[],
    timeout: number,
    label: string
  ) {
    const config = this.config as AcDbJwwConverterConfig
    const worker = this.ensureWorker()
    const id = this.nextRequestId++
    if (this.idleTimer !== undefined) {
      clearTimeout(this.idleTimer)
      this.idleTimer = undefined
    }
    return new Promise<JwwWorkerResponse & { ok: true }>((resolve, reject) => {
      const timer = setTimeout(() => {
        // The wasm call cannot be interrupted; drop the worker instead.
        this.dispose()
        reject(new Error(`${label} timed out after ${timeout} ms`))
      }, timeout)
      this.pending.set(id, {
        resolve: result => {
          clearTimeout(timer)
          resolve(result)
        },
        reject: error => {
          clearTimeout(timer)
          reject(error)
        }
      })
      const message: JwwWorkerRequest = {
        ...request,
        id,
        wasmUrl: config.wasmUrl
          ? new URL(String(config.wasmUrl), globalThis.location?.href).href
          : undefined
      }
      worker.postMessage(message, transfer)
    })
  }

  private ensureWorker() {
    if (!this.worker) {
      const worker = new Worker(this.config.parserWorkerUrl!)
      worker.onmessage = (event: MessageEvent<JwwWorkerResponse>) => {
        const response = event.data
        const request = this.pending.get(response.id)
        if (!request) return
        this.pending.delete(response.id)
        this.endWorkerWhenIdle()
        if (response.ok) {
          request.resolve(response)
        } else {
          request.reject(new Error(response.error))
        }
      }
      worker.onerror = event => {
        const error = new Error(
          `JWW parser worker failed: ${event.message || 'unknown error'}`
        )
        for (const { reject } of this.pending.values()) reject(error)
        this.pending.clear()
        this.worker?.terminate()
        this.worker = undefined
      }
      this.worker = worker
    }
    return this.worker
  }

  /**
   * Ends the worker once nothing has used it for a while. The ezjww wasm
   * keeps the memory of the largest file it parsed, and a viewer session
   * usually opens a JWW file once in a long while.
   */
  private endWorkerWhenIdle() {
    if (this.pending.size > 0 || !this.worker) return
    const config = this.config as AcDbJwwConverterConfig
    const delay = config.idleTimeoutMs ?? DEFAULT_IDLE_TIMEOUT_MS
    this.idleTimer = setTimeout(
      () => {
        this.idleTimer = undefined
        if (this.pending.size === 0) this.dispose()
      },
      Math.max(0, delay)
    )
    // Never keep a Node process alive for this.
    ;(this.idleTimer as { unref?: () => void }).unref?.()
  }
}

/** The bytes as a buffer of their own (no copy when they already are). */
function ownBuffer(bytes: Uint8Array): ArrayBuffer {
  const whole =
    bytes.byteOffset === 0 && bytes.byteLength === bytes.buffer.byteLength
  return (whole ? bytes.buffer : bytes.slice().buffer) as ArrayBuffer
}

/**
 * Gives each IMAGE entity the pixels of the embedded image it names. Images
 * that are not embedded keep only their path and show up as missing images,
 * which the user can supply from the viewer. Returns the images it filled.
 */
export function attachJwwImages(
  db: AcDbDatabase,
  images: JwwImageFile[]
): AcDbRasterImage[] {
  const attached: AcDbRasterImage[] = []
  if (images.length === 0) return attached
  const blobs = new Map<string, Blob>()
  for (const image of images) {
    blobs.set(
      jwwImageKey(image.name),
      new Blob([image.data as BlobPart], {
        type: imageMimeType(image.data, image.name)
      })
    )
  }
  for (const block of db.tables.blockTable.newIterator()) {
    for (const entity of block.newIterator()) {
      if (!(entity instanceof AcDbRasterImage) || entity.image) continue
      const blob = blobs.get(jwwImageKey(entity.imageFileName))
      if (blob) {
        entity.image = blob
        attached.push(entity)
      }
    }
  }
  return attached
}
