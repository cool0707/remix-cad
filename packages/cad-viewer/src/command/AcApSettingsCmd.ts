import { AcApContext, AcEdCommand } from '@mlightcad/cad-simple-viewer'

import { useDialogManager } from '../composable'

/**
 * Opens the settings dialog (operation profile, selection, display).
 * Also reachable from the command line (`OPTIONS`) when the ribbon, with its
 * File menu and settings button, is hidden.
 */
export class AcApSettingsCmd extends AcEdCommand {
  async execute(_context: AcApContext) {
    const { toggleDialog } = useDialogManager()
    toggleDialog('SettingsDlg', true)
  }
}
