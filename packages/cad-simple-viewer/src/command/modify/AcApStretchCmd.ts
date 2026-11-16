import {
  AcDbArc,
  AcDbEntity,
  AcDbLine,
  AcDbPolyline,
  AcGeBox2d,
  AcGeMatrix3d,
  AcGePoint3d,
  AcGePoint3dLike
} from '@mlightcad/data-model'

import { AcApContext, AcApDocManager } from '../../app'
import {
  AcEdCommand,
  AcEdOpenMode,
  AcEdPreviewJig,
  AcEdPromptBoxOptions,
  AcEdPromptPointOptions,
  AcEdPromptStatus
} from '../../editor'
import { AcEdBaseView } from '../../editor/view/AcEdBaseView'
import { AcApI18n } from '../../i18n'
import { isEntityOnLockedLayer } from '../../service/AcApLockedLayer'
import { acapWritePath } from './AcApCurveEditSession'
import {
  acapBulgeSeg,
  AcApCurvePath,
  acapPolylineVertices,
  acapReadCurvePath,
  acapSegEnd,
  acapSegStart,
  AcApXY} from './AcApCurvePath'

/** How one object takes part in a stretch. */
export type AcApStretchItem =
  | { kind: 'move'; entity: AcDbEntity }
  | { kind: 'path'; entity: AcDbEntity; path: AcApCurvePath; moved: boolean[] }

function inside(box: AcGeBox2d, p: AcApXY) {
  return (
    p.x >= box.min.x - 1e-9 &&
    p.x <= box.max.x + 1e-9 &&
    p.y >= box.min.y - 1e-9 &&
    p.y <= box.max.y + 1e-9
  )
}

function boxInside(box: AcGeBox2d, other: AcGeBox2d) {
  return inside(box, other.min) && inside(box, other.max)
}

/** Vertices of a path: start of every segment, plus the last end when open. */
function pathVertices(path: AcApCurvePath): AcApXY[] {
  const points = path.segs.map(acapSegStart)
  if (!path.closed) points.push(acapSegEnd(path.segs[path.segs.length - 1]))
  return points
}

/**
 * Decides how an object reacts to a stretch window:
 * - entirely inside → moved;
 * - a line, arc or polyline partly inside → its vertices inside move
 *   (arcs keep their included angle);
 * - anything else partly inside → moved when its insertion / center point
 *   (first grip) is inside, otherwise left alone.
 */
export function acapStretchItem(
  entity: AcDbEntity,
  box: AcGeBox2d
): AcApStretchItem | undefined {
  let extents: AcGeBox2d | undefined
  try {
    const e = entity.geometricExtents
    if (e && !e.isEmpty()) {
      extents = new AcGeBox2d(
        { x: e.min.x, y: e.min.y },
        { x: e.max.x, y: e.max.y }
      )
    }
  } catch {
    extents = undefined
  }
  if (extents && boxInside(box, extents)) return { kind: 'move', entity }

  const path =
    entity instanceof AcDbLine ||
    entity instanceof AcDbArc ||
    entity instanceof AcDbPolyline
      ? acapReadCurvePath(entity)
      : undefined
  if (path) {
    const moved = pathVertices(path).map(p => inside(box, p))
    if (moved.every(Boolean)) return { kind: 'move', entity }
    if (!moved.some(Boolean)) return undefined
    return { kind: 'path', entity, path, moved }
  }

  try {
    const grips = entity.subGetGripPoints()
    if (grips.length > 0 && inside(box, grips[0])) {
      return { kind: 'move', entity }
    }
  } catch {
    // No grips: not stretched.
  }
  return undefined
}

/** The path of a partly stretched object after moving by `d`. */
export function acapStretchPath(
  item: Extract<AcApStretchItem, { kind: 'path' }>,
  d: AcApXY
): AcApCurvePath {
  const { path, moved, entity } = item
  const points = pathVertices(path).map((p, i) =>
    moved[i] ? { x: p.x + d.x, y: p.y + d.y } : p
  )
  const widths =
    entity instanceof AcDbPolyline ? acapPolylineVertices(entity) : undefined
  const segs = path.segs.map((seg, i) => {
    const a = points[i]
    const b = points[(i + 1) % points.length]
    const bulge = seg.kind === 'arc' ? Math.tan(seg.sweep / 4) : 0
    return acapBulgeSeg(
      a,
      b,
      bulge,
      widths?.[i]?.startWidth ?? seg.sw,
      widths?.[i]?.endWidth ?? seg.ew
    )
  })
  return { ...path, segs }
}

/** Writes a stretch for displacement `d` into `target` (the object or a copy). */
function applyStretch(target: AcDbEntity, item: AcApStretchItem, d: AcApXY) {
  if (item.kind === 'move') {
    target.transformBy(new AcGeMatrix3d().makeTranslation(d.x, d.y, 0))
    return
  }
  acapWritePath(target, acapStretchPath(item, d))
}

/** Preview of the stretched objects while the second point is chosen. */
class AcApStretchPreviewJig extends AcEdPreviewJig<AcGePoint3d> {
  private _shown: AcDbEntity[] = []
  private _pending: AcDbEntity[] = []

  constructor(
    private readonly _v: AcEdBaseView,
    private readonly items: AcApStretchItem[],
    private readonly base: AcGePoint3dLike
  ) {
    super(_v)
  }

  update(point: AcGePoint3d) {
    const d = { x: point.x - this.base.x, y: point.y - this.base.y }
    this._pending = this.items
      .map(item => {
        const copy = item.entity.clone() as AcDbEntity | undefined
        if (copy) applyStretch(copy, item, d)
        return copy
      })
      .filter((e): e is AcDbEntity => !!e)
  }

  override render() {
    this.clear()
    if (this._pending.length === 0) return
    this._v.addTransientEntity(this._pending)
    this._shown = this._pending
  }

  override end() {
    this.clear()
  }

  private clear() {
    this._shown.forEach(e => this._v.removeTransientEntity(e.objectId))
    this._shown = []
  }
}

/** Above this many objects the stretch is not previewed. */
const MAX_PREVIEW = 2000

/**
 * STRETCH ("ストレッチ"): drag a window across objects; points inside it move
 * by the displacement, objects completely inside move as a whole, and lines /
 * arcs / polylines crossing the window are stretched.
 */
export class AcApStretchCmd extends AcEdCommand {
  constructor() {
    super()
    this.mode = AcEdOpenMode.Write
  }

  async execute(context: AcApContext) {
    const editor = AcApDocManager.instance.editor
    const view = context.view
    const db = context.doc.database
    view.selectionSet.clear()

    const boxPrompt = new AcEdPromptBoxOptions(
      AcApI18n.t('jig.stretch.firstCorner'),
      AcApI18n.t('jig.stretch.secondCorner')
    )
    const boxResult = await editor.getBox(boxPrompt)
    if (boxResult.status !== AcEdPromptStatus.OK || !boxResult.value) return
    const box = boxResult.value

    const items: AcApStretchItem[] = []
    const seen = new Set<string>()
    for (const hit of view.search(box)) {
      if (hit.viewportId || !hit.id || seen.has(hit.id)) continue
      seen.add(hit.id)
      const entity = db.tables.blockTable.getEntityById(hit.id)
      if (!entity || isEntityOnLockedLayer(db, entity)) continue
      const item = acapStretchItem(entity, box)
      if (item) items.push(item)
    }
    if (items.length === 0) {
      this.showMessage(AcApI18n.t('jig.stretch.nothing'), 'info')
      return
    }
    view.selectionSet.add(items.map(item => item.entity.objectId))

    const basePrompt = new AcEdPromptPointOptions(
      AcApI18n.t('jig.stretch.basePoint')
    )
    const baseResult = await editor.getPoint(basePrompt)
    if (baseResult.status !== AcEdPromptStatus.OK) {
      view.selectionSet.clear()
      return
    }
    const base = new AcGePoint3d(baseResult.value!)

    const secondPrompt = new AcEdPromptPointOptions(
      AcApI18n.t('jig.stretch.secondPoint')
    )
    secondPrompt.useBasePoint = true
    secondPrompt.useDashedLine = true
    secondPrompt.basePoint = base
    if (items.length <= MAX_PREVIEW) {
      secondPrompt.jig = new AcApStretchPreviewJig(view, items, base)
    }
    const second = await editor.getPoint(secondPrompt)
    view.selectionSet.clear()
    if (second.status !== AcEdPromptStatus.OK) return
    const d = { x: second.value!.x - base.x, y: second.value!.y - base.y }
    if (Math.hypot(d.x, d.y) < 1e-12) return

    for (const item of items) {
      const opened = db.openEntityForWrite(item.entity)
      if (opened) applyStretch(opened, item, d)
    }
  }
}

