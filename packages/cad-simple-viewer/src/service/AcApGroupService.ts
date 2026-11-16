import {
  AcDbDatabase,
  AcDbEntity,
  AcDbGroup,
  AcDbObjectId
} from '@mlightcad/data-model'

import { acapRunServiceEdit } from './AcApServiceEdit'

/** Undo label of group edits. */
export const GROUP_EDIT_LABEL = 'Group'

/**
 * A group as the group panel shows it.
 *
 * Groups are the drawing's GROUP objects (the `ACAD_GROUP` dictionary), so
 * they are saved to DXF / DWG and read back from files made by other CAD
 * programs. A GROUP only lists entities; the tree comes from containment:
 * a group whose members are all in another group is shown inside it (as
 * AutoCAD does with "nested" groups).
 */
export interface AcApGroupNode {
  /** Object id of the GROUP */
  id: AcDbObjectId
  /** Name (the key in the `ACAD_GROUP` dictionary) */
  name: string
  /** Description (group code 300), may be empty */
  description: string
  /** An unnamed group (`*A1` ...), made by copying a group in AutoCAD */
  unnamed: boolean
  /** Picking one member selects the whole group */
  selectable: boolean
  /** Members that still exist in the drawing, in the group's order */
  memberIds: AcDbObjectId[]
  /** Groups shown inside this one */
  children: AcApGroupNode[]
  /** Members not in any of the {@link children} */
  entityIds: AcDbObjectId[]
}

/** Entries of the group dictionary: `[name, group]`. */
function groupEntries(db: AcDbDatabase): [string, AcDbGroup][] {
  return [...db.objects.group.entries()]
}

/** Whether the entity exists (not erased) in the drawing. */
function entityExists(db: AcDbDatabase, id: AcDbObjectId) {
  const entity = db.tables.blockTable.getEntityById(id)
  return !!entity && !(entity as AcDbEntity & { isErased?: boolean }).isErased
}

/** Members of a group that still exist. */
export function acapGroupMemberIds(
  db: AcDbDatabase,
  group: AcDbGroup
): AcDbObjectId[] {
  const seen = new Set<AcDbObjectId>()
  const ids: AcDbObjectId[] = []
  for (const id of group.entityIds) {
    if (seen.has(id) || !entityExists(db, id)) continue
    seen.add(id)
    ids.push(id)
  }
  return ids
}

/** Finds a group by its object id. */
export function acapFindGroup(
  db: AcDbDatabase,
  groupId: AcDbObjectId
): { name: string; group: AcDbGroup } | undefined {
  for (const [name, group] of groupEntries(db)) {
    if (group.objectId === groupId) return { name, group }
  }
  return undefined
}

/**
 * The groups of the drawing as a tree. Groups whose members were all erased
 * are left out (they come back when the erase is undone).
 *
 * A group is placed under the smallest group that holds all its members
 * (when two groups have the same members, the later one goes inside the
 * earlier one). Groups that only share some members stay side by side, and
 * the shared entities are listed in both.
 */
export function acapBuildGroupTree(db: AcDbDatabase): AcApGroupNode[] {
  const nodes: AcApGroupNode[] = []
  for (const [name, group] of groupEntries(db)) {
    const memberIds = acapGroupMemberIds(db, group)
    if (memberIds.length === 0) continue
    nodes.push({
      id: group.objectId,
      name,
      description: group.name ?? '',
      unnamed: group.unnamed || name.startsWith('*'),
      selectable: group.selectable,
      memberIds,
      children: [],
      entityIds: []
    })
  }

  const sets = nodes.map(node => new Set(node.memberIds))
  const contains = (outer: number, inner: number) => {
    const a = sets[outer]
    const b = sets[inner]
    if (b.size > a.size) return false
    if (b.size === a.size && inner < outer) return false
    for (const id of b) if (!a.has(id)) return false
    return true
  }

  const roots: AcApGroupNode[] = []
  nodes.forEach((node, index) => {
    let parent = -1
    nodes.forEach((_, other) => {
      if (other === index || !contains(other, index)) return
      if (
        parent < 0 ||
        sets[other].size < sets[parent].size ||
        (sets[other].size === sets[parent].size && other > parent)
      ) {
        parent = other
      }
    })
    if (parent >= 0) nodes[parent].children.push(node)
    else roots.push(node)
  })

  for (const node of nodes) {
    const inChildren = new Set<AcDbObjectId>()
    node.children.forEach(child =>
      child.memberIds.forEach(id => inChildren.add(id))
    )
    node.entityIds = node.memberIds.filter(id => !inChildren.has(id))
  }
  return roots
}

/** Names of the groups (the `ACAD_GROUP` keys), in upper case. */
function usedNames(db: AcDbDatabase) {
  return new Set(groupEntries(db).map(([name]) => name.toUpperCase()))
}

/**
 * A free group name: `prefix` + the next number (`グループ1`, `グループ2` ...).
 *
 * @param db - Drawing.
 * @param prefix - Localized prefix (`main.group.namePrefix`).
 */
export function acapSuggestGroupName(db: AcDbDatabase, prefix: string) {
  const used = usedNames(db)
  let index = 1
  while (used.has(`${prefix}${index}`.toUpperCase())) index++
  return `${prefix}${index}`
}

/** Whether a name can be given to a group (not empty, not taken). */
export function acapIsGroupNameFree(
  db: AcDbDatabase,
  name: string,
  exceptId?: AcDbObjectId
) {
  const trimmed = name.trim()
  if (!trimmed || trimmed.startsWith('*')) return false
  for (const [key, group] of groupEntries(db)) {
    if (group.objectId === exceptId) continue
    if (key.toUpperCase() === trimmed.toUpperCase()) return false
  }
  return true
}

/**
 * Groups the entities into a new group (one undo step).
 *
 * @param db - Drawing.
 * @param entityIds - Members. Members of other groups stay in them, so
 *   grouping whole groups again nests them.
 * @param name - Name; must be free (see {@link acapIsGroupNameFree}).
 * @returns The new group, or `undefined` when nothing could be grouped.
 */
export function acapCreateGroup(
  db: AcDbDatabase,
  entityIds: AcDbObjectId[],
  name: string
): AcDbGroup | undefined {
  const ids = [...new Set(entityIds)].filter(id => entityExists(db, id))
  const key = name.trim()
  if (ids.length === 0 || !acapIsGroupNameFree(db, key)) return undefined
  const group = new AcDbGroup()
  group.entityIds = ids
  group.selectable = true
  acapRunServiceEdit(db, GROUP_EDIT_LABEL, () => {
    db.objects.group.setAt(key, group)
  })
  return group
}

/**
 * Removes groups (the entities stay). One undo step.
 *
 * @returns Number of groups removed.
 */
export function acapRemoveGroups(
  db: AcDbDatabase,
  groupIds: AcDbObjectId[]
): number {
  const found = groupIds
    .map(id => acapFindGroup(db, id))
    .filter((entry): entry is { name: string; group: AcDbGroup } => !!entry)
  if (found.length === 0) return 0
  acapRunServiceEdit(db, GROUP_EDIT_LABEL, () => {
    for (const { name } of found) db.objects.group.remove(name)
  })
  return found.length
}

/**
 * Renames a group. The name is the dictionary key, so the entry is moved
 * to the new key (the GROUP object and its handle stay).
 *
 * @returns Whether the group was renamed.
 */
export function acapRenameGroup(
  db: AcDbDatabase,
  groupId: AcDbObjectId,
  newName: string
): boolean {
  const found = acapFindGroup(db, groupId)
  const key = newName.trim()
  if (!found) return false
  if (found.name === key) return true
  if (!acapIsGroupNameFree(db, key, groupId)) return false
  acapRunServiceEdit(db, GROUP_EDIT_LABEL, () => {
    // Removing releases the handle, so the same object keeps it when added
    // under the new key.
    db.objects.group.remove(found.name)
    db.objects.group.setAt(key, found.group)
  })
  return true
}

/**
 * Adds entities to a group, or removes them from it. One undo step.
 *
 * @returns Whether the group changed.
 */
export function acapSetGroupMembers(
  db: AcDbDatabase,
  groupId: AcDbObjectId,
  add: AcDbObjectId[],
  remove: AcDbObjectId[] = []
): boolean {
  const found = acapFindGroup(db, groupId)
  if (!found) return false
  const removed = new Set(remove)
  const current = acapGroupMemberIds(db, found.group)
  const next = current.filter(id => !removed.has(id))
  for (const id of add) {
    if (!next.includes(id) && entityExists(db, id)) next.push(id)
  }
  if (
    next.length === current.length &&
    next.every((id, index) => id === current[index])
  ) {
    return false
  }
  acapRunServiceEdit(db, GROUP_EDIT_LABEL, () => {
    const group =
      (db.openObjectForWrite?.(groupId) as AcDbGroup | undefined) ?? found.group
    group.entityIds = next
  })
  return true
}

/** Whether the group selects as a whole. One undo step. */
export function acapSetGroupSelectable(
  db: AcDbDatabase,
  groupId: AcDbObjectId,
  selectable: boolean
): boolean {
  const found = acapFindGroup(db, groupId)
  if (!found || found.group.selectable === selectable) return false
  acapRunServiceEdit(db, GROUP_EDIT_LABEL, () => {
    const group =
      (db.openObjectForWrite?.(groupId) as AcDbGroup | undefined) ?? found.group
    group.selectable = selectable
  })
  return true
}

/**
 * Groups that hold an entity, outermost first (the selectable ones only
 * when `selectableOnly`).
 */
export function acapGroupsOfEntity(
  db: AcDbDatabase,
  entityId: AcDbObjectId,
  selectableOnly = false
): AcApGroupNode[] {
  const result: AcApGroupNode[] = []
  const visit = (nodes: AcApGroupNode[]) => {
    for (const node of nodes) {
      if (!node.memberIds.includes(entityId)) continue
      if (!selectableOnly || node.selectable) result.push(node)
      visit(node.children)
    }
  }
  visit(acapBuildGroupTree(db))
  return result
}

/** Whether some of the entities belong to a group. */
export function acapIsAnyGrouped(
  db: AcDbDatabase,
  ids: AcDbObjectId[]
): boolean {
  if (ids.length === 0 || db.objects.group.numEntries === 0) return false
  const members = new Set<AcDbObjectId>()
  for (const [, group] of groupEntries(db)) {
    group.entityIds.forEach(id => members.add(id))
  }
  return ids.some(id => members.has(id))
}

/**
 * Picking: the ids plus every member of the selectable groups that hold
 * them (a click on one line of a group selects the group). Groups inside
 * other groups come along with the outer one.
 *
 * @returns The ids unchanged when no group is involved.
 */
export function acapExpandToGroups(
  db: AcDbDatabase,
  ids: AcDbObjectId[]
): AcDbObjectId[] {
  if (ids.length === 0 || db.objects.group.numEntries === 0) return ids
  const memberGroups: (readonly AcDbObjectId[])[] = []
  for (const [, group] of groupEntries(db)) {
    if (!group.selectable || group.entityIds.length === 0) continue
    memberGroups.push(group.entityIds)
  }
  if (memberGroups.length === 0) return ids

  const result = [...ids]
  const seen = new Set(ids)
  // Repeat until nothing is added: overlapping groups chain together.
  let added = true
  while (added) {
    added = false
    for (const members of memberGroups) {
      if (!members.some(id => seen.has(id))) continue
      for (const id of members) {
        if (seen.has(id) || !entityExists(db, id)) continue
        seen.add(id)
        result.push(id)
        added = true
      }
    }
  }
  return result
}
