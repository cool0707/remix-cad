/**
 * The command palette: a search box with a list of results, shown over the
 * page and drawn with the UI theme variables (`--ml-ui-*`).
 *
 * @module AcEdCommandPalette
 * @packageDocumentation
 */

/** One result line. */
export interface AcEdCommandPaletteItem {
  /** Passed to the pick callback */
  id: string
  /** Main text */
  label: string
  /** Second line, muted */
  detail?: string
  /** Small label before the main text (`'Layer'`) */
  tag?: string
  /** Command name shown on the right (`'LINE (L)'`) */
  command?: string
  /** Key shown on the right (`'Ctrl+C'`) */
  shortcut?: string
}

/** Options of {@link AcEdCommandPalette}. */
export interface AcEdCommandPaletteOptions {
  /** Results for what was typed (called again on every change) */
  search: (query: string) => AcEdCommandPaletteItem[]
  /** Called with the picked item's id, after the palette closed */
  onPick: (id: string) => void
  /** Called whenever the palette closes (also after a pick) */
  onClose?: () => void
  /** Placeholder of the search box */
  placeholder?: string
  /** Text shown when nothing matches */
  emptyText?: string
  /** Accessible name of the palette */
  title?: string
}

const STYLE_ID = 'ml-command-palette-styles'

/** Above the viewer's own overlays and Element Plus popups (2000+). */
const Z_INDEX = 4000

const PALETTE_CSS = `
  .ml-command-palette-backdrop {
    position: fixed;
    inset: 0;
    z-index: ${Z_INDEX};
    background: transparent;
  }
  .ml-command-palette {
    position: fixed;
    z-index: ${Z_INDEX + 1};
    top: 12vh;
    left: 50%;
    transform: translateX(-50%);
    width: min(560px, calc(100vw - 32px));
    max-height: 70vh;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    border: 1px solid var(--ml-ui-border, #dcdfe6);
    border-radius: 10px;
    background: var(--ml-ui-bg, #ffffff);
    box-shadow: var(--ml-ui-shadow, 0 12px 32px rgba(0, 0, 0, 0.24));
    color: var(--ml-ui-text, #303133);
    font: 13px/1.4 var(--ml-ui-font-family, 'Noto Sans JP', system-ui, sans-serif);
    overflow: hidden;
  }
  .ml-command-palette-input {
    flex: 0 0 auto;
    width: 100%;
    box-sizing: border-box;
    padding: 12px 14px;
    border: 0;
    border-bottom: 1px solid var(--ml-ui-border, #dcdfe6);
    background: transparent;
    color: inherit;
    font: inherit;
    font-size: 15px;
    outline: none;
  }
  .ml-command-palette-input::placeholder {
    color: var(--ml-ui-text-muted, #909399);
  }
  .ml-command-palette-list {
    flex: 1 1 auto;
    overflow-y: auto;
    padding: 4px;
  }
  .ml-command-palette-item {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    min-height: 34px;
    padding: 5px 10px;
    box-sizing: border-box;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: start;
    cursor: pointer;
  }
  .ml-command-palette-item.is-active {
    background: var(--ml-ui-accent-soft, color-mix(in srgb, var(--ml-brand, #af61da) 16%, transparent));
  }
  .ml-command-palette-main {
    flex: 1 1 auto;
    min-width: 0;
  }
  .ml-command-palette-label,
  .ml-command-palette-detail {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ml-command-palette-detail {
    color: var(--ml-ui-text-muted, #909399);
    font-size: 12px;
  }
  .ml-command-palette-tag {
    display: inline-block;
    margin-inline-end: 6px;
    padding: 0 6px;
    border-radius: 4px;
    background: var(--ml-ui-fill, rgba(127, 127, 127, 0.14));
    color: var(--ml-ui-text-muted, #909399);
    font-size: 11px;
    vertical-align: 1px;
  }
  .ml-command-palette-command {
    flex: 0 0 auto;
    color: var(--ml-ui-text-muted, #909399);
    font: 11px/1.4 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  }
  .ml-command-palette-shortcut {
    flex: 0 0 auto;
    min-width: 18px;
    padding: 0 5px;
    border: 1px solid var(--ml-ui-border, #dcdfe6);
    border-radius: 4px;
    color: var(--ml-ui-text-muted, #909399);
    font-size: 11px;
    text-align: center;
  }
  .ml-command-palette-empty {
    padding: 14px;
    color: var(--ml-ui-text-muted, #909399);
    text-align: center;
  }
`

function ensureStyles(): void {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = PALETTE_CSS
  document.head.appendChild(style)
}

/**
 * A command palette over the page. Only one is open at a time; it closes
 * when an item is picked, on Esc, on a press outside it and when the window
 * loses focus.
 *
 * While it is open, the keys typed in it go nowhere else (no view shortcut,
 * no prompt of a running command).
 */
export class AcEdCommandPalette {
  private static _current: AcEdCommandPalette | null = null

  /** The open palette, if any. */
  static get current() {
    return AcEdCommandPalette._current
  }

  /** Closes the open palette, if any. */
  static closeAll() {
    AcEdCommandPalette._current?.close()
  }

  private readonly backdrop: HTMLDivElement
  private readonly root: HTMLDivElement
  private readonly input: HTMLInputElement
  private readonly list: HTMLDivElement
  private readonly abort = new AbortController()
  private items: AcEdCommandPaletteItem[] = []
  private buttons: HTMLButtonElement[] = []
  private active = -1
  private closed = false
  /** Focused before the palette opened; gets the focus back when it closes. */
  private readonly previousFocus: Element | null

  /**
   * Opens the palette (closing the one already open) with the results of an
   * empty query.
   *
   * @param options - Search, pick callback and texts.
   */
  constructor(private readonly options: AcEdCommandPaletteOptions) {
    AcEdCommandPalette.closeAll()
    AcEdCommandPalette._current = this
    this.previousFocus = document.activeElement
    ensureStyles()

    this.backdrop = document.createElement('div')
    this.backdrop.className = 'ml-command-palette-backdrop'

    this.root = document.createElement('div')
    this.root.className = 'ml-command-palette'
    this.root.setAttribute('role', 'dialog')
    this.root.setAttribute('aria-modal', 'true')
    if (options.title) this.root.setAttribute('aria-label', options.title)
    const dir = document.documentElement.dir
    if (dir) this.root.dir = dir

    this.input = document.createElement('input')
    this.input.type = 'text'
    this.input.className = 'ml-command-palette-input'
    this.input.autocomplete = 'off'
    this.input.spellcheck = false
    this.input.setAttribute('role', 'combobox')
    this.input.setAttribute('aria-expanded', 'true')
    this.input.setAttribute('aria-autocomplete', 'list')
    if (options.placeholder) this.input.placeholder = options.placeholder

    this.list = document.createElement('div')
    this.list.className = 'ml-command-palette-list'
    this.list.setAttribute('role', 'listbox')
    this.list.id = `ml-command-palette-list-${Date.now()}`
    this.input.setAttribute('aria-controls', this.list.id)

    this.root.append(this.input, this.list)
    document.body.append(this.backdrop, this.root)

    this.input.addEventListener('input', () => this.refresh(), {
      signal: this.abort.signal
    })
    this.bindGlobalEvents()
    this.refresh()
    this.input.focus({ preventScroll: true })
  }

  /** Root element of the palette (for tests and styling). */
  get element(): HTMLElement {
    return this.root
  }

  /** Whether the palette is still open. */
  get isOpen() {
    return !this.closed
  }

  /** Closes the palette without picking anything. */
  close() {
    if (this.closed) return
    this.closed = true
    this.abort.abort()
    this.backdrop.remove()
    this.root.remove()
    const previous = this.previousFocus
    if (
      document.activeElement === document.body &&
      previous instanceof HTMLElement &&
      previous.isConnected
    ) {
      previous.focus({ preventScroll: true })
    }
    if (AcEdCommandPalette._current === this) AcEdCommandPalette._current = null
    this.options.onClose?.()
  }

  /** Searches again for the text in the box and redraws the list. */
  private refresh() {
    this.items = this.options.search(this.input.value)
    this.buttons = []
    this.list.replaceChildren()
    if (!this.items.length) {
      const empty = document.createElement('div')
      empty.className = 'ml-command-palette-empty'
      empty.textContent = this.options.emptyText ?? ''
      this.list.appendChild(empty)
    }
    this.items.forEach((item, index) => {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'ml-command-palette-item'
      button.setAttribute('role', 'option')
      button.id = `${this.list.id}-${index}`
      button.dataset.id = item.id
      button.tabIndex = -1

      const main = document.createElement('span')
      main.className = 'ml-command-palette-main'
      const label = document.createElement('span')
      label.className = 'ml-command-palette-label'
      if (item.tag) {
        const tag = document.createElement('span')
        tag.className = 'ml-command-palette-tag'
        tag.textContent = item.tag
        label.appendChild(tag)
      }
      label.appendChild(document.createTextNode(item.label))
      main.appendChild(label)
      if (item.detail) {
        const detail = document.createElement('span')
        detail.className = 'ml-command-palette-detail'
        detail.textContent = item.detail
        main.appendChild(detail)
      }
      button.appendChild(main)
      if (item.command) {
        const command = document.createElement('span')
        command.className = 'ml-command-palette-command'
        command.textContent = item.command
        button.appendChild(command)
      }
      if (item.shortcut) {
        const shortcut = document.createElement('kbd')
        shortcut.className = 'ml-command-palette-shortcut'
        shortcut.textContent = item.shortcut
        button.appendChild(shortcut)
      }
      button.addEventListener('mousemove', () => {
        if (this.active !== index) this.setActive(index, false)
      })
      button.addEventListener('mousedown', e => e.preventDefault())
      button.addEventListener('click', e => {
        e.preventDefault()
        this.setActive(index, false)
        this.pick()
      })
      this.buttons.push(button)
      this.list.appendChild(button)
    })
    this.active = -1
    this.setActive(this.items.length ? 0 : -1, true)
  }

  private setActive(index: number, scroll: boolean) {
    this.buttons[this.active]?.classList.remove('is-active')
    this.buttons[this.active]?.setAttribute('aria-selected', 'false')
    this.active = index
    const button = this.buttons[index]
    if (button) {
      button.classList.add('is-active')
      button.setAttribute('aria-selected', 'true')
      this.input.setAttribute('aria-activedescendant', button.id)
      if (scroll) button.scrollIntoView({ block: 'nearest' })
    } else {
      this.input.removeAttribute('aria-activedescendant')
    }
  }

  /** Picks the active item. */
  private pick() {
    const item = this.items[this.active]
    if (!item) return
    this.close()
    this.options.onPick(item.id)
  }

  private bindGlobalEvents() {
    const signal = this.abort.signal
    this.backdrop.addEventListener('pointerdown', e => {
      e.preventDefault()
      this.close()
    })
    this.backdrop.addEventListener('contextmenu', e => e.preventDefault())
    // Window capture runs before every other key listener: the view's
    // shortcuts and the prompts of a running command never see these keys.
    const keys = (e: KeyboardEvent) => {
      if (!this.root.contains(e.target as Node)) {
        // The palette keeps the focus while it is open.
        if (e.type === 'keydown') this.input.focus({ preventScroll: true })
        else return
      }
      e.stopPropagation()
      if (e.type === 'keydown') this.onKeyDown(e)
    }
    window.addEventListener('keydown', keys, { capture: true, signal })
    window.addEventListener('keyup', keys, { capture: true, signal })
    window.addEventListener('blur', () => this.close(), { signal })
  }

  private onKeyDown(e: KeyboardEvent) {
    const count = this.items.length
    // Ctrl / Cmd + K again closes it (and never reaches the browser).
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyK') {
      e.preventDefault()
      this.close()
      return
    }
    switch (e.key) {
      case 'Escape':
        this.close()
        break
      case 'ArrowDown':
        if (count) this.setActive((this.active + 1) % count, true)
        break
      case 'ArrowUp':
        if (count) this.setActive((this.active - 1 + count) % count, true)
        break
      case 'PageDown':
        if (count) this.setActive(Math.min(count - 1, this.active + 8), true)
        break
      case 'PageUp':
        if (count) this.setActive(Math.max(0, this.active - 8), true)
        break
      case 'Enter':
        // Enter that confirms an IME conversion is not a pick.
        if (e.isComposing || e.keyCode === 229) return
        this.pick()
        break
      case 'Tab':
        break
      default:
        return
    }
    e.preventDefault()
  }
}
