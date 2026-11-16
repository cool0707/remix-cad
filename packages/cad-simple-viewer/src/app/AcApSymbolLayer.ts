import {
  AcCmColor,
  AcCmColorMethod,
  AcDbDatabase,
  AcDbLayerTableRecord,
  AcDbObjectId,
  AcDbViewport
} from '@mlightcad/data-model'

import { LAYER_FROZEN_FLAG, LAYER_LOCKED_FLAG } from '../service/types'

/**
 * Layer 0. Inside a symbol, entities on it take the layer the symbol is
 * placed on, so the simple profile presents it as the "symbol editing
 * layer": listed while a symbol is edited, and otherwise only when the
 * drawing already has entities on it outside of any symbol.
 */
export const ACAP_SYMBOL_LAYER = '0'

/**
 * Whether the drawing has entities on layer 0 that are not part of a
 * symbol: directly on the canvas or on a print page.
 *
 * Viewports do not count: every print page has them, usually on layer 0.
 *
 * @param db - Drawing to look at.
 * @param ignore - Entities to leave out (the copies shown while a symbol is
 *   edited sit on the canvas, but belong to the symbol).
 */
export function acapHasLooseEntitiesOnSymbolLayer(
  db: AcDbDatabase,
  ignore?: (objectId: AcDbObjectId) => boolean
): boolean {
  for (const record of db.tables.blockTable.newIterator()) {
    if (!record.isModelSapce && !record.isPaperSapce) continue
    for (const entity of record.newIterator()) {
      if (entity.layer !== ACAP_SYMBOL_LAYER) continue
      if (entity instanceof AcDbViewport) continue
      if (ignore?.(entity.objectId)) continue
      return true
    }
  }
  return false
}

/** How the simple profile shows layer 0 in layer lists. */
export interface AcApSymbolLayerState {
  /** Whether layer 0 appears in layer lists at all. */
  listed: boolean
  /**
   * Whether to warn that the layer holds entities outside of any symbol
   * (listed for that reason, not because a symbol is being edited).
   */
  warning: boolean
}

/**
 * Decides how the simple profile shows layer 0.
 *
 * @param db - Drawing to look at.
 * @param editing - Whether a symbol is being edited.
 * @param ignore - See {@link acapHasLooseEntitiesOnSymbolLayer}.
 */
export function acapSymbolLayerState(
  db: AcDbDatabase,
  editing: boolean,
  ignore?: (objectId: AcDbObjectId) => boolean
): AcApSymbolLayerState {
  const loose = acapHasLooseEntitiesOnSymbolLayer(db, ignore)
  return { listed: editing || loose, warning: loose }
}

/** Whether new entities can be drawn on the layer and seen. */
function isDrawable(layer: AcDbLayerTableRecord) {
  const flags = layer.standardFlags ?? 0
  return (
    !layer.isOff &&
    (flags & LAYER_FROZEN_FLAG) === 0 &&
    (flags & LAYER_LOCKED_FLAG) === 0
  )
}

/**
 * Moves the current layer off layer 0 when layer 0 is not listed, so that
 * what is drawn on the canvas does not land on a layer the user cannot see
 * in the layer list. Takes the first other layer that is shown and unlocked;
 * a drawing without one gets a new layer.
 *
 * Nothing changes when the current layer is not 0, or when layer 0 is
 * listed because the drawing already has entities on it outside of symbols.
 * The change is not recorded for undo.
 *
 * @param db - Drawing whose current layer is checked.
 * @param newLayerName - Base name for a created layer (a number is added:
 *   `Layer1`, `Layer2`, ...).
 * @returns The layer made current, or `undefined` when nothing changed.
 */
export function acapEnsureDrawingLayer(
  db: AcDbDatabase,
  newLayerName: string
): string | undefined {
  if (db.clayer !== ACAP_SYMBOL_LAYER) return undefined
  if (acapHasLooseEntitiesOnSymbolLayer(db)) return undefined

  const table = db.tables.layerTable
  let target: AcDbLayerTableRecord | undefined
  for (const layer of table.newIterator()) {
    // Layers of linked drawings (`drawing|layer`) cannot be drawn on.
    if (layer.name === ACAP_SYMBOL_LAYER || layer.name.includes('|')) continue
    if (isDrawable(layer)) {
      target = layer
      break
    }
  }

  if (!target) {
    let index = 1
    while (table.has(`${newLayerName}${index}`)) index++
    target = new AcDbLayerTableRecord({
      name: `${newLayerName}${index}`,
      isOff: false,
      isPlottable: true,
      color: new AcCmColor(AcCmColorMethod.ByACI, 7),
      linetype: 'Continuous'
    })
    table.add(target)
  }

  db.clayer = target.name
  return target.name
}
