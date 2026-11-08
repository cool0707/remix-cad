<template>
  <el-config-provider :size="'small'">
    <ml-tool-palette
      ref="paletteRef"
      class="ml-layer-manager"
      :style="paletteStyle"
      v-model="store.dialogs.layerManager"
      v-model:dock-side="dockSide"
      :title="activeTabTitle"
      :left-offset="paletteOffsets.left"
      :right-offset="paletteOffsets.right"
      :top-offset="paletteOffsets.top"
      :bottom-offset="paletteOffsets.bottom"
    >
      <div
        ref="bodyRef"
        class="ml-palette-body"
        :class="{ 'is-split': layersSplit }"
        data-testid="palette-body"
      >
        <div class="ml-palette-top">
          <ml-overflow-tabs
            v-model="topTab"
            :tabs="tabs"
            @tab-close="closeTaskTab"
          >
            <template v-if="!layersSplit" #actions>
              <el-dropdown
                trigger="click"
                class="ml-palette-more"
                @command="handleLayoutCommand"
              >
                <button
                  type="button"
                  class="ml-palette-more__button"
                  :title="t('main.toolPalette.layersSection.more')"
                  :aria-label="t('main.toolPalette.layersSection.more')"
                  data-testid="palette-more"
                >
                  <el-icon><MoreFilled /></el-icon>
                </button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      command="split"
                      data-testid="palette-layers-split"
                    >
                      {{ t('main.toolPalette.layersSection.split') }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
            <div
              v-if="topTab === 'layerManager'"
              class="ml-layer-list-wrapper"
            >
              <ml-layer-list :editor="props.editor" />
            </div>
            <div
              v-else-if="topTab === 'entityProperties'"
              class="ml-entity-properties-wrapper"
            >
              <ml-entity-properties :selection-ids="selectionSet" />
            </div>
            <div
              v-else-if="topTab === 'countList'"
              class="ml-count-list-wrapper"
            >
              <ml-count-list />
            </div>
            <div
              v-else-if="topTab === 'find'"
              class="ml-find-palette-wrapper"
            >
              <ml-find-palette />
            </div>
            <div
              v-else-if="topTab === 'designReview'"
              class="ml-design-review-wrapper"
            >
              <ml-design-review-palette />
            </div>
            <div
              v-else-if="topTab === 'measurements'"
              class="ml-measurement-palette-wrapper"
            >
              <ml-measurement-palette />
            </div>
            <div
              v-else-if="topTab === 'missingResources'"
              class="ml-missing-resources-wrapper"
            >
              <ml-missing-resources />
            </div>
            <div
              v-else-if="topTab === 'memoryProfile'"
              class="ml-memory-profile-wrapper"
            >
              <ml-memory-profile />
            </div>
            <div
              v-else-if="topTab === 'openFileProfile'"
              class="ml-open-file-profile-wrapper"
            >
              <ml-open-file-profile />
            </div>
            <div
              v-else-if="topTab === 'blocks'"
              class="ml-blocks-palette-wrapper"
            >
              <ml-blocks-palette />
            </div>
            <div
              v-else-if="store.features.agentPlugin && topTab === 'agent'"
              class="ml-agent-palette-wrapper"
            >
              <agent-chat-panel embedded />
            </div>
            <div
              v-else-if="store.features.scriptPlugin && topTab === 'cadScript'"
              class="ml-agent-palette-wrapper"
            >
              <ml-cad-script-panel />
            </div>
          </ml-overflow-tabs>
        </div>

        <!-- Layers in their own section under the other tabs. -->
        <template v-if="layersSplit">
          <div
            v-show="!layersCollapsed"
            class="ml-palette-splitter"
            role="separator"
            aria-orientation="horizontal"
            data-testid="palette-layers-splitter"
            @pointerdown="startResize"
          />
          <section
            class="ml-palette-layers"
            :class="{ 'is-collapsed': layersCollapsed }"
            :style="layersStyle"
            data-testid="palette-layers-section"
          >
            <header class="ml-palette-layers__header">
              <button
                type="button"
                class="ml-palette-layers__toggle"
                :aria-expanded="!layersCollapsed"
                :title="
                  layersCollapsed
                    ? t('main.toolPalette.layersSection.expand')
                    : t('main.toolPalette.layersSection.collapse')
                "
                data-testid="palette-layers-toggle"
                @click="toggleLayersCollapsed"
              >
                <el-icon class="ml-palette-layers__chevron" aria-hidden="true">
                  <ArrowRight v-if="layersCollapsed" />
                  <ArrowDown v-else />
                </el-icon>
                <span class="ml-palette-layers__title">
                  {{ t('main.toolPalette.layerManager.tab') }}
                </span>
                <span
                  v-if="layersCollapsed && currentLayerName"
                  class="ml-palette-layers__current"
                  data-testid="palette-layers-current"
                >
                  {{ currentLayerName }}
                </span>
              </button>
              <el-dropdown trigger="click" @command="handleLayoutCommand">
                <button
                  type="button"
                  class="ml-palette-more__button"
                  :title="t('main.toolPalette.layersSection.more')"
                  :aria-label="t('main.toolPalette.layersSection.more')"
                  data-testid="palette-layers-more"
                >
                  <el-icon><MoreFilled /></el-icon>
                </button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      command="merge"
                      data-testid="palette-layers-merge"
                    >
                      {{ t('main.toolPalette.layersSection.merge') }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </header>
            <div v-if="!layersCollapsed" class="ml-layer-list-wrapper">
              <ml-layer-list :editor="props.editor" />
            </div>
          </section>
        </template>
      </div>
    </ml-tool-palette>
  </el-config-provider>
</template>

<script setup lang="ts">
import { ArrowDown, ArrowRight, MoreFilled } from '@element-plus/icons-vue'
import {
  AcApDocManager,
  AcApSettingManager,
  eventBus
} from '@mlightcad/cad-simple-viewer'
import {
  type MlOverflowTab,
  MlOverflowTabs,
  MlToolPalette
} from '@mlightcad/ui-components'
import { useResizeObserver } from '@vueuse/core'
import {
  ElConfigProvider,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon
} from 'element-plus'
import {
  computed,
  defineAsyncComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from 'vue'
import { useI18n } from 'vue-i18n'

import { store } from '../../app'
import {
  pendingSymbolPropertyFocus,
  useLayers,
  useSelectionSet,
  useSettings,
  useViewerRect
} from '../../composable'
import { toolPaletteTabName, toolPaletteTitle } from '../../locale'
import MlBlocksPalette from './MlBlocksPalette.vue'
import MlCadScriptPanel from './MlCadScriptPanel.vue'
import MlCountList from './MlCountList.vue'
import MlDesignReviewPalette from './MlDesignReviewPalette.vue'
import MlEntityProperties from './MlEntityProperties.vue'
import MlFindPalette from './MlFindPalette.vue'
import MlLayerList from './MlLayerList.vue'
import MlMeasurementPalette from './MlMeasurementPalette.vue'
import MlMemoryProfile from './MlMemoryProfile.vue'
import MlMissingResources from './MlMissingResources.vue'
import MlOpenFileProfile from './MlOpenFileProfile.vue'

const loadAgentPlugin = () =>
  Promise.all([
    import('@mlightcad/cad-agent-plugin/style.css'),
    import('@mlightcad/cad-agent-plugin')
  ]).then(([, module]) => module)

const AgentChatPanel = defineAsyncComponent(() =>
  loadAgentPlugin().then(module => module.AgentChatPanel)
)

/**
 * Properties of palette manager component
 */
interface Props {
  /**
   * Current editor
   */
  editor: AcApDocManager
}

const props = defineProps<Props>()
const { t } = useI18n()
const containerRect = useViewerRect()

const DEFAULT_WIDTH = 520
const DEFAULT_HEIGHT = 500
const FLOATING_LEFT_OFFSET = 2
const FLOATING_TOP_OFFSET = 2

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max)
}

const paletteOffsets = computed(() => {
  const { top, left, width, height } = containerRect.value
  const right = left + width
  const bottom = top + height

  return {
    top,
    left,
    right: Math.max(0, window.innerWidth - right),
    bottom: Math.max(0, window.innerHeight - bottom)
  }
})

const paletteStyle = computed(() => {
  const { top, left, width, height } = containerRect.value
  const safeWidth = width > 0 ? width : DEFAULT_WIDTH
  const safeHeight = height > 0 ? height : DEFAULT_HEIGHT
  return {
    '--ml-palette-left': `${left + FLOATING_LEFT_OFFSET}px`,
    '--ml-palette-top': `${top + FLOATING_TOP_OFFSET}px`,
    '--ml-palette-width': `${Math.min(DEFAULT_WIDTH, safeWidth)}px`,
    '--ml-palette-height': `${Math.min(DEFAULT_HEIGHT, safeHeight)}px`,
    '--ml-palette-max-width': `${safeWidth}px`,
    '--ml-palette-max-height': `${safeHeight}px`
  }
})

const syncPaletteToContainer = () => {
  if (!store.dialogs.layerManager) return

  const paletteElement =
    document.querySelector<HTMLElement>('.ml-layer-manager')
  if (!paletteElement) return

  const {
    top,
    left,
    width: containerWidth,
    height: containerHeight
  } = containerRect.value
  if (containerWidth <= 0 || containerHeight <= 0) return

  const right = left + containerWidth
  const bottom = top + containerHeight
  const rect = paletteElement.getBoundingClientRect()
  const width = Math.min(rect.width || DEFAULT_WIDTH, containerWidth)
  const height = Math.min(rect.height || DEFAULT_HEIGHT, containerHeight)
  const isDockedLeft = rect.left <= left + 1
  const isDockedRight = rect.right >= right - 1
  // Geometric proximity alone is not enough: a floating palette sits only a
  // couple of pixels inside the viewer edge. Only stretch when already at
  // docked (full) height so Undock cannot be overwritten back to full-size.
  const isSideDocked =
    (isDockedLeft || isDockedRight) && height >= containerHeight - 1

  const nextLeft = isDockedLeft
    ? left
    : isDockedRight
      ? Math.max(left, right - width)
      : clamp(rect.left, left, Math.max(left, right - width))
  const nextTop = isSideDocked
    ? top
    : clamp(rect.top, top, Math.max(top, bottom - height))
  const nextHeight = isSideDocked ? containerHeight : height

  paletteElement.style.left = `${nextLeft}px`
  paletteElement.style.top = `${nextTop}px`
  paletteElement.style.width = `${width}px`
  paletteElement.style.height = `${nextHeight}px`
  paletteElement.style.maxHeight = `${containerHeight}px`
  paletteElement.style.maxWidth = `${containerWidth}px`
}

// Dock to the right by default. The viewer rect changes a few times while the
// ribbon renders, so dock once it has settled; docking against a stale rect
// leaves the palette over the ribbon. The palette has no close button (hidden
// in CSS): it can only be collapsed to its title bar.
const INITIAL_DOCK_DELAY = 100
type DockSide = 'float' | 'left' | 'top' | 'bottom' | 'right'
const dockSide = ref<DockSide | undefined>()
let initialDockTimer: ReturnType<typeof setTimeout> | undefined
const stopInitialDock = watch(
  containerRect,
  rect => {
    clearTimeout(initialDockTimer)
    if (rect.width <= 0 || rect.height <= 0) return
    initialDockTimer = setTimeout(() => {
      stopInitialDock()
      dockSide.value = 'right'
    }, INITIAL_DOCK_DELAY)
  },
  { immediate: true }
)
onBeforeUnmount(() => {
  clearTimeout(initialDockTimer)
  stopInitialDock()
  Object.assign(store.paletteDockInsets, { left: 0, right: 0, top: 0, bottom: 0 })
})

// Publish the space a docked palette takes so the canvas shrinks around it
// (collapsing the palette gives the space back).
const paletteRef = ref<InstanceType<typeof MlToolPalette>>()
const updatePaletteDockInsets = () => {
  const insets = { left: 0, right: 0, top: 0, bottom: 0 }
  const element = paletteRef.value?.$el as HTMLElement | undefined
  const side = dockSide.value
  const { top, left, width, height } = containerRect.value
  if (
    element instanceof HTMLElement &&
    store.dialogs.layerManager &&
    side &&
    side !== 'float'
  ) {
    const rect = element.getBoundingClientRect()
    const extent = {
      left: rect.right - left,
      right: left + width - rect.left,
      top: rect.bottom - top,
      bottom: top + height - rect.top
    }[side]
    const max = side === 'left' || side === 'right' ? width : height
    insets[side] = clamp(Math.round(extent), 0, max)
  }
  const current = store.paletteDockInsets
  if (
    current.left !== insets.left ||
    current.right !== insets.right ||
    current.top !== insets.top ||
    current.bottom !== insets.bottom
  ) {
    Object.assign(current, insets)
  }
}
useResizeObserver(paletteRef, updatePaletteDockInsets)
watch(dockSide, async () => {
  await nextTick()
  updatePaletteDockInsets()
})

/**
 * Tabs that are always there: the properties, and the layers when they are
 * not in their own section.
 */
const FIXED_TABS = ['layerManager', 'entityProperties'] as const

/**
 * Task panels: shown as a closable tab once something opens them (the FIND
 * command, the measurement tool, the warning button ...), and only then.
 */
const TASK_TABS = [
  'find',
  'countList',
  'measurements',
  'designReview',
  'blocks',
  'agent',
  'cadScript',
  'missingResources',
  'memoryProfile',
  'openFileProfile'
] as const

const features = useSettings()

/** Whether the layers have their own section (per operation profile). */
const layersSplit = computed(() =>
  features.operationProfile === 'simple'
    ? features.sidebarLayersSplitSimple
    : features.sidebarLayersSplitCad
)

const isTaskTab = (name: string) =>
  (TASK_TABS as readonly string[]).includes(name)

const isTabAvailable = (name: string) => {
  if (name === 'agent') return store.features.agentPlugin
  if (name === 'cadScript') return store.features.scriptPlugin
  return (FIXED_TABS as readonly string[]).includes(name) || isTaskTab(name)
}

// ---------------------------------------------------------------------------
// Layers section: height (dragging the splitter) and collapsing.
// Both are per-viewer conveniences kept in localStorage.
// ---------------------------------------------------------------------------

const LAYERS_RATIO_KEY = 'ml-cad-viewer.paletteLayersRatio'
const LAYERS_COLLAPSED_KEY = 'ml-cad-viewer.paletteLayersCollapsed'
const DEFAULT_LAYERS_RATIO = 0.45
/** Below this palette height the layers start collapsed. */
const AUTO_COLLAPSE_HEIGHT = 360
const MIN_LAYERS_HEIGHT = 120
const MIN_TOP_HEIGHT = 140

const readStorage = (key: string) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

const writeStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Storage blocked: not remembered.
  }
}

const storedRatio = Number(readStorage(LAYERS_RATIO_KEY))
const layersRatio = ref(
  storedRatio > 0 && storedRatio < 1 ? storedRatio : DEFAULT_LAYERS_RATIO
)
const layersCollapsed = ref(readStorage(LAYERS_COLLAPSED_KEY) === 'true')
watch(layersCollapsed, value =>
  writeStorage(LAYERS_COLLAPSED_KEY, String(value))
)

const bodyRef = ref<HTMLElement>()
const bodyHeight = ref(0)
useResizeObserver(bodyRef, entries => {
  const height = entries[0]?.contentRect.height ?? 0
  const before = bodyHeight.value
  bodyHeight.value = height
  // Becoming short (a small window, docked at the bottom): give the room to
  // the tabs above. The user can still open the layers again.
  if (
    height > 0 &&
    height < AUTO_COLLAPSE_HEIGHT &&
    (before === 0 || before >= AUTO_COLLAPSE_HEIGHT)
  ) {
    layersCollapsed.value = true
  }
})

const layersHeight = computed(() => {
  const total = bodyHeight.value
  if (total <= 0) return undefined
  const max = Math.max(MIN_LAYERS_HEIGHT, total - MIN_TOP_HEIGHT)
  return clamp(Math.round(total * layersRatio.value), MIN_LAYERS_HEIGHT, max)
})

const layersStyle = computed(() =>
  layersCollapsed.value || layersHeight.value == null
    ? undefined
    : { height: `${layersHeight.value}px` }
)

const toggleLayersCollapsed = () => {
  layersCollapsed.value = !layersCollapsed.value
}

const startResize = (e: PointerEvent) => {
  const body = bodyRef.value
  if (!body || e.button !== 0) return
  e.preventDefault()
  const target = e.currentTarget as HTMLElement
  target.setPointerCapture?.(e.pointerId)
  const rect = body.getBoundingClientRect()
  const move = (ev: PointerEvent) => {
    const height = rect.bottom - ev.clientY
    layersRatio.value = clamp(height / rect.height, 0.1, 0.9)
  }
  const end = () => {
    target.removeEventListener('pointermove', move)
    target.removeEventListener('pointerup', end)
    target.removeEventListener('pointercancel', end)
    writeStorage(LAYERS_RATIO_KEY, String(layersRatio.value))
  }
  target.addEventListener('pointermove', move)
  target.addEventListener('pointerup', end)
  target.addEventListener('pointercancel', end)
}

const { currentLayerName } = useLayers(props.editor)

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

/** The tab shown above the layers when they were the last one opened. */
const lastTopTab = ref('entityProperties')

/** The tab of the tab strip (never the layers when they have a section). */
const topTab = computed<string>({
  get: () => {
    const active = store.dialogs.activePaletteTab
    if (layersSplit.value && active === 'layerManager') return lastTopTab.value
    return active
  },
  set: name => {
    store.dialogs.activePaletteTab = name
  }
})

const openedTaskTabs = computed(() => {
  const names = store.dialogs.openTaskTabs.filter(isTabAvailable)
  // The tab being opened shows at once (before the watcher records it).
  const active = store.dialogs.activePaletteTab
  if (isTaskTab(active) && isTabAvailable(active) && !names.includes(active)) {
    names.push(active)
  }
  return names
})

const tabLabel = (name: string) =>
  name === 'cadScript'
    ? t('main.toolPalette.script.scriptTab')
    : toolPaletteTabName(name)

const tabs = computed<MlOverflowTab[]>(() => {
  const fixed = layersSplit.value
    ? ['entityProperties']
    : ['layerManager', 'entityProperties']
  return [
    ...fixed.map(name => ({ name, label: tabLabel(name), closable: false })),
    ...openedTaskTabs.value.map(name => ({
      name,
      label: tabLabel(name),
      closable: true
    }))
  ]
})

const activeTabTitle = computed(() => {
  if (topTab.value === 'cadScript') {
    return t('main.toolPalette.script.scriptTitle')
  }
  return toolPaletteTitle(topTab.value)
})

watch(
  () => store.dialogs.activePaletteTab,
  (active, previous) => {
    if (!isTabAvailable(active)) {
      store.dialogs.activePaletteTab = 'entityProperties'
      return
    }
    if (isTaskTab(active) && !store.dialogs.openTaskTabs.includes(active)) {
      store.dialogs.openTaskTabs.push(active)
    }
    if (active === 'layerManager') {
      // Something asked for the layers: show their section (not on start-up,
      // where the layers are only the default tab).
      if (layersSplit.value && previous !== undefined) {
        layersCollapsed.value = false
      }
    } else {
      lastTopTab.value = active
    }
  },
  { immediate: true }
)

/** Closes a task panel; its entry point opens it again. */
const closeTaskTab = (name: string) => {
  const open = store.dialogs.openTaskTabs
  const index = open.indexOf(name)
  if (index >= 0) open.splice(index, 1)
  if (name === 'openFileProfile') {
    store.dialogs.openFileProfileTabVisible = false
  }
  if (lastTopTab.value === name) lastTopTab.value = 'entityProperties'
  if (store.dialogs.activePaletteTab === name) {
    store.dialogs.activePaletteTab = 'entityProperties'
  }
}

/** ⋯ menu: put the layers in their own section, or back into the tabs. */
const handleLayoutCommand = (command: 'split' | 'merge') => {
  AcApSettingManager.instance.isSidebarLayersSplit = command === 'split'
  if (command === 'merge') {
    store.dialogs.activePaletteTab = 'layerManager'
  } else if (store.dialogs.activePaletteTab === 'layerManager') {
    layersCollapsed.value = false
  }
}

watch(
  () => [containerRect.value, store.dialogs.layerManager],
  async () => {
    await nextTick()
    syncPaletteToContainer()
    updatePaletteDockInsets()
  },
  { immediate: true, deep: true }
)

const { selectionSet } = useSelectionSet()

// Double-clicking a symbol in the simple selection style edits its symbol
// properties here instead of opening the attribute editor dialog.
const focusSymbolProperty = (args: { objectId: string; tag?: string }) => {
  store.dialogs.layerManager = true
  store.dialogs.activePaletteTab = 'entityProperties'
  pendingSymbolPropertyFocus.value = { objectId: args.objectId, tag: args.tag }
}
onMounted(() => eventBus.on('focus-symbol-property', focusSymbolProperty))
onBeforeUnmount(() => eventBus.off('focus-symbol-property', focusSymbolProperty))
</script>

<style scoped>
.ml-palette-body {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  min-width: 0;
}

.ml-palette-top {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.ml-palette-splitter {
  flex: 0 0 6px;
  cursor: ns-resize;
  border-top: 1px solid var(--el-border-color);
  background: var(--el-fill-color);
  touch-action: none;
}

.ml-palette-splitter:hover {
  background: var(--ml-brand-soft, var(--el-fill-color-dark));
}

.ml-palette-layers {
  flex: 0 0 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.ml-palette-layers.is-collapsed {
  border-top: 1px solid var(--el-border-color);
}

.ml-palette-layers__header {
  flex: 0 0 auto;
  display: flex;
  align-items: stretch;
  min-height: 28px;
  border-bottom: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
}

.ml-palette-layers__toggle {
  flex: 1 1 auto;
  min-width: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
  border: 0;
  background: transparent;
  color: var(--el-text-color-primary);
  font: inherit;
  text-align: start;
  cursor: pointer;
}

.ml-palette-layers__toggle:hover {
  background: var(--el-fill-color-light);
}

.ml-palette-layers__chevron {
  flex: 0 0 auto;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.ml-palette-layers__title {
  flex: 0 0 auto;
  font-weight: 600;
}

.ml-palette-layers__current {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--el-text-color-secondary);
}

.ml-palette-layers__current::before {
  content: ': ';
}

.ml-palette-layers .ml-layer-list-wrapper {
  flex: 1 1 auto;
  height: auto;
}

.ml-palette-more {
  display: inline-flex;
  align-items: stretch;
}

.ml-palette-more__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  border: 0;
  background: transparent;
  color: var(--el-text-color-secondary);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
}

.ml-palette-more__button:hover {
  color: var(--el-text-color-primary);
  background: var(--el-fill-color-light);
}

.ml-layer-manager {
  left: var(--ml-palette-left);
  top: var(--ml-palette-top);
  width: var(--ml-palette-width);
  height: var(--ml-palette-height);
  max-width: var(--ml-palette-max-width);
  max-height: var(--ml-palette-max-height);
  z-index: 7;
}

.ml-layer-manager :deep(.ml-tool-palette-action-close) {
  display: none;
}

.ml-layer-list-wrapper {
  overflow: hidden;
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.ml-entity-properties-wrapper {
  overflow: hidden;
  width: 100%;
  height: 100%;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.ml-count-list-wrapper {
  overflow: hidden;
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.ml-find-palette-wrapper {
  overflow: hidden;
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.ml-design-review-wrapper {
  overflow: hidden;
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.ml-measurement-palette-wrapper {
  overflow: hidden;
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.ml-missing-resources-wrapper {
  overflow: hidden;
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.ml-memory-profile-wrapper {
  overflow: hidden;
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.ml-open-file-profile-wrapper {
  overflow: hidden;
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.ml-blocks-palette-wrapper {
  overflow: hidden;
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.ml-agent-palette-wrapper {
  overflow: hidden;
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.ml-agent-palette-wrapper :deep(.cad-agent-panel-root) {
  flex: 1;
  min-height: 0;
}
</style>
