import { AcApContext, AcEdCommand } from '@mlightcad/cad-simple-viewer'

import { useDialogManager } from '../composable'

/**
 * Opens the Export image dialog (`cimage`).
 *
 * The dialog collects export options and runs the image export on OK.
 * Picking a window instead is `pngout`.
 */
export class AcApExportImageDlgCmd extends AcEdCommand {
  async execute(_context: AcApContext) {
    const { toggleDialog } = useDialogManager()
    toggleDialog('ExportImageDlg', true)
  }
}
