import { AcApDocManager } from '../app'
import { ACAP_TOOL_SHORTCUTS } from '../app/AcApToolShortcuts'
import { runMarkupEdit } from '../command/markup/AcApMarkupHistory'
import { runMeasurementEdit } from '../command/measure/AcApMeasurementHistory'
import { MEASUREMENT_LAYER } from '../command/measure/AcApMeasurementStore'
import { AcEdMTextEditor } from '../editor/input/ui/AcEdMTextEditor'
import type { AcTrView2d } from './AcTrView2d'

/**
 * Document-level undo/redo shortcut resolved from a keyboard event.
 *
 * - Windows: Ctrl+Z (undo), Ctrl+Y (redo)
 * - macOS: Cmd+Z (undo), Shift+Cmd+Z (redo)
 *
 * Ctrl/Cmd+Shift+Z is also accepted as redo on Windows for convenience.
 */
export type AcEdUndoRedoShortcut = 'undo' | 'redo'

/**
 * Handles global keyboard shortcuts for a CAD view.
 *
 * Shortcuts are suppressed while the user is typing in editable fields, during
 * IME composition, while a command is acquiring input, or while MText is being
 * edited inline.
 */
export class AcEdViewKeyHandler {
  private static readonly COMMAND_LINE_INPUT_CLASS = 'ml-cli-text'

  constructor(private readonly view: AcTrView2d) {}

  /**
   * Handles a document `keydown` event for global view shortcuts.
   *
   * @returns `true` when the event was consumed and default action prevented.
   */
  handleKeyDown(e: KeyboardEvent): boolean {
    const undoRedoShortcut = this.resolveUndoRedoShortcut(e)
    const ignoreEditableTarget = this.shouldIgnoreEditableTargetShortcut(e)

    if (
      !undoRedoShortcut &&
      this.view.toolManager.isSimple &&
      this.handleSimpleProfileKey(e)
    ) {
      return true
    }

    if (ignoreEditableTarget && !undoRedoShortcut) {
      return false
    }

    if (undoRedoShortcut) {
      if (
        !this.shouldHandleUndoRedoShortcut(e) ||
        AcEdMTextEditor.getActiveInputBox() ||
        this.view.editor.isActive
      ) {
        return false
      }

      AcApDocManager.instance.sendStringToExecute(undoRedoShortcut)
      e.preventDefault()
      return true
    }

    switch (e.code) {
      case 'Escape':
        this.clearSelection()
        return false

      case 'Delete':
      case 'Backspace':
        // Only dispatch erase when no command is currently active.
        // Dispatching erase mid-command (e.g. while LINE awaits the next
        // point) corrupts the active command's input pipeline because
        // sendStringToExecute clears scripted inputs unconditionally.
        if (!this.view.editor.isActive) {
          let removed = false
          const ht = this.view.htmlTransientManager
          if (ht.hasSelection()) {
            const selected = ht.getSelectedGroups()
            const measurements = selected.filter(
              group => group.layer === MEASUREMENT_LAYER
            )
            if (measurements.length > 0) {
              runMeasurementEdit(this.view, 'Delete Measurement', () => {
                for (const group of measurements) {
                  if (ht.detach(group.id)) removed = true
                }
              })
            }
            const hasMarkupSelection =
              selected.some(group => group.layer !== MEASUREMENT_LAYER) ||
              (selected.length === 0 && ht.hasSelection())
            if (hasMarkupSelection) {
              runMarkupEdit(this.view, 'Delete Markup', () => {
                removed = ht.deleteSelected() || removed
              })
            }
          }
          if (removed) {
            this.view.isHtmlDirty = true
            e.preventDefault()
            return true
          }
          // lookupGlobalCmd applies the current document's open mode, so it
          // returns undefined in read/review mode and the keypress is
          // silently ignored instead of surfacing an error message.
          if (AcApDocManager.instance.lookupGlobalCmd('erase')) {
            AcApDocManager.instance.sendStringToExecute('erase')
          }
        }
        return false
    }

    return false
  }

  /** Clears the entity and markup / measurement selection. */
  private clearSelection() {
    this.view.selectionSet.clear()
    this.view.htmlTransientManager.deselectAll()
    this.view.isHtmlDirty = true
  }

  /**
   * Simple profile keys: single-key tools (V / H / L / R / T) and the staged
   * Esc (a running command is cancelled by
   * its prompt; then the pan tool goes back to the select tool; only then
   * does Esc clear the selection).
   *
   * @returns `true` when the event was consumed.
   */
  private handleSimpleProfileKey(e: KeyboardEvent): boolean {
    if (e.isComposing || e.keyCode === 229) return false
    const tools = this.view.toolManager
    const running = this.view.editor.isActive || tools.isCommandRunning

    if (e.code === 'Escape') {
      if (running) {
        // Esc cancels the prompt (its own listener); keep the selection.
        return true
      }
      if (tools.handleEscape()) return true
      // Also when a prompt left the focus in the (empty) command line.
      if (this.isTyping(e)) return false
      this.clearSelection()
      return true
    }

    if (e.ctrlKey || e.metaKey || e.altKey || this.isTyping(e)) {
      return false
    }

    const tool = ACAP_TOOL_SHORTCUTS[e.code]
    if (!tool || e.shiftKey || running) {
      return false
    }
    // lookupGlobalCmd applies the document's open mode: drawing tools are
    // ignored in read-only documents.
    if (!AcApDocManager.instance.lookupGlobalCmd(tool)) {
      return false
    }
    tools.activate(tool)
    e.preventDefault()
    return true
  }

  /**
   * Whether the key goes into a text field. The command line counts only when
   * the user clicked into it or typed something: prompts focus it on their
   * own, and single-key tools must still work after a command.
   */
  private isTyping(e: KeyboardEvent): boolean {
    if (!this.shouldIgnoreEditableTargetShortcut(e)) return false
    const target = e.target as HTMLElement | null
    if (
      target?.tagName === 'INPUT' &&
      target.classList.contains(AcEdViewKeyHandler.COMMAND_LINE_INPUT_CLASS)
    ) {
      const input = target as HTMLInputElement
      return (
        input.value.trim() !== '' ||
        input.readOnly ||
        input.dataset.userFocus === 'true'
      )
    }
    return true
  }

  private resolveUndoRedoShortcut(
    e: Pick<KeyboardEvent, 'code' | 'ctrlKey' | 'metaKey' | 'shiftKey'>
  ): AcEdUndoRedoShortcut | null {
    if (!e.ctrlKey && !e.metaKey) {
      return null
    }

    if (e.code === 'KeyY') {
      return 'redo'
    }

    if (e.code === 'KeyZ') {
      return e.shiftKey ? 'redo' : 'undo'
    }

    return null
  }

  private shouldIgnoreEditableTargetShortcut(
    e: Pick<KeyboardEvent, 'target' | 'isComposing' | 'keyCode'>
  ): boolean {
    if (e.isComposing || e.keyCode === 229) {
      return true
    }

    const target = e.target as HTMLElement | null
    if (target?.tagName === 'TEXTAREA') {
      return true
    }

    if (target?.isContentEditable) {
      return true
    }

    return target?.tagName === 'INPUT'
  }

  private shouldHandleUndoRedoShortcut(
    e: Pick<KeyboardEvent, 'target' | 'isComposing' | 'keyCode'>
  ): boolean {
    if (e.isComposing || e.keyCode === 229) {
      return false
    }

    const target = e.target as HTMLElement | null
    if (target?.tagName === 'TEXTAREA') {
      return false
    }

    if (target?.isContentEditable) {
      return false
    }

    if (target?.tagName === 'INPUT') {
      const input = target as HTMLInputElement
      if (
        input.classList.contains(AcEdViewKeyHandler.COMMAND_LINE_INPUT_CLASS)
      ) {
        return input.value.trim() === '' && !input.readOnly
      }
      return false
    }

    return true
  }
}
