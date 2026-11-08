import {
  AcDbDatabase,
  acdbHostApplicationServices,
  AcDbLine,
  AcGePoint3d
} from '@mlightcad/data-model'

import {
  acapCanDeleteLayout,
  acapCopyLayout,
  acapCreateLayout,
  acapDeleteLayout,
  acapGetLayoutPageSetup,
  acapIsModelLayout,
  acapLayoutEvents,
  acapListLayouts,
  acapMoveLayout,
  acapNextLayoutName,
  acapRenameLayout,
  acapSetLayoutPageSetup,
  acapValidateLayoutName
} from '../src/app/AcApLayoutActions'

function drawing() {
  const db = new AcDbDatabase()
  db.createDefaultData()
  acdbHostApplicationServices().workingDatabase = db
  return db
}

const names = (db: AcDbDatabase) =>
  acapListLayouts(db).map(layout => layout.layoutName)

const paper = (db: AcDbDatabase) =>
  acapListLayouts(db).filter(layout => !acapIsModelLayout(db, layout))

describe('layout tab actions', () => {
  it('lists the model layout first', () => {
    const db = drawing()
    const layouts = acapListLayouts(db)
    expect(layouts.length).toBeGreaterThanOrEqual(2)
    expect(acapIsModelLayout(db, layouts[0])).toBe(true)
  })

  it('creates a layout at the end with its own paper space and A3 paper', () => {
    const db = drawing()
    const changed = jest.fn()
    acapLayoutEvents.layoutsChanged.addEventListener(changed)
    const before = names(db)
    const name = acapNextLayoutName(db, 'Sheet')
    expect(name).toBe('Sheet1')
    const layout = acapCreateLayout(db, name)
    acapLayoutEvents.layoutsChanged.removeEventListener(changed)

    expect(names(db)).toEqual([...before, 'Sheet1'])
    expect(changed).toHaveBeenCalled()
    const btr = db.tables.blockTable.getIdAt(layout.blockTableRecordId)
    expect(btr?.name.startsWith('*Paper_Space')).toBe(true)
    expect(btr?.layoutId).toBe(layout.objectId)
    expect(db.objects.layout.getAt('Sheet1')).toBe(layout)
    expect(acapGetLayoutPageSetup(layout)).toEqual({
      paper: 'A3',
      portrait: false
    })
    expect(paper(db).map(l => l.tabOrder)).toEqual(
      paper(db).map((_, i) => i + 1)
    )
  })

  it('validates names', () => {
    const db = drawing()
    const existing = paper(db)[0].layoutName
    expect(acapValidateLayoutName(db, '  ')).toBe('empty')
    expect(acapValidateLayoutName(db, 'a/b')).toBe('invalid')
    expect(acapValidateLayoutName(db, existing.toUpperCase())).toBe('exists')
    expect(acapValidateLayoutName(db, 'Model')).toBe('exists')
    expect(acapValidateLayoutName(db, 'New page')).toBeUndefined()
  })

  it('renames a layout and re-keys the dictionary', () => {
    const db = drawing()
    const layout = paper(db)[0]
    const oldName = layout.layoutName
    expect(acapRenameLayout(db, layout, '  Plan  ')).toBeUndefined()
    expect(layout.layoutName).toBe('Plan')
    expect(db.objects.layout.getAt('Plan')).toBe(layout)
    expect(db.objects.layout.has(oldName)).toBe(false)
    const other = acapCreateLayout(db, 'Other')
    expect(acapRenameLayout(db, other, 'plan')).toBe('exists')
    // Changing only the letter case of its own name is fine.
    expect(acapRenameLayout(db, layout, 'PLAN')).toBeUndefined()
    expect(db.objects.layout.getAt('PLAN')).toBe(layout)
    const model = acapListLayouts(db)[0]
    expect(acapRenameLayout(db, model, 'Canvas')).toBe('invalid')
  })

  it('copies a layout with its entities and page setup after the source', () => {
    const db = drawing()
    const source = paper(db)[0]
    acapSetLayoutPageSetup(db, source, { paper: 'A1', portrait: true })
    const btr = db.tables.blockTable.getIdAt(source.blockTableRecordId)!
    btr.appendEntity(
      new AcDbLine(new AcGePoint3d(0, 0, 0), new AcGePoint3d(10, 10, 0))
    )
    const copy = acapCopyLayout(db, source)
    expect(copy.layoutName).toBe(`${source.layoutName} (2)`)
    expect(copy.blockTableRecordId).not.toBe(source.blockTableRecordId)
    expect(paper(db).indexOf(copy)).toBe(paper(db).indexOf(source) + 1)
    expect(acapGetLayoutPageSetup(copy)).toEqual({
      paper: 'A1',
      portrait: true
    })
    const copied = [
      ...db.tables.blockTable.getIdAt(copy.blockTableRecordId)!.newIterator()
    ]
    expect(copied.filter(e => e instanceof AcDbLine)).toHaveLength(1)
    expect(copied[0]).not.toBe([...btr.newIterator()][0])
  })

  it('moves layouts and keeps tab orders contiguous', () => {
    const db = drawing()
    acapCreateLayout(db, 'B')
    acapCreateLayout(db, 'C')
    const before = paper(db).map(l => l.layoutName)
    const last = paper(db)[before.length - 1]
    expect(acapMoveLayout(db, last, 0)).toBe(true)
    expect(paper(db).map(l => l.layoutName)).toEqual([
      'C',
      ...before.slice(0, -1)
    ])
    expect(acapListLayouts(db).map(l => l.tabOrder)).toEqual(
      acapListLayouts(db).map((_, i) => i)
    )
    expect(acapMoveLayout(db, acapListLayouts(db)[0], 2)).toBe(false)
  })

  it('deletes a layout, switching away when it is current', () => {
    const db = drawing()
    while (paper(db).length > 1) acapDeleteLayout(db, paper(db)[1])
    const only = paper(db)[0]
    expect(acapCanDeleteLayout(db, only)).toBe(false)
    expect(acapDeleteLayout(db, only)).toBe(false)

    const second = acapCreateLayout(db, 'Second')
    acdbHostApplicationServices().layoutManager.setCurrentLayoutBtrId(
      second.blockTableRecordId,
      db
    )
    const btrId = second.blockTableRecordId
    expect(acapDeleteLayout(db, second)).toBe(true)
    expect(db.currentSpaceId).toBe(only.blockTableRecordId)
    expect(db.objects.layout.has('Second')).toBe(false)
    expect(db.tables.blockTable.getIdAt(btrId)).toBeUndefined()
    expect(acapCanDeleteLayout(db, acapListLayouts(db)[0])).toBe(false)
  })

  it('keeps the paper origin when changing the page setup', () => {
    const db = drawing()
    const layout = acapCreateLayout(db, 'P')
    acapSetLayoutPageSetup(db, layout, { paper: 'A4', portrait: true })
    expect(layout.limits.max.x - layout.limits.min.x).toBeCloseTo(210, 6)
    expect(layout.limits.max.y - layout.limits.min.y).toBeCloseTo(297, 6)
  })
})

describe('layout tab actions and DXF', () => {
  it('saves new, renamed and reordered layouts', async () => {
    const db = drawing()
    const first = paper(db)[0]
    acapRenameLayout(db, first, 'Renamed')
    const added = acapCreateLayout(db, 'Added')
    acapSetLayoutPageSetup(db, added, { paper: 'A4', portrait: true })
    acapMoveLayout(db, added, 0)
    const dxf = db.dxfOut() as string

    const reread = new AcDbDatabase()
    await reread.read(dxf, { readOnly: true })
    const layouts = acapListLayouts(reread).filter(
      layout => !acapIsModelLayout(reread, layout)
    )
    expect(layouts[0].layoutName).toBe('Added')
    expect(layouts.map(l => l.layoutName)).toContain('Renamed')
    expect(acapGetLayoutPageSetup(layouts[0])).toEqual({
      paper: 'A4',
      portrait: true
    })
  })
})
