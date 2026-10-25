<script setup lang="ts">
/**
 * Vertical main toolbar for cad-viewer, backed by shared {@link AcUiToolbar}.
 */
import {
  acapBindToolbarDocState,
  AcApDocManager,
  AcApI18n,
  AcEdOpenMode,
  AcUiToolbar,
  type AcUiToolbarFloatingLayout,
  type AcUiToolbarItem,
  ICON_ANNOTATION,
  ICON_ANNOTATION_HIDE,
  ICON_ANNOTATION_SHOW,
  ICON_CLEAR_MARKUPS,
  ICON_CLEAR_MEASUREMENTS,
  ICON_LAYER,
  ICON_MARKUP_ARROW,
  ICON_MARKUP_CALLOUT,
  ICON_MARKUP_EXPORT,
  ICON_MARKUP_IMPORT,
  ICON_MARKUP_PANEL,
  ICON_MARKUP_STAMP,
  ICON_MARKUP_TEXT,
  ICON_MEASURE,
  ICON_MEASURE_ANGLE,
  ICON_MEASURE_ARC,
  ICON_MEASURE_AREA,
  ICON_MEASURE_CONTINUOUS,
  ICON_MEASURE_DISTANCE,
  ICON_MEASURE_POINT,
  ICON_MEASUREMENT_PANEL,
  ICON_PAN,
  ICON_READING_MODE,
  ICON_REV_CIRCLE,
  ICON_REV_CLOUD,
  ICON_REV_RECT,
  ICON_SELECT,
  ICON_SWITCH_BG,
  ICON_TEXT,
  ICON_ZOOM_EXTENT,
  ICON_ZOOM_ORIGINAL,
  ICON_ZOOM_SMART,
  ICON_ZOOM_WINDOW,
  isMarkupVisible,
  isMeasurementVisible
} from '@mlightcad/cad-simple-viewer'
import {
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch
} from 'vue'

import { useDocument, useSettings } from '../../composable'
import { ML_TOOLBAR_EDGE_OFFSET } from '../../composable/toolbarSide'
import { usePaletteToolbarAvoidance } from '../../composable/usePaletteToolbarAvoidance'
// Raw markup: AcUiToolbar takes SVG strings. (Rendering Vue icon components
// while it builds buttons would flush pending watchers and re-enter it.)
import arcThreePointsSvg from '../../svg/arc/arcThreePoints.svg?raw'
import attachDwgSvg from '../../svg/attachDwg.svg?raw'
import attachImageSvg from '../../svg/attachImage.svg?raw'
import circleCenterRadiusSvg from '../../svg/circle/circleCenterRadius.svg?raw'
import defineAttributeSvg from '../../svg/defineAttribute.svg?raw'
import editAttributeSvg from '../../svg/editAttribute.svg?raw'
import ellipseCenterSvg from '../../svg/ellipse/ellipseCenter.svg?raw'
import hatchSvg from '../../svg/hatch/hatch.svg?raw'
import insertBlockSvg from '../../svg/insertBlock.svg?raw'
import lineSvg from '../../svg/line.svg?raw'
import mlineSvg from '../../svg/mline.svg?raw'
import moveSvg from '../../svg/move.svg?raw'
import multiPointsSvg from '../../svg/multiPoints.svg?raw'
import offsetSvg from '../../svg/offset.svg?raw'
import polygonSvg from '../../svg/polygon.svg?raw'
import polylineSvg from '../../svg/polyline.svg?raw'
import raySvg from '../../svg/ray.svg?raw'
import rectSvg from '../../svg/rect.svg?raw'
import revFreeDrawSvg from '../../svg/revFreeDraw.svg?raw'
import splineFitPointsSvg from '../../svg/spline/splineFitPoints.svg?raw'
import xlineSvg from '../../svg/xline.svg?raw'

const features = useSettings()
const { isDocumentOpening, openMode: docOpenMode } = useDocument()

const hostRef = ref<HTMLElement | null>(null)
let toolbar: AcUiToolbar | undefined
let unbindDoc: (() => void) | undefined

// Keep the bar on the left, or on the right while the palette covers the left.
const { refresh: refreshToolbarSide } = usePaletteToolbarAvoidance(
  hostRef,
  () => toolbar,
  {
    preferredSide: 'left',
    // A dragged bar the palette covers goes back to its edge; forget the spot.
    onFloatingReset: () => saveFloatingLayout(undefined)
  }
)

const markupVisible = ref(isMarkupVisible())
const measurementVisible = ref(isMeasurementVisible())
const readingModeEnabled = ref(false)

const syncMarkupVisibility = () => {
  markupVisible.value = isMarkupVisible()
}

const syncMeasurementVisibility = () => {
  measurementVisible.value = isMeasurementVisible()
}

const syncReadingMode = () => {
  try {
    readingModeEnabled.value = AcApDocManager.instance.isReadingModeEnabled()
  } catch {
    readingModeEnabled.value = false
  }
}

/**
 * Prefer AcApI18n; keys are resolved at runtime by AcUiToolbar. Its own chrome
 * keys (`toolbar.collapse`, `toolbar.move`, …) live under
 * `main.verticalToolbar.chrome`.
 */
const i18n = {
  t: (key: string) =>
    // eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys -- toolbar label keys are data-driven
    AcApI18n.t(
      key.startsWith('toolbar.')
        ? `main.verticalToolbar.chrome.${key.slice('toolbar.'.length)}`
        : key
    )
      // Ribbon labels wrap with "\n" (e.g. "DWG\nアタッチ"); tooltips are one line.
      .replace(/([\u3000-\u9fff\uff00-\uffef])\n(?=[\u3000-\u9fff\uff00-\uffef])/g, '$1')
      .replace(/\s*\n\s*/g, ' ')
}

/** Where the user dragged the toolbar to (and its orientation). */
const FLOATING_LAYOUT_STORAGE_KEY = 'ml-cad-viewer.toolbarLayout'

const loadFloatingLayout = (): AcUiToolbarFloatingLayout | undefined => {
  try {
    const raw = localStorage.getItem(FLOATING_LAYOUT_STORAGE_KEY)
    if (!raw) return undefined
    const value = JSON.parse(raw) as Partial<AcUiToolbarFloatingLayout>
    if (
      (value.orientation === 'vertical' ||
        value.orientation === 'horizontal') &&
      typeof value.x === 'number' &&
      typeof value.y === 'number'
    ) {
      return { orientation: value.orientation, x: value.x, y: value.y }
    }
  } catch {
    // Storage blocked or corrupt: start docked.
  }
  return undefined
}

const saveFloatingLayout = (layout: AcUiToolbarFloatingLayout | undefined) => {
  try {
    if (layout) {
      localStorage.setItem(FLOATING_LAYOUT_STORAGE_KEY, JSON.stringify(layout))
    } else {
      localStorage.removeItem(FLOATING_LAYOUT_STORAGE_KEY)
    }
  } catch {
    // Storage blocked: the layout just is not remembered.
  }
}

const handleLocaleChanged = () => {
  // vue-i18n is synced first (listener registered in locale/i18n.ts at module load).
  toolbar?.refreshLocale()
}

/**
 * Ribbon SVGs leave most shapes without a fill (the ribbon colours them via
 * CSS), which would render black here; default them to the text colour.
 */
const tinted = (svg: string) =>
  /^<svg\b[^>]*\sfill=/.test(svg)
    ? svg
    : svg.replace('<svg ', '<svg fill="currentColor" ')

const attachDwg = tinted(attachDwgSvg)
const attachImage = tinted(attachImageSvg)
const defineAttribute = tinted(defineAttributeSvg)
const editAttribute = tinted(editAttributeSvg)
const insertBlock = tinted(insertBlockSvg)

const arcThreePoints = tinted(arcThreePointsSvg)
const circleCenterRadius = tinted(circleCenterRadiusSvg)
const ellipseCenter = tinted(ellipseCenterSvg)
const hatch = tinted(hatchSvg)
const line = tinted(lineSvg)
const mline = tinted(mlineSvg)
const move = tinted(moveSvg)
const multiPoints = tinted(multiPointsSvg)
const offset = tinted(offsetSvg)
const polygon = tinted(polygonSvg)
const polyline = tinted(polylineSvg)
const ray = tinted(raySvg)
const rect = tinted(rectSvg)
const revFreeDraw = tinted(revFreeDrawSvg)
const splineFitPoints = tinted(splineFitPointsSvg)
const xline = tinted(xlineSvg)

/** Element Plus glyph (1024 viewBox) as markup, matching the ribbon icons. */
const epIcon = (d: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="${d}"/></svg>`

/** Element Plus RefreshRight / DocumentCopy / Delete, as used by the ribbon. */
const ICON_ROTATE = epIcon(
  'M784.512 230.272v-50.56a32 32 0 1 1 64 0v149.056a32 32 0 0 1-32 32H667.52a32 32 0 1 1 0-64h92.992A320 320 0 1 0 524.8 833.152a320 320 0 0 0 320-320h64a384 384 0 0 1-384 384 384 384 0 0 1-384-384 384 384 0 0 1 643.712-282.88'
)
const ICON_COPY = epIcon(
  'M128 320v576h576V320zm-32-64h640a32 32 0 0 1 32 32v640a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V288a32 32 0 0 1 32-32M960 96v704a32 32 0 0 1-32 32h-96v-64h64V128H384v64h-64V96a32 32 0 0 1 32-32h576a32 32 0 0 1 32 32M256 672h320v64H256zm0-192h320v64H256z'
)
const ICON_DELETE = epIcon(
  'M160 256H96a32 32 0 0 1 0-64h256V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64h-64v672a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32zm448-64v-64H416v64zM224 896h576V256H224zm192-128a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32m192 0a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32'
)

const toolbarSeparator = (): AcUiToolbarItem => ({
  id: `separator-${Math.random().toString(36).slice(2, 8)}`,
  type: 'separator'
})

const buildItems = (): AcUiToolbarItem[] => {
  const readingOn = readingModeEnabled.value
  const items: AcUiToolbarItem[] = [
    {
      id: 'select',
      label: 'main.verticalToolbar.select.text',
      icon: ICON_SELECT,
      command: 'select'
    },
    {
      id: 'pan',
      label: 'main.verticalToolbar.pan.text',
      icon: ICON_PAN,
      command: 'pan'
    },
    {
      id: 'draw',
      label: 'main.ribbon.group.draw',
      icon: line,
      childrenUi: 'toolbar',
      minOpenMode: AcEdOpenMode.Write,
      children: [
        {
          id: 'draw-line',
          label: 'main.ribbon.command.line',
          icon: line,
          command: 'line'
        },
        {
          id: 'draw-polyline',
          label: 'main.ribbon.command.polyline',
          icon: polyline,
          command: 'pline'
        },
        {
          id: 'draw-circle',
          label: 'main.ribbon.command.circle',
          icon: circleCenterRadius,
          command: 'circle'
        },
        {
          id: 'draw-arc',
          label: 'main.ribbon.command.arc',
          icon: arcThreePoints,
          command: 'arc'
        },
        {
          id: 'draw-rect',
          label: 'main.ribbon.command.rect',
          icon: rect,
          command: 'rectang'
        },
        {
          id: 'draw-polygon',
          label: 'main.ribbon.command.polygon',
          icon: polygon,
          command: 'polygon'
        },
        {
          id: 'draw-ellipse',
          label: 'main.ribbon.command.ellipse',
          icon: ellipseCenter,
          command: 'ellipse'
        },
        {
          id: 'draw-hatch',
          label: 'main.ribbon.command.hatch',
          icon: hatch,
          command: 'hatch'
        },
        // The ones the ribbon keeps in the Draw group's overflow menu.
        {
          id: 'draw-spline',
          label: 'main.ribbon.command.spline',
          icon: splineFitPoints,
          command: 'spline'
        },
        {
          id: 'draw-sketch',
          label: 'main.ribbon.command.sketch',
          icon: revFreeDraw,
          command: 'sketch'
        },
        {
          id: 'draw-revcloud',
          label: 'main.ribbon.command.revcloud',
          icon: ICON_REV_CLOUD,
          command: 'revcloud'
        },
        {
          id: 'draw-mline',
          label: 'main.ribbon.command.mline',
          icon: mline,
          command: 'mline'
        },
        {
          id: 'draw-ray',
          label: 'main.ribbon.command.ray',
          icon: ray,
          command: 'ray'
        },
        {
          id: 'draw-xline',
          label: 'main.ribbon.command.xline',
          icon: xline,
          command: 'xline'
        },
        {
          id: 'draw-point',
          label: 'main.ribbon.command.point',
          icon: multiPoints,
          command: 'point'
        }
      ]
    },
    {
      id: 'insert',
      label: 'main.ribbon.tab.insert',
      icon: insertBlock,
      childrenUi: 'toolbar',
      minOpenMode: AcEdOpenMode.Write,
      children: [
        {
          id: 'insert-block',
          label: 'main.ribbon.command.insert',
          icon: insertBlock,
          command: 'insert'
        },
        {
          id: 'insert-attdef',
          label: 'main.ribbon.command.defineAttribute',
          icon: defineAttribute,
          command: 'attdef'
        },
        {
          id: 'insert-attedit',
          label: 'main.ribbon.command.editAttributes',
          icon: editAttribute,
          command: 'attedit'
        },
        toolbarSeparator(),
        {
          id: 'insert-xattach',
          label: 'main.ribbon.command.attachDwg',
          icon: attachDwg,
          command: 'xattach'
        },
        {
          id: 'insert-imageattach',
          label: 'main.ribbon.command.attachImage',
          icon: attachImage,
          command: 'imageattach'
        }
      ]
    },
    {
      id: 'modify',
      label: 'main.ribbon.group.modify',
      icon: move,
      childrenUi: 'toolbar',
      minOpenMode: AcEdOpenMode.Write,
      children: [
        {
          id: 'modify-move',
          label: 'main.ribbon.command.move',
          icon: move,
          command: 'move'
        },
        {
          id: 'modify-rotate',
          label: 'main.ribbon.command.rotate',
          icon: ICON_ROTATE,
          command: 'rotate'
        },
        {
          id: 'modify-copy',
          label: 'main.ribbon.command.copy',
          icon: ICON_COPY,
          command: 'copy'
        },
        {
          id: 'modify-erase',
          label: 'main.ribbon.command.erase',
          icon: ICON_DELETE,
          command: 'erase'
        },
        {
          id: 'modify-offset',
          label: 'main.ribbon.command.offset',
          icon: offset,
          command: 'offset'
        }
      ]
    },
    {
      id: 'text',
      label: 'main.verticalToolbar.text.text',
      icon: ICON_TEXT,
      command: 'mtext',
      minOpenMode: AcEdOpenMode.Write
    },
    {
      id: 'zoom',
      label: 'main.verticalToolbar.zoom.text',
      icon: ICON_ZOOM_EXTENT,
      childrenUi: 'toolbar',
      childIcon: 'selected',
      selectedChildId: 'zoom-extent',
      children: [
        {
          id: 'zoom-saved',
          label: 'main.verticalToolbar.zoomSaved.text',
          icon: ICON_ZOOM_ORIGINAL,
          command: 'zoom\nsaved'
        },
        {
          id: 'zoom-extent',
          label: 'main.verticalToolbar.zoomToExtent.text',
          icon: ICON_ZOOM_EXTENT,
          command: 'zoom\nall'
        },
        {
          id: 'zoom-smart-extents',
          label: 'main.verticalToolbar.zoomSmartExtents.text',
          icon: ICON_ZOOM_SMART,
          command: 'zoom\nsmart'
        },
        {
          id: 'zoom-window',
          label: 'main.verticalToolbar.zoomToBox.text',
          icon: ICON_ZOOM_WINDOW,
          command: 'zoom\nwindow'
        }
      ]
    },
    {
      id: 'layer',
      label: 'main.verticalToolbar.layer.text',
      icon: ICON_LAYER,
      command: 'layer'
    },
    {
      id: 'switch-bg',
      label: 'main.verticalToolbar.switchBg.text',
      icon: ICON_SWITCH_BG,
      command: 'switchbg',
      disabled: () => readingModeEnabled.value
    },
    {
      id: 'reading-mode',
      label: 'main.verticalToolbar.readingMode.text',
      icon: ICON_READING_MODE,
      command: 'readingmode',
      toggle: {
        getValue: () => readingModeEnabled.value,
        on: { icon: ICON_READING_MODE },
        off: { icon: ICON_READING_MODE }
      }
    },
    {
      id: 'measure',
      label: 'main.verticalToolbar.measure.text',
      icon: ICON_MEASURE,
      childrenUi: 'sticky-toolbar',
      children: [
        {
          id: 'measure-distance',
          label: 'main.verticalToolbar.measureDistance.text',
          icon: ICON_MEASURE_DISTANCE,
          command: 'measuredistance'
        },
        {
          id: 'measure-continuous',
          label: 'main.verticalToolbar.measureContinuous.text',
          icon: ICON_MEASURE_CONTINUOUS,
          command: 'measurecontinuous'
        },
        {
          id: 'measure-angle',
          label: 'main.verticalToolbar.measureAngle.text',
          icon: ICON_MEASURE_ANGLE,
          command: 'measureangle'
        },
        {
          id: 'measure-area',
          label: 'main.verticalToolbar.measureArea.text',
          icon: ICON_MEASURE_AREA,
          command: 'measurearea'
        },
        {
          id: 'measure-arc',
          label: 'main.verticalToolbar.measureArc.text',
          icon: ICON_MEASURE_ARC,
          command: 'measurearc'
        },
        {
          id: 'measure-point',
          label: 'main.verticalToolbar.measurePoint.text',
          icon: ICON_MEASURE_POINT,
          command: 'measurepoint'
        },
        {
          id: 'measurement-panel',
          label: 'main.verticalToolbar.measurementPanel.text',
          icon: ICON_MEASUREMENT_PANEL,
          command: 'measurementpanel'
        },
        {
          id: 'measurement-vis',
          label: measurementVisible.value
            ? 'main.verticalToolbar.hideMeasurements.text'
            : 'main.verticalToolbar.showMeasurements.text',
          icon: measurementVisible.value
            ? ICON_ANNOTATION_HIDE
            : ICON_ANNOTATION_SHOW,
          command: 'measurementvis',
          toggle: {
            getValue: () => measurementVisible.value,
            on: {
              label: 'main.verticalToolbar.hideMeasurements.text',
              icon: ICON_ANNOTATION_HIDE
            },
            off: {
              label: 'main.verticalToolbar.showMeasurements.text',
              icon: ICON_ANNOTATION_SHOW
            }
          }
        },
        {
          id: 'clear-measurements',
          label: 'main.verticalToolbar.clearMeasurements.text',
          icon: ICON_CLEAR_MEASUREMENTS,
          command: 'clearmeasurements'
        },
        toolbarSeparator(),
        {
          id: 'measurement-import',
          label: 'main.verticalToolbar.measurementImport.text',
          icon: ICON_MARKUP_IMPORT,
          command: 'measurementimport'
        },
        {
          id: 'measurement-export',
          label: 'main.verticalToolbar.measurementExport.text',
          icon: ICON_MARKUP_EXPORT,
          command: 'measurementexport'
        }
      ]
    }
  ]

  items.push({
    id: 'annotation',
    label: 'main.verticalToolbar.annotation.text',
    icon: ICON_ANNOTATION,
    minOpenMode: AcEdOpenMode.Review,
    childrenUi: 'sticky-toolbar',
    children: [
      {
        id: 'markup-cloud',
        label: 'main.verticalToolbar.markupCloud.text',
        icon: ICON_REV_CLOUD,
        command: 'markupcloud'
      },
      {
        id: 'markup-callout',
        label: 'main.verticalToolbar.markupCallout.text',
        icon: ICON_MARKUP_CALLOUT,
        command: 'markupcallout'
      },
      {
        id: 'markup-text',
        label: 'main.verticalToolbar.markupText.text',
        icon: ICON_MARKUP_TEXT,
        command: 'markuptext'
      },
      {
        id: 'markup-rect',
        label: 'main.verticalToolbar.markupRect.text',
        icon: ICON_REV_RECT,
        command: 'markuprect'
      },
      {
        id: 'markup-circle',
        label: 'main.verticalToolbar.markupCircle.text',
        icon: ICON_REV_CIRCLE,
        command: 'markupcircle'
      },
      {
        id: 'markup-arrow',
        label: 'main.verticalToolbar.markupArrow.text',
        icon: ICON_MARKUP_ARROW,
        command: 'markuparrow'
      },
      {
        id: 'markup-stamp',
        label: 'main.verticalToolbar.markupStamp.text',
        icon: ICON_MARKUP_STAMP,
        command: 'markupstamp'
      },
      {
        id: 'markup-panel',
        label: 'main.verticalToolbar.markupPanel.text',
        icon: ICON_MARKUP_PANEL,
        command: 'markuppanel'
      },
      {
        id: 'markup-vis',
        label: markupVisible.value
          ? 'main.verticalToolbar.hideMarkup.text'
          : 'main.verticalToolbar.showMarkup.text',
        icon: markupVisible.value ? ICON_ANNOTATION_HIDE : ICON_ANNOTATION_SHOW,
        command: 'markupvis',
        toggle: {
          getValue: () => markupVisible.value,
          on: {
            label: 'main.verticalToolbar.hideMarkup.text',
            icon: ICON_ANNOTATION_HIDE
          },
          off: {
            label: 'main.verticalToolbar.showMarkup.text',
            icon: ICON_ANNOTATION_SHOW
          }
        }
      },
      {
        id: 'clear-markups',
        label: 'main.verticalToolbar.clearMarkups.text',
        icon: ICON_CLEAR_MARKUPS,
        command: 'clearmarkups'
      },
      toolbarSeparator(),
      {
        id: 'markup-import',
        label: 'main.verticalToolbar.markupImport.text',
        icon: ICON_MARKUP_IMPORT,
        command: 'markupimport'
      },
      {
        id: 'markup-export',
        label: 'main.verticalToolbar.markupExport.text',
        icon: ICON_MARKUP_EXPORT,
        command: 'markupexport'
      }
    ]
  })

  void readingOn
  void docOpenMode
  return items
}

const ensureToolbar = () => {
  const host = hostRef.value
  if (!host || toolbar) return
  toolbar = new AcUiToolbar({
    host,
    placement: 'left',
    edgeOffset: ML_TOOLBAR_EDGE_OFFSET,
    items: buildItems(),
    i18n,
    collapsible: true,
    // Drag the grip to move; sub-toolbars open toward the host centre.
    movable: true,
    floatingLayout: loadFloatingLayout(),
    onFloatingLayoutChange: layout => {
      saveFloatingLayout(layout)
      // A bar dropped onto the palette is put back on a free edge.
      refreshToolbarSide()
    },
    onCommand: command => {
      if (isDocumentOpening.value || !command) return
      if (command === 'switchbg' && readingModeEnabled.value) return
      AcApDocManager.instance.sendStringToExecute(command)
    }
  })
  unbindDoc = acapBindToolbarDocState(toolbar)
  // Re-measure after the host has a real canvas-sized box (see host CSS note).
  void nextTick(() => {
    toolbar?.refresh()
    refreshToolbarSide()
  })
}

const destroyToolbar = () => {
  unbindDoc?.()
  unbindDoc = undefined
  toolbar?.destroy()
  toolbar = undefined
}

const refreshToolbarItems = () => {
  toolbar?.updateItems(buildItems())
}

onMounted(() => {
  const docs = AcApDocManager.instance
  docs.editor.events.commandEnded.addEventListener(syncMarkupVisibility)
  docs.editor.events.commandEnded.addEventListener(syncMeasurementVisibility)
  docs.editor.events.commandEnded.addEventListener(syncReadingMode)
  docs.events.documentActivated.addEventListener(syncMarkupVisibility)
  docs.events.documentActivated.addEventListener(syncMeasurementVisibility)
  docs.events.documentActivated.addEventListener(syncReadingMode)
  AcApI18n.events.localeChanged.addEventListener(handleLocaleChanged)
  syncMarkupVisibility()
  syncMeasurementVisibility()
  syncReadingMode()

  if (features.isShowToolbar) {
    ensureToolbar()
  }
})

onUnmounted(() => {
  const docs = AcApDocManager.instance
  docs.editor.events.commandEnded.removeEventListener(syncMarkupVisibility)
  docs.editor.events.commandEnded.removeEventListener(syncMeasurementVisibility)
  docs.editor.events.commandEnded.removeEventListener(syncReadingMode)
  docs.events.documentActivated.removeEventListener(syncMarkupVisibility)
  docs.events.documentActivated.removeEventListener(syncMeasurementVisibility)
  docs.events.documentActivated.removeEventListener(syncReadingMode)
  AcApI18n.events.localeChanged.removeEventListener(handleLocaleChanged)
  destroyToolbar()
})

watch(
  () => features.isShowToolbar,
  show => {
    if (show) {
      ensureToolbar()
      refreshToolbarItems()
    } else {
      destroyToolbar()
    }
  }
)

watch(
  [markupVisible, measurementVisible, readingModeEnabled, docOpenMode],
  () => {
    refreshToolbarItems()
  }
)

watch(isDocumentOpening, opening => {
  toolbar?.setDocState({ isOpening: opening })
})
</script>

<template>
  <div
    ref="hostRef"
    class="ml-vertical-toolbar-host"
    :hidden="!features.isShowToolbar"
    aria-hidden="true"
  />
</template>

<style>
/*
 * Keep the overlay host filling the canvas main area so syncPosition can
 * vertically center the bar on the left edge (or place a dragged bar).
 */
.ml-vertical-toolbar-host,
.ml-vertical-toolbar-host.ml-ex-ui-toolbar-host {
  position: absolute;
  /* Same box as the canvas: keep the bar out from under a docked palette. */
  inset: var(--ml-palette-dock-top, 0) var(--ml-palette-dock-right, 0)
    var(--ml-palette-dock-bottom, 0) var(--ml-palette-dock-left, 0);
  width: auto;
  height: auto;
  z-index: 3;
  pointer-events: none;
}

.ml-vertical-toolbar-host .ml-ex-ui-toolbar,
.ml-vertical-toolbar-host .ml-ex-ui-subtoolbar,
.ml-vertical-toolbar-host .ml-ex-ui-dropdown {
  pointer-events: auto;
}
</style>
