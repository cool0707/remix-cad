<template>
  <div
    ref="rootRef"
    class="ml-layout-tabs"
    :class="{ 'is-dragging': draggingId != null }"
  >
    <el-button-group class="ml-layout-tabs-list" role="tablist">
      <el-button
        v-for="layout in layouts"
        :key="layout.blockTableRecordId"
        :ref="
          (el: Element | ComponentPublicInstance | null) =>
            setButtonRef(layout.blockTableRecordId, el)
        "
        class="ml-layout-tabs-button"
        :class="{
          'is-drag-source': draggingId === layout.blockTableRecordId
        }"
        size="small"
        role="tab"
        :hidden="overflowIds.includes(layout.blockTableRecordId)"
        :type="layout.isActive ? 'primary' : ''"
        :aria-selected="layout.isActive"
        @click="handleTabClick(layout)"
        @dblclick="handleTabDoubleClick(layout)"
        @contextmenu.prevent="openMenuForEvent($event, layout)"
        @pointerdown="handlePointerDown($event, layout)"
      >
        {{ layoutLabel(layout) }}
      </el-button>
      <el-dropdown
        v-show="overflowLayouts.length > 0"
        trigger="click"
        placement="top-start"
        @command="handleSelectById"
      >
        <el-button
          ref="overflowButtonRef"
          class="ml-layout-tabs-overflow-button"
          size="small"
          :class="{ 'is-active': overflowContainsActive }"
          :type="overflowContainsActive ? 'primary' : ''"
          :title="t('main.statusBar.moreLayouts')"
          :aria-label="t('main.statusBar.moreLayouts')"
        >
          {{ overflowButtonLabel }}
        </el-button>
        <template #dropdown>
          <el-dropdown-menu class="ml-layout-tabs-overflow-menu">
            <el-dropdown-item
              v-for="layout in overflowLayouts"
              :key="layout.blockTableRecordId"
              :command="layout.blockTableRecordId"
              :class="{ 'is-selected': layout.isActive }"
              @contextmenu.prevent="openMenuForEvent($event, layout)"
            >
              {{ layoutLabel(layout) }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button
        v-if="canEdit"
        ref="addButtonRef"
        class="ml-layout-tabs-add-button"
        size="small"
        :title="t('main.statusBar.layoutTabs.newLayoutTooltip')"
        :aria-label="t('main.statusBar.layoutTabs.newLayoutTooltip')"
        @click="handleNewLayout"
      >
        <el-icon><Plus /></el-icon>
      </el-button>
    </el-button-group>
    <div
      v-if="dropIndicatorX != null"
      class="ml-layout-tabs-drop-indicator"
      :style="{ left: `${dropIndicatorX}px` }"
    />
    <teleport to="body">
      <div
        v-if="menu"
        ref="menuRef"
        class="ml-layout-tabs-menu"
        role="menu"
        :style="{ left: `${menu.x}px`, top: `${menu.y}px` }"
        @contextmenu.prevent
        @keydown="handleMenuKeydown"
      >
        <template v-for="item in menuItems" :key="item.key">
          <div v-if="item.divided" class="ml-layout-tabs-menu-divider" />
          <button
            type="button"
            role="menuitem"
            class="ml-layout-tabs-menu-item"
            :class="{ 'is-danger': item.danger }"
            :disabled="item.disabled"
            @click="handleMenuCommand(item.key)"
          >
            {{ item.label }}
          </button>
        </template>
      </div>
    </teleport>
    <ml-layout-page-setup-dlg
      v-model="pageSetupVisible"
      :layout="pageSetupLayout"
    />
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import {
  acapActivateLayout,
  acapCanDeleteLayout,
  acapCopyLayout,
  acapCreateLayout,
  acapDeleteLayout,
  AcApDocManager,
  type AcApLayoutNameError,
  acapMoveLayout,
  acapRenameLayout,
  acapValidateLayoutName,
  AcEdOpenMode
} from '@mlightcad/cad-simple-viewer'
import {
  acdbHostApplicationServices,
  type AcDbLayout,
  AcDbObjectId
} from '@mlightcad/data-model'
import {
  ElButton,
  ElButtonGroup,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  ElMessage,
  ElMessageBox
} from 'element-plus'
import {
  type ComponentPublicInstance,
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch
} from 'vue'
import { useI18n } from 'vue-i18n'

import { type LayoutInfo, useDocument, useLayouts } from '../../composable'
import MlLayoutPageSetupDlg from './MlLayoutPageSetupDlg.vue'

const OVERFLOW_BTN_WIDTH = 28
/** Pointer travel (px) before a press on a tab becomes a drag. */
const DRAG_THRESHOLD = 5
/** Touch press duration (ms) that opens the tab menu. */
const LONG_PRESS_MS = 500
/** Characters a layout name cannot contain (shown in the error). */
const INVALID_NAME_CHARS = '< > / \\ " : ; ? * | , = `'
const overflowButtonLabel = '...'

const props = defineProps<{
  disabled?: boolean
  /** Extra width (px) reserved for status-bar content such as coordinates. */
  reservedWidth?: number
}>()

const { t } = useI18n()

/**
 * Display label for a layout tab. The model-space layout (tab order 0) is
 * stored as `Model` in DWG/DXF regardless of the authoring language, so it is
 * shown with the localized name like desktop CAD does.
 */
const layoutLabel = (layout: LayoutInfo) =>
  layout.tabOrder === 0 ? t('main.statusBar.modelTab') : layout.name
const layouts = useLayouts(AcApDocManager.instance)

const { openMode } = useDocument()

const rootRef = ref<HTMLElement | null>(null)
const overflowButtonRef = ref<ComponentPublicInstance | null>(null)
const addButtonRef = ref<ComponentPublicInstance | null>(null)
const overflowIds = ref<AcDbObjectId[]>([])
const buttonRefs = new Map<AcDbObjectId, HTMLElement>()
let overflowFrame: number | undefined
let resizeObserver: ResizeObserver | undefined

const resolvedReservedWidth = computed(() => props.reservedWidth ?? 0)

const overflowLayouts = computed(() =>
  layouts.filter(layout =>
    overflowIds.value.includes(layout.blockTableRecordId)
  )
)

const activeLayoutId = computed(
  () => layouts.find(layout => layout.isActive)?.blockTableRecordId
)

const overflowContainsActive = computed(() => {
  const activeId = activeLayoutId.value
  return activeId != null && overflowIds.value.includes(activeId)
})

const setButtonRef = (id: AcDbObjectId, el: unknown) => {
  const element =
    el instanceof HTMLElement
      ? el
      : el && typeof el === 'object' && '$el' in el
        ? (el as ComponentPublicInstance).$el
        : null

  if (element instanceof HTMLElement) {
    buttonRefs.set(id, element)
  } else {
    buttonRefs.delete(id)
  }
}

const handleSelectLayout = (layout: LayoutInfo) => {
  if (props.disabled) return
  acdbHostApplicationServices().layoutManager.setCurrentLayoutBtrId(
    layout.blockTableRecordId
  )
}

const handleSelectById = (id: AcDbObjectId) => {
  if (props.disabled) return
  const layout = layouts.find(item => item.blockTableRecordId === id)
  if (layout) {
    handleSelectLayout(layout)
  }
}

const scheduleUpdateOverflow = () => {
  if (overflowFrame !== undefined) return
  overflowFrame = requestAnimationFrame(() => {
    overflowFrame = undefined
    void updateOverflow()
  })
}

/**
 * Extra pixels still needed so coordinates can grow up to {@link resolvedReservedWidth}
 * without covering layout tabs. Returns 0 when the coordinate button already holds
 * that width (e.g. via CSS min-width).
 */
const getCoordinateReserveExtra = (root: HTMLElement): number => {
  const reserved = resolvedReservedWidth.value
  if (reserved <= 0) return 0

  const statusBar = root.closest('.ml-status-bar')
  const coord = statusBar?.querySelector(
    '.ml-status-bar-current-pos'
  ) as HTMLElement | null

  if (!coord) {
    // Coordinates will appear later — keep the full reservation.
    return reserved
  }

  return Math.max(0, reserved - coord.offsetWidth)
}

const updateOverflow = async () => {
  const root = rootRef.value
  if (!root || layouts.length === 0) {
    overflowIds.value = []
    return
  }

  // Measure with all buttons visible.
  overflowIds.value = []
  await nextTick()

  const rootWidth = root.clientWidth
  if (rootWidth <= 0) return

  const widths = new Map(
    layouts.map(layout => [
      layout.blockTableRecordId,
      buttonRefs.get(layout.blockTableRecordId)?.offsetWidth ?? 0
    ])
  )
  const totalWidth = layouts.reduce(
    (sum, layout) => sum + (widths.get(layout.blockTableRecordId) ?? 0),
    0
  )

  // Overflow control is v-show'd off while measuring, so offsetWidth is 0 —
  // always fall back to the reserved constant in that case.
  const measuredOverflowBtnWidth =
    overflowButtonRef.value?.$el instanceof HTMLElement
      ? overflowButtonRef.value.$el.offsetWidth
      : 0
  const overflowButtonWidth = measuredOverflowBtnWidth || OVERFLOW_BTN_WIDTH
  const coordinateReserveExtra = getCoordinateReserveExtra(root)
  const addButtonWidth =
    addButtonRef.value?.$el instanceof HTMLElement
      ? addButtonRef.value.$el.offsetWidth
      : 0
  // Keep coordinate slack free even when all tabs would otherwise fit.
  const widthForTabs = rootWidth - coordinateReserveExtra - addButtonWidth

  if (totalWidth <= widthForTabs) {
    overflowIds.value = []
    return
  }

  // Overflow control is only needed when tabs do not all fit.
  const availableWidth = widthForTabs - overflowButtonWidth
  const activeId = activeLayoutId.value ?? layouts[0].blockTableRecordId
  const visible = new Set(layouts.map(layout => layout.blockTableRecordId))
  const hidden = new Set<AcDbObjectId>()

  const sumVisibleWidth = () =>
    layouts
      .filter(layout => visible.has(layout.blockTableRecordId))
      .reduce(
        (sum, layout) => sum + (widths.get(layout.blockTableRecordId) ?? 0),
        0
      )

  while (visible.size > 1 && sumVisibleWidth() > availableWidth) {
    let hideId: AcDbObjectId | undefined
    for (let index = layouts.length - 1; index >= 0; index -= 1) {
      const id = layouts[index].blockTableRecordId
      if (id === activeId || !visible.has(id)) continue
      hideId = id
      break
    }
    if (!hideId) break
    visible.delete(hideId)
    hidden.add(hideId)
  }

  if (!visible.has(activeId)) {
    hidden.delete(activeId)
    visible.add(activeId)
    while (visible.size > 1 && sumVisibleWidth() > availableWidth) {
      let hideId: AcDbObjectId | undefined
      for (let index = layouts.length - 1; index >= 0; index -= 1) {
        const id = layouts[index].blockTableRecordId
        if (id === activeId || !visible.has(id)) continue
        hideId = id
        break
      }
      if (!hideId) break
      visible.delete(hideId)
      hidden.add(hideId)
    }
  }

  overflowIds.value = layouts
    .filter(layout => hidden.has(layout.blockTableRecordId))
    .map(layout => layout.blockTableRecordId)
}

watch(
  () =>
    layouts.map(layout => [
      layout.blockTableRecordId,
      layout.name,
      layout.isActive
    ]),
  () => {
    scheduleUpdateOverflow()
  },
  { deep: true }
)

watch(resolvedReservedWidth, () => {
  scheduleUpdateOverflow()
})

// ---------------------------------------------------------------------------
// Editing: new / copy / rename / delete / page setup / reorder
// ---------------------------------------------------------------------------

/** Layout tabs can be edited (document open for writing). */
const canEdit = computed(
  () => !props.disabled && openMode.value === AcEdOpenMode.Write
)

// The plus button comes and goes with the open mode.
watch(canEdit, () => {
  scheduleUpdateOverflow()
})

const isModelTab = (layout: LayoutInfo) => layout.tabOrder === 0

const currentDb = () => AcApDocManager.instance.curDocument?.database

/** Layout object of a tab. */
const findLayout = (layout: LayoutInfo): AcDbLayout | undefined =>
  currentDb()?.objects.layout.getBtrIdAt(layout.blockTableRecordId)

const showError = (error: unknown) => {
  ElMessage({
    message: error instanceof Error ? error.message : String(error),
    type: 'error'
  })
}

const nameErrorMessage = (error: AcApLayoutNameError) => {
  switch (error) {
    case 'empty':
      return t('main.statusBar.layoutTabs.nameEmpty')
    case 'invalid':
      return t('main.statusBar.layoutTabs.nameInvalid', {
        chars: INVALID_NAME_CHARS
      })
    default:
      return t('main.statusBar.layoutTabs.nameExists')
  }
}

const handleNewLayout = () => {
  const db = currentDb()
  if (!db || !canEdit.value) return
  try {
    const layout = acapCreateLayout(db)
    // Nothing is drawn on a new page yet: show its whole paper.
    const view = AcApDocManager.instance.curView
    view?.markLayoutAsInitialized(layout.blockTableRecordId)
    acapActivateLayout(db, layout)
    if (view && !layout.limits.isEmpty()) view.zoomTo(layout.limits)
  } catch (error) {
    showError(error)
  }
}

const handleCopyLayout = (info: LayoutInfo) => {
  const db = currentDb()
  const source = findLayout(info)
  if (!db || !source || !canEdit.value) return
  try {
    const layout = acapCopyLayout(db, source)
    acapActivateLayout(db, layout)
  } catch (error) {
    showError(error)
  }
}

const handleRenameLayout = async (info: LayoutInfo) => {
  const db = currentDb()
  const layout = findLayout(info)
  if (!db || !layout || !canEdit.value || isModelTab(info)) return
  let value: string
  try {
    const result = await ElMessageBox.prompt(
      t('main.statusBar.layoutTabs.renamePrompt'),
      t('main.statusBar.layoutTabs.renameTitle'),
      {
        confirmButtonText: t('main.statusBar.layoutTabs.confirm'),
        cancelButtonText: t('main.statusBar.layoutTabs.cancel'),
        inputValue: layout.layoutName,
        inputValidator: (input: string) => {
          const name = input.trim()
          if (name.toLowerCase() === layout.layoutName.toLowerCase() && name) {
            return true
          }
          const error = acapValidateLayoutName(db, name, layout)
          return error ? nameErrorMessage(error) : true
        }
      }
    )
    value = result.value
  } catch {
    return
  }
  const error = acapRenameLayout(db, layout, value)
  if (error) {
    ElMessage({ message: nameErrorMessage(error), type: 'warning' })
  }
}

const handleDeleteLayout = async (info: LayoutInfo) => {
  const db = currentDb()
  const layout = findLayout(info)
  if (!db || !layout || !canEdit.value || !acapCanDeleteLayout(db, layout)) {
    return
  }
  try {
    await ElMessageBox.confirm(
      t('main.statusBar.layoutTabs.deleteConfirm', { name: layout.layoutName }),
      t('main.statusBar.layoutTabs.deleteTitle'),
      {
        type: 'warning',
        confirmButtonText: t('main.statusBar.layoutTabs.delete'),
        cancelButtonText: t('main.statusBar.layoutTabs.cancel'),
        confirmButtonClass: 'el-button--danger'
      }
    )
  } catch {
    return
  }
  try {
    acapDeleteLayout(db, layout)
  } catch (error) {
    showError(error)
  }
}

const pageSetupVisible = ref(false)
const pageSetupLayout = shallowRef<AcDbLayout>()

const handlePageSetup = (info: LayoutInfo) => {
  const layout = findLayout(info)
  if (!layout || !canEdit.value || isModelTab(info)) return
  pageSetupLayout.value = layout
  pageSetupVisible.value = true
}

// ---- Tab menu (right click / long press) ----------------------------------

type MenuCommand = 'new' | 'copy' | 'rename' | 'pageSetup' | 'delete'

interface MenuItem {
  key: MenuCommand
  label: string
  disabled?: boolean
  divided?: boolean
  danger?: boolean
}

const menu = ref<{ x: number; y: number; layout: LayoutInfo }>()
const menuRef = ref<HTMLElement | null>(null)

const menuItems = computed<MenuItem[]>(() => {
  const target = menu.value?.layout
  if (!target) return []
  const items: MenuItem[] = [
    { key: 'new', label: t('main.statusBar.layoutTabs.newLayout') }
  ]
  if (isModelTab(target)) return items
  const db = currentDb()
  const layout = findLayout(target)
  items.push(
    {
      key: 'copy',
      label: t('main.statusBar.layoutTabs.copy'),
      divided: true
    },
    { key: 'rename', label: t('main.statusBar.layoutTabs.rename') },
    { key: 'pageSetup', label: t('main.statusBar.layoutTabs.pageSetup') },
    {
      key: 'delete',
      label: t('main.statusBar.layoutTabs.delete'),
      divided: true,
      danger: true,
      disabled: !db || !layout || !acapCanDeleteLayout(db, layout)
    }
  )
  return items
})

const closeMenu = () => {
  if (!menu.value) return
  menu.value = undefined
  window.removeEventListener('pointerdown', onWindowPointerDown, true)
  window.removeEventListener('keydown', onWindowKeydown, true)
  window.removeEventListener('blur', closeMenu)
  window.removeEventListener('resize', closeMenu)
}

const onWindowPointerDown = (event: PointerEvent) => {
  if (menuRef.value?.contains(event.target as Node)) return
  closeMenu()
}

const onWindowKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.stopPropagation()
    closeMenu()
  }
}

const openMenuAt = async (x: number, y: number, layout: LayoutInfo) => {
  if (!canEdit.value) return
  closeMenu()
  menu.value = { x, y, layout }
  window.addEventListener('pointerdown', onWindowPointerDown, true)
  window.addEventListener('keydown', onWindowKeydown, true)
  window.addEventListener('blur', closeMenu)
  window.addEventListener('resize', closeMenu)
  await nextTick()
  const el = menuRef.value
  if (!el || !menu.value) return
  // The tabs sit at the bottom: open upward from the pointer and keep the
  // menu inside the window.
  const rect = el.getBoundingClientRect()
  const margin = 4
  const left = Math.min(x, window.innerWidth - rect.width - margin)
  const top = y - rect.height >= margin ? y - rect.height : y
  menu.value = {
    x: Math.max(margin, left),
    y: Math.max(
      margin,
      Math.min(top, window.innerHeight - rect.height - margin)
    ),
    layout
  }
  el.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus()
}

const openMenuForEvent = (event: MouseEvent, layout: LayoutInfo) => {
  let { clientX: x, clientY: y } = event
  // Keyboard (context menu key / Shift+F10): open at the tab.
  if (x === 0 && y === 0) {
    const el = buttonRefs.get(layout.blockTableRecordId)
    const rect = el?.getBoundingClientRect()
    if (rect) {
      x = rect.left
      y = rect.top
    }
  }
  void openMenuAt(x, y, layout)
}

const handleMenuKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
  event.preventDefault()
  const buttons = Array.from(
    menuRef.value?.querySelectorAll<HTMLButtonElement>(
      'button:not(:disabled)'
    ) ?? []
  )
  if (!buttons.length) return
  const index = buttons.indexOf(document.activeElement as HTMLButtonElement)
  const step = event.key === 'ArrowDown' ? 1 : -1
  buttons[(index + step + buttons.length) % buttons.length].focus()
}

const handleMenuCommand = (command: MenuCommand) => {
  const layout = menu.value?.layout
  closeMenu()
  if (!layout) return
  switch (command) {
    case 'new':
      handleNewLayout()
      break
    case 'copy':
      handleCopyLayout(layout)
      break
    case 'rename':
      void handleRenameLayout(layout)
      break
    case 'pageSetup':
      handlePageSetup(layout)
      break
    case 'delete':
      void handleDeleteLayout(layout)
      break
  }
}

// ---- Drag to reorder -------------------------------------------------------

interface PressState {
  layout: LayoutInfo
  pointerId: number
  startX: number
  startY: number
  dragging: boolean
  timer?: ReturnType<typeof setTimeout>
}

let press: PressState | undefined
/** The click that ends a drag / long press does not select the tab. */
let suppressClick = false
const draggingId = ref<AcDbObjectId | null>(null)
const dropIndicatorX = ref<number | null>(null)
/** Target index among the paper tabs while dragging. */
let dropIndex: number | undefined

const paperTabs = () => layouts.filter(layout => !isModelTab(layout))

const endPress = () => {
  if (press?.timer) clearTimeout(press.timer)
  press = undefined
  draggingId.value = null
  dropIndicatorX.value = null
  dropIndex = undefined
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerCancel)
}

const handlePointerDown = (event: PointerEvent, layout: LayoutInfo) => {
  if (props.disabled) return
  if (event.pointerType === 'mouse' && event.button !== 0) return
  endPress()
  press = {
    layout,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    dragging: false
  }
  if (event.pointerType !== 'mouse') {
    press.timer = setTimeout(() => {
      if (!press || press.dragging) return
      const { startX, startY } = press
      suppressClick = true
      endPress()
      void openMenuAt(startX, startY, layout)
    }, LONG_PRESS_MS)
  }
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerCancel)
}

const updateDrop = (clientX: number) => {
  const root = rootRef.value
  if (!press || !root) return
  const paper = paperTabs()
  const from = paper.findIndex(
    layout => layout.blockTableRecordId === press!.layout.blockTableRecordId
  )
  const visible = paper.filter(
    layout => !overflowIds.value.includes(layout.blockTableRecordId)
  )
  if (from < 0 || !visible.length) return

  // Insert before the first visible tab whose middle is right of the pointer.
  let insertAt: number | undefined
  let x = 0
  for (const layout of visible) {
    const rect = buttonRefs
      .get(layout.blockTableRecordId)
      ?.getBoundingClientRect()
    if (!rect) continue
    if (clientX < rect.left + rect.width / 2) {
      insertAt = paper.indexOf(layout)
      x = rect.left
      break
    }
  }
  if (insertAt === undefined) {
    const last = visible[visible.length - 1]
    const rect = buttonRefs
      .get(last.blockTableRecordId)
      ?.getBoundingClientRect()
    if (!rect) return
    insertAt = paper.indexOf(last) + 1
    x = rect.right
  }
  const target = insertAt > from ? insertAt - 1 : insertAt
  dropIndex = target
  const rootRect = root.getBoundingClientRect()
  dropIndicatorX.value =
    target === from ? null : Math.round(x - rootRect.left - 1)
}

const onPointerMove = (event: PointerEvent) => {
  if (!press || event.pointerId !== press.pointerId) return
  if (!press.dragging) {
    const distance = Math.hypot(
      event.clientX - press.startX,
      event.clientY - press.startY
    )
    if (distance < DRAG_THRESHOLD) return
    if (press.timer) clearTimeout(press.timer)
    press.timer = undefined
    if (!canEdit.value || isModelTab(press.layout)) {
      endPress()
      return
    }
    press.dragging = true
    draggingId.value = press.layout.blockTableRecordId
    closeMenu()
  }
  event.preventDefault()
  updateDrop(event.clientX)
}

const onPointerUp = (event: PointerEvent) => {
  if (!press || event.pointerId !== press.pointerId) return
  if (press.dragging) {
    suppressClick = true
    const db = currentDb()
    const layout = findLayout(press.layout)
    if (db && layout && dropIndex !== undefined) {
      acapMoveLayout(db, layout, dropIndex)
    }
  }
  endPress()
  // The click (if any) follows pointerup in the same task.
  setTimeout(() => {
    suppressClick = false
  }, 0)
}

const onPointerCancel = (event: PointerEvent) => {
  if (!press || event.pointerId !== press.pointerId) return
  endPress()
}

const handleTabClick = (layout: LayoutInfo) => {
  if (suppressClick) {
    suppressClick = false
    return
  }
  handleSelectLayout(layout)
}

/** Double click renames, like AutoCAD. */
const handleTabDoubleClick = (layout: LayoutInfo) => {
  if (isModelTab(layout)) return
  void handleRenameLayout(layout)
}

onMounted(() => {
  if (!rootRef.value) return
  resizeObserver = new ResizeObserver(() => {
    scheduleUpdateOverflow()
  })
  resizeObserver.observe(rootRef.value)

  const statusBar = rootRef.value.closest('.ml-status-bar')
  const right = statusBar?.querySelector('.ml-status-bar-right')
  if (right instanceof HTMLElement) {
    // Recalculate when coordinates / other right-side controls change width.
    resizeObserver.observe(right)
  }

  scheduleUpdateOverflow()
})

onBeforeUnmount(() => {
  if (overflowFrame !== undefined) {
    cancelAnimationFrame(overflowFrame)
    overflowFrame = undefined
  }
  resizeObserver?.disconnect()
  resizeObserver = undefined
  closeMenu()
  endPress()
})
</script>

<style scoped>
.ml-layout-tabs {
  position: relative;
  display: flex;
  align-items: stretch;
  width: 100%;
  min-width: 0;
  height: var(--ml-status-bar-height);
  overflow: hidden;
  box-sizing: border-box;
  gap: 0;
}

.ml-layout-tabs-list {
  display: inline-flex;
  align-items: stretch;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  border: none;
}

.ml-layout-tabs-list :deep(.el-dropdown) {
  flex: 0 0 auto;
  display: inline-flex;
  align-self: stretch;
}

.ml-layout-tabs-list :deep(.el-button) {
  margin: 0;
}

.ml-layout-tabs-button {
  flex: 0 0 auto;
  box-sizing: border-box;
  height: 100%;
  padding: 0 4px;
  margin: 0;
}

.ml-layout-tabs-button {
  touch-action: none;
}

.ml-layout-tabs.is-dragging,
.ml-layout-tabs.is-dragging .ml-layout-tabs-button {
  cursor: grabbing;
}

.ml-layout-tabs-button.is-drag-source {
  opacity: 0.55;
}

.ml-layout-tabs-add-button {
  flex: 0 0 auto;
  box-sizing: border-box;
  height: 100%;
  min-width: 24px;
  padding: 0 4px;
  margin: 0;
}

.ml-layout-tabs-drop-indicator {
  position: absolute;
  top: 2px;
  bottom: 2px;
  width: 2px;
  border-radius: 1px;
  background: var(--el-color-primary, var(--ml-brand));
  pointer-events: none;
  z-index: 1;
}

.ml-layout-tabs-button[hidden] {
  display: none !important;
}

.ml-layout-tabs-overflow-button {
  box-sizing: border-box;
  height: 100%;
  min-width: 24px;
  padding: 0 2px;
  margin: 0;
  letter-spacing: 0;
}
</style>

<style>
.ml-layout-tabs-overflow-menu .el-dropdown-menu__item.is-selected {
  color: var(--el-color-primary, var(--ml-brand));
}

.ml-layout-tabs-menu {
  position: fixed;
  z-index: 3000;
  min-width: 160px;
  padding: 4px 0;
  box-sizing: border-box;
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base, 4px);
  box-shadow: var(--el-box-shadow-light);
  font-size: var(--el-font-size-base, 14px);
}

.ml-layout-tabs-menu-item {
  display: block;
  width: 100%;
  padding: 6px 16px;
  border: none;
  background: none;
  color: var(--el-text-color-regular);
  font: inherit;
  text-align: start;
  line-height: 20px;
  cursor: pointer;
  white-space: nowrap;
}

.ml-layout-tabs-menu-item:hover:not(:disabled),
.ml-layout-tabs-menu-item:focus-visible {
  outline: none;
  background: var(--el-fill-color-light);
  color: var(--el-color-primary, var(--ml-brand));
}

.ml-layout-tabs-menu-item.is-danger:hover:not(:disabled),
.ml-layout-tabs-menu-item.is-danger:focus-visible {
  color: var(--el-color-danger);
}

.ml-layout-tabs-menu-item:disabled {
  color: var(--el-text-color-disabled);
  cursor: not-allowed;
}

.ml-layout-tabs-menu-divider {
  height: 1px;
  margin: 4px 0;
  background: var(--el-border-color-lighter);
}
</style>
