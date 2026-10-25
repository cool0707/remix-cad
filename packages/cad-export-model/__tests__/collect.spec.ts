import {
  AcDbArc,
  AcDbBlockReference,
  AcDbBlockTableRecord,
  AcDbDatabase,
  acdbHostApplicationServices,
  AcDbLine,
  AcDbMText,
  AcDbPolyline,
  AcDbText,
  AcGePoint2d,
  AcGePoint3d
} from '@mlightcad/data-model'
import { readFileSync } from 'fs'
import { resolve } from 'path'

import {
  bulgeArc,
  chooseSheet,
  collectExportDrawing,
  curvePoint,
  type ExportCurveEntity,
  type ExportPolyline,
  type ExportText,
  layoutTextLines,
  mtextLines,
  principalCurve,
  sheetFromLimits,
  transformCurve
} from '../src'

function newDatabase() {
  const db = new AcDbDatabase()
  db.createDefaultData()
  acdbHostApplicationServices().workingDatabase = db
  return db
}

describe('geometry', () => {
  it('turns bulges into arcs in both directions', () => {
    const ccw = bulgeArc([0, 0], [10, 0], 1) // half circle above? (CCW from a to b goes below)
    expect(principalCurve(ccw).radiusX).toBeCloseTo(5, 9)
    const mid = curvePoint(ccw, (ccw.start + ccw.end) / 2)
    expect(mid[1]).toBeCloseTo(-5, 9)
    const cw = bulgeArc([0, 0], [10, 0], -1)
    expect(curvePoint(cw, (cw.start + cw.end) / 2)[1]).toBeCloseTo(5, 9)
  })

  it('keeps arcs exact under mirroring and non-uniform scaling', () => {
    const arc = {
      center: [0, 0] as [number, number],
      u: [2, 0] as [number, number],
      v: [0, 2] as [number, number],
      start: 0,
      end: Math.PI / 2
    }
    const mirrored = transformCurve([-1, 0, 0, 1, 0, 0], arc)
    expect(principalCurve(mirrored)).toMatchObject({ circular: true })
    expect(curvePoint(mirrored, mirrored.start)[0]).toBeCloseTo(0, 9)
    expect(curvePoint(mirrored, mirrored.end)[0]).toBeCloseTo(-2, 9)
    const stretched = principalCurve(transformCurve([1, 0, 0, 3, 0, 0], arc))
    expect(stretched.radiusX).toBeCloseTo(6, 9)
    expect(stretched.radiusY).toBeCloseTo(2, 9)
    expect(stretched.circular).toBe(false)
  })
})

describe('text helpers', () => {
  it('splits MTEXT into plain lines', () => {
    expect(
      mtextLines('{\\fMS Gothic|b0;一行目}\\P\\H2.5;二行目 %%c10')
    ).toEqual(['一行目', '二行目 Ø10'])
  })

  it('places lines by attachment point', () => {
    const lines = layoutTextLines(['ab', 'cd'], [0, 0], 1, 1, 0, 5, 1, 'Arial')
    // Middle centre: two lines 5/3 apart around the anchor.
    expect(lines[0].position[1]).toBeCloseTo(5 / 6 - 0.5, 9)
    expect(lines[1].position[1]).toBeCloseTo(-5 / 6 - 0.5, 9)
    expect(lines[0].position[0]).toBeLessThan(0)
  })
})

describe('sheet', () => {
  it('recognizes a sheet from the drawing limits', () => {
    expect(
      sheetFromLimits({ min: [-21000, -14850], max: [21000, 14850] })
    ).toMatchObject({
      paper: 'A3',
      portrait: false,
      scale: 100,
      origin: [-21000, -14850]
    })
    expect(sheetFromLimits({ min: [0, 0], max: [2100, 2970] })).toMatchObject({
      paper: 'A4',
      portrait: true,
      scale: 10
    })
    expect(sheetFromLimits({ min: [0, 0], max: [12, 9] })).toBeUndefined()
  })

  it('picks the smallest standard scale that fits', () => {
    const sheet = chooseSheet({ min: [0, 0], max: [30000, 10000] }, undefined)
    expect(sheet).toMatchObject({ paper: 'A3', scale: 100 })
    expect(sheet.origin[0] + (sheet.width * sheet.scale) / 2).toBeCloseTo(
      15000,
      9
    )
    expect(
      chooseSheet({ min: [0, 0], max: [100, 100] }, undefined, {
        paper: 'A1',
        scale: 2
      })
    ).toMatchObject({
      paper: 'A1',
      scale: 2,
      width: 841
    })
  })
})

describe('collectExportDrawing', () => {
  it('expands blocks and keeps layers, colours and text', () => {
    const db = newDatabase()
    const block = new AcDbBlockTableRecord()
    block.name = 'MARK'
    db.tables.blockTable.add(block)
    const line = new AcDbLine(
      new AcGePoint3d(0, 0, 0),
      new AcGePoint3d(10, 0, 0)
    )
    line.layer = '0'
    block.appendEntity(line)
    const arc = new AcDbArc(new AcGePoint3d(0, 0, 0), 5, 0, Math.PI / 2)
    block.appendEntity(arc)
    const ref = new AcDbBlockReference('MARK')
    ref.position = new AcGePoint3d(100, 50, 0)
    ref.rotation = Math.PI / 2
    ref.scaleFactors = new AcGePoint3d(2, 2, 1)
    db.tables.blockTable.modelSpace.appendEntity(ref)

    const pl = new AcDbPolyline()
    pl.addVertexAt(0, new AcGePoint2d(0, 0), 1)
    pl.addVertexAt(1, new AcGePoint2d(10, 0))
    pl.addVertexAt(2, new AcGePoint2d(10, 10))
    db.tables.blockTable.modelSpace.appendEntity(pl)

    const text = new AcDbText()
    text.textString = '寸法'
    text.height = 2.5
    text.position = new AcGePoint3d(1, 2, 0)
    db.tables.blockTable.modelSpace.appendEntity(text)

    const mtext = new AcDbMText()
    mtext.contents = 'A\\PB'
    mtext.height = 3
    mtext.location = new AcGePoint3d(0, 100, 0)
    db.tables.blockTable.modelSpace.appendEntity(mtext)

    const drawing = collectExportDrawing(db)
    const lines = drawing.entities.filter(
      (e): e is ExportPolyline => e.kind === 'polyline'
    )
    const curves = drawing.entities.filter(
      (e): e is ExportCurveEntity => e.kind === 'curve'
    )
    // Block line: rotated 90° and doubled → from (100, 50) to (100, 70).
    const blockLine = lines.find(l => l.points[0][0] === 100)!
    expect(blockLine.points[1][0]).toBeCloseTo(100, 9)
    expect(blockLine.points[1][1]).toBeCloseTo(70, 9)
    expect(principalCurve(curves[0].curve).radiusX).toBeCloseTo(10, 9)
    // Polyline: one bulge arc and one straight run.
    expect(curves).toHaveLength(2)
    expect(
      lines.some(l => l.points.length === 2 && l.points[1][1] === 10)
    ).toBe(true)
    const texts = drawing.entities.filter(
      (e): e is ExportText => e.kind === 'text'
    )
    expect(texts.map(t => t.text)).toEqual(['寸法', 'A', 'B'])
    expect(texts[0]).toMatchObject({ position: [1, 2], height: 2.5 })
    expect(drawing.layers.map(l => l.name)).toContain('0')
  })

  it('exports the DXF samples', async () => {
    const db = newDatabase()
    const bytes = readFileSync(
      resolve(__dirname, '../../../resources/cad-data/samples/fonts-sample.dxf')
    )
    await db.read(
      bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
      { fileName: 'x.dxf' },
      'dxf'
    )
    const drawing = collectExportDrawing(db)
    expect(
      drawing.entities.filter(e => e.kind === 'text').length
    ).toBeGreaterThan(3)
    expect(drawing.warnings).toEqual([])
  })
})
