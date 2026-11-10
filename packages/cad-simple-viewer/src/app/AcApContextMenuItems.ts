/**
 * Items of the view's right-click menu, decided from what can be done right
 * now: only actions that are possible are listed (nothing is greyed out).
 *
 * The builder is a pure function of {@link AcApContextMenuState}; the view's
 * {@link AcApContextMenuController} collects the state and runs the picked
 * item.
 */

/** One clickable item, or a submenu when it has `children`. */
export interface AcApContextMenuItem {
  /**
   * What the item does: `'copy'`, `'paste'`, ... For the drawing and comment
   * submenus it is the command to start, prefixed by `'tool:'`
   * (`'tool:line'`, `'tool:markuptext'`).
   */
  id: string
  /** Localized text */
  label: string
  /** Key shown on the right (`'Ctrl+C'`) */
  shortcut?: string
  /** Items of the submenu */
  children?: AcApContextMenuEntry[]
}

/** A menu entry: an item or a separator line. */
export type AcApContextMenuEntry = AcApContextMenuItem | 'separator'

/** What is possible when the menu opens. */
export interface AcApContextMenuState {
  /**
   * `'prompt'` while a command waits for input (simple profile), `'idle'`
   * otherwise.
   */
  kind: 'prompt' | 'idle'
  /** Prompt: Enter is accepted */
  canConfirm?: boolean
  /** Prompt: the prompt offers an "undo" keyword (take the last pick back) */
  canUndoStep?: boolean
  /** Idle: entities are selected */
  hasSelection?: boolean
  /** Idle: some selected entities can be edited (not all on locked layers) */
  hasEditableSelection?: boolean
  /** Idle: some editable selected entities are symbols (block references) */
  hasSymbolSelection?: boolean
  /** The document is open for writing */
  canEdit?: boolean
  /** Something copied from this document can be pasted */
  canPaste?: boolean
  /** Undo / redo of the document session is possible */
  canUndo?: boolean
  canRedo?: boolean
  /** The command to repeat and its localized name */
  lastCommand?: { name: string; label: string }
  /** The drawing has symbols (blocks) to place */
  hasSymbols?: boolean
  /** Whether a command can run in the document (registered and allowed) */
  isAvailable: (command: string) => boolean
  /** Localized text of a key under `main.contextMenu` / `main.tool` */
  t: (key: string) => string
  /** Show shortcuts the macOS way (⌘) */
  isMac?: boolean
  /** Simple profile: the single-key tools (L / R / T) are shown */
  simple?: boolean
}

/** Drawing tools of the "Create" submenu, in the left toolbar's order. */
const CREATE_TOOLS = [
  'line',
  'pline',
  'rectang',
  'circle',
  'arc',
  'polygon',
  'ellipse',
  'spline',
  'mtext',
  'hatch'
] as const

/** Single-key tools of the simple profile (see `ACAP_TOOL_SHORTCUTS`). */
const TOOL_KEYS: Readonly<Record<string, string>> = {
  line: 'L',
  rectang: 'R',
  mtext: 'T'
}

/** Comment (markup) tools of the "Comment" submenu. */
const COMMENT_TOOLS = [
  'markuptext',
  'markupcloud',
  'markuprect',
  'markupcircle',
  'markuparrow',
  'markupline',
  'markupcallout',
  'markupstamp'
] as const

/**
 * Shortcut text for a Ctrl / Cmd key.
 *
 * @param key - Key name (`'C'`).
 * @param mac - macOS style.
 * @param shift - With Shift.
 */
function ctrl(key: string, mac?: boolean, shift = false) {
  if (mac) return `${shift ? '⇧' : ''}⌘${key}`
  return `Ctrl+${shift ? 'Shift+' : ''}${key}`
}

/**
 * Builds the right-click menu for the given state.
 *
 * - While a command waits for input: Enter / undo the last pick / cancel.
 * - With a selection: clipboard, duplicate, delete, explode (symbols),
 *   select the same layer, properties.
 * - Without one: repeat, create, symbol, comment, paste, select all, zoom
 *   extents, undo / redo.
 *
 * @param state - What is possible right now.
 * @returns Entries without leading, trailing or doubled separators.
 */
export function acapBuildContextMenu(
  state: AcApContextMenuState
): AcApContextMenuEntry[] {
  const { t, isMac } = state
  const item = (
    id: string,
    shortcut?: string,
    children?: AcApContextMenuEntry[]
  ): AcApContextMenuItem => ({
    id,
    label: t(`main.contextMenu.${id}`),
    ...(shortcut ? { shortcut } : {}),
    ...(children ? { children } : {})
  })
  const entries: (AcApContextMenuItem | 'separator' | false | undefined)[] = []

  if (state.kind === 'prompt') {
    entries.push(
      state.canConfirm && item('confirm', 'Enter'),
      state.canUndoStep && item('undoStep'),
      item('cancel', 'Esc')
    )
    return tidy(entries)
  }

  const edit = !!state.canEdit
  if (state.hasSelection) {
    const editable = edit && !!state.hasEditableSelection
    entries.push(
      editable && item('cut', ctrl('X', isMac)),
      item('copy', ctrl('C', isMac)),
      state.canPaste && item('paste', ctrl('V', isMac)),
      'separator',
      editable && item('duplicate', ctrl('D', isMac)),
      editable && state.isAvailable('erase') && item('erase', 'Delete'),
      editable &&
        state.hasSymbolSelection &&
        state.isAvailable('explode') &&
        item('explode'),
      'separator',
      item('selectSameLayer'),
      state.isAvailable('properties') && item('properties')
    )
    return tidy(entries)
  }

  const last = state.lastCommand
  if (last && state.isAvailable(last.name)) {
    entries.push({
      id: 'repeat',
      label: `${t('main.contextMenu.repeat')} (${last.label})`
    })
  }

  const create = CREATE_TOOLS.filter(tool => state.isAvailable(tool)).map(
    tool => ({
      id: `tool:${tool}`,
      label: t(`main.tool.${tool}`),
      ...(state.simple && TOOL_KEYS[tool] ? { shortcut: TOOL_KEYS[tool] } : {})
    })
  )
  if (create.length) entries.push(item('create', undefined, create))

  if (state.hasSymbols && state.isAvailable('insert')) {
    entries.push(item('symbol'))
  }

  const comments = COMMENT_TOOLS.filter(tool => state.isAvailable(tool)).map(
    tool => ({
      id: `tool:${tool}`,
      label: t(`main.contextMenu.comments.${tool}`)
    })
  )
  if (comments.length) entries.push(item('comment', undefined, comments))

  entries.push(
    'separator',
    state.canPaste && item('paste', ctrl('V', isMac)),
    item('selectAll', ctrl('A', isMac)),
    item('zoomExtents'),
    'separator',
    state.canUndo && item('undo', ctrl('Z', isMac)),
    state.canRedo && item('redo', isMac ? ctrl('Z', true, true) : ctrl('Y'))
  )
  return tidy(entries)
}

/** Drops empty slots and separators that would not separate anything. */
function tidy(
  entries: (AcApContextMenuItem | 'separator' | false | undefined)[]
): AcApContextMenuEntry[] {
  const result: AcApContextMenuEntry[] = []
  for (const entry of entries) {
    if (!entry) continue
    if (entry === 'separator') {
      if (result.length && result[result.length - 1] !== 'separator') {
        result.push(entry)
      }
      continue
    }
    result.push(entry)
  }
  while (result[result.length - 1] === 'separator') result.pop()
  return result
}
