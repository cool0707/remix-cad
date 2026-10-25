import { AcApContext } from '../../app'
import { acapPromptExportSheet } from '../../app/AcApDrawingSheet'
import { AcEdCommand } from '../../editor'
import { AcApI18n } from '../../i18n'
import { AcApDxfConvertor } from './AcApDxfConvertor'

/**
 * Command for exporting the current CAD drawing to DXF format.
 *
 * Asks for the sheet first (when a UI installed a prompt with
 * `acapSetExportSheetPrompt`); a chosen paper and scale are written as the
 * drawing limits.
 */
export class AcApConvertToDxfCmd extends AcEdCommand {
  async execute(_context: AcApContext) {
    const sheet = await acapPromptExportSheet({
      formatName: 'DXF',
      autoKeepsDrawing: true
    })
    if (!sheet) return
    await this.withBusyIndicator(() => {
      const converter = new AcApDxfConvertor()
      converter.convert(sheet)
    }, AcApI18n.t('main.message.exportingDxf'))
  }
}
