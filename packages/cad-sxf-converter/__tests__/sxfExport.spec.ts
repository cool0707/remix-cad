import {
  collectExportDrawing,
  type ExportDrawing
} from '@mlightcad/cad-export-model'
import {
  AcDbArc,
  AcDbCircle,
  AcDbDatabase,
  AcDbDatabaseConverterManager,
  AcDbEllipse,
  AcDbEntity,
  AcDbHatch,
  acdbHostApplicationServices,
  AcDbLine,
  AcDbPolyline,
  AcDbText
} from '@mlightcad/data-model'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

import { AcDbSxfConverter } from '../src/AcDbSxfConverter'
import { encodeShiftJis } from '../src/shiftJis'
import { sxfToSfcText, writeP21, writeSfc, zipSxf } from '../src/sxfExport'

const SAMPLES = resolve(__dirname, '../../../resources/cad-data/samples')

async function open(bytes: Uint8Array, type: string) {
  AcDbDatabaseConverterManager.instance.register(type, new AcDbSxfConverter())
  const db = new AcDbDatabase()
  acdbHostApplicationServices().workingDatabase = db
  await db.read(bytes.slice().buffer, { fileName: `drawing.${type}` }, type)
  return db
}

function entitiesOf(db: AcDbDatabase) {
  return [...db.tables.blockTable.modelSpace.newIterator()] as AcDbEntity[]
}

/** Jest reads the CJS data-model without the $LIMMIN patch: set the sheet the reader writes. */
function withSampleLimits(db: AcDbDatabase) {
  Object.assign(db, { limmin: { x: 0, y: 0 }, limmax: { x: 42000, y: 29700 } })
  return db
}

const TIMESTAMP = '2026-10-24T00:00:00'

afterAll(() => {
  for (const type of ['sfc', 'p21', 'sfz', 'p2z']) {
    AcDbDatabaseConverterManager.instance.unregister(type)
  }
})

describe('SXF export', () => {
  let original: AcDbDatabase
  let drawing: ExportDrawing

  beforeAll(async () => {
    original = withSampleLimits(
      await open(
        new Uint8Array(readFileSync(resolve(SAMPLES, 'sxf-sample.sfc'))),
        'sfc'
      )
    )
    drawing = collectExportDrawing(original, { title: 'サンプル平面図' })
    if (process.env.SXF_EXPORT_DIR) {
      mkdirSync(process.env.SXF_EXPORT_DIR, { recursive: true })
      writeFileSync(
        resolve(process.env.SXF_EXPORT_DIR, 'out.sfc'),
        writeSfc(drawing, { timestamp: TIMESTAMP }).bytes
      )
      writeFileSync(
        resolve(process.env.SXF_EXPORT_DIR, 'out.p21'),
        writeP21(drawing, { timestamp: TIMESTAMP }).bytes
      )
    }
  })

  it('places the drawing on the sheet of the original', () => {
    expect(drawing.sheet).toMatchObject({
      paper: 'A3',
      portrait: false,
      scale: 100,
      origin: [0, 0]
    })
  })

  for (const [type, write] of [
    ['sfc', writeSfc],
    ['p21', writeP21]
  ] as const) {
    it(`reads back the same drawing from ${type.toUpperCase()}`, async () => {
      const { bytes } = write(drawing, { timestamp: TIMESTAMP })
      const reopened = await open(bytes, type)
      const before = entitiesOf(original)
      const after = entitiesOf(reopened)
      const count = (
        list: AcDbEntity[],
        kind: new (...args: never[]) => AcDbEntity
      ) => list.filter(e => e instanceof kind).length
      for (const kind of [AcDbArc, AcDbCircle, AcDbEllipse, AcDbText]) {
        expect(count(after, kind)).toBe(count(before, kind))
      }
      expect(count(after, AcDbLine) + count(after, AcDbPolyline)).toBe(
        count(before, AcDbLine) + count(before, AcDbPolyline)
      )
      expect(count(after, AcDbHatch)).toBeGreaterThanOrEqual(1)
      const texts = (list: AcDbEntity[]) =>
        list
          .filter((e): e is AcDbText => e instanceof AcDbText)
          .map(t => ({
            text: t.textString,
            x: t.position.x,
            y: t.position.y,
            h: t.height,
            w: t.widthFactor
          }))
          .sort((a, b) => a.text.localeCompare(b.text))
      const a = texts(before)
      const b = texts(after)
      expect(b.map(t => t.text)).toEqual(a.map(t => t.text))
      b.forEach((t, i) => {
        expect(t.x).toBeCloseTo(a[i].x, 2)
        expect(t.y).toBeCloseTo(a[i].y, 2)
        expect(t.h).toBeCloseTo(a[i].h, 4)
        expect(t.w).toBeCloseTo(a[i].w, 4)
      })
      const layers = [...reopened.tables.layerTable.newIterator()].map(
        l => l.name
      )
      expect(layers).toEqual(
        expect.arrayContaining(['通り芯', '壁', '建具', '文字', '寸法'])
      )
      const ellipse = after.find(
        (e): e is AcDbEllipse => e instanceof AcDbEllipse
      )!
      const ellipse0 = before.find(
        (e): e is AcDbEllipse => e instanceof AcDbEllipse
      )!
      expect(ellipse.center.x).toBeCloseTo(ellipse0.center.x, 4)
      expect(ellipse.majorAxisRadius).toBeCloseTo(ellipse0.majorAxisRadius, 4)
    })
  }

  it('writes the ZIP forms', async () => {
    const sfc = writeSfc(drawing, { timestamp: TIMESTAMP }).bytes
    const reopened = await open(zipSxf(sfc, 'drawing.sfc'), 'sfz')
    expect(entitiesOf(reopened).length).toBeGreaterThan(20)
  })

  it('writes Shift_JIS with the SFC feature layout', () => {
    const { text } = sxfToSfcText(drawing, {
      timestamp: TIMESTAMP,
      fileName: 'plan.sfc'
    })
    expect(text).toContain("FILE_NAME('plan.sfc','2026-10-24T00:00:00'")
    expect(text).toMatch(/#\d+ = layer_feature\(\\'通り芯\\','1'\)/)
    expect(text).toMatch(/#\d+ = sfig_org_feature\(\\'サンプル平面図\\','1'\)/)
    expect(text).toMatch(
      /#\d+ = sfig_locate_feature\('1',\\'サンプル平面図\\','0','0','0','0\.01','0\.01'\)/
    )
    expect(text).toMatch(
      /#\d+ = drawing_sheet_feature\(\\'サンプル平面図\\','3','1','420','297'\)\r\nSXF\*\/\r\nENDSEC;/
    )
    expect(
      new TextDecoder('shift_jis').decode(writeSfc(drawing).bytes)
    ).toContain('居間・食堂')
  })
})

it('keeps fill boundaries apart from the elements written before them', async () => {
  const style = {
    layer: 'A',
    color: [255, 0, 0] as [number, number, number],
    foreground: false,
    lineType: 'CONTINUOUS',
    lineTypePattern: [],
    lineWeight: 0
  }
  const drawing: ExportDrawing = {
    title: 'fill',
    layers: [
      {
        name: 'A',
        color: [0, 0, 0],
        foreground: true,
        hidden: false,
        locked: false
      }
    ],
    entities: [
      {
        kind: 'polyline',
        style,
        points: [
          [0, 0],
          [1000, 0]
        ],
        closed: false
      },
      {
        kind: 'fill',
        style,
        loops: [
          [
            [0, 0],
            [100, 0],
            [100, 100],
            [0, 100]
          ]
        ]
      }
    ],
    sheet: {
      paper: 'A4',
      portrait: false,
      width: 297,
      height: 210,
      scale: 10,
      origin: [0, 0]
    },
    warnings: []
  }
  const text = sxfToSfcText(drawing).text
  expect(text.indexOf('composite_curve_feature')).toBeLessThan(
    text.indexOf('= line_feature')
  )
  const db = await open(writeSfc(drawing).bytes, 'sfc')
  const entities = entitiesOf(db)
  expect(entities.filter(e => e instanceof AcDbLine)).toHaveLength(1)
  expect(entities.filter(e => e instanceof AcDbHatch)).toHaveLength(1)
})

describe('encodeShiftJis', () => {
  it('round-trips JIS X 0208 text and reports other characters', () => {
    const text = 'ABC ｱｲｳ 日本語・寸法 ①Ⅱ㎡ ¥'
    const { bytes, unmapped } = encodeShiftJis(text)
    expect(unmapped).toEqual([])
    expect(new TextDecoder('shift_jis').decode(bytes)).toBe(
      text.replace('¥', '\\')
    )
    expect(encodeShiftJis('😀').unmapped).toEqual(['😀'])
  })
})
