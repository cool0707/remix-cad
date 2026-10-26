import { AcDbObjectId } from '@mlightcad/data-model'

import { AcApContext, AcApDocManager } from '../../app'
import {
  AcEdOpenMode,
  AcEdPromptEntityOptions,
  AcEdPromptStatus
} from '../../editor'
import { AcApI18n } from '../../i18n'
import { AcApLayerService } from '../../service'
import { AcApLayerMutationCmd } from './AcApLayerMutationCmd'

/**
 * AutoCAD-like `LAYLCK` command.
 */
export class AcApLayerLockCmd extends AcApLayerMutationCmd {
  constructor() {
    super()
    this.mode = AcEdOpenMode.Write
  }

  async execute(context: AcApContext) {
    // Objects whose layer this run changed; right-click (`Undo`) reverts
    // the last one.
    const history: AcDbObjectId[] = []
    while (true) {
      const objectId = await this.promptSelection()
      if (objectId === 'Undo') {
        this.undoLock(context, history.pop())
        continue
      }
      if (!objectId) return

      if (this.lockEntityLayer(context, objectId)) history.push(objectId)
    }
  }

  private undoLock(context: AcApContext, objectId?: AcDbObjectId) {
    if (!objectId) return
    const result = new AcApLayerService(
      context.doc.database
    ).unlockLayerByEntity(objectId)
    if (result.ok) {
      this.showMessage(
        `${AcApI18n.t('jig.layulk.unlocked')}: ${result.layerName}`,
        'success'
      )
    }
  }

  private async promptSelection(): Promise<AcDbObjectId | 'Undo' | undefined> {
    const prompt = new AcEdPromptEntityOptions(AcApI18n.t('jig.laylck.prompt'))
    prompt.allowNone = true
    prompt.allowObjectOnLockedLayer = true
    prompt.setRejectMessage(AcApI18n.t('jig.laylck.invalidSelection'))
    // Double-click ends; right-click undoes the last change.
    prompt.keywords.add(
      AcApI18n.t('jig.line.keywords.undo.display'),
      AcApI18n.t('jig.line.keywords.undo.global'),
      AcApI18n.t('jig.line.keywords.undo.local')
    )
    prompt.finishOnDoubleClick = true
    prompt.rightClickKeyword = 'Undo'

    const result = await AcApDocManager.instance.editor.getEntity(prompt)
    if (result.status === AcEdPromptStatus.OK && result.objectId) {
      return result.objectId
    }
    if (
      result.status === AcEdPromptStatus.Keyword &&
      result.stringResult === 'Undo'
    ) {
      return 'Undo'
    }

    return undefined
  }

  private lockEntityLayer(
    context: AcApContext,
    objectId: AcDbObjectId
  ): boolean {
    const result = new AcApLayerService(context.doc.database).lockLayerByEntity(
      objectId
    )

    if (!result.ok) {
      switch (result.reason) {
        case 'invalid_selection':
          this.showMessage(AcApI18n.t('jig.laylck.invalidSelection'), 'warning')
          return false
        case 'layer_not_found':
          this.showMessage(
            `${AcApI18n.t('jig.laylck.layerNotFound')}: ${result.layerName}`,
            'warning'
          )
          return false
        case 'already_locked':
          this.showMessage(
            `${AcApI18n.t('jig.laylck.alreadyLocked')}: ${result.layerName}`,
            'info'
          )
          return false
      }
    }

    context.view.selectionSet.clear()
    this.showMessage(
      `${AcApI18n.t('jig.laylck.locked')}: ${result.layerName}`,
      'success'
    )
    return true
  }
}
