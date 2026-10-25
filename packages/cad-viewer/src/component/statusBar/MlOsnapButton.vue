<template>
  <!-- Simple profile: one switch; the snap modes live in the settings dialog. -->
  <el-tooltip
    v-if="isSimple"
    :content="
      features.osnapEnabled
        ? t('main.statusBar.osnap.on')
        : t('main.statusBar.osnap.off')
    "
    :hide-after="0"
  >
    <el-button
      class="ml-osnap-setting-button"
      data-testid="osnap-toggle"
      :aria-pressed="features.osnapEnabled"
      :icon="osnap"
      :style="{ color: iconColor }"
      @click="toggleEnabled"
    />
  </el-tooltip>
  <el-tooltip
    v-else
    :content="t('main.statusBar.osnap.tooltip')"
    :hide-after="0"
  >
    <el-dropdown trigger="click" @command="handleCommand">
      <el-button
        class="ml-osnap-setting-button"
        :icon="osnap"
        :style="{ color: iconColor }"
      />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            command="enabled"
            :icon="features.osnapEnabled ? Check : undefined"
          >
            {{ t('main.statusBar.osnap.enabled') }}
          </el-dropdown-item>
          <el-dropdown-item
            v-for="(mode, index) in ML_OSNAP_MODES"
            :key="mode.value"
            :command="mode.value"
            :divided="index === 0"
            :disabled="!features.osnapEnabled"
            :icon="
              acdbHasOsnapMode(features.osnapModes, mode.value)
                ? Check
                : undefined
            "
          >
            {{ mode.label(t) }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-tooltip>
</template>

<script lang="ts" setup>
import { Check } from '@element-plus/icons-vue'
import { AcApSettingManager } from '@mlightcad/cad-simple-viewer'
import {
  acdbHasOsnapMode,
  AcDbOsnapMode,
  acdbToggleOsnapMode
} from '@mlightcad/data-model'
import {
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElTooltip
} from 'element-plus'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useSettings } from '../../composable'
import { osnap } from '../../svg'
import { ML_OSNAP_MODES } from './osnapModes'

const { t } = useI18n()
const features = useSettings()

const isSimple = computed(() => features.operationProfile === 'simple')

const iconColor = computed(() =>
  features.osnapEnabled
    ? 'var(--el-color-primary)'
    : 'var(--el-text-color-regular)'
)

const toggleEnabled = () => {
  AcApSettingManager.instance.osnapEnabled = !features.osnapEnabled
}

/**
 * CAD profile menu: the master switch, or toggle one mode in the bitmask.
 */
const handleCommand = (command: AcDbOsnapMode | 'enabled') => {
  if (command === 'enabled') {
    toggleEnabled()
    return
  }
  AcApSettingManager.instance.osnapModes = acdbToggleOsnapMode(
    features.osnapModes,
    command
  )
}
</script>

<style scoped>
.ml-osnap-setting-button {
  border: none;
  padding: 0px;
  cursor: pointer;
  width: 30px;
}
</style>
