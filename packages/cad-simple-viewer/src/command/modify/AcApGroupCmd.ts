import { AcApContext } from '../../app'
import type { AcEdBaseView } from '../../editor'
import { AcEdCommand, AcEdOpenMode } from '../../editor'
import { AcApI18n } from '../../i18n'
import {
  acapCreateGroup,
  acapGroupsOfEntity,
  acapRemoveGroups,
  acapSuggestGroupName,
  resolveSelectedIds
} from '../../service'

/**
 * Whether the contents of a symbol are being edited: those entities are
 * copies shown on the canvas, so they cannot be grouped.
 */
function isEditingSymbol(view: AcEdBaseView) {
  return !!(view as { symbolEdit?: { isActive?: boolean } }).symbolEdit
    ?.isActive
}

/**
 * GROUP: puts the selected entities into a new group named `グループ1`,
 * `グループ2` ... (renamed in the group panel). Selected groups go inside the
 * new one. One undo step.
 */
export class AcApGroupCmd extends AcEdCommand {
  constructor() {
    super()
    this.mode = AcEdOpenMode.Write
  }

  async execute(context: AcApContext) {
    if (isEditingSymbol(context.view)) {
      this.showMessage(AcApI18n.t('main.group.inSymbol'), 'warning')
      return
    }
    const ids = await resolveSelectedIds(context, 'group')
    if (!ids) return
    const db = context.doc.database
    const name = acapSuggestGroupName(db, AcApI18n.t('main.group.namePrefix'))
    const group = acapCreateGroup(db, ids, name)
    if (!group) {
      this.showMessage(AcApI18n.t('main.group.nothingSelected'), 'warning')
      return
    }
    // Keep the new group selected.
    context.view.selectionSet.clear()
    context.view.selectionSet.add(group.entityIds.slice())
    this.showMessage(
      AcApI18n.t('main.group.created').replace('{name}', name),
      'success'
    )
  }
}

/**
 * UNGROUP: removes the outermost group of each selected entity (groups
 * inside it stay, so ungrouping goes one level at a time). The entities
 * stay selected. One undo step.
 */
export class AcApUngroupCmd extends AcEdCommand {
  constructor() {
    super()
    this.mode = AcEdOpenMode.Write
  }

  async execute(context: AcApContext) {
    if (isEditingSymbol(context.view)) {
      this.showMessage(AcApI18n.t('main.group.inSymbol'), 'warning')
      return
    }
    const ids = await resolveSelectedIds(context, 'ungroup')
    if (!ids) return
    const db = context.doc.database
    const groupIds = new Set<string>()
    for (const id of ids) {
      const outer = acapGroupsOfEntity(db, id)[0]
      if (outer) groupIds.add(outer.id)
    }
    if (groupIds.size === 0) {
      this.showMessage(AcApI18n.t('main.group.noGroup'), 'warning')
      return
    }
    const count = acapRemoveGroups(db, [...groupIds])
    this.showMessage(
      AcApI18n.t('main.group.removed').replace('{count}', String(count)),
      'success'
    )
  }
}
