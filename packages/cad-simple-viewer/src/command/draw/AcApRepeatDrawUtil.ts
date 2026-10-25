import type { AcDbEntity } from '@mlightcad/data-model'

import type { AcApContext } from '../../app'
import type { AcEdPromptPointOptions } from '../../editor'
import { AcApI18n } from '../../i18n'

/**
 * Point prompts of commands that place one object after another (POINT,
 * RAY, XLINE): double-click (or Enter) ends the command and right-click
 * picks `Undo` instead of ending it.
 *
 * @param prompt - Point prompt to extend with the `Undo` keyword.
 */
export function acapAddUndoOnRightClick(prompt: AcEdPromptPointOptions) {
  prompt.keywords.add(
    AcApI18n.t('jig.line.keywords.undo.display'),
    AcApI18n.t('jig.line.keywords.undo.global'),
    AcApI18n.t('jig.line.keywords.undo.local')
  )
  prompt.allowNone = true
  prompt.finishOnDoubleClick = true
  prompt.rightClickKeyword = 'Undo'
}

/**
 * Erases the last object this command run placed and removes it from the
 * view. Does nothing when there is none.
 *
 * @param context - Current application context.
 * @param created - Objects placed so far, in order; the last one is popped.
 */
export function acapUndoLastEntity(
  context: AcApContext,
  created: AcDbEntity[]
) {
  const entity = created.pop()
  if (!entity) return
  entity.erase()
  context.view.removeEntity(entity)
}
