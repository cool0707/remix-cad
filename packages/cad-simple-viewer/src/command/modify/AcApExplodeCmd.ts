import { AcDbBlockReference } from '@mlightcad/data-model'

import { AcApContext } from '../../app'
import { AcEdCommand, AcEdOpenMode } from '../../editor'
import { resolveUiTheme } from '../../editor/global/AcEdUiTheme'
import { AcApI18n } from '../../i18n'
import {
  acapExplodeBlockReferences,
  acapRemoveBlockDefinitions,
  acapUnusedBlockNames,
  isEntityOnLockedLayer,
  resolveSelectedIds
} from '../../service'
import { AcUiConfirmDialog } from '../../ui/AcUiConfirmDialog'

/**
 * EXPLODE: takes the selected symbols (block references) apart into the
 * shapes they are made of. When a symbol was the last one of its kind in the
 * drawing, asks whether to remove it from the symbol list too (the definition
 * otherwise stays, as in CAD). Both steps are one undo.
 */
export class AcApExplodeCmd extends AcEdCommand {
  constructor() {
    super()
    this.mode = AcEdOpenMode.Write
  }

  async execute(context: AcApContext) {
    const ids = await resolveSelectedIds(context, 'explode')
    if (!ids) return
    const db = context.doc.database
    const refs = context.doc.entityService
      .getEntitiesByIds(ids)
      .filter(
        (entity): entity is AcDbBlockReference =>
          entity instanceof AcDbBlockReference &&
          !isEntityOnLockedLayer(db, entity)
      )
    if (!refs.length) {
      this.showMessage(AcApI18n.t('main.explode.noSymbol'), 'warning')
      return
    }

    const result = acapExplodeBlockReferences(db, refs)
    context.view.selectionSet.clear()
    if (!result.explodedCount) return

    const unused = acapUnusedBlockNames(db, result.blockNames)
    if (!unused.length) return
    const quoted = unused
      .map(name => AcApI18n.t('main.explode.quote').replace('{name}', name))
      .join(AcApI18n.t('main.explode.separator'))
    const host = context.view.container
    const remove = await AcUiConfirmDialog.open({
      host,
      theme: resolveUiTheme(host),
      title: AcApI18n.t('main.explode.removeTitle'),
      message: AcApI18n.t('main.explode.removeMessage').replace(
        '{names}',
        quoted
      ),
      ok: AcApI18n.t('main.explode.remove'),
      cancel: AcApI18n.t('main.explode.keep'),
      close: AcApI18n.t('main.textHeight.close')
    })
    if (remove) acapRemoveBlockDefinitions(db, unused)
  }
}
