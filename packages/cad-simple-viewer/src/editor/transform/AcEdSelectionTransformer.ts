import {
  AcDbBlockTableRecord,
  AcDbEntity,
  AcDbObjectId,
  AcGeBox2d,
  AcGeMatrix3d,
  AcGePoint2dLike
} from '@mlightcad/data-model'

import { AcApDocManager } from '../../app/AcApDocManager'
import { AcApSettingManager } from '../../app/AcApSettingManager'
import { isEntityOnLockedLayer } from '../../service/AcApLockedLayer'
import { createRotationMatrix } from '../../util/AcApGeTransform'
import { eventBus } from '../global/eventBus'
import { AcEdOsnapResolver } from '../input/AcEdOsnapResolver'
import { AcEdMarkerManager } from '../input/marker'
import { AcEdMTextEditor } from '../input/ui/AcEdMTextEditor'
import type { AcEdBaseView } from '../view/AcEdBaseView'
import { AcEdOpenMode } from '../view/AcEdOpenMode'
import { AcEdMatrixPreviewJig } from './AcEdMatrixPreviewJig'
import {
  type AcEdBox,
  acedBoxCenter,
  acedBoxCorner,
  acedConstrainToAxis,
  type AcEdCorner,
  acedCornerScaleFactor,
  type AcEdGuideCandidates,
  acedGuideCandidates,
  type AcEdGuideLine,
  acedNudgeStep,
  acedRadToDisplayDegrees,
  acedRotationAngle,
  acedSnapBoxToGuides,
  type AcEdXY
} from './AcEdTransformMath'

/** Pixels the pointer must travel before a press on the selection becomes a move. */
const DRAG_THRESHOLD_PX = 4
/** Screen distance within which edges / centers snap to alignment guides. */
const GUIDE_THRESHOLD_PX = 6
/** At most this many neighbouring entities feed the alignment guides. */
const MAX_GUIDE_SOURCES = 5000
/** Rotation snap step with Shift. */
const ROTATE_SNAP_DEGREES = 15

const CORNERS: AcEdCorner[] = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: 1 }
]

/** Curved-arrow cursor shown over the rotate zones. */
const ROTATE_CURSOR = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">' +
    '<path d="M5 12a7 7 0 1 1 7 7" fill="none" stroke="#fff" stroke-width="4"/>' +
    '<path d="M5 12a7 7 0 1 1 7 7" fill="none" stroke="#000" stroke-width="1.6"/>' +
    '<path d="M1.5 10.5 5 15l3.5-4.5z" fill="#000" stroke="#fff" stroke-width="1"/>' +
    '</svg>'
)}") 12 12, alias`

/** Options for {@link AcEdSelectionTransformer}. */
export interface AcEdSelectionTransformerOptions {
  /** Block table record (model or paper space) shown in the view. */
  activeSpaceId: () => AcDbObjectId | undefined
  /** True while one entity shows its CAD grips instead of the frame. */
  isGripMode: () => boolean
}

type AcEdTransformSession =
  | {
      kind: 'pending'
      startClient: AcEdXY
      startWcs: AcEdXY
      basePoint: AcEdXY
    }
  | {
      kind: 'move'
      basePoint: AcEdXY
      jig: AcEdMatrixPreviewJig
      candidates: AcEdGuideCandidates
      excludeIds: ReadonlySet<AcDbObjectId>
      matrix?: AcGeMatrix3d
      copy: boolean
    }
  | {
      kind: 'scale'
      base: AcEdXY
      corner: AcEdXY
      cornerIndex: AcEdCorner
      jig: AcEdMatrixPreviewJig
      matrix?: AcGeMatrix3d
    }
  | {
      kind: 'rotate'
      center: AcEdXY
      start: AcEdXY
      jig: AcEdMatrixPreviewJig
      matrix?: AcGeMatrix3d
    }

/**
 * Simple profile direct manipulation of the selection:
 *
 * - a frame around the selection with corner handles that scale it
 *   uniformly (Alt: around the center) and rotate zones just outside the
 *   corners (Shift: 15° steps);
 * - dragging a selected entity moves the selection (Alt: copies it, Shift:
 *   horizontally / vertically only). The grabbed point and the drop point
 *   snap to object snaps; without one, the selection's edges and center line
 *   up with nearby entities (alignment guides);
 * - arrow keys nudge the selection ({@link nudge}).
 *
 * Every edit is one undo step. Entities on locked layers and entities that
 * are not in the space shown in the view are left out. The CAD profile is
 * unaffected: there the frame is never shown and entities keep their grips.
 */
export class AcEdSelectionTransformer {
  private readonly _view: AcEdBaseView
  private readonly _options: AcEdSelectionTransformerOptions
  private readonly _frame: HTMLDivElement
  private readonly _handles: HTMLDivElement[] = []
  private readonly _rotateZones: HTMLDivElement[] = []
  private readonly _guideLayer: HTMLDivElement
  private readonly _label: HTMLDivElement
  private readonly _markers: AcEdMarkerManager
  private _entities: AcDbEntity[] = []
  private _box?: AcEdBox
  private _session?: AcEdTransformSession
  private _altKey = false
  private _refreshQueued = false

  private readonly _boundRefresh = () => this.queueRefresh()
  private readonly _boundReposition = () => this.reposition()
  private readonly _boundSettings = (args: { key: string }) => {
    if (args.key === 'operationProfile') this.queueRefresh()
  }
  private readonly _boundMouseMove = (e: MouseEvent) => this.onMouseMove(e)
  private readonly _boundMouseUp = (e: MouseEvent) => this.onMouseUp(e)
  private readonly _boundKeyDown = (e: KeyboardEvent) => this.onKeyDown(e)
  private readonly _boundKeyUp = (e: KeyboardEvent) => this.onKeyUp(e)

  constructor(view: AcEdBaseView, options: AcEdSelectionTransformerOptions) {
    this._view = view
    this._options = options
    injectSelectionFrameCss()
    const container = view.container
    if (getComputedStyle(container).position === 'static') {
      container.style.position = 'relative'
    }

    this._frame = document.createElement('div')
    this._frame.className = 'ml-sel-frame'
    this._frame.dataset.testid = 'selection-frame'
    for (const corner of CORNERS) {
      const zone = document.createElement('div')
      zone.className = 'ml-sel-frame-rotate'
      zone.style.cursor = ROTATE_CURSOR
      zone.dataset.corner = `${corner.x}${corner.y}`
      zone.addEventListener('mousedown', e => this.beginRotate(e))
      this._frame.appendChild(zone)
      this._rotateZones.push(zone)
    }
    for (const corner of CORNERS) {
      const handle = document.createElement('div')
      handle.className = 'ml-sel-frame-handle'
      handle.dataset.corner = `${corner.x}${corner.y}`
      // World Y grows upwards, screen Y downwards.
      handle.style.cursor =
        corner.x === corner.y ? 'nesw-resize' : 'nwse-resize'
      handle.addEventListener('mousedown', e => this.beginScale(e, corner))
      this._frame.appendChild(handle)
      this._handles.push(handle)
    }
    container.appendChild(this._frame)

    this._guideLayer = document.createElement('div')
    this._guideLayer.className = 'ml-sel-guides'
    container.appendChild(this._guideLayer)

    this._label = document.createElement('div')
    this._label.className = 'ml-sel-label'
    container.appendChild(this._label)

    this._markers = new AcEdMarkerManager(view)
    this.hideFrame()
    this.bindEvents()
  }

  /** True while a move, scale or rotate drag is in progress. */
  get isDragging() {
    return this._session != null && this._session.kind !== 'pending'
  }

  /** True when the frame is shown (the selection can be edited directly). */
  get isActive() {
    return this._box != null
  }

  /** Removes the DOM and listeners. */
  dispose() {
    this.endSession()
    this.unbindEvents()
    this._frame.remove()
    this._guideLayer.remove()
    this._label.remove()
  }

  /** Recomputes the frame from the selection on the next microtask. */
  queueRefresh() {
    if (this._refreshQueued) return
    this._refreshQueued = true
    queueMicrotask(() => {
      this._refreshQueued = false
      this.refresh()
    })
  }

  /** Recomputes the frame from the current selection. */
  refresh() {
    if (this._session) return
    this._entities = this.canShowFrame() ? this.collectEditableEntities() : []
    this._box = unionBox(this._entities)
    if (!this._box) {
      this._entities = []
      this.hideFrame()
      return
    }
    this.reposition()
  }

  /**
   * Starts a pending move when the press lands on a selected entity.
   * The view keeps handling the press as a click until the pointer travels
   * {@link DRAG_THRESHOLD_PX}; then the move takes over.
   *
   * @returns `true` when a move may follow.
   */
  handlePointerDown(e: MouseEvent): boolean {
    if (e.button !== 0 || this._session) return false
    if (e.shiftKey || e.ctrlKey || e.metaKey) return false
    this.refresh()
    if (!this._box) return false

    const startWcs = this.clientToWcs(e)
    const editable = new Set(this._entities.map(entity => entity.objectId))
    const picked = this._view.pick(startWcs)
    if (!picked.some(item => editable.has(item.id))) return false

    // Grab the selection by its snap point under the cursor, if any.
    const snap = this._view.osnapResolver.resolve({ cursorWcs: startWcs })
    this._view.osnapResolver.clearAcquiredCenters()
    this._session = {
      kind: 'pending',
      startClient: { x: e.clientX, y: e.clientY },
      startWcs,
      basePoint: snap ? { x: snap.x, y: snap.y } : startWcs
    }
    this._altKey = e.altKey
    this.listenDocument()
    return true
  }

  /**
   * Moves the selection by one nudge step (Shift: ten steps). The step is a
   * round number of about one screen pixel ({@link acedNudgeStep}).
   *
   * @returns `true` when something was moved.
   */
  nudge(dirX: number, dirY: number, large: boolean): boolean {
    if (this._session) return false
    this.refresh()
    if (!this._box) return false
    const step = acedNudgeStep(this.unitsPerPixel()) * (large ? 10 : 1)
    this.commit(
      new AcGeMatrix3d().makeTranslation(dirX * step, dirY * step, 0),
      'Nudge',
      false
    )
    return true
  }

  /* ===================== sessions ===================== */

  private beginScale(e: MouseEvent, corner: AcEdCorner) {
    if (e.button !== 0 || !this._box || this._session) return
    e.preventDefault()
    e.stopPropagation()
    const opposite: AcEdCorner = {
      x: corner.x === 0 ? 1 : 0,
      y: corner.y === 0 ? 1 : 0
    }
    this._altKey = e.altKey
    this._session = {
      kind: 'scale',
      base: acedBoxCorner(this._box, opposite),
      corner: acedBoxCorner(this._box, corner),
      cornerIndex: corner,
      jig: new AcEdMatrixPreviewJig(this._view, this._entities)
    }
    this.hideFrame()
    this.listenDocument()
  }

  private beginRotate(e: MouseEvent) {
    if (e.button !== 0 || !this._box || this._session) return
    e.preventDefault()
    e.stopPropagation()
    this._session = {
      kind: 'rotate',
      center: acedBoxCenter(this._box),
      start: this.clientToWcs(e),
      jig: new AcEdMatrixPreviewJig(this._view, this._entities)
    }
    this.hideFrame()
    this.listenDocument()
  }

  private startMove(
    session: Extract<AcEdTransformSession, { kind: 'pending' }>
  ) {
    const excludeIds = new Set(this._entities.map(entity => entity.objectId))
    this._session = {
      kind: 'move',
      basePoint: session.basePoint,
      jig: new AcEdMatrixPreviewJig(this._view, this._entities),
      candidates: this.collectGuideCandidates(excludeIds),
      excludeIds,
      copy: this._altKey
    }
    this.hideFrame()
  }

  private onMouseMove(e: MouseEvent) {
    const session = this._session
    if (!session) return
    this._altKey = e.altKey

    if (session.kind === 'pending') {
      const moved = Math.hypot(
        e.clientX - session.startClient.x,
        e.clientY - session.startClient.y
      )
      if (moved < DRAG_THRESHOLD_PX) return
      this.startMove(session)
      this.onMouseMove(e)
      return
    }

    e.preventDefault()
    const cursor = this.clientToWcs(e)
    if (session.kind === 'move') {
      session.copy = e.altKey
      session.matrix = this.moveMatrix(session, cursor, e.shiftKey)
      this._view.canvas.style.cursor = session.copy ? 'copy' : 'move'
      session.jig.update(session.matrix)
      session.jig.render()
      return
    }

    if (session.kind === 'scale') {
      const base =
        e.altKey && this._box ? acedBoxCenter(this._box) : session.base
      const factor = acedCornerScaleFactor(base, session.corner, cursor)
      if (factor == null) return
      session.matrix = scaleMatrix(base, factor)
      this.showLabel(e, formatPercent(factor))
      session.jig.update(session.matrix)
      session.jig.render()
      return
    }

    const angle = acedRotationAngle(
      session.center,
      session.start,
      cursor,
      e.shiftKey ? ROTATE_SNAP_DEGREES : undefined
    )
    session.matrix = createRotationMatrix(
      { x: session.center.x, y: session.center.y, z: 0 },
      angle
    )
    this.showLabel(e, `${formatNumber(acedRadToDisplayDegrees(angle), 1)}°`)
    session.jig.update(session.matrix)
    session.jig.render()
  }

  private onMouseUp(e: MouseEvent) {
    if (e.button !== 0) return
    const session = this._session
    if (!session) return
    if (session.kind === 'pending') {
      // A click: the view already handled it as a selection click.
      this.endSession()
      return
    }
    if (session.kind === 'move') {
      session.copy = e.altKey
    }
    const matrix = session.matrix
    const copy = session.kind === 'move' && session.copy
    const label =
      session.kind === 'move'
        ? copy
          ? 'Drag Copy'
          : 'Drag Move'
        : session.kind === 'scale'
          ? 'Drag Scale'
          : 'Drag Rotate'
    this.endSession()
    if (matrix && !matrix.equals(AcGeMatrix3d.IDENTITY)) {
      this.commit(matrix, label, copy)
    }
  }

  private onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Alt') {
      e.preventDefault()
      return
    }
    if (e.key !== 'Escape' || !this._session) return
    e.preventDefault()
    e.stopPropagation()
    this.endSession()
  }

  private onKeyUp(e: KeyboardEvent) {
    // Keep the browser menu bar from taking focus after Alt + drag.
    if (e.key === 'Alt' && this._session) e.preventDefault()
  }

  private endSession() {
    const session = this._session
    this._session = undefined
    this.unlistenDocument()
    if (session && session.kind !== 'pending') {
      session.jig.end()
      this._view.editor.restoreCursor()
    }
    this._markers.clear()
    this._view.osnapResolver.clearAcquiredCenters()
    this.clearGuides()
    this._label.style.display = 'none'
    this.refresh()
  }

  /**
   * Applies `matrix` to the editable selection as one undo step. With `copy`
   * the transformed copies are added next to the originals and become the
   * selection.
   */
  private commit(matrix: AcGeMatrix3d, label: string, copy: boolean) {
    const doc = AcApDocManager.instance.curDocument
    const entities = this._entities
    if (!entities.length) return
    const service = doc.entityService
    if (!copy) {
      service.runEdit(label, () => service.transformEntities(entities, matrix))
      this.refresh()
      return
    }

    const ownerId = this._options.activeSpaceId()
    const owner = ownerId ? doc.database.getObjectById(ownerId) : undefined
    if (!(owner instanceof AcDbBlockTableRecord)) return
    const copies = service.runEdit(label, () => {
      const clones = service.cloneAndTransform(entities, matrix, {
        append: false
      })
      if (clones.length) owner.appendEntity(clones)
      return clones
    })
    if (!copies.length) return
    const selectionSet = this._view.selectionSet
    selectionSet.clear()
    selectionSet.add(copies.map(entity => entity.objectId))
  }

  private moveMatrix(
    session: Extract<AcEdTransformSession, { kind: 'move' }>,
    cursor: AcEdXY,
    constrain: boolean
  ): AcGeMatrix3d {
    const base = session.basePoint
    let dx = cursor.x - base.x
    let dy = cursor.y - base.y
    this.clearGuides()

    if (constrain) {
      this._markers.hideMarker()
      const axis = acedConstrainToAxis(dx, dy)
      dx = axis.x
      dy = axis.y
    } else if (AcApSettingManager.instance.osnapEnabled) {
      const snap = this._view.osnapResolver.resolve({
        cursorWcs: cursor,
        lastPoint: { x: base.x, y: base.y, z: 0 },
        excludeIds: session.excludeIds
      })
      this._markers.setHintMarkers(
        AcEdOsnapResolver.displayCenterMarks(
          this._view.osnapResolver.acquiredCenterMarks,
          snap
        )
      )
      if (snap) {
        this._markers.showOrRepositionMarker(
          snap,
          AcEdOsnapResolver.osnapModeToMarkerType(snap.type)
        )
        dx = snap.x - base.x
        dy = snap.y - base.y
      } else {
        this._markers.hideMarker()
        if (this._box) {
          const guided = acedSnapBoxToGuides(
            this._box,
            dx,
            dy,
            session.candidates,
            GUIDE_THRESHOLD_PX * this.unitsPerPixel()
          )
          dx = guided.dx
          dy = guided.dy
          this.drawGuides(guided.guides)
        }
      }
    }
    return new AcGeMatrix3d().makeTranslation(dx, dy, 0)
  }

  /* ===================== frame ===================== */

  private canShowFrame() {
    if (AcApSettingManager.instance.operationProfile !== 'simple') return false
    if (this._view.selectionSet.count === 0) return false
    if (this._view.editor.isActive) return false
    if (AcEdMTextEditor.getActiveInputBox()) return false
    if (this._options.isGripMode()) return false
    const doc = AcApDocManager.instance?.curDocument
    return doc?.openMode === AcEdOpenMode.Write
  }

  private collectEditableEntities(): AcDbEntity[] {
    const doc = AcApDocManager.instance.curDocument
    const db = doc.database
    const spaceId = this._options.activeSpaceId()
    const result: AcDbEntity[] = []
    for (const id of this._view.selectionSet.ids) {
      const entity = db.tables.blockTable.getEntityById(id)
      if (!entity) continue
      if (spaceId && entity.ownerId !== spaceId) continue
      if (isEntityOnLockedLayer(db, entity)) continue
      result.push(entity)
    }
    return result
  }

  private reposition() {
    const box = this._box
    if (!box || this._session) return
    const p1 = this.wcsToContainer({ x: box.minX, y: box.maxY })
    const p2 = this.wcsToContainer({ x: box.maxX, y: box.minY })
    const left = Math.min(p1.x, p2.x)
    const top = Math.min(p1.y, p2.y)
    const width = Math.abs(p2.x - p1.x)
    const height = Math.abs(p2.y - p1.y)
    Object.assign(this._frame.style, {
      display: 'block',
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`
    })
    // A single point has nothing to scale or rotate.
    const hasSize = width >= 1 || height >= 1
    for (const el of [...this._handles, ...this._rotateZones]) {
      el.style.display = hasSize ? 'block' : 'none'
    }
  }

  private hideFrame() {
    this._frame.style.display = 'none'
  }

  /* ===================== guides ===================== */

  private collectGuideCandidates(
    excludeIds: ReadonlySet<AcDbObjectId>
  ): AcEdGuideCandidates {
    if (!AcApSettingManager.instance.osnapEnabled) return { xs: [], ys: [] }
    const view = this._view
    const a = view.screenToWorld({ x: 0, y: 0 })
    const b = view.screenToWorld({ x: view.width, y: view.height })
    const db = AcApDocManager.instance.curDocument.database
    const layers = db.tables.layerTable
    const boxes: AcEdBox[] = []
    const items = view.search(new AcGeBox2d().expandByPoint(a).expandByPoint(b))
    for (const item of items) {
      if (boxes.length >= MAX_GUIDE_SOURCES) break
      if (excludeIds.has(item.id)) continue
      const entity = db.tables.blockTable.getEntityById(item.id)
      if (!entity || !entity.visibility) continue
      const layer = layers.getAt(entity.layer)
      if (layer && (layer.isOff || layer.isFrozen)) continue
      boxes.push(item)
    }
    return acedGuideCandidates(boxes)
  }

  private drawGuides(guides: AcEdGuideLine[]) {
    for (const guide of guides) {
      const el = document.createElement('div')
      el.className = 'ml-sel-guide'
      const p1 =
        guide.axis === 'x'
          ? this.wcsToContainer({ x: guide.value, y: guide.from })
          : this.wcsToContainer({ x: guide.from, y: guide.value })
      const p2 =
        guide.axis === 'x'
          ? this.wcsToContainer({ x: guide.value, y: guide.to })
          : this.wcsToContainer({ x: guide.to, y: guide.value })
      Object.assign(el.style, {
        left: `${Math.min(p1.x, p2.x)}px`,
        top: `${Math.min(p1.y, p2.y)}px`,
        width: guide.axis === 'x' ? '0px' : `${Math.abs(p2.x - p1.x)}px`,
        height: guide.axis === 'y' ? '0px' : `${Math.abs(p2.y - p1.y)}px`
      })
      el.classList.add(guide.axis === 'x' ? 'is-vertical' : 'is-horizontal')
      this._guideLayer.appendChild(el)
    }
  }

  private clearGuides() {
    this._guideLayer.replaceChildren()
  }

  private showLabel(e: MouseEvent, text: string) {
    const canvasPos = this._view.viewportToCanvas({
      x: e.clientX,
      y: e.clientY
    })
    const pos = this._view.canvasToContainer(canvasPos)
    this._label.textContent = text
    Object.assign(this._label.style, {
      display: 'block',
      left: `${pos.x + 16}px`,
      top: `${pos.y + 16}px`
    })
  }

  /* ===================== helpers ===================== */

  private listenDocument() {
    document.addEventListener('mousemove', this._boundMouseMove)
    document.addEventListener('mouseup', this._boundMouseUp)
    document.addEventListener('keydown', this._boundKeyDown, true)
    document.addEventListener('keyup', this._boundKeyUp, true)
  }

  private unlistenDocument() {
    document.removeEventListener('mousemove', this._boundMouseMove)
    document.removeEventListener('mouseup', this._boundMouseUp)
    document.removeEventListener('keydown', this._boundKeyDown, true)
    document.removeEventListener('keyup', this._boundKeyUp, true)
  }

  private bindEvents() {
    const { selectionSet, editor, events } = this._view
    selectionSet.events.selectionAdded.addEventListener(this._boundRefresh)
    selectionSet.events.selectionRemoved.addEventListener(this._boundRefresh)
    editor.events.commandWillStart.addEventListener(this._boundRefresh)
    editor.events.commandEnded.addEventListener(this._boundRefresh)
    events.viewChanged.addEventListener(this._boundReposition)
    events.viewResize.addEventListener(this._boundReposition)
    eventBus.on('undo-stack-changed', this._boundRefresh)
    AcApSettingManager.instance.events.modified.addEventListener(
      this._boundSettings
    )
  }

  private unbindEvents() {
    const { selectionSet, editor, events } = this._view
    selectionSet.events.selectionAdded.removeEventListener(this._boundRefresh)
    selectionSet.events.selectionRemoved.removeEventListener(this._boundRefresh)
    editor.events.commandWillStart.removeEventListener(this._boundRefresh)
    editor.events.commandEnded.removeEventListener(this._boundRefresh)
    events.viewChanged.removeEventListener(this._boundReposition)
    events.viewResize.removeEventListener(this._boundReposition)
    eventBus.off('undo-stack-changed', this._boundRefresh)
    AcApSettingManager.instance.events.modified.removeEventListener(
      this._boundSettings
    )
  }

  private clientToWcs(e: { clientX: number; clientY: number }): AcEdXY {
    const canvasPos = this._view.viewportToCanvas({
      x: e.clientX,
      y: e.clientY
    })
    const wcs = this._view.screenToWorld(canvasPos)
    return { x: wcs.x, y: wcs.y }
  }

  private wcsToContainer(point: AcGePoint2dLike): AcEdXY {
    const canvasPos = this._view.worldToScreen(point)
    return this._view.canvasToContainer(canvasPos)
  }

  private unitsPerPixel() {
    const a = this._view.screenToWorld({ x: 0, y: 0 })
    const b = this._view.screenToWorld({ x: 100, y: 0 })
    return Math.abs(b.x - a.x) / 100
  }
}

function unionBox(entities: AcDbEntity[]): AcEdBox | undefined {
  let box: AcEdBox | undefined
  for (const entity of entities) {
    const extents = finiteExtents(entity)
    if (!extents) continue
    box = box
      ? {
          minX: Math.min(box.minX, extents.minX),
          minY: Math.min(box.minY, extents.minY),
          maxX: Math.max(box.maxX, extents.maxX),
          maxY: Math.max(box.maxY, extents.maxY)
        }
      : extents
  }
  return box
}

function finiteExtents(entity: AcDbEntity): AcEdBox | undefined {
  try {
    const box = entity.geometricExtents
    if (!box || box.isEmpty()) return undefined
    const values = [box.min.x, box.min.y, box.max.x, box.max.y]
    // Rays and construction lines report huge extents; leave them out.
    if (!values.every(v => Number.isFinite(v) && Math.abs(v) < 1e15)) {
      return undefined
    }
    return {
      minX: box.min.x,
      minY: box.min.y,
      maxX: box.max.x,
      maxY: box.max.y
    }
  } catch {
    return undefined
  }
}

function scaleMatrix(base: AcEdXY, factor: number) {
  return new AcGeMatrix3d()
    .makeTranslation(base.x, base.y, 0)
    .multiply(new AcGeMatrix3d().makeScale(factor, factor, factor))
    .multiply(new AcGeMatrix3d().makeTranslation(-base.x, -base.y, 0))
}

function formatNumber(value: number, digits: number) {
  return Number(value.toFixed(digits)).toString()
}

function formatPercent(factor: number) {
  const percent = factor * 100
  return `${formatNumber(percent, percent < 10 ? 1 : 0)}%`
}

let cssInjected = false

function injectSelectionFrameCss() {
  if (cssInjected || typeof document === 'undefined') return
  cssInjected = true
  const style = document.createElement('style')
  style.textContent = `
    .ml-sel-frame {
      position: absolute;
      box-sizing: border-box;
      border: 1px solid var(--ml-brand, #af61da);
      pointer-events: none;
      z-index: 3;
    }
    .ml-sel-frame-handle {
      position: absolute;
      width: 9px;
      height: 9px;
      margin: -5px 0 0 -5px;
      box-sizing: border-box;
      background: #fff;
      border: 1px solid var(--ml-brand, #af61da);
      pointer-events: auto;
    }
    .ml-sel-frame-rotate {
      position: absolute;
      width: 18px;
      height: 18px;
      pointer-events: auto;
    }
    .ml-sel-frame-handle[data-corner='00'] { left: 0; top: 100%; }
    .ml-sel-frame-handle[data-corner='10'] { left: 100%; top: 100%; }
    .ml-sel-frame-handle[data-corner='11'] { left: 100%; top: 0; }
    .ml-sel-frame-handle[data-corner='01'] { left: 0; top: 0; }
    .ml-sel-frame-rotate[data-corner='00'] { left: -18px; top: 100%; }
    .ml-sel-frame-rotate[data-corner='10'] { left: 100%; top: 100%; }
    .ml-sel-frame-rotate[data-corner='11'] { left: 100%; top: -18px; }
    .ml-sel-frame-rotate[data-corner='01'] { left: -18px; top: -18px; }
    .ml-sel-guides {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 3;
    }
    .ml-sel-guide {
      position: absolute;
      border: 0 dashed var(--ml-brand, #af61da);
    }
    .ml-sel-guide.is-vertical { border-left-width: 1px; }
    .ml-sel-guide.is-horizontal { border-top-width: 1px; }
    .ml-sel-label {
      position: absolute;
      display: none;
      padding: 1px 6px;
      border-radius: 4px;
      background: var(--ml-brand, #af61da);
      color: #fff;
      font-size: 12px;
      line-height: 18px;
      white-space: nowrap;
      pointer-events: none;
      z-index: 4;
    }
  `
  document.head.appendChild(style)
}
