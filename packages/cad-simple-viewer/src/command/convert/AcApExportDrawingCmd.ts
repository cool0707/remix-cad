import { log } from '@mlightcad/data-model'

import { AcApContext } from '../../app'
import type { AcApDrawingExporter } from '../../app/AcApDrawingExporters'
import { acapPromptExportSheet } from '../../app/AcApDrawingSheet'
import { AcEdCommand } from '../../editor'
import {
  getDrawingExportBaseName,
  resolveExportDownloadName
} from '../../util/AcApExportFileNameUtil'
import { acapI18nTranslate } from '../../util/AcApFormatUnsupportedEntitiesMessage'

/**
 * Saves the current drawing with a registered {@link AcApDrawingExporter}
 * (JWW, SXF, …) and downloads the file.
 */
export class AcApExportDrawingCmd extends AcEdCommand {
  constructor(private readonly exporter: AcApDrawingExporter) {
    super()
  }

  async execute(context: AcApContext) {
    const exporter = this.exporter
    const sourceName = context.doc.fileName || context.doc.docTitle
    const sheet = await acapPromptExportSheet({
      formatName: exporter.formatName,
      landscapeOnly: exporter.landscapeOnly
    })
    if (!sheet) return
    try {
      const result = await this.withBusyIndicator(
        () =>
          exporter.export(
            context.doc.database,
            getDrawingExportBaseName(sourceName),
            sheet
          ),
        acapI18nTranslate('main.message.exportingDrawing', {
          format: exporter.formatName
        })
      )
      download(
        result.bytes,
        resolveExportDownloadName(sourceName, exporter.extension),
        exporter.mimeType ?? 'application/octet-stream'
      )
      if (result.warnings && result.warnings.length > 0) {
        log.warn(`[${exporter.formatName}]`, result.warnings)
        this.notify(
          acapI18nTranslate('main.message.exportApproximate', {
            format: exporter.formatName
          }),
          'warning'
        )
      }
    } catch (error) {
      this.notify(
        acapI18nTranslate('main.message.exportFailed', {
          format: exporter.formatName,
          error: error instanceof Error ? error.message : String(error)
        }),
        'error'
      )
    }
  }
}

function download(bytes: Uint8Array, fileName: string, type: string) {
  const blob = new Blob([bytes as BlobPart], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}
