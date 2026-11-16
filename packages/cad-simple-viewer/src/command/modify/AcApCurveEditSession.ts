import {
  AcDbBlockTableRecord,
  AcDbEntity,
  AcDbPolyline,
  AcGeBox2d
} from '@mlightcad/data-model'

import { AcApContext } from '../../app'
import { AcApEntityService } from '../../service'
import { isEntityOnLockedLayer } from '../../service/AcApLockedLayer'
import {
  AcApCurvePath,
  acapEntityFromSegs,
  AcApSeg,
  acapSegEnd,
  acapSegStart,
  acapWriteSegs
} from './AcApCurvePath'

type AcApEditAction =
  | { type: 'modified'; entity: AcDbEntity; before: AcApCurvePath }
  | { type: 'added'; entity: AcDbEntity }
  | { type: 'erased'; entity: AcDbEntity; owner: AcDbBlockTableRecord }

/**
 * Writes a whole path (including a closed polyline) back into an entity.
 */
export function acapWritePath(target: AcDbEntity, path: AcApCurvePath) {
  if (target instanceof AcDbPolyline && path.closed) {
    if (!acapWriteSegs(target, path.segs, path.z)) return false
    // acapWriteSegs adds the end point of the last segment, which is the
    // first vertex again on a closed path.
    target.removeVertexAt(target.numberOfVertices - 1)
    target.closed = true
    return true
  }
  return acapWriteSegs(target, path.segs, path.z)
}

/**
 * Applies curve edits (TRIM, EXTEND, BREAK, FILLET…) inside a command and
 * shows them right away. Each pick is one step that the command's own
 * "Undo" option can take back; the whole command is still one Undo of the
 * drawing.
 */
export class AcApCurveEditSession {
  private readonly _steps: AcApEditAction[][] = []
  private _current: AcApEditAction[] | undefined

  constructor(private readonly context: AcApContext) {}

  get canUndo() {
    return this._steps.length > 0
  }

  private get db() {
    return this.context.doc.database
  }

  /** Block (model / paper space) that owns `entity`. */
  ownerOf(entity: AcDbEntity): AcDbBlockTableRecord {
    const owner = entity.ownerId
      ? this.db.getObjectById(entity.ownerId)
      : undefined
    return owner instanceof AcDbBlockTableRecord
      ? owner
      : this.db.tables.blockTable.modelSpace
  }

  isLocked(entity: AcDbEntity) {
    return isEntityOnLockedLayer(this.db, entity)
  }

  /** Groups the following edits into one step for "Undo". */
  begin() {
    this._current = []
  }

  end() {
    if (this._current && this._current.length > 0) {
      this._steps.push(this._current)
    }
    this._current = undefined
  }

  private record(action: AcApEditAction) {
    if (this._current) this._current.push(action)
    else this._steps.push([action])
  }

  /** Replaces the geometry of `entity` with `path`. */
  modify(entity: AcDbEntity, before: AcApCurvePath, after: AcApCurvePath) {
    const opened = this.db.openEntityForWrite(entity) ?? entity
    if (!acapWritePath(opened, after)) return false
    this.record({ type: 'modified', entity: opened, before })
    this.context.view.updateEntity(opened)
    return true
  }

  /** Writes segments into `entity` (same kind). */
  modifySegs(entity: AcDbEntity, before: AcApCurvePath, segs: AcApSeg[]) {
    return this.modify(entity, before, {
      ...before,
      segs,
      closed: false
    })
  }

  /** Adds new entities next to `template` (same owner). */
  add(entities: AcDbEntity[], template: AcDbEntity) {
    if (entities.length === 0) return
    this.ownerOf(template).appendEntity(entities)
    entities.forEach(entity => this.record({ type: 'added', entity }))
    this.context.view.addEntity(entities)
  }

  erase(entity: AcDbEntity) {
    const owner = this.ownerOf(entity)
    const opened = this.db.openEntityForWrite(entity) ?? entity
    opened.erase()
    this.context.view.removeEntity(opened)
    this.record({ type: 'erased', entity: opened, owner })
  }

  /**
   * Replaces `entity` by the given pieces: the first piece is written into
   * the entity itself (it keeps its handle and properties), the others are
   * copies. Without pieces the entity is erased.
   */
  replaceWithPieces(entity: AcDbEntity, path: AcApCurvePath, pieces: AcApSeg[][]) {
    this.begin()
    try {
      if (pieces.length === 0) {
        this.erase(entity)
        return
      }
      const [first, ...rest] = pieces
      if (!this.modifySegs(entity, path, first)) {
        // A circle that became an arc: a new entity takes its place.
        const created = acapEntityFromSegs(path.kind, first, path.z)
        AcApEntityService.copyDisplayTraits(entity, created)
        this.add([created], entity)
        this.erase(entity)
      }
      const copies = rest.map(segs => {
        const copy =
          path.kind === 'circle' ? undefined : (entity.clone() as AcDbEntity)
        if (copy && acapWriteSegs(copy, segs, path.z)) return copy
        const created = acapEntityFromSegs(path.kind, segs, path.z)
        AcApEntityService.copyDisplayTraits(entity, created)
        return created
      })
      this.add(copies, entity)
    } finally {
      this.end()
    }
  }

  /** Takes back the last step. */
  undo(): boolean {
    const step = this._steps.pop()
    if (!step) return false
    for (const action of [...step].reverse()) {
      if (action.type === 'added') {
        const opened = this.db.openEntityForWrite(action.entity) ?? action.entity
        opened.erase()
        this.context.view.removeEntity(opened)
      } else if (action.type === 'modified') {
        const opened = this.db.openEntityForWrite(action.entity) ?? action.entity
        acapWritePath(opened, action.before)
        this.context.view.updateEntity(opened)
      } else {
        // Bring a copy back (the erased object itself left the database).
        const copy = action.entity.clone() as AcDbEntity
        action.owner.appendEntity(copy)
        this.context.view.addEntity(copy)
        // Later steps may refer to the erased object; point them at the copy.
        this._steps.forEach(s =>
          s.forEach(a => {
            if (a.entity === action.entity) a.entity = copy
          })
        )
      }
    }
    return true
  }
}

/** Axis-aligned box of a path (sampled for arcs). */
export function acapPathBox(path: AcApCurvePath): AcGeBox2d {
  const box = new AcGeBox2d()
  for (const seg of path.segs) {
    box.expandByPoint(acapSegStart(seg))
    box.expandByPoint(acapSegEnd(seg))
    if (seg.kind === 'arc') {
      box.expandByPoint({ x: seg.c.x - seg.r, y: seg.c.y - seg.r })
      box.expandByPoint({ x: seg.c.x + seg.r, y: seg.c.y + seg.r })
    }
  }
  return box
}

/**
 * Entities near `box` in the current view that can serve as cutting edges
 * or boundaries (everything shown, including other objects' insides).
 */
export function acapEntitiesInBox(
  context: AcApContext,
  box: AcGeBox2d,
  exclude?: AcDbEntity
): AcDbEntity[] {
  const blockTable = context.doc.database.tables.blockTable
  const seen = new Set<string>()
  const out: AcDbEntity[] = []
  for (const item of context.view.search(box)) {
    if (item.viewportId) continue
    const id = item.id
    if (!id || seen.has(id)) continue
    seen.add(id)
    if (exclude && id === exclude.objectId) continue
    const entity = blockTable.getEntityById(id)
    if (entity) out.push(entity)
  }
  return out
}
