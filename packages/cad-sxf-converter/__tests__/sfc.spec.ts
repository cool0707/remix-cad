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
import { readFileSync } from 'fs'
import { resolve } from 'path'

import { AcDbSxfConverter } from '../src/AcDbSxfConverter'
import { convertSxfToDxf, detectSxfFormat } from '../src/convertSxf'
import { buildSfcModel, readSfcDrawing, readSfcFeatures } from '../src/sfc'
import { decodeSxfBytes } from '../src/step'
import { SXF_LINE_TYPE_PATTERNS } from '../src/style'
import { sxfTextFontMetrics } from '../src/sxfToDxf'

const SAMPLES = resolve(__dirname, '../../../resources/cad-data/samples')
const sampleBytes = (name: string) =>
  new Uint8Array(readFileSync(resolve(SAMPLES, name)))
const sampleText = (name: string) => decodeSxfBytes(sampleBytes(name))

async function open(name: string, converter = new AcDbSxfConverter()) {
  AcDbDatabaseConverterManager.instance.register('sfc', converter)
  const db = new AcDbDatabase()
  acdbHostApplicationServices().workingDatabase = db
  await db.read(sampleBytes(name).slice().buffer, { fileName: name }, 'sfc')
  return {
    db,
    entities: [...db.tables.blockTable.modelSpace.newIterator()] as AcDbEntity[]
  }
}

afterAll(() => {
  AcDbDatabaseConverterManager.instance.unregister('sfc')
})

describe('SFC parsing', () => {
  it('reads feature comments, including \\\'…\\\' strings with quotes', () => {
    const features = readSfcFeatures(
      [
        'ISO-10303-21;',
        'DATA;',
        '/*SXF',
        '#10 = text_font_feature(\\\'ＭＳ ゴシック\\\')',
        'SXF*/',
        '/*SXF3',
        '#20 = text_string_feature(\'1\',\'1\',\'1\',\\\'it\'s (a), b\\\\c\\\',\'0\',\'0\',\'5\',\'10\',\'0\',\'0\',\'0\',\'1\',\'1\')',
        'SXF3*/',
        'ENDSEC;'
      ].join('\n')
    )
    expect(features.map(f => f.kind)).toEqual(['text_font', 'text_string'])
    expect(features[1].params[3]).toEqual({
      kind: 'string',
      value: 'it\'s (a), b\\c'
    })
  })

  it('decodes Shift_JIS and detects the SFC format', () => {
    const text = sampleText('sxf-sample.sfc')
    expect(text).toContain('居間・食堂')
    expect(detectSxfFormat(text)).toBe('sfc')
  })

  it('resolves code tables and the partial drawing hierarchy', () => {
    const model = buildSfcModel(readSfcFeatures(sampleText('sxf-sample.sfc')))
    expect([...model.layers.values()].map(f => f.params[0])).toContainEqual({
      kind: 'string',
      value: '通り芯'
    })
    // The plan and the image attribute (a kind-3 group around a rectangle).
    expect(model.definitions.size).toBe(2)
    const [image, plan] = model.definitions.values()
    expect(plan).toEqual(expect.objectContaining({ name: '平面図', kind: 1 }))
    expect(image).toEqual(expect.objectContaining({ kind: 3 }))
    expect(image.name).toMatch(/^\$\$ATRU\$\$.*\$\$画像\$\$SXF-MAP\.TIF/)
    expect(model.hatches.size).toBe(2)
    // 2 placements + border, title block, 3 texts
    expect(model.sheetComponents.length).toBe(7)
  })

  it('flattens the drawing with placement scales', () => {
    const drawing = readSfcDrawing(sampleText('sxf-sample.sfc'))
    expect(drawing.sheet).toEqual({
      name: 'サンプル平面図',
      width: 420,
      height: 297
    })
    // Paths inside the 1/100 partial drawing carry scale 0.01.
    expect(drawing.paths.some(p => Math.abs(p.scale - 0.01) < 1e-12)).toBe(true)
    expect(drawing.fills).toHaveLength(1)
    expect(drawing.texts.map(t => t.text)).toEqual(
      expect.arrayContaining(['居間・食堂', '寝室', '10,000', 'サンプル平面図'])
    )
  })
})

describe('AcDbSxfConverter (SFC)', () => {
  it('opens the sample in real millimetres of the main partial drawing', async () => {
    const { db, entities } = await open('sxf-sample.sfc')
    // Walls: the 10 m × 7 m outline is an LWPOLYLINE on layer 壁.
    const walls = entities.filter(
      (e): e is AcDbPolyline => e instanceof AcDbPolyline && e.layer === '壁'
    )
    expect(walls.length).toBeGreaterThan(0)
    const outline = walls[0]
    const xs = Array.from(
      { length: outline.numberOfVertices },
      (_, i) => outline.getPoint2dAt(i).x
    )
    expect(Math.max(...xs) - Math.min(...xs)).toBeCloseTo(10000, 3)

    // The sheet border (1/1 on paper) is scaled by the same 100.
    const border = entities.filter(
      (e): e is AcDbPolyline => e instanceof AcDbPolyline && e.layer !== '壁'
    )
    const borderXs = border.flatMap(p =>
      Array.from({ length: p.numberOfVertices }, (_, i) => p.getPoint2dAt(i).x)
    )
    expect(Math.max(...borderXs)).toBeCloseTo(41000, 3)

    // Grid lines keep the chain line type and their layer.
    const grid = entities.filter(
      (e): e is AcDbLine => e instanceof AcDbLine && e.layer === '通り芯'
    )
    expect(grid).toHaveLength(5)
    expect(grid[0].lineType).toBe('SXF_CHAIN')
    // The pattern is in drawing units (like the standard line types added to
    // new lines), so the entity needs no line type scale.
    expect(grid[0].linetypeScale).toBeCloseTo(1, 6)
    const paper = SXF_LINE_TYPE_PATTERNS.chain
    const pattern = db.tables.linetypeTable
      .getAt('SXF_CHAIN')
      ?.linetype?.pattern?.map(e => e.elementLength)
    expect(pattern).toHaveLength(paper.length)
    pattern?.forEach((v, i) => expect(v).toBeCloseTo(paper[i] * 100, 6))
  })

  it('keeps circles, arcs and ellipses as curves', async () => {
    const { entities } = await open('sxf-sample.sfc')
    const circle = entities.find(
      (e): e is AcDbCircle => e instanceof AcDbCircle
    )
    expect(circle!.radius).toBeCloseTo(600, 3)
    const arc = entities.find((e): e is AcDbArc => e instanceof AcDbArc)
    expect(arc!.radius).toBeCloseTo(900, 3)
    expect(arc!.startAngle).toBeCloseTo(0, 6)
    expect(arc!.endAngle).toBeCloseTo(Math.PI / 2, 6)
    const ellipse = entities.find(
      (e): e is AcDbEllipse => e instanceof AcDbEllipse
    )
    expect(ellipse!.majorAxisRadius).toBeCloseTo(1400, 3)
    expect(ellipse!.minorAxisRadius).toBeCloseTo(700, 3)
  })

  it('sizes text by its character box and keeps the font', async () => {
    const { entities } = await open('sxf-sample.sfc')
    const texts = entities.filter((e): e is AcDbText => e instanceof AcDbText)
    const room = texts.find(t => t.textString === '居間・食堂')!
    // 400 mm box height → BIZ UD Gothic cap height.
    expect(room.height).toBeCloseTo(400 * sxfTextFontMetrics('').capHeight, 3)
    // Base point 2 (bottom centre) at x = 2500: the box is 2000 wide.
    expect(room.position.x).toBeCloseTo(2500 - 1000 + 80 * 100, 3)
    const title = texts.find(t => t.textString === 'サンプル平面図')!
    expect(title.styleName).toBe('ＭＳ 明朝')
  })

  it('draws fills and hatch lines', async () => {
    const { entities } = await open('sxf-sample.sfc')
    const fill = entities.find((e): e is AcDbHatch => e instanceof AcDbHatch)
    expect(fill?.isSolidFill).toBe(true)
    // Sheet scale, like HPSCALE of new hatches: a pattern chosen for the
    // fill later keeps its paper size.
    expect(fill?.patternScale).toBeCloseTo(100, 6)
    const hatchLines = entities.filter(
      (e): e is AcDbLine => e instanceof AcDbLine && e.layer === '壁'
    )
    expect(hatchLines.length).toBeGreaterThan(10)
  })

  it('can keep paper millimetres', () => {
    const { dxf } = convertSxfToDxf(sampleBytes('sxf-sample.sfc'), {
      scaleMode: 'paper'
    })
    expect(dxf).toContain('9\n$LIMMAX\n10\n420\n20\n297\n')
    const real = convertSxfToDxf(sampleBytes('sxf-sample.sfc')).dxf
    expect(real).toContain('9\n$LIMMAX\n10\n42000\n20\n29700\n')
  })
})
