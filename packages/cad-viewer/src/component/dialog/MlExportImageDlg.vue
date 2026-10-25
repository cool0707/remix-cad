<template>
  <ml-base-dialog
    v-model:modelValue="visible"
    :title="t('dialog.exportImageDlg.title')"
    :width="560"
    :auto-close="false"
    @open="handleOpen"
    @ok="handleOk"
  >
    <div class="ml-export-image-dlg">
      <ml-fieldset-group :title="t('dialog.exportPdfDlg.modelSpaceSection')">
        <ml-choice-cards v-model="form.fit" :options="canvasOptions" />
        <ml-export-sheet-fields
          v-if="form.fit === 'sheet'"
          v-model:form="sheetForm"
          class="ml-export-image-dlg__sheet"
          :refresh-key="openCount"
        />
      </ml-fieldset-group>

      <ml-fieldset-group :title="t('dialog.exportImageDlg.imageSection')">
        <el-form label-position="top" class="ml-export-image-dlg__form">
          <el-form-item :label="t('dialog.exportImageDlg.format')">
            <el-select v-model="form.format" class="ml-export-image-dlg__control">
              <el-option
                v-for="format in FORMATS"
                :key="format.value"
                :label="format.label"
                :value="format.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="form.fit === 'sheet'"
            :label="t('dialog.exportImageDlg.resolution')"
          >
            <el-select v-model="form.dpi" class="ml-export-image-dlg__control">
              <el-option
                v-for="dpi in RESOLUTIONS"
                :key="dpi"
                :label="`${dpi} dpi`"
                :value="dpi"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-else :label="t('dialog.exportImageDlg.longSide')">
            <el-input-number
              v-model="form.longSide"
              class="ml-export-image-dlg__control"
              :min="16"
              :max="maxLongSide"
              :step="256"
              controls-position="right"
            />
          </el-form-item>
        </el-form>
        <div class="ml-export-image-dlg__size">{{ sizeText }}</div>
      </ml-fieldset-group>
    </div>
  </ml-base-dialog>
</template>

<script setup lang="ts">
/**
 * Image export (`cimage`): frames the canvas like the PDF export (current
 * view, object extents or a paper size at a scale) and writes PNG, JPEG or
 * BMP or TIFF. Exporting a picked window is still available as `pngout` (File →
 * Export → Export selected area as image).
 */
import {
  AcApDocManager,
  AcApI18n,
  AcApRasterImageConvertor,
  type AcApRasterImageFormat,
  acapResolveDrawingSheet,
  resolveDrawingExtents
} from '@mlightcad/cad-simple-viewer'
import { AcGeBox2d } from '@mlightcad/data-model'
import {
  ElForm,
  ElFormItem,
  ElInputNumber,
  ElOption,
  ElSelect
} from 'element-plus'
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import MlBaseDialog from '../common/MlBaseDialog.vue'
import MlFieldsetGroup from '../common/MlFieldsetGroup.vue'
import { canvasFitOptions, type MlExportCanvasFit } from './exportCanvas'
import { createExportSheetForm, exportSheetOptions } from './exportSheet'
import MlChoiceCards from './MlChoiceCards.vue'
import MlExportSheetFields from './MlExportSheetFields.vue'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()

const { t } = useI18n()

const visible = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v)
})

const FORMATS: { value: AcApRasterImageFormat; label: string }[] = [
  { value: 'png', label: 'PNG' },
  { value: 'jpeg', label: 'JPEG' },
  { value: 'bmp', label: 'BMP' },
  { value: 'tiff', label: 'TIFF' }
]
const RESOLUTIONS = [72, 96, 150, 200, 300]

interface ImageForm {
  fit: MlExportCanvasFit
  format: AcApRasterImageFormat
  longSide: number
  dpi: number
}

function defaultForm(): ImageForm {
  return { fit: 'extents', format: 'png', longSide: 2048, dpi: 150 }
}

const form = reactive<ImageForm>(defaultForm())
const sheetForm = reactive(createExportSheetForm())
const openCount = ref(0)
const maxLongSide = ref(8192)

const canvasOptions = computed(() => canvasFitOptions(t))

function handleOpen() {
  Object.assign(form, defaultForm())
  Object.assign(sheetForm, createExportSheetForm())
  openCount.value++
  maxLongSide.value = AcApRasterImageConvertor.maxLongSide()
}

/** Paper size of the sheet, when the canvas is framed on a sheet. */
function resolveSheet() {
  const db = AcApDocManager.instance.curDocument.database
  return acapResolveDrawingSheet(db, exportSheetOptions(sheetForm))
}

/** Width / height of the framed area (for the pixel size). */
const aspect = computed(() => {
  openCount.value
  const docManager = AcApDocManager.instance
  if (form.fit === 'sheet') {
    const { sheet } = resolveSheet()
    return sheet.width / sheet.height
  }
  if (form.fit === 'display') {
    const view = docManager.curView
    return view.width / Math.max(view.height, 1)
  }
  const box = resolveDrawingExtents(
    docManager.curView as never,
    docManager.curDocument.database
  )
  if (!box || box.isEmpty()) return 1
  return (box.max.x - box.min.x) / Math.max(box.max.y - box.min.y, 1e-9)
})

/** Requested long side in pixels (sheet: paper size at the resolution). */
const requestedLongSide = computed(() => {
  if (form.fit !== 'sheet') return form.longSide
  const { sheet } = resolveSheet()
  return Math.round((Math.max(sheet.width, sheet.height) / 25.4) * form.dpi)
})

const sizeText = computed(() => {
  const longSide = Math.min(requestedLongSide.value, maxLongSide.value)
  const a = Number.isFinite(aspect.value) && aspect.value > 0 ? aspect.value : 1
  const width = a >= 1 ? longSide : Math.max(1, Math.round(longSide * a))
  const height = a >= 1 ? Math.max(1, Math.round(longSide / a)) : longSide
  const size = t('dialog.exportImageDlg.pixelSize', { width, height })
  return requestedLongSide.value > maxLongSide.value
    ? `${size} ${t('dialog.exportImageDlg.limited', { max: maxLongSide.value })}`
    : size
})

async function handleOk() {
  const docManager = AcApDocManager.instance
  const view = docManager.curView
  const fit = form.fit
  const longSide = requestedLongSide.value
  const converter = new AcApRasterImageConvertor(form.format)
  if (fit === 'sheet') converter.dpi = form.dpi
  visible.value = false
  try {
    await docManager.withBusyIndicator(async () => {
      let bounds: AcGeBox2d | undefined
      if (fit === 'extents') {
        await (view as { waitUntilIdle?: () => Promise<unknown> }).waitUntilIdle?.()
        bounds = resolveDrawingExtents(
          view as never,
          docManager.curDocument.database
        )
      } else if (fit === 'sheet') {
        const { min, max } = resolveSheet()
        bounds = new AcGeBox2d()
        bounds.min.set(min.x, min.y)
        bounds.max.set(max.x, max.y)
      }
      await converter.convert(bounds, longSide)
    }, AcApI18n.t('main.message.exportingEntityPreview'))
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    docManager.editor.showMessage(message, 'error')
  }
}
</script>

<style scoped>
.ml-export-image-dlg {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ml-export-image-dlg__sheet {
  margin-top: 10px;
}

.ml-export-image-dlg__form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 12px;
}

.ml-export-image-dlg__form :deep(.el-form-item) {
  margin-bottom: 8px;
}

.ml-export-image-dlg__control {
  width: 100%;
}

.ml-export-image-dlg__size {
  font-size: var(--ml-dialog-font-size, 12px);
  font-weight: 600;
  color: var(--el-text-color-primary);
  line-height: 1.4;
}
</style>
