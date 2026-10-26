<template>
  <el-tooltip
    :content="t('main.verticalToolbar.readingMode.description')"
    :hide-after="0"
    :show-after="500"
  >
    <el-button
      class="ml-ribbon-reading-mode-button"
      :class="{ 'is-on': readingModeEnabled }"
      :aria-pressed="readingModeEnabled"
      :disabled="disabled"
      size="small"
      round
      @click="toggleReadingMode"
    >
      {{ t('main.verticalToolbar.readingMode.text') }}
    </el-button>
  </el-tooltip>
  <el-tooltip
    :content="
      readingModeEnabled
        ? t('main.verticalToolbar.switchBg.disabledInReadingMode')
        : t('main.verticalToolbar.switchBg.description')
    "
    :hide-after="0"
    :show-after="500"
  >
    <!-- A disabled button gets no hover events; the span keeps the tooltip. -->
    <span class="ml-ribbon-switch-bg-wrapper">
      <el-button
        class="ml-ribbon-header-button"
        :aria-label="t('main.verticalToolbar.switchBg.description')"
        :disabled="disabled || readingModeEnabled"
        :icon="switchBg"
        text
        circle
        @click="switchBackground"
      />
    </span>
  </el-tooltip>
</template>

<script setup lang="ts">
import { AcApDocManager } from '@mlightcad/cad-simple-viewer'
import { ElButton, ElTooltip } from 'element-plus'
import { onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { switchBg } from '../../svg/toolbarIcons'

/** Reading mode (black on white) and the white / black canvas switch. */
defineProps<{ disabled?: boolean }>()

const { t } = useI18n()
const readingModeEnabled = ref(false)

const syncReadingMode = () => {
  try {
    readingModeEnabled.value = AcApDocManager.instance.isReadingModeEnabled()
  } catch {
    readingModeEnabled.value = false
  }
}

const toggleReadingMode = () => {
  AcApDocManager.instance.sendStringToExecute('readingmode')
}

const switchBackground = () => {
  if (readingModeEnabled.value) return
  AcApDocManager.instance.sendStringToExecute('switchbg')
}

onMounted(() => {
  const docs = AcApDocManager.instance
  docs.editor.events.commandEnded.addEventListener(syncReadingMode)
  docs.events.documentActivated.addEventListener(syncReadingMode)
  syncReadingMode()
})

onUnmounted(() => {
  const docs = AcApDocManager.instance
  docs.editor.events.commandEnded.removeEventListener(syncReadingMode)
  docs.events.documentActivated.removeEventListener(syncReadingMode)
})
</script>

<style scoped>
/* Off: outline in the accent color. On: filled toggle. */
.ml-ribbon-reading-mode-button {
  height: 24px;
  margin: 0 4px;
  padding: 0 10px;
  font-size: 12px;
  color: var(--ml-ui-accent, var(--ml-brand));
  background-color: transparent;
  border: 1px solid var(--ml-ui-accent, var(--ml-brand));
}

.ml-ribbon-reading-mode-button:hover,
.ml-ribbon-reading-mode-button:focus-visible {
  color: var(--ml-ui-accent, var(--ml-brand));
  background-color: var(--ml-brand-soft, transparent);
  border-color: var(--ml-ui-accent, var(--ml-brand));
}

.ml-ribbon-reading-mode-button.is-on,
.ml-ribbon-reading-mode-button.is-on:hover,
.ml-ribbon-reading-mode-button.is-on:focus-visible {
  color: #fff;
  background-color: var(--ml-ui-accent, var(--ml-brand));
  border-color: var(--ml-ui-accent, var(--ml-brand));
}

.ml-ribbon-reading-mode-button.is-on:hover {
  filter: brightness(1.08);
}

.ml-ribbon-switch-bg-wrapper {
  display: inline-flex;
}
</style>
