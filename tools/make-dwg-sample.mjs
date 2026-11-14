#!/usr/bin/env node
/**
 * Writes resources/cad-data/samples/dwg-sample.dwg: the Jw_cad sample drawing
 * (tools/make-jww-sample.mjs) converted to DWG with the same code the viewer
 * uses — ezjww → DXF → acadrust → DWG 2018. The drawing is our own, so the
 * file carries no third-party content.
 *
 *   pnpm build            (the converters' dist/ must exist)
 *   node tools/make-dwg-sample.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const samples = join(root, 'resources/cad-data/samples')
const jwwPackage = join(root, 'packages/cad-jww-converter')
const acadrustPackage = join(root, 'packages/cad-acadrust-converter')

const load = path => import(pathToFileURL(path).href)
const requireFromJww = createRequire(join(jwwPackage, 'package.json'))

const ezjww = await load(requireFromJww.resolve('ezjww'))
ezjww.initSync(readFileSync(requireFromJww.resolve('ezjww/wasm/ezjww_wasm_bg.wasm')))
const { convertJwwToDxf } = await load(
  join(jwwPackage, 'dist/cad-jww-converter.js')
)
const { compileAcadrustEngine, runAcadrustJob } = await load(
  join(acadrustPackage, 'dist/cad-acadrust-converter.js')
)

const jww = new Uint8Array(readFileSync(join(samples, 'jww-sample.jww')))
const { dxf, warnings } = convertJwwToDxf(ezjww, jww)
for (const warning of warnings) console.warn(`[JWW] ${warning}`)

const engine = await compileAcadrustEngine(
  readFileSync(join(acadrustPackage, 'dist/acadrust-engine.wasm'))
)
const result = await runAcadrustJob(engine, new TextEncoder().encode(dxf), {
  source: 'dxf',
  target: 'dwg',
  version: 'AC1032'
})
for (const diagnostic of result.report.diagnostics) {
  console.warn(`[acadrust] ${diagnostic.code}: ${diagnostic.message}`)
}
const target = join(samples, 'dwg-sample.dwg')
writeFileSync(target, result.output)
console.log(
  `Wrote ${target} (${result.output.byteLength} bytes, ${result.report.entities} entities, ${result.report.outputVersion})`
)
