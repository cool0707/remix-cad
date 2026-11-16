import { AcGePoint3d, AcGePoint3dLike } from '@mlightcad/data-model'

import { AcApContext, AcApDocManager } from '../../app'
import {
  AcEdCommand,
  AcEdOpenMode,
  AcEdPromptEntityOptions,
  AcEdPromptPointOptions,
  AcEdPromptStatus
} from '../../editor'
import { AcApI18n } from '../../i18n'
import { AcApCurveEditSession } from './AcApCurveEditSession'
import {
  acapBreakPieces,
  acapProjectOnPath,
  acapReadCurvePath
} from './AcApCurvePath'

/**
 * BREAK ("部分削除"): removes the part of a line, arc, circle or polyline
 * between two points. The point where the object is picked is the first
 * point ("First point" picks it again); the second point on the same spot
 * splits the object in two. On circles the part from the first to the
 * second point counter-clockwise goes.
 */
export class AcApBreakCmd extends AcEdCommand {
  constructor() {
    super()
    this.mode = AcEdOpenMode.Write
  }

  async execute(context: AcApContext) {
    context.view.selectionSet.clear()
    const editor = AcApDocManager.instance.editor
    const db = context.doc.database

    const prompt = new AcEdPromptEntityOptions(
      AcApI18n.t('jig.break.selectObject')
    )
    prompt.setRejectMessage(AcApI18n.t('jig.break.unsupported'))
    const picked = await editor.getEntity(prompt)
    if (picked.status !== AcEdPromptStatus.OK || !picked.objectId) return

    const entity = db.tables.blockTable.getEntityById(picked.objectId)
    const path = entity ? acapReadCurvePath(entity) : undefined
    if (!entity || !path) {
      this.showMessage(AcApI18n.t('jig.break.unsupported'), 'warning')
      return
    }
    const session = new AcApCurveEditSession(context)
    if (session.isLocked(entity)) {
      this.showMessage(AcApI18n.t('main.message.onLockedLayer'), 'warning')
      return
    }

    const cur = context.view.curPos
    let first: AcGePoint3dLike = picked.pickedPoint ?? { x: cur.x, y: cur.y, z: 0 }
    let second: AcGePoint3dLike | undefined
    while (!second) {
      const secondPrompt = new AcEdPromptPointOptions(
        AcApI18n.t('jig.break.secondPoint')
      )
      secondPrompt.keywords.add(
        AcApI18n.t('jig.break.keywords.first.display'),
        AcApI18n.t('jig.break.keywords.first.global'),
        AcApI18n.t('jig.break.keywords.first.local')
      )
      secondPrompt.useBasePoint = true
      secondPrompt.useDashedLine = true
      secondPrompt.basePoint = new AcGePoint3d(first.x, first.y, 0)
      const result = await editor.getPoint(secondPrompt)
      if (result.status === AcEdPromptStatus.Keyword) {
        const firstPrompt = new AcEdPromptPointOptions(
          AcApI18n.t('jig.break.firstPoint')
        )
        const firstResult = await editor.getPoint(firstPrompt)
        if (firstResult.status !== AcEdPromptStatus.OK) return
        first = firstResult.value!
        continue
      }
      if (result.status !== AcEdPromptStatus.OK) return
      second = result.value!
    }

    const t1 = acapProjectOnPath(path, first).t
    const t2 = acapProjectOnPath(path, second).t
    const pieces = acapBreakPieces(path, t1, t2)
    if (pieces == null) {
      this.showMessage(AcApI18n.t('jig.break.samePoint'), 'warning')
      return
    }
    session.replaceWithPieces(entity, path, pieces)
  }
}
