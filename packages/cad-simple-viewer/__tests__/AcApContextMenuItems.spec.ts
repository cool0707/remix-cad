import {
  acapBuildContextMenu,
  type AcApContextMenuEntry,
  type AcApContextMenuItem,
  type AcApContextMenuState
} from '../src/app/AcApContextMenuItems'

const t = (key: string) => key.replace(/^main\.(contextMenu|tool)\./, '')

function state(
  overrides: Partial<AcApContextMenuState> = {}
): AcApContextMenuState {
  return {
    kind: 'idle',
    canEdit: true,
    isAvailable: () => true,
    t,
    ...overrides
  }
}

const ids = (entries: AcApContextMenuEntry[]) =>
  entries.map(entry => (entry === 'separator' ? '-' : entry.id))

const find = (entries: AcApContextMenuEntry[], id: string) =>
  entries.find(
    (entry): entry is AcApContextMenuItem =>
      entry !== 'separator' && entry.id === id
  )

describe('acapBuildContextMenu', () => {
  describe('while a command waits for input', () => {
    it('offers Enter, undo and cancel when the prompt accepts them', () => {
      const entries = acapBuildContextMenu(
        state({ kind: 'prompt', canConfirm: true, canUndoStep: true })
      )
      expect(ids(entries)).toEqual(['confirm', 'undoStep', 'cancel'])
    })

    it('leaves out what the prompt does not accept', () => {
      const entries = acapBuildContextMenu(state({ kind: 'prompt' }))
      expect(ids(entries)).toEqual(['cancel'])
    })
  })

  describe('with a selection', () => {
    it('lists the edits of the selection', () => {
      const entries = acapBuildContextMenu(
        state({
          hasSelection: true,
          hasEditableSelection: true,
          canPaste: true
        })
      )
      expect(ids(entries)).toEqual([
        'cut',
        'copy',
        'paste',
        '-',
        'duplicate',
        'erase',
        '-',
        'selectSameLayer',
        'properties'
      ])
      expect(find(entries, 'copy')?.shortcut).toBe('Ctrl+C')
    })

    it('only copies when nothing selected can be edited', () => {
      const entries = acapBuildContextMenu(
        state({ hasSelection: true, hasEditableSelection: false })
      )
      expect(ids(entries)).toEqual([
        'copy',
        '-',
        'selectSameLayer',
        'properties'
      ])
    })

    it('only copies in a read-only document', () => {
      const entries = acapBuildContextMenu(
        state({
          hasSelection: true,
          hasEditableSelection: true,
          canEdit: false,
          isAvailable: command => command !== 'erase'
        })
      )
      expect(ids(entries)).not.toContain('cut')
      expect(ids(entries)).not.toContain('duplicate')
      expect(ids(entries)).not.toContain('erase')
      expect(ids(entries)).toContain('copy')
    })

    it('hides commands that are not registered', () => {
      const entries = acapBuildContextMenu(
        state({
          hasSelection: true,
          hasEditableSelection: true,
          isAvailable: command => command !== 'properties'
        })
      )
      expect(ids(entries)).not.toContain('properties')
    })

    it('shows the macOS keys on a Mac', () => {
      const entries = acapBuildContextMenu(
        state({ hasSelection: true, hasEditableSelection: true, isMac: true })
      )
      expect(find(entries, 'cut')?.shortcut).toBe('⌘X')
    })
  })

  describe('without a selection', () => {
    it('lists creating things, the clipboard and the view', () => {
      const entries = acapBuildContextMenu(
        state({
          lastCommand: { name: 'line', label: 'Line' },
          hasSymbols: true,
          canPaste: true,
          canUndo: true,
          canRedo: true
        })
      )
      expect(ids(entries)).toEqual([
        'repeat',
        'create',
        'symbol',
        'comment',
        '-',
        'paste',
        'selectAll',
        'zoomExtents',
        '-',
        'undo',
        'redo'
      ])
      expect(find(entries, 'repeat')?.label).toBe('repeat (Line)')
      expect(find(entries, 'redo')?.shortcut).toBe('Ctrl+Y')
    })

    it('puts the drawing and comment tools in submenus', () => {
      const entries = acapBuildContextMenu(state({ simple: true }))
      const create = find(entries, 'create')?.children ?? []
      expect(ids(create)).toEqual([
        'tool:line',
        'tool:pline',
        'tool:rectang',
        'tool:circle',
        'tool:arc',
        'tool:polygon',
        'tool:ellipse',
        'tool:spline',
        'tool:mtext',
        'tool:hatch'
      ])
      expect(find(create, 'tool:line')?.label).toBe('line')
      expect(find(create, 'tool:line')?.shortcut).toBe('L')
      const comment = find(entries, 'comment')?.children ?? []
      expect(ids(comment)).toContain('tool:markuptext')
      expect(find(comment, 'tool:markuptext')?.label).toBe(
        'comments.markuptext'
      )
    })

    it('shows the single-key tools only in the simple profile', () => {
      const entries = acapBuildContextMenu(state({ simple: false }))
      const create = find(entries, 'create')?.children ?? []
      expect(find(create, 'tool:line')?.shortcut).toBeUndefined()
    })

    it('leaves out what cannot be done now', () => {
      const entries = acapBuildContextMenu(
        state({
          canEdit: false,
          // A read-only document: no drawing tools, no symbol placing.
          isAvailable: command => command.startsWith('markup')
        })
      )
      expect(ids(entries)).toEqual(['comment', '-', 'selectAll', 'zoomExtents'])
    })

    it('does not repeat a command that cannot run now', () => {
      const entries = acapBuildContextMenu(
        state({
          lastCommand: { name: 'line', label: 'Line' },
          isAvailable: command => command !== 'line'
        })
      )
      expect(ids(entries)).not.toContain('repeat')
    })

    it('shows the symbol item only when the drawing has symbols', () => {
      expect(ids(acapBuildContextMenu(state()))).not.toContain('symbol')
    })
  })
})
