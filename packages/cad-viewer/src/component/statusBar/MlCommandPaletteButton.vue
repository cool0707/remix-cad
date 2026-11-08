<template>
  <el-tooltip :content="tooltip" :hide-after="0">
    <el-button
      class="ml-command-palette-button"
      data-testid="command-palette-button"
      :aria-label="tooltip"
      @mousedown.prevent
      @click="openPalette"
    >
      <el-icon class="ml-command-palette-button__icon"><search /></el-icon>
      <span class="ml-command-palette-button__label">
        {{ t('main.statusBar.commandPalette.label') }}
      </span>
      <kbd class="ml-command-palette-button__key">{{ shortcut }}</kbd>
    </el-button>
  </el-tooltip>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { AcApDocManager, acapIsMacPlatform } from '@mlightcad/cad-simple-viewer'
import { ElButton, ElIcon, ElTooltip } from 'element-plus'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

/** Ctrl+K, or ⌘K on macOS. */
const shortcut = acapIsMacPlatform() ? '⌘K' : 'Ctrl+K'

const tooltip = computed(
  () => `${t('main.statusBar.commandPalette.tooltip')} (${shortcut})`
)

const openPalette = () => {
  AcApDocManager.instance?.curView?.commandPalette.open()
}
</script>

<style scoped>
.ml-command-palette-button {
  border: none;
  padding: 0 8px;
  height: 30px;
  cursor: pointer;
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-regular);
}

.ml-command-palette-button__icon {
  margin-inline-end: 4px;
}

.ml-command-palette-button__key {
  margin-inline-start: 6px;
  padding: 0 4px;
  border: 1px solid var(--el-border-color);
  border-radius: 3px;
  color: var(--el-text-color-secondary);
  font: inherit;
  font-size: 11px;
  line-height: 16px;
}
</style>
