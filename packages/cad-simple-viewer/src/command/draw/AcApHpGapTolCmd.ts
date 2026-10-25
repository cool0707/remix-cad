import { AcApContext, AcApDocManager, AcApSettingManager } from '../../app'
import {
  AcEdCommand,
  AcEdOpenMode,
  AcEdPromptDoubleOptions,
  AcEdPromptStatus
} from '../../editor'
import { AcApI18n } from '../../i18n'

/**
 * HPGAPTOL: sets the widest gap between curve ends, in drawing units, that
 * HATCH still treats as closed (0–5000). Like AutoCAD, the value belongs to
 * the user, not to the drawing, so it is kept in the settings.
 */
export class AcApHpGapTolCmd extends AcEdCommand {
  constructor() {
    super()
    this.mode = AcEdOpenMode.Review
  }

  async execute(_context: AcApContext) {
    const settings = AcApSettingManager.instance
    const options = new AcEdPromptDoubleOptions(
      AcApI18n.t('jig.hpgaptol.prompt')
    )
    options.allowNone = true
    options.allowNegative = false
    options.allowZero = true
    options.defaultValue = settings.hatchGapTolerance
    options.useDefaultValue = true
    const result = await AcApDocManager.instance.editor.getDouble(options)
    if (result.status !== AcEdPromptStatus.OK) return
    const value = result.value ?? options.defaultValue
    if (!Number.isFinite(value) || value < 0 || value > 5000) {
      this.notify(AcApI18n.t('jig.hpgaptol.outOfRange'), 'warning')
      return
    }
    settings.hatchGapTolerance = value
  }
}
