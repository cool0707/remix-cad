import {
  AcDbDatabase,
  acdbHostApplicationServices,
  AcDbLine,
  AcGePoint3d
} from '@mlightcad/data-model'

import {
  acapDrawingHatchScale,
  acapHasSheetOptions,
  acapResolveDrawingSheet,
  acapSetDxfLimits
} from '../src/app/AcApDrawingSheet'

function drawing() {
  const db = new AcDbDatabase()
  db.createDefaultData()
  acdbHostApplicationServices().workingDatabase = db
  db.tables.blockTable.modelSpace.appendEntity(
    new AcDbLine(new AcGePoint3d(0, 0, 0), new AcGePoint3d(30000, 10000, 0))
  )
  return db
}

describe('acapResolveDrawingSheet', () => {
  it('chooses the paper and scale automatically from the extents', () => {
    const { sheet, min, max } = acapResolveDrawingSheet(drawing())
    expect(sheet).toMatchObject({ paper: 'A3', portrait: false, scale: 100 })
    expect(max.x - min.x).toBeCloseTo(42000, 6)
    expect((min.x + max.x) / 2).toBeCloseTo(15000, 6)
  })

  it('uses the requested paper, orientation and scale', () => {
    const { sheet, min, max } = acapResolveDrawingSheet(drawing(), {
      paper: 'A1',
      portrait: true,
      scale: 50
    })
    expect(sheet).toMatchObject({ paper: 'A1', portrait: true, scale: 50 })
    expect(max.x - min.x).toBeCloseTo(594 * 50, 6)
    expect(max.y - min.y).toBeCloseTo(841 * 50, 6)
  })

  it('works in drawing units other than millimetres', () => {
    const db = drawing()
    db.insunits = 6 // metres
    const { sheet, max, min } = acapResolveDrawingSheet(db, { scale: 100000 })
    expect(sheet.scale).toBe(100000)
    // A3 at 1:100000 is 42 km wide.
    expect(max.x - min.x).toBeCloseTo(42000, 6)
  })

  it('reports whether anything is set', () => {
    expect(acapHasSheetOptions({})).toBe(false)
    expect(acapHasSheetOptions({ scale: 10 })).toBe(true)
  })
})

describe('acapDrawingHatchScale', () => {
  it('uses the scale of the sheet the limits describe (JWW / SXF)', () => {
    const db = drawing()
    // A3 at 1/100, centred on the origin like a JWW drawing.
    db.limmin = { x: -21000, y: -14850 }
    db.limmax = { x: 21000, y: 14850 }
    expect(acapDrawingHatchScale(db)).toBe(100)
  })

  it('converts the scale to drawing units', () => {
    const db = drawing()
    db.insunits = 6 // metres
    db.limmin = { x: 0, y: 0 }
    db.limmax = { x: 42, y: 29.7 }
    expect(acapDrawingHatchScale(db)).toBeCloseTo(0.1, 12)
  })

  it('is 1 without limits that are a sheet at a standard scale', () => {
    const db = drawing()
    expect(acapDrawingHatchScale(db)).toBe(1)
    db.limmin = { x: 0, y: 0 }
    db.limmax = { x: 12, y: 9 }
    expect(acapDrawingHatchScale(db)).toBe(1)
    db.limmax = { x: 420 * 37, y: 297 * 37 }
    expect(acapDrawingHatchScale(db)).toBe(1)
  })
})

describe('acapSetDxfLimits', () => {
  const dxf = ['  0', 'SECTION', '  2', 'HEADER', '  9', '$ACADVER', '  1', 'AC1021', '  9', '$LIMMIN', ' 10', '0', ' 20', '0', '  0', 'ENDSEC', ''].join('\n')

  it('replaces the limits in the header', () => {
    const out = acapSetDxfLimits(dxf, { x: -10, y: -5 }, { x: 410, y: 292 })
    const lines = out.split('\n')
    expect(lines.filter(l => l === '$LIMMIN')).toHaveLength(1)
    const at = (name: string) => lines.slice(lines.indexOf(name) + 1, lines.indexOf(name) + 5)
    expect(at('$LIMMIN')).toEqual([' 10', '-10', ' 20', '-5'])
    expect(at('$LIMMAX')).toEqual([' 10', '410', ' 20', '292'])
    expect(lines).toContain('$ACADVER')
    expect(out.endsWith('ENDSEC\n')).toBe(true)
  })
})
