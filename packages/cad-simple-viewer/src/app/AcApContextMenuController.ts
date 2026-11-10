import { AcDbBlockReference, AcGePoint2dLike } from '@mlightcad/data-model'

import { isInsertableBlockName } from '../command/draw/isInsertableBlockName'
import { getSessionUndo } from '../command/markup/AcApMarkupHistory'
import { AcEdContextMenu } from '../editor/contextmenu/AcEdContextMenu'
import { AcEdMTextEditor } from '../editor/input/ui/AcEdMTextEditor'
import { acedIsTouchLongPressContextMenu } from '../editor/input/ui/AcEdTouchPointSession'
import type { AcEdBaseView } from '../editor/view/AcEdBaseView'
import { AcApI18n } from '../i18n'
import {
  acapBuildContextMenu,
  type AcApContextMenuState
} from './AcApContextMenuItems'
import { AcApDocManager } from './AcApDocManager'
import type { AcApEditActions } from './AcApEditActions'
import { AcApSettingManager } from './AcApSettingManager'
import type { AcApToolManager } from './AcApToolManager'

/** Parts of the view the menu works with. */
export interface AcApContextMenuControllerOptions {
  /** Tool in use, last command */
  toolManager: AcApToolManager
  /** Clipboard, duplicate, select all ... */
  editActions: AcApEditActions
  /** Whether a right-click inside a prompt is Enter (the CAD profile) */
  rightClickIsEnter: () => boolean
}

/** Global name of the keyword that takes the last pick back. */
const UNDO_KEYWORD = 'undo'

/**
 * The view's right-click menu.
 *
 * - When nothing waits for input (both profiles): a menu for the selection,
 *   or, without one, for creating things and the view. In the simple profile
 *   a right-click on an unselected entity selects it first (as in drawing
 *   apps).
 * - While a command waits for input in the simple profile: Enter, take the
 *   last pick back (when the prompt can) and cancel. The CAD profile keeps
 *   right-click as Enter there.
 */
export class AcApContextMenuController {
  private readonly abort = new AbortController()
  private menu?: AcEdContextMenu

  /**
   * @param view - View whose canvas gets the menu.
   * @param options - Parts of the view the menu works with.
   */
  constructor(
    private readonly view: AcEdBaseView,
    private readonly options: AcApContextMenuControllerOptions
  ) {
    view.container.addEventListener('contextmenu', e => this.onContextMenu(e), {
      signal: this.abort.signal
    })
  }

  /** The open menu, if any (for tests). */
  get openMenu() {
    return this.menu?.isOpen ? this.menu : undefined
  }

  /** Removes the listener and closes the menu. */
  dispose() {
    this.abort.abort()
    this.menu?.close()
  }

  /**
   * Opens the menu for a point of the window, as a right-click there would.
   *
   * @param clientX - Window X.
   * @param clientY - Window Y.
   * @returns Whether a menu opened.
   */
  openAt(clientX: number, clientY: number): boolean {
    const state = this.collectState(clientX, clientY)
    if (!state) return false
    const entries = acapBuildContextMenu(state)
    if (!entries.length) return false
    const world = this.clientToWorld(clientX, clientY)
    this.menu = new AcEdContextMenu(
      entries,
      clientX,
      clientY,
      id => this.run(id, world),
      () => {
        this.menu = undefined
      }
    )
    return true
  }

  private onContextMenu(e: MouseEvent) {
    if (!this.isCanvasTarget(e.target)) return
    if (acedIsTouchLongPressContextMenu(e)) return
    e.preventDefault()
    this.openAt(e.clientX, e.clientY)
  }

  /** The drawing area itself, or the simple profile's selection frame. */
  private isCanvasTarget(target: EventTarget | null) {
    if (target === this.view.canvas) return true
    return target instanceof Element && target.closest('.ml-sel-frame') != null
  }

  /**
   * What is possible at the click, or `undefined` when the menu must not
   * open (a command between prompts, text being edited, right-click is
   * Enter).
   */
  private collectState(
    clientX: number,
    clientY: number
  ): AcApContextMenuState | undefined {
    if (AcEdMTextEditor.getActiveInputBox()) return undefined
    const docManager = AcApDocManager.instance
    const doc = docManager?.curDocument
    if (!doc) return undefined
    const t = (key: string) => AcApI18n.t(key)
    const isAvailable = (command: string) =>
      !!docManager.lookupGlobalCmd(command)
    const editor = this.view.editor
    const tools = this.options.toolManager

    if (editor.isActive) {
      if (this.options.rightClickIsEnter()) return undefined
      const actions = editor.promptActions
      return {
        kind: 'prompt',
        canConfirm: actions?.canConfirm ?? false,
        canUndoStep:
          actions?.keywords.some(
            kw => kw.globalName.toLowerCase() === UNDO_KEYWORD
          ) ?? false,
        isAvailable,
        t
      }
    }
    // A command between prompts (a dialog of its own, an async step).
    if (tools.isCommandRunning) return undefined

    const simple = AcApSettingManager.instance.operationProfile === 'simple'
    if (simple) this.selectUnderCursor(clientX, clientY)

    const actions = this.options.editActions
    const selected = actions.selectedEntities(false)
    const editable = actions.selectedEntities(true)
    const db = doc.database
    const session = getSessionUndo()
    const last = tools.lastCommand
    return {
      kind: 'idle',
      hasSelection: selected.length > 0,
      hasEditableSelection: editable.length > 0,
      hasSymbolSelection: editable.some(
        entity => entity instanceof AcDbBlockReference
      ),
      canEdit: actions.canEdit,
      canPaste: actions.canPaste,
      canUndo: session.canUndo(db),
      canRedo: session.canRedo(db),
      lastCommand: last
        ? { name: last, label: tools.labelOf(last) }
        : undefined,
      hasSymbols: this.hasSymbols(),
      isAvailable,
      t,
      isMac: acapIsMacPlatform(),
      simple
    }
  }

  /**
   * Simple profile: a right-click on an entity that is not selected selects
   * it (replacing the selection), so the menu is about what was clicked.
   */
  private selectUnderCursor(clientX: number, clientY: number) {
    const view = this.view
    if (!view.entitySelectionEnabled) return
    const picked = view.pick(this.clientToWorld(clientX, clientY))
    const id = picked[0]?.id
    if (!id || view.selectionSet.has(id)) return
    view.applySelection([id], 'replace')
  }

  private hasSymbols() {
    const db = AcApDocManager.instance.curDocument.database
    for (const block of db.tables.blockTable.newIterator()) {
      if (isInsertableBlockName(block.name ?? '') && !block.isXref) {
        return true
      }
    }
    return false
  }

  private clientToWorld(clientX: number, clientY: number): AcGePoint2dLike {
    const canvas = this.view.viewportToCanvas({ x: clientX, y: clientY })
    const world = this.view.screenToWorld(canvas)
    return { x: world.x, y: world.y }
  }

  /** Runs a picked item. */
  private run(id: string, world: AcGePoint2dLike) {
    const docManager = AcApDocManager.instance
    const view = this.view
    const tools = this.options.toolManager
    const actions = this.options.editActions
    const prompt = view.editor.promptActions

    if (id.startsWith('tool:')) {
      tools.activate(id.slice('tool:'.length))
      return
    }
    switch (id) {
      case 'confirm':
        prompt?.confirm()
        break
      case 'undoStep': {
        const keyword = prompt?.keywords.find(
          kw => kw.globalName.toLowerCase() === UNDO_KEYWORD
        )
        if (keyword) prompt?.keyword(keyword.globalName)
        break
      }
      case 'cancel':
        if (prompt) prompt.cancel()
        else view.editor.cancelActiveInput()
        break
      case 'repeat':
        if (tools.lastCommand) tools.activate(tools.lastCommand)
        break
      case 'symbol':
        docManager.sendStringToExecute('insert')
        break
      case 'cut':
        actions.cut()
        break
      case 'copy':
        actions.copy()
        break
      case 'paste':
        actions.paste(world)
        break
      case 'duplicate':
        actions.duplicate()
        break
      case 'erase':
      case 'explode':
        docManager.sendStringToExecute(id)
        break
      case 'selectSameLayer':
        actions.selectSameLayer()
        break
      case 'properties':
        docManager.sendStringToExecute('properties')
        break
      case 'selectAll':
        actions.selectAll()
        break
      case 'zoomExtents':
        view.zoomToFitDrawing()
        break
      case 'undo':
      case 'redo':
        docManager.sendStringToExecute(id)
        break
    }
    // Keys (Esc, single-key tools, shortcuts) go to the view again.
    const active = document.activeElement
    if (!active || active === document.body) {
      view.container.focus({ preventScroll: true })
    }
  }
}

/** Whether shortcuts are shown the macOS way (⌘). */
export function acapIsMacPlatform() {
  if (typeof navigator === 'undefined') return false
  const nav = navigator as Navigator & {
    userAgentData?: { platform?: string }
  }
  const platform = nav.userAgentData?.platform || nav.platform || ''
  return /mac|iphone|ipad/i.test(platform)
}
