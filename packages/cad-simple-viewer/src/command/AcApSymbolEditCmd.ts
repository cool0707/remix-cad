import { AcApContext } from '../app'
import { AcEdCommand, AcEdOpenMode } from '../editor'
import { AcApI18n } from '../i18n'
import type { AcTrView2d } from '../view/AcTrView2d'

/**
 * Starts editing the contents of the selected symbol in place (`REFEDIT`).
 *
 * The work is done by the view's {@link AcApSymbolEditController}. The
 * command does not record an undo step of its own: the contents shown on
 * the canvas while editing must not become part of one.
 */
export class AcApSymbolEditCmd extends AcEdCommand {
  constructor() {
    super()
    this.mode = AcEdOpenMode.Write
    this.recordsUndoStack = false
  }

  async execute(context: AcApContext) {
    const view = context.view as AcTrView2d
    const symbolEdit = view.symbolEdit
    const selected = view.selectionSet.ids
    const target = selected.find(id => symbolEdit.canEnter(id))
    if (selected.length !== 1 || target === undefined) {
      // Say why the one selected symbol cannot be edited, if that is it.
      const reason =
        selected.length === 1 ? symbolEdit.whyNotEditable(selected[0]) : ''
      this.showMessage(
        reason || AcApI18n.t('main.symbolEdit.selectOne'),
        'warning'
      )
      return
    }
    symbolEdit.enter(target)
  }
}

/**
 * Stops editing the innermost symbol and applies the result to every
 * placed copy of it (`REFCLOSE`).
 */
export class AcApSymbolEditCloseCmd extends AcEdCommand {
  constructor() {
    super()
    this.mode = AcEdOpenMode.Write
    this.recordsUndoStack = false
  }

  async execute(context: AcApContext) {
    const view = context.view as AcTrView2d
    view.symbolEdit.exit()
  }
}
