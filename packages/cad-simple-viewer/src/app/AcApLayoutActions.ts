import { PAPER_SIZES, sheetFromLimits } from '@mlightcad/cad-export-model'
import {
  AcCmEventManager,
  AcDbBlockTableRecord,
  AcDbDatabase,
  AcDbEntity,
  acdbHostApplicationServices,
  AcDbLayout,
  AcDbObjectId,
  AcDbPlotPaperUnits,
  AcDbPlotRotation,
  AcDbPlotType,
  AcGeBox2d,
  AcGePoint2d
} from '@mlightcad/data-model'

import { AcApI18n } from '../i18n/AcApI18n'
import type { AcApPaperName } from './AcApDrawingSheet'

/**
 * Operations on the layout tabs (AutoCAD's tab right-click menu): new,
 * copy, rename, delete, move and page setup.
 *
 * The model layout (tab order 0) is never renamed, copied, moved or
 * deleted, and at least one paper layout always remains. Layout edits
 * are not undo steps yet.
 */

/** Paper and orientation of a layout. */
export interface AcApLayoutPageSetup {
  paper: AcApPaperName
  portrait: boolean
}

/** Papers offered by the page setup. */
export const ACAP_LAYOUT_PAPERS = Object.keys(PAPER_SIZES) as AcApPaperName[]

/** Size of a paper in millimetres, landscape (`[long side, short side]`). */
export function acapPaperSize(paper: AcApPaperName): [number, number] {
  const [long, short] = PAPER_SIZES[paper]
  return [long, short]
}

/** Default page setup of a new layout (A3 landscape). */
export const ACAP_DEFAULT_LAYOUT_PAGE_SETUP: AcApLayoutPageSetup = {
  paper: 'A3',
  portrait: false
}

export interface AcApLayoutsChangedEventArgs {
  database: AcDbDatabase
}

/** Events of the layout tab operations. */
export const acapLayoutEvents = {
  /**
   * Layouts were added, removed, renamed, reordered or got a new page setup
   * through these operations.
   */
  layoutsChanged: new AcCmEventManager<AcApLayoutsChangedEventArgs>()
}

/** Why a layout could not be renamed / created with a name. */
export type AcApLayoutNameError = 'empty' | 'invalid' | 'exists'

/** Characters AutoCAD does not allow in layout names. */
const INVALID_NAME_CHARS = /[<>/\\":;?*|,=`]/

/**
 * Layouts of a database in tab order, one per space (the layout dictionary can
 * hold alias keys for the same layout).
 */
export function acapListLayouts(db: AcDbDatabase): AcDbLayout[] {
  const seen = new Set<AcDbObjectId>()
  const layouts: AcDbLayout[] = []
  for (const layout of db.objects.layout.newIterator()) {
    const btrId = layout.blockTableRecordId
    if (!btrId || seen.has(btrId)) continue
    seen.add(btrId)
    layouts.push(layout)
  }
  return layouts.sort((a, b) => a.tabOrder - b.tabOrder)
}

/** Whether the layout is the model layout. */
export function acapIsModelLayout(db: AcDbDatabase, layout: AcDbLayout) {
  return (
    layout.blockTableRecordId === db.tables.blockTable.modelSpace.objectId ||
    layout.tabOrder === 0
  )
}

/** Paper layouts in tab order. */
function paperLayouts(db: AcDbDatabase) {
  return acapListLayouts(db).filter(layout => !acapIsModelLayout(db, layout))
}

/** Whether a layout name is already used (case-insensitive like AutoCAD). */
function nameExists(db: AcDbDatabase, name: string, except?: AcDbLayout) {
  const lower = name.toLowerCase()
  for (const [key, layout] of db.objects.layout.entries()) {
    if (layout === except) continue
    if (
      key.toLowerCase() === lower ||
      layout.layoutName.toLowerCase() === lower
    ) {
      return true
    }
  }
  return false
}

/** Checks a layout name; `undefined` when it can be used. */
export function acapValidateLayoutName(
  db: AcDbDatabase,
  name: string,
  except?: AcDbLayout
): AcApLayoutNameError | undefined {
  const trimmed = name.trim()
  if (!trimmed) return 'empty'
  if (INVALID_NAME_CHARS.test(trimmed) || trimmed.length > 255) {
    return 'invalid'
  }
  // `Model` is reserved for the model layout.
  if (trimmed.toLowerCase() === 'model') return 'exists'
  if (nameExists(db, trimmed, except)) return 'exists'
  return undefined
}

/**
 * First free name `<prefix><n>` (`印刷ページ3`); the prefix is the localized
 * layout name of new drawings unless given.
 */
export function acapNextLayoutName(db: AcDbDatabase, prefix?: string) {
  const base =
    prefix ?? AcApI18n.t('main.newDrawing.layoutPrefix', { fallback: 'Layout' })
  for (let n = 1; ; n += 1) {
    const name = `${base}${n}`
    if (!acapValidateLayoutName(db, name)) return name
  }
}

/** Name of a copy: `印刷ページ1 (2)`, `印刷ページ1 (3)`, … */
function copyName(db: AcDbDatabase, source: string) {
  const base = source.replace(/\s*\(\d+\)$/, '')
  for (let n = 2; ; n += 1) {
    const name = `${base} (${n})`
    if (!acapValidateLayoutName(db, name)) return name
  }
}

/** Unused `*Paper_SpaceN` block name. */
function paperSpaceBlockName(db: AcDbDatabase) {
  const blocks = db.tables.blockTable
  for (let n = 0; ; n += 1) {
    const name = `*Paper_Space${n}`
    if (!blocks.has(name)) return name
  }
}

/** Gives the paper layouts tab orders 1, 2, … in the given order. */
function renumber(db: AcDbDatabase, ordered: AcDbLayout[]) {
  ordered.forEach((layout, index) => {
    layout.tabOrder = index + 1
  })
  for (const layout of acapListLayouts(db)) {
    if (acapIsModelLayout(db, layout)) layout.tabOrder = 0
  }
}

/**
 * Millimetres per paper space unit of a layout: paper space is measured in
 * the layout's plot paper units (inches or millimetres).
 */
function mmPerPaperUnit(layout: AcDbLayout) {
  return layout.plotPaperUnits === AcDbPlotPaperUnits.kInches ? 25.4 : 1
}

/**
 * Applies a page setup to a layout object (no events). The paper keeps its
 * lower-left corner (the limits) so it stays under what is drawn.
 */
function applyPageSetup(layout: AcDbLayout, setup: AcApLayoutPageSetup) {
  const [long, short] = PAPER_SIZES[setup.paper]
  const width = setup.portrait ? short : long
  const height = setup.portrait ? long : short
  // Keep inch layouts in inches (their content is drawn in inches).
  const unit = mmPerPaperUnit(layout)
  const old = layout.limits
  const origin =
    old && !old.isEmpty() && Number.isFinite(old.min.x + old.min.y)
      ? new AcGePoint2d(old.min.x, old.min.y)
      : new AcGePoint2d(0, 0)
  layout.plotPaperUnits =
    unit === 1 ? AcDbPlotPaperUnits.kMillimeters : AcDbPlotPaperUnits.kInches
  layout.plotPaperSize = new AcGePoint2d(width, height)
  layout.plotRotation = AcDbPlotRotation.k0degrees
  layout.plotType = AcDbPlotType.kLayout
  layout.canonicalMediaName = `ISO_full_bleed_${setup.paper}_(${width.toFixed(
    2
  )}_x_${height.toFixed(2)}_MM)`
  layout.limits = new AcGeBox2d(
    origin,
    new AcGePoint2d(origin.x + width / unit, origin.y + height / unit)
  )
}

/**
 * Page setup of a layout, read from its limits (the paper in paper space),
 * else its plot paper size. `undefined` when neither is an A sheet.
 */
export function acapGetLayoutPageSetup(
  layout: AcDbLayout
): AcApLayoutPageSetup | undefined {
  const unit = mmPerPaperUnit(layout)
  const limits = layout.limits
  if (limits && !limits.isEmpty()) {
    const sheet = sheetFromLimits({
      min: [limits.min.x * unit, limits.min.y * unit],
      max: [limits.max.x * unit, limits.max.y * unit]
    })
    if (sheet && Math.abs(sheet.scale - 1) < 1e-3) {
      return { paper: sheet.paper, portrait: sheet.portrait }
    }
  }
  const size = layout.plotPaperSize
  if (size && size.x > 0 && size.y > 0) {
    const toMm = layout.plotPaperUnits === AcDbPlotPaperUnits.kInches ? 25.4 : 1
    const rotated =
      layout.plotRotation === AcDbPlotRotation.k90degrees ||
      layout.plotRotation === AcDbPlotRotation.k270degrees
    const w = (rotated ? size.y : size.x) * toMm
    const h = (rotated ? size.x : size.y) * toMm
    const sheet = sheetFromLimits({ min: [0, 0], max: [w, h] })
    if (sheet && Math.abs(sheet.scale - 1) < 1e-2) {
      return { paper: sheet.paper, portrait: sheet.portrait }
    }
  }
  return undefined
}

/** Sets the paper and orientation of a layout. */
export function acapSetLayoutPageSetup(
  db: AcDbDatabase,
  layout: AcDbLayout,
  setup: AcApLayoutPageSetup
) {
  applyPageSetup(layout, setup)
  acapLayoutEvents.layoutsChanged.dispatch({ database: db })
}

/** Adds a layout object with its own paper space block (no switch). */
function addLayout(
  db: AcDbDatabase,
  layout: AcDbLayout,
  name: string,
  insertAfter?: AcDbLayout
) {
  const ordered = paperLayouts(db)
  const btr = new AcDbBlockTableRecord()
  btr.name = paperSpaceBlockName(db)
  db.tables.blockTable.add(btr)

  layout.layoutName = name
  layout.blockTableRecordId = btr.objectId
  layout.viewportArray = []
  layout.tabSelected = false
  db.objects.layout.setAt(name, layout)
  btr.layoutId = layout.objectId

  const index = insertAfter ? ordered.indexOf(insertAfter) : -1
  ordered.splice(index >= 0 ? index + 1 : ordered.length, 0, layout)
  renumber(db, ordered)

  acdbHostApplicationServices().layoutManager.events.layoutCreated.dispatch({
    layout
  })
  acapLayoutEvents.layoutsChanged.dispatch({ database: db })
  return btr
}

/**
 * Creates a paper layout at the end of the tabs. The page setup is copied
 * from the last paper layout when it has one, else A3 landscape.
 */
export function acapCreateLayout(
  db: AcDbDatabase,
  name = acapNextLayoutName(db),
  setup?: AcApLayoutPageSetup
): AcDbLayout {
  const error = acapValidateLayoutName(db, name)
  if (error) throw new Error(`Invalid layout name "${name}": ${error}`)
  const last = paperLayouts(db).pop()
  const layout = new AcDbLayout()
  layout.modelType = false
  layout.plotPaperUnits = AcDbPlotPaperUnits.kMillimeters
  applyPageSetup(
    layout,
    setup ??
      (last && acapGetLayoutPageSetup(last)) ??
      ACAP_DEFAULT_LAYOUT_PAGE_SETUP
  )
  addLayout(db, layout, name.trim())
  return layout
}

/**
 * Copies a paper layout (page setup and everything drawn on it) and puts the
 * copy right after it.
 */
export function acapCopyLayout(
  db: AcDbDatabase,
  source: AcDbLayout,
  name = copyName(db, source.layoutName)
): AcDbLayout {
  if (acapIsModelLayout(db, source)) {
    throw new Error('The model layout cannot be copied')
  }
  const error = acapValidateLayoutName(db, name)
  if (error) throw new Error(`Invalid layout name "${name}": ${error}`)
  const layout = source.clone()
  const btr = addLayout(db, layout, name.trim(), source)

  const sourceBtr = db.tables.blockTable.getIdAt(source.blockTableRecordId)
  if (sourceBtr) {
    const clones: AcDbEntity[] = []
    for (const entity of sourceBtr.newIterator()) {
      clones.push(entity.clone())
    }
    if (clones.length) btr.appendEntity(clones)
  }
  return layout
}

/** Renames a layout. Returns the reason when the name cannot be used. */
export function acapRenameLayout(
  db: AcDbDatabase,
  layout: AcDbLayout,
  newName: string
): AcApLayoutNameError | undefined {
  if (acapIsModelLayout(db, layout)) return 'invalid'
  const name = newName.trim()
  if (name === layout.layoutName) return undefined
  // Changing only the letter case keeps the same entry.
  const error =
    name.toLowerCase() === layout.layoutName.toLowerCase() && name
      ? undefined
      : acapValidateLayoutName(db, name, layout)
  if (error) return error

  const oldName = layout.layoutName
  // Re-key the dictionary entry (keeping the order and the object id) so the
  // layout is found and saved under its new name.
  const dict = db.objects.layout as unknown as {
    _recordsByName?: Map<string, AcDbLayout>
  }
  const records = dict._recordsByName
  if (records instanceof Map) {
    const entries = [...records.entries()].filter(
      ([key, value]) => value !== layout || key === oldName
    )
    records.clear()
    for (const [key, value] of entries) {
      records.set(value === layout ? name : key, value)
    }
  }
  layout.layoutName = name
  acdbHostApplicationServices().layoutManager.events.layoutRenamed.dispatch({
    layout,
    oldName,
    newName: name
  })
  acapLayoutEvents.layoutsChanged.dispatch({ database: db })
  return undefined
}

/** Whether a layout can be deleted (paper layouts while another remains). */
export function acapCanDeleteLayout(db: AcDbDatabase, layout: AcDbLayout) {
  return !acapIsModelLayout(db, layout) && paperLayouts(db).length > 1
}

/**
 * Deletes a paper layout and what is drawn on it. When it is the current
 * layout, the tab next to it becomes current first.
 */
export function acapDeleteLayout(db: AcDbDatabase, layout: AcDbLayout) {
  if (!acapCanDeleteLayout(db, layout)) return false
  const ordered = paperLayouts(db)
  const index = ordered.indexOf(layout)
  const btrId = layout.blockTableRecordId
  const manager = acdbHostApplicationServices().layoutManager

  if (db.currentSpaceId === btrId) {
    const next = ordered[index + 1] ?? ordered[index - 1]
    manager.setCurrentLayoutBtrId(next.blockTableRecordId, db)
  }

  const dict = db.objects.layout
  const keys = [...dict.entries()]
    .filter(([, value]) => value === layout)
    .map(([key]) => key)
  for (const key of keys) dict.remove(key)
  db.tables.blockTable.removeId(btrId)

  ordered.splice(index, 1)
  renumber(db, ordered)
  manager.events.layoutRemoved.dispatch({ layout })
  acapLayoutEvents.layoutsChanged.dispatch({ database: db })
  return true
}

/**
 * Moves a paper layout to `index` among the paper layouts (0 = right after
 * the model tab).
 */
export function acapMoveLayout(
  db: AcDbDatabase,
  layout: AcDbLayout,
  index: number
) {
  if (acapIsModelLayout(db, layout)) return false
  const ordered = paperLayouts(db)
  const from = ordered.indexOf(layout)
  if (from < 0) return false
  const to = Math.max(0, Math.min(index, ordered.length - 1))
  if (from === to) return false
  ordered.splice(from, 1)
  ordered.splice(to, 0, layout)
  renumber(db, ordered)
  acapLayoutEvents.layoutsChanged.dispatch({ database: db })
  return true
}

/** Makes a layout current. */
export function acapActivateLayout(db: AcDbDatabase, layout: AcDbLayout) {
  return acdbHostApplicationServices().layoutManager.setCurrentLayoutBtrId(
    layout.blockTableRecordId,
    db
  )
}
