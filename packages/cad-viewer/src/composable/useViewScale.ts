import {
  AcApDocManager,
  acapUnitToMm,
  type AcEdBaseView
} from '@mlightcad/cad-simple-viewer'
import { AcGeBox2d } from '@mlightcad/data-model'
import { onMounted, onUnmounted, ref } from 'vue'

import {
  viewScaleFromWorldPerPixel,
  worldPerPixelFromViewScale
} from './viewScale'

const currentView = () => AcApDocManager.instance.curView as AcEdBaseView

const mmPerUnit = () =>
  acapUnitToMm(Number(AcApDocManager.instance.curDocument?.database?.insunits))

/** Drawing units per CSS pixel, measured across the canvas. */
const worldPerPixel = (view: AcEdBaseView) => {
  const width = Math.max(view.canvas.clientWidth, 1)
  const left = view.screenToWorld({ x: 0, y: 0 })
  const right = view.screenToWorld({ x: width, y: 0 })
  return Math.abs(right.x - left.x) / width
}

/**
 * The current view's display scale (screen length / real length, see
 * `viewScale.ts`), kept up to date while the view pans and zooms, and setters
 * that zoom about the centre of the view.
 */
export function useViewScale() {
  const scale = ref(0)

  const refresh = () => {
    try {
      const next = viewScaleFromWorldPerPixel(
        worldPerPixel(currentView()),
        mmPerUnit()
      )
      scale.value = Number.isFinite(next) && next > 0 ? next : 0
    } catch {
      // No view or layout yet.
      scale.value = 0
    }
  }

  /** Zooms about the view centre to `next` (screen / real). */
  const setScale = (next: number) => {
    if (!Number.isFinite(next) || next <= 0) return
    const view = currentView()
    const width = Math.max(view.canvas.clientWidth, 1)
    const height = Math.max(view.canvas.clientHeight, 1)
    const center = view.screenToWorld({ x: width / 2, y: height / 2 })
    const perPixel = worldPerPixelFromViewScale(next, mmPerUnit())
    const halfWidth = (width * perPixel) / 2
    const halfHeight = (height * perPixel) / 2
    view.zoomTo(
      new AcGeBox2d(
        { x: center.x - halfWidth, y: center.y - halfHeight },
        { x: center.x + halfWidth, y: center.y + halfHeight }
      ),
      1
    )
    refresh()
  }

  /** Multiplies the scale by `factor` (> 1 zooms in). */
  const zoomBy = (factor: number) => {
    refresh()
    if (scale.value > 0) setScale(scale.value * factor)
  }

  const zoomExtents = () => {
    AcApDocManager.instance.sendStringToExecute('zoom\nall')
  }

  let boundView: AcEdBaseView | undefined
  const bind = () => {
    unbind()
    try {
      boundView = currentView()
    } catch {
      return
    }
    boundView.events.viewChanged.addEventListener(refresh)
    boundView.events.viewResize.addEventListener(refresh)
    refresh()
  }
  const unbind = () => {
    boundView?.events.viewChanged.removeEventListener(refresh)
    boundView?.events.viewResize.removeEventListener(refresh)
    boundView = undefined
  }

  onMounted(() => {
    bind()
    AcApDocManager.instance.events.documentActivated.addEventListener(bind)
  })
  onUnmounted(() => {
    unbind()
    AcApDocManager.instance.events.documentActivated.removeEventListener(bind)
  })

  return { scale, setScale, zoomBy, zoomExtents, refresh }
}
