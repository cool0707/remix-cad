<template>
  <ml-base-dialog
    v-model:modelValue="visible"
    :title="t('main.statusBar.layoutTabs.pageSetupTitle', { name: layoutName })"
    :width="360"
    @open="handleOpen"
    @ok="handleOk"
  >
    <div class="ml-layout-page-setup-dlg">
      <el-form label-position="top">
        <el-form-item :label="t('main.statusBar.layoutTabs.paper')">
          <el-select
            v-model="form.paper"
            class="ml-layout-page-setup-dlg__control"
          >
            <el-option
              v-for="paper in ACAP_LAYOUT_PAPERS"
              :key="paper"
              :label="paperLabel(paper)"
              :value="paper"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('main.statusBar.layoutTabs.orientation')">
          <el-radio-group v-model="form.orientation">
            <el-radio value="landscape">
              {{ t('main.statusBar.layoutTabs.landscape') }}
            </el-radio>
            <el-radio value="portrait">
              {{ t('main.statusBar.layoutTabs.portrait') }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="ml-layout-page-setup-dlg__hint">
        {{ t('main.statusBar.layoutTabs.pageSetupHint') }}
      </div>
    </div>
  </ml-base-dialog>
</template>

<script setup lang="ts">
/**
 * Page setup of a print page (layout): paper size and orientation.
 */
import {
  ACAP_DEFAULT_LAYOUT_PAGE_SETUP,
  ACAP_LAYOUT_PAPERS,
  AcApDocManager,
  acapGetLayoutPageSetup,
  type AcApPaperName,
  acapPaperSize,
  acapSetLayoutPageSetup
} from '@mlightcad/cad-simple-viewer'
import type { AcDbLayout } from '@mlightcad/data-model'
import {
  ElForm,
  ElFormItem,
  ElOption,
  ElRadio,
  ElRadioGroup,
  ElSelect
} from 'element-plus'
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

import MlBaseDialog from '../common/MlBaseDialog.vue'

const props = defineProps<{
  modelValue: boolean
  /** Layout whose page setup is edited. */
  layout?: AcDbLayout
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

const { t } = useI18n()

const visible = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})

const layoutName = computed(() => props.layout?.layoutName ?? '')

const form = reactive<{
  paper: AcApPaperName
  orientation: 'landscape' | 'portrait'
}>({ paper: 'A3', orientation: 'landscape' })

/** `A3 (420 × 297 mm)` */
const paperLabel = (paper: AcApPaperName) => {
  const [long, short] = acapPaperSize(paper)
  return `${paper} (${long} × ${short} mm)`
}

const handleOpen = () => {
  const setup =
    (props.layout && acapGetLayoutPageSetup(props.layout)) ??
    ACAP_DEFAULT_LAYOUT_PAGE_SETUP
  form.paper = setup.paper
  form.orientation = setup.portrait ? 'portrait' : 'landscape'
}

const handleOk = () => {
  const db = AcApDocManager.instance.curDocument?.database
  if (!db || !props.layout) return
  acapSetLayoutPageSetup(db, props.layout, {
    paper: form.paper,
    portrait: form.orientation === 'portrait'
  })
}
</script>

<style scoped>
.ml-layout-page-setup-dlg {
  padding: 4px 8px;
}

.ml-layout-page-setup-dlg__control {
  width: 100%;
}

.ml-layout-page-setup-dlg__hint {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
}
</style>
