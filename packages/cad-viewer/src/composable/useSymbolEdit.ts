import {
  ACAP_SYMBOL_LAYER,
  AcApDocManager,
  AcApSettingManager,
  AcApSymbolEditController,
  type AcApSymbolEditPathItem,
  acapSymbolLayerState,
  type AcTrView2d,
  eventBus
} from '@mlightcad/cad-simple-viewer'
import { AcDbObjectId } from '@mlightcad/data-model'
import { computed, reactive, readonly, ref } from 'vue'

/** Symbols being edited in the current view, outermost first. */
const path = ref<AcApSymbolEditPathItem[]>([])

/**
 * How layer 0, the symbol editing layer, appears in layer lists.
 *
 * In the simple profile it is listed while a symbol is edited, and
 * otherwise only when the drawing has entities on it outside of any symbol
 * (then with a warning). The CAD profile lists it like any layer.
 */
const layerState = reactive({
  /** Whether the simple operation profile is on */
  simple: true,
  /** Whether layer 0 is listed */
  listed: true,
  /** Whether layer 0 holds entities outside of any symbol */
  warning: false,
  /** Whether a symbol is being edited */
  editing: false
})

function currentSymbolEdit(): AcApSymbolEditController | undefined {
  try {
    return (AcApDocManager.instance?.curView as AcTrView2d | undefined)
      ?.symbolEdit
  } catch {
    return undefined
  }
}

function refreshLayerState() {
  let simple = true
  try {
    simple = AcApSettingManager.instance.operationProfile === 'simple'
  } catch {
    // Settings are not ready yet.
  }
  const symbolEdit = currentSymbolEdit()
  const editing = !!symbolEdit?.isActive
  layerState.simple = simple
  layerState.editing = editing
  let db
  try {
    db = AcApDocManager.instance?.curDocument?.database
  } catch {
    db = undefined
  }
  if (!simple || !db) {
    layerState.listed = true
    layerState.warning = false
    return
  }
  // The contents of the symbol being edited sit on the canvas, but belong
  // to the symbol.
  const state = acapSymbolLayerState(db, editing, id =>
    symbolEdit ? symbolEdit.isWorkingEntity(id) : false
  )
  layerState.listed = state.listed
  layerState.warning = state.warning
}

let refreshQueued = false
/** Entities change in bursts: look once per frame. */
function queueRefreshLayerState() {
  if (refreshQueued) return
  refreshQueued = true
  const run = () => {
    refreshQueued = false
    refreshLayerState()
  }
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(run)
  else setTimeout(run, 0)
}

let bound = false
let bindTimer: ReturnType<typeof setInterval> | undefined

function tryBind(): boolean {
  if (bound) return true
  let manager: AcApDocManager | undefined
  try {
    manager = AcApDocManager.instance
  } catch {
    manager = undefined
  }
  if (!manager) return false
  bound = true
  AcApSymbolEditController.events.changed.addEventListener(state => {
    if (state.view !== manager.curView) return
    path.value = state.path
    refreshLayerState()
  })
  manager.events.documentActivated.addEventListener(() => {
    path.value = currentSymbolEdit()?.path ?? []
    refreshLayerState()
  })
  AcApSettingManager.instance.events.modified.addEventListener(args => {
    if (args.key === 'operationProfile') refreshLayerState()
  })
  eventBus.on('undo-stack-changed', queueRefreshLayerState)
  path.value = currentSymbolEdit()?.path ?? []
  refreshLayerState()
  return true
}

function ensureBound() {
  if (tryBind() || bindTimer) return
  let attempts = 0
  bindTimer = setInterval(() => {
    attempts++
    if (tryBind() || attempts >= 100) {
      clearInterval(bindTimer)
      bindTimer = undefined
    }
  }, 50)
}

/**
 * Editing the contents of a symbol in place, for the current view.
 */
export function useSymbolEdit() {
  ensureBound()
  return {
    /** Symbols being edited, outermost first; empty when not editing */
    path: readonly(path),
    /** Whether a symbol is being edited */
    isEditing: computed(() => path.value.length > 0),
    /** Name of the symbol whose contents are being edited */
    currentName: computed(() => path.value[path.value.length - 1]?.name),
    /** Whether the entity is a placed symbol that can be entered */
    canEnter: (objectId: AcDbObjectId) =>
      !!currentSymbolEdit()?.canEnter(objectId),
    /** Enters the selected symbol (ends a running command first) */
    enterSelected: () => AcApDocManager.instance.sendStringToExecute('refedit'),
    /** Leaves the innermost symbol (ends a running command first) */
    finish: () => AcApDocManager.instance.sendStringToExecute('refclose'),
    /** Adds a property to the symbol being edited */
    addProperty: () => AcApDocManager.instance.sendStringToExecute('attdef')
  }
}

/**
 * How the symbol editing layer (layer 0) appears in layer lists.
 */
export function useSymbolLayer() {
  ensureBound()
  return {
    state: readonly(layerState),
    /** Whether the layer appears in layer lists */
    isListed: (layerName: string) =>
      layerName !== ACAP_SYMBOL_LAYER ||
      !layerState.simple ||
      layerState.listed,
    /** Whether the layer is shown under the name of the symbol editing layer */
    isSymbolLayer: (layerName: string) =>
      layerState.simple && layerName === ACAP_SYMBOL_LAYER,
    /** Whether the layer holds entities that should not be on it */
    hasWarning: (layerName: string) =>
      layerState.simple &&
      layerName === ACAP_SYMBOL_LAYER &&
      layerState.warning,
    /** Looks at the drawing again (after entities were added or removed) */
    refresh: refreshLayerState
  }
}
