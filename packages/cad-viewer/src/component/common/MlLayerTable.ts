import type { LayerInfo } from '../../composable'

/** Layer table row: real layer or an in-progress new-layer draft. */
export interface MlLayerTableRow extends LayerInfo {
  isDraft?: boolean
  /** Name shown instead of the layer's own (the symbol editing layer) */
  displayName?: string
  /** Explains {@link displayName}; shown as the tooltip of the name */
  displayNameHint?: string
  /** Warning shown beside the name */
  warning?: string
}

export type MlLayerTableChangeField =
  | 'on'
  | 'locked'
  | 'plottable'
  | 'linetype'
  | 'lineWeight'
  | 'transparency'
  | 'description'

/**
 * Whether a layer row is displayed. The UI has no freeze control, so a frozen
 * layer is presented as hidden even when it is on.
 */
export function isLayerShown(row: Pick<LayerInfo, 'isOn' | 'isFrozen'>) {
  return row.isOn && !row.isFrozen
}
