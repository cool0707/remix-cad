/** Worker bundle shipped in `dist/`; deploy it with the app. */
export const ACADRUST_WORKER_FILE = 'acadrust-worker.js'

/**
 * The acadrust engine (WebAssembly) shipped in `dist/`. The worker loads it
 * from the same directory as {@link ACADRUST_WORKER_FILE}.
 */
export const ACADRUST_WASM_FILE = 'acadrust-engine.wasm'

/** Drawing file versions the engine reads and writes. */
export const ACADRUST_VERSIONS = [
  'AC1009',
  'AC1012',
  'AC1014',
  'AC1015',
  'AC1018',
  'AC1021',
  'AC1024',
  'AC1027',
  'AC1032'
] as const

/** A drawing file version (`AC1015` = AutoCAD 2000, `AC1032` = 2018, …). */
export type AcadrustVersion = (typeof ACADRUST_VERSIONS)[number]

/** Product names of the versions, for menus. */
export const ACADRUST_VERSION_LABELS: Record<AcadrustVersion, string> = {
  AC1009: 'R12',
  AC1012: 'R13',
  AC1014: 'R14',
  AC1015: '2000',
  AC1018: '2004',
  AC1021: '2007',
  AC1024: '2010',
  AC1027: '2013',
  AC1032: '2018'
}
