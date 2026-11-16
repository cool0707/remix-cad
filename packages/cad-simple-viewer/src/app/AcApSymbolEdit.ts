import {
  AcCmEventManager,
  AcDbBlockReference,
  AcDbDatabase,
  AcDbDxfFiler,
  AcDbEntity,
  AcDbObjectId,
  AcGeMatrix3d
} from '@mlightcad/data-model'

import { getSessionUndo } from '../command/markup/AcApMarkupHistory'
import { eventBus } from '../editor/global/eventBus'
import type { AcEdBaseView } from '../editor/view/AcEdBaseView'
import { AcEdOpenMode } from '../editor/view/AcEdOpenMode'
import { AcApI18n } from '../i18n'
import {
  acapSetEntityEditScope,
  isEntityOnLockedLayer
} from '../service/AcApLockedLayer'
import {
  acapNotifyUndoStackChanged,
  acapRunDatabaseEdit
} from '../util/AcApDatabaseEdit'
import { AcApDocManager } from './AcApDocManager'
import { acapDrawingExporters } from './AcApDrawingExporters'
import { AcApSettingManager } from './AcApSettingManager'
import {
  acapSymbolPropertyDefinitions,
  acapSyncSymbolProperties
} from './AcApSymbolAttributes'
import {
  acapSymbolEditDimColor,
  acapSymbolEditTransform
} from './AcApSymbolEditMath'
import { ACAP_SYMBOL_LAYER, acapEnsureDrawingLayer } from './AcApSymbolLayer'

/** Undo label of the step that writes an edited symbol back. */
export const ACAP_SYMBOL_EDIT_UNDO_LABEL = 'SymbolEdit'

/** One level of the symbols being edited, outermost first. */
export interface AcApSymbolEditPathItem {
  /** Name of the symbol (block) */
  name: string
  /**
   * Whether the contents are shown exactly where the symbol stands. False
   * for a symbol placed mirrored or with different X / Y scales, which is
   * shown unmirrored and unstretched while it is edited.
   */
  inPlace: boolean
}

/** Sent whenever symbol editing starts, goes deeper or ends, for any view. */
export interface AcApSymbolEditState {
  /** View the symbol is edited in */
  view: AcEdBaseView
  /** Symbols being edited, outermost first; empty when not editing */
  path: AcApSymbolEditPathItem[]
}

/** What the controller needs from the view that shows the drawing. */
export interface AcApSymbolEditHost {
  /** Block table record of the space shown in the view. */
  activeSpaceId(): AcDbObjectId | undefined
  /** Canvas background as 0xRRGGBB. */
  backgroundColor(): number
  /** Shows or hides one entity in the scene; the drawing is not changed. */
  setSceneVisible(objectId: AcDbObjectId, visible: boolean): void
  /**
   * Draws everything in `color` except the entities in `keep`, or goes back
   * to the normal display when called without options.
   */
  setDimDisplay(options?: { color: number; keep: AcDbObjectId[] }): void
  /** Adds one entity to, or takes it out of, the ones drawn normally. */
  setKept(objectId: AcDbObjectId, kept: boolean): void
}

/** A copy of a definition entity shown on the canvas while editing. */
interface AcApWorkingEntry {
  /** Definition entity the copy was made from; none for new entities */
  original?: AcDbEntity
  /** Contents of the copy when it was made, to tell whether it changed */
  print?: string
}

/** One symbol being edited. */
interface AcApSymbolEditFrame {
  /** Placed symbol (INSERT) that was entered; hidden while editing */
  referenceId: AcDbObjectId
  /** Definition being edited */
  blockId: AcDbObjectId
  name: string
  /** Space the copies sit in */
  spaceId: AcDbObjectId
  /** Definition coordinates to drawing coordinates */
  toWorld: AcGeMatrix3d
  /** Drawing coordinates to definition coordinates */
  toBlock: AcGeMatrix3d
  inPlace: boolean
  /** Entities that belong to the symbol, by id */
  working: Map<AcDbObjectId, AcApWorkingEntry>
  /**
   * Working entities a database edit reported as changed. Only consulted
   * for entities whose contents could not be captured when they were copied.
   */
  modified: Set<AcDbObjectId>
  /** Top of the database undo stack when editing started */
  baseRecord: unknown
  /** Session undo depth when editing started */
  undoDepth: number
  /** Current layer to go back to (simple profile) */
  previousLayer?: string
}

/** A record of the database undo stack. */
interface AcApUndoRecord {
  label?: string
  changes: unknown[]
}

/** The undo stack of the data model (private there). */
interface AcApUndoStack {
  undoRecords: AcApUndoRecord[]
  redoRecords: AcApUndoRecord[]
  push(record: AcApUndoRecord): void
}

function undoStackOf(db: AcDbDatabase): AcApUndoStack | undefined {
  const stack = (
    db.transactionManager as unknown as { undoStack?: Partial<AcApUndoStack> }
  )?.undoStack
  if (
    !stack ||
    !Array.isArray(stack.undoRecords) ||
    !Array.isArray(stack.redoRecords) ||
    typeof stack.push !== 'function'
  ) {
    return undefined
  }
  return stack as AcApUndoStack
}

/** Text that changes when the entity changes (its DXF form). */
function fingerprint(entity: AcDbEntity): string | undefined {
  try {
    const filer = new AcDbDxfFiler()
    entity.dxfOut(filer)
    return filer.toString()
  } catch {
    return undefined
  }
}

function asList<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

/**
 * Editing a symbol (block) in place: double-click a placed symbol to work
 * on what is inside it with the normal tools, then leave to apply the
 * result to every placed copy of that symbol.
 *
 * The data model has no notion of "the block being edited", and every
 * drawing command adds to the canvas. So while a symbol is edited its
 * contents are **copied onto the canvas** at the place of the symbol that
 * was entered (which is hidden meanwhile), like AutoCAD's REFEDIT working
 * set. Everything else is dimmed and cannot be selected. On leaving, the
 * entities of the working set are moved back into the definition:
 *
 * - a copy that was not touched keeps the definition's own entity,
 * - a changed or new one is transformed into definition coordinates,
 * - a deleted one is removed.
 *
 * Undo works step by step while editing (never past the moment the symbol
 * was entered). After leaving, the whole visit is **one** undo step: the
 * steps made inside refer to the copies, which no longer exist, so they
 * are dropped from the undo stack and replaced by the step that rewrote
 * the definition.
 *
 * Symbols inside the symbol can be entered the same way (a stack of
 * frames). Linked drawings and unnamed blocks (dimensions, dynamic block
 * representations) cannot be edited.
 *
 * One controller per view (`view.symbolEdit`).
 */
export class AcApSymbolEditController {
  /** Fired when editing starts, goes deeper or ends, for any view. */
  static readonly events = {
    changed: new AcCmEventManager<AcApSymbolEditState>()
  }

  private readonly _frames: AcApSymbolEditFrame[] = []
  /** Placed symbols hidden while they are edited */
  private readonly _hidden = new Set<AcDbObjectId>()
  /** Drawing the frames belong to */
  private _db?: AcDbDatabase
  /** Greater than zero while the controller itself changes the drawing */
  private _internal = 0

  constructor(
    private readonly view: AcEdBaseView,
    private readonly host: AcApSymbolEditHost
  ) {}

  /** Whether a symbol is being edited. */
  get isActive() {
    return this._frames.length > 0
  }

  /** Symbols being edited, outermost first. */
  get path(): AcApSymbolEditPathItem[] {
    return this._frames.map(frame => ({
      name: frame.name,
      inPlace: frame.inPlace
    }))
  }

  /** Name of the symbol whose contents are being edited, if any. */
  get currentName(): string | undefined {
    return this._frames[this._frames.length - 1]?.name
  }

  /** Whether the entity belongs to the symbol being edited. */
  isInScope(objectId: AcDbObjectId): boolean {
    const frame = this._frames[this._frames.length - 1]
    return !frame || frame.working.has(objectId)
  }

  /**
   * Whether the entity belongs to a symbol being edited, at any depth. Such
   * entities sit on the canvas but are not part of it.
   */
  isWorkingEntity(objectId: AcDbObjectId): boolean {
    return this._frames.some(frame => frame.working.has(objectId))
  }

  /** Whether the placed symbol is hidden because it is being edited. */
  isHiddenReference(objectId: AcDbObjectId): boolean {
    return this._hidden.has(objectId)
  }

  /**
   * Why the entity cannot be entered, as a message; `undefined` when it can.
   * Entities that are not placed symbols give an empty message.
   */
  whyNotEditable(objectId: AcDbObjectId): string | undefined {
    const doc = AcApDocManager.instance?.curDocument
    const db = doc?.database
    if (!doc || !db || doc.openMode !== AcEdOpenMode.Write) return ''
    if (this._db && this._db !== db) return ''
    const reference = db.tables.blockTable.getEntityById(objectId)
    if (!(reference instanceof AcDbBlockReference)) return ''
    if (reference.ownerId !== this.host.activeSpaceId()) return ''
    if (this.isActive && !this.isInScope(objectId)) return ''
    const t = (key: string) => AcApI18n.t(`main.symbolEdit.${key}`)
    if (isEntityOnLockedLayer(db, reference)) return t('locked')
    const block = reference.blockTableRecord
    if (!block || block.isModelSapce || block.isPaperSapce) {
      return t('notEditable')
    }
    if (block.isXref || block.isOverlayReference) return t('linked')
    // Unnamed blocks (`*D12`, `*U3`) are made by the program that wrote the
    // file for dimensions and dynamic blocks.
    if (
      block.name.startsWith('*') ||
      reference.drawableBlockTableRecord !== block
    ) {
      return t('notEditable')
    }
    if (this._frames.some(frame => frame.blockId === block.objectId)) {
      return t('notEditable')
    }
    if (!acapSymbolEditTransform(reference)) return t('notEditable')
    return undefined
  }

  /** Whether the entity is a placed symbol that can be entered. */
  canEnter(objectId: AcDbObjectId): boolean {
    return this.whyNotEditable(objectId) === undefined
  }

  /**
   * Starts editing the contents of a placed symbol.
   *
   * Must not be called while a command runs (the copies must not become
   * part of the command's undo step).
   *
   * @returns `true` when editing started.
   */
  enter(referenceId: AcDbObjectId): boolean {
    const reason = this.whyNotEditable(referenceId)
    if (reason !== undefined) {
      if (reason) this.view.editor.showMessage(reason, 'warning')
      return false
    }
    const db = AcApDocManager.instance.curDocument.database
    if (db.transactionManager.hasTransaction()) return false

    const blockTable = db.tables.blockTable
    const reference = blockTable.getEntityById(
      referenceId
    ) as AcDbBlockReference
    const block = reference.blockTableRecord!
    const space = blockTable.getIdAt(reference.ownerId)
    const toWorld = acapSymbolEditTransform(reference)
    if (!space || !toWorld) return false

    const sources: AcDbEntity[] = []
    const copies: AcDbEntity[] = []
    try {
      for (const source of block.newIterator()) {
        const copy = source.clone()
        copy.transformBy(toWorld)
        sources.push(source)
        copies.push(copy)
      }
    } catch {
      this.view.editor.showMessage(
        AcApI18n.t('main.symbolEdit.notEditable'),
        'warning'
      )
      return false
    }

    const stack = undoStackOf(db)
    const frame: AcApSymbolEditFrame = {
      referenceId,
      blockId: block.objectId,
      name: block.name,
      spaceId: space.objectId,
      toWorld,
      toBlock: toWorld.clone().invert(),
      inPlace: toWorld.equals(
        new AcGeMatrix3d().multiplyMatrices(
          new AcGeMatrix3d().setFromExtrusionDirection(reference.normal),
          reference.blockTransform
        )
      ),
      working: new Map(),
      modified: new Set(),
      baseRecord: stack?.undoRecords[stack.undoRecords.length - 1],
      undoDepth: getSessionUndo().depth
    }
    // What could be redone was undone before entering, and would act on the
    // canvas behind the symbol.
    if (stack) stack.redoRecords.length = 0
    getSessionUndo().discardDbRedo()

    this.view.selectionSet.clear()
    this.attach(db)
    this._frames.push(frame)
    this._hidden.add(referenceId)
    this.host.setSceneVisible(referenceId, false)

    this.runInternal(() => {
      if (copies.length > 0) space.appendEntity(copies)
    })
    // Ids are final only once the copies are in the drawing.
    copies.forEach((copy, index) => {
      frame.working.set(copy.objectId, {
        original: sources[index],
        print: fingerprint(copy)
      })
    })

    if (AcApSettingManager.instance.operationProfile === 'simple') {
      // Inside a symbol, draw on the layer that follows the symbol.
      frame.previousLayer = db.clayer
      if (db.clayer !== ACAP_SYMBOL_LAYER) db.clayer = ACAP_SYMBOL_LAYER
    }

    this.applyScope()
    // Redo is gone, and undo now stops at this point.
    acapNotifyUndoStackChanged()
    this.notify()
    return true
  }

  /**
   * Stops editing the innermost symbol and writes its contents back to the
   * definition, which updates every placed copy.
   *
   * @returns `true` when a symbol was left; `false` when none is being
   *   edited or a command is running.
   */
  exit(): boolean {
    const frame = this._frames[this._frames.length - 1]
    const db = this._db
    if (!frame || !db) return false
    if (db.transactionManager.hasTransaction()) return false

    const blockTable = db.tables.blockTable
    const space = blockTable.getIdAt(frame.spaceId)
    const block = blockTable.getIdAt(frame.blockId)

    // What is left of the working set, in drawing order.
    const present: AcDbEntity[] = []
    if (space) {
      for (const entity of space.newIterator()) {
        if (frame.working.has(entity.objectId)) present.push(entity)
      }
    }

    // New contents: untouched copies keep the definition's own entity.
    const kept = new Set<AcDbEntity>()
    const added: AcDbEntity[] = []
    for (const entity of present) {
      const entry = frame.working.get(entity.objectId)!
      // The DXF form is what a save would write, so an entity whose form
      // is the same (changed and undone, say) counts as untouched. Edit
      // reports only decide for entities that cannot be written out.
      const untouched =
        !!entry.original &&
        (entry.print !== undefined
          ? entry.print === fingerprint(entity)
          : !frame.modified.has(entity.objectId))
      if (untouched) {
        kept.add(entry.original!)
        continue
      }
      try {
        const result = entity.clone()
        result.transformBy(frame.toBlock)
        added.push(result)
      } catch {
        // Cannot be brought back: leave the definition's entity as it was.
        if (entry.original) kept.add(entry.original)
      }
    }
    const removedIds: AcDbObjectId[] = []
    const propertiesBefore = new Map<string, unknown>()
    if (block) {
      const before = [...block.newIterator()]
      for (const entity of before) {
        if (!kept.has(entity)) removedIds.push(entity.objectId)
      }
      acapSymbolPropertyDefinitions(before).forEach((definition, key) =>
        propertiesBefore.set(key, definition)
      )
    }
    const changed = !!block && (removedIds.length > 0 || added.length > 0)

    this.view.selectionSet.clear()
    this._frames.pop()
    this._hidden.delete(frame.referenceId)

    // The copies leave the canvas without a trace in the undo stack.
    this.runInternal(() => {
      if (space && present.length > 0) {
        space.removeEntity(present.map(entity => entity.objectId))
      }
    })
    const nestedSteps = this.dropSessionUndo(db, frame)

    if (changed) {
      acapRunDatabaseEdit(db, ACAP_SYMBOL_EDIT_UNDO_LABEL, () => {
        if (removedIds.length > 0) block.removeEntity(removedIds)
        if (added.length > 0) block.appendEntity(added)
        acapSyncSymbolProperties(db, block, propertiesBefore)
      })
    }
    this.mergeUndo(db, frame, nestedSteps, changed)

    // When the definition changed, the placed symbols are redrawn (the
    // entered one included) by the view reacting to the edit.
    this.host.setSceneVisible(frame.referenceId, true)

    if (
      frame.previousLayer !== undefined &&
      db.tables.layerTable.has(frame.previousLayer)
    ) {
      if (db.clayer !== frame.previousLayer) db.clayer = frame.previousLayer
    }
    if (!this.isActive) {
      this.detach()
      if (AcApSettingManager.instance.operationProfile === 'simple') {
        acapEnsureDrawingLayer(
          db,
          AcApI18n.t('main.newDrawing.layerPrefix', { fallback: 'Layer' })
        )
      }
    }
    this.applyScope()

    // Leave with the symbol selected, like stepping out of a group.
    if (blockTable.getEntityById(frame.referenceId)) {
      this.view.selectionSet.add(frame.referenceId)
    }
    acapNotifyUndoStackChanged()
    this.notify()
    return true
  }

  /**
   * Leaves symbols until `depth` of them are still being edited (0 = back
   * on the canvas).
   *
   * @returns `true` when that depth was reached.
   */
  exitTo(depth: number): boolean {
    while (this._frames.length > Math.max(0, depth)) {
      if (!this.exit()) return false
    }
    return true
  }

  /** Leaves every symbol being edited, writing each one back. */
  exitAll(): boolean {
    return this.exitTo(0)
  }

  /**
   * Forgets the editing state without touching the drawing or the scene.
   * For when the drawing itself goes away (closed, replaced).
   */
  reset() {
    if (!this.isActive && !this._db) return
    this._frames.length = 0
    this._hidden.clear()
    this.detach()
    this.notify()
  }

  /**
   * Whether an undo right now would step past the moment the symbol was
   * entered. Those steps belong to the canvas behind the symbol and stay
   * out of reach until the symbol is left.
   */
  blocksUndo(): boolean {
    const frame = this._frames[this._frames.length - 1]
    if (!frame || !this._db) return false
    const next = getSessionUndo().peekUndo()
    if (next === 'markup' || next === 'overlay') return false
    const stack = undoStackOf(this._db)
    if (!stack) return false
    return stack.undoRecords.length <= this.sessionStart(stack, frame)
  }

  /**
   * Whether symbol editing has to end before the command runs: commands
   * that read the drawing as a whole (save, export, print) or replace it
   * must not see the copies on the canvas.
   */
  shouldExitBefore(commandName: string): boolean {
    if (!this.isActive) return false
    const name = commandName.trim().toLowerCase()
    return (
      EXIT_BEFORE_COMMANDS.has(name) ||
      acapDrawingExporters().some(exporter => exporter.command === name) ||
      // Exports: `cdxf`, `cjww`, `-cpdf`, `pngout` ...
      /^-?c(dxf|dwg|jww|jwc|sfc|p21|sfz|p2z|pdf|svg|html|image)$/.test(name) ||
      /^(bmp|jpg|png|tiff?|dxf|dwg|pdf|svg|wmf)out$/.test(name) ||
      /^-?(export|plot|print|publish|save|qsave|saveas|wblock)/.test(name)
    )
  }

  /** Re-applies the dimmed display (after the background changed). */
  refreshDisplay() {
    if (this.isActive) this.applyDisplay()
  }

  /** Stops listening; the drawing is left as it is. */
  dispose() {
    this._frames.length = 0
    this._hidden.clear()
    this.detach()
  }

  /** Index in the undo stack of the first step made inside `frame`. */
  private sessionStart(stack: AcApUndoStack, frame: AcApSymbolEditFrame) {
    // A base that fell off the bottom of a full stack leaves only steps
    // made inside.
    return frame.baseRecord === undefined
      ? 0
      : stack.undoRecords.lastIndexOf(frame.baseRecord as AcApUndoRecord) + 1
  }

  /**
   * Takes the steps made inside `frame` off the undo stack: they refer to
   * the copies on the canvas.
   *
   * @returns The steps among them that rewrote a symbol entered from this
   *   one. They stay valid and are folded into this frame's own step.
   */
  private dropSessionUndo(
    db: AcDbDatabase,
    frame: AcApSymbolEditFrame
  ): AcApUndoRecord[] {
    const stack = undoStackOf(db)
    getSessionUndo().discardDbSince(frame.undoDepth)
    if (!stack) {
      // Unknown undo stack: no step can be told apart, so none is kept.
      db.transactionManager.clearUndoStack()
      return []
    }
    const session = stack.undoRecords.splice(this.sessionStart(stack, frame))
    stack.redoRecords.length = 0
    return session.filter(
      record => record.label === ACAP_SYMBOL_EDIT_UNDO_LABEL
    )
  }

  /**
   * Makes the visit one undo step: the steps of symbols entered from this
   * one, then this frame's own (already on the stack when `wrote`).
   */
  private mergeUndo(
    db: AcDbDatabase,
    frame: AcApSymbolEditFrame,
    nestedSteps: AcApUndoRecord[],
    wrote: boolean
  ) {
    if (nestedSteps.length === 0) return
    const stack = undoStackOf(db)
    if (!stack) return
    const changes = nestedSteps.flatMap(step => step.changes)
    if (wrote) {
      const own = stack.undoRecords[stack.undoRecords.length - 1]
      if (
        own &&
        own.label === ACAP_SYMBOL_EDIT_UNDO_LABEL &&
        stack.undoRecords.length > this.sessionStart(stack, frame)
      ) {
        own.changes = [...changes, ...own.changes]
        return
      }
    }
    stack.push({ label: ACAP_SYMBOL_EDIT_UNDO_LABEL, changes })
    eventBus.emit('session-db-edit-committed', {})
  }

  /** Limits selection to the innermost symbol and dims the rest. */
  private applyScope() {
    const db = this._db
    if (db) {
      acapSetEntityEditScope(
        db,
        this.isActive ? id => this.isInScope(id) : undefined
      )
    }
    this.applyDisplay()
  }

  private applyDisplay() {
    const frame = this._frames[this._frames.length - 1]
    if (!frame) {
      this.host.setDimDisplay()
      return
    }
    this.host.setDimDisplay({
      color: acapSymbolEditDimColor(this.host.backgroundColor()),
      keep: [...frame.working.keys()]
    })
  }

  private runInternal(change: () => void) {
    this._internal++
    try {
      change()
    } finally {
      this._internal--
    }
  }

  private attach(db: AcDbDatabase) {
    if (this._db === db) return
    this.detach()
    this._db = db
    db.events.entityAppended.addEventListener(this.onEntityAppended)
    db.events.entityModified.addEventListener(this.onEntityModified)
  }

  private detach() {
    const db = this._db
    if (!db) return
    this._db = undefined
    db.events.entityAppended.removeEventListener(this.onEntityAppended)
    db.events.entityModified.removeEventListener(this.onEntityModified)
    acapSetEntityEditScope(db, undefined)
  }

  /** What is drawn while a symbol is edited becomes part of the symbol. */
  private readonly onEntityAppended = (args: {
    entity: AcDbEntity | AcDbEntity[]
  }) => {
    const frame = this._frames[this._frames.length - 1]
    if (!frame || this._internal > 0) return
    for (const entity of asList(args.entity)) {
      if (entity.ownerId !== frame.spaceId) continue
      const id = entity.objectId
      if (!frame.working.has(id)) frame.working.set(id, {})
      this.host.setKept(id, true)
    }
  }

  private readonly onEntityModified = (args: {
    entity: AcDbEntity | AcDbEntity[]
  }) => {
    for (const entity of asList(args.entity)) {
      for (const frame of this._frames) {
        if (frame.working.has(entity.objectId)) {
          frame.modified.add(entity.objectId)
        }
      }
    }
  }

  private notify() {
    AcApSymbolEditController.events.changed.dispatch({
      view: this.view,
      path: this.path
    })
  }
}

/** Commands that replace or close the drawing. */
const EXIT_BEFORE_COMMANDS = new Set([
  'open',
  'qnew',
  'new',
  'close',
  'closeall',
  'quit',
  'exit',
  'entout',
  'xattach',
  'ipdf'
])
