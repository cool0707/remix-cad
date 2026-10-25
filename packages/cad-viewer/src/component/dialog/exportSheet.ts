import {
  type AcApExportSheetRequest,
  type AcApPaperName,
  acapSetExportSheetPrompt,
  type AcApSheetOptions} from '@mlightcad/cad-simple-viewer'
import { reactive } from 'vue'

/** Form values of {@link MlExportSheetFields}; `''` / `'auto'` mean automatic. */
export interface MlExportSheetForm {
  paper: AcApPaperName | ''
  orientation: 'auto' | 'landscape' | 'portrait'
  /** Scale as typed: `1:100`, `1/100` or `100`; `''` = automatic. */
  scale: string
}

export const ML_EXPORT_PAPERS: AcApPaperName[] = ['A0', 'A1', 'A2', 'A3', 'A4']

/** Scales offered in the scale list (any `1:N` can be typed). */
export const ML_EXPORT_SCALES = [
  1, 2, 5, 10, 20, 25, 30, 50, 100, 150, 200, 250, 300, 500, 1000, 2000, 2500,
  5000, 10000
]

export function createExportSheetForm(): MlExportSheetForm {
  return { paper: '', orientation: 'auto', scale: '' }
}

/**
 * Scale denominator of `1:100`, `1/100` or `100` (`undefined` for empty
 * input, `NaN` for invalid input).
 */
export function parseExportScale(value: string): number | undefined {
  const text = value.trim().replace(/\s+/g, '')
  if (!text) return undefined
  const match = /^(?:1[:：/])?(\d+(?:\.\d+)?)$/.exec(text)
  const scale = match ? Number(match[1]) : NaN
  return scale > 0 ? scale : NaN
}

/** Sheet options of the form (automatic fields left unset). */
export function exportSheetOptions(form: MlExportSheetForm): AcApSheetOptions {
  const options: AcApSheetOptions = {}
  if (form.paper) options.paper = form.paper
  if (form.orientation !== 'auto') {
    options.portrait = form.orientation === 'portrait'
  }
  const scale = parseExportScale(form.scale)
  if (scale && Number.isFinite(scale)) options.scale = scale
  return options
}

/** `1:100`, `1:2.5` */
export function formatExportScale(scale: number) {
  return `1:${Number(scale.toPrecision(10))}`
}

/** Pending sheet question of the DXF / JWW / SXF export dialog. */
export const exportSheetRequest = reactive<{
  request?: AcApExportSheetRequest
  resolve?: (options: AcApSheetOptions | undefined) => void
}>({})

/**
 * Installs the export dialog as the viewer's sheet prompt: DXF / JWW / SXF
 * exports open it before they run.
 *
 * @param open - Shows the dialog (it reads {@link exportSheetRequest})
 */
export function installExportSheetPrompt(open: () => void) {
  acapSetExportSheetPrompt(
    request =>
      new Promise(resolve => {
        // A dialog left open by an earlier request counts as cancelled.
        exportSheetRequest.resolve?.(undefined)
        exportSheetRequest.request = request
        exportSheetRequest.resolve = resolve
        open()
      })
  )
}

/** Answers the pending request (`undefined` = cancelled). */
export function answerExportSheetRequest(options: AcApSheetOptions | undefined) {
  const resolve = exportSheetRequest.resolve
  exportSheetRequest.resolve = undefined
  resolve?.(options)
}
