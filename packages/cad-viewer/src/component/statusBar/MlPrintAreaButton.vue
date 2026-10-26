<template>
  <ml-toggle-button
    v-model="isShowPrintArea"
    :data="printAreaBtnData"
    @click="togglePrintArea"
  />
</template>

<script lang="ts" setup>
import { AcApSettingManager } from '@mlightcad/cad-simple-viewer'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useSettings } from '../../composable'
import { markComponentConfigRaw } from '../../composable/markComponentConfigRaw'
import { printArea } from '../../svg'
import { MlToggleButton } from '../common'

const { t } = useI18n()
const features = useSettings()

const printAreaBtnData = computed(() =>
  markComponentConfigRaw({
    onIcon: printArea,
    offIcon: printArea,
    onTooltip: t('main.statusBar.printArea.on'),
    offTooltip: t('main.statusBar.printArea.off'),
    onColor: 'var(--el-color-primary)',
    offColor: 'var(--el-text-color-regular)'
  })
)

const isShowPrintArea = computed(() => !!features.isShowPrintArea)

const togglePrintArea = () => {
  AcApSettingManager.instance.set('isShowPrintArea', !isShowPrintArea.value)
}
</script>
