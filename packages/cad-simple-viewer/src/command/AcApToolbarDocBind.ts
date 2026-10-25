/**
 * Wires {@link AcUiToolbar} document open / open-mode state and the tool in
 * use to DocManager.
 *
 * Kept separate from the UI module so the offline HTML viewer-runtime can
 * import {@link AcUiToolbar} without pulling DocManager into the IIFE.
 *
 * @module AcApToolbarDocBind
 * @packageDocumentation
 */

import { AcApDocManager } from '../app/AcApDocManager'
import type { AcEdCommand } from '../editor/command/AcEdCommand'
import type { AcEdCommandEventArgs } from '../editor/input/AcEditor'
import { AcEdOpenMode } from '../editor/view/AcEdOpenMode'
import { AcEdViewMode } from '../editor/view/AcEdViewMode'
import type { AcUiToolbar } from '../ui/toolbar/AcUiToolbar'

/**
 * Binds document activated / opening events to a main toolbar, and lights the
 * button of the tool in use: the running command, or the select / pan tool
 * the view is left in between commands.
 * Safe to call after DocManager construction completes.
 *
 * @param toolbar - Toolbar created for a view container.
 * @returns Cleanup that removes listeners.
 */
export function acapBindToolbarDocState(toolbar: AcUiToolbar): () => void {
  const syncFromDocument = () => {
    const dm = AcApDocManager.tryGetInstance()
    if (!dm) {
      toolbar.setDocState({
        hasDocument: false,
        isOpening: false,
        openMode: AcEdOpenMode.Read
      })
      return
    }
    const doc = dm.curDocument
    toolbar.setDocState({
      hasDocument: Boolean(doc),
      isOpening: false,
      openMode: doc?.openMode ?? AcEdOpenMode.Read
    })
  }

  const onDocumentToBeOpened = () => {
    toolbar.setDocState({ isOpening: true })
  }

  let runningCommand: AcEdCommand | undefined

  const syncActiveCommand = () => {
    const dm = AcApDocManager.tryGetInstance()
    if (!dm) {
      toolbar.setActiveCommand(undefined)
      return
    }
    const stack = dm.commandManager
    const lookup = (name: string) =>
      stack.lookupGlobalCmd(name) ?? stack.lookupLocalCmd(name)
    const target =
      runningCommand ??
      lookup(dm.curView.mode === AcEdViewMode.PAN ? 'pan' : 'select')
    if (!target) {
      toolbar.setActiveCommand(undefined)
      return
    }
    // Item commands are scripts: the first line names the command.
    toolbar.setActiveCommand(command => {
      const name = command.split('\n', 1)[0].trim()
      return name !== '' && lookup(name) === target
    })
  }

  const onCommandWillStart = ({ command }: AcEdCommandEventArgs) => {
    runningCommand = command
    syncActiveCommand()
  }

  const onCommandEnded = ({ command }: AcEdCommandEventArgs) => {
    if (runningCommand === command) runningCommand = undefined
    syncActiveCommand()
  }

  const onDocumentActivated = () => {
    syncFromDocument()
    syncActiveCommand()
  }

  const attachDocManager = (attempt = 0) => {
    const dm = AcApDocManager.tryGetInstance()
    if (!dm) {
      // Created mid-constructor: retry briefly until the singleton is assigned.
      // Cap retries so hosts without DocManager never spin forever.
      if (attempt < 20) queueMicrotask(() => attachDocManager(attempt + 1))
      return
    }
    dm.events.documentActivated.addEventListener(onDocumentActivated)
    dm.events.documentToBeOpened.addEventListener(onDocumentToBeOpened)
    dm.editor.events.commandWillStart.addEventListener(onCommandWillStart)
    dm.editor.events.commandEnded.addEventListener(onCommandEnded)
    onDocumentActivated()
  }

  attachDocManager()

  return () => {
    const dm = AcApDocManager.tryGetInstance()
    dm?.events.documentActivated.removeEventListener(onDocumentActivated)
    dm?.events.documentToBeOpened.removeEventListener(onDocumentToBeOpened)
    dm?.editor.events.commandWillStart.removeEventListener(onCommandWillStart)
    dm?.editor.events.commandEnded.removeEventListener(onCommandEnded)
  }
}
