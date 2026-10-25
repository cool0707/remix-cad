<template>
  <div class="ml-export-sheet-fields">
    <el-form label-position="top" class="ml-export-sheet-fields__form">
      <el-form-item :label="t('dialog.exportSheet.paper')">
        <el-select
          v-model="form.paper"
          class="ml-export-sheet-fields__control"
          :placeholder="autoLabel"
        >
          <el-option :label="autoLabel" value="" />
          <el-option
            v-for="paper in ML_EXPORT_PAPERS"
            :key="paper"
            :label="paper"
            :value="paper"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('dialog.exportSheet.orientation')">
        <el-select
          v-model="form.orientation"
          class="ml-export-sheet-fields__control"
        >
          <el-option :label="autoLabel" value="auto" />
          <el-option
            :label="t('dialog.exportSheet.landscape')"
            value="landscape"
          />
          <el-option
            :label="t('dialog.exportSheet.portrait')"
            value="portrait"
            :disabled="landscapeOnly"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="t('dialog.exportSheet.scale')"
        :error="scaleError"
      >
        <el-select
          v-model="form.scale"
          class="ml-export-sheet-fields__control"
          filterable
          allow-create
          default-first-option
          :placeholder="autoLabel"
        >
          <el-option :label="autoLabel" value="" />
          <el-option
            v-for="scale in ML_EXPORT_SCALES"
            :key="scale"
            :label="formatExportScale(scale)"
            :value="formatExportScale(scale)"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="ml-export-sheet-fields__result">{{ resultText }}</div>
    <div v-if="hint" class="ml-export-sheet-fields__hint">{{ hint }}</div>
  </div>
</template>

<script setup lang="ts">
/**
 * Paper / orientation / scale fields shared by the export dialogs (DXF, JWW,
 * SXF and PDF). Shows the sheet that will be used, resolved the same way as
 * the exporters (drawing limits, else A3 at the smallest standard scale).
 */
import {
  AcApDocManager,
  type AcApDrawingSheet,
  acapModelSpaceExtents,
  acapResolveDrawingSheet
} from '@mlightcad/cad-simple-viewer'
import { ElForm, ElFormItem, ElOption, ElSelect } from 'element-plus'
import { computed, shallowRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  exportSheetOptions,
  formatExportScale,
  ML_EXPORT_PAPERS,
  ML_EXPORT_SCALES,
  type MlExportSheetForm,
  parseExportScale
} from './exportSheet'

const props = withDefaults(
  defineProps<{
    /** The format has landscape sheets only (Jw_cad). */
    landscapeOnly?: boolean
    /** Leaving everything automatic keeps the drawing unchanged (DXF). */
    autoKeepsDrawing?: boolean
    /** Extra explanation under the fields. */
    hint?: string
    /** Recomputes the drawing extents when this changes (dialog opened). */
    refreshKey?: number
  }>(),
  {
    landscapeOnly: false,
    autoKeepsDrawing: false,
    hint: '',
    refreshKey: 0
  }
)

/** Form values (`v-model:form`). */
const form = defineModel<MlExportSheetForm>('form', { required: true })

const { t } = useI18n()

const autoLabel = computed(() => t('dialog.exportSheet.auto'))

/** Model-space extents, computed once per dialog opening. */
const extents = shallowRef<ReturnType<typeof acapModelSpaceExtents>>()
watch(
  () => props.refreshKey,
  () => {
    const db = AcApDocManager.instance.curDocument?.database
    extents.value = db ? acapModelSpaceExtents(db) : undefined
  },
  { immediate: true }
)

const scaleError = computed(() => {
  const scale = parseExportScale(form.value.scale)
  return scale !== undefined && !Number.isFinite(scale)
    ? t('dialog.exportSheet.invalidScale')
    : ''
})

const allAuto = computed(
  () =>
    !form.value.paper &&
    form.value.orientation === 'auto' &&
    parseExportScale(form.value.scale) === undefined
)

function describe(drawingSheet: AcApDrawingSheet) {
  const { sheet } = drawingSheet
  return t('dialog.exportSheet.sheetValue', {
    paper: sheet.paper,
    orientation: sheet.portrait
      ? t('dialog.exportSheet.portrait')
      : t('dialog.exportSheet.landscape'),
    scale: formatExportScale(sheet.scale)
  })
}

const resultText = computed(() => {
  if (props.autoKeepsDrawing && allAuto.value) {
    return t('dialog.exportSheet.keepDrawing')
  }
  const db = AcApDocManager.instance.curDocument?.database
  if (!db) return ''
  const options = exportSheetOptions(form.value)
  if (props.landscapeOnly) options.portrait = false
  return t('dialog.exportSheet.result', {
    value: describe(acapResolveDrawingSheet(db, options, extents.value))
  })
})
</script>

<style scoped>
.ml-export-sheet-fields__form {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: 12px;
}

.ml-export-sheet-fields__form :deep(.el-form-item) {
  margin-bottom: 8px;
}

.ml-export-sheet-fields__control {
  width: 100%;
}

.ml-export-sheet-fields__result {
  font-size: var(--ml-dialog-font-size, 12px);
  font-weight: 600;
  color: var(--el-text-color-primary);
  line-height: 1.4;
}

.ml-export-sheet-fields__hint {
  margin-top: 2px;
  font-size: 11px;
  color: var(--el-text-color-secondary);
  line-height: 1.35;
}
</style>
