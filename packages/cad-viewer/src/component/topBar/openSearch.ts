import {
  AcApCommandPaletteController,
  type AcApCommandPaletteOpenOptions,
  AcApDocManager,
  type AcEdCommandPaletteAnchor
} from '@mlightcad/cad-simple-viewer'

import { openFindPalette } from '../../command/AcApFindCmd'

/** The top bar's search field, when it is on the page. */
const searchField = () =>
  document.querySelector<HTMLElement>('[data-testid="top-bar-search"]')

/** Window rectangle of the search field (the palette opens over it). */
export function searchFieldAnchor(): AcEdCommandPaletteAnchor | undefined {
  const field = searchField()
  if (!field || !field.isConnected) return undefined
  const rect = field.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) return undefined
  return { left: rect.left, top: rect.top, width: rect.width }
}

/**
 * Opens the command palette over the top bar's search field: commands
 * first (the field, Ctrl / Cmd + K) or the text in the drawing first
 * (Ctrl / Cmd + F).
 *
 * @returns Whether the palette opened.
 */
export function openSearch(
  options: Omit<AcApCommandPaletteOpenOptions, 'anchor'> = {}
): boolean {
  const view = AcApDocManager.instance?.curView
  if (!view) return false
  return view.commandPalette.open({ ...options, anchor: searchFieldAnchor() })
}

/**
 * Hooks the command palette to this UI: it opens over the search field
 * when the top bar shows one, and its "all results" line opens the Find
 * palette with the query.
 */
export function bindCommandPaletteToTopBar() {
  AcApCommandPaletteController.defaultAnchor = searchFieldAnchor
  AcApCommandPaletteController.onShowAllTextResults = query =>
    openFindPalette(query)
  return () => {
    if (AcApCommandPaletteController.defaultAnchor === searchFieldAnchor) {
      AcApCommandPaletteController.defaultAnchor = undefined
    }
    AcApCommandPaletteController.onShowAllTextResults = undefined
  }
}
