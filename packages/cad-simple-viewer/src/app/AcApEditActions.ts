import {
  AcDbBlockTableRecord,
  AcDbDatabase,
  AcDbEntity,
  AcDbObjectId,
  AcGeMatrix3d,
  AcGePoint2dLike
} from '@mlightcad/data-model'

import { acedNudgeStep } from '../editor/transform/AcEdTransformMath'
import type { AcEdBaseView } from '../editor/view/AcEdBaseView'
import { AcEdOpenMode } from '../editor/view/AcEdOpenMode'
import { isEntityOnLockedLayer } from '../service/AcApLockedLayer'
import { AcApDocManager } from './AcApDocManager'

/** A world XY box. */
interface AcApXYBox {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

/** Hooks of the view that owns the actions. */
export interface AcApEditActionsOptions {
  /** Block table record of the space shown in the view (model or a layout). */
  activeSpaceId: () => AcDbObjectId | undefined
  /** Drawn bounds of an entity in the view, if it is drawn. */
  drawnBox: (id: AcDbObjectId) => AcApXYBox | undefined
  /** Whether the entity is drawn in the view (its layer is on and thawed). */
  isShown: (id: AcDbObjectId) => boolean
}

/** What {@link AcApEditActions.copy} keeps. Shared by every view. */
interface AcApClipboardContent {
  /** Database the entities were copied from; pasting needs the same one. */
  db: AcDbDatabase
  /** Copies taken when copying (later edits of the originals do not change them) */
  entities: AcDbEntity[]
  /** Center of the copied entities, put on the paste point */
  center: { x: number; y: number }
}

let clipboard: AcApClipboardContent | undefined

/**
 * Number of nudge steps a duplicate is moved away from its original,
 * right and down (about ten screen pixels each way).
 */
const DUPLICATE_OFFSET_STEPS = 10

/**
 * Editing actions on the selection that work without a command: cut, copy,
 * paste, duplicate, select all and select the same layer. Used by the
 * right-click menu and the Ctrl / Cmd shortcuts.
 *
 * Each change is one undo step. Only entities in the space shown in the view
 * are used, and edits leave out entities on locked layers.
 */
export class AcApEditActions {
  constructor(
    private readonly view: AcEdBaseView,
    private readonly options: AcApEditActionsOptions
  ) {}

  /** Whether the current document is open for writing. */
  get canEdit() {
    return AcApDocManager.instance?.curDocument?.openMode === AcEdOpenMode.Write
  }

  /** Whether something copied from the current document can be pasted. */
  get canPaste() {
    const db = AcApDocManager.instance?.curDocument?.database
    return this.canEdit && clipboard != null && clipboard.db === db
  }

  /**
   * Selected entities in the space shown in the view.
   *
   * @param editable - Leave out entities on locked layers.
   */
  selectedEntities(editable: boolean): AcDbEntity[] {
    const db = AcApDocManager.instance?.curDocument?.database
    if (!db) return []
    const spaceId = this.options.activeSpaceId()
    const result: AcDbEntity[] = []
    for (const id of this.view.selectionSet.ids) {
      const entity = db.tables.blockTable.getEntityById(id)
      if (!entity) continue
      if (spaceId && entity.ownerId !== spaceId) continue
      if (editable && isEntityOnLockedLayer(db, entity)) continue
      result.push(entity)
    }
    return result
  }

  /**
   * Copies the selection to the viewer's clipboard.
   *
   * @returns `true` when something was copied.
   */
  copy(): boolean {
    return this.keep(this.selectedEntities(false))
  }

  /**
   * Copies the selection to the clipboard and erases it (entities on locked
   * layers are neither copied nor erased).
   *
   * @returns `true` when something was cut.
   */
  cut(): boolean {
    if (!this.canEdit) return false
    const entities = this.selectedEntities(true)
    if (!this.keep(entities)) return false
    const service = AcApDocManager.instance.curDocument.entityService
    service.eraseEntities(entities.map(entity => entity.objectId))
    this.view.selectionSet.clear()
    return true
  }

  /**
   * Pastes the clipboard into the space shown in the view. The pasted
   * entities become the selection.
   *
   * @param at - World point to put the center of the copied entities on;
   *   without it they are pasted where they were copied from.
   * @returns `true` when something was pasted.
   */
  paste(at?: AcGePoint2dLike): boolean {
    const content = clipboard
    if (!content || !this.canPaste) return false
    const matrix = at
      ? new AcGeMatrix3d().makeTranslation(
          at.x - content.center.x,
          at.y - content.center.y,
          0
        )
      : new AcGeMatrix3d()
    return this.addCopies(content.entities, matrix, 'Paste')
  }

  /**
   * Adds a copy of the selection a little to the right and below it. The
   * copy becomes the selection.
   *
   * @returns `true` when something was duplicated.
   */
  duplicate(): boolean {
    if (!this.canEdit) return false
    const entities = this.selectedEntities(true)
    if (!entities.length) return false
    const step = acedNudgeStep(this.unitsPerPixel()) * DUPLICATE_OFFSET_STEPS
    return this.addCopies(
      entities,
      new AcGeMatrix3d().makeTranslation(step, -step, 0),
      'Duplicate'
    )
  }

  /**
   * Selects every entity drawn in the space shown in the view, leaving out
   * hidden layers and (unless the view allows them) locked ones.
   *
   * @returns Number of selected entities.
   */
  selectAll(): number {
    return this.replaceSelection(this.shownIds())
  }

  /**
   * Selects every drawn entity on the layers of the selected entities.
   *
   * @returns Number of selected entities.
   */
  selectSameLayer(): number {
    const layers = new Set(
      this.selectedEntities(false).map(entity => entity.layer)
    )
    if (!layers.size) return 0
    return this.replaceSelection(
      this.shownIds(entity => layers.has(entity.layer))
    )
  }

  private keep(entities: AcDbEntity[]): boolean {
    const db = AcApDocManager.instance?.curDocument?.database
    if (!db || !entities.length) return false
    const box = this.unionBox(entities)
    const copies = entities
      .map(entity => entity.clone())
      .filter((entity): entity is AcDbEntity => !!entity)
    if (!copies.length) return false
    clipboard = {
      db,
      entities: copies,
      center: box
        ? { x: (box.minX + box.maxX) / 2, y: (box.minY + box.maxY) / 2 }
        : { x: 0, y: 0 }
    }
    return true
  }

  private addCopies(
    entities: AcDbEntity[],
    matrix: AcGeMatrix3d,
    label: string
  ): boolean {
    const doc = AcApDocManager.instance.curDocument
    const ownerId = this.options.activeSpaceId()
    const owner = ownerId ? doc.database.getObjectById(ownerId) : undefined
    if (!(owner instanceof AcDbBlockTableRecord)) return false
    const service = doc.entityService
    const copies = service.runEdit(label, () => {
      const clones = service.cloneAndTransform(entities, matrix, {
        append: false
      })
      if (clones.length) owner.appendEntity(clones)
      return clones
    })
    if (!copies.length) return false
    this.view.selectionSet.clear()
    this.view.selectionSet.add(copies.map(entity => entity.objectId))
    return true
  }

  private shownIds(filter?: (entity: AcDbEntity) => boolean): AcDbObjectId[] {
    const db = AcApDocManager.instance?.curDocument?.database
    const spaceId = this.options.activeSpaceId()
    if (!db || !spaceId) return []
    const space = db.getObjectById(spaceId)
    if (!(space instanceof AcDbBlockTableRecord)) return []
    const allowLocked = this.view.allowSelectOnLockedLayer
    const ids: AcDbObjectId[] = []
    for (const entity of space.newIterator()) {
      if (!this.options.isShown(entity.objectId)) continue
      if (!allowLocked && isEntityOnLockedLayer(db, entity)) continue
      if (filter && !filter(entity)) continue
      ids.push(entity.objectId)
    }
    return ids
  }

  private replaceSelection(ids: AcDbObjectId[]): number {
    const selectionSet = this.view.selectionSet
    selectionSet.clear()
    if (ids.length) selectionSet.add(ids)
    return ids.length
  }

  private unionBox(entities: AcDbEntity[]): AcApXYBox | undefined {
    let box: AcApXYBox | undefined
    for (const entity of entities) {
      const extents =
        this.options.drawnBox(entity.objectId) ?? finiteExtents(entity)
      if (!extents) continue
      box = box
        ? {
            minX: Math.min(box.minX, extents.minX),
            minY: Math.min(box.minY, extents.minY),
            maxX: Math.max(box.maxX, extents.maxX),
            maxY: Math.max(box.maxY, extents.maxY)
          }
        : { ...extents }
    }
    return box
  }

  private unitsPerPixel() {
    const a = this.view.screenToWorld({ x: 0, y: 0 })
    const b = this.view.screenToWorld({ x: 100, y: 0 })
    return Math.abs(b.x - a.x) / 100
  }
}

function finiteExtents(entity: AcDbEntity): AcApXYBox | undefined {
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
