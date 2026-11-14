#!/usr/bin/env node
/**
 * Builds the acadrust engine (engine/, Rust) to WebAssembly and stores it as
 * wasm/acadrust-engine.wasm, which is checked in so that building the viewer
 * needs no Rust toolchain.
 *
 *   node scripts/build-wasm.mjs           build and record wasm/BUILD_INFO.json
 *   node scripts/build-wasm.mjs --check   fail when the engine sources changed
 *                                         since the checked-in wasm was built
 *
 * Needs rustup (the toolchain and the wasm32-wasip1 target are pinned in
 * engine/rust-toolchain.toml and installed on demand).
 */
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync
} from 'node:fs'
import { dirname, join, relative } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const packageDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const engineDir = join(packageDir, 'engine')
const wasmDir = join(packageDir, 'wasm')
const wasmFile = join(wasmDir, 'acadrust-engine.wasm')
const infoFile = join(wasmDir, 'BUILD_INFO.json')
const TARGET = 'wasm32-wasip1'
const CRATE_OUTPUT = 'remixcad_acadrust_engine.wasm'

/** Everything the wasm is built from, in a stable order. */
function sourceFiles() {
  const files = ['Cargo.toml', 'Cargo.lock', 'rust-toolchain.toml']
  const walk = dir => {
    for (const name of readdirSync(dir).sort()) {
      const path = join(dir, name)
      if (statSync(path).isDirectory()) walk(path)
      else if (name.endsWith('.rs')) files.push(relative(engineDir, path))
    }
  }
  walk(join(engineDir, 'src'))
  return files
}

function sourceHash() {
  const hash = createHash('sha256')
  for (const file of sourceFiles()) {
    hash.update(file.replace(/\\/g, '/'))
    hash.update('\0')
    // Line endings must not change the hash (Windows checkouts).
    hash.update(readFileSync(join(engineDir, file), 'utf8').replace(/\r\n/g, '\n'))
    hash.update('\0')
  }
  return hash.digest('hex')
}

function sha256(file) {
  return createHash('sha256').update(readFileSync(file)).digest('hex')
}

function lockedVersion(name) {
  const lock = readFileSync(join(engineDir, 'Cargo.lock'), 'utf8')
  const match = lock.match(
    new RegExp(`name = "${name}"\\s+version = "([^"]+)"`)
  )
  return match?.[1]
}

function check() {
  if (!existsSync(wasmFile) || !existsSync(infoFile)) {
    console.error(`Missing ${relative(packageDir, wasmFile)}. Run: pnpm build:wasm`)
    process.exit(1)
  }
  const info = JSON.parse(readFileSync(infoFile, 'utf8'))
  const problems = []
  if (info.sourceHash !== sourceHash()) {
    problems.push('the engine sources changed since the wasm was built')
  }
  if (info.wasmSha256 !== sha256(wasmFile)) {
    problems.push('the wasm does not match BUILD_INFO.json')
  }
  if (problems.length > 0) {
    console.error(`acadrust-engine.wasm is stale: ${problems.join('; ')}.`)
    console.error('Run: pnpm --filter @mlightcad/cad-acadrust-converter build:wasm')
    process.exit(1)
  }
  console.log(
    `acadrust-engine.wasm is up to date (acadrust ${info.acadrust}, ${info.wasmBytes} bytes).`
  )
}

function build() {
  const run = (command, args) =>
    execFileSync(command, args, { cwd: engineDir, stdio: 'inherit' })
  run('cargo', ['build', '--release', '--locked', '--target', TARGET])
  const built = join(engineDir, 'target', TARGET, 'release', CRATE_OUTPUT)
  mkdirSync(wasmDir, { recursive: true })
  copyFileSync(built, wasmFile)
  const rustc = execFileSync('rustc', ['--version'], {
    cwd: engineDir,
    encoding: 'utf8'
  }).trim()
  const info = {
    acadrust: lockedVersion('acadrust'),
    rustc,
    target: TARGET,
    sourceHash: sourceHash(),
    wasmSha256: sha256(wasmFile),
    wasmBytes: statSync(wasmFile).size
  }
  writeFileSync(infoFile, JSON.stringify(info, null, 2) + '\n')
  console.log(`Wrote ${relative(packageDir, wasmFile)} (${info.wasmBytes} bytes)`)
}

if (process.argv.includes('--check')) check()
else build()
