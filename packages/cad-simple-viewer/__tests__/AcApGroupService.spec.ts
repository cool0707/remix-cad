import {
  AcDbDatabase,
  AcDbGroup,
  acdbHostApplicationServices,
  AcDbLine,
  AcGePoint3d
} from '@mlightcad/data-model'

import { AcApEntityService } from '../src/service/AcApEntityService'
import {
  acapBuildGroupTree,
  acapCreateGroup,
  acapExpandToGroups,
  acapIsGroupNameFree,
  acapRemoveGroups,
  acapRenameGroup,
  acapSetGroupMembers,
  acapSetGroupSelectable,
  acapSuggestGroupName
} from '../src/service/AcApGroupService'

function drawing() {
  const db = new AcDbDatabase()
  db.createDefaultData()
  acdbHostApplicationServices().workingDatabase = db
  return db
}

function lines(db: AcDbDatabase, count: number) {
  const ids: string[] = []
  for (let i = 0; i < count; i++) {
    const line = new AcDbLine(
      new AcGePoint3d(0, i, 0),
      new AcGePoint3d(1, i, 0)
    )
    db.tables.blockTable.modelSpace.appendEntity(line)
    ids.push(line.objectId)
  }
  return ids
}

describe('groups', () => {
  it('creates, renames and removes a group, each as one undo step', () => {
    const db = drawing()
    const [a, b] = lines(db, 2)
    const group = acapCreateGroup(db, [a, b], 'Window')!
    expect(group).toBeDefined()
    expect(db.objects.group.getAt('Window')).toBe(group)
    expect(acapIsGroupNameFree(db, 'window')).toBe(false)

    expect(acapRenameGroup(db, group.objectId, 'Door')).toBe(true)
    expect(db.objects.group.getAt('Window')).toBeUndefined()
    expect(db.objects.group.getAt('Door')?.objectId).toBe(group.objectId)

    db.transactionManager.undo()
    expect(db.objects.group.getAt('Window')?.objectId).toBe(group.objectId)
    db.transactionManager.redo()
    expect(db.objects.group.getAt('Door')).toBeDefined()

    expect(acapRemoveGroups(db, [group.objectId])).toBe(1)
    expect(db.objects.group.numEntries).toBe(0)
    db.transactionManager.undo()
    expect(db.objects.group.getAt('Door')?.entityIds).toEqual([a, b])
    db.transactionManager.undo()
    db.transactionManager.undo()
    expect(db.objects.group.numEntries).toBe(0)
  })

  it('suggests a free numbered name', () => {
    const db = drawing()
    const [a] = lines(db, 1)
    acapCreateGroup(db, [a], 'グループ1')
    expect(acapSuggestGroupName(db, 'グループ')).toBe('グループ2')
  })

  it('nests a group inside the group that holds all its members', () => {
    const db = drawing()
    const [a, b, c, d] = lines(db, 4)
    const inner = acapCreateGroup(db, [a, b], 'Inner')!
    const outer = acapCreateGroup(db, [a, b, c], 'Outer')!
    const other = acapCreateGroup(db, [d], 'Other')!

    const tree = acapBuildGroupTree(db)
    expect(tree.map(node => node.name)).toEqual(['Outer', 'Other'])
    const outerNode = tree[0]
    expect(outerNode.id).toBe(outer.objectId)
    expect(outerNode.children.map(node => node.id)).toEqual([inner.objectId])
    expect(outerNode.entityIds).toEqual([c])
    expect(outerNode.children[0].entityIds).toEqual([a, b])
    expect(tree[1].id).toBe(other.objectId)
  })

  it('picks the whole group, and a group inside another picks the outer one', () => {
    const db = drawing()
    const [a, b, c, d] = lines(db, 4)
    acapCreateGroup(db, [a, b], 'Inner')
    const outer = acapCreateGroup(db, [a, b, c], 'Outer')!
    expect(acapExpandToGroups(db, [a]).sort()).toEqual([a, b, c].sort())
    expect(acapExpandToGroups(db, [d])).toEqual([d])

    acapSetGroupSelectable(db, outer.objectId, false)
    expect(acapExpandToGroups(db, [c])).toEqual([c])
    expect(acapExpandToGroups(db, [a]).sort()).toEqual([a, b].sort())
  })

  it('adds and removes members', () => {
    const db = drawing()
    const [a, b, c] = lines(db, 3)
    const group = acapCreateGroup(db, [a], 'G')!
    expect(acapSetGroupMembers(db, group.objectId, [b, c], [a])).toBe(true)
    expect(db.objects.group.getAt('G')?.entityIds).toEqual([b, c])
    db.transactionManager.undo()
    expect(db.objects.group.getAt('G')?.entityIds).toEqual([a])
  })

  it('leaves erased members out of the tree and of the saved file', async () => {
    const db = drawing()
    const [a, b, c] = lines(db, 3)
    acapCreateGroup(db, [a, b], 'Pair')
    acapCreateGroup(db, [c], 'Single')
    new AcApEntityService(db).eraseEntities([b, c])

    const tree = acapBuildGroupTree(db)
    expect(tree.map(node => node.name)).toEqual(['Pair'])
    expect(tree[0].memberIds).toEqual([a])

    const reread = new AcDbDatabase()
    await reread.read(db.dxfOut() as string, { readOnly: true })
    expect(reread.objects.group.getAt('Pair')?.entityIds).toEqual([a])
  })

  it('reads the group name from the group dictionary, not the description', async () => {
    const db = drawing()
    const [a, b] = lines(db, 2)
    const first = new AcDbGroup()
    first.name = 'same description'
    first.entityIds = [a]
    const second = new AcDbGroup()
    second.name = 'same description'
    second.entityIds = [b]
    db.transactionManager.runUndoable('test', () => {
      db.objects.group.setAt('窓', first)
      db.objects.group.setAt('扉', second)
    })

    const reread = new AcDbDatabase()
    await reread.read(db.dxfOut() as string, { readOnly: true })
    expect(reread.objects.group.getAt('窓')?.entityIds).toEqual([a])
    expect(reread.objects.group.getAt('扉')?.entityIds).toEqual([b])
    expect(reread.objects.group.getAt('窓')?.name).toBe('same description')
  })
})
