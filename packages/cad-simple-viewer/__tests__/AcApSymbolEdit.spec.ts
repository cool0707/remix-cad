import {
  AcDbAttributeDefinition,
  AcDbBlockReference,
  AcDbBlockTableRecord,
  AcDbDatabase,
  AcDbEntity,
  acdbHostApplicationServices,
  AcDbLayerTableRecord,
  AcDbLine,
  AcDbObjectId,
  AcGeMatrix3d,
  AcGePoint3d
} from '@mlightcad/data-model'

const mockDoc: { database?: AcDbDatabase; openMode: number } = { openMode: 8 }
const mockSettings = { operationProfile: 'simple' }
const mockSessionUndo = {
  kinds: [] as string[],
  get depth() {
    return this.kinds.length
  },
  peekUndo() {
    return this.kinds[this.kinds.length - 1]
  },
  discardDbSince(depth: number) {
    this.kinds.length = Math.min(this.kinds.length, depth)
  },
  discardDbRedo: jest.fn()
}

jest.mock('../src/app/AcApDocManager', () => ({
  AcApDocManager: {
    get instance() {
      return { curDocument: mockDoc }
    }
  }
}))
jest.mock('../src/app/AcApSettingManager', () => ({
  AcApSettingManager: {
    get instance() {
      return mockSettings
    }
  }
}))
jest.mock('../src/app/AcApDrawingExporters', () => ({
  acapDrawingExporters: () => [{ command: 'cjww' }]
}))
jest.mock('../src/command/markup/AcApMarkupHistory', () => ({
  getSessionUndo: () => mockSessionUndo
}))
jest.mock('../src/i18n', () => ({
  AcApI18n: {
    t: (key: string, options?: { fallback?: string }) =>
      options?.fallback ?? key
  }
}))
jest.mock('../src/editor/view/AcEdOpenMode', () => ({
  AcEdOpenMode: { Read: 0, Review: 4, Write: 8 }
}))

import {
  ACAP_SYMBOL_EDIT_UNDO_LABEL,
  AcApSymbolEditController,
  AcApSymbolEditHost
} from '../src/app/AcApSymbolEdit'
import { eventBus } from '../src/editor/global/eventBus'
import { isEntityOnLockedLayer } from '../src/service/AcApLockedLayer'
import { acapRunDatabaseEdit } from '../src/util/AcApDatabaseEdit'

eventBus.on('session-db-edit-committed', () => {
  mockSessionUndo.kinds.push('db')
})

function line(x1: number, y1: number, x2: number, y2: number) {
  const entity = new AcDbLine(
    new AcGePoint3d(x1, y1, 0),
    new AcGePoint3d(x2, y2, 0)
  )
  entity.layer = '0'
  return entity
}

function setup() {
  const db = new AcDbDatabase()
  db.createDefaultData()
  acdbHostApplicationServices().workingDatabase = db
  mockDoc.database = db
  mockSessionUndo.kinds.length = 0
  mockSettings.operationProfile = 'simple'

  const blockTable = db.tables.blockTable
  const door = new AcDbBlockTableRecord()
  door.name = 'DOOR'
  blockTable.add(door)
  // A 10 long sill and a 5 high jamb.
  door.appendEntity([line(0, 0, 10, 0), line(0, 0, 0, 5)])

  const place = (
    name: string,
    x: number,
    y: number,
    scale: [number, number] = [1, 1],
    rotation = 0,
    owner: AcDbBlockTableRecord = blockTable.modelSpace
  ) => {
    const reference = new AcDbBlockReference(name)
    reference.position = new AcGePoint3d(x, y, 0)
    reference.scaleFactors = new AcGePoint3d(scale[0], scale[1], 1)
    reference.rotation = rotation
    reference.layer = '0'
    owner.appendEntity(reference)
    return reference
  }

  const hidden = new Set<AcDbObjectId>()
  const kept = new Set<AcDbObjectId>()
  let dim: { color: number; keep: AcDbObjectId[] } | undefined
  const selection = new Set<AcDbObjectId>()
  const messages: string[] = []
  const host: AcApSymbolEditHost = {
    activeSpaceId: () => blockTable.modelSpace.objectId,
    backgroundColor: () => 0x000000,
    setSceneVisible: (id, visible) => {
      if (visible) hidden.delete(id)
      else hidden.add(id)
    },
    setDimDisplay: options => {
      dim = options
      kept.clear()
      options?.keep.forEach(id => kept.add(id))
    },
    setKept: (id, isKept) => {
      if (isKept) kept.add(id)
      else kept.delete(id)
    }
  }
  const view = {
    selectionSet: {
      clear: () => selection.clear(),
      add: (id: AcDbObjectId) => selection.add(id)
    },
    editor: {
      showMessage: (message: string) => messages.push(message)
    }
  }
  const controller = new AcApSymbolEditController(view as never, host)

  const model = () => [...blockTable.modelSpace.newIterator()]
  const lines = (owner: AcDbBlockTableRecord) =>
    [...owner.newIterator()].filter(
      (entity): entity is AcDbLine => entity instanceof AcDbLine
    )
  const edit = (label: string, change: () => void) =>
    acapRunDatabaseEdit(db, label, change)
  const move = (entity: AcDbEntity, dx: number, dy: number) =>
    edit('Move', () => {
      db.openEntityForWrite(entity)!.transformBy(
        new AcGeMatrix3d().makeTranslation(dx, dy, 0)
      )
    })

  return {
    db,
    door,
    place,
    controller,
    model,
    lines,
    edit,
    move,
    hidden,
    kept,
    selection,
    messages,
    dim: () => dim
  }
}

describe('symbol editing in place', () => {
  it('shows the contents at the place of the entered symbol', () => {
    const t = setup()
    const first = t.place('DOOR', 100, 50, [2, 2])
    const second = t.place('DOOR', 300, 50)

    expect(t.controller.canEnter(first.objectId)).toBe(true)
    expect(t.controller.enter(first.objectId)).toBe(true)

    expect(t.controller.isActive).toBe(true)
    expect(t.controller.path).toEqual([{ name: 'DOOR', inPlace: true }])
    expect(t.hidden.has(first.objectId)).toBe(true)
    expect(t.hidden.has(second.objectId)).toBe(false)

    // Two copies on the canvas, placed and scaled like the symbol.
    const copies = t.lines(t.db.tables.blockTable.modelSpace)
    expect(copies).toHaveLength(2)
    const sill = copies.find(copy => copy.endPoint.y === 50)!
    expect(sill.startPoint.x).toBeCloseTo(100)
    expect(sill.endPoint.x).toBeCloseTo(120)

    // Only the contents can be edited; the rest is dimmed and locked out.
    expect(t.dim()?.keep.sort()).toEqual(copies.map(c => c.objectId).sort())
    expect(isEntityOnLockedLayer(t.db, sill)).toBe(false)
    expect(isEntityOnLockedLayer(t.db, second)).toBe(true)
    // Entering alone is not an undo step.
    expect(t.db.transactionManager.canUndo()).toBe(false)
    // Simple profile: draw on the symbol editing layer.
    expect(t.db.clayer).toBe('0')
  })

  it('leaves the definition untouched when nothing was edited', () => {
    const t = setup()
    const reference = t.place('DOOR', 100, 50, [2, 2], Math.PI / 6)
    const before = [...t.door.newIterator()]
    const ids = before.map(entity => entity.objectId)

    t.controller.enter(reference.objectId)
    expect(t.controller.exit()).toBe(true)

    expect(t.controller.isActive).toBe(false)
    expect([...t.door.newIterator()]).toEqual(before)
    expect([...t.door.newIterator()].map(e => e.objectId)).toEqual(ids)
    expect(t.model()).toEqual([reference])
    expect(t.hidden.size).toBe(0)
    expect(t.dim()).toBeUndefined()
    expect(isEntityOnLockedLayer(t.db, reference)).toBe(false)
    expect(t.db.transactionManager.canUndo()).toBe(false)
    expect(t.selection.has(reference.objectId)).toBe(true)
  })

  it('writes a moved entity back in definition coordinates, as one undo step', () => {
    const t = setup()
    const reference = t.place('DOOR', 100, 50, [2, 2])
    const untouched = t.lines(t.door).find(l => l.endPoint.y === 5)!

    t.controller.enter(reference.objectId)
    const sill = t
      .lines(t.db.tables.blockTable.modelSpace)
      .find(copy => copy.endPoint.y === 50)!
    // Two steps inside: 6 up on the canvas is 3 in the symbol.
    t.move(sill, 0, 4)
    t.move(sill, 0, 2)
    expect(mockSessionUndo.kinds).toEqual(['db', 'db'])
    t.controller.exit()

    const after = t.lines(t.door)
    expect(after).toHaveLength(2)
    // The entity that was not touched is the very same object.
    expect(after).toContain(untouched)
    const moved = after.find(l => l !== untouched)!
    expect(moved.startPoint.x).toBeCloseTo(0)
    expect(moved.startPoint.y).toBeCloseTo(3)
    expect(moved.endPoint.x).toBeCloseTo(10)
    expect(moved.endPoint.y).toBeCloseTo(3)
    expect(t.model()).toEqual([reference])

    // The steps made inside are gone; one step undoes the visit.
    expect(mockSessionUndo.kinds).toEqual(['db'])
    expect(t.db.transactionManager.undo()).toBe(true)
    const restored = t.lines(t.door)
    expect(restored).toHaveLength(2)
    expect(restored.some(l => l.endPoint.y === 0 && l.endPoint.x === 10)).toBe(
      true
    )
    expect(t.model()).toEqual([reference])
    expect(t.db.transactionManager.canUndo()).toBe(false)

    expect(t.db.transactionManager.redo()).toBe(true)
    expect(t.lines(t.door).some(l => Math.abs(l.endPoint.y - 3) < 1e-9)).toBe(
      true
    )
  })

  it('adds what is drawn inside and removes what is erased', () => {
    const t = setup()
    const reference = t.place('DOOR', 100, 0)
    t.controller.enter(reference.objectId)
    const space = t.db.tables.blockTable.modelSpace
    const jamb = t.lines(space).find(copy => copy.endPoint.y === 5)!

    const drawn = line(100, 0, 110, 5)
    t.edit('Line', () => space.appendEntity(drawn))
    t.edit('Erase', () => t.db.openEntityForWrite(jamb)!.erase())
    expect(t.kept.has(drawn.objectId)).toBe(true)
    expect(t.controller.isInScope(drawn.objectId)).toBe(true)
    t.controller.exit()

    const after = t.lines(t.door)
    expect(after).toHaveLength(2)
    const diagonal = after.find(l => l.endPoint.y === 5)!
    expect(diagonal.startPoint.x).toBeCloseTo(0)
    expect(diagonal.endPoint.x).toBeCloseTo(10)
    expect(t.model()).toEqual([reference])
  })

  it('does not undo past the moment the symbol was entered', () => {
    const t = setup()
    const reference = t.place('DOOR', 100, 0)
    // A step on the canvas, before entering.
    t.move(reference, 10, 0)
    expect(t.controller.blocksUndo()).toBe(false)

    t.controller.enter(reference.objectId)
    expect(t.controller.blocksUndo()).toBe(true)
    const copy = t.lines(t.db.tables.blockTable.modelSpace)[0]
    t.move(copy, 0, 1)
    expect(t.controller.blocksUndo()).toBe(false)
    t.db.transactionManager.undo()
    mockSessionUndo.kinds.pop()
    expect(t.controller.blocksUndo()).toBe(true)

    t.controller.exit()
    // Back on the canvas the earlier step can be undone again.
    expect(t.controller.blocksUndo()).toBe(false)
    expect(t.db.transactionManager.undo()).toBe(true)
    expect(reference.position.x).toBeCloseTo(100)
  })

  it('shows a mirrored or stretched symbol unmirrored and unstretched', () => {
    const t = setup()
    const reference = t.place('DOOR', 100, 0, [3, 1])
    t.controller.enter(reference.objectId)
    expect(t.controller.path).toEqual([{ name: 'DOOR', inPlace: false }])

    const space = t.db.tables.blockTable.modelSpace
    const jamb = t.lines(space).find(copy => copy.startPoint.x === copy.endPoint.x)!
    // Shown with the X scale both ways: the jamb is 15 high, not 5.
    expect(jamb.endPoint.y).toBeCloseTo(15)
    t.move(jamb, 3, 0)
    t.controller.exit()

    const moved = t.lines(t.door).find(l => l.startPoint.x === l.endPoint.x)!
    expect(moved.startPoint.x).toBeCloseTo(1)
    expect(moved.endPoint.y).toBeCloseTo(5)
  })

  it('enters a symbol inside a symbol and folds both into one undo step', () => {
    const t = setup()
    const blockTable = t.db.tables.blockTable
    const wall = new AcDbBlockTableRecord()
    wall.name = 'WALL'
    blockTable.add(wall)
    wall.appendEntity(line(0, 0, 50, 0))
    t.place('DOOR', 20, 0, [1, 1], 0, wall)
    const reference = t.place('WALL', 1000, 0)

    t.controller.enter(reference.objectId)
    const inner = t
      .model()
      .find(
        (entity): entity is AcDbBlockReference =>
          entity instanceof AcDbBlockReference && entity.blockName === 'DOOR'
      )!
    expect(inner.position.x).toBeCloseTo(1020)
    expect(t.controller.enter(inner.objectId)).toBe(true)
    expect(t.controller.path.map(item => item.name)).toEqual(['WALL', 'DOOR'])
    // The wall's own line is now out of reach.
    const wallLine = t
      .lines(blockTable.modelSpace)
      .find(copy => copy.endPoint.x === 1050)!
    expect(t.controller.isInScope(wallLine.objectId)).toBe(false)

    const sill = t
      .lines(blockTable.modelSpace)
      .find(copy => copy.endPoint.x === 1030)!
    t.move(sill, 0, 2)
    t.controller.exit()
    expect(t.controller.path.map(item => item.name)).toEqual(['WALL'])
    expect(t.lines(t.door).some(l => Math.abs(l.endPoint.y - 2) < 1e-9)).toBe(
      true
    )

    t.controller.exitAll()
    expect(t.controller.isActive).toBe(false)
    expect(t.model()).toEqual([reference])
    // Nothing of the wall itself changed.
    expect([...wall.newIterator()]).toHaveLength(2)

    // One step takes the door back to what it was.
    expect(mockSessionUndo.kinds).toEqual(['db'])
    expect(t.db.transactionManager.undo()).toBe(true)
    expect(t.lines(t.door).every(l => l.startPoint.y === 0)).toBe(true)
    expect(t.db.transactionManager.canUndo()).toBe(false)
  })

  it('gives every placed symbol a property added inside, and takes away a removed one', () => {
    const t = setup()
    const first = t.place('DOOR', 100, 0)
    const second = t.place('DOOR', 300, 0, [2, 2])
    const space = t.db.tables.blockTable.modelSpace

    t.controller.enter(first.objectId)
    const definition = new AcDbAttributeDefinition()
    definition.tag = 'WIDTH'
    definition.prompt = 'Width'
    definition.textString = '800'
    definition.height = 2
    definition.position = new AcGePoint3d(101, 1, 0)
    definition.layer = '0'
    t.edit('AttDef', () => space.appendEntity(definition))
    t.controller.exit()

    for (const reference of [first, second]) {
      const attributes = [...reference.attributeIterator()]
      expect(attributes.map(a => [a.tag, a.textString])).toEqual([
        ['WIDTH', '800']
      ])
    }
    // Placed by each symbol: (1, 1) in the definition.
    const onSecond = [...second.attributeIterator()][0]
    expect(onSecond.position.x).toBeCloseTo(302)
    expect(onSecond.position.y).toBeCloseTo(2)
    expect(onSecond.height).toBeCloseTo(4)

    // Undo takes the property away from the symbols again.
    t.db.transactionManager.undo()
    expect([...first.attributeIterator()]).toHaveLength(0)
    t.db.transactionManager.redo()
    expect([...first.attributeIterator()]).toHaveLength(1)

    // Removing the definition removes the property everywhere.
    t.controller.enter(second.objectId)
    const shown = [...space.newIterator()].find(
      entity => entity instanceof AcDbAttributeDefinition
    )!
    t.edit('Erase', () => t.db.openEntityForWrite(shown)!.erase())
    t.controller.exit()
    expect([...first.attributeIterator()]).toHaveLength(0)
    expect([...second.attributeIterator()]).toHaveLength(0)
  })

  it('refuses what cannot be edited', () => {
    const t = setup()
    const blockTable = t.db.tables.blockTable
    const anonymous = new AcDbBlockTableRecord()
    anonymous.name = '*D1'
    blockTable.add(anonymous)
    anonymous.appendEntity(line(0, 0, 1, 0))
    const dimension = t.place('*D1', 0, 0)
    const flat = t.place('DOOR', 0, 0, [0, 0])
    const plain = line(0, 0, 1, 1)
    blockTable.modelSpace.appendEntity(plain)

    expect(t.controller.canEnter(dimension.objectId)).toBe(false)
    expect(t.controller.canEnter(flat.objectId)).toBe(false)
    expect(t.controller.canEnter(plain.objectId)).toBe(false)
    expect(t.controller.enter(dimension.objectId)).toBe(false)
    expect(t.messages).toEqual(['main.symbolEdit.notEditable'])

    // Read-only drawings cannot be edited at all.
    const door = t.place('DOOR', 5, 5)
    mockDoc.openMode = 0
    expect(t.controller.canEnter(door.objectId)).toBe(false)
    mockDoc.openMode = 8
    expect(t.controller.canEnter(door.objectId)).toBe(true)
  })

  it('ends before commands that read or replace the whole drawing', () => {
    const t = setup()
    const reference = t.place('DOOR', 0, 0)
    expect(t.controller.shouldExitBefore('cdxf')).toBe(false)
    t.controller.enter(reference.objectId)
    for (const name of ['cdxf', 'CJWW', '-cpdf', 'pngout', 'open', 'qnew']) {
      expect(t.controller.shouldExitBefore(name)).toBe(true)
    }
    for (const name of ['line', 'move', 'undo', 'zoom', 'layout', 'refclose']) {
      expect(t.controller.shouldExitBefore(name)).toBe(false)
    }
  })

  it('goes back to the layer that was current', () => {
    const t = setup()
    t.db.tables.layerTable.add(new AcDbLayerTableRecord({ name: 'WALLS' }))
    t.db.clayer = 'WALLS'
    const reference = t.place('DOOR', 0, 0)
    reference.layer = 'WALLS'
    t.controller.enter(reference.objectId)
    expect(t.db.clayer).toBe('0')
    t.controller.exit()
    expect(t.db.clayer).toBe('WALLS')
    expect(ACAP_SYMBOL_EDIT_UNDO_LABEL).toBe('SymbolEdit')
  })
})
