import {
  AcDbBlockReference,
  AcDbBlockTableRecord,
  AcDbDatabase,
  acdbHostApplicationServices,
  AcDbLayerTableRecord,
  AcDbLine,
  AcGeMatrix3d,
  AcGePoint3d,
  AcGeVector3d
} from '@mlightcad/data-model'

import {
  acapSymbolEditDimColor,
  acapSymbolEditTransform
} from '../src/app/AcApSymbolEditMath'
import {
  acapEnsureDrawingLayer,
  acapHasLooseEntitiesOnSymbolLayer,
  acapSymbolLayerState
} from '../src/app/AcApSymbolLayer'
import {
  acapSetEntityEditScope,
  excludeLockedLayerIds,
  isEntityOnLockedLayer
} from '../src/service/AcApLockedLayer'

function drawing() {
  const db = new AcDbDatabase()
  db.createDefaultData()
  acdbHostApplicationServices().workingDatabase = db
  return db
}

function line(layer: string) {
  const entity = new AcDbLine(new AcGePoint3d(0, 0, 0), new AcGePoint3d(1, 0, 0))
  entity.layer = layer
  return entity
}

function addLayer(db: AcDbDatabase, name: string, off = false) {
  const layer = new AcDbLayerTableRecord({ name, isOff: off })
  db.tables.layerTable.add(layer)
  return layer
}

/** A symbol whose contents are on layer 0, placed on `layer`. */
function placeSymbol(db: AcDbDatabase, layer: string) {
  const block = new AcDbBlockTableRecord()
  block.name = 'DOOR'
  db.tables.blockTable.add(block)
  block.appendEntity(line('0'))
  const reference = new AcDbBlockReference('DOOR')
  reference.layer = layer
  db.tables.blockTable.modelSpace.appendEntity(reference)
  return reference
}

describe('the symbol editing layer (layer 0)', () => {
  it('is not listed while it only holds the contents of symbols', () => {
    const db = drawing()
    addLayer(db, 'DOORS')
    placeSymbol(db, 'DOORS')

    expect(acapHasLooseEntitiesOnSymbolLayer(db)).toBe(false)
    expect(acapSymbolLayerState(db, false)).toEqual({
      listed: false,
      warning: false
    })
    // Listed while a symbol is edited, without a warning.
    expect(acapSymbolLayerState(db, true)).toEqual({
      listed: true,
      warning: false
    })
  })

  it('is listed with a warning when entities sit on it outside of symbols', () => {
    const db = drawing()
    const loose = line('0')
    db.tables.blockTable.modelSpace.appendEntity(loose)

    expect(acapSymbolLayerState(db, false)).toEqual({
      listed: true,
      warning: true
    })
    // The copies shown while a symbol is edited do not count.
    expect(
      acapSymbolLayerState(db, true, id => id === loose.objectId)
    ).toEqual({ listed: true, warning: false })
  })

  it('counts a symbol placed on layer 0 itself', () => {
    const db = drawing()
    placeSymbol(db, '0')
    expect(acapHasLooseEntitiesOnSymbolLayer(db)).toBe(true)
  })
})

describe('acapEnsureDrawingLayer', () => {
  it('gives a drawing that only has layer 0 a new layer to draw on', () => {
    const db = drawing()
    expect(db.clayer).toBe('0')
    expect(acapEnsureDrawingLayer(db, 'Layer')).toBe('Layer1')
    expect(db.clayer).toBe('Layer1')
    expect(db.tables.layerTable.has('Layer1')).toBe(true)
    // Not an undo step.
    expect(db.transactionManager.canUndo()).toBe(false)
    // Nothing more to do the next time.
    expect(acapEnsureDrawingLayer(db, 'Layer')).toBeUndefined()
  })

  it('takes the first other layer that is shown and unlocked', () => {
    const db = drawing()
    addLayer(db, 'HIDDEN', true)
    const locked = addLayer(db, 'LOCKED')
    locked.standardFlags = (locked.standardFlags ?? 0) | 4
    addLayer(db, 'WALLS')
    addLayer(db, 'XREF|WALLS')

    expect(acapEnsureDrawingLayer(db, 'Layer')).toBe('WALLS')
    expect(db.clayer).toBe('WALLS')
    expect(db.tables.layerTable.has('Layer1')).toBe(false)
  })

  it('numbers the new layer past the names in use', () => {
    const db = drawing()
    addLayer(db, 'Layer1', true)
    expect(acapEnsureDrawingLayer(db, 'Layer')).toBe('Layer2')
  })

  it('leaves the current layer when layer 0 is listed or not current', () => {
    const db = drawing()
    addLayer(db, 'WALLS')
    db.tables.blockTable.modelSpace.appendEntity(line('0'))
    expect(acapEnsureDrawingLayer(db, 'Layer')).toBeUndefined()
    expect(db.clayer).toBe('0')

    const other = drawing()
    addLayer(other, 'WALLS')
    addLayer(other, 'DOORS')
    other.clayer = 'DOORS'
    expect(acapEnsureDrawingLayer(other, 'Layer')).toBeUndefined()
    expect(other.clayer).toBe('DOORS')
  })
})

describe('acapSetEntityEditScope', () => {
  it('treats entities outside the scope like entities on a locked layer', () => {
    const db = drawing()
    const inside = line('0')
    const outside = line('0')
    db.tables.blockTable.modelSpace.appendEntity([inside, outside])

    acapSetEntityEditScope(db, id => id === inside.objectId)
    expect(isEntityOnLockedLayer(db, inside)).toBe(false)
    expect(isEntityOnLockedLayer(db, outside)).toBe(true)
    // Dropped from a selection without being reported as locked.
    expect(
      excludeLockedLayerIds(db, [inside.objectId, outside.objectId])
    ).toEqual({ ids: [inside.objectId], lockedCount: 0 })

    acapSetEntityEditScope(db, undefined)
    expect(isEntityOnLockedLayer(db, outside)).toBe(false)
  })
})

describe('acapSymbolEditTransform', () => {
  const placement = (
    x: number,
    y: number,
    rotation: number,
    scaleX: number,
    scaleY: number
  ) => ({
    blockTransform: new AcGeMatrix3d()
      .makeTranslation(x, y, 0)
      .multiply(new AcGeMatrix3d().makeRotationZ(rotation))
      .multiply(new AcGeMatrix3d().makeScale(scaleX, scaleY, 1)),
    normal: new AcGeVector3d(0, 0, 1)
  })
  const apply = (matrix: AcGeMatrix3d, x: number, y: number) =>
    new AcGePoint3d(x, y, 0).applyMatrix4(matrix)

  it('is the placement itself for one scale and no mirror', () => {
    const source = placement(100, 50, Math.PI / 2, 2, 2)
    const matrix = acapSymbolEditTransform(source)!
    const point = apply(matrix, 1, 0)
    expect(point.x).toBeCloseTo(100)
    expect(point.y).toBeCloseTo(52)
    expect(matrix.equals(source.blockTransform)).toBe(true)
  })

  it('drops the stretch and the mirror of other placements', () => {
    const stretched = acapSymbolEditTransform(placement(10, 0, 0, 3, 1))!
    const top = apply(stretched, 0, 1)
    // The X scale both ways.
    expect(top.x).toBeCloseTo(10)
    expect(top.y).toBeCloseTo(3)

    const mirrored = acapSymbolEditTransform(placement(0, 0, 0, -1, 1))!
    // Not a mirror: orientation is kept (X axis follows the placement).
    expect(mirrored.determinant()).toBeGreaterThan(0)
    expect(apply(mirrored, 1, 0).x).toBeCloseTo(-1)
    expect(apply(mirrored, 0, 1).y).toBeCloseTo(-1)
  })

  it('has no answer for a symbol without size', () => {
    expect(acapSymbolEditTransform(placement(0, 0, 0, 0, 0))).toBeUndefined()
  })
})

describe('acapSymbolEditDimColor', () => {
  it('stays near the background, on its lighter or darker side', () => {
    expect(acapSymbolEditDimColor(0x000000)).toBe(0x666666)
    expect(acapSymbolEditDimColor(0xffffff)).toBe(0x999999)
  })
})
