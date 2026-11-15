/**
 * What real drawings lost on the way out, before the fixes these tests pin
 * down. Each case is a property AutoCAD drawings commonly have, written here
 * as the few DXF records that carry it.
 */
import {
  AcDbBlockReference,
  AcDbDatabase,
  AcDbDatabaseConverterManager,
  AcDbFileType,
  acdbHostApplicationServices
} from '@mlightcad/data-model'
import { readFileSync } from 'fs'
import { resolve } from 'path'

import { AcDbAcadrustConverter } from '../src/AcDbAcadrustConverter'

const WASM = resolve(__dirname, '../wasm/acadrust-engine.wasm')

let converter: AcDbAcadrustConverter

beforeAll(async () => {
  converter = new AcDbAcadrustConverter({
    wasm: await WebAssembly.compile(readFileSync(WASM))
  })
})

afterAll(() => converter.dispose())

/** DXF text from `[group code, value]` pairs. */
function dxf(pairs: Array<[number, string | number]>): ArrayBuffer {
  const text = pairs.map(([code, value]) => `${code}\n${value}\n`).join('')
  return new TextEncoder().encode(text).buffer as ArrayBuffer
}

const section = (
  name: string,
  body: Array<[number, string | number]>
): Array<[number, string | number]> => [
  [0, 'SECTION'],
  [2, name],
  ...body,
  [0, 'ENDSEC']
]

const line = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  layer = '0'
): Array<[number, string | number]> => [
  [0, 'LINE'],
  [8, layer],
  [10, x1],
  [20, y1],
  [11, x2],
  [21, y2]
]

async function open(data: ArrayBuffer, type: AcDbFileType = AcDbFileType.DXF) {
  if (type === AcDbFileType.DWG) {
    AcDbDatabaseConverterManager.instance.register(type, converter)
  }
  const db = new AcDbDatabase()
  acdbHostApplicationServices().workingDatabase = db
  await db.read(data, { minimumChunkSize: 1000 }, type)
  return db
}

/** Writes `db` as DWG and reads that file back. */
async function throughDwg(db: AcDbDatabase) {
  const written = await converter.exportDatabase(db, { format: 'dwg' })
  expect(written.warnings).toEqual([])
  return open(written.bytes.buffer as ArrayBuffer, AcDbFileType.DWG)
}

function entitiesOf(db: AcDbDatabase, blockName: string) {
  const block = db.tables.blockTable.getAt(blockName)
  return block ? [...block.newIterator()] : undefined
}

/** The drawing as ASCII DXF, written by the built-in writer. */
function asDxfText(db: AcDbDatabase): string {
  return db.dxfOut(undefined, 16, 'AC1032') as string
}

/** Values of group `code` in the first record of type `kind` of a DXF text. */
function groupsOf(text: string, kind: string, code: number): string[] {
  const lines = text.split(/\r?\n/).map(value => value.trim())
  const values: string[] = []
  let inside = false
  for (let at = 0; at + 1 < lines.length; at += 2) {
    if (lines[at] === '0') {
      if (inside) break
      inside = lines[at + 1] === kind
    } else if (inside && lines[at] === String(code)) {
      values.push(lines[at + 1])
    }
  }
  return values
}

describe('a block that remembers the file it was inserted from', () => {
  // INSERT of a drawing file leaves that file's path on the block (group 1).
  // The block's flags (group 70) say whether it is an xref; here it is not.
  const drawing = () =>
    dxf([
      ...section('BLOCKS', [
        [0, 'BLOCK'],
        [8, '0'],
        [2, 'Main_Pump'],
        [70, 0],
        [10, 0],
        [20, 0],
        [30, 0],
        [3, 'Main_Pump'],
        [1, 'D:\\DXF\\Sample\\Main_Pump.dwg'],
        ...line(0, 0, 10, 0),
        ...line(10, 0, 10, 5),
        [0, 'ENDBLK'],
        [8, '0']
      ]),
      ...section('ENTITIES', [
        [0, 'INSERT'],
        [8, '0'],
        [2, 'Main_Pump'],
        [10, 100],
        [20, 100]
      ]),
      [0, 'EOF']
    ])

  it('is not taken for an external reference', async () => {
    const db = await open(drawing())
    const block = db.tables.blockTable.getAt('Main_Pump')!
    expect(block.isXref).toBe(false)
    expect(block.pathName).toBe('D:\\DXF\\Sample\\Main_Pump.dwg')
    expect(entitiesOf(db, 'Main_Pump')).toHaveLength(2)
  })

  it('keeps its contents when the drawing is written as DWG', async () => {
    const back = await throughDwg(await open(drawing()))
    expect(back.tables.blockTable.getAt('Main_Pump')!.isXref).toBe(false)
    expect(entitiesOf(back, 'Main_Pump')?.map(entity => entity.type)).toEqual([
      'Line',
      'Line'
    ])
  })
})

describe('a layer that is turned off', () => {
  // "Off" is the sign of the layer's colour number and nothing else.
  const drawing = () =>
    dxf([
      ...section('TABLES', [
        [0, 'TABLE'],
        [2, 'LAYER'],
        [70, 2],
        [0, 'LAYER'],
        [2, 'VISIBLE'],
        [70, 0],
        [62, 1],
        [6, 'CONTINUOUS'],
        [0, 'LAYER'],
        [2, 'FRAME'],
        [70, 0],
        [62, -3],
        [6, 'CONTINUOUS'],
        [0, 'ENDTAB']
      ]),
      ...section('ENTITIES', [
        ...line(0, 0, 10, 0, 'VISIBLE'),
        ...line(0, 0, 0, 10, 'FRAME')
      ]),
      [0, 'EOF']
    ])

  const state = (db: AcDbDatabase, name: string) => {
    const layer = db.tables.layerTable.getAt(name)!
    return { off: layer.isOff, color: layer.color.colorIndex }
  }

  it('is read as off, with its colour', async () => {
    const db = await open(drawing())
    expect(state(db, 'FRAME')).toEqual({ off: true, color: 3 })
    expect(state(db, 'VISIBLE')).toEqual({ off: false, color: 1 })
  })

  it('is written as off in DXF', async () => {
    const db = await open(drawing())
    const again = await open(
      new TextEncoder().encode(asDxfText(db)).buffer as ArrayBuffer
    )
    expect(state(again, 'FRAME')).toEqual({ off: true, color: 3 })
    expect(state(again, 'VISIBLE')).toEqual({ off: false, color: 1 })
  })

  it('is still off after the drawing was written as DWG', async () => {
    const back = await throughDwg(await open(drawing()))
    expect(state(back, 'FRAME')).toEqual({ off: true, color: 3 })
    expect(state(back, 'VISIBLE')).toEqual({ off: false, color: 1 })
  })
})

describe('a polyline with one width for all of it', () => {
  // Two half circles of width 25: the usual way to draw a filled ring.
  const ring = (vertexWidths: Array<[number, number]>) =>
    dxf([
      ...section('ENTITIES', [
        [0, 'LWPOLYLINE'],
        [8, '0'],
        [90, 2],
        [70, 1],
        [43, 25],
        [10, 0],
        [20, 0],
        ...vertexWidths,
        [42, 1],
        [10, 50],
        [20, 0],
        ...vertexWidths,
        [42, 1]
      ]),
      [0, 'EOF']
    ])

  const widthOf = (db: AcDbDatabase) =>
    groupsOf(asDxfText(db), 'LWPOLYLINE', 43).map(Number)

  it('keeps the width when each vertex also lists widths of 0', async () => {
    // Written that way by acadrust, and so by every DWG that is opened here.
    const db = await open(
      ring([
        [40, 0],
        [41, 0]
      ])
    )
    expect(widthOf(db)).toEqual([25])
  })

  it('keeps the width through DWG', async () => {
    const back = await throughDwg(await open(ring([])))
    expect(widthOf(back)).toEqual([25])
  })
})

describe('a block reference with attribute values', () => {
  // A grid bubble: the circle is in the block, the letter is on the INSERT.
  const drawing = () =>
    dxf([
      ...section('BLOCKS', [
        [0, 'BLOCK'],
        [8, '0'],
        [2, 'BUBBLE'],
        [70, 2],
        [10, 0],
        [20, 0],
        [30, 0],
        [0, 'CIRCLE'],
        [8, '0'],
        [10, 0],
        [20, 0],
        [40, 5],
        [0, 'ATTDEF'],
        [100, 'AcDbEntity'],
        [8, '0'],
        [100, 'AcDbText'],
        [10, -2],
        [20, -2],
        [40, 4],
        [1, 'A'],
        [100, 'AcDbAttributeDefinition'],
        [3, 'Grid label'],
        [2, 'LABEL'],
        [70, 0],
        [0, 'ENDBLK'],
        [8, '0']
      ]),
      ...section('ENTITIES', [
        [0, 'INSERT'],
        [8, '0'],
        [66, 1],
        [2, 'BUBBLE'],
        [10, 100],
        [20, 100],
        // No handles, as in a file of DXF R12: the ATTRIB belongs to the
        // INSERT it follows.
        [0, 'ATTRIB'],
        [100, 'AcDbEntity'],
        [8, '0'],
        [100, 'AcDbText'],
        [10, 98],
        [20, 98],
        [40, 4],
        [1, '通り芯 G'],
        [100, 'AcDbAttribute'],
        [2, 'LABEL'],
        [70, 0],
        [0, 'SEQEND'],
        [8, '0']
      ]),
      [0, 'EOF']
    ])

  const attributes = (db: AcDbDatabase) => {
    const found: Array<[string, string]> = []
    for (const entity of db.tables.blockTable.modelSpace.newIterator()) {
      if (!(entity instanceof AcDbBlockReference)) continue
      for (const attribute of entity.attributeIterator()) {
        found.push([attribute.tag, attribute.textString])
      }
    }
    return found
  }

  it('says in DXF that attributes follow the INSERT', async () => {
    const db = await open(drawing())
    expect(attributes(db)).toEqual([['LABEL', '通り芯 G']])
    expect(groupsOf(asDxfText(db), 'INSERT', 66)).toEqual(['1'])
  })

  it('keeps the values through DWG', async () => {
    const back = await throughDwg(await open(drawing()))
    expect(attributes(back)).toEqual([['LABEL', '通り芯 G']])
  })
})

describe('DXF R12 and names outside ASCII', () => {
  it('writes a block whose name has a character across its 12th byte', async () => {
    // "FL" + three-byte characters: byte 12 falls inside the fourth of them,
    // where acadrust's R12 writer cuts the name to test for "*Paper_Space".
    const name = 'FL記号（階高）'
    const db = await open(
      dxf([
        ...section('BLOCKS', [
          [0, 'BLOCK'],
          [8, '0'],
          [2, name],
          [70, 0],
          [10, 0],
          [20, 0],
          [30, 0],
          ...line(0, 0, 10, 5),
          [0, 'ENDBLK'],
          [8, '0']
        ]),
        ...section('ENTITIES', [
          [0, 'INSERT'],
          [8, '0'],
          [2, name],
          [10, 50],
          [20, 50]
        ]),
        [0, 'EOF']
      ])
    )
    expect(entitiesOf(db, name)).toHaveLength(1)

    const written = await converter.exportDatabase(db, {
      format: 'dxf',
      version: 'AC1009'
    })
    const text = new TextDecoder().decode(written.bytes)
    expect(text).toContain('AC1009')
    // R12 symbol names are ASCII; the INSERT follows the block's new name.
    const inserted = groupsOf(text, 'INSERT', 2)
    expect(inserted).toEqual(['FL______'])
    const back = await open(written.bytes.buffer as ArrayBuffer)
    expect(entitiesOf(back, 'FL______')).toHaveLength(1)
  })
})
