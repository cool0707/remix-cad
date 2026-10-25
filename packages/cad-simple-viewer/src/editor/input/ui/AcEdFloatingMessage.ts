import {
  acdbHostApplicationServices,
  AcDbSystemVariables,
  AcDbSysVarManager,
  AcGePoint2dLike
} from '@mlightcad/data-model'

import { AcEdBaseView } from '../../view'
import { acedIsDynamicInputEnabled } from '../AcEdDynamicInput'


/** Keyword pill shown above a floating prompt. */
export interface AcEdFloatingKeyword {
  /** Option name without the shortcut, e.g. `Arc` / `円弧`. */
  name: string
  /** Shortcut letter(s) typed to pick it, e.g. `A`. */
  key?: string
  /** When false the pill is dimmed. */
  enabled?: boolean
}

/**
 * AcEdFloatingMessage
 * -----------------------------------------------------------------------------
 * A lightweight floating UI component that displays a short text message
 * near the mouse cursor, similar to AutoCAD's dynamic prompt / tooltip.
 *
 * Responsibilities:
 * - Create and manage a floating DOM element with a text label
 * - Follow mouse movement while visible
 * - Automatically show / hide on mouse enter / leave
 * - Ensure the floating message stays inside parent bounds
 * - Manage its own DOM lifecycle and event listeners
 *
 * Non-Responsibilities (by design):
 * - No input boxes
 * - No keyboard handling
 * - No OSNAP logic
 * - No rubber-band / preview drawing
 * - No CAD command logic
 *
 * This class serves as a reusable base for more advanced floating UI
 * components such as `AcEdFloatingInput`, which extend this class
 * to add inputs, validation, OSNAP, and commit workflows.
 */
export class AcEdFloatingMessage {
  /** The view associated with the current editor context */
  protected view: AcEdBaseView

  /**
   * Parent element used for positioning and mouse tracking.
   * Typically the canvas container or viewport element.
   */
  protected parent: HTMLElement

  /**
   * Host element where floating DOM is mounted.
   * This should be tied to the view area (not global document body).
   */
  protected host: HTMLElement

  /**
   * Root container of the floating message.
   * Positioned absolutely and follows the mouse cursor.
   */
  protected container: HTMLDivElement

  /**
   * Text label element used to display the floating message.
   */
  protected label: HTMLSpanElement

  /** Keyword pills shown above the message / inputs */
  protected keywordsEl: HTMLDivElement

  /** Whether the floating message is currently visible */
  protected visible = false

  /** Whether this instance has been permanently disposed */
  protected disposed = false

  /** Ensures CSS is injected only once globally */
  private static stylesInjected = false

  /** Cached event handler: mouse enter */
  protected boundOnMouseEnter: (e: MouseEvent) => void

  /** Cached event handler: mouse leave */
  protected boundOnMouseLeave: (e: MouseEvent) => void

  /** Cached event handler: mouse move */
  protected boundOnMouseMove: (e: MouseEvent) => void

  /** Whether cursor is inside parent */
  private isHovering = false

  /** Whether prompt display is allowed at all */
  protected allowPrompt: boolean

  /** Cached sysvar handler */
  private boundOnSysVarChanged: (args: {
    name: string
    database: unknown
  }) => void

  /**
   * Constructs a floating message widget.
   *
   * @param view   The active editor view
   * @param options.parent  Parent element used for positioning
   * @param options.message Initial message text
   */
  constructor(
    view: AcEdBaseView,
    options: {
      parent?: HTMLElement
      message?: string
      allowPrompt?: boolean
      keywords?: AcEdFloatingKeyword[]
    }
  ) {
    this.view = view
    // Mouse tracking is attached to canvas by default so interaction scope
    // stays inside the active view.
    this.parent = options.parent ?? this.view.canvas
    this.host = this.view.container

    // Floating UI is absolutely positioned in the view host.
    const hostPosition = getComputedStyle(this.host).position
    if (hostPosition === 'static') {
      this.host.style.position = 'relative'
    }

    // Create container
    this.container = document.createElement('div')
    this.container.className = 'ml-floating-input'

    this.allowPrompt = options.allowPrompt !== false

    // Create message label
    const message = options.message ?? ''
    this.label = document.createElement('span')
    this.label.className = 'ml-floating-input-label'
    this.label.textContent = message
    if (!message.trim()) {
      this.label.style.display = 'none'
    }
    this.container.appendChild(this.label)

    this.keywordsEl = document.createElement('div')
    this.keywordsEl.className = 'ml-floating-input-keywords'
    this.container.appendChild(this.keywordsEl)
    this.setKeywords(options.keywords ?? [])

    // Mount inside view host so UI is constrained to the view canvas area.
    this.host.appendChild(this.container)

    // Bind handlers once so they can be removed safely
    this.boundOnMouseEnter = e => this.handleMouseEnter(e)
    this.boundOnMouseLeave = () => this.handleMouseLeave()
    this.boundOnMouseMove = e => this.handleMouseMove(e)

    // AutoCAD-like behavior:
    // - Show message when mouse enters parent
    // - Hide message when mouse leaves parent
    this.parent.addEventListener('mouseenter', this.boundOnMouseEnter)
    this.parent.addEventListener('mouseleave', this.boundOnMouseLeave)

    this.boundOnSysVarChanged = args => {
      const name = args.name?.toLowerCase()
      if (
        name === AcDbSystemVariables.DYNMODE.toLowerCase() ||
        name === AcDbSystemVariables.DYNPROMPT.toLowerCase()
      ) {
        this.updateDynamicDisplay()
      }
    }
    AcDbSysVarManager.instance().events.sysVarChanged.addEventListener(
      this.boundOnSysVarChanged
    )
    this.updateDynamicDisplay()

    this.injectCSS()
  }

  /**
   * Injects minimal CSS required for the floating message.
   * This is done once globally to avoid duplicate styles.
   */
  protected injectCSS() {
    if (AcEdFloatingMessage.stylesInjected) return
    AcEdFloatingMessage.stylesInjected = true

    const style = document.createElement('style')
    style.textContent = `
      .ml-floating-input {
        position: absolute;
        display: flex;
        align-items: center;
        padding: 2px 4px;
        background: var(--ml-ui-bg, #444);
        color: var(--ml-ui-text, #fff);
        border-radius: 4px;
        font-size: 12px;
        pointer-events: none;
        z-index: 2;
      }
      .ml-floating-input-label {
        white-space: nowrap;
        color: var(--ml-ui-text, #fff);
      }
      .ml-floating-input-keywords {
        position: absolute;
        left: 0;
        bottom: calc(100% + 6px);
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        gap: 4px;
        width: max-content;
        white-space: nowrap;
      }
      .ml-floating-input-keywords:empty {
        display: none;
      }
      .ml-floating-input.is-keywords-below .ml-floating-input-keywords {
        bottom: auto;
        top: calc(100% + 6px);
      }
      .ml-floating-input-keyword {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: 22px;
        padding: 0 4px 0 10px;
        border-radius: 999px;
        border: 1px solid
          color-mix(in srgb, var(--ml-brand, #af61da) 45%, transparent);
        background: var(--ml-ui-bg, #444);
        color: var(--ml-ui-text, #fff);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
        font-size: 12px;
        line-height: 1;
      }
      .ml-floating-input-keyword.is-disabled {
        opacity: 0.45;
      }
      .ml-floating-input-keyword-key {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 16px;
        height: 16px;
        padding: 0 4px;
        box-sizing: border-box;
        border-radius: 999px;
        background: var(--ml-brand-gradient, var(--ml-brand, #af61da));
        color: #fff;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.02em;
      }
    `
    document.head.appendChild(style)
  }

  /**
   * Replaces the keyword pills (e.g. `Arc [A]`) shown above the prompt.
   * They are hints only: the tooltip follows the cursor, so the letter is
   * typed (then Enter) rather than clicked.
   */
  setKeywords(keywords: AcEdFloatingKeyword[]) {
    this.keywordsEl.replaceChildren(
      ...keywords.map(kw => {
        const pill = document.createElement('span')
        pill.className = 'ml-floating-input-keyword'
        if (kw.enabled === false) pill.classList.add('is-disabled')
        const name = document.createElement('span')
        name.textContent = kw.name
        pill.appendChild(name)
        if (kw.key) {
          const key = document.createElement('span')
          key.className = 'ml-floating-input-keyword-key'
          key.textContent = kw.key
          pill.appendChild(key)
        }
        return pill
      })
    )
  }

  /**
   * Indicates whether the floating message is currently visible.
   */
  get isVisible() {
    return this.visible
  }

  /**
   * Shows the floating message at the given mouse position
   * and starts tracking mouse movement.
   *
   * @param pos Mouse position in browser coordinates
   */
  showAt(pos: AcGePoint2dLike) {
    if (this.disposed) return
    if (!this.shouldShowPrompt()) return

    this.visible = true
    this.container.style.display = 'flex'
    this.setPosition(pos)

    this.parent.addEventListener('mousemove', this.boundOnMouseMove)
  }

  /**
   * Hides the floating message and stops mouse tracking.
   * Safe to call multiple times.
   */
  hide() {
    if (!this.visible) return

    this.visible = false
    this.container.style.display = 'none'
    this.parent.removeEventListener('mousemove', this.boundOnMouseMove)
  }

  /**
   * Permanently disposes this floating message.
   *
   * - Removes all event listeners
   * - Removes DOM elements
   * - After disposal, the instance must not be reused
   */
  dispose() {
    if (this.disposed) return
    this.disposed = true

    this.hide()
    this.parent.removeEventListener('mouseenter', this.boundOnMouseEnter)
    this.parent.removeEventListener('mouseleave', this.boundOnMouseLeave)
    AcDbSysVarManager.instance().events.sysVarChanged.removeEventListener(
      this.boundOnSysVarChanged
    )
    this.container.remove()
  }

  /**
   * Updates the position of the floating message to follow the mouse
   * while ensuring it stays within the parent bounds.
   *
   * @param pos Mouse position in browser coordinates
   */
  protected setPosition(pos: AcGePoint2dLike) {
    const hostRect = this.host.getBoundingClientRect()
    const rect = this.container.getBoundingClientRect()

    const mousePos = this.view.viewportToCanvas(pos)

    const hostPos = this.view.viewportToContainer(pos)
    let left = hostPos.x + 10
    let top = hostPos.y + 10

    // Clamp to host bounds
    left = Math.min(left, hostRect.width - rect.width)
    top = Math.min(top, hostRect.height - rect.height)
    left = Math.max(left, 0)
    top = Math.max(top, 0)

    // Keyword pills sit above the prompt; drop them below near the top edge.
    if (this.keywordsEl.childElementCount > 0) {
      // Wrap instead of running past the view's right edge.
      this.keywordsEl.style.maxWidth = `${Math.max(hostRect.width - left - 8, 160)}px`
      const pillsHeight = this.keywordsEl.offsetHeight + 6
      this.container.classList.toggle('is-keywords-below', top < pillsHeight)
    }

    this.container.style.left = `${left}px`
    this.container.style.top = `${top}px`

    return mousePos
  }

  /**
   * Mouse enter handler.
   * Shows the floating message at the current cursor position.
   */
  protected handleMouseEnter(e: MouseEvent) {
    this.isHovering = true
    this.showAt(e)
  }

  /**
   * Mouse leave handler.
   * Hides the floating message.
   */
  protected handleMouseLeave() {
    this.isHovering = false
    this.hide()
  }

  /**
   * Mouse move handler.
   * Updates floating message position.
   * Can be overridden by subclasses to extend behavior.
   */
  protected handleMouseMove(e: MouseEvent) {
    if (!this.visible) return
    this.setPosition(e)
  }

  // ---------------------------------------------------------------------------
  // Dynamic Prompt Settings
  // ---------------------------------------------------------------------------

  protected getSysVarValue(name: string) {
    const db = acdbHostApplicationServices().workingDatabase
    return AcDbSysVarManager.instance().getVar(name, db)
  }

  protected isDynamicInputEnabled() {
    return acedIsDynamicInputEnabled()
  }

  protected isDynamicPromptEnabled() {
    return !!this.getSysVarValue(AcDbSystemVariables.DYNPROMPT)
  }

  private shouldShowPrompt() {
    const hasMessage = !!this.label.textContent?.trim()
    if (!hasMessage) return false
    if (!this.allowPrompt) return false
    if (!this.isDynamicInputEnabled()) return false
    if (!this.isDynamicPromptEnabled()) return false
    return true
  }

  private updateDynamicDisplay() {
    if (!this.shouldShowPrompt()) {
      this.hide()
      return
    }

    if (this.isHovering) {
      this.showAt(this.view.canvasToViewport(this.view.curMousePos))
    }
  }
}
