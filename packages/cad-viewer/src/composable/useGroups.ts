import {
  acapBuildGroupTree,
  AcApDocManager,
  type AcApGroupNode,
  eventBus
} from '@mlightcad/cad-simple-viewer'
import { onScopeDispose, shallowRef } from 'vue'

/**
 * The groups of the active drawing as a tree (see `acapBuildGroupTree`),
 * read again after every edit, undo / redo and when another drawing becomes
 * active.
 */
export function useGroups(editor: AcApDocManager) {
  const groups = shallowRef<AcApGroupNode[]>([])

  const refresh = () => {
    const db = editor.curDocument?.database
    groups.value = db ? acapBuildGroupTree(db) : []
  }

  // Several edits can land in one tick (a command and its undo mark).
  let scheduled = false
  const scheduleRefresh = () => {
    if (scheduled) return
    scheduled = true
    queueMicrotask(() => {
      scheduled = false
      refresh()
    })
  }

  eventBus.on('undo-stack-changed', scheduleRefresh)
  editor.events.documentActivated.addEventListener(scheduleRefresh)
  onScopeDispose(() => {
    eventBus.off('undo-stack-changed', scheduleRefresh)
    editor.events.documentActivated.removeEventListener(scheduleRefresh)
  })
  refresh()

  return { groups, refresh }
}
