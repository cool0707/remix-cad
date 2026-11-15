import {
  AcDbDatabase,
  AcDbDatabaseConverter,
  type AcDbDatabaseConverterConfig,
  type AcDbDatabaseConverterReadOptions,
  AcDbNativeDxfConverter,
  AcDbRasterImage,
  log
} from '@mlightcad/data-model'

import { convertSxfToDxf } from './convertSxf'
import { type SxfImageFile, sxfImageKey } from './image'
import type { SxfScaleMode } from './sxfToDxf'

/** Configuration of {@link AcDbSxfConverter}. */
export interface AcDbSxfConverterConfig extends AcDbDatabaseConverterConfig {
  /**
   * How paper millimetres become drawing units.
   *
   * @default 'drawing'
   */
  scaleMode?: SxfScaleMode
}

/**
 * Reads SXF drawings (the Japanese CAD data exchange standard used for
 * public works deliverables): SFC feature files, P21 (AP202) files and their
 * ZIP forms SFZ / P2Z.
 *
 * The file is parsed in TypeScript (no WebAssembly), flattened into lines,
 * curves, text and fills, written as DXF and loaded by the data model's DXF
 * reader.
 */
export class AcDbSxfConverter extends AcDbDatabaseConverter {
  // Always the built-in reader, whatever is registered for `.dxf`: the DXF
  // written here is made for it, and a detour through another converter would
  // only cost time.
  private readonly dxfReader = new AcDbNativeDxfConverter()

  constructor(config: AcDbSxfConverterConfig = {}) {
    super({ useWorker: false, ...config })
  }

  override async read(
    data: ArrayBuffer,
    db: AcDbDatabase,
    options?: AcDbDatabaseConverterReadOptions
  ): Promise<void> {
    const config = this.config as AcDbSxfConverterConfig
    const result = convertSxfToDxf(new Uint8Array(data), {
      scaleMode: config.scaleMode
    })
    if (result.warnings.length > 0) {
      log.warn(
        `[SXF] ${result.warnings.length} conversion notes:`,
        result.warnings
      )
    }
    const bytes = new TextEncoder().encode(result.dxf)
    await this.dxfReader.read(bytes.buffer as ArrayBuffer, db, {
      ...options,
      encoding: 'utf-8',
      // The viewer draws entities while the DXF converter flushes them, so
      // images get their pixels between parsing and that flush.
      progress: async (percentage, stage, status, data) => {
        if (stage === 'ENTITY' && status === 'START') {
          attachSxfImages(db, result.images)
        }
        await options?.progress?.(percentage, stage, status, data)
      }
    })
    // Fallback for a DXF converter without that stage: redraw late images.
    for (const entity of attachSxfImages(db, result.images)) {
      db.events.entityModified.dispatch({ database: db, entity })
    }
  }
}

/**
 * Gives each IMAGE entity the pixels of the bundled file it names. Images
 * that are not bundled keep only their file name and show up as missing
 * images, which the user can supply from the viewer. Returns the images it
 * filled.
 */
export function attachSxfImages(
  db: AcDbDatabase,
  images: SxfImageFile[]
): AcDbRasterImage[] {
  const attached: AcDbRasterImage[] = []
  if (images.length === 0) return attached
  const blobs = new Map<string, Blob>()
  for (const image of images) {
    blobs.set(
      sxfImageKey(image.name),
      new Blob([image.data as BlobPart], { type: image.mimeType })
    )
  }
  for (const block of db.tables.blockTable.newIterator()) {
    for (const entity of block.newIterator()) {
      if (!(entity instanceof AcDbRasterImage) || entity.image) continue
      const blob = blobs.get(sxfImageKey(entity.imageFileName))
      if (blob) {
        entity.image = blob
        attached.push(entity)
      }
    }
  }
  return attached
}
