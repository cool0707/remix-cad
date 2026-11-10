import {
  AcCmColor,
  AcDbAttribute,
  AcDbBlockReference,
  AcDbBlockTableRecord,
  AcDbDatabase,
  AcDbEntity,
  AcDbLine,
  AcDbText,
  AcGePoint3d
} from '@mlightcad/data-model'

import {
  acapBlockEvents,
  acapExplodeBlockReferences,
  acapRemoveBlockDefinitions,
  acapUnusedBlockNames
} from '../src/service/AcApBlockExplode'
import { acapRunServiceEdit } from '../src/service/AcApServiceEdit'

function setup() {
  const db = new AcDbDatabase()
  const block = new AcDbBlockTableRecord()
  block.name = 'DOOR'
  db.tables.blockTable.add(block)
  const onZero = new AcDbLine(
    new AcGePoint3d(0, 0, 0),
    new AcGePoint3d(10, 0, 0)
  )
  onZero.layer = '0'
  const byBlock = new AcDbLine(
    new AcGePoint3d(0, 0, 0),
    new AcGePoint3d(0, 5, 0)
  )
  byBlock.color = new AcCmColor().setByBlock()
  block.appendEntity([onZero, byBlock])
  const insert = (x: number) => {
    const ref = new AcDbBlockReference('DOOR')
    ref.position = new AcGePoint3d(x, 0, 0)
    ref.scaleFactors = new AcGePoint3d(2, 2, 1)
    ref.layer = '0'
    ref.color = new AcCmColor().setByLayer()
    db.tables.blockTable.modelSpace.appendEntity(ref)
    return ref
  }
  return { db, insert }
}

function modelEntities(db: AcDbDatabase): AcDbEntity[] {
  return [...db.tables.blockTable.modelSpace.newIterator()]
}

describe('acapExplodeBlockReferences', () => {
  test('replaces the symbol by its shapes, placed and scaled', () => {
    const { db, insert } = setup()
    const ref = insert(100)
    const result = acapRunServiceEdit(db, 'Explode', () =>
      acapExplodeBlockReferences(db, [ref])
    )

    expect(result.explodedCount).toBe(1)
    expect(result.blockNames).toEqual(['DOOR'])
    const entities = modelEntities(db)
    expect(entities.some(e => e instanceof AcDbBlockReference)).toBe(false)
    const lines = entities.filter((e): e is AcDbLine => e instanceof AcDbLine)
    expect(lines).toHaveLength(2)
    const horizontal = lines.find(l => l.endPoint.y === 0)!
    expect(horizontal.startPoint.x).toBeCloseTo(100)
    expect(horizontal.endPoint.x).toBeCloseTo(120)
    const vertical = lines.find(l => l.endPoint.y !== 0)!
    expect(vertical.endPoint.y).toBeCloseTo(10)
    // ByBlock takes the symbol's color.
    expect(vertical.color.isByBlock).toBe(false)
    expect(vertical.color.isByLayer).toBe(true)

    // One undo brings the symbol back.
    expect(db.transactionManager.undo()).toBe(true)
    const restored = modelEntities(db)
    expect(restored).toHaveLength(1)
    expect(restored[0]).toBeInstanceOf(AcDbBlockReference)
  })

  test('layer "0" shapes take the symbol layer', () => {
    const { db, insert } = setup()
    const ref = insert(0)
    ref.layer = 'DOORS'
    acapRunServiceEdit(db, 'Explode', () =>
      acapExplodeBlockReferences(db, [ref])
    )
    const layers = modelEntities(db).map(e => e.layer)
    expect(layers).toEqual(['DOORS', 'DOORS'])
  })

  test('visible attributes become plain text', () => {
    const { db, insert } = setup()
    const ref = insert(0)
    const attr = new AcDbAttribute()
    attr.tag = 'NO'
    attr.textString = 'D-1'
    attr.height = 3
    attr.position = new AcGePoint3d(5, 5, 0)
    ref.appendAttributes(attr)
    acapRunServiceEdit(db, 'Explode', () =>
      acapExplodeBlockReferences(db, [ref])
    )
    const texts = modelEntities(db).filter(
      (e): e is AcDbText => e instanceof AcDbText
    )
    expect(texts).toHaveLength(1)
    expect(texts[0]).not.toBeInstanceOf(AcDbAttribute)
    expect(texts[0].textString).toBe('D-1')
    expect(texts[0].position.x).toBeCloseTo(5)
  })
})

describe('acapUnusedBlockNames / acapRemoveBlockDefinitions', () => {
  test('a symbol still placed elsewhere is in use', () => {
    const { db, insert } = setup()
    const first = insert(0)
    insert(50)
    acapRunServiceEdit(db, 'Explode', () =>
      acapExplodeBlockReferences(db, [first])
    )
    expect(acapUnusedBlockNames(db, ['DOOR'])).toEqual([])
  })

  test('the last symbol exploded: the definition stays until removed', () => {
    const { db, insert } = setup()
    const ref = insert(0)
    const listener = jest.fn()
    acapBlockEvents.blocksChanged.addEventListener(listener)
    acapRunServiceEdit(db, 'Explode', () => {
      acapExplodeBlockReferences(db, [ref])
      // Not removed automatically.
      expect(db.tables.blockTable.getAt('DOOR')).toBeDefined()
      const unused = acapUnusedBlockNames(db, ['DOOR'])
      expect(unused).toEqual(['DOOR'])
      expect(acapRemoveBlockDefinitions(db, unused)).toBe(1)
    })
    acapBlockEvents.blocksChanged.removeEventListener(listener)
    expect(listener).toHaveBeenCalledTimes(1)
    expect(db.tables.blockTable.getAt('DOOR')).toBeUndefined()

    // Undo brings back both the definition and the symbol.
    expect(db.transactionManager.undo()).toBe(true)
    expect(db.tables.blockTable.getAt('DOOR')).toBeDefined()
    expect(modelEntities(db)[0]).toBeInstanceOf(AcDbBlockReference)
  })

  test('a symbol nested in another definition is in use', () => {
    const { db, insert } = setup()
    const ref = insert(0)
    const outer = new AcDbBlockTableRecord()
    outer.name = 'ROOM'
    db.tables.blockTable.add(outer)
    outer.appendEntity(new AcDbBlockReference('DOOR'))
    acapRunServiceEdit(db, 'Explode', () =>
      acapExplodeBlockReferences(db, [ref])
    )
    expect(acapUnusedBlockNames(db, ['DOOR'])).toEqual([])
  })
})
