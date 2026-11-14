/**
 * Canonical filenames for Web Worker JS bundles used by the viewer.
 *
 * Keep these in one place so rename/migration is a single-file change.
 * Build scripts mirror these in: `tools/worker-assets.mjs`
 *
 * Only the MTEXT worker belongs to this package. File-format converters
 * (DWG / DXF: `@mlightcad/cad-acadrust-converter`, JWW:
 * `@mlightcad/cad-jww-converter`) ship their own workers and export the
 * file names themselves; hosts register the converters they want.
 */

/** MTEXT layout/shaping worker from `@mlightcad/mtext-renderer`. */
export const MTEXT_RENDERER_WORKER_FILE = 'mtext-renderer-worker.js'

/** npm package that ships {@link MTEXT_RENDERER_WORKER_FILE}. */
export const MTEXT_RENDERER_PACKAGE = '@mlightcad/mtext-renderer'
