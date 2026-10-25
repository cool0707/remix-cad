import {
  AcDbDatabase,
  AcDbLayerTableRecord,
  AcDbLayerTableRecordAttrs
} from '@mlightcad/data-model'

import { acapRunDatabaseEdit } from '../util/AcApDatabaseEdit'

/** Default undo label for layer table edits. */
export const LAYER_EDIT_LABEL = 'Layer'

/** Default undo label for entity edits outside commands. */
export const ENTITY_EDIT_LABEL = 'Entity'

/**
 * Runs a database mutation with undo support when not already inside a command transaction.
 *
 * When a command has started an undo transaction via {@link AcEdCommand.trigger},
 * the callback runs directly to avoid nested undo marks; for layer edits the
 * changed layers are reported (`layerModified`) right away.
 *
 * @param db - Database to mutate.
 * @param label - Undo group label shown in the undo stack.
 * @param fn - Mutation callback.
 * @returns The value returned by `fn`.
 */
export function acapRunServiceEdit<T>(
  db: AcDbDatabase,
  label: string,
  fn: () => T
): T {
  if (db.transactionManager?.hasTransaction()) {
    if (label !== LAYER_EDIT_LABEL) return fn()
    // A command's transaction reports layer changes only when it commits, so
    // a layer shown / hidden from the layer panel mid-command (MOVE, LINE...)
    // would not reach the view until the command ends. Report them now; the
    // commit reports them again, which is harmless.
    const before = snapshotLayers(db)
    const result = fn()
    dispatchChangedLayers(db, before)
    return result
  }

  if (typeof db.runDatabaseEdit !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[cad-simple-viewer] acapRunServiceEdit("${label}"): database.runDatabaseEdit is unavailable; mutation ran without undo support.`
      )
    }
    return fn()
  }

  let result!: T
  acapRunDatabaseEdit(db, label, () => {
    result = fn()
  })
  return result
}

/** Layer fields the view and the layer panel react to. */
type AcApLayerSnapshot = Pick<
  AcDbLayerTableRecordAttrs,
  'isOff' | 'standardFlags' | 'linetype' | 'lineWeight' | 'isPlottable'
> & { color: string; transparency: string }

function snapshotLayer(layer: AcDbLayerTableRecord): AcApLayerSnapshot {
  return {
    isOff: layer.isOff,
    standardFlags: layer.standardFlags,
    linetype: layer.linetype,
    lineWeight: layer.lineWeight,
    isPlottable: layer.isPlottable,
    color: layer.color.toString(),
    transparency: layer.transparency.toString()
  }
}

function snapshotLayers(db: AcDbDatabase) {
  const snapshots = new Map<AcDbLayerTableRecord, AcApLayerSnapshot>()
  for (const layer of db.tables.layerTable.newIterator()) {
    snapshots.set(layer, snapshotLayer(layer))
  }
  return snapshots
}

/** Dispatches `layerModified` for every layer that differs from `before`. */
function dispatchChangedLayers(
  db: AcDbDatabase,
  before: Map<AcDbLayerTableRecord, AcApLayerSnapshot>
) {
  for (const [layer, old] of before) {
    const now = snapshotLayer(layer)
    const changes: Partial<AcDbLayerTableRecordAttrs> = {}
    if (now.isOff !== old.isOff) changes.isOff = layer.isOff
    if (now.standardFlags !== old.standardFlags) {
      changes.standardFlags = layer.standardFlags
    }
    if (now.linetype !== old.linetype) changes.linetype = layer.linetype
    if (now.lineWeight !== old.lineWeight) changes.lineWeight = layer.lineWeight
    if (now.isPlottable !== old.isPlottable) {
      changes.isPlottable = layer.isPlottable
    }
    if (now.color !== old.color) changes.color = layer.color
    if (now.transparency !== old.transparency) {
      changes.transparency = layer.transparency
    }
    if (Object.keys(changes).length > 0) {
      db.events.layerModified.dispatch({ database: db, layer, changes })
    }
  }
}
