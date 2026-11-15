/**
 * Copy web worker assets for packages in this monorepo.
 *
 * Producer (cad-simple-viewer):
 *   node tools/copy-workers.mjs
 *   → copies mtext worker into ./dist
 *
 * Consumer (examples):
 *   node tools/copy-workers.mjs dist/workers
 *   → copies *-worker.js from @mlightcad/cad-simple-viewer/dist
 *   → copies the DWG / DXF worker + wasm from
 *     @mlightcad/cad-acadrust-converter when the example depends on it
 *   → copies JWW worker + wasm from @mlightcad/cad-jww-converter when present
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync
} from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import {
  ACADRUST_CONVERTER_PACKAGE,
  ACADRUST_WASM_FILE,
  ACADRUST_WORKER_FILE,
  JWW_CONVERTER_PACKAGE,
  JWW_PARSER_WASM_FILE,
  JWW_PARSER_WORKER_FILE,
  MTEXT_RENDERER_PACKAGE,
  MTEXT_RENDERER_WORKER_FILE
} from './worker-assets.mjs'

const packageRoot = process.cwd()
const require = createRequire(join(packageRoot, 'package.json'))
const destRelative = process.argv[2]

function pkgRoot(name) {
  const entry = require.resolve(name)
  let dir = dirname(entry)
  while (true) {
    const pkgPath = join(dir, 'package.json')
    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
      if (pkg.name === name) {
        return dir
      }
    }
    const parent = dirname(dir)
    if (parent === dir) {
      throw new Error(`Package root not found: ${name}`)
    }
    dir = parent
  }
}

function tryPkgRoot(name) {
  try {
    return pkgRoot(name)
  } catch {
    return null
  }
}

function copy(from, to) {
  if (!existsSync(from)) {
    throw new Error(`Missing asset: ${from}`)
  }
  copyFileSync(from, to)
  console.log(`Copied ${from} -> ${to}`)
}

function copyIfExists(from, to) {
  if (!existsSync(from)) {
    console.log(`Skipped (not found): ${from}`)
    return false
  }
  copyFileSync(from, to)
  console.log(`Copied ${from} -> ${to}`)
  return true
}

function copyOptionalWorker(pkgName, workerFile, outDir) {
  const root = tryPkgRoot(pkgName)
  if (!root) {
    console.log(`Skipped (package not found): ${pkgName}`)
    return
  }
  copyIfExists(join(root, 'dist', workerFile), join(outDir, workerFile))
}

function copyProducerWorkers() {
  const outDir = join(packageRoot, 'dist')
  mkdirSync(outDir, { recursive: true })
  copy(
    join(pkgRoot(MTEXT_RENDERER_PACKAGE), 'dist', MTEXT_RENDERER_WORKER_FILE),
    join(outDir, MTEXT_RENDERER_WORKER_FILE)
  )
}

function copyAcadrustAssets(outDir) {
  copyOptionalWorker(ACADRUST_CONVERTER_PACKAGE, ACADRUST_WORKER_FILE, outDir)
  copyOptionalWorker(ACADRUST_CONVERTER_PACKAGE, ACADRUST_WASM_FILE, outDir)
}

function copyJwwAssets(outDir) {
  copyOptionalWorker(JWW_CONVERTER_PACKAGE, JWW_PARSER_WORKER_FILE, outDir)
  copyOptionalWorker(JWW_CONVERTER_PACKAGE, JWW_PARSER_WASM_FILE, outDir)
}

function copyFromCadSimpleViewer(destRelativePath) {
  const srcDir = join(pkgRoot('@mlightcad/cad-simple-viewer'), 'dist')
  if (!existsSync(srcDir)) {
    throw new Error(
      `Missing ${srcDir}. Run copy:workers in @mlightcad/cad-simple-viewer first.`
    )
  }

  const workers = readdirSync(srcDir).filter(name =>
    name.endsWith('-worker.js')
  )
  if (workers.length === 0) {
    throw new Error(
      `No *-worker.js files in ${srcDir}. Run copy:workers in @mlightcad/cad-simple-viewer first.`
    )
  }

  const outDir = resolve(packageRoot, destRelativePath)
  mkdirSync(outDir, { recursive: true })

  for (const name of workers) {
    copy(join(srcDir, name), join(outDir, name))
  }

  // Converters are host-owned; copy when the example depends on them.
  copyAcadrustAssets(outDir)
  copyJwwAssets(outDir)
}

if (destRelative) {
  copyFromCadSimpleViewer(destRelative)
} else {
  copyProducerWorkers()
}
