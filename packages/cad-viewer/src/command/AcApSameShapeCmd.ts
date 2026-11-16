import { AcApContext, AcEdCommand } from '@mlightcad/cad-simple-viewer'

import { store } from '../app'

/**
 * Opens the "Same shape" panel (SAMESHAPE) and searches with the shape of
 * the current selection: the same symbol placed elsewhere, copies and
 * exploded symbols. From the panel they can all be selected, or the loose
 * ones replaced with a symbol.
 */
export class AcApSameShapeCmd extends AcEdCommand {
  async execute(_context: AcApContext) {
    openSameShapePalette()
  }
}

/** Shows the "Same shape" tab and searches with the current selection. */
export function openSameShapePalette() {
  store.dialogs.activePaletteTab = 'sameShape'
  store.dialogs.layerManager = true
  store.dialogs.sameShapeTick++
}
