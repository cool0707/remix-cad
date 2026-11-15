import {
  AcDbDatabaseConverterManager,
  AcDbFileType
} from '@mlightcad/data-model'

import {
  AcDbAcadrustConverter,
  type AcDbAcadrustConverterConfig
} from './AcDbAcadrustConverter'

/**
 * Registers {@link AcDbAcadrustConverter} for DWG files — and for DXF files
 * when `config.dxf` is `'engine'` (by default DXF stays with the data model's
 * own reader, which is faster; see {@link AcadrustDxfMode}).
 *
 * @param parserWorkerUrl - URL of `acadrust-worker.js` (with
 *   `acadrust-engine.wasm` next to it)
 * @returns The registered converter, which also writes DWG / DXF
 *   ({@link AcDbAcadrustConverter.exportDatabase})
 */
export function registerAcadrustConverter(
  parserWorkerUrl: string | URL,
  config: Omit<AcDbAcadrustConverterConfig, 'parserWorkerUrl'> = {}
): AcDbAcadrustConverter {
  const converter = new AcDbAcadrustConverter({ ...config, parserWorkerUrl })
  AcDbDatabaseConverterManager.instance.register(AcDbFileType.DWG, converter)
  if (config.dxf === 'engine') {
    AcDbDatabaseConverterManager.instance.register(AcDbFileType.DXF, converter)
  }
  return converter
}
