import {
  AcDbDatabase,
  acdbHostApplicationServices
} from '@mlightcad/data-model'

import {
  ACAP_GENERIC_LINE_TYPES,
  ACAP_JWW_LINE_TYPES,
  acapEnsureStandardLineType,
  acapIsJwwDrawing,
  acapStandardLineTypes
} from '../src/app/AcApStandardLineTypes'

function drawing() {
  const db = new AcDbDatabase()
  db.createDefaultData()
  acdbHostApplicationServices().workingDatabase = db
  return db
}

const names = (db: AcDbDatabase, fileName?: string) =>
  acapStandardLineTypes(db, fileName).map(lt => lt.name)

describe('acapStandardLineTypes', () => {
  it('offers only the generic line types for ordinary drawings', () => {
    expect(names(drawing(), 'plan.dxf')).toEqual(
      ACAP_GENERIC_LINE_TYPES.map(lt => lt.name)
    )
  })

  it('adds the Jw_cad line types for drawings from Jw_cad', () => {
    const all = [...ACAP_GENERIC_LINE_TYPES, ...ACAP_JWW_LINE_TYPES].map(
      lt => lt.name
    )
    expect(names(drawing(), 'plan.JWW')).toEqual(all)
    expect(names(drawing(), 'detail.jwc')).toEqual(all)

    // A JWW saved as DXF still uses Jw_cad line types.
    const db = drawing()
    acapEnsureStandardLineType(db, 'JWW_DASHED1', 'plan.jww')
    expect(acapIsJwwDrawing(db, 'plan.dxf')).toBe(true)
    expect(names(db, 'plan.dxf')).toEqual(all)
  })
})

describe('acapEnsureStandardLineType', () => {
  it('adds a missing standard line type once', () => {
    const db = drawing()
    expect(db.tables.linetypeTable.has('DASHED')).toBe(false)
    expect(acapEnsureStandardLineType(db, 'dashed')).toBe(true)
    const record = db.tables.linetypeTable.getAt('DASHED')!
    expect(record.linetype.pattern?.map(e => e.elementLength)).toEqual([
      12.7, -6.35
    ])
    expect(record.linetype.totalPatternLength).toBeCloseTo(19.05, 9)
    expect(acapEnsureStandardLineType(db, 'DASHED')).toBe(false)
  })

  it('leaves defined, special and unknown names alone', () => {
    const db = drawing()
    expect(acapEnsureStandardLineType(db, 'Continuous')).toBe(false)
    expect(acapEnsureStandardLineType(db, 'ByLayer')).toBe(false)
    expect(acapEnsureStandardLineType(db, 'MY_FENCE')).toBe(false)
    // Jw_cad line types only for drawings from Jw_cad.
    expect(acapEnsureStandardLineType(db, 'JWW_DASHED1', 'a.dxf')).toBe(false)
  })

  it('scales patterns to the sheet scale (JWW / SXF) and to inches', () => {
    const jww = drawing()
    // A3 at 1/100, centred on the origin like a JWW drawing.
    jww.limmin = { x: -21000, y: -14850 }
    jww.limmax = { x: 21000, y: 14850 }
    acapEnsureStandardLineType(jww, 'JWW_DASHDOT1', 'plan.jww')
    expect(
      jww.tables.linetypeTable
        .getAt('JWW_DASHDOT1')!
        .linetype.pattern?.map(e => e.elementLength)
    ).toEqual([312.5, -62.5, 62.5, -62.5])

    const imperial = drawing()
    imperial.measurement = 0
    acapEnsureStandardLineType(imperial, 'DASHED')
    const pattern = imperial.tables.linetypeTable
      .getAt('DASHED')!
      .linetype.pattern!.map(e => e.elementLength)
    expect(pattern[0]).toBeCloseTo(0.5, 9)
    expect(pattern[1]).toBeCloseTo(-0.25, 9)
  })
})
