import {
  AcDbEntity,
  AcDbIntersect,
  AcGeBox2d,
  AcGeVector2d
} from '@mlightcad/data-model'

import { AcApContext, AcApDocManager } from '../../app'
import {
  AcEdCommand,
  AcEdOpenMode,
  AcEdPromptEntityOptions,
  AcEdPromptStatus
} from '../../editor'
import { AcApI18n } from '../../i18n'
import {
  AcApCurveEditSession,
  acapEntitiesInBox,
  acapPathBox
} from './AcApCurveEditSession'
import {
  AcApCurvePath,
  acapEndSegEntity,
  acapExtendPath,
  acapNearerEnd,
  acapParamsOfPoints,
  acapProjectOnPath,
  acapReadCurvePath,
  acapTrimPieces,
  AcApXY} from './AcApCurvePath'

/**
 * Shared loop of TRIM and EXTEND: pick objects one after another (each pick
 * is edited against every other object shown), "Undo" takes back the last
 * pick, Enter / Esc ends.
 *
 * Like the "quick" mode of current CAD programs, there is no separate step to
 * choose the cutting edges / boundaries: all shown objects act as such.
 */
abstract class AcApPickEditCmd extends AcEdCommand {
  /** Key under `jig.<key>` for the messages of this command */
  protected abstract readonly key: 'trim' | 'extend'

  constructor() {
    super()
    this.mode = AcEdOpenMode.Write
  }

  /**
   * Edits one picked object. Returns a message key under `jig.<key>.` when
   * nothing could be done.
   */
  protected abstract edit(
    context: AcApContext,
    session: AcApCurveEditSession,
    entity: AcDbEntity,
    path: AcApCurvePath,
    pick: AcApXY
  ): string | undefined

  async execute(context: AcApContext) {
    context.view.selectionSet.clear()
    const session = new AcApCurveEditSession(context)
    const db = context.doc.database
    while (true) {
      const prompt = new AcEdPromptEntityOptions(
        AcApI18n.t(`jig.${this.key}.selectObject`)
      )
      prompt.allowNone = true
      prompt.keywords.add(
        AcApI18n.t('jig.line.keywords.undo.display'),
        AcApI18n.t('jig.line.keywords.undo.global'),
        AcApI18n.t('jig.line.keywords.undo.local')
      )
      prompt.finishOnDoubleClick = true
      prompt.rightClickKeyword = 'Undo'
      prompt.setRejectMessage(AcApI18n.t(`jig.${this.key}.unsupported`))
      const result = await AcApDocManager.instance.editor.getEntity(prompt)
      if (result.status === AcEdPromptStatus.Keyword) {
        if (result.stringResult === 'Undo' && !session.undo()) {
          this.showMessage(AcApI18n.t('jig.curveEdit.nothingToUndo'), 'info')
        }
        continue
      }
      if (result.status !== AcEdPromptStatus.OK || !result.objectId) return

      const entity = db.tables.blockTable.getEntityById(result.objectId)
      const path = entity ? acapReadCurvePath(entity) : undefined
      if (!entity || !path) {
        this.showMessage(AcApI18n.t(`jig.${this.key}.unsupported`), 'warning')
        continue
      }
      if (session.isLocked(entity)) {
        this.showMessage(AcApI18n.t('main.message.onLockedLayer'), 'warning')
        continue
      }
      const pick = result.pickedPoint ?? context.view.curPos
      const warning = this.edit(context, session, entity, path, pick)
      if (warning) {
        this.showMessage(AcApI18n.t(`jig.${this.key}.${warning}`), 'warning')
      }
    }
  }
}

/**
 * TRIM: removes the part of the picked object between the nearest
 * intersections with other objects on either side of the pick. An object
 * that crosses nothing is removed as a whole.
 */
export class AcApTrimCmd extends AcApPickEditCmd {
  protected readonly key = 'trim'

  protected edit(
    context: AcApContext,
    session: AcApCurveEditSession,
    entity: AcDbEntity,
    path: AcApCurvePath,
    pick: AcApXY
  ) {
    const box = acapPathBox(path)
    const hits: AcApXY[] = []
    for (const other of acapEntitiesInBox(context, box, entity)) {
      try {
        hits.push(...entity.intersectWith(other, AcDbIntersect.OnBothOperands))
      } catch {
        // Objects without curve geometry do not cut.
      }
    }
    const cuts = acapParamsOfPoints(path, hits)
    const pickT = acapProjectOnPath(path, pick).t
    const pieces = acapTrimPieces(path, cuts, pickT)
    if (pieces == null) return 'needTwoCuts'
    session.replaceWithPieces(entity, path, pieces)
    return undefined
  }
}

/** Area that an extension of the `end` of `path` can reach. */
function extensionSearchBox(
  context: AcApContext,
  path: AcApCurvePath,
  end: 'start' | 'end'
) {
  const own = acapPathBox(path)
  const seg = end === 'start' ? path.segs[0] : path.segs[path.segs.length - 1]
  if (seg.kind === 'arc') {
    return new AcGeBox2d()
      .expandByPoint({ x: seg.c.x - seg.r, y: seg.c.y - seg.r })
      .expandByPoint({ x: seg.c.x + seg.r, y: seg.c.y + seg.r })
      .union(own)
  }
  const extents = context.view.getDrawingExtents()
  const from = end === 'end' ? seg.b : seg.a
  const other = end === 'end' ? seg.a : seg.b
  const dx = from.x - other.x
  const dy = from.y - other.y
  const l = Math.hypot(dx, dy) || 1
  let reach = l * 1000
  if (extents && !extents.isEmpty()) {
    const size = extents.getSize(new AcGeVector2d())
    reach = Math.hypot(size.x, size.y) + Math.hypot(from.x - extents.min.x, from.y - extents.min.y)
  }
  return new AcGeBox2d()
    .expandByPoint(from)
    .expandByPoint({ x: from.x + (dx / l) * reach, y: from.y + (dy / l) * reach })
    .union(own)
}

/**
 * EXTEND: lengthens the end of the picked line, arc or open polyline nearest
 * to the pick until it meets another object.
 */
export class AcApExtendCmd extends AcApPickEditCmd {
  protected readonly key = 'extend'

  protected edit(
    context: AcApContext,
    session: AcApCurveEditSession,
    entity: AcDbEntity,
    path: AcApCurvePath,
    pick: AcApXY
  ) {
    if (path.closed) return 'closed'
    const end = acapNearerEnd(path, acapProjectOnPath(path, pick).t)
    const probe = acapEndSegEntity(path, end)
    // Boundaries: anything shown between the end and the edge of the drawing.
    const box = extensionSearchBox(context, path, end)
    const hits: AcApXY[] = []
    for (const other of acapEntitiesInBox(context, box, entity)) {
      try {
        hits.push(...probe.intersectWith(other, AcDbIntersect.ExtendThis))
      } catch {
        // Objects without curve geometry are not boundaries.
      }
    }
    const extended = acapExtendPath(path, end, hits)
    if (!extended) return 'noBoundary'
    session.begin()
    try {
      session.modify(entity, path, extended)
    } finally {
      session.end()
    }
    return undefined
  }
}
