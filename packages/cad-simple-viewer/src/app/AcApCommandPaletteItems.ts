/**
 * Entries of the command palette (Ctrl / Cmd + K) and the search over them.
 *
 * Pure functions of {@link AcApCommandPaletteState}: the view's
 * {@link AcApCommandPaletteController} collects the state, shows the palette
 * and runs the picked entry.
 */

/** What an entry does when picked. */
export type AcApCommandPaletteKind = 'command' | 'action' | 'layer'

/** One line of the palette. */
export interface AcApCommandPaletteEntry {
  /**
   * `'command:line'`, `'action:copy'` (an edit action of the right-click
   * menu) or `'layer:<name>'` (make the layer current).
   */
  id: string
  kind: AcApCommandPaletteKind
  /** Main text (`'線'`, a layer name) */
  label: string
  /** Second line (the command's description) */
  detail?: string
  /** Command name in upper case with its aliases (`'LINE (L)'`) */
  command?: string
  /** Key shown on the right (`'L'`, `'Ctrl+C'`) */
  shortcut?: string
  /** Whether the entry is the current state (the current layer) */
  current?: boolean
  /** Words the search looks at besides the label (CAD terms, names) */
  keywords: string[]
}

/** A registered command. */
export interface AcApCommandPaletteCommand {
  /** Global name, any case (`'LINE'`) */
  name: string
  /** Aliases (`['L']`) */
  aliases: string[]
  /** Command group (`'ACAD'`, `'USER'`) */
  group: string
  /** Whether it is a system variable registered as a command */
  isSysVar?: boolean
}

/** Edit actions of the right-click menu that work right now. */
export interface AcApCommandPaletteActions {
  cut?: boolean
  copy?: boolean
  paste?: boolean
  duplicate?: boolean
  selectAll?: boolean
  selectSameLayer?: boolean
  zoomExtents?: boolean
}

/** What the palette can offer when it opens. */
export interface AcApCommandPaletteState {
  /** Commands that can run in the document (registered and allowed) */
  commands: AcApCommandPaletteCommand[]
  /** Layers of the drawing; empty when the document is read-only */
  layers: { name: string; current?: boolean }[]
  /** Edit actions that can be done */
  actions: AcApCommandPaletteActions
  /** Simple profile: plain names only, single-key tools are shown */
  simple: boolean
  /** Show shortcuts the macOS way (⌘) */
  isMac?: boolean
  /**
   * Localized text of a key (`main.commandPalette.commands.line`), or
   * `undefined` when there is none.
   */
  t: (key: string) => string | undefined
  /** Localized description of a command */
  description: (group: string, name: string) => string | undefined
  /** Commands picked from the palette, the most recent first */
  recent?: string[]
}

/** Single-key tools of the simple profile (see `ACAP_TOOL_SHORTCUTS`). */
const TOOL_KEYS: Readonly<Record<string, string>> = {
  select: 'V',
  pan: 'H',
  line: 'L',
  rectang: 'R',
  mtext: 'T'
}

/** Edit actions in the palette, in this order. */
const ACTIONS: readonly (keyof AcApCommandPaletteActions)[] = [
  'cut',
  'copy',
  'paste',
  'duplicate',
  'selectAll',
  'selectSameLayer',
  'zoomExtents'
]

/** Ctrl / Cmd keys of the edit actions. */
const ACTION_KEYS: Readonly<Record<string, string>> = {
  cut: 'X',
  copy: 'C',
  paste: 'V',
  duplicate: 'D',
  selectAll: 'A'
}

/** Most entries listed at once. */
export const ACAP_COMMAND_PALETTE_LIMIT = 50

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

/** Key shown for a command, if it has one. */
function commandShortcut(name: string, state: AcApCommandPaletteState) {
  if (name === 'undo') return ctrl('Z', state.isMac)
  if (name === 'redo') {
    return state.isMac ? ctrl('Z', true, true) : ctrl('Y')
  }
  if (name === 'erase') return 'Delete'
  return state.simple ? TOOL_KEYS[name] : undefined
}

/** Space-separated words of a localized key. */
function words(text: string | undefined): string[] {
  return text ? text.split(/\s+/).filter(Boolean) : []
}

/**
 * Builds every entry the palette can show for the state, in the order shown
 * for an empty query (layers are only found by searching).
 *
 * - Commands: the simple profile lists only commands with a plain name
 *   (`main.commandPalette.commands.*`) and those of the user group; the CAD
 *   profile lists every command, system variables included.
 * - Edit actions of the right-click menu that work right now.
 * - Layers: picking one makes it current.
 *
 * @param state - What can be done right now.
 */
export function acapBuildCommandPalette(
  state: AcApCommandPaletteState
): AcApCommandPaletteEntry[] {
  const { t } = state
  const commands: AcApCommandPaletteEntry[] = []
  /** System variables, listed after the commands (CAD profile) */
  const sysVars: AcApCommandPaletteEntry[] = []
  const seen = new Set<string>()

  for (const command of state.commands) {
    const name = command.name.toLowerCase()
    if (seen.has(name)) continue
    seen.add(name)
    const plain =
      t(`main.commandPalette.commands.${name}`) ?? t(`main.tool.${name}`)
    const description = state.description(command.group, name)
    const userGroup = command.group.toUpperCase() === 'USER'
    if (state.simple && !plain && !userGroup) continue
    const upper = name.toUpperCase()
    const aliases = command.aliases.map(alias => alias.toUpperCase())
    ;(command.isSysVar ? sysVars : commands).push({
      id: `command:${name}`,
      kind: 'command',
      label: plain ?? description ?? upper,
      detail: plain ? description : undefined,
      command: aliases.length ? `${upper} (${aliases.join(', ')})` : upper,
      shortcut: commandShortcut(name, state),
      keywords: [
        name,
        ...aliases,
        ...words(t(`main.commandPalette.keywords.${name}`)),
        ...(plain && description ? [description] : [])
      ]
    })
  }
  const byLabel = (a: AcApCommandPaletteEntry, b: AcApCommandPaletteEntry) =>
    a.label.localeCompare(b.label)
  commands.sort(byLabel)
  sysVars.sort(byLabel)
  commands.push(...sysVars)

  const actions: AcApCommandPaletteEntry[] = []
  for (const action of ACTIONS) {
    if (!state.actions[action]) continue
    const key = ACTION_KEYS[action]
    actions.push({
      id: `action:${action}`,
      kind: 'action',
      label: t(`main.contextMenu.${action}`) ?? action,
      shortcut: key ? ctrl(key, state.isMac) : undefined,
      keywords: words(t(`main.commandPalette.keywords.${action}`))
    })
  }

  const layerWord = t('main.commandPalette.layer')
  const layers: AcApCommandPaletteEntry[] = state.layers.map(layer => ({
    id: `layer:${layer.name}`,
    kind: 'layer',
    label: layer.name,
    detail: layer.current
      ? t('main.commandPalette.layerCurrent')
      : t('main.commandPalette.layerSetCurrent'),
    current: !!layer.current,
    keywords: layerWord ? [layerWord] : []
  }))

  // Recently picked commands first.
  const recent = (state.recent ?? []).map(name => `command:${name}`)
  const recentEntries = recent
    .map(id => commands.find(entry => entry.id === id))
    .filter((entry): entry is AcApCommandPaletteEntry => !!entry)
  const rest = commands.filter(entry => !recent.includes(entry.id))
  return [...recentEntries, ...actions, ...rest, ...layers]
}

/**
 * Text folded for matching: full-width to half-width, lower case, katakana
 * to hiragana (`'レイヤー'` and `'れいやー'` match).
 */
export function acapFoldSearchText(text: string): string {
  return text
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60))
}

/** How well one query word matches an entry (0: not at all). */
function scoreWord(word: string, entry: AcApCommandPaletteEntry): number {
  const label = acapFoldSearchText(entry.label)
  if (label === word) return 100
  if (label.startsWith(word)) return 80
  let best = label.includes(word) ? 60 : 0
  // A layer's only keyword is the word "layer": it narrows a search
  // ("layer wall") but must not put every layer above the layer commands.
  if (entry.kind === 'layer') {
    if (
      !best &&
      entry.keywords.some(k => acapFoldSearchText(k).startsWith(word))
    ) {
      best = 10
    }
    return best
  }
  for (const keyword of entry.keywords) {
    const folded = acapFoldSearchText(keyword)
    if (folded === word) best = Math.max(best, 90)
    else if (folded.startsWith(word)) best = Math.max(best, 70)
    else if (folded.includes(word)) best = Math.max(best, 40)
  }
  if (
    !best &&
    entry.detail &&
    acapFoldSearchText(entry.detail).includes(word)
  ) {
    best = 20
  }
  return best
}

/** Order of the kinds when the scores are equal. */
const KIND_ORDER: Readonly<Record<AcApCommandPaletteKind, number>> = {
  command: 0,
  action: 1,
  layer: 2
}

/**
 * Entries matching a query, the best first. Every word of the query has to
 * match the entry's label, one of its keywords (command name, alias, CAD
 * term) or its description. An empty query lists everything but the layers,
 * in the built order.
 *
 * @param entries - From {@link acapBuildCommandPalette}.
 * @param query - What was typed.
 * @param limit - Most entries returned.
 */
export function acapSearchCommandPalette(
  entries: AcApCommandPaletteEntry[],
  query: string,
  limit = ACAP_COMMAND_PALETTE_LIMIT
): AcApCommandPaletteEntry[] {
  const queryWords = acapFoldSearchText(query).split(/\s+/).filter(Boolean)
  if (!queryWords.length) {
    return entries.filter(entry => entry.kind !== 'layer').slice(0, limit)
  }
  const scored: { entry: AcApCommandPaletteEntry; score: number; i: number }[] =
    []
  entries.forEach((entry, i) => {
    let score = 0
    for (const word of queryWords) {
      const s = scoreWord(word, entry)
      if (!s) return
      score += s
    }
    scored.push({ entry, score, i })
  })
  scored.sort(
    (a, b) =>
      b.score - a.score ||
      KIND_ORDER[a.entry.kind] - KIND_ORDER[b.entry.kind] ||
      a.i - b.i
  )
  return scored.slice(0, limit).map(item => item.entry)
}

/**
 * Whether a key event is the palette's shortcut: Ctrl+K (Cmd+K on macOS).
 *
 * @param e - Key event.
 */
export function acapIsCommandPaletteShortcut(
  e: Pick<
    KeyboardEvent,
    'code' | 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey' | 'isComposing'
  >
) {
  return (
    e.code === 'KeyK' &&
    (e.ctrlKey || e.metaKey) &&
    !e.altKey &&
    !e.shiftKey &&
    !e.isComposing
  )
}
