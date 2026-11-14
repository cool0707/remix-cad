/**
 * Canonical filenames for Web Worker JS bundles (and the WebAssembly they
 * load) shipped with the viewer.
 *
 * Keep these in one place so rename/migration is a single-file change.
 * Runtime TypeScript mirrors these in:
 *   packages/cad-simple-viewer/src/app/AcApWorkerAssets.ts   (MTEXT)
 *   packages/cad-acadrust-converter/src/constants.ts         (DWG / DXF)
 *   packages/cad-jww-converter/src/constants.ts              (JWW)
 */

/** DWG / DXF worker from `@mlightcad/cad-acadrust-converter` (acadrust, MPL-2.0). */
export const ACADRUST_WORKER_FILE = 'acadrust-worker.js'

/**
 * acadrust engine (WebAssembly), sibling of {@link ACADRUST_WORKER_FILE}.
 * Must be deployed next to the worker (wasm is not inlined).
 */
export const ACADRUST_WASM_FILE = 'acadrust-engine.wasm'

/** JWW (Jw_cad) parser worker from `@mlightcad/cad-jww-converter` (MIT, ezjww). */
export const JWW_PARSER_WORKER_FILE = 'jww-parser-worker.js'

/**
 * ezjww wasm sibling of {@link JWW_PARSER_WORKER_FILE}.
 * Must be deployed next to the worker.
 */
export const JWW_PARSER_WASM_FILE = 'jww-parser.wasm'

/** MTEXT layout/shaping worker from `@mlightcad/mtext-renderer`. */
export const MTEXT_RENDERER_WORKER_FILE = 'mtext-renderer-worker.js'

export const ACADRUST_CONVERTER_PACKAGE = '@mlightcad/cad-acadrust-converter'
export const JWW_CONVERTER_PACKAGE = '@mlightcad/cad-jww-converter'
export const MTEXT_RENDERER_PACKAGE = '@mlightcad/mtext-renderer'
