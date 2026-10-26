import { acdbHostApplicationServices } from '@mlightcad/data-model'

import { ML_UI_Z_CANVAS_HTML_STROKE } from '../editor/global/AcEdUiLayout'
import type { AcTrView2d } from '../view'
import type { AcApDocManager } from './AcApDocManager'
import {
  type AcApDrawingSheet,
  acapResolveDrawingSheet
} from './AcApDrawingSheet'
import { AcApSettingManager } from './AcApSettingManager'

const SVG_NS = 'http://www.w3.org/2000/svg'

/**
 * Text shown above the print area, e.g. `A3 1:100` (`A4 縦` style
 * orientation words are left out so the label needs no translation).
 */
export function acapPrintAreaLabel(sheet: AcApDrawingSheet['sheet']) {
  return `${sheet.paper} 1:${Number(sheet.scale.toPrecision(10))}`
}

/**
 * Illustrator-style artboard display (`isShowPrintArea` setting): in the
 * canvas (model space), everything outside the sheet the drawing is printed /
 * exported on (see {@link acapResolveDrawingSheet}) is covered with gray.
 *
 * The overlay is screen-space HTML over the WebGL canvas and never takes
 * pointer events. The sheet is resolved when the mode is turned on, when a
 * drawing is activated and when the layout changes, so it does not move
 * while the user draws.
 */
export class AcApPrintAreaOverlay {
  private readonly root: SVGSVGElement
  private readonly mask: SVGPathElement
  private readonly border: SVGPolygonElement
  private readonly label: SVGTextElement
  private sheet?: AcApDrawingSheet
  private view?: AcTrView2d

  constructor(private readonly docManager: AcApDocManager) {
    this.root = document.createElementNS(SVG_NS, 'svg')
    this.root.classList.add('ml-print-area-overlay')
    Object.assign(this.root.style, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: String(ML_UI_Z_CANVAS_HTML_STROKE),
      display: 'none'
    })
    this.mask = document.createElementNS(SVG_NS, 'path')
    this.mask.setAttribute('fill-rule', 'evenodd')
    this.mask.setAttribute(
      'fill',
      'var(--ml-print-area-mask, rgba(110, 110, 110, 0.6))'
    )
    this.border = document.createElementNS(SVG_NS, 'polygon')
    this.border.setAttribute('fill', 'none')
    this.border.setAttribute('stroke', 'rgba(0, 0, 0, 0.45)')
    this.border.setAttribute('stroke-width', '1')
    this.label = document.createElementNS(SVG_NS, 'text')
    this.label.setAttribute('fill', '#fff')
    this.label.setAttribute('font-size', '12')
    this.label.setAttribute('paint-order', 'stroke')
    this.label.setAttribute('stroke', 'rgba(0, 0, 0, 0.35)')
    this.label.setAttribute('stroke-width', '2')
    this.root.append(this.mask, this.border, this.label)

    const settings = AcApSettingManager.instance
    settings.events.modified.addEventListener(({ key }) => {
      if (key === 'isShowPrintArea') this.refresh(true)
    })
    docManager.events.documentActivated.addEventListener(() =>
      this.refresh(true)
    )
    acdbHostApplicationServices().layoutManager.events.layoutSwitched.addEventListener(
      () => this.refresh(true)
    )
    this.refresh(true)
  }

  /** Whether the mode is on (it shows only while the canvas is active). */
  get isEnabled() {
    return !!AcApSettingManager.instance.get('isShowPrintArea')
  }

  /** The sheet currently shown, if any. */
  get currentSheet() {
    return this.isVisible() ? this.sheet : undefined
  }

  /**
   * Re-resolves the sheet (when `resolve` is true) and redraws. Call after
   * changing the drawing limits.
   */
  refresh(resolve = false) {
    this.bindView()
    if (resolve) this.sheet = undefined
    if (!this.isVisible()) {
      this.root.style.display = 'none'
      return
    }
    if (!this.sheet) {
      try {
        this.sheet = acapResolveDrawingSheet(
          this.docManager.curDocument.database
        )
      } catch {
        this.root.style.display = 'none'
        return
      }
    }
    this.draw(this.sheet)
  }

  private isVisible() {
    const view = this.docManager.curView
    return (
      this.isEnabled &&
      !!view &&
      view.activeLayoutBtrId === view.modelSpaceBtrId
    )
  }

  private readonly onViewChanged = () => this.refresh()

  /** Follows the current view (the overlay lives in its container). */
  private bindView() {
    const view = this.docManager.curView
    if (view === this.view) return
    if (this.view) {
      this.view.events.viewChanged.removeEventListener(this.onViewChanged)
      this.view.events.viewResize.removeEventListener(this.onViewChanged)
    }
    this.view = view
    if (!view) return
    // Right after the canvas: selection rectangles, measure strokes and
    // labels added later stay on top of the mask.
    const { canvas, container } = view
    container.insertBefore(
      this.root,
      canvas?.parentNode === container ? canvas.nextSibling : null
    )
    view.events.viewChanged.addEventListener(this.onViewChanged)
    view.events.viewResize.addEventListener(this.onViewChanged)
  }

  private draw(drawingSheet: AcApDrawingSheet) {
    const view = this.view!
    const { min, max } = drawingSheet
    const corners = [
      { x: min.x, y: min.y },
      { x: max.x, y: min.y },
      { x: max.x, y: max.y },
      { x: min.x, y: max.y }
    ].map(p => view.worldToScreen(p))
    if (!corners.every(p => Number.isFinite(p.x) && Number.isFinite(p.y))) {
      this.root.style.display = 'none'
      return
    }
    const w = view.width
    const h = view.height
    const pts = corners.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    // Outer rectangle (a little past the edges) minus the sheet: even-odd.
    this.mask.setAttribute(
      'd',
      `M-10,-10H${w + 10}V${h + 10}H-10Z M${pts.join(' L')}Z`
    )
    this.border.setAttribute('points', pts.join(' '))
    // Label just above the top-left corner of the sheet on screen.
    const left = Math.min(...corners.map(p => p.x))
    const top = Math.min(...corners.map(p => p.y))
    this.label.textContent = acapPrintAreaLabel(drawingSheet.sheet)
    this.label.setAttribute('x', String(Math.max(left, 4)))
    this.label.setAttribute('y', String(Math.max(top - 6, 14)))
    this.root.style.display = ''
  }
}
