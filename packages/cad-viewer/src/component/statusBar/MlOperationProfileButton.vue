<template>
  <el-tooltip :content="tooltip" :hide-after="0">
    <el-button
      class="ml-operation-profile-button"
      :aria-pressed="isSimple"
      :aria-label="tooltip"
      @click="toggleProfile"
    >
      {{ isSimple ? t('main.statusBar.operationProfile.simple') : t('main.statusBar.operationProfile.cad') }}
    </el-button>
  </el-tooltip>
</template>

<script lang="ts" setup>
import { AcApSettingManager } from '@mlightcad/cad-simple-viewer'
import { ElButton, ElTooltip } from 'element-plus'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useSettings } from '../../composable'

const features = useSettings()
const { t } = useI18n()

/** `true` for the simple profile, `false` for the CAD (classic) profile. */
const isSimple = computed(() => features.operationProfile === 'simple')

const tooltip = computed(() =>
  isSimple.value
    ? t('main.statusBar.operationProfile.simpleTooltip')
    : t('main.statusBar.operationProfile.cadTooltip')
)

const toggleProfile = () => {
  AcApSettingManager.instance.operationProfile = isSimple.value
    ? 'cad'
    : 'simple'
}
</script>

<style scoped>
.ml-operation-profile-button {
  border: none;
  padding: 0 8px;
  height: 30px;
  cursor: pointer;
  font-size: var(--el-font-size-small);
  color: var(--el-color-primary);
}
</style>
