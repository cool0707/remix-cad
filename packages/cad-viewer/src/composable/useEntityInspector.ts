import {
  AcApDocManager,
  AcApLayerService,
  acapRunDatabaseEdit,
  AcEdOpenMode,
  eventBus
} from '@mlightcad/cad-simple-viewer'
import {
  AcDbBlockReference,
  AcDbDatabase,
  AcDbEntity,
  AcDbObjectId,
  AcDbSysVarManager,
  AcGeMatrix3d
} from '@mlightcad/data-model'
import { computed, onMounted, onUnmounted, type Ref, ref } from 'vue'

import {
  boxFieldTransform,
  buildInspectorGroups,
  buildSymbolPropertyRows,
  collectSymbolContentLayers,
  type MlAnchor,
  type MlBox2d,
  type MlBoxField,
  type MlInspectorRow,
  type MlInspectorSymbol,
  type MlLayeredEntity,
  normalizeTag,
  summarizeSelection,
  toStoredValue
} from './entityInspector'
import {
  findAttributePrompt,
  listBlockAttributes,
  openAttributeForWrite
} from './useAttEdit'

/**
 * Symbol property field the inspector should focus (set by a double-click on
 * a symbol in the simple selection style). Cleared by the inspector once the
 * field is focused.
 */
export const pendingSymbolPropertyFocus = ref<{
  objectId: AcDbObjectId
  tag?: string
} | null>(null)

function isBlockReference(entity: AcDbEntity): entity is AcDbBlockReference {
  if (entity instanceof AcDbBlockReference) return true
  const maybe = entity as AcDbBlockReference
  return (
    maybe.type === 'BlockReference' &&
    typeof maybe.attributeIterator === 'function'
  )
}

/** Adapts an INSERT to the minimal shape used by the pure helpers. */
export function toInspectorSymbol(
  blockRef: AcDbBlockReference
): MlInspectorSymbol {
  return {
    blockName: blockRef.blockName,
    attributes: listBlockAttributes(blockRef).map(attr => ({
      tag: attr.tag || '',
      textString: attr.textString ?? '',
      isConst: !!attr.isConst,
      isInvisible: !!attr.isInvisible
    })),
    promptOf: tag => findAttributePrompt(blockRef, tag)
  }
}

function finiteBox(entity: AcDbEntity): MlBox2d | undefined {
  try {
    const box = entity.geometricExtents
    if (!box || box.isEmpty()) return undefined
    const { min, max } = box
    if (![min.x, min.y, max.x, max.y].every(Number.isFinite)) return undefined
    // Rays and construction lines report huge extents; leave them out.
    const LIMIT = 1e15
    if ([min.x, min.y, max.x, max.y].some(v => Math.abs(v) > LIMIT)) {
      return undefined
    }
    return { minX: min.x, minY: min.y, maxX: max.x, maxY: max.y }
  } catch {
    return undefined
  }
}

function unionBoxes(entities: AcDbEntity[]): MlBox2d | undefined {
  let result: MlBox2d | undefined
  for (const entity of entities) {
    const box = finiteBox(entity)
    if (!box) continue
    result = result
      ? {
          minX: Math.min(result.minX, box.minX),
          minY: Math.min(result.minY, box.minY),
          maxX: Math.max(result.maxX, box.maxX),
          maxY: Math.max(result.maxY, box.maxY)
        }
      : box
  }
  return result
}

function cloneValue(value: unknown) {
  const maybe = value as { clone?: () => unknown } | null
  return maybe && typeof maybe.clone === 'function' ? maybe.clone() : value
}

/**
 * State and edit actions of the property inspector for the current
 * selection.
 *
 * Every edit is one undo step, skips entities on locked layers and refreshes
 * the inspector (also after undo / redo and other edits).
 */
export function useEntityInspector(selectionIds: Ref<AcDbObjectId[]>) {
  /** Bumped whenever entity values may have changed. */
  const revision = ref(0)
  const refresh = () => {
    revision.value++
  }

  // LUPREC / AUPREC are not undoable edits, so watch them separately.
  const onSysVarChanged = (args: { name: string }) => {
    const name = args.name.toUpperCase()
    if (name === 'LUPREC' || name === 'AUPREC') refresh()
  }
  onMounted(() => {
    eventBus.on('undo-stack-changed', refresh)
    AcDbSysVarManager.instance().events.sysVarChanged.addEventListener(
      onSysVarChanged
    )
  })
  onUnmounted(() => {
    eventBus.off('undo-stack-changed', refresh)
    AcDbSysVarManager.instance().events.sysVarChanged.removeEventListener(
      onSysVarChanged
    )
  })

  const getDb = (): AcDbDatabase | undefined =>
    AcApDocManager.instance?.curDocument?.database

  const entities = computed<AcDbEntity[]>(() => {
    revision.value
    const db = getDb()
    if (!db) return []
    const blockTable = db.tables.blockTable
    const list: AcDbEntity[] = []
    for (const id of selectionIds.value) {
      // getEntityById works for entities in model space and paper space.
      const entity = blockTable.getEntityById(id)
      if (entity) list.push(entity)
    }
    return list
  })

  const readOnlyDocument = computed(() => {
    revision.value
    const doc = AcApDocManager.instance?.curDocument
    return !doc || doc.openMode < AcEdOpenMode.Write
  })

  /**
   * Display precision of the drawing (LUPREC / AUPREC, set in the drawing
   * units dialog).
   */
  const precision = computed(() => {
    revision.value
    const db = getDb()
    const clamp = (value: unknown, fallback: number) => {
      const n = Number(value)
      return Number.isFinite(n)
        ? Math.min(Math.max(Math.round(n), 0), 8)
        : fallback
    }
    return {
      length: clamp(db?.luprec, 4),
      angle: clamp(db?.auprec, 0)
    }
  })

  const lockedFlags = computed(() => {
    const db = getDb()
    return entities.value.map(entity =>
      db ? AcApLayerService.isEntityOnLockedLayer(db, entity) : false
    )
  })

  /** `true` when nothing in the selection can be edited. */
  const allLocked = computed(
    () =>
      readOnlyDocument.value ||
      (lockedFlags.value.length > 0 && lockedFlags.value.every(Boolean))
  )
  /** `true` when only part of the selection is on locked layers. */
  const someLocked = computed(
    () => !allLocked.value && lockedFlags.value.some(Boolean)
  )

  const groups = computed(() =>
    buildInspectorGroups(entities.value.map(entity => entity.properties))
  )

  const symbols = computed(() => {
    const list = entities.value
    if (!list.length || !list.every(isBlockReference)) return []
    return list as AcDbBlockReference[]
  })

  const symbolPropertyRows = computed(() =>
    buildSymbolPropertyRows(symbols.value.map(toInspectorSymbol))
  )

  /**
   * Layers the selected symbols' contents are drawn on (they decide whether
   * the parts are shown, not the symbol's own layer).
   */
  const symbolContentLayers = computed(() =>
    collectSymbolContentLayers(symbols.value as unknown as MlLayeredEntity[])
  )

  const summary = computed(() => summarizeSelection(entities.value))

  const box = computed(() => unionBoxes(entities.value))

  const editableEntities = (db: AcDbDatabase) =>
    entities.value.filter(
      entity => !AcApLayerService.isEntityOnLockedLayer(db, entity)
    )

  /** Writes a common property to every (unlocked) selected entity. */
  function setProperty(row: MlInspectorRow, newValue: unknown) {
    const db = getDb()
    if (!db || allLocked.value || !row.editable) return
    const stored = toStoredValue(row, newValue)
    const targets = editableEntities(db)
    if (!targets.length) return
    acapRunDatabaseEdit(db, 'Edit Properties', () => {
      for (const entity of targets) {
        const opened = db.openEntityForWrite(entity)
        if (!opened) continue
        const prop = opened.properties.groups
          .find(group => group.groupName === row.sourceGroup)
          ?.properties.find(item => item.name === row.name)
        prop?.accessor.set?.(cloneValue(stored))
      }
    })
    refresh()
  }

  /** Writes a symbol property (attribute value) to every selected symbol. */
  function setSymbolProperty(tagKey: string, value: string) {
    const db = getDb()
    if (!db || allLocked.value) return
    const targets = symbols.value.filter(
      symbol => !AcApLayerService.isEntityOnLockedLayer(db, symbol)
    )
    if (!targets.length) return
    acapRunDatabaseEdit(db, 'Edit Attributes', () => {
      for (const blockRef of targets) {
        for (const attr of listBlockAttributes(blockRef)) {
          if (normalizeTag(attr.tag || '') !== tagKey || attr.isConst) continue
          const opened = openAttributeForWrite(db, blockRef, attr)
          if (!opened) continue
          opened.textString = value
          if (opened.isMTextAttribute && opened.mtext) {
            opened.mtext.contents = value
          }
        }
      }
    })
    // Attributes are drawn inside the INSERT; rebuild the owning symbols.
    const view = AcApDocManager.instance?.curView
    targets.forEach(blockRef => view?.updateEntity(blockRef))
    refresh()
  }

  /** Moves or scales the selection so that one box field gets `value`. */
  function setBoxField(anchor: MlAnchor, field: MlBoxField, value: number) {
    const db = getDb()
    const doc = AcApDocManager.instance?.curDocument
    const current = box.value
    if (!db || !doc || !current || allLocked.value) return
    const transform = boxFieldTransform(current, anchor, field, value)
    if (!transform) return
    const matrix =
      transform.kind === 'translate'
        ? new AcGeMatrix3d().makeTranslation(transform.dx, transform.dy, 0)
        : new AcGeMatrix3d()
            .makeTranslation(transform.baseX, transform.baseY, 0)
            .multiply(
              new AcGeMatrix3d().makeScale(
                transform.factor,
                transform.factor,
                transform.factor
              )
            )
            .multiply(
              new AcGeMatrix3d().makeTranslation(
                -transform.baseX,
                -transform.baseY,
                0
              )
            )
    const service = doc.entityService
    service.runEdit('Edit Selection', () =>
      service.transformEntities(entities.value, matrix)
    )
    refresh()
  }

  /** Narrows the selection to the entities of one type. */
  function selectOnlyType(type: string) {
    const selectionSet = AcApDocManager.instance?.curView?.selectionSet
    if (!selectionSet) return
    const ids = entities.value
      .filter(entity => entity.type === type)
      .map(entity => entity.objectId)
    selectionSet.clear()
    selectionSet.add(ids)
  }

  return {
    revision,
    refresh,
    entities,
    groups,
    symbols,
    symbolPropertyRows,
    symbolContentLayers,
    summary,
    box,
    precision,
    allLocked,
    someLocked,
    setProperty,
    setSymbolProperty,
    setBoxField,
    selectOnlyType
  }
}
