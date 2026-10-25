import { AcDbPoint, AcGePoint3d } from '@mlightcad/data-model'

import { AcApContext, AcApDocManager } from '../../app'
import {
  AcEdCommand,
  AcEdOpenMode,
  AcEdPromptPointOptions,
  AcEdPromptStatus
} from '../../editor'
import { AcApI18n } from '../../i18n'
import {
  acapAddUndoOnRightClick,
  acapUndoLastEntity
} from './AcApRepeatDrawUtil'

/**
 * Command to create point objects continuously.
 *
 * Behavior is aligned with AutoCAD POINT:
 * - Prompt for a point.
 * - Create one `AcDbPoint` immediately after each confirmed point.
 * - Continue prompting until the user cancels the command.
 * - Point display is controlled by the current `PDMODE` and `PDSIZE`.
 *
 * Each point is shown as soon as it is placed. Double-click (or Enter) ends
 * the command; right-click (`Undo`) removes the last point.
 */
export class AcApPointCmd extends AcEdCommand {
  constructor() {
    super()
    this.mode = AcEdOpenMode.Write
  }

  async execute(context: AcApContext) {
    const created: AcDbPoint[] = []
    while (true) {
      const pointPrompt = new AcEdPromptPointOptions(
        AcApI18n.t('jig.point.point')
      )
      acapAddUndoOnRightClick(pointPrompt)
      const pointResult =
        await AcApDocManager.instance.editor.getPoint(pointPrompt)

      if (pointResult.status === AcEdPromptStatus.Keyword) {
        acapUndoLastEntity(context, created)
        continue
      }
      if (pointResult.status !== AcEdPromptStatus.OK || !pointResult.value) {
        return
      }

      const point = new AcDbPoint()
      point.position = new AcGePoint3d(pointResult.value)
      context.doc.database.tables.blockTable.modelSpace.appendEntity(point)
      context.view.addEntity(point)
      created.push(point)
    }
  }
}
