<template>
  <ml-base-dialog
    v-model:modelValue="visible"
    :title="t('dialog.exportDrawingDlg.title', { format: formatName })"
    :width="480"
    @open="handleOpen"
    @ok="handleOk"
  >
    <ml-fieldset-group :title="t('dialog.exportSheet.section')">
      <ml-export-sheet-fields
        v-model:form="form"
        :landscape-only="request?.landscapeOnly"
        :auto-keeps-drawing="request?.autoKeepsDrawing"
        :hint="hint"
        :refresh-key="openCount"
      />
    </ml-fieldset-group>
  </ml-base-dialog>
</template>

<script setup lang="ts">
/**
 * Asks for the paper and scale before DXF / JWW / SXF export. Opened through
 * the sheet prompt installed by {@link installExportSheetPrompt}; OK answers
 * the pending request, Cancel / close cancels the export.
 */
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import MlBaseDialog from '../common/MlBaseDialog.vue'
import MlFieldsetGroup from '../common/MlFieldsetGroup.vue'
import {
  answerExportSheetRequest,
  createExportSheetForm,
  exportSheetOptions,
  exportSheetRequest,
  parseExportScale
} from './exportSheet'
import MlExportSheetFields from './MlExportSheetFields.vue'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()

const { t } = useI18n()

const visible = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v)
})

const request = computed(() => exportSheetRequest.request)
const formatName = computed(() => request.value?.formatName ?? '')
const form = reactive(createExportSheetForm())
const openCount = ref(0)

const hint = computed(() => {
  if (request.value?.autoKeepsDrawing) return t('dialog.exportSheet.dxfHint')
  if (request.value?.landscapeOnly) return t('dialog.exportSheet.jwwHint')
  return ''
})

function handleOpen() {
  Object.assign(form, createExportSheetForm())
  openCount.value++
}

function handleOk() {
  const scale = parseExportScale(form.scale)
  const options = exportSheetOptions(form)
  if (scale !== undefined && !Number.isFinite(scale)) delete options.scale
  if (request.value?.landscapeOnly) delete options.portrait
  answerExportSheetRequest(options)
}

// Cancel, the close button and Escape all close without an answer.
watch(visible, value => {
  if (!value) answerExportSheetRequest(undefined)
})
</script>
