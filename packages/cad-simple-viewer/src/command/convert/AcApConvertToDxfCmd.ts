import { log } from '@mlightcad/data-model'

import { AcApContext } from '../../app'
import { acapDxfVersionWriter } from '../../app/AcApDrawingExporters'
import { acapPromptExportSheet } from '../../app/AcApDrawingSheet'
import { AcEdCommand } from '../../editor'
import { AcApI18n } from '../../i18n'
import { acapI18nTranslate } from '../../util/AcApFormatUnsupportedEntitiesMessage'
import { AcApDxfConvertor } from './AcApDxfConvertor'

/**
 * The "keep the drawing's own version" choice. Not an empty string: list
 * widgets treat that as "nothing selected".
 */
const SAME_VERSION = 'same'

/**
 * Command for exporting the current CAD drawing to DXF format.
 *
 * Asks for the sheet first (when a UI installed a prompt with
 * `acapSetExportSheetPrompt`); a chosen paper and scale are written as the
 * drawing limits. When a DXF version writer is installed
 * (`acapSetDxfVersionWriter`) the dialog also offers other DXF versions.
 */
export class AcApConvertToDxfCmd extends AcEdCommand {
  async execute(_context: AcApContext) {
    const writer = acapDxfVersionWriter()
    const answer = await acapPromptExportSheet({
      formatName: 'DXF',
      autoKeepsDrawing: true,
      // The drawing's own version is written by the viewer itself.
      variants: writer && [
        {
          value: SAME_VERSION,
          label: AcApI18n.t('main.message.exportSameVersion')
        },
        ...writer.versions
      ],
      defaultVariant: SAME_VERSION
    })
    if (!answer) return
    const { variant, ...sheet } = answer
    const converter = new AcApDxfConvertor()
    if (!writer || !variant || variant === SAME_VERSION) {
      await this.withBusyIndicator(() => {
        converter.convert(sheet)
      }, AcApI18n.t('main.message.exportingDxf'))
      return
    }
    try {
      const warnings = await this.withBusyIndicator(
        () => converter.convertVersion(writer, variant, sheet),
        AcApI18n.t('main.message.exportingDxf')
      )
      if (warnings.length > 0) {
        log.warn('[DXF]', warnings)
        this.notify(
          acapI18nTranslate('main.message.exportApproximate', {
            format: 'DXF'
          }),
          'warning'
        )
      }
    } catch (error) {
      this.notify(
        acapI18nTranslate('main.message.exportFailed', {
          format: 'DXF',
          error: error instanceof Error ? error.message : String(error)
        }),
        'error'
      )
    }
  }
}
