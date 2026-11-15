import { execFileSync } from 'child_process'
import { readFileSync } from 'fs'
import { resolve } from 'path'

import { AcadrustEngine, AcadrustJobError } from '../src/AcadrustEngine'
import {
  AcadrustEngineError,
  compileAcadrustEngine,
  prepareAcadrustJob,
  runAcadrustJob
} from '../src/engineHost'

const PACKAGE = resolve(__dirname, '..')
const WASM = resolve(PACKAGE, 'wasm/acadrust-engine.wasm')
const TWO_LINES = resolve(
  PACKAGE,
  '../cad-viewer-example/e2e/fixtures/two-lines.dxf'
)

let wasmModule: WebAssembly.Module

beforeAll(async () => {
  wasmModule = await compileAcadrustEngine(readFileSync(WASM))
})

describe('acadrust-engine.wasm', () => {
  it('was built from the engine sources in this repository', () => {
    // Fails when engine/ changed without `pnpm build:wasm`.
    execFileSync('node', ['scripts/build-wasm.mjs', '--check'], {
      cwd: PACKAGE,
      stdio: 'pipe'
    })
  })

  it('asks the host for nothing but its own imports and WASI', () => {
    const modules = new Set(
      WebAssembly.Module.imports(wasmModule).map(item => item.module)
    )
    expect([...modules].sort()).toEqual(['env', 'wasi_snapshot_preview1'])
  })
})

describe('runAcadrustJob', () => {
  it('converts ASCII DXF to binary DXF and reports what it read', async () => {
    const stages: string[] = []
    const result = await runAcadrustJob(
      wasmModule,
      new Uint8Array(readFileSync(TWO_LINES)),
      {},
      stage => {
        if (stages[stages.length - 1] !== stage) stages.push(stage)
      }
    )
    expect(new TextDecoder().decode(result.output.subarray(0, 18))).toBe(
      'AutoCAD Binary DXF'
    )
    expect(result.report).toMatchObject({
      ok: true,
      source: 'dxf',
      entities: 2,
      recovered: false
    })
    expect(result.report.outputBytes).toBe(result.output.byteLength)
    expect(stages).toEqual(['read', 'write'])
    // The output is a buffer of its own, not a view of the instance's memory.
    expect(result.output.byteOffset).toBe(0)
    expect(result.output.buffer.byteLength).toBe(result.output.byteLength)
  })

  it('goes from DXF to DWG and back', async () => {
    const dwg = await runAcadrustJob(
      wasmModule,
      new Uint8Array(readFileSync(TWO_LINES)),
      { target: 'dwg', version: 'AC1027' }
    )
    expect(new TextDecoder().decode(dwg.output.subarray(0, 6))).toBe('AC1027')
    const dxf = await runAcadrustJob(wasmModule, dwg.output, {
      target: 'dxf-ascii'
    })
    expect(dxf.report.source).toBe('dwg')
    expect(dxf.report.sourceVersion).toBe('AC1027')
    expect(dxf.report.entities).toBe(2)
    expect(new TextDecoder().decode(dxf.output)).toContain('LINE')
  })

  it('does not need the input after the job is prepared', async () => {
    const input = new Uint8Array(readFileSync(TWO_LINES))
    const job = await prepareAcadrustJob(wasmModule, input)
    input.fill(0)
    expect(job.run().report.entities).toBe(2)
  })

  it('rejects an empty file with an error, not a crash', async () => {
    const failure = await runAcadrustJob(wasmModule, new Uint8Array(0)).then(
      () => undefined,
      error => error
    )
    expect(failure).toBeInstanceOf(AcadrustEngineError)
    expect((failure as AcadrustEngineError).trapped).toBe(false)
    expect((failure as Error).message).toMatch(/empty/)
  })

  it('rejects an unknown version', async () => {
    await expect(
      runAcadrustJob(wasmModule, new Uint8Array(readFileSync(TWO_LINES)), {
        target: 'dwg',
        version: 'AC9999' as never
      })
    ).rejects.toThrow(/AC9999/)
  })

  it('survives damaged drawings: an error or a partial read, never a hang', async () => {
    const original = (
      await runAcadrustJob(
        wasmModule,
        new Uint8Array(readFileSync(TWO_LINES)),
        { target: 'dwg' }
      )
    ).output
    let seed = 20261114
    const random = () =>
      (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff
    for (let round = 0; round < 24; round++) {
      const bytes = original.slice()
      for (let index = 0; index < 48; index++) {
        const at = 128 + Math.floor(random() * (bytes.length - 128))
        bytes[at] = Math.floor(random() * 256)
      }
      const outcome = await runAcadrustJob(wasmModule, bytes).then(
        result => result.report,
        error => error
      )
      if (outcome instanceof Error) {
        expect(outcome).toBeInstanceOf(AcadrustEngineError)
      } else {
        expect(outcome.ok).toBe(true)
      }
    }
  })
})

describe('AcadrustEngine (on the calling thread)', () => {
  it('runs queued jobs one after the other', async () => {
    const engine = new AcadrustEngine({ wasm: wasmModule })
    const input = () => new Uint8Array(readFileSync(TWO_LINES))
    const results = await Promise.all([
      engine.convert(input(), { target: 'dwg' }),
      engine.convert(input(), { target: 'dxf-ascii' }),
      engine.convert(input())
    ])
    expect(results.map(result => result.report.entities)).toEqual([2, 2, 2])
    expect(new TextDecoder().decode(results[0].output.subarray(0, 2))).toBe(
      'AC'
    )
    engine.dispose()
  })

  it('names the failure', async () => {
    const engine = new AcadrustEngine({ wasm: wasmModule })
    const rejected = await engine.convert(new Uint8Array(0)).then(
      () => undefined,
      error => error
    )
    expect(rejected).toBeInstanceOf(AcadrustJobError)
    expect((rejected as AcadrustJobError).failure).toBe('rejected')

    const missing = new AcadrustEngine({})
    const unavailable = await missing.convert(new Uint8Array(4)).then(
      () => undefined,
      error => error
    )
    expect((unavailable as AcadrustJobError).failure).toBe('unavailable')
    // A failed job does not block the queue.
    const after = await engine.convert(new Uint8Array(readFileSync(TWO_LINES)))
    expect(after.report.entities).toBe(2)
  })
})
