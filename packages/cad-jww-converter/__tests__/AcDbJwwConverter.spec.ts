import {
  AcDbDatabase,
  AcDbDatabaseConverterManager,
  AcDbEntity,
  acdbHostApplicationServices,
  AcDbLine,
  AcDbText
} from '@mlightcad/data-model'
import * as ezjww from 'ezjww'
import { readFileSync } from 'fs'
import { resolve } from 'path'

import { AcDbJwwConverter } from '../src/AcDbJwwConverter'
import {
  convertJwwToDxf,
  ezjwwLayerNames,
  jwwTextFontMetrics
} from '../src/jwwToDxf'

const SAMPLE = resolve(
  __dirname,
  '../../../resources/cad-data/samples/jww-sample.jww'
)

function sampleBytes() {
  const buffer = readFileSync(SAMPLE)
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer
}

function entitiesOf(db: AcDbDatabase) {
  return [...db.tables.blockTable.modelSpace.newIterator()] as AcDbEntity[]
}

async function openSample(
  converter = new AcDbJwwConverter({ useWorker: false })
) {
  AcDbDatabaseConverterManager.instance.register('jww', converter)
  const db = new AcDbDatabase()
  acdbHostApplicationServices().workingDatabase = db
  await db.read(sampleBytes(), { fileName: 'jww-sample.jww' }, 'jww')
  return db
}

beforeAll(() => {
  const wasm = require.resolve('ezjww/wasm/ezjww_wasm_bg.wasm')
  ezjww.initSync(readFileSync(wasm))
})

afterAll(() => {
  AcDbDatabaseConverterManager.instance.unregister('jww')
})

describe('convertJwwToDxf', () => {
  it('rejects files that are not JWW', () => {
    const notJww = new TextEncoder().encode(
      '0\nSECTION\n2\nHEADER\n0\nENDSEC\n'
    )
    expect(() => convertJwwToDxf(ezjww, notJww)).toThrow(/Not a JWW/)
  })

  it('reproduces ezjww layer names for duplicate and empty names', () => {
    const header = ezjww.readHeader(new Uint8Array(sampleBytes()))
    header.layer_groups[2].layers[0].name = '壁'
    header.layer_groups[2].layers[1].name = '0'
    const names = ezjwwLayerNames(header)
    expect(names.get('壁')).toEqual([0, 1])
    expect(names.get('壁_2-0')).toEqual([2, 0])
    expect(names.get('0_2-1')).toEqual([2, 1])
    expect(names.get('F-F')).toEqual([15, 15])
  })

  it('writes the paper as drawing limits in real millimetres', () => {
    const { dxf } = convertJwwToDxf(ezjww, new Uint8Array(sampleBytes()))
    // A3 (420 x 297) at the 1/100 of the main layer group.
    expect(dxf).toContain('9\n$LIMMIN\n10\n-21000\n20\n-14850\n')
    expect(dxf).toContain('9\n$LIMMAX\n10\n21000\n20\n14850\n')
    expect(dxf).toContain('9\n$INSUNITS\n70\n4\n')
  })
})

describe('AcDbJwwConverter', () => {
  it('opens a JWW file through the DXF converter', async () => {
    const db = await openSample()
    const entities = entitiesOf(db)
    expect(entities.length).toBeGreaterThan(20)

    // Layers are named "<group>-<layer> <group name> - <layer name>".
    const layerNames = [...db.tables.layerTable.newIterator()].map(l => l.name)
    expect(layerNames).toEqual(
      expect.arrayContaining([
        '0',
        '0-0 平面図 - 通り芯',
        '0-1 平面図 - 壁',
        '1-0 図枠 - 枠'
      ])
    )
    // Unused layers are not created.
    expect(layerNames).not.toContain('0-F 平面図')

    // Paper millimetres x 100: the 100 mm wall on paper is 10 m long.
    const walls = entities.filter(
      (e): e is AcDbLine =>
        e instanceof AcDbLine && e.layer === '0-1 平面図 - 壁'
    )
    const lengths = walls.map(w => w.startPoint.distanceTo(w.endPoint))
    expect(Math.max(...lengths)).toBeCloseTo(10000, 6)
    // Line type records are in drawing units (like the standard line types
    // added to new lines), so entities need no line type scale.
    expect(walls[0].linetypeScale).toBeCloseTo(1, 6)
    const chain = entities.find(e => e.lineType === 'JWW_DASHDOT1')
    expect(chain?.linetypeScale).toBeCloseTo(1, 6)
    const pattern = db.tables.linetypeTable
      .getAt('JWW_DASHDOT1')
      ?.linetype?.pattern?.map(e => e.elementLength)
    // Jw_cad chain line 1 (3.125 mm dash on paper) at 1/100.
    expect(pattern?.[0]).toBeCloseTo(312.5, 6)
    expect(pattern?.[1]).toBeCloseTo(-62.5, 6)
    // $LIMMIN / $LIMMAX are checked on the DXF text above: Jest loads the CJS
    // build of data-model, which the header-reader patch does not cover.
  })

  it('keeps Japanese text and its font', async () => {
    const db = await openSample()
    const texts = entitiesOf(db).filter(
      (e): e is AcDbText => e instanceof AcDbText
    )
    const room = texts.find(t => t.textString === '居間・食堂')
    expect(room).toBeDefined()
    // 4 mm on paper at 1/100 is a 400 mm character cell. The renderer draws
    // the em at height x em / capHeight("A"), so the DXF height is the cap
    // height of BIZ UD Gothic and full-width characters come out 400 mm.
    const gothic = jwwTextFontMetrics('ＭＳ ゴシック')
    expect(room!.height).toBeCloseTo(400 * gothic.capHeight, 6)
    expect(room!.height / gothic.capHeight).toBeCloseTo(400, 6)
    // The JWW point (y = 30 mm on paper) is the bottom of the cell; the
    // baseline sits one descender above it.
    expect(room!.position.y).toBeCloseTo(3000 + 400 * gothic.descender, 6)
    expect(room!.position.x).toBeCloseTo(-6500, 6)
    expect(room!.styleName).toBe('STANDARD')

    const title = texts.find(t => t.textString === 'サンプル平面図')
    expect(title!.styleName).toBe('ＭＳ 明朝')
    // Mincho has a lower capital "A" than Gothic (1587 vs 1617 / 2048).
    expect(title!.height).toBeCloseTo(
      500 * jwwTextFontMetrics('ＭＳ 明朝').capHeight,
      6
    )
    const style = db.tables.textStyleTable.getAt('ＭＳ 明朝')
    expect(style?.textStyle.font).toBe('ＭＳ 明朝')
  })

  it('turns Jw_cad 縦字 into vertical text along the string', async () => {
    const db = await openSample()
    const text = entitiesOf(db).find(
      (e): e is AcDbText =>
        e instanceof AcDbText && e.textString === '収納（押入れ）'
    )
    expect(text).toBeDefined()
    // The string runs downwards, so the @ font is rotated by 270°.
    expect(text!.rotation).toBeCloseTo((3 * Math.PI) / 2, 6)
    // The baseline is one descender to the right of the JWW point.
    const gothic = jwwTextFontMetrics('@ＭＳ ゴシック')
    expect(text!.position.x).toBeCloseTo(1000 + 400 * gothic.descender, 6)
    const style = db.tables.textStyleTable.getAt(text!.styleName)
    expect(style?.textStyle.font).toBe('@ＭＳ ゴシック')
  })

  it('can keep paper millimetres or use each layer group scale', async () => {
    const paperDb = await openSample(
      new AcDbJwwConverter({ useWorker: false, scaleMode: 'paper' })
    )
    const border = (db: AcDbDatabase) =>
      entitiesOf(db).filter(
        (e): e is AcDbLine =>
          e instanceof AcDbLine && e.layer === '1-0 図枠 - 枠'
      )[0]
    expect(
      border(paperDb).startPoint.distanceTo(border(paperDb).endPoint)
    ).toBeCloseTo(400, 6)

    const groupDb = await openSample(
      new AcDbJwwConverter({ useWorker: false, scaleMode: 'layer-group' })
    )
    // The border is in the 1/1 group, so it stays 400 mm long.
    expect(
      border(groupDb).startPoint.distanceTo(border(groupDb).endPoint)
    ).toBeCloseTo(400, 6)
    // Line type records are at the main scale (1/100), so the 1/1 group
    // scales its patterns back down to paper size.
    expect(border(groupDb).linetypeScale).toBeCloseTo(0.01, 6)
    expect(border(paperDb).linetypeScale).toBeCloseTo(1, 6)

    const drawingDb = await openSample()
    expect(
      border(drawingDb).startPoint.distanceTo(border(drawingDb).endPoint)
    ).toBeCloseTo(40000, 6)
  })
})
