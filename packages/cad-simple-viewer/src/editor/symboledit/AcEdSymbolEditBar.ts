/** One level of the breadcrumb. */
export interface AcEdSymbolEditBarItem {
  /** Text shown for the level */
  label: string
  /** Tooltip, if any */
  title?: string
}

/** What the bar shows and what its buttons do. */
export interface AcEdSymbolEditBarContent {
  /** Label of the canvas, the first level */
  rootLabel: string
  /** Symbols being edited, outermost first */
  items: AcEdSymbolEditBarItem[]
  /** Label of the button that leaves the innermost symbol */
  doneLabel: string
  /** Tooltip of that button */
  doneTitle?: string
  /** Note shown after the path (why the contents look different) */
  note?: string
  /** Text read out for the bar */
  ariaLabel: string
  /**
   * Leaves symbols until `depth` of them are still being edited
   * (0 = the canvas).
   */
  onLeaveTo: (depth: number) => void
}

const STYLE_ID = 'ml-symbol-edit-bar-styles'

/** Above the canvas overlays, below dialogs and popup menus. */
const Z_INDEX = 44

const BAR_CSS = `
  .ml-symbol-edit-bar {
    position: absolute;
    top: 10px;
    left: 50%;
    z-index: ${Z_INDEX};
    display: flex;
    align-items: center;
    gap: 2px;
    max-width: calc(100% - 24px);
    padding: 4px 4px 4px 10px;
    box-sizing: border-box;
    transform: translateX(-50%);
    border: 1px solid var(--ml-ui-border, #dcdfe6);
    border-radius: 999px;
    background: var(--ml-ui-bg, #ffffff);
    box-shadow: var(--ml-ui-shadow, 0 6px 18px rgba(0, 0, 0, 0.18));
    color: var(--ml-ui-text, #303133);
    font: 13px/1.4 var(--ml-ui-font-family, 'Noto Sans JP', system-ui, sans-serif);
    user-select: none;
  }
  .ml-symbol-edit-bar-path {
    display: flex;
    align-items: center;
    gap: 2px;
    min-width: 0;
    overflow: hidden;
  }
  .ml-symbol-edit-bar-level {
    flex: 0 1 auto;
    min-width: 0;
    max-width: 16em;
    padding: 3px 6px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--ml-ui-text-muted, #909399);
    font: inherit;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }
  .ml-symbol-edit-bar-level:hover,
  .ml-symbol-edit-bar-level:focus-visible {
    background: var(--ml-ui-accent-soft, color-mix(in srgb, var(--ml-brand, #af61da) 16%, transparent));
    color: var(--ml-ui-text, #303133);
    outline: none;
  }
  .ml-symbol-edit-bar-level.is-current {
    color: var(--ml-ui-text, #303133);
    font-weight: 600;
    cursor: default;
  }
  .ml-symbol-edit-bar-level.is-current:hover {
    background: transparent;
  }
  .ml-symbol-edit-bar-separator {
    flex: 0 0 auto;
    color: var(--ml-ui-text-muted, #909399);
  }
  [dir='rtl'] .ml-symbol-edit-bar-separator {
    transform: scaleX(-1);
  }
  .ml-symbol-edit-bar-note {
    flex: 0 1 auto;
    min-width: 0;
    margin-inline-start: 6px;
    color: var(--ml-ui-text-muted, #909399);
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ml-symbol-edit-bar-done {
    flex: 0 0 auto;
    margin-inline-start: 8px;
    padding: 4px 14px;
    border: 0;
    border-radius: 999px;
    background: var(--ml-brand-gradient, var(--ml-brand, #af61da));
    color: #ffffff;
    font: inherit;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
  }
  .ml-symbol-edit-bar-done:hover {
    filter: brightness(1.08);
  }
  .ml-symbol-edit-bar-done:focus-visible {
    outline: 2px solid var(--ml-brand, #af61da);
    outline-offset: 2px;
  }
`

function ensureStyles(): void {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = BAR_CSS
  document.head.appendChild(style)
}

/**
 * Breadcrumb shown at the top of the drawing while a symbol is edited:
 * `Canvas › Door › Handle  [Done]`. Each earlier level is a button that
 * goes back to it; the last one is the symbol being edited.
 *
 * Plain DOM, placed inside the view's container so it follows the drawing
 * area when panels are docked beside it.
 */
export class AcEdSymbolEditBar {
  private _element?: HTMLDivElement

  constructor(private readonly container: HTMLElement) {}

  /** Whether the bar is on screen. */
  get isShown() {
    return !!this._element
  }

  /** Shows the bar with `content`, replacing what it showed before. */
  show(content: AcEdSymbolEditBarContent) {
    ensureStyles()
    const element = this._element ?? document.createElement('div')
    element.className = 'ml-symbol-edit-bar'
    element.setAttribute('role', 'navigation')
    element.setAttribute('aria-label', content.ariaLabel)
    element.replaceChildren()

    const path = document.createElement('div')
    path.className = 'ml-symbol-edit-bar-path'
    const levels = [{ label: content.rootLabel }, ...content.items]
    levels.forEach((level, depth) => {
      if (depth > 0) {
        const separator = document.createElement('span')
        separator.className = 'ml-symbol-edit-bar-separator'
        separator.setAttribute('aria-hidden', 'true')
        separator.textContent = '›'
        path.appendChild(separator)
      }
      const current = depth === levels.length - 1
      const node = document.createElement(current ? 'span' : 'button')
      node.className = 'ml-symbol-edit-bar-level'
      node.textContent = level.label
      node.title = level.title ?? level.label
      node.dataset.depth = String(depth)
      if (current) {
        node.classList.add('is-current')
        node.setAttribute('aria-current', 'location')
      } else {
        ;(node as HTMLButtonElement).type = 'button'
        node.addEventListener('click', () => content.onLeaveTo(depth))
      }
      path.appendChild(node)
    })
    element.appendChild(path)

    if (content.note) {
      const note = document.createElement('span')
      note.className = 'ml-symbol-edit-bar-note'
      note.textContent = content.note
      note.title = content.note
      element.appendChild(note)
    }

    const done = document.createElement('button')
    done.type = 'button'
    done.className = 'ml-symbol-edit-bar-done'
    done.textContent = content.doneLabel
    if (content.doneTitle) done.title = content.doneTitle
    done.addEventListener('click', () =>
      content.onLeaveTo(content.items.length - 1)
    )
    element.appendChild(done)

    // Keep clicks on the bar from reaching the canvas under it.
    if (!this._element) {
      for (const type of ['mousedown', 'pointerdown', 'dblclick', 'wheel']) {
        element.addEventListener(type, event => event.stopPropagation())
      }
      this.container.appendChild(element)
      this._element = element
    }
  }

  /** Takes the bar off the screen. */
  hide() {
    this._element?.remove()
    this._element = undefined
  }
}
