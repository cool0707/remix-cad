import {
  AcDbBlockTableRecord,
  AcDbEntity,
  AcDbMText,
  AcDbText,
  AcGeMatrix3d,
  AcGePoint3d,
  AcGePoint3dLike
} from '@mlightcad/data-model'

import { AcApContext, AcApDocManager } from '../../app'
import {
  AcEdCommand,
  AcEdOpenMode,
  AcEdPromptKeywordOptions,
  AcEdPromptPointOptions,
  AcEdPromptStatus
} from '../../editor'
import {
  AcEdSelectionStaticPreviewJig,
  AcEdSelectionTransformPreviewJig
} from '../../editor/input/AcEdSelectionPreviewJig'
import { AcEdBaseView } from '../../editor/view/AcEdBaseView'
import { AcApI18n } from '../../i18n'
import { resolveSelectedEntities } from '../../service'
import {
  createMirrorMatrix,
  createRotationMatrix
} from '../../util/AcApGeTransform'

/** Mirrored preview while the second point of the mirror line is chosen. */
class AcApMirrorPreviewJig extends AcEdSelectionTransformPreviewJig<AcGePoint3dLike> {
  private _first: AcGePoint3d

  constructor(view: AcEdBaseView, entities: AcDbEntity[], first: AcGePoint3dLike) {
    super(view, entities)
    this._first = new AcGePoint3d(first)
  }

  get entity() {
    return this.previewEntities[0] ?? null
  }

  protected buildTransforms(point: AcGePoint3dLike) {
    const matrix = createMirrorMatrix(this._first, point)
    const targets =
      this.previewEntries.length > 0
        ? this.previewEntries
        : [{ entity: { objectId: '' } as AcDbEntity, copyFactor: 1 }]
    return targets.map(entry => ({ objectId: entry.entity.objectId, matrix }))
  }
}

function centerOf(entity: AcDbEntity) {
  try {
    const box = entity.geometricExtents
    if (!box || box.isEmpty()) return undefined
    return new AcGePoint3d(
      (box.min.x + box.max.x) / 2,
      (box.min.y + box.max.y) / 2,
      0
    )
  } catch {
    return undefined
  }
}

/**
 * Mirrors a copy of `entity`. Text stays readable (like MIRRTEXT = 0): it is
 * placed where the mirror image of the original would be, but not reversed.
 */
export function acapMirrorEntity(
  entity: AcDbEntity,
  p1: AcGePoint3dLike,
  p2: AcGePoint3dLike
): AcDbEntity | undefined {
  const copy = entity.clone() as AcDbEntity | undefined
  if (!copy) return undefined
  const matrix = createMirrorMatrix(p1, p2)
  if (!(copy instanceof AcDbText || copy instanceof AcDbMText)) {
    copy.transformBy(matrix)
    return copy
  }
  const before = centerOf(entity)
  copy.transformBy(matrix)
  // The reflected direction may run right-to-left / upside down: turn it.
  if (Math.cos(copy.rotation) < -1e-9) {
    const pivot = centerOf(copy) ?? new AcGePoint3d(0, 0, 0)
    copy.transformBy(createRotationMatrix(pivot, Math.PI))
  }
  const after = centerOf(copy)
  if (before && after) {
    const target = before.clone().applyMatrix4(matrix)
    copy.transformBy(
      new AcGeMatrix3d().makeTranslation(
        target.x - after.x,
        target.y - after.y,
        0
      )
    )
  }
  return copy
}

/**
 * MIRROR ("鏡像"): makes a mirror image of the selection across a line given
 * by two points, keeping or erasing the originals.
 */
export class AcApMirrorCmd extends AcEdCommand {
  constructor() {
    super()
    this.mode = AcEdOpenMode.Write
  }

  async execute(context: AcApContext) {
    const editor = AcApDocManager.instance.editor
    const selectionSet = context.view.selectionSet
    const resolved = await resolveSelectedEntities(context, {
      promptKey: 'mirror'
    })
    if (!resolved) return
    const { entities } = resolved

    const firstPrompt = new AcEdPromptPointOptions(
      AcApI18n.t('jig.mirror.firstPoint')
    )
    firstPrompt.jig = new AcEdSelectionStaticPreviewJig<AcGePoint3d>(
      context.view,
      entities
    )
    const first = await editor.getPoint(firstPrompt)
    if (first.status !== AcEdPromptStatus.OK) {
      selectionSet.clear()
      return
    }
    const p1 = new AcGePoint3d(first.value!)

    const secondPrompt = new AcEdPromptPointOptions(
      AcApI18n.t('jig.mirror.secondPoint')
    )
    secondPrompt.useBasePoint = true
    secondPrompt.useDashedLine = true
    secondPrompt.basePoint = p1
    secondPrompt.jig = new AcApMirrorPreviewJig(context.view, entities, p1)
    const second = await editor.getPoint(secondPrompt)
    if (second.status !== AcEdPromptStatus.OK) {
      selectionSet.clear()
      return
    }
    const p2 = new AcGePoint3d(second.value!)
    if (p1.distanceTo(p2) < 1e-9) {
      this.showMessage(AcApI18n.t('jig.mirror.samePoint'), 'warning')
      selectionSet.clear()
      return
    }

    const erasePrompt = new AcEdPromptKeywordOptions(
      AcApI18n.t('jig.mirror.eraseSource')
    )
    const yes = erasePrompt.keywords.add(
      AcApI18n.t('jig.mirror.keywords.yes.display'),
      AcApI18n.t('jig.mirror.keywords.yes.global'),
      AcApI18n.t('jig.mirror.keywords.yes.local')
    )
    const no = erasePrompt.keywords.add(
      AcApI18n.t('jig.mirror.keywords.no.display'),
      AcApI18n.t('jig.mirror.keywords.no.global'),
      AcApI18n.t('jig.mirror.keywords.no.local')
    )
    erasePrompt.keywords.default = no
    erasePrompt.allowNone = true
    const answer = await editor.getKeywords(erasePrompt)
    if (
      answer.status !== AcEdPromptStatus.OK &&
      answer.status !== AcEdPromptStatus.Keyword &&
      answer.status !== AcEdPromptStatus.None
    ) {
      selectionSet.clear()
      return
    }
    const eraseSource = answer.stringResult === yes.globalName

    const db = context.doc.database
    for (const entity of entities) {
      const copy = acapMirrorEntity(entity, p1, p2)
      if (!copy) continue
      const owner = entity.ownerId ? db.getObjectById(entity.ownerId) : undefined
      const target =
        owner instanceof AcDbBlockTableRecord
          ? owner
          : db.tables.blockTable.modelSpace
      target.appendEntity(copy)
    }
    if (eraseSource) {
      context.doc.entityService.eraseEntities(entities.map(e => e.objectId))
    }
    selectionSet.clear()
  }
}
