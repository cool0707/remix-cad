import {
  AcDbDatabase,
  AcDbEntity,
  AcDbLayerTableRecord,
  AcDbObjectId
} from '@mlightcad/data-model'

import { LAYER_LOCKED_FLAG } from './types'

/**
 * `@mlightcad/data-model` ORs `isLocked = false` with 0, so bit 4 stays set.
 * Replace the setter until the data-model release clears the bit itself.
 */
function installIsLockedSetterFix(): void {
  const proto = AcDbLayerTableRecord.prototype
  const desc = Object.getOwnPropertyDescriptor(proto, 'isLocked')
  if (!desc?.get || !desc.set || desc.configurable === false) return

  Object.defineProperty(proto, 'isLocked', {
    configurable: true,
    enumerable: desc.enumerable ?? false,
    get: desc.get,
    set(this: AcDbLayerTableRecord, value: boolean) {
      const flags = this.standardFlags ?? 0
      this.standardFlags = value
        ? flags | LAYER_LOCKED_FLAG
        : flags & ~LAYER_LOCKED_FLAG
    }
  })
}

installIsLockedSetterFix()

/**
 * Entities that may be edited while the edit scope of a database is narrowed
 * (symbol editing: only what is inside the symbol). Keyed by database so a
 * parked document keeps its own scope.
 */
const editScopes = new WeakMap<
  AcDbDatabase,
  (objectId: AcDbObjectId) => boolean
>()

/**
 * Narrows what can be selected and edited in `db` to the entities `inScope`
 * accepts; everything else is treated like an entity on a locked layer
 * (visible, snappable, not editable). Pass `undefined` to lift the limit.
 */
export function acapSetEntityEditScope(
  db: AcDbDatabase,
  inScope: ((objectId: AcDbObjectId) => boolean) | undefined
): void {
  if (inScope) editScopes.set(db, inScope)
  else editScopes.delete(db)
}

/** Returns whether the entity is outside the narrowed edit scope of `db`. */
export function isEntityOutsideEditScope(
  db: AcDbDatabase | undefined,
  entity: { objectId?: AcDbObjectId } | undefined | null
): boolean {
  if (!db || !entity) return false
  const inScope = editScopes.get(db)
  if (!inScope) return false
  let objectId: AcDbObjectId | undefined
  try {
    objectId = entity.objectId
  } catch {
    return false
  }
  return !!objectId && !inScope(objectId)
}

/**
 * Returns whether an entity's layer is locked, or the entity is outside the
 * narrowed edit scope (see {@link acapSetEntityEditScope}).
 *
 * Missing entities or layer records are treated as unlocked.
 *
 * @param db - Drawing database that owns the layer table.
 * @param entity - Entity whose layer name is checked.
 */
export function isEntityOnLockedLayer(
  db: AcDbDatabase | undefined,
  entity:
    | (Pick<AcDbEntity, 'layer'> & { objectId?: AcDbObjectId })
    | undefined
    | null
): boolean {
  if (isEntityOutsideEditScope(db, entity)) return true
  const layerName = entity?.layer
  if (!db || !layerName) return false
  const layer = db.tables?.layerTable?.getAt(layerName)
  if (!layer) return false
  return ((layer.standardFlags ?? 0) & LAYER_LOCKED_FLAG) !== 0
}

/**
 * Drops ids whose entities sit on a locked layer.
 *
 * Ids that cannot be resolved are kept so callers can still report them as missing.
 *
 * @param db - Drawing database used to resolve entities and layers.
 * @param ids - Candidate entity ids.
 */
export function excludeLockedLayerIds(
  db: AcDbDatabase | undefined,
  ids: AcDbObjectId[]
): { ids: AcDbObjectId[]; lockedCount: number } {
  if (!db || ids.length === 0) return { ids, lockedCount: 0 }
  const blockTable = db.tables?.blockTable
  if (!blockTable?.getEntityById) return { ids, lockedCount: 0 }

  const kept: AcDbObjectId[] = []
  let lockedCount = 0
  for (const id of ids) {
    const entity = blockTable.getEntityById(id)
    // Outside the edit scope: dropped without counting, so that clicking
    // the dimmed surroundings of a symbol does not report a locked layer.
    if (entity && isEntityOutsideEditScope(db, entity)) continue
    if (entity && isEntityOnLockedLayer(db, entity)) {
      lockedCount++
      continue
    }
    kept.push(id)
  }
  return { ids: kept, lockedCount }
}
