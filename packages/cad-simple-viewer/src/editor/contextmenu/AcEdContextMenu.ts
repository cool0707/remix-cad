/**
 * A right-click (context) menu: a floating list of items with optional
 * submenus, drawn with the UI theme variables (`--ml-ui-*`).
 *
 * @module AcEdContextMenu
 * @packageDocumentation
 */

/** One clickable item, or a submenu when it has `children`. */
export interface AcEdContextMenuItem {
  /** Passed to the pick callback */
  id: string
  /** Text */
  label: string
  /** Key shown on the right */
  shortcut?: string
  /** Items of the submenu */
  children?: AcEdContextMenuEntry[]
}

/** A menu entry: an item or a separator line. */
export type AcEdContextMenuEntry = AcEdContextMenuItem | 'separator'

const STYLE_ID = 'ml-context-menu-styles'

/** Above the viewer's own overlays and Element Plus popups (2000+). */
const Z_INDEX = 4000

const MENU_CSS = `
  .ml-context-menu {
    position: fixed;
    z-index: ${Z_INDEX};
    min-width: 200px;
    max-width: 320px;
    padding: 4px;
    box-sizing: border-box;
    border: 1px solid var(--ml-ui-border, #dcdfe6);
    border-radius: 8px;
    background: var(--ml-ui-bg, #ffffff);
    box-shadow: var(--ml-ui-shadow, 0 6px 18px rgba(0, 0, 0, 0.18));
    color: var(--ml-ui-text, #303133);
    font: 13px/1.4 var(--ml-ui-font-family, 'Noto Sans JP', system-ui, sans-serif);
    user-select: none;
    outline: none;
  }
  .ml-context-menu-item {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
    min-height: 28px;
    padding: 4px 10px;
    box-sizing: border-box;
    border: 0;
    border-radius: 5px;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: start;
    cursor: pointer;
  }
  .ml-context-menu-item:focus {
    outline: none;
  }
  .ml-context-menu-item.is-active {
    background: var(--ml-ui-accent-soft, color-mix(in srgb, var(--ml-brand, #af61da) 16%, transparent));
  }
  .ml-context-menu-label {
    flex: 1 1 auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ml-context-menu-shortcut {
    flex: 0 0 auto;
    color: var(--ml-ui-text-muted, #909399);
    font-size: 12px;
  }
  .ml-context-menu-arrow {
    flex: 0 0 auto;
    color: var(--ml-ui-text-muted, #909399);
  }
  [dir='rtl'] .ml-context-menu-arrow,
  .ml-context-menu[dir='rtl'] .ml-context-menu-arrow {
    transform: scaleX(-1);
  }
  .ml-context-menu-separator {
    height: 1px;
    margin: 4px 6px;
    background: var(--ml-ui-border, #dcdfe6);
  }
`

function ensureStyles(): void {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = MENU_CSS
  document.head.appendChild(style)
}

/** One open list: the menu or one of its submenus. */
interface AcEdMenuLevel {
  element: HTMLDivElement
  buttons: HTMLButtonElement[]
  items: AcEdContextMenuItem[]
  active: number
}

/**
 * A context menu shown at a point of the window. Only one is open at a time;
 * it closes when an item is picked, on Esc, on a press outside it, when the
 * window loses focus or is resized, and on wheel scrolling.
 */
export class AcEdContextMenu {
  private static _current: AcEdContextMenu | null = null

  /** The open menu, if any. */
  static get current() {
    return AcEdContextMenu._current
  }

  /** Closes the open menu, if any. */
  static closeAll() {
    AcEdContextMenu._current?.close()
  }

  private readonly levels: AcEdMenuLevel[] = []
  private readonly abort = new AbortController()
  private closed = false
  private openTimer?: ReturnType<typeof setTimeout>
  /** Focused before the menu opened; gets the focus back when it closes. */
  private readonly previousFocus: Element | null

  /**
   * Opens a menu (closing the one already open).
   *
   * @param entries - Items to show.
   * @param x - Window X of the click.
   * @param y - Window Y of the click.
   * @param onPick - Called with the picked item's id, after the menu closed.
   * @param onClose - Called whenever the menu closes (also after a pick).
   */
  constructor(
    entries: AcEdContextMenuEntry[],
    x: number,
    y: number,
    private readonly onPick: (id: string) => void,
    private readonly onClose?: () => void
  ) {
    AcEdContextMenu.closeAll()
    AcEdContextMenu._current = this
    this.previousFocus = document.activeElement
    ensureStyles()
    const level = this.createLevel(entries)
    this.levels.push(level)
    this.place(level.element, { left: x, right: x, top: y })
    level.element.focus({ preventScroll: true })
    this.bindGlobalEvents()
  }

  /** Root element of the menu (for tests and styling). */
  get element(): HTMLElement {
    return this.levels[0]!.element
  }

  /** Whether the menu is still open. */
  get isOpen() {
    return !this.closed
  }

  /** Closes the menu without picking anything. */
  close() {
    if (this.closed) return
    this.closed = true
    clearTimeout(this.openTimer)
    this.abort.abort()
    const active = document.activeElement
    const hadFocus = this.levels.some(level => level.element.contains(active))
    for (const level of this.levels) level.element.remove()
    // Keys (Esc, shortcuts) go where they went before the menu opened, not to
    // <body>; a click outside that focused something else keeps its focus.
    const previous = this.previousFocus
    if (
      (hadFocus || document.activeElement === document.body) &&
      previous instanceof HTMLElement &&
      previous.isConnected
    ) {
      previous.focus({ preventScroll: true })
    }
    this.levels.length = 0
    if (AcEdContextMenu._current === this) AcEdContextMenu._current = null
    this.onClose?.()
  }

  private createLevel(entries: AcEdContextMenuEntry[]): AcEdMenuLevel {
    const element = document.createElement('div')
    element.className = 'ml-context-menu'
    element.setAttribute('role', 'menu')
    element.tabIndex = -1
    const dir = document.documentElement.dir
    if (dir) element.dir = dir
    const level: AcEdMenuLevel = { element, buttons: [], items: [], active: -1 }

    for (const entry of entries) {
      if (entry === 'separator') {
        const line = document.createElement('div')
        line.className = 'ml-context-menu-separator'
        line.setAttribute('role', 'separator')
        element.appendChild(line)
        continue
      }
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'ml-context-menu-item'
      button.setAttribute('role', 'menuitem')
      button.dataset.id = entry.id
      button.tabIndex = -1
      const label = document.createElement('span')
      label.className = 'ml-context-menu-label'
      label.textContent = entry.label
      button.appendChild(label)
      if (entry.children) {
        button.setAttribute('aria-haspopup', 'menu')
        const arrow = document.createElement('span')
        arrow.className = 'ml-context-menu-arrow'
        arrow.textContent = '›'
        button.appendChild(arrow)
      } else if (entry.shortcut) {
        const shortcut = document.createElement('span')
        shortcut.className = 'ml-context-menu-shortcut'
        shortcut.textContent = entry.shortcut
        button.appendChild(shortcut)
      }
      const index = level.items.length
      button.addEventListener('mouseenter', () => {
        this.setActive(level, index)
        clearTimeout(this.openTimer)
        if (entry.children) {
          this.openTimer = setTimeout(() => this.openSubmenu(level), 120)
        } else {
          this.closeSubmenusAfter(level)
        }
      })
      button.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()
        this.setActive(level, index)
        this.activate(level)
      })
      level.buttons.push(button)
      level.items.push(entry)
      element.appendChild(button)
    }
    // Clicks between items (separators, padding) stay in the menu.
    element.addEventListener('contextmenu', e => e.preventDefault())
    document.body.appendChild(element)
    return level
  }

  /**
   * Puts a list next to an anchor and keeps it inside the window: below /
   * after the anchor point, flipped when it would not fit.
   */
  private place(
    element: HTMLElement,
    anchor: { left: number; right: number; top: number }
  ) {
    const rtl = element.dir === 'rtl'
    const width = element.offsetWidth
    const height = element.offsetHeight
    const vw = window.innerWidth
    const vh = window.innerHeight
    let left = rtl ? anchor.left - width : anchor.right
    if (left + width > vw - 4) left = anchor.left - width
    if (left < 4) left = Math.min(anchor.right, vw - width - 4)
    let top = anchor.top
    if (top + height > vh - 4) top = Math.max(4, vh - height - 4)
    element.style.left = `${Math.max(4, left)}px`
    element.style.top = `${top}px`
  }

  private setActive(level: AcEdMenuLevel, index: number) {
    level.buttons[level.active]?.classList.remove('is-active')
    level.active = index
    const button = level.buttons[index]
    if (button) {
      button.classList.add('is-active')
      button.focus({ preventScroll: true })
    }
  }

  /** Picks the active item, or opens its submenu. */
  private activate(level: AcEdMenuLevel) {
    const item = level.items[level.active]
    if (!item) return
    if (item.children) {
      clearTimeout(this.openTimer)
      this.openSubmenu(level, true)
      return
    }
    this.close()
    this.onPick(item.id)
  }

  private openSubmenu(level: AcEdMenuLevel, focusFirst = false) {
    const item = level.items[level.active]
    const button = level.buttons[level.active]
    if (!item?.children || !button || this.closed) return
    this.closeSubmenusAfter(level)
    const sub = this.createLevel(item.children)
    this.levels.push(sub)
    const rect = button.getBoundingClientRect()
    const box = level.element.getBoundingClientRect()
    this.place(sub.element, {
      left: box.left + 2,
      right: box.right - 2,
      top: rect.top - 5
    })
    if (focusFirst) this.setActive(sub, 0)
  }

  private closeSubmenusAfter(level: AcEdMenuLevel) {
    const index = this.levels.indexOf(level)
    if (index < 0) return
    for (const sub of this.levels.splice(index + 1)) sub.element.remove()
  }

  private bindGlobalEvents() {
    const signal = this.abort.signal
    document.addEventListener(
      'pointerdown',
      e => {
        const target = e.target as Node | null
        if (this.levels.some(level => level.element.contains(target))) return
        this.close()
      },
      { capture: true, signal }
    )
    document.addEventListener('keydown', e => this.onKeyDown(e), {
      capture: true,
      signal
    })
    window.addEventListener('blur', () => this.close(), { signal })
    window.addEventListener('resize', () => this.close(), { signal })
    document.addEventListener('wheel', () => this.close(), {
      capture: true,
      passive: true,
      signal
    })
  }

  private onKeyDown(e: KeyboardEvent) {
    const level = this.levels[this.levels.length - 1]
    if (!level) return
    const rtl = level.element.dir === 'rtl'
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight'
    const back = rtl ? 'ArrowRight' : 'ArrowLeft'
    const count = level.items.length
    switch (e.key) {
      case 'Escape':
        if (this.levels.length > 1) {
          this.closeSubmenusAfter(this.levels[this.levels.length - 2]!)
          const parent = this.levels[this.levels.length - 1]!
          this.setActive(parent, parent.active)
        } else {
          this.close()
        }
        break
      case 'ArrowDown':
        if (count) this.setActive(level, (level.active + 1) % count)
        break
      case 'ArrowUp':
        if (count) this.setActive(level, (level.active - 1 + count) % count)
        break
      case 'Home':
        if (count) this.setActive(level, 0)
        break
      case 'End':
        if (count) this.setActive(level, count - 1)
        break
      case 'Enter':
      case ' ':
        this.activate(level)
        break
      case forward:
        if (level.items[level.active]?.children) this.openSubmenu(level, true)
        break
      case back:
        if (this.levels.length > 1) {
          this.closeSubmenusAfter(this.levels[this.levels.length - 2]!)
          const parent = this.levels[this.levels.length - 1]!
          this.setActive(parent, parent.active)
        }
        break
      case 'Tab':
        this.close()
        return
      default:
        // Other keys (shortcuts) stay with the page; the menu goes away.
        if (e.key.length === 1 || e.ctrlKey || e.metaKey) this.close()
        return
    }
    e.preventDefault()
    e.stopPropagation()
  }
}
