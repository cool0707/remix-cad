/**
 * Plain-DOM floating toolbar with sub-toolbars, dropdown menus, and toggles.
 *
 * Document open / open-mode state is injected via {@link AcUiToolbar.setDocState}
 * or {@link acapBindToolbarDocState} — this module never imports DocManager.
 *
 * @module AcUiToolbar
 * @packageDocumentation
 */

import { AcEdOpenMode } from '../../editor/view/AcEdOpenMode'
import {
  createIconElement,
  ICON_CHEVRON_DOWN,
  ICON_CHEVRON_LEFT,
  ICON_CHEVRON_RIGHT,
  ICON_CHEVRON_UP,
  ICON_DRAG_HANDLE,
  ICON_MORE,
  ICON_PLACEMENT_LEFT,
  ICON_PLACEMENT_TOP
} from '../icons'
import { AcUiDropdownMenu } from './AcUiDropdownMenu'
import { AcUiSubToolbar } from './AcUiSubToolbar'
import { acuiEnsureToolbarStyles } from './AcUiToolbarStyles'
import { acuiResolveToolbarChrome } from './resolveToolbarChrome'
import {
  acuiFilterVisibleToolbarItems,
  acuiIsToolbarItemDisabled,
  acuiItemRequiresDocument,
  acuiResolveEffectiveToolbarItem,
  acuiResolveParentToolbarDisplay
} from './resolveToolbarItemState'
import {
  acuiIsDynamicToolbarChildren,
  acuiIsToolbarChildrenStrip,
  acuiIsToolbarSeparatorItem,
  acuiResolveToolbarChildrenUi
} from './toolbarItemUtils'
import type {
  AcUiSubToolbarOptions,
  AcUiToolbarDocState,
  AcUiToolbarFloatingLayout,
  AcUiToolbarI18n,
  AcUiToolbarItem,
  AcUiToolbarOrientation,
  AcUiToolbarOverflow,
  AcUiToolbarPlacement,
  AcUiToolbarSize
} from './types'

/** Constructor / runtime mount options for {@link AcUiToolbar}. */
export interface AcUiToolbarMountOptions {
  /** Viewer canvas element that receives the toolbar root node. */
  host: HTMLElement
  /** Theme host for dropdown menus; defaults to {@link host}. */
  themeHost?: HTMLElement
  /** Edge placement of the toolbar. */
  placement: AcUiToolbarPlacement
  /** Toolbar item definitions to render. */
  items: AcUiToolbarItem[]
  /** i18n helper for button labels and tooltips. */
  i18n: AcUiToolbarI18n
  /** Invoked when a leaf item with a `command` is activated. */
  onCommand: (command: string) => void
  /** When true, append a collapse/expand toggle at the end of the toolbar. */
  collapsible?: boolean
  /** Initial collapsed state when {@link collapsible} is true. */
  defaultCollapsed?: boolean
  /** Invoked when the toolbar is collapsed (e.g. close the dock panel). */
  onCollapse?: () => void
  /** Distance from the canvas edge in px. @default 8 */
  edgeOffset?: number
  /**
   * Minimum inset from host edges orthogonal to {@link edgeOffset} in px.
   * @default 0
   */
  sideOffset?: number
  /** When true, render button labels below icons (phone bottom bar). */
  showLabels?: boolean
  /** Sizing along the layout axis: `auto` or `stretch` to fill host width/height. */
  size?: AcUiToolbarSize
  /**
   * Overflow behavior when buttons exceed the host bounds.
   * @default 'menu'
   */
  overflow?: AcUiToolbarOverflow
  /** When false, hides the toolbar container border line. @default true */
  showBorder?: boolean
  /**
   * When true, each button draws a permanent outer border.
   * @default false
   */
  showButtonBorder?: boolean
  /** When false, omits visual separators between toolbar groups. @default true */
  showSeparators?: boolean
  /**
   * When true, parent buttons with children show a corner triangle.
   * @default true
   */
  showChildrenIndicator?: boolean
  /** Sub-toolbar chrome and position overrides; unset chrome inherits from this toolbar. */
  subToolbar?: AcUiSubToolbarOptions
  /**
   * When true, sit as a flex sibling of the canvas inside the mount host instead
   * of floating over the drawing. @default false
   */
  inCanvasParent?: boolean
  /**
   * Positioning host for sub-toolbars / strips. Defaults to {@link host}.
   * Use a larger ancestor (for example the viewer root) when the mount host is
   * only as tall as a phone bottom bar so strips can sit above the main bar.
   */
  overlayHost?: HTMLElement
  /**
   * Called when a sub-toolbar or menu opens and
   * {@link AcUiSubToolbarOptions.replaceOnNested} is true, so callers can hide
   * mutually exclusive chrome such as the dock panel.
   */
  onExclusiveOpen?: () => void
  /**
   * Optional initial document state. Prefer {@link AcUiToolbar.setDocState} or
   * {@link acapBindToolbarDocState} after construction.
   */
  docState?: Partial<AcUiToolbarDocState>
  /**
   * When true, prepend a drag grip so users can move the toolbar anywhere
   * inside the host, with a ⋯ menu to switch it between vertical and
   * horizontal or put it back. While floating, the edge used for sub-toolbars follows the side
   * of the host centre the bar sits on (vertical: left/right, horizontal:
   * top/bottom). Double-clicking the grip docks it back at {@link placement}.
   * Ignored with {@link inCanvasParent} or `size: 'stretch'`. @default false
   */
  movable?: boolean
  /** Initial user layout for a {@link movable} toolbar; omit to start docked. */
  floatingLayout?: AcUiToolbarFloatingLayout
  /**
   * Called after the user drags the toolbar, switches its orientation, or
   * docks it back (`undefined`), e.g. to persist the layout.
   */
  onFloatingLayoutChange?: (layout: AcUiToolbarFloatingLayout | undefined) => void
}

export class AcUiToolbar {
  /** Canvas element receiving the toolbar root node. */
  private mountHost: HTMLElement
  /** Host element used for themed dropdown menus. */
  private themeHost: HTMLElement
  /** Root toolbar container appended to the mount host. */
  private root: HTMLDivElement
  /** Currently open popover submenu, if any. */
  private openDropdown?: AcUiDropdownMenu
  /** Currently open icon sub-toolbar, if any. */
  private openSubToolbar?: AcUiSubToolbar
  /** Nested sub-toolbar opened from a strip item (e.g. locale under settings). */
  private openNestedSubToolbar?: AcUiSubToolbar
  /** Parent item id of the open children UI. */
  private openParentId?: string
  /** Sticky sub-toolbar parent id restored after a full re-render. */
  private stickyParentId?: string
  /** Parent button currently marked as expanded. */
  private openParentButton?: HTMLElement
  /** Whether the toolbar is globally disabled during document open. */
  private isDisabled = false
  /** Current document open mode used for item visibility. */
  private openMode = AcEdOpenMode.Read
  /** Whether an active document is loaded. */
  private hasDocument = false
  /** Item list last passed to {@link updateItems} or the constructor. */
  private items: AcUiToolbarItem[]
  /** Runtime submenu selection for parents with {@link AcUiToolbarItem.childIcon} `'selected'`. */
  private selectedChildByParent = new Map<string, string>()
  /** Tells whether an item's command is the one in use; see {@link setActiveCommand}. */
  private activeCommandMatcher?: (command: string) => boolean
  /** Last item whose command the user started from this toolbar. */
  private lastCommandItemId?: string
  /** Items drawn as the tool in use (leaf plus the parents it sits under). */
  private activeItemIds = new Set<string>()
  /** Whether the toolbar is collapsed to show only the toggle button. */
  private collapsed: boolean
  /** Whether the toolbar root is shown. */
  private visible = true
  /** Inset from the canvas edge in px. */
  private edgeOffset: number
  /** Cross-axis inset from host edges orthogonal to placement. */
  private sideOffset: number
  /** Whether the toolbar container border is shown. */
  private showBorder: boolean
  /** Whether each toolbar button draws a permanent outer border. */
  private showButtonBorder: boolean
  /** Whether separator dividers are rendered between toolbar groups. */
  private showSeparators: boolean
  /** Whether parent buttons with children show a corner triangle. */
  private showChildrenIndicator: boolean
  /**
   * When true, the toolbar is a flex sibling of the canvas rather than an overlay.
   */
  private inCanvasParent: boolean
  /** Canvas-slot wrapper used when {@link inCanvasParent} is enabled. */
  private toolbarMain?: HTMLDivElement
  /** Flex host that currently owns the in-canvas-parent layout classes. */
  private inParentHost?: HTMLElement
  /** Keeps the toolbar inside the canvas when the host is resized. */
  private resizeObserver?: ResizeObserver
  private layoutFrame?: number
  /** Overflow ⋯ button (menu overflow mode). */
  private readonly overflowButton: HTMLButtonElement
  /** Dropdown listing items that did not fit in the toolbar. */
  private overflowDropdown?: AcUiDropdownMenu
  /** ⋯ menu beside the grip (orientation / reset position). */
  private layoutMenu?: AcUiDropdownMenu
  /** Items currently hidden behind the overflow menu. */
  private overflowItems: AcUiToolbarItem[] = []
  /** Whether menu overflow is showing the ⋯ button (used for vertical positioning). */
  private overflowMenuActive = false
  /** Placement restored when a floating toolbar is docked back. */
  private dockedPlacement: AcUiToolbarPlacement
  /** User layout while a {@link AcUiToolbarMountOptions.movable} toolbar floats. */
  private floating?: AcUiToolbarFloatingLayout
  /** Active grip drag: pointer id and toolbar / pointer start positions. */
  private drag?: {
    pointerId: number
    startX: number
    startY: number
    startLeft: number
    startTop: number
  }
  private readonly handleDragMove = (event: PointerEvent) => {
    const drag = this.drag
    if (!drag || event.pointerId !== drag.pointerId) return
    this.moveFloatingTo(
      drag.startLeft + event.clientX - drag.startX,
      drag.startTop + event.clientY - drag.startY
    )
  }
  private readonly handleDragEnd = (event: PointerEvent) => {
    if (!this.drag || event.pointerId !== this.drag.pointerId) return
    this.stopDrag()
    this.emitFloatingLayout()
  }
  /** Toolbar item nodes rendered in the last {@link renderButtons} pass. */
  private renderedEntries: Array<{
    item: AcUiToolbarItem
    element: HTMLElement
    isSeparator: boolean
  }> = []

  /**
   * @param options - Host, placement, items, i18n, and command callback.
   */
  constructor(private options: AcUiToolbarMountOptions) {
    acuiEnsureToolbarStyles()
    this.mountHost = options.host
    this.themeHost = options.themeHost ?? options.host
    this.edgeOffset = options.edgeOffset ?? 8
    this.sideOffset = options.sideOffset ?? 0
    this.showBorder = options.showBorder ?? true
    this.showButtonBorder = options.showButtonBorder ?? false
    this.showSeparators = options.showSeparators ?? true
    this.showChildrenIndicator = options.showChildrenIndicator ?? true
    this.inCanvasParent = options.inCanvasParent === true
    this.items = options.items
    this.dockedPlacement = options.placement
    if (options.movable && options.floatingLayout) {
      this.floating = { ...options.floatingLayout }
      this.options.placement = this.resolveFloatingPlacement()
    }
    this.collapsed =
      Boolean(options.collapsible) && Boolean(options.defaultCollapsed)
    if (options.overflow === undefined) {
      options.overflow = 'menu'
    }
    this.seedSelectedChildren(options.items)
    this.ensureMountHostLayout()

    this.root = document.createElement('div')
    this.syncRootClasses()
    this.root.setAttribute('role', 'toolbar')

    this.overflowButton = document.createElement('button')
    this.overflowButton.type = 'button'
    this.overflowButton.className =
      'ml-ex-ui-toolbar-btn ml-ex-ui-toolbar-overflow-btn'
    this.overflowButton.dataset.toolbarItemId = 'toolbar-overflow'
    this.overflowButton.hidden = true
    this.overflowButton.appendChild(createIconElement(ICON_MORE))
    this.overflowButton.addEventListener('click', event => {
      event.stopPropagation()
      if (this.overflowButton.hidden) return
      this.toggleOverflowMenu()
    })

    this.mountHost.appendChild(this.root)
    this.ensureInParentLayout()
    this.setupResizeObserver()

    if (options.docState) {
      this.setDocState(options.docState)
    } else {
      this.renderButtons()
    }
  }

  /**
   * Updates document-related enablement and open-mode filtering.
   *
   * Hosts with DocManager should use {@link acapBindToolbarDocState}. Offline
   * HTML / custom hosts call this directly.
   *
   * @param state - Partial document state to merge.
   */
  setDocState(state: Partial<AcUiToolbarDocState>): void {
    if (state.hasDocument !== undefined) {
      this.hasDocument = state.hasDocument
    }
    if (state.isOpening !== undefined) {
      this.isDisabled = state.isOpening
      if (state.isOpening) {
        this.closeChildrenUi()
      }
    }
    if (state.openMode !== undefined) {
      this.openMode = state.openMode
    }
    this.syncRootClasses()
    this.renderButtons()
  }

  /**
   * Replaces the toolbar item list and re-renders buttons.
   *
   * @param items - New toolbar items.
   */
  updateItems(items: AcUiToolbarItem[]) {
    this.items = items
    this.seedSelectedChildren(items)
    this.syncActiveItems()
    this.renderButtons()
  }

  /**
   * Applies layout-driven view options (placement, chrome flags, items).
   *
   * Used by {@link AcApSimpleUiPlugin} when switching phone / pad / desktop
   * layouts without recreating the toolbar instance.
   *
   * @param view - Partial toolbar view state to merge.
   */
  applyViewOptions(
    view: Partial<
      Pick<
        AcUiToolbarMountOptions,
        | 'placement'
        | 'edgeOffset'
        | 'sideOffset'
        | 'collapsible'
        | 'defaultCollapsed'
        | 'showLabels'
        | 'size'
        | 'overflow'
        | 'showBorder'
        | 'showButtonBorder'
        | 'showSeparators'
        | 'showChildrenIndicator'
        | 'subToolbar'
        | 'items'
        | 'inCanvasParent'
      >
    >
  ) {
    if (view.placement !== undefined) {
      this.dockedPlacement = view.placement
      this.floating = undefined
      this.options.placement = view.placement
    }
    if (view.edgeOffset !== undefined) {
      this.edgeOffset = Math.max(0, view.edgeOffset)
    }
    if (view.sideOffset !== undefined) {
      this.sideOffset = Math.max(0, view.sideOffset)
    }
    if (view.collapsible !== undefined) {
      this.options.collapsible = view.collapsible
      if (!view.collapsible) {
        this.collapsed = false
      }
    }
    if (view.defaultCollapsed !== undefined) {
      this.collapsed =
        Boolean(this.options.collapsible) && Boolean(view.defaultCollapsed)
    }
    if (view.showLabels !== undefined) {
      this.options.showLabels = view.showLabels
    }
    if (view.size !== undefined) {
      this.options.size = view.size
    }
    if (view.overflow !== undefined) {
      this.options.overflow = view.overflow
    }
    if (view.showBorder !== undefined) {
      this.showBorder = view.showBorder
    }
    if (view.showButtonBorder !== undefined) {
      this.showButtonBorder = view.showButtonBorder
    }
    if (view.showSeparators !== undefined) {
      this.showSeparators = view.showSeparators
    }
    if (view.showChildrenIndicator !== undefined) {
      this.showChildrenIndicator = view.showChildrenIndicator
      this.options.showChildrenIndicator = view.showChildrenIndicator
    }
    if (view.subToolbar !== undefined) {
      this.options.subToolbar = view.subToolbar
    }
    if (view.inCanvasParent !== undefined) {
      this.inCanvasParent = view.inCanvasParent
      this.options.inCanvasParent = view.inCanvasParent
    }
    if (view.items !== undefined) {
      this.items = view.items
      this.seedSelectedChildren(view.items)
    }
    this.syncRootClasses()
    this.ensureInParentLayout()
    this.renderButtons()
    this.scheduleSyncPosition()
  }

  /** Re-renders buttons (e.g. after locale or theme change). */
  refresh() {
    this.renderButtons()
  }

  /** Updates button labels and tooltips after locale change. */
  refreshLocale() {
    this.syncOverflowButtonLabels()
    this.syncMoveControlLabels()
    this.syncCollapseToggleButton()
    for (const { item, element, isSeparator } of this.renderedEntries) {
      if (isSeparator) continue
      const button = element as HTMLButtonElement
      const effective = acuiResolveParentToolbarDisplay(
        item,
        this.selectedChildByParent.get(item.id)
      )
      const label = effective.label
        ? this.options.i18n.t(effective.label)
        : effective.id
      button.title = label
      button.setAttribute('aria-label', label)
      const labelEl = button.querySelector(
        '.ml-ex-ui-toolbar-btn-label, .ml-ex-ui-toolbar-btn-text'
      )
      if (labelEl) {
        labelEl.textContent = label
      }
    }
    this.openSubToolbar?.refreshLocale()
    this.openNestedSubToolbar?.refreshLocale()
  }

  /**
   * Whether nested strips and dock panels replace an open ancestor strip.
   *
   * @see {@link AcUiSubToolbarOptions.replaceOnNested}
   */
  get replaceOnNested() {
    return this.resolveSubToolbarChrome().replaceOnNested === true
  }

  /** Closes any open dropdown or sub-toolbar. */
  dismissOpenChildren() {
    this.closeChildrenUi()
  }

  /** Notifies the host to hide mutually exclusive chrome (e.g. dock panels). */
  private notifyExclusiveOpen() {
    if (this.replaceOnNested) {
      this.options.onExclusiveOpen?.()
    }
  }

  /**
   * Moves the toolbar to another host edge and updates orientation classes.
   *
   * @param placement - Target edge placement.
   */
  setPlacement(placement: AcUiToolbarPlacement) {
    this.dockedPlacement = placement
    this.floating = undefined
    if (this.options.placement === placement) return
    this.options.placement = placement
    this.selectedChildByParent.set(
      'toolbar-placement',
      `placement-${placement}`
    )
    this.syncRootClasses()
    this.ensureInParentLayout()
    this.renderButtons()
  }

  /** Current user layout of a movable toolbar, or `undefined` when docked. */
  getFloatingLayout(): AcUiToolbarFloatingLayout | undefined {
    return this.floating ? { ...this.floating } : undefined
  }

  /**
   * Floats a movable toolbar at `layout`, or docks it back at its original
   * placement when `layout` is `undefined`. Does not fire
   * {@link AcUiToolbarMountOptions.onFloatingLayoutChange}.
   *
   * @param layout - Target layout.
   */
  setFloatingLayout(layout: AcUiToolbarFloatingLayout | undefined) {
    this.floating = layout ? { ...layout } : undefined
    this.options.placement = this.floating
      ? this.resolveFloatingPlacement()
      : this.dockedPlacement
    this.syncRootClasses()
    this.renderButtons()
  }

  /** Current inset from the canvas edge in px. */
  getEdgeOffset() {
    return this.edgeOffset
  }

  /**
   * Sets the inset from the canvas edge and reclamps toolbar position.
   *
   * @param offset - Distance in px (clamped to >= 0).
   */
  setEdgeOffset(offset: number) {
    this.edgeOffset = Math.max(0, offset)
    this.scheduleSyncPosition()
  }

  /** Current cross-axis inset from host edges in px. */
  getSideOffset() {
    return this.sideOffset
  }

  /**
   * Sets the cross-axis inset from host edges and reclamps toolbar position.
   *
   * @param offset - Distance in px (clamped to >= 0).
   */
  setSideOffset(offset: number) {
    this.sideOffset = Math.max(0, offset)
    this.scheduleSyncPosition()
  }

  /** Resolved chrome options for sub-toolbars. */
  resolveSubToolbarChrome() {
    return acuiResolveToolbarChrome(
      {
        edgeOffset: this.edgeOffset,
        sideOffset: this.sideOffset,
        showLabels: this.options.showLabels,
        size: this.options.size,
        overflow: this.options.overflow,
        showBorder: this.showBorder,
        showButtonBorder: this.showButtonBorder,
        showSeparators: this.showSeparators,
        showChildrenIndicator: this.showChildrenIndicator
      },
      this.options.subToolbar
    )
  }

  /**
   * Cross-axis host margins for wrap sizing and sub-toolbar clamping.
   *
   * Horizontal toolbars use {@link sideOffset} on the top/bottom edges; vertical
   * toolbars use it on the left/right edges. The dock edge keeps
   * {@link edgeOffset}.
   */
  getCrossAxisInset(): { near: number; far: number } {
    const horizontal = this.getOrientationClass() === 'horizontal'
    if (horizontal) {
      return this.options.placement === 'top'
        ? { near: this.edgeOffset, far: this.sideOffset }
        : { near: this.sideOffset, far: this.edgeOffset }
    }
    return this.options.placement === 'left'
      ? { near: this.sideOffset, far: this.edgeOffset }
      : { near: this.edgeOffset, far: this.sideOffset }
  }

  /**
   * Moves the toolbar to another canvas mount element.
   *
   * @param newHost - New canvas container.
   */
  reparentTo(newHost: HTMLElement) {
    if (this.mountHost === newHost) {
      if (!this.root.isConnected && newHost.isConnected) {
        newHost.appendChild(this.root)
      }
      this.syncInParentLayout()
      return
    }

    this.resizeObserver?.disconnect()
    this.releaseInParentLayout({ keepRoot: true })
    this.root.remove()
    this.mountHost = newHost
    this.ensureMountHostLayout()
    this.mountHost.appendChild(this.root)
    this.ensureInParentLayout()
    this.setupResizeObserver()
    this.scheduleSyncPosition()
  }

  /**
   * Re-applies in-canvas-parent flex layout after the dock panel wraps or
   * reparents the canvas slot.
   */
  syncInParentLayout() {
    this.ensureInParentLayout()
    this.setupResizeObserver()
    this.scheduleSyncPosition()
  }

  /**
   * Highlights the tool in use, the way paint programs fill the current tool.
   *
   * The leaf whose command matches is filled with the brand colour, and so
   * are the parents it sits under (a closed flyout still shows its tool).
   * When several items share a command (`zoom\nall` / `zoom\nwindow`), the
   * one last clicked here wins, then the item with the bare command name;
   * failing both, only their parent group is lit.
   * Hosts with DocManager should use {@link acapBindToolbarDocState}.
   *
   * @param matcher - Whether an item's `command` string is the one in use;
   *   `undefined` clears the highlight.
   */
  setActiveCommand(matcher?: (command: string) => boolean) {
    this.activeCommandMatcher = matcher
    this.syncActiveItems()
  }

  /** Recomputes {@link activeItemIds} and applies it to the shown buttons. */
  private syncActiveItems() {
    const matcher = this.activeCommandMatcher
    const matches: Array<{ item: AcUiToolbarItem; parents: string[] }> = []
    const visit = (items: AcUiToolbarItem[], parents: string[]) => {
      for (const item of items) {
        if (acuiIsToolbarSeparatorItem(item)) continue
        const effective = acuiResolveEffectiveToolbarItem(item)
        if (effective.command && matcher?.(effective.command)) {
          matches.push({ item: effective, parents })
        }
        // A live children getter may build items on each read; skip it.
        if (!acuiIsDynamicToolbarChildren(item) && item.children?.length) {
          visit(item.children, [...parents, item.id])
        }
      }
    }
    if (matcher) visit(this.items, [])

    const clicked = matches.filter(m => m.item.id === this.lastCommandItemId)
    const bare = matches.filter(m => !m.item.command?.includes('\n'))
    const chosen = clicked.length ? clicked : bare
    const ids = new Set<string>()
    for (const { item, parents } of chosen.length ? chosen : matches) {
      if (chosen.length) ids.add(item.id)
      parents.forEach(id => ids.add(id))
    }
    this.activeItemIds = ids

    for (const entry of this.renderedEntries) {
      if (entry.isSeparator) continue
      entry.element.classList.toggle('is-active', ids.has(entry.item.id))
    }
    this.openSubToolbar?.syncActive()
    this.openNestedSubToolbar?.syncActive()
  }

  /**
   * Sets the active submenu child for a parent button.
   *
   * @param parentId - Parent toolbar item id.
   * @param childId - Selected child item id.
   */
  setSelectedChild(parentId: string, childId: string) {
    this.selectedChildByParent.set(parentId, childId)
  }

  /** Current toolbar edge placement. */
  get placement() {
    return this.options.placement
  }

  /** Whether the toolbar is collapsed to the toggle button only. */
  get isCollapsed() {
    return this.collapsed
  }

  /** Whether the toolbar root is visible. */
  get isVisible() {
    return this.visible
  }

  /** Whether the toolbar root node is still attached to the document. */
  isRootConnected(): boolean {
    return this.root.isConnected
  }

  /**
   * Shows or hides the entire toolbar.
   *
   * @param visible - Target visibility.
   */
  setVisible(visible: boolean) {
    if (this.visible === visible) return
    this.visible = visible
    this.root.hidden = !visible
    if (!visible) {
      this.closeChildrenUi()
      this.options.onCollapse?.()
    }
  }

  /**
   * Returns the layer toolbar button, expanding a collapsed toolbar first.
   */
  getLayerButtonAnchor(): HTMLElement | undefined {
    if (this.options.collapsible && this.collapsed) {
      this.setCollapsed(false)
    }
    return (
      this.root.querySelector<HTMLElement>('[data-toolbar-item-id="layer"]') ??
      undefined
    )
  }

  /**
   * Sets collapsed state without toggling.
   *
   * @param collapsed - Target collapsed state.
   */
  setCollapsed(collapsed: boolean) {
    if (!this.options.collapsible || this.collapsed === collapsed) return
    this.collapsed = collapsed
    if (collapsed) {
      this.closeChildrenUi()
      this.options.onCollapse?.()
    }
    this.syncRootClasses()
    this.syncCollapseToggleButton()
    this.scheduleSyncPosition()
  }

  /** Closes dropdowns and detaches the toolbar DOM. */
  destroy() {
    if (this.layoutFrame !== undefined) {
      cancelAnimationFrame(this.layoutFrame)
      this.layoutFrame = undefined
    }
    this.resizeObserver?.disconnect()
    this.resizeObserver = undefined
    this.stopDrag()
    this.closeChildrenUi()
    this.releaseInParentLayout({ keepRoot: false })
    this.root.remove()
  }

  /** Whether the toolbar stretches along its layout axis. */
  private isStretchSize(): boolean {
    return this.options.size === 'stretch'
  }

  /**
   * Returns the CSS orientation class suffix for the current placement.
   *
   * @returns `'vertical'` for left/right, `'horizontal'` for top/bottom.
   */
  private getOrientationClass() {
    return this.options.placement === 'left' ||
      this.options.placement === 'right'
      ? 'vertical'
      : 'horizontal'
  }

  /** Applies placement, collapsed, and disabled classes on the root element. */
  private syncRootClasses() {
    const classes = [
      'ml-ex-ui-toolbar',
      `is-${this.getOrientationClass()}`,
      `is-${this.options.placement}`
    ]
    if (this.collapsed) classes.push('is-collapsed')
    if (this.isDisabled) classes.push('is-disabled')
    if (this.options.showLabels) classes.push('has-labels')
    if (this.options.size === 'stretch') classes.push('is-stretch')
    if (this.inCanvasParent) classes.push('is-in-parent')
    if (this.isMovable()) classes.push('is-movable')
    if (this.floating) classes.push('is-floating')
    if (this.drag) classes.push('is-dragging')
    if (this.options.overflow === 'wrap') classes.push('is-overflow-wrap')
    if (this.options.overflow === 'menu') classes.push('is-overflow-menu')
    if (!this.showBorder) classes.push('no-border')
    if (this.showButtonBorder) classes.push('show-button-border')
    if (this.showChildrenIndicator) classes.push('show-children-indicator')
    this.root.className = classes.join(' ')
  }

  /** Appends icon and optional label content to a toolbar button. */
  private populateButtonContent(
    button: HTMLButtonElement,
    effective: AcUiToolbarItem
  ) {
    if (effective.icon) {
      button.appendChild(createIconElement(effective.icon))
    } else if (effective.label && !this.options.showLabels) {
      const text = document.createElement('span')
      text.className = 'ml-ex-ui-toolbar-btn-text'
      text.textContent = this.options.i18n.t(effective.label)
      text.style.fontSize = '11px'
      text.style.padding = '0 4px'
      button.appendChild(text)
    }

    if (this.options.showLabels && effective.label) {
      const label = document.createElement('span')
      label.className = 'ml-ex-ui-toolbar-btn-label'
      label.textContent = this.options.i18n.t(effective.label)
      button.appendChild(label)
    }
  }

  /** Whether the grip / orientation toggle apply to the current layout. */
  private isMovable(): boolean {
    return (
      this.options.movable === true &&
      !this.inCanvasParent &&
      !this.isStretchSize()
    )
  }

  /**
   * Edge used for sub-toolbars while floating: the side of the host centre the
   * bar's centre lies on. Ratio 0.5 maps exactly to the host centre.
   */
  private resolveFloatingPlacement(): AcUiToolbarPlacement {
    const floating = this.floating
    if (!floating) return this.dockedPlacement
    if (floating.orientation === 'vertical') {
      return floating.x < 0.5 ? 'left' : 'right'
    }
    return floating.y < 0.5 ? 'top' : 'bottom'
  }

  /** Converts a left/top in px to a {@link AcUiToolbarFloatingLayout} ratio. */
  private toFloatingRatio(position: number, size: number, hostSize: number) {
    const range = hostSize - size - this.edgeOffset * 2
    if (range <= 0) return 0
    return Math.min(1, Math.max(0, (position - this.edgeOffset) / range))
  }

  /** Converts a {@link AcUiToolbarFloatingLayout} ratio to a left/top in px. */
  private fromFloatingRatio(ratio: number, size: number, hostSize: number) {
    const range = Math.max(0, hostSize - size - this.edgeOffset * 2)
    return this.edgeOffset + ratio * range
  }

  /**
   * Moves sub-toolbars to the other side when a floating bar crosses the host
   * centre. Sticky strips are reopened so they keep showing.
   */
  private applyFloatingPlacement() {
    const placement = this.resolveFloatingPlacement()
    if (placement === this.options.placement) return
    this.options.placement = placement
    this.syncRootClasses()
    const stickyId = this.stickyParentId
    this.closeChildrenUi()
    if (stickyId) {
      this.openStickyChildrenByParentId(stickyId)
    }
  }

  /** Floats the toolbar with its top-left corner at host-relative px. */
  private moveFloatingTo(left: number, top: number) {
    if (!this.floating) return
    this.floating.x = this.toFloatingRatio(
      left,
      this.root.offsetWidth,
      this.mountHost.clientWidth
    )
    this.floating.y = this.toFloatingRatio(
      top,
      this.root.offsetHeight,
      this.mountHost.clientHeight
    )
    this.applyFloatingPlacement()
    this.syncPosition()
    this.openSubToolbar?.syncPosition()
    this.openNestedSubToolbar?.syncPosition()
  }

  /** Returns the toolbar box relative to the mount host. */
  private getRootHostRect() {
    const hostRect = this.mountHost.getBoundingClientRect()
    const rect = this.root.getBoundingClientRect()
    return {
      left: rect.left - hostRect.left - this.mountHost.clientLeft,
      top: rect.top - hostRect.top - this.mountHost.clientTop,
      width: rect.width,
      height: rect.height
    }
  }

  private emitFloatingLayout() {
    this.options.onFloatingLayoutChange?.(this.getFloatingLayout())
  }

  /** Starts dragging the toolbar from its grip. */
  private startDrag(event: PointerEvent) {
    if (event.button !== 0 || this.drag) return
    event.preventDefault()
    event.stopPropagation()
    // Dropdowns close on outside mousedown, which preventDefault suppresses.
    if (!this.openSubToolbar?.sticky) {
      this.closeChildrenUi()
    }
    this.closeOverflowMenu()

    const rect = this.getRootHostRect()
    if (!this.floating) {
      this.floating = { orientation: this.getOrientationClass(), x: 0, y: 0 }
    }
    this.drag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startLeft: rect.left,
      startTop: rect.top
    }
    // Listen on window: an item refresh mid-drag may replace the grip node.
    window.addEventListener('pointermove', this.handleDragMove)
    window.addEventListener('pointerup', this.handleDragEnd)
    window.addEventListener('pointercancel', this.handleDragEnd)
    this.syncRootClasses()
    this.moveFloatingTo(rect.left, rect.top)
  }

  private stopDrag() {
    window.removeEventListener('pointermove', this.handleDragMove)
    window.removeEventListener('pointerup', this.handleDragEnd)
    window.removeEventListener('pointercancel', this.handleDragEnd)
    if (!this.drag) return
    this.drag = undefined
    this.syncRootClasses()
  }

  /** Switches between vertical and horizontal, keeping the bar's centre. */
  private setOrientation(orientation: AcUiToolbarOrientation) {
    if (orientation === this.getOrientationClass()) return
    const rect = this.getRootHostRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    this.floating = { orientation, x: 0.5, y: 0.5 }
    this.options.placement = this.resolveFloatingPlacement()
    this.syncRootClasses()
    this.renderButtons()
    // Lay out once in the new orientation so the size is measurable.
    this.syncPosition()
    const width = this.root.offsetWidth
    const height = this.root.offsetHeight
    this.floating.x = this.toFloatingRatio(
      centerX - width / 2,
      width,
      this.mountHost.clientWidth
    )
    this.floating.y = this.toFloatingRatio(
      centerY - height / 2,
      height,
      this.mountHost.clientHeight
    )
    this.applyFloatingPlacement()
    this.syncPosition()
    this.emitFloatingLayout()
  }

  /** Docks a floating toolbar back at its original placement. */
  private dockBack() {
    if (!this.floating) return
    this.setFloatingLayout(undefined)
    this.emitFloatingLayout()
  }

  /**
   * Prepends the handle of a movable toolbar: the drag grip with a ⋯ button at
   * its end that opens the layout menu.
   */
  private appendMoveControls() {
    if (!this.isMovable()) return

    const handle = document.createElement('div')
    handle.className = 'ml-ex-ui-toolbar-handle'

    const grip = document.createElement('div')
    grip.className = 'ml-ex-ui-toolbar-grip'
    grip.dataset.toolbarItemId = 'toolbar-grip'
    grip.appendChild(createIconElement(ICON_DRAG_HANDLE))
    grip.addEventListener('pointerdown', event => this.startDrag(event))
    grip.addEventListener('dblclick', event => {
      event.stopPropagation()
      this.dockBack()
    })
    handle.appendChild(grip)

    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'ml-ex-ui-toolbar-layout-btn'
    button.dataset.toolbarItemId = 'toolbar-layout'
    button.setAttribute('aria-haspopup', 'menu')
    button.appendChild(createIconElement(ICON_MORE))
    button.addEventListener('click', event => {
      event.stopPropagation()
      this.toggleLayoutMenu(button)
    })
    handle.appendChild(button)

    this.root.appendChild(handle)
    this.syncMoveControlLabels()
  }

  /** Opens or closes the ⋯ layout menu (vertical / horizontal / reset). */
  private toggleLayoutMenu(anchor: HTMLElement) {
    if (this.layoutMenu) {
      this.closeLayoutMenu()
      return
    }
    this.closeChildrenUi()
    const vertical = this.getOrientationClass() === 'vertical'
    const items: AcUiToolbarItem[] = [
      {
        id: 'toolbar-layout-vertical',
        label: 'toolbar.vertical',
        icon: ICON_PLACEMENT_LEFT,
        toggle: { getValue: () => vertical, on: {}, off: {} }
      },
      {
        id: 'toolbar-layout-horizontal',
        label: 'toolbar.horizontal',
        icon: ICON_PLACEMENT_TOP,
        toggle: { getValue: () => !vertical, on: {}, off: {} }
      },
      { id: 'toolbar-layout-separator', type: 'separator' },
      { id: 'toolbar-layout-reset', label: 'toolbar.resetPosition' }
    ]
    const menu = new AcUiDropdownMenu(
      this.options.i18n,
      items,
      anchor,
      this.themeHost
    )
    menu.setOnSelect(item => {
      if (item.id === 'toolbar-layout-vertical') {
        this.setOrientation('vertical')
      } else if (item.id === 'toolbar-layout-horizontal') {
        this.setOrientation('horizontal')
      } else if (item.id === 'toolbar-layout-reset') {
        this.dockBack()
      }
    })
    menu.setOnClose(() => {
      if (this.layoutMenu === menu) {
        this.layoutMenu = undefined
        anchor.setAttribute('aria-expanded', 'false')
      }
    })
    anchor.setAttribute('aria-expanded', 'true')
    this.layoutMenu = menu
  }

  private closeLayoutMenu() {
    this.layoutMenu?.close()
    this.layoutMenu = undefined
  }

  /** Updates grip / layout menu tooltips after locale change. */
  private syncMoveControlLabels() {
    const grip = this.root.querySelector<HTMLElement>(
      '[data-toolbar-item-id="toolbar-grip"]'
    )
    if (grip) {
      grip.title = this.options.i18n.t('toolbar.move')
    }
    const button = this.root.querySelector<HTMLButtonElement>(
      '[data-toolbar-item-id="toolbar-layout"]'
    )
    if (button) {
      button.title = this.options.i18n.t('toolbar.layoutMenu')
      button.setAttribute('aria-label', button.title)
    }
  }

  /** Toggles collapsed state when {@link AcUiToolbarMountOptions.collapsible} is enabled. */
  private toggleCollapsed() {
    this.setCollapsed(!this.collapsed)
  }

  /**
   * Chevron for the collapse toggle: vertical placements use up/down;
   * horizontal placements (top/bottom) use left/right.
   */
  private getCollapseToggleIcon() {
    const horizontal =
      this.options.placement === 'top' || this.options.placement === 'bottom'
    if (horizontal) {
      return this.collapsed ? ICON_CHEVRON_RIGHT : ICON_CHEVRON_LEFT
    }
    return this.collapsed ? ICON_CHEVRON_DOWN : ICON_CHEVRON_UP
  }

  /** Updates collapse toggle icon and labels after locale or state changes. */
  private syncCollapseToggleButton(button?: HTMLButtonElement) {
    const target =
      button ??
      this.root.querySelector<HTMLButtonElement>(
        '[data-toolbar-item-id="toolbar-collapse"]'
      )
    if (!target) return

    const labelKey = this.collapsed ? 'toolbar.expand' : 'toolbar.collapse'
    target.replaceChildren(createIconElement(this.getCollapseToggleIcon()))
    target.title = this.options.i18n.t(labelKey)
    target.setAttribute('aria-label', target.title)
    target.setAttribute('aria-expanded', String(!this.collapsed))
  }

  /** Appends separator and collapse toggle when collapsible mode is enabled. */
  private appendCollapseToggle() {
    if (!this.options.collapsible) return

    if (this.showSeparators) {
      const separator = document.createElement('div')
      separator.className = 'ml-ex-ui-toolbar-separator'
      separator.setAttribute('role', 'separator')
      this.root.appendChild(separator)
    }

    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'ml-ex-ui-toolbar-btn ml-ex-ui-toolbar-collapse-btn'
    button.dataset.toolbarItemId = 'toolbar-collapse'
    this.syncCollapseToggleButton(button)
    button.addEventListener('click', event => {
      event.stopPropagation()
      this.toggleCollapsed()
    })
    this.root.appendChild(button)
  }

  /** Rebuilds all toolbar buttons from {@link items}. */
  private renderButtons() {
    const restoreStickyId = this.stickyParentId
    this.closeChildrenUi()
    this.root.replaceChildren()
    this.renderedEntries = []
    this.overflowItems = []
    this.appendMoveControls()

    const visibleItems = acuiFilterVisibleToolbarItems(
      this.items,
      this.openMode
    )
    visibleItems.forEach(item => {
      if (acuiIsToolbarSeparatorItem(item)) {
        if (!this.showSeparators) return
        const separator = document.createElement('div')
        separator.className = 'ml-ex-ui-toolbar-separator'
        separator.setAttribute('role', 'separator')
        if (item.id) {
          separator.dataset.toolbarItemId = item.id
        }
        this.root.appendChild(separator)
        this.renderedEntries.push({
          item,
          element: separator,
          isSeparator: true
        })
        return
      }

      const effective = acuiResolveParentToolbarDisplay(
        item,
        this.selectedChildByParent.get(item.id)
      )
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'ml-ex-ui-toolbar-btn'
      button.title = effective.label
        ? this.options.i18n.t(effective.label)
        : effective.id
      button.setAttribute('aria-label', button.title)
      button.dataset.toolbarItemId = effective.id

      if (effective.children?.length || acuiIsDynamicToolbarChildren(item)) {
        button.classList.add('has-children')
        button.setAttribute('aria-haspopup', 'true')
        button.setAttribute('aria-expanded', 'false')
      }

      this.populateButtonContent(button, effective)

      const disabled =
        (acuiItemRequiresDocument(effective) &&
          (this.isDisabled || !this.hasDocument)) ||
        acuiIsToolbarItemDisabled(effective)
      button.disabled = disabled

      button.addEventListener('click', event => {
        event.stopPropagation()
        if (button.disabled) return
        this.activateToolbarItem(item, button)
      })

      button.classList.toggle('is-active', this.activeItemIds.has(item.id))

      this.root.appendChild(button)
      this.renderedEntries.push({ item, element: button, isSeparator: false })
    })

    if (this.options.overflow === 'menu') {
      this.syncOverflowButtonLabels()
      this.root.appendChild(this.overflowButton)
    }

    this.appendCollapseToggle()
    this.applyOverflowLayout()
    this.scheduleSyncPosition()
    if (restoreStickyId && !this.collapsed && this.visible) {
      this.openStickyChildrenByParentId(restoreStickyId)
    }
  }

  /**
   * Runs a toolbar item action or opens its children UI.
   *
   * @param item - Source toolbar item definition.
   * @param anchor - Button element used as the submenu anchor.
   */
  private activateToolbarItem(item: AcUiToolbarItem, anchor: HTMLButtonElement) {
    const effective = acuiResolveParentToolbarDisplay(
      item,
      this.selectedChildByParent.get(item.id)
    )

    if (effective.children?.length || acuiIsDynamicToolbarChildren(item)) {
      const visibleChildren = this.resolveStripChildItems(
        effective.children ?? []
      )
      if (visibleChildren.length === 0) return

      if (this.openParentId === item.id) {
        this.closeChildrenUi()
        return
      }

      this.openChildrenUi(item, anchor, visibleChildren)
      return
    }

    if (effective.anchorAction) {
      effective.anchorAction(anchor)
    } else if (effective.action) {
      effective.action()
    } else if (effective.command) {
      this.lastCommandItemId = effective.id
      this.options.onCommand(effective.command)
    }
    if (item.toggle) {
      window.setTimeout(() => this.renderButtons(), 0)
    }
  }

  /** Syncs overflow button tooltip with the active locale. */
  private syncOverflowButtonLabels() {
    const label = this.options.i18n.t('toolbar.moreOverflow')
    this.overflowButton.title = label
    this.overflowButton.setAttribute('aria-label', label)
  }

  /** Applies overflow menu or wrap constraints after render or resize. */
  private applyOverflowLayout() {
    if (this.collapsed || !this.root.isConnected) {
      this.overflowButton.hidden = true
      this.overflowMenuActive = false
      return
    }

    if (this.options.overflow === 'wrap') {
      this.applyOverflowWrapLayout()
      return
    }

    if (this.options.overflow === 'menu') {
      this.applyOverflowMenuLayout()
    }
  }

  /** Constrains wrap layout to the mount host and allows multi-row/column flow. */
  private applyOverflowWrapLayout() {
    this.overflowButton.hidden = true
    this.renderedEntries.forEach(entry => {
      entry.element.hidden = false
    })

    const offset = this.inCanvasParent ? this.sideOffset : this.edgeOffset
    const crossInset = this.getCrossAxisInset()
    const horizontal = this.getOrientationClass() === 'horizontal'
    const host = this.getLayoutHost()
    if (horizontal) {
      const maxWidth = Math.max(0, host.clientWidth - offset * 2)
      this.root.style.setProperty(
        '--ml-ex-ui-toolbar-max-width',
        `${maxWidth}px`
      )
      if (this.inCanvasParent) {
        this.root.style.removeProperty('--ml-ex-ui-toolbar-max-height')
      } else {
        const maxHeight = Math.max(
          0,
          host.clientHeight - crossInset.near - crossInset.far
        )
        this.root.style.setProperty(
          '--ml-ex-ui-toolbar-max-height',
          `${maxHeight}px`
        )
      }
    } else {
      if (this.inCanvasParent) {
        this.root.style.removeProperty('--ml-ex-ui-toolbar-max-width')
      } else {
        const maxWidth = Math.max(
          0,
          host.clientWidth - crossInset.near - crossInset.far
        )
        this.root.style.setProperty(
          '--ml-ex-ui-toolbar-max-width',
          `${maxWidth}px`
        )
      }
      const maxHeight = Math.max(0, host.clientHeight - offset * 2)
      this.root.style.setProperty(
        '--ml-ex-ui-toolbar-max-height',
        `${maxHeight}px`
      )
    }
  }

  /** Returns the measured size of a toolbar child along the layout axis. */
  private getEntryAxisSize(entry: HTMLElement, horizontal: boolean): number {
    const measured = horizontal ? entry.offsetWidth : entry.offsetHeight
    if (measured > 0) return measured
    return entry.classList.contains('ml-ex-ui-toolbar-separator')
      ? horizontal
        ? 9
        : 9
      : 36
  }

  /** Hides overflowing items behind a ⋯ menu button. */
  private applyOverflowMenuLayout() {
    this.closeOverflowMenu()
    this.overflowItems = []
    this.overflowMenuActive = false
    this.overflowButton.hidden = true
    this.renderedEntries.forEach(entry => {
      entry.element.hidden = false
    })

    const horizontal = this.getOrientationClass() === 'horizontal'
    const hostLimit = this.getOverflowHostLimit(horizontal)
    // Stretch mode forces root width/height to the host, so offset* metrics never
    // shrink when items are hidden. Measure intrinsic content size instead.
    const fullSize = this.getToolbarOverflowMeasureSize(horizontal)

    if (hostLimit <= 0 || this.renderedEntries.length === 0) {
      this.root.style.removeProperty('--ml-ex-ui-toolbar-max-width')
      this.root.style.removeProperty('--ml-ex-ui-toolbar-max-height')
      return
    }

    if (fullSize <= hostLimit) {
      this.root.style.removeProperty('--ml-ex-ui-toolbar-max-width')
      this.root.style.removeProperty('--ml-ex-ui-toolbar-max-height')
      return
    }

    this.overflowButton.hidden = false

    let hideFrom = this.renderedEntries.length
    while (true) {
      for (let i = 0; i < this.renderedEntries.length; i++) {
        this.renderedEntries[i].element.hidden = i >= hideFrom
      }
      if (
        this.getToolbarOverflowMeasureSize(horizontal) <= hostLimit ||
        hideFrom === 0
      ) {
        break
      }
      hideFrom -= 1
    }

    // Keep at least one primary item visible when possible (avoid ⋯-only bars).
    if (hideFrom === 0 && this.renderedEntries.length > 0) {
      hideFrom = 1
      for (let i = 0; i < this.renderedEntries.length; i++) {
        this.renderedEntries[i].element.hidden = i >= hideFrom
      }
    }

    for (let i = hideFrom; i < this.renderedEntries.length; i++) {
      const entry = this.renderedEntries[i]
      if (!entry.isSeparator) {
        this.overflowItems.push(entry.item)
      }
    }

    this.overflowButton.hidden = this.overflowItems.length === 0
    this.overflowMenuActive = !this.overflowButton.hidden

    this.root.style.removeProperty('--ml-ex-ui-toolbar-max-width')
    this.root.style.removeProperty('--ml-ex-ui-toolbar-max-height')
  }

  /** Forces layout so axis measurements reflect the current DOM state. */
  private flushToolbarAxisMeasure() {
    void this.root.offsetHeight
    void this.root.offsetWidth
  }

  /**
   * Intrinsic axis size for overflow-menu decisions (padding + visible children).
   *
   * Stretch chrome forces the root box to the host size, so {@link getToolbarAxisSize}
   * cannot detect overflow. This sums unstretched child sizes instead.
   */
  private getToolbarOverflowMeasureSize(horizontal: boolean): number {
    const stretch = this.isStretchSize()
    const prevWidth = this.root.style.width
    const prevHeight = this.root.style.height
    if (stretch) {
      // Drop stretch flex so labeled buttons report natural widths/heights.
      this.root.classList.remove('is-stretch')
      this.root.style.width = horizontal ? 'max-content' : prevWidth
      this.root.style.height = horizontal ? prevHeight : 'max-content'
    }

    this.flushToolbarAxisMeasure()
    const style = getComputedStyle(this.root)
    const gap =
      Number.parseFloat(horizontal ? style.columnGap || style.gap : style.rowGap || style.gap) ||
      4
    const padding = horizontal
      ? Number.parseFloat(style.paddingLeft) + Number.parseFloat(style.paddingRight)
      : Number.parseFloat(style.paddingTop) + Number.parseFloat(style.paddingBottom)
    const border = horizontal
      ? Number.parseFloat(style.borderLeftWidth) +
        Number.parseFloat(style.borderRightWidth)
      : Number.parseFloat(style.borderTopWidth) +
        Number.parseFloat(style.borderBottomWidth)
    let size =
      (Number.isFinite(padding) ? padding : 0) +
      (Number.isFinite(border) ? border : 0)
    let visibleCount = 0
    for (const child of Array.from(this.root.children)) {
      if (child instanceof HTMLElement && !child.hidden) {
        if (visibleCount > 0) size += gap
        size += this.getEntryAxisSize(child, horizontal)
        visibleCount += 1
      }
    }

    if (stretch) {
      this.root.classList.add('is-stretch')
      this.root.style.width = prevWidth
      this.root.style.height = prevHeight
      this.flushToolbarAxisMeasure()
    }

    return size
  }

  /**
   * Returns the toolbar root size along the layout axis (padding and chrome included).
   *
   * Uses live layout metrics; falls back to child summation in test environments.
   */
  private getToolbarAxisSize(horizontal: boolean): number {
    this.flushToolbarAxisMeasure()
    const measured = horizontal ? this.root.offsetWidth : this.root.offsetHeight
    if (measured > 0) return measured
    return this.getToolbarOverflowMeasureSize(horizontal)
  }

  /** Returns the host axis limit for toolbar content (inside edge offsets). */
  private getOverflowHostLimit(horizontal: boolean): number {
    const offset = this.inCanvasParent ? this.sideOffset : this.edgeOffset
    const host = this.getLayoutHost()
    const hostSize = horizontal ? host.clientWidth : host.clientHeight
    return Math.max(0, hostSize - offset * 2)
  }

  /** Opens or closes the overflow dropdown menu. */
  private toggleOverflowMenu() {
    if (this.overflowDropdown) {
      this.closeOverflowMenu()
      return
    }
    if (this.overflowItems.length === 0) return

    this.notifyExclusiveOpen()
    this.closeChildrenUi()

    const menuItems = this.overflowItems
      .map(item =>
        acuiResolveParentToolbarDisplay(
          item,
          this.selectedChildByParent.get(item.id)
        )
      )
      .filter(item => !acuiIsToolbarSeparatorItem(item))

    this.overflowDropdown = new AcUiDropdownMenu(
      this.options.i18n,
      menuItems,
      this.overflowButton,
      this.themeHost
    )
    this.overflowDropdown.setOnSelect(child => {
      this.activateToolbarItem(child, this.overflowButton)
      this.closeOverflowMenu()
    })
    this.overflowDropdown.setOnClose(() => {
      this.overflowDropdown = undefined
    })
  }

  /** Closes the overflow dropdown when open. */
  private closeOverflowMenu() {
    this.overflowDropdown?.close()
    this.overflowDropdown = undefined
  }

  private ensureMountHostLayout() {
    if (getComputedStyle(this.mountHost).position === 'static') {
      this.mountHost.style.position = 'relative'
    }
    this.mountHost.classList.add('ml-ex-ui-toolbar-host')
  }

  /**
   * Flex container used for overflow and in-canvas-parent sizing.
   *
   * Overlay toolbars measure the mount host. In-canvas-parent toolbars measure
   * the canvas-slot flex host so the bar tracks the drawing area, not the
   * outer dock chrome.
   */
  private getLayoutHost(): HTMLElement {
    if (this.inCanvasParent) {
      return this.inParentHost ?? this.mountHost
    }
    return this.mountHost
  }

  /**
   * Positioning host for sub-toolbars: optional {@link AcUiToolbarMountOptions.overlayHost},
   * otherwise the canvas slot when in-canvas-parent so strips overlay the drawing,
   * otherwise {@link mountHost}.
   */
  private getOverlayHost(): HTMLElement {
    if (this.options.overlayHost) {
      return this.options.overlayHost
    }
    if (this.inCanvasParent && this.toolbarMain) {
      return this.toolbarMain
    }
    return this.mountHost
  }

  private static readonly IN_PARENT_HOST_CLASSES = [
    'ml-ex-ui-toolbar-in-parent',
    'ml-ex-ui-toolbar-in-parent-top',
    'ml-ex-ui-toolbar-in-parent-bottom',
    'ml-ex-ui-toolbar-in-parent-left',
    'ml-ex-ui-toolbar-in-parent-right'
  ] as const

  /**
   * Wraps canvas children and places the toolbar as a flex sibling when
   * {@link inCanvasParent} is enabled. Prefers an existing dock-main slot so
   * dock side changes do not pull the toolbar onto the dock axis.
   */
  private ensureInParentLayout() {
    if (!this.inCanvasParent) {
      this.releaseInParentLayout({ keepRoot: true })
      return
    }

    const wrapRoot = this.resolveInParentWrapRoot()
    this.applyInParentHostClasses(wrapRoot)
    this.ensureToolbarMainWrapper(wrapRoot)
    this.placeToolbarInWrapRoot(wrapRoot)
  }

  /** Dock-main when present, otherwise the toolbar mount host. */
  private resolveInParentWrapRoot(): HTMLElement {
    const dockMain = this.mountHost.querySelector(':scope > .ml-ex-ui-dock-main')
    return dockMain instanceof HTMLElement ? dockMain : this.mountHost
  }

  private applyInParentHostClasses(wrapRoot: HTMLElement) {
    if (this.inParentHost && this.inParentHost !== wrapRoot) {
      this.clearInParentHostClasses(this.inParentHost)
    }
    this.inParentHost = wrapRoot
    wrapRoot.classList.add('ml-ex-ui-toolbar-in-parent')
    wrapRoot.classList.remove(
      'ml-ex-ui-toolbar-in-parent-top',
      'ml-ex-ui-toolbar-in-parent-bottom',
      'ml-ex-ui-toolbar-in-parent-left',
      'ml-ex-ui-toolbar-in-parent-right'
    )
    wrapRoot.classList.add(
      `ml-ex-ui-toolbar-in-parent-${this.options.placement}`
    )
  }

  private clearInParentHostClasses(host?: HTMLElement) {
    if (!host) return
    host.classList.remove(...AcUiToolbar.IN_PARENT_HOST_CLASSES)
  }

  private shouldSkipInParentMove(node: Node): boolean {
    if (!(node instanceof HTMLElement)) return false
    return (
      node === this.root ||
      node.classList.contains('ml-ex-ui-toolbar') ||
      node.classList.contains('ml-ex-ui-toolbar-main') ||
      node.classList.contains('ml-ex-ui-dock-panel') ||
      node.classList.contains('ml-ex-ui-subtoolbar') ||
      node.classList.contains('ml-ex-ui-dropdown')
    )
  }

  private ensureToolbarMainWrapper(wrapRoot: HTMLElement) {
    if (this.toolbarMain?.parentElement === wrapRoot) return

    const existing = wrapRoot.querySelector(':scope > .ml-ex-ui-toolbar-main')
    if (existing instanceof HTMLElement) {
      this.toolbarMain = existing as HTMLDivElement
      return
    }

    const movable: Node[] = []
    Array.from(wrapRoot.childNodes).forEach(child => {
      if (this.shouldSkipInParentMove(child)) return
      movable.push(child)
    })

    const wrapper = document.createElement('div')
    wrapper.className = 'ml-ex-ui-toolbar-main'
    movable.forEach(node => wrapper.appendChild(node))
    wrapRoot.appendChild(wrapper)
    this.toolbarMain = wrapper
  }

  private placeToolbarInWrapRoot(wrapRoot: HTMLElement) {
    const placement = this.options.placement
    if (placement === 'top' || placement === 'left') {
      wrapRoot.insertBefore(this.root, wrapRoot.firstChild)
      return
    }
    wrapRoot.appendChild(this.root)
  }

  /**
   * Unwraps the canvas slot and restores overlay mounting.
   *
   * @param options.keepRoot - When true, leaves the toolbar root in the DOM.
   */
  private releaseInParentLayout(options: { keepRoot: boolean }) {
    const wasInParent = Boolean(this.inParentHost || this.toolbarMain)
    this.clearInParentHostClasses(this.inParentHost)
    this.inParentHost = undefined
    this.releaseToolbarMainWrapper()
    this.clearInParentOffsetStyles()
    if (
      wasInParent &&
      options.keepRoot &&
      this.root.isConnected &&
      this.root.parentElement !== this.mountHost &&
      this.mountHost.isConnected
    ) {
      this.mountHost.appendChild(this.root)
    }
  }

  private releaseToolbarMainWrapper() {
    if (!this.toolbarMain?.isConnected) {
      this.toolbarMain = undefined
      return
    }

    const parent = this.toolbarMain.parentElement
    if (parent) {
      while (this.toolbarMain.firstChild) {
        parent.insertBefore(this.toolbarMain.firstChild, this.toolbarMain)
      }
    }
    this.toolbarMain.remove()
    this.toolbarMain = undefined
  }

  private clearInParentOffsetStyles() {
    this.root.style.marginTop = ''
    this.root.style.marginRight = ''
    this.root.style.marginBottom = ''
    this.root.style.marginLeft = ''
  }

  private setupResizeObserver() {
    this.resizeObserver?.disconnect()
    this.resizeObserver = new ResizeObserver(() => {
      this.scheduleSyncPosition()
    })
    this.resizeObserver.observe(this.mountHost)
    const layoutHost = this.getLayoutHost()
    if (layoutHost !== this.mountHost) {
      this.resizeObserver.observe(layoutHost)
    }
    if (this.toolbarMain && this.toolbarMain !== layoutHost) {
      this.resizeObserver.observe(this.toolbarMain)
    }
  }

  private scheduleSyncPosition() {
    if (this.layoutFrame !== undefined) return
    this.layoutFrame = requestAnimationFrame(() => {
      this.layoutFrame = undefined
      this.applyOverflowLayout()
      this.syncPosition()
      if (this.overflowMenuActive) {
        const horizontal = this.getOrientationClass() === 'horizontal'
        const hostLimit = this.getOverflowHostLimit(horizontal)
        if (this.getToolbarOverflowMeasureSize(horizontal) > hostLimit) {
          this.applyOverflowMenuLayout()
          this.syncPosition()
        }
      }
      this.openSubToolbar?.syncPosition()
      this.openNestedSubToolbar?.syncPosition()
    })
  }

  /** Positions the toolbar inside the canvas, clamped to the current host bounds. */
  private syncPosition() {
    if (!this.root.isConnected || this.root.hidden) return

    if (this.inCanvasParent) {
      this.applyInParentPosition()
      return
    }

    this.clearInParentOffsetStyles()

    const offset = this.edgeOffset
    const hostWidth = this.mountHost.clientWidth
    const hostHeight = this.mountHost.clientHeight
    if (hostWidth <= 0 || hostHeight <= 0) return

    this.root.style.top = ''
    this.root.style.bottom = ''
    this.root.style.left = ''
    this.root.style.right = ''
    this.root.style.transform = ''
    this.root.style.width = ''
    this.root.style.height = ''
    this.root.style.maxWidth = ''
    this.root.style.maxHeight = ''

    const toolbarWidth = this.getToolbarAxisSize(true)
    const toolbarHeight = this.getToolbarAxisSize(false)
    const placement = this.options.placement
    const stretch = this.isStretchSize()

    if (this.floating && this.isMovable()) {
      const left = this.fromFloatingRatio(
        this.floating.x,
        toolbarWidth,
        hostWidth
      )
      const top = this.fromFloatingRatio(this.floating.y, toolbarHeight, hostHeight)
      this.root.style.left = `${left}px`
      this.root.style.top = `${top}px`
      this.root.style.maxWidth = `${Math.max(0, hostWidth - offset * 2)}px`
      return
    }

    if (placement === 'top' || placement === 'bottom') {
      if (stretch) {
        this.root.style.left = '0'
        this.root.style.right = '0'
        this.root.style.width = `${hostWidth}px`
        this.root.style.maxWidth = `${hostWidth}px`
      } else {
        const maxLeft = Math.max(offset, hostWidth - toolbarWidth - offset)
        const idealLeft = (hostWidth - toolbarWidth) / 2
        const left = Math.min(maxLeft, Math.max(offset, idealLeft))
        this.root.style.left = `${left}px`
        this.root.style.maxWidth = `${Math.max(0, hostWidth - offset * 2)}px`
      }
      if (placement === 'top') {
        this.root.style.top = `${offset}px`
      } else {
        this.root.style.bottom = `${offset}px`
      }
      return
    }

    if (stretch) {
      const stretchHeight = Math.max(0, hostHeight - offset * 2)
      this.root.style.height = `${stretchHeight}px`
      this.root.style.top = `${offset}px`
    } else {
      const lowerTop = offset
      const upperTop = hostHeight - toolbarHeight - offset
      const idealTop = (hostHeight - toolbarHeight) / 2
      // When the shrunk toolbar still fits, keep vertical centering. When it
      // cannot fit, upperTop is negative and bottom-aligns so ⋯ stays in view.
      const top =
        upperTop >= lowerTop
          ? Math.min(upperTop, Math.max(lowerTop, idealTop))
          : upperTop
      this.root.style.top = `${top}px`
    }
    if (placement === 'left') {
      this.root.style.left = `${offset}px`
    } else {
      this.root.style.right = `${offset}px`
    }
  }

  /**
   * Applies edge/side offsets as margins so an in-canvas-parent toolbar sits
   * against the canvas without overlay positioning.
   */
  private applyInParentPosition() {
    this.root.style.top = ''
    this.root.style.bottom = ''
    this.root.style.left = ''
    this.root.style.right = ''
    this.root.style.transform = ''
    this.root.style.width = ''
    this.root.style.height = ''
    this.root.style.maxWidth = ''
    this.root.style.maxHeight = ''

    const offset = this.edgeOffset
    const side = this.sideOffset
    const placement = this.options.placement

    if (placement === 'top' || placement === 'bottom') {
      this.root.style.marginTop = placement === 'bottom' ? `${offset}px` : '0'
      this.root.style.marginBottom = placement === 'top' ? `${offset}px` : '0'
      this.root.style.marginLeft = `${side}px`
      this.root.style.marginRight = `${side}px`
    } else {
      this.root.style.marginLeft = placement === 'right' ? `${offset}px` : '0'
      this.root.style.marginRight = placement === 'left' ? `${offset}px` : '0'
      this.root.style.marginTop = `${side}px`
      this.root.style.marginBottom = `${side}px`
    }
  }

  /** Seeds submenu selection from {@link AcUiToolbarItem.selectedChildId}. */
  private seedSelectedChildren(items: AcUiToolbarItem[]) {
    for (const item of items) {
      if (acuiIsToolbarSeparatorItem(item)) continue
      if (item.childIcon === 'selected' && item.selectedChildId) {
        this.selectedChildByParent.set(item.id, item.selectedChildId)
      }
      if (!acuiIsDynamicToolbarChildren(item) && item.children?.length) {
        this.seedSelectedChildren(item.children)
      }
    }
  }

  /**
   * Resolves visible strip children, applying {@link acuiResolveParentToolbarDisplay}
   * so nested parents (e.g. toolbar placement under settings) show the active
   * child icon.
   */
  private resolveStripChildItems(children: AcUiToolbarItem[]): AcUiToolbarItem[] {
    return acuiFilterVisibleToolbarItems(children, this.openMode).map(child =>
      acuiResolveParentToolbarDisplay(
        child,
        this.selectedChildByParent.get(child.id)
      )
    )
  }

  /** Closes any open dropdown or sub-toolbar and clears parent expanded state. */
  private closeChildrenUi() {
    this.closeOverflowMenu()
    this.closeLayoutMenu()
    this.closeNestedSubToolbar()
    this.openDropdown?.close()
    this.openDropdown = undefined
    this.openSubToolbar?.close()
    this.openSubToolbar = undefined
    this.clearParentOpenState()
    this.openParentId = undefined
    this.stickyParentId = undefined
  }

  /** Removes `is-open` / `aria-expanded` from the last expanded parent button. */
  private clearParentOpenState() {
    if (!this.openParentButton) return
    this.openParentButton.classList.remove('is-open')
    this.openParentButton.setAttribute('aria-expanded', 'false')
    if (this.openParentButton instanceof HTMLElement) {
      this.openParentButton.blur()
    }
    this.openParentButton = undefined
  }

  /**
   * Marks a parent button as expanded while its children UI is open.
   *
   * @param button - Parent toolbar button.
   */
  private markParentOpen(button: HTMLElement) {
    this.clearParentOpenState()
    button.classList.add('is-open')
    button.setAttribute('aria-expanded', 'true')
    this.openParentButton = button
  }

  /**
   * Opens a dropdown or sub-toolbar for a parent item.
   *
   * @param item - Parent toolbar item.
   * @param button - Parent button used as the anchor.
   * @param visibleChildren - Filtered, effective child items.
   */
  private openChildrenUi(
    item: AcUiToolbarItem,
    button: HTMLButtonElement,
    visibleChildren: AcUiToolbarItem[]
  ) {
    this.notifyExclusiveOpen()
    this.closeChildrenUi()
    const childrenUi = acuiResolveToolbarChildrenUi(item)
    this.openParentId = item.id
    this.markParentOpen(button)

    if (acuiIsToolbarChildrenStrip(childrenUi)) {
      const sticky = childrenUi === 'sticky-toolbar'
      this.stickyParentId = sticky ? item.id : undefined
      const strip = new AcUiSubToolbar({
        i18n: this.options.i18n,
        items: visibleChildren,
        anchor: button,
        toolbarRoot: this.root,
        host: this.getOverlayHost(),
        placement: this.options.placement,
        sticky,
        chrome: this.resolveSubToolbarChrome(),
        position: this.options.subToolbar?.position,
        getCrossAxisInset: () => this.getCrossAxisInset(),
        commandsDisabled: this.isDisabled || !this.hasDocument,
        isItemActive: id => this.activeItemIds.has(id),
        onSelect: (child, childButton) =>
          this.handleSubToolbarSelect(item, child, childButton, sticky),
        onClose: () => {
          if (this.openSubToolbar === strip) {
            this.closeNestedSubToolbar()
            this.openSubToolbar = undefined
            this.clearParentOpenState()
            this.openParentId = undefined
            this.stickyParentId = undefined
          }
        },
        shouldKeepOpenForTarget: target =>
          this.openNestedSubToolbar?.containsTarget(target) ?? false
      })
      this.openSubToolbar = strip
      return
    }

    const dropdown = new AcUiDropdownMenu(
      this.options.i18n,
      visibleChildren,
      button,
      this.themeHost
    )
    dropdown.setOnSelect(child => {
      this.activateChild(item, child, false)
    })
    dropdown.setOnClose(() => {
      if (this.openDropdown === dropdown) {
        this.openDropdown = undefined
        this.clearParentOpenState()
        this.openParentId = undefined
      }
    })
    this.openDropdown = dropdown
  }

  /**
   * Re-opens a sticky sub-toolbar after the main toolbar is rebuilt.
   *
   * @param parentId - Parent item id that was sticky-open.
   */
  private openStickyChildrenByParentId(parentId: string) {
    const item = this.items.find(candidate => {
      if (acuiIsToolbarSeparatorItem(candidate)) return false
      return candidate.id === parentId
    })
    if (!item?.children?.length) return
    if (acuiResolveToolbarChildrenUi(item) !== 'sticky-toolbar') return

    const button = this.root.querySelector<HTMLButtonElement>(
      `[data-toolbar-item-id="${parentId}"]`
    )
    if (!button) return

    const visibleChildren = this.resolveStripChildItems(item.children)
    if (visibleChildren.length === 0) return

    this.openChildrenUi(item, button, visibleChildren)
  }

  /**
   * Handles a sub-toolbar item click, opening nested strips when needed.
   *
   * @param stripParent - Root parent item that owns the first-level strip.
   * @param child - Sub-toolbar item that was activated.
   * @param button - Anchor button for nested UI positioning.
   * @param stripSticky - Whether the first-level strip is sticky.
   */
  private handleSubToolbarSelect(
    stripParent: AcUiToolbarItem,
    child: AcUiToolbarItem,
    button: HTMLButtonElement,
    stripSticky: boolean
  ) {
    if (acuiIsToolbarSeparatorItem(child)) return

    const effective = acuiResolveEffectiveToolbarItem(child)
    if (
      effective.children?.length ||
      acuiIsDynamicToolbarChildren(effective)
    ) {
      const visibleChildren = this.resolveStripChildItems(
        effective.children ?? []
      )
      if (visibleChildren.length === 0) return
      this.openNestedSubToolbarUi(
        effective,
        button,
        visibleChildren,
        stripParent,
        stripSticky
      )
      return
    }

    this.activateChild(stripParent, child, stripSticky)
    if (!stripSticky) {
      this.closeChildrenUi()
    }
  }

  /**
   * Opens a nested icon strip or dropdown for a sub-toolbar parent
   * (e.g. locale under settings on the phone toolbar).
   *
   * @param item - Parent item with nested children.
   * @param button - Sub-toolbar button used as the nested anchor.
   * @param visibleChildren - Filtered child items to show.
   * @param stripParent - First-level strip parent (for refresh after nested select).
   * @param stripSticky - Whether the first-level strip is sticky.
   */
  private openNestedSubToolbarUi(
    item: AcUiToolbarItem,
    button: HTMLButtonElement,
    visibleChildren: AcUiToolbarItem[],
    stripParent: AcUiToolbarItem,
    stripSticky: boolean
  ) {
    if (
      this.openNestedSubToolbar &&
      this.openNestedSubToolbar.anchor === button
    ) {
      this.closeNestedSubToolbar()
      return
    }

    this.closeNestedSubToolbar()
    const childrenUi = acuiResolveToolbarChildrenUi(item)
    const chrome = this.resolveSubToolbarChrome()
    const replaceOnNested = chrome.replaceOnNested

    if (!acuiIsToolbarChildrenStrip(childrenUi)) {
      const dropdown = new AcUiDropdownMenu(
        this.options.i18n,
        visibleChildren,
        button,
        this.themeHost
      )
      dropdown.setOnSelect(child => {
        this.activateChild(item, child, false)
        dropdown.close()
        if (!stripSticky) {
          this.closeChildrenUi()
        } else {
          this.openSubToolbar?.refresh(
            this.resolveStripChildItems(stripParent.children ?? []),
            this.isDisabled || !this.hasDocument
          )
        }
      })
      dropdown.setOnClose(() => undefined)
      return
    }

    if (replaceOnNested) {
      this.openSubToolbar?.setHidden(true)
    }

    const nestedSticky = childrenUi === 'sticky-toolbar'
    const nested = new AcUiSubToolbar({
      i18n: this.options.i18n,
      items: visibleChildren,
      anchor: button,
      toolbarRoot:
        replaceOnNested || !this.openSubToolbar
          ? this.root
          : this.openSubToolbar.rootElement,
      host: this.getOverlayHost(),
      placement: this.options.placement,
      sticky: nestedSticky,
      chrome,
      position: this.options.subToolbar?.position,
      getCrossAxisInset: () => this.getCrossAxisInset(),
      commandsDisabled: this.isDisabled || !this.hasDocument,
      isItemActive: id => this.activeItemIds.has(id),
      onSelect: (child, nestedButton) =>
        this.handleSubToolbarSelect(item, child, nestedButton, nestedSticky),
      onClose: () => {
        if (this.openNestedSubToolbar === nested) {
          this.openNestedSubToolbar = undefined
          if (replaceOnNested) {
            this.openSubToolbar?.setHidden(false)
            this.openSubToolbar?.syncPosition()
          }
        }
      }
    })
    this.openNestedSubToolbar = nested
  }

  /** Closes the nested sub-toolbar opened from a parent strip item. */
  private closeNestedSubToolbar() {
    const replaceOnNested =
      this.resolveSubToolbarChrome().replaceOnNested === true
    this.openNestedSubToolbar?.close()
    this.openNestedSubToolbar = undefined
    if (replaceOnNested) {
      this.openSubToolbar?.setHidden(false)
    }
  }

  /**
   * Runs a child item's action/command and refreshes parent/child UI as needed.
   *
   * @param parent - Parent toolbar item.
   * @param child - Selected child item.
   * @param sticky - Whether the child UI should stay open.
   */
  private activateChild(
    parent: AcUiToolbarItem,
    child: AcUiToolbarItem,
    sticky: boolean
  ) {
    if (acuiIsToolbarSeparatorItem(child)) return
    const effective = acuiResolveEffectiveToolbarItem(child)
    if (parent.childIcon === 'selected') {
      this.selectedChildByParent.set(parent.id, effective.id)
    }
    if (effective.action) {
      effective.action()
    } else if (effective.command) {
      this.lastCommandItemId = effective.id
      this.options.onCommand(effective.command)
    }

    const isLocalePick =
      !acuiIsToolbarSeparatorItem(child) &&
      effective.id.startsWith('locale-')
    if (isLocalePick) {
      this.refreshLocale()
    }

    if (child.toggle && sticky && this.openSubToolbar) {
      window.setTimeout(() => {
        if (!this.openSubToolbar) return
        this.openSubToolbar.refresh(
          this.resolveStripChildItems(parent.children ?? []),
          this.isDisabled || !this.hasDocument
        )
      }, 0)
      return
    }

    // Nested parents under an open strip (e.g. placement under settings):
    // refresh the strip so the parent button shows the newly selected icon.
    if (
      parent.childIcon === 'selected' &&
      this.openSubToolbar &&
      this.openParentId &&
      parent.id !== this.openParentId
    ) {
      const stripParent = this.items.find(candidate => {
        if (acuiIsToolbarSeparatorItem(candidate)) return false
        return candidate.id === this.openParentId
      })
      if (stripParent?.children?.length) {
        window.setTimeout(() => {
          if (!this.openSubToolbar || !stripParent.children) return
          this.openSubToolbar.refresh(
            this.resolveStripChildItems(stripParent.children),
            this.isDisabled || !this.hasDocument
          )
        }, 0)
      }
    }

    if (child.toggle) {
      window.setTimeout(() => this.renderButtons(), 0)
    } else if (parent.childIcon === 'selected' || parent.toggle) {
      this.renderButtons()
    }
  }
}
