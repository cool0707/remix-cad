import {
  AcDbDatabase,
  AcDbDatabaseConverterManager,
  AcDbFileType,
  acdbHostApplicationServices,
  AcDbOpenDatabaseError
} from '@mlightcad/data-model'
import { readFileSync } from 'fs'
import { resolve } from 'path'

import {
  acadrustIsDwg,
  AcDbAcadrustConverter
} from '../src/AcDbAcadrustConverter'
import { runAcadrustJob } from '../src/engineHost'
import { registerAcadrustConverter } from '../src/registerAcadrustConverter'

const ROOT = resolve(__dirname, '../../..')
const WASM = resolve(__dirname, '../wasm/acadrust-engine.wasm')
const FIXTURES = resolve(ROOT, 'packages/cad-viewer-example/e2e/fixtures')
const SAMPLES = resolve(ROOT, 'resources/cad-data/samples')

function fileBytes(path: string): ArrayBuffer {
  const buffer = readFileSync(path)
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer
}

/** Text of `sjis-sample.dxf` (Shift_JIS behind an ANSI_1252 header). */
const SJIS_SAMPLE_TEXTS = [
  'Shift_JIS の DXF（$DWGCODEPAGE は ANSI_1252）',
  '①　㎡　ｶﾀｶﾅ　「設計図書」',
  '平面図　縮尺 1/100'
]

let wasmModule: WebAssembly.Module

function newConverter(
  config: ConstructorParameters<typeof AcDbAcadrustConverter>[0] = {}
) {
  return new AcDbAcadrustConverter({ wasm: wasmModule, ...config })
}

async function open(
  data: ArrayBuffer,
  type: string,
  converter?: AcDbAcadrustConverter,
  options: Record<string, unknown> = {}
) {
  if (converter) {
    AcDbDatabaseConverterManager.instance.register(type, converter)
  }
  const db = new AcDbDatabase()
  acdbHostApplicationServices().workingDatabase = db
  await db.read(data, { minimumChunkSize: 1000, ...options }, type)
  return db
}

/** Entity counts per space and type, and the text in the drawing. */
function summarize(db: AcDbDatabase) {
  const counts: Record<string, number> = {}
  const texts: string[] = []
  for (const block of db.tables.blockTable.newIterator()) {
    const space = block.isModelSapce ? 'M' : block.isPaperSapce ? 'P' : 'B'
    for (const entity of block.newIterator()) {
      const key = `${space}:${entity.type}`
      counts[key] = (counts[key] ?? 0) + 1
      const text = (entity as unknown as { textString?: unknown }).textString
      if (typeof text === 'string') texts.push(text)
    }
  }
  const layers = [...db.tables.layerTable.newIterator()]
    .map(layer => layer.name)
    .sort()
  const layouts = [...db.objects.layout.newIterator()]
    .map(layout => layout.layoutName)
    .sort()
  return {
    counts: Object.fromEntries(Object.entries(counts).sort()),
    texts: texts.sort(),
    layers,
    layouts
  }
}

/** DWG bytes written by the engine from one of the repository's DXF files. */
async function dwgFrom(path: string, version: 'AC1015' | 'AC1032' = 'AC1032') {
  const result = await runAcadrustJob(
    wasmModule,
    new Uint8Array(fileBytes(path)),
    { target: 'dwg', version }
  )
  return result.output.buffer as ArrayBuffer
}

beforeAll(async () => {
  wasmModule = await WebAssembly.compile(readFileSync(WASM))
})

afterEach(() => {
  // Leave the manager as other suites expect it: DXF with the built-in
  // reader, no DWG converter.
  AcDbDatabaseConverterManager.instance.unregister(AcDbFileType.DWG)
})

describe('acadrustIsDwg', () => {
  it('tells DWG from DXF by the signature', () => {
    const tag = (text: string) => new TextEncoder().encode(text)
    expect(acadrustIsDwg(tag('AC1032\0\0\0'))).toBe(true)
    expect(acadrustIsDwg(tag('AC1.50\0\0\0'))).toBe(true)
    expect(acadrustIsDwg(tag('  0\nSECTION\n'))).toBe(false)
    expect(acadrustIsDwg(tag('AutoCAD Binary DXF\r\n'))).toBe(false)
    expect(acadrustIsDwg(tag('AC'))).toBe(false)
  })
})

describe('AcDbAcadrustConverter (reading)', () => {
  it('reads a DWG into the same database as the DXF it came from', async () => {
    const source = resolve(FIXTURES, 'sheet_0.dxf')
    const expected = summarize(await open(fileBytes(source), AcDbFileType.DXF))
    const converter = newConverter()
    const db = await open(await dwgFrom(source), AcDbFileType.DWG, converter)
    const actual = summarize(db)
    expect(actual.counts).toEqual(expected.counts)
    expect(actual.layers).toEqual(expected.layers)
    expect(converter.lastReport?.source).toBe('dwg')
    expect(converter.lastReport?.entities).toBeGreaterThan(10000)
  })

  it('keeps the entities of every layout, not only the active one', async () => {
    const source = resolve(FIXTURES, 'find-layouts.dxf')
    const expected = summarize(await open(fileBytes(source), AcDbFileType.DXF))
    // Two paper layouts with four lines each.
    expect(expected.counts['P:Line']).toBe(8)
    const db = await open(
      await dwgFrom(source),
      AcDbFileType.DWG,
      newConverter()
    )
    const actual = summarize(db)
    expect(actual.counts).toEqual(expected.counts)
    expect(actual.layouts).toEqual(expected.layouts)
    expect(actual.texts).toEqual(expected.texts)
  })

  it('keeps Japanese text through a code-page DWG (R2000)', async () => {
    // The sample is Shift_JIS behind an ANSI_1252 header. R2000 DWG stores
    // text in the drawing's code page, so this also checks that the detected
    // code page (not the declared one) is what gets written.
    const db = await open(
      await dwgFrom(resolve(SAMPLES, 'sjis-sample.dxf'), 'AC1015'),
      AcDbFileType.DWG,
      newConverter()
    )
    expect(summarize(db).texts).toEqual(SJIS_SAMPLE_TEXTS)
  })

  it('reports progress in order, from START to END', async () => {
    const source = resolve(FIXTURES, 'sheet_0.dxf')
    const events: Array<[number, string, string]> = []
    const converter = newConverter()
    AcDbDatabaseConverterManager.instance.register(AcDbFileType.DWG, converter)
    const db = new AcDbDatabase()
    acdbHostApplicationServices().workingDatabase = db
    await converter.read(await dwgFrom(source), db, {
      minimumChunkSize: 1000,
      progress: async (percentage, stage, status) => {
        events.push([percentage, stage, status])
      }
    })
    expect(events[0]).toEqual([0, 'START', 'START'])
    expect(events[1]).toEqual([1, 'PARSE', 'START'])
    expect(events[events.length - 1]).toEqual([100, 'END', 'END'])
    // START and PARSE START are announced once, by the converter itself.
    expect(events.filter(([, stage]) => stage === 'START')).toHaveLength(1)
    expect(
      events.filter(
        ([, stage, status]) => stage === 'PARSE' && status === 'START'
      )
    ).toHaveLength(1)
    const percentages = events.map(([percentage]) => percentage)
    expect(percentages).toEqual([...percentages].sort((a, b) => a - b))
    expect(events.some(([, stage]) => stage === 'ENTITY')).toBe(true)
  })

  it('fails with a parse error for a file that only looks like DWG', async () => {
    const bytes = new Uint8Array(4096).fill(7)
    bytes.set(new TextEncoder().encode('AC1032'))
    const converter = newConverter()
    const db = new AcDbDatabase()
    acdbHostApplicationServices().workingDatabase = db
    const failure = await converter
      .read(bytes.buffer as ArrayBuffer, db, {})
      .then(
        () => undefined,
        error => error
      )
    expect(failure).toBeInstanceOf(AcDbOpenDatabaseError)
    expect((failure as AcDbOpenDatabaseError).code).toBe('parse_failed')
  })

  it('reports a missing engine as a worker error', async () => {
    const converter = new AcDbAcadrustConverter({
      wasm: async () => {
        throw new Error('offline')
      }
    })
    const db = new AcDbDatabase()
    acdbHostApplicationServices().workingDatabase = db
    const failure = await converter
      .read(await dwgFrom(resolve(FIXTURES, 'two-lines.dxf')), db, {})
      .then(
        () => undefined,
        error => error
      )
    expect(failure).toBeInstanceOf(AcDbOpenDatabaseError)
    expect((failure as AcDbOpenDatabaseError).code).toBe('worker_error')
    expect((failure as Error).message).toContain('offline')
  })
})

describe('AcDbAcadrustConverter (DXF)', () => {
  const manager = AcDbDatabaseConverterManager.instance
  const builtIn = manager.get(AcDbFileType.DXF)!

  afterEach(() => {
    // These tests register their converter for DXF; put the built-in back.
    manager.register(AcDbFileType.DXF, builtIn)
  })

  it('leaves DXF to the built-in reader by default', async () => {
    const converter = newConverter()
    const db = await open(
      fileBytes(resolve(FIXTURES, 'two-lines.dxf')),
      AcDbFileType.DXF,
      converter
    )
    expect(summarize(db).counts).toEqual({ 'M:Line': 2 })
    // The engine was not involved.
    expect(converter.lastReport).toBeUndefined()
  })

  it('reads DXF through the engine when asked to', async () => {
    const source = resolve(SAMPLES, 'sjis-sample.dxf')
    const converter = newConverter({ dxf: 'engine' })
    const db = await open(fileBytes(source), AcDbFileType.DXF, converter)
    const actual = summarize(db)
    expect(actual.counts).toEqual({ 'M:Line': 1, 'M:Text': 3 })
    expect(actual.texts).toEqual(SJIS_SAMPLE_TEXTS)
    expect(converter.lastReport?.source).toBe('dxf')
    // Shift_JIS behind an ANSI_1252 header, detected from the bytes.
    expect(converter.lastReport?.textEncoding).toBe('Shift_JIS')
  })

  it('falls back to the built-in reader when the engine is unavailable', async () => {
    const converter = new AcDbAcadrustConverter({
      dxf: 'engine',
      wasm: async () => {
        throw new Error('offline')
      }
    })
    const db = await open(
      fileBytes(resolve(FIXTURES, 'two-lines.dxf')),
      AcDbFileType.DXF,
      converter
    )
    expect(summarize(db).counts).toEqual({ 'M:Line': 2 })
  })

  it('registers for DXF only in engine mode', () => {
    const plain = registerAcadrustConverter('worker.js', { wasm: wasmModule })
    expect(manager.get(AcDbFileType.DWG)).toBe(plain)
    expect(manager.get(AcDbFileType.DXF)).toBe(builtIn)
    const engine = registerAcadrustConverter('worker.js', {
      wasm: wasmModule,
      dxf: 'engine'
    })
    expect(manager.get(AcDbFileType.DXF)).toBe(engine)
    plain.dispose()
    engine.dispose()
  })
})

describe('AcDbAcadrustConverter (writing)', () => {
  it.each([
    'AC1015',
    'AC1018',
    'AC1021',
    'AC1024',
    'AC1027',
    'AC1032'
  ] as const)('writes %s DWG that reads back the same', async version => {
    const source = resolve(FIXTURES, 'find-blocks.dxf')
    const original = await open(fileBytes(source), AcDbFileType.DXF)
    const expected = summarize(original)
    const converter = newConverter()
    const result = await converter.exportDatabase(original, {
      format: 'dwg',
      version
    })
    expect(new TextDecoder().decode(result.bytes.subarray(0, 6))).toBe(version)
    expect(result.report.outputVersion).toBe(version)
    const back = await open(
      result.bytes.buffer as ArrayBuffer,
      AcDbFileType.DWG,
      converter
    )
    const actual = summarize(back)
    expect(actual.counts).toEqual(expected.counts)
    expect(actual.texts).toEqual(expected.texts)
    expect(actual.layers).toEqual(expected.layers)
    expect(actual.layouts).toEqual(expected.layouts)
  })

  it('stores the drawing limits (the sheet) in the DWG', async () => {
    const original = await open(
      fileBytes(resolve(FIXTURES, 'two-lines.dxf')),
      AcDbFileType.DXF
    )
    const converter = newConverter()
    const result = await converter.exportDatabase(original, {
      format: 'dwg',
      limits: { min: { x: -100, y: -50 }, max: { x: 41900, y: 29650 } }
    })
    // The option does not change the database it was exported from.
    expect((original as unknown as { limmin?: unknown }).limmin).toBeUndefined()
    const back = (await open(
      result.bytes.buffer as ArrayBuffer,
      AcDbFileType.DWG,
      converter
    )) as unknown as {
      limmin?: { x: number; y: number }
      limmax?: { x: number; y: number }
    }
    expect(back.limmin).toEqual({ x: -100, y: -50 })
    expect(back.limmax).toEqual({ x: 41900, y: 29650 })
  })

  it('writes ASCII DXF of an older version, and genuine R12', async () => {
    const original = await open(
      fileBytes(resolve(FIXTURES, 'two-lines.dxf')),
      AcDbFileType.DXF
    )
    const converter = newConverter()
    const r2000 = await converter.exportDatabase(original, {
      format: 'dxf',
      version: 'AC1015'
    })
    const text = new TextDecoder().decode(r2000.bytes)
    expect(text).toContain('AC1015')
    expect(text).toContain('LINE')

    const r12 = await converter.exportDatabase(original, {
      format: 'dxf',
      version: 'AC1009'
    })
    const r12Text = new TextDecoder().decode(r12.bytes)
    expect(r12Text).toContain('AC1009')
    // R12 has no OBJECTS section and no subclass markers.
    expect(r12Text).not.toContain('AcDbEntity')
    const back = await open(r12.bytes.buffer as ArrayBuffer, AcDbFileType.DXF)
    expect(summarize(back).counts).toEqual({ 'M:Line': 2 })
  })

  it('writes binary DXF', async () => {
    const original = await open(
      fileBytes(resolve(FIXTURES, 'two-lines.dxf')),
      AcDbFileType.DXF
    )
    const result = await newConverter().exportDatabase(original, {
      format: 'dxf-binary'
    })
    expect(new TextDecoder().decode(result.bytes.subarray(0, 18))).toBe(
      'AutoCAD Binary DXF'
    )
  })
})
