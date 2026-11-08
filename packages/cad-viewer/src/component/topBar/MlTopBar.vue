<!--
  Top bar of the simple profile: a thin bar instead of the ribbon.

    [≡] File name  [↶] [↷]   [ 🔍 Search…  Ctrl+K ]   [Agent] [Print] [Export ▾]

  The ≡ menu holds what only the ribbon offered (new, open, units, view,
  language, script, developer tools, settings). The search field opens the
  command palette, which also finds text in the drawing.
-->
<template>
  <div
    class="ml-top-bar"
    :aria-disabled="disabled"
    data-testid="top-bar"
  >
    <div class="ml-top-bar__start">
      <button
        ref="menuButtonRef"
        type="button"
        class="ml-top-bar__icon-button"
        :title="t('main.topBar.menu')"
        :aria-label="t('main.topBar.menu')"
        aria-haspopup="menu"
        :disabled="disabled"
        data-testid="top-bar-menu"
        @pointerdown="rememberMenuState"
        @click="openMainMenu"
      >
        <span class="ml-top-bar__svg" v-html="ICON_MENU" />
      </button>
      <span
        v-if="displayName"
        class="ml-top-bar__file-name"
        :title="displayName"
        data-testid="top-bar-file-name"
      >
        {{ displayName }}
      </span>
      <span class="ml-top-bar__separator" aria-hidden="true" />
      <button
        type="button"
        class="ml-top-bar__icon-button"
        :title="withShortcut(t('main.ribbon.tooltip.undo'), 'Z')"
        :aria-label="t('main.ribbon.tooltip.undo')"
        :disabled="disabled || !canUndo"
        data-testid="top-bar-undo"
        @click="run('undo')"
      >
        <span class="ml-top-bar__svg" v-html="ICON_UNDO" />
      </button>
      <button
        type="button"
        class="ml-top-bar__icon-button"
        :title="withShortcut(t('main.ribbon.tooltip.redo'), 'Y')"
        :aria-label="t('main.ribbon.tooltip.redo')"
        :disabled="disabled || !canRedo"
        data-testid="top-bar-redo"
        @click="run('redo')"
      >
        <span class="ml-top-bar__svg" v-html="ICON_REDO" />
      </button>
    </div>

    <div class="ml-top-bar__center">
      <button
        type="button"
        class="ml-top-bar__search"
        :title="t('main.topBar.searchTooltip')"
        :aria-label="t('main.topBar.search')"
        :disabled="disabled"
        data-testid="top-bar-search"
        @click="openSearch"
      >
        <el-icon :size="15"><Search /></el-icon>
        <span class="ml-top-bar__search-text">{{ t('main.topBar.search') }}</span>
        <kbd class="ml-top-bar__kbd">{{ searchShortcut }}</kbd>
      </button>
    </div>

    <div class="ml-top-bar__end">
      <button
        v-if="store.features.agentPlugin"
        type="button"
        class="ml-top-bar__text-button"
        :title="t('main.topBar.agentTooltip')"
        :disabled="disabled"
        data-testid="top-bar-agent"
        @click="openAgent"
      >
        <el-icon :size="16"><MagicStick /></el-icon>
        <span class="ml-top-bar__label">{{ t('main.topBar.agent') }}</span>
      </button>
      <template v-if="exportItems.length">
        <button
          type="button"
          class="ml-top-bar__text-button"
          :title="t('main.topBar.printTooltip')"
          :disabled="disabled"
          data-testid="top-bar-print"
          @click="fileMenu.run('ExportPdf')"
        >
          <el-icon :size="16"><Printer /></el-icon>
          <span class="ml-top-bar__label">{{ t('main.topBar.print') }}</span>
        </button>
        <button
          ref="exportButtonRef"
          type="button"
          class="ml-top-bar__text-button is-primary"
          :title="t('main.mainMenu.exportMenu')"
          aria-haspopup="menu"
          :disabled="disabled"
          data-testid="top-bar-export"
          @pointerdown="rememberMenuState"
          @click="openExportMenu"
        >
          <el-icon :size="16"><Download /></el-icon>
          <span class="ml-top-bar__label">{{ t('main.topBar.export') }}</span>
          <el-icon :size="12"><ArrowDown /></el-icon>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowDown,
  Download,
  MagicStick,
  Printer,
  Search
} from '@element-plus/icons-vue'
import {
  AcApDocManager,
  acapIsMacPlatform,
  AcEdContextMenu,
  type AcEdContextMenuEntry,
  ICON_REDO,
  ICON_UNDO
} from '@mlightcad/cad-simple-viewer'
import { ElIcon } from 'element-plus'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { store } from '../../app'
import {
  isDark,
  isSupportedLocale,
  LOCALE_OPTIONS,
  type MlFileMenuItem,
  toggleDark,
  useDocument,
  useFileMenu,
  useLocale,
  useSettings,
  useUndoRedo
} from '../../composable'
import { LocaleProp } from '../../locale'
import { openSearch as openSearchPalette } from './openSearch'

interface Props {
  currentLocale?: LocaleProp
}

const props = withDefaults(defineProps<Props>(), {
  currentLocale: undefined
})

const { t } = useI18n()
const features = useSettings()
const { displayName, isDocumentOpening } = useDocument()
const { canUndo, canRedo } = useUndoRedo()
const fileMenu = useFileMenu()
const { exportItems } = fileMenu
const { effectiveLocale, setLocale } = useLocale(props.currentLocale)

/** Three lines (the main menu). */
const ICON_MENU =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>'

const disabled = computed(() => isDocumentOpening.value)
const isMac = acapIsMacPlatform()
const searchShortcut = isMac ? '⌘K' : 'Ctrl+K'
const withShortcut = (label: string, key: string) =>
  `${label} (${isMac ? '⌘' : 'Ctrl+'}${key})`

const menuButtonRef = ref<HTMLElement>()
const exportButtonRef = ref<HTMLElement>()

const run = (command: string) => {
  if (disabled.value) return
  AcApDocManager.instance.sendStringToExecute(command)
}

const runLazyCommand = async (command: string) => {
  await AcApDocManager.instance.pluginManager.loadByTrigger(command)
  AcApDocManager.instance.sendStringToExecute(command)
}

const openAgent = () => {
  if (disabled.value) return
  void runLazyCommand('agent')
}

const openSearch = () => {
  if (disabled.value) return
  openSearchPalette()
}

/**
 * A press on the button that opened the menu closes the menu first (the menu
 * closes on any press outside it, before the button sees the press); the
 * click that follows must not open it again.
 */
let closedByButton: HTMLElement | undefined
let menuWasOpen = false
const rememberMenuState = (e: PointerEvent) => {
  menuWasOpen = closedByButton != null && closedByButton === e.currentTarget
}

const toMenuEntries = (items: MlFileMenuItem[]): AcEdContextMenuEntry[] => {
  const entries: AcEdContextMenuEntry[] = []
  for (const item of items) {
    if (item.divided && entries.length) entries.push('separator')
    entries.push({
      id: item.id,
      label: item.label,
      children: item.children ? toMenuEntries(item.children) : undefined
    })
  }
  return entries
}

const showMenu = (
  anchor: HTMLElement | undefined,
  entries: AcEdContextMenuEntry[],
  onPick: (id: string) => void,
  alignEnd = false
) => {
  if (!anchor || disabled.value) return
  if (menuWasOpen) {
    menuWasOpen = false
    return
  }
  const rect = anchor.getBoundingClientRect()
  const rtl = document.documentElement.dir === 'rtl'
  const x = alignEnd !== rtl ? rect.right : rect.left
  const menu = new AcEdContextMenu(entries, x, rect.bottom + 4, onPick, () => {
    // Closing during a press on this button: remember it for that press only.
    closedByButton = anchor
    setTimeout(() => {
      if (closedByButton === anchor) closedByButton = undefined
    })
  })
  if (alignEnd !== rtl) {
    // Line the menu's end edge up with the button.
    const width = menu.element.getBoundingClientRect().width
    menu.element.style.left = `${Math.max(4, rect.right - width)}px`
  }
}

/** View submenu: theme, reading mode (black on white), canvas color. */
const viewEntries = (): AcEdContextMenuEntry[] => {
  let readingMode = false
  try {
    readingMode = AcApDocManager.instance.isReadingModeEnabled()
  } catch {
    // No document yet.
  }
  const entries: AcEdContextMenuEntry[] = [
    {
      id: 'theme',
      label: isDark.value
        ? t('main.statusBar.theme.toLight')
        : t('main.statusBar.theme.toDark')
    },
    {
      id: 'readingmode',
      label: readingMode
        ? `✓ ${t('main.verticalToolbar.readingMode.text')}`
        : t('main.verticalToolbar.readingMode.text')
    }
  ]
  // The canvas color is fixed while reading mode is on.
  if (!readingMode) {
    entries.push({
      id: 'switchbg',
      label: t('main.verticalToolbar.switchBg.text')
    })
  }
  return entries
}

const mainMenuEntries = (): AcEdContextMenuEntry[] => {
  const entries: AcEdContextMenuEntry[] = [
    ...toMenuEntries(fileMenu.openItems.value)
  ]
  if (exportItems.value.length) {
    entries.push(
      'separator',
      {
        id: 'Export',
        label: t('main.mainMenu.exportMenu'),
        children: toMenuEntries(exportItems.value)
      },
      { id: 'ExportPdf', label: t('main.topBar.printMenu') }
    )
  }
  entries.push(
    'separator',
    { id: 'DrawingUnits', label: t('main.mainMenu.drawingUnits') },
    {
      id: 'view',
      label: t('main.topBar.view'),
      children: viewEntries()
    }
  )
  if (features.isShowLanguageSelector) {
    entries.push({
      id: 'language',
      label: t('main.statusBar.setting.languageSelector'),
      children: LOCALE_OPTIONS.map(option => ({
        id: `locale:${option.locale}`,
        label:
          option.locale === effectiveLocale.value
            ? `✓ ${option.label}`
            : option.label
      }))
    })
  }
  if (store.features.scriptPlugin) {
    entries.push({ id: 'script', label: t('main.topBar.script') })
  }
  if (features.isShowDevTools) {
    entries.push({
      id: 'devTools',
      label: t('main.topBar.devTools'),
      children: [
        { id: 'mem', label: t('main.toolPalette.memoryProfile.tab') },
        { id: 'openperf', label: t('main.toolPalette.openFileProfile.tab') }
      ]
    })
  }
  entries.push(
    'separator',
    { id: 'Settings', label: t('main.mainMenu.settings') },
    { id: 'About', label: t('main.mainMenu.about') }
  )
  return entries
}

const handleMainMenu = (id: string) => {
  if (id === 'theme') {
    toggleDark()
  } else if (id.startsWith('locale:')) {
    const locale = id.slice('locale:'.length)
    if (isSupportedLocale(locale)) setLocale(locale)
  } else if (id === 'script') {
    void runLazyCommand('cadscript')
  } else if (
    id === 'mem' ||
    id === 'openperf' ||
    id === 'readingmode' ||
    id === 'switchbg'
  ) {
    run(id)
  } else {
    fileMenu.run(id)
  }
}

const openMainMenu = () =>
  showMenu(menuButtonRef.value, mainMenuEntries(), handleMainMenu)

const openExportMenu = () =>
  showMenu(
    exportButtonRef.value,
    toMenuEntries(exportItems.value),
    id => fileMenu.run(id),
    true
  )
</script>

<style>
.ml-top-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 8px;
  box-sizing: border-box;
  border-bottom: 1px solid var(--ml-ui-border, var(--el-border-color));
  background: var(--ml-ui-bg, var(--el-bg-color));
  color: var(--ml-ui-text, var(--el-text-color-primary));
  font-family: var(--ml-ui-font-family, 'Noto Sans JP', system-ui, sans-serif);
  font-size: 13px;
}

.ml-top-bar__start,
.ml-top-bar__end {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 2px;
}

.ml-top-bar__end {
  justify-content: flex-end;
  gap: 6px;
}

.ml-top-bar__center {
  flex: 0 1 360px;
  min-width: 0;
  display: flex;
  justify-content: center;
}

.ml-top-bar__icon-button,
.ml-top-bar__text-button {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 30px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.ml-top-bar__icon-button {
  width: 30px;
  padding: 0;
}

.ml-top-bar__text-button {
  padding: 0 10px;
  border: 1px solid var(--ml-ui-border, var(--el-border-color));
}

.ml-top-bar__text-button.is-primary {
  border-color: transparent;
  background: var(--ml-brand-gradient, var(--el-color-primary));
  color: #fff;
}

.ml-top-bar__icon-button:hover:not(:disabled),
.ml-top-bar__text-button:not(.is-primary):hover:not(:disabled) {
  background: var(--ml-brand-soft, var(--el-fill-color-light));
}

.ml-top-bar__text-button.is-primary:hover:not(:disabled) {
  filter: brightness(1.08);
}

.ml-top-bar button:disabled {
  cursor: default;
  opacity: 0.45;
}

.ml-top-bar__svg {
  display: inline-flex;
}

.ml-top-bar__svg svg {
  width: 16px;
  height: 16px;
}

.ml-top-bar__file-name {
  min-width: 0;
  max-width: 280px;
  padding: 0 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
}

.ml-top-bar__separator {
  flex: 0 0 1px;
  align-self: stretch;
  margin: 10px 4px;
  background: var(--ml-ui-border, var(--el-border-color));
}

.ml-top-bar__search {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 30px;
  padding: 0 8px 0 10px;
  box-sizing: border-box;
  border: 1px solid var(--ml-ui-border, var(--el-border-color));
  border-radius: 8px;
  background: var(--ml-ui-fill, var(--el-fill-color-light));
  color: var(--ml-ui-text-muted, var(--el-text-color-secondary));
  font: inherit;
  text-align: start;
  cursor: text;
}

.ml-top-bar__search:hover:not(:disabled) {
  border-color: var(--ml-brand, var(--el-color-primary));
}

.ml-top-bar__search-text {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ml-top-bar__kbd {
  flex: 0 0 auto;
  padding: 0 5px;
  border: 1px solid var(--ml-ui-border, var(--el-border-color));
  border-radius: 4px;
  font: 11px/1.5 inherit;
}

/* Narrow screens: icons only, the search field becomes a magnifier. */
@media (max-width: 720px) {
  .ml-top-bar__label,
  .ml-top-bar__kbd,
  .ml-top-bar__search-text,
  .ml-top-bar__file-name {
    display: none;
  }

  .ml-top-bar__center {
    flex: 0 0 auto;
  }

  .ml-top-bar__search {
    width: 30px;
    justify-content: center;
    padding: 0;
  }
}
</style>
