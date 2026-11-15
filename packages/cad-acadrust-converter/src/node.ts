/**
 * Node entry: the engine's WebAssembly read from this package, for tools
 * that convert drawings without a browser (CLI, HTML export, tests).
 *
 * ```ts
 * import { AcDbAcadrustConverter } from '@mlightcad/cad-acadrust-converter'
 * import { loadAcadrustWasm } from '@mlightcad/cad-acadrust-converter/node'
 *
 * const converter = new AcDbAcadrustConverter({ wasm: loadAcadrustWasm })
 * ```
 */
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { ACADRUST_WASM_FILE } from './constants'

/** Reads `acadrust-engine.wasm` that ships next to this module. */
export async function loadAcadrustWasm(): Promise<Uint8Array> {
  // Not `new URL(file, import.meta.url)`: bundlers treat that as an asset to
  // inline, and this file is 6 MB.
  const directory = dirname(fileURLToPath(import.meta.url))
  return readFile(join(directory, ACADRUST_WASM_FILE))
}
