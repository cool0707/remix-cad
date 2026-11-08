import {
  AcApConvertToDxfCmd,
  AcApDocManager,
  acapDrawingExporters,
  AcApOpenCmd,
  AcApQNewCmd,
  acapRunDataSourceMenuAction
} from '@mlightcad/cad-simple-viewer'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useDataSources } from './useDataSources'

/** One entry of the File menu (ribbon) and the main menu (top bar). */
export interface MlFileMenuItem {
  /** Passed to {@link MlFileMenuApi.run} */
  id: string
  label: string
  /** Draws a separator above the item */
  divided?: boolean
  children?: MlFileMenuItem[]
}

/** Export entries: the ids {@link MlFileMenuApi.run} turns into exports. */
const EXPORT_IDS = new Set([
  'Convert',
  'ExportHtml',
  'ExportPdf',
  'ExportSvg',
  'ExportImage',
  'PngOut'
])

const isExportId = (id: string) =>
  EXPORT_IDS.has(id) || id.startsWith('ExportFormat:')

/**
 * Items and actions of the File menu, shared by the ribbon (CAD profile) and
 * the top bar's main menu (simple profile): new, open (with the cloud
 * sources), drawing units, export, settings and about.
 */
export function useFileMenu() {
  const { t, locale } = useI18n()
  const { menuItems: dataSourceMenuItems, isSingleLocalOpen } =
    useDataSources()

  /** The Export submenu (empty when exporting is turned off). */
  const exportItems = computed<MlFileMenuItem[]>(() => {
    locale.value
    if (AcApDocManager.instance.disableExport) return []
    return [
      { id: 'Convert', label: t('main.mainMenu.export') },
      // CAD formats registered by the application (JWW, SFC, P21) follow
      // DXF.
      ...acapDrawingExporters().map(exporter => ({
        id: `ExportFormat:${exporter.command}`,
        label: t('main.mainMenu.exportAs', { format: exporter.formatName })
      })),
      { id: 'ExportHtml', label: t('main.mainMenu.exportHtml') },
      { id: 'ExportPdf', label: t('main.mainMenu.exportPdf') },
      { id: 'ExportSvg', label: t('main.mainMenu.exportSvg') },
      { id: 'ExportImage', label: t('main.mainMenu.exportImage') },
      { id: 'PngOut', label: t('main.mainMenu.exportImageArea') }
    ]
  })

  /** New / Open (with the cloud sources). */
  const openItems = computed<MlFileMenuItem[]>(() => {
    locale.value
    const open: MlFileMenuItem = isSingleLocalOpen.value
      ? { id: 'Open', label: t('main.mainMenu.open') }
      : {
          id: 'Open',
          label: t('main.mainMenu.open'),
          children: dataSourceMenuItems.value.map(item => ({
            id: `ds:${item.id}`,
            label: item.label
          }))
        }
    return [{ id: 'QNew', label: t('main.mainMenu.new') }, open]
  })

  /** The ribbon's File menu. */
  const fileMenuItems = computed<MlFileMenuItem[]>(() => {
    locale.value
    const items: MlFileMenuItem[] = [
      ...openItems.value,
      { id: 'DrawingUnits', label: t('main.mainMenu.drawingUnits') }
    ]
    if (exportItems.value.length) {
      items.push({
        id: 'Export',
        label: t('main.mainMenu.exportMenu'),
        divided: true,
        children: exportItems.value
      })
    }
    items.push(
      { id: 'Settings', label: t('main.mainMenu.settings'), divided: true },
      { id: 'About', label: t('main.mainMenu.about'), divided: true }
    )
    return items
  })

  /**
   * Runs a File menu entry.
   *
   * @returns Whether the id was a File menu entry.
   */
  const run = (id: string): boolean => {
    const docManager = AcApDocManager.instance
    if (docManager.disableExport && isExportId(id)) return true
    if (id === 'Convert') {
      new AcApConvertToDxfCmd().trigger(docManager.context)
    } else if (id === 'ExportHtml') {
      docManager.sendStringToExecute('chtml')
    } else if (id === 'ExportPdf') {
      // Same path as chtml/csvg: DocManager lazy-loads the plugin then runs
      // cpdf. Avoid a separate await+execute that raced Vite's first-time
      // pdf-lib optimize.
      docManager.sendStringToExecute('cpdf')
    } else if (id === 'ExportSvg') {
      docManager.sendStringToExecute('csvg')
    } else if (id === 'ExportImage') {
      docManager.sendStringToExecute('cimage')
    } else if (id === 'PngOut') {
      docManager.sendStringToExecute('pngout')
    } else if (id.startsWith('ExportFormat:')) {
      docManager.sendStringToExecute(id.slice('ExportFormat:'.length))
    } else if (id === 'QNew') {
      new AcApQNewCmd().trigger(docManager.context)
    } else if (id === 'Open') {
      new AcApOpenCmd().trigger(docManager.context)
    } else if (id.startsWith('ds:')) {
      const itemId = id.slice(3)
      const item = dataSourceMenuItems.value.find(i => i.id === itemId)
      if (item) void acapRunDataSourceMenuAction(item)
    } else if (id === 'DrawingUnits') {
      docManager.sendStringToExecute('units')
    } else if (id === 'Settings') {
      docManager.sendStringToExecute('options')
    } else if (id === 'About') {
      docManager.sendStringToExecute('about')
    } else {
      return false
    }
    return true
  }

  return { fileMenuItems, openItems, exportItems, run }
}

/** Return type of {@link useFileMenu}. */
export type MlFileMenuApi = ReturnType<typeof useFileMenu>
