import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import { uploadFixture } from '../helpers/fileUpload'
import { useCadProfile } from '../helpers/operationProfile'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const fixture = (name: string) =>
  path.resolve(currentDir, '..', 'fixtures', name)
/**
 * Two DOOR symbols (a 20 × 20 square, inserted at x = 0 and x = 40) on layer
 * DOORS, with the properties MARK, WIDTH and the hidden MAKER. Two lines on
 * layer 0 below them (y = -20 and y = -30): entities on layer 0 outside of
 * any symbol.
 */
const doorsPath = fixture('symbol-attributes.dxf')
/** One symbol on layer SYMBOL; nothing on layer 0 outside of it. */
const symbolOnlyPath = fixture('multi-layer-symbol.dxf')

let viewerModuleUrl: string | undefined

test.beforeEach(async ({ page }) => {
  viewerModuleUrl = undefined
  page.on('request', request => {
    if (
      /cad-simple-viewer\/(src\/index\.ts|dist\/cad-simple-viewer\.js)/.test(
        request.url()
      )
    ) {
      viewerModuleUrl = request.url()
    }
  })
})

async function load(page: Page, filePath: string) {
  await page.goto('/')
  await uploadFixture(page, filePath, { accessMode: 'Write' })
  await expect(page.locator('.ml-cad-container')).toBeVisible({
    timeout: 30000
  })
  await page.waitForTimeout(2500)
  await waitUntilDrawn(page)
}

async function waitUntilDrawn(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(async url => {
        const mod = await import(/* @vite-ignore */ url)
        return mod.AcApDocManager.instance.curView
          .isProcessingEntities as boolean
      }, viewerModuleUrl!)
    )
    .toBe(false)
}

interface LineInfo {
  x1: number
  y1: number
  x2: number
  y2: number
}

/** What is on the canvas, inside the DOOR symbol, and the editing state. */
async function drawingState(page: Page) {
  return page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    const docs = mod.AcApDocManager.instance
    const db = docs.curDocument.database
    const round = (value: number) => Math.round(value * 1000) / 1000
    const lines = (owner: { newIterator(): Iterable<unknown> }) => {
      const result: LineInfo[] = []
      for (const entity of owner.newIterator()) {
        const line = entity as {
          type: string
          startPoint: { x: number; y: number }
          endPoint: { x: number; y: number }
        }
        if (line.type !== 'Line') continue
        result.push({
          x1: round(line.startPoint.x),
          y1: round(line.startPoint.y),
          x2: round(line.endPoint.x),
          y2: round(line.endPoint.y)
        })
      }
      return result
    }
    const model = db.tables.blockTable.modelSpace
    const symbols: Record<string, string>[] = []
    for (const entity of model.newIterator()) {
      if (entity.type !== 'BlockReference') continue
      const properties: Record<string, string> = {}
      for (const attribute of entity.attributeIterator()) {
        properties[attribute.tag] = attribute.textString
      }
      symbols.push(properties)
    }
    const door = db.tables.blockTable.getAt('DOOR')
    return {
      canvasLines: lines(model),
      doorLines: door ? lines(door) : [],
      symbols,
      path: (docs.curView.symbolEdit.path as { name: string }[]).map(
        item => item.name
      ),
      selected: docs.curView.selectionSet.count as number,
      currentLayer: db.clayer as string,
      layers: [...db.tables.layerTable.newIterator()].map(
        (layer: { name: string }) => layer.name
      )
    }
  }, viewerModuleUrl!)
}

async function clientPoint(page: Page, point: { x: number; y: number }) {
  return page.evaluate(
    async ({ url, point }) => {
      const mod = await import(/* @vite-ignore */ url)
      const view = mod.AcApDocManager.instance.curView
      const rect = view.canvas.getBoundingClientRect()
      const screen = view.worldToScreen(point)
      return { x: rect.left + screen.x, y: rect.top + screen.y }
    },
    { url: viewerModuleUrl!, point }
  )
}

async function clickAt(page: Page, point: { x: number; y: number }) {
  const client = await clientPoint(page, point)
  await page.mouse.click(client.x, client.y)
  await page.waitForTimeout(250)
}

async function doubleClickAt(page: Page, point: { x: number; y: number }) {
  const client = await clientPoint(page, point)
  await page.mouse.dblclick(client.x, client.y)
  await page.waitForTimeout(600)
}

async function undo(page: Page) {
  await page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    mod.AcApDocManager.instance.sendStringToExecute('undo')
  }, viewerModuleUrl!)
  await page.waitForTimeout(400)
}

const bar = (page: Page) => page.locator('.ml-symbol-edit-bar')
const inspector = (page: Page) => page.locator('.ml-entity-properties')
const layerRows = (page: Page) =>
  page.locator('.ml-layer-manager-panel .el-table__row')

/** The left edge of the first door: a line of the symbol, not a property. */
const DOOR_EDGE = { x: 0, y: 10 }
/** The left edge of the second door. */
const OTHER_DOOR_EDGE = { x: 40, y: 10 }

const hasLine = (lines: LineInfo[], line: LineInfo) =>
  lines.some(
    candidate =>
      (candidate.x1 === line.x1 &&
        candidate.y1 === line.y1 &&
        candidate.x2 === line.x2 &&
        candidate.y2 === line.y2) ||
      (candidate.x1 === line.x2 &&
        candidate.y1 === line.y2 &&
        candidate.x2 === line.x1 &&
        candidate.y2 === line.y1)
  )

test('double-click enters a symbol; edits reach every copy; one undo takes the visit back', async ({
  page
}) => {
  await load(page, doorsPath)
  const before = await drawingState(page)
  expect(before.doorLines).toHaveLength(4)
  expect(before.canvasLines).toHaveLength(2)

  await doubleClickAt(page, DOOR_EDGE)
  await expect(bar(page)).toBeVisible()
  await expect(bar(page)).toContainText('Canvas')
  await expect(bar(page).locator('.is-current')).toHaveText('DOOR')
  await expect(inspector(page)).toContainText('Editing symbol "DOOR"')
  await waitUntilDrawn(page)

  // The contents stand on the canvas, at the place of the entered door.
  const inside = await drawingState(page)
  expect(inside.path).toEqual(['DOOR'])
  expect(inside.canvasLines).toHaveLength(6)
  expect(hasLine(inside.canvasLines, { x1: 0, y1: 0, x2: 0, y2: 20 })).toBe(
    true
  )
  // The definition itself is untouched until the symbol is left.
  expect(inside.doorLines).toEqual(before.doorLines)

  // The other door is dimmed and cannot be selected.
  await clickAt(page, OTHER_DOOR_EDGE)
  expect((await drawingState(page)).selected).toBe(0)

  // Delete the top edge, draw a diagonal.
  await clickAt(page, { x: 10, y: 20 })
  await expect.poll(async () => (await drawingState(page)).selected).toBe(1)
  await page.keyboard.press('Delete')
  await page.waitForTimeout(300)
  expect((await drawingState(page)).canvasLines).toHaveLength(5)
  await page.keyboard.press('KeyL')
  await clickAt(page, { x: 6, y: 4 })
  await clickAt(page, { x: 16, y: 12 })
  await expect
    .poll(async () => (await drawingState(page)).canvasLines.length)
    .toBe(6)

  // Undo works step by step inside ...
  await undo(page)
  expect((await drawingState(page)).canvasLines).toHaveLength(5)
  await undo(page)
  expect((await drawingState(page)).canvasLines).toHaveLength(6)
  // ... but not past the moment the symbol was entered.
  await undo(page)
  const stillInside = await drawingState(page)
  expect(stillInside.path).toEqual(['DOOR'])
  expect(stillInside.canvasLines).toHaveLength(6)

  // Take the bottom edge away and leave.
  await clickAt(page, { x: 10, y: 0 })
  await expect.poll(async () => (await drawingState(page)).selected).toBe(1)
  await page.keyboard.press('Delete')
  await page.waitForTimeout(300)
  await bar(page).getByRole('button', { name: 'Done' }).click()
  await expect(bar(page)).toBeHidden()
  await waitUntilDrawn(page)

  const after = await drawingState(page)
  expect(after.path).toEqual([])
  // Only the canvas' own lines are left on it.
  expect(after.canvasLines).toEqual(before.canvasLines)
  expect(after.doorLines).toHaveLength(3)
  expect(hasLine(after.doorLines, { x1: 0, y1: 0, x2: 20, y2: 0 })).toBe(false)
  expect(hasLine(after.doorLines, { x1: 0, y1: 0, x2: 0, y2: 20 })).toBe(true)
  // Both doors keep their property values.
  expect(after.symbols.map(symbol => symbol.MARK)).toEqual(['D1', 'D2'])
  // The door that was entered is selected again.
  expect(after.selected).toBe(1)

  // One undo takes the whole visit back.
  await undo(page)
  const undone = await drawingState(page)
  expect(undone.doorLines).toHaveLength(4)
  expect(hasLine(undone.doorLines, { x1: 0, y1: 0, x2: 20, y2: 0 })).toBe(true)
  expect(undone.canvasLines).toEqual(before.canvasLines)
})

test('the inspector button enters; Esc, the breadcrumb and a double-click outside leave', async ({
  page
}) => {
  await load(page, doorsPath)

  await clickAt(page, DOOR_EDGE)
  await expect.poll(async () => (await drawingState(page)).selected).toBe(1)
  const editButton = page.locator('[data-testid="inspector-edit-symbol"]')
  await editButton.scrollIntoViewIfNeeded()
  await editButton.click()
  await expect(bar(page)).toBeVisible()

  // Esc with nothing selected steps out.
  await page.locator('.ml-cad-container canvas').first().hover()
  await clickAt(page, { x: 10, y: 20 })
  await page.keyboard.press('Escape')
  await expect(bar(page)).toBeVisible()
  expect((await drawingState(page)).selected).toBe(0)
  await page.keyboard.press('Escape')
  await expect(bar(page)).toBeHidden()

  // The right-click menu offers it for a symbol.
  const edge = await clientPoint(page, DOOR_EDGE)
  await page.mouse.click(edge.x, edge.y, { button: 'right' })
  await page
    .locator('.ml-context-menu-item', { hasText: 'Edit symbol' })
    .click()
  await expect(bar(page)).toBeVisible()
  await bar(page).getByRole('button', { name: 'Canvas' }).click()
  await expect(bar(page)).toBeHidden()

  // Double-click beside the contents.
  await doubleClickAt(page, DOOR_EDGE)
  await expect(bar(page)).toBeVisible()
  await doubleClickAt(page, { x: 30, y: 10 })
  await expect(bar(page)).toBeHidden()

  // Nothing was edited: the symbol is as it was, and nothing is left behind.
  const state = await drawingState(page)
  expect(state.doorLines).toHaveLength(4)
  expect(state.canvasLines).toHaveLength(2)
})

test('double-clicking the text of a symbol property still goes to its field', async ({
  page
}) => {
  await load(page, doorsPath)
  await page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    mod.AcApDocManager.instance.sendStringToExecute('find')
  }, viewerModuleUrl!)
  await expect(page.locator('.ml-overflow-tab.is-active')).toContainText(
    'Find'
  )

  // "D1" is drawn from (2, 14), 2 high: on the stem of the D.
  await doubleClickAt(page, { x: 2.2, y: 15 })
  await expect(bar(page)).toBeHidden()
  await expect(page.locator('.ml-overflow-tab.is-active')).toContainText(
    'Properties'
  )
  await expect(
    inspector(page).locator('[data-symbol-tag="MARK"] input')
  ).toBeFocused()
})

test('a property added inside a symbol appears on every copy', async ({
  page
}) => {
  await load(page, doorsPath)
  await doubleClickAt(page, DOOR_EDGE)
  await expect(bar(page)).toBeVisible()

  await page.locator('[data-testid="inspector-add-symbol-property"]').click()
  const dialog = page.locator('.ml-base-dialog', {
    hasText: 'Symbol Property Definition'
  })
  await expect(dialog).toBeVisible()
  const fields = dialog.locator('input[type="text"]')
  await fields.nth(0).fill('NOTE')
  await fields.nth(1).fill('Note')
  await fields.nth(2).fill('new')
  await dialog.getByRole('button', { name: 'OK' }).click()
  // Place it on screen.
  await clickAt(page, { x: 4, y: 4 })
  await page.waitForTimeout(400)

  await page.locator('[data-testid="inspector-finish-symbol-edit"]').click()
  await expect(bar(page)).toBeHidden()
  await waitUntilDrawn(page)

  const state = await drawingState(page)
  expect(state.symbols).toEqual([
    { MARK: 'D1', WIDTH: '800', MAKER: 'ACME', NOTE: 'new' },
    { MARK: 'D2', WIDTH: '800', MAKER: 'ACME', NOTE: 'new' }
  ])
  // The door that was entered is selected: its new property can be edited.
  await expect(
    inspector(page).locator('[data-symbol-tag="NOTE"] input')
  ).toHaveValue('new')

  await undo(page)
  expect((await drawingState(page)).symbols[1]).toEqual({
    MARK: 'D2',
    WIDTH: '800',
    MAKER: 'ACME'
  })
})

test('layer 0 is the symbol editing layer: listed while editing, with a warning when used on the canvas', async ({
  page
}) => {
  // Entities on layer 0 outside of symbols: listed, with a warning.
  await load(page, doorsPath)
  const symbolRow = layerRows(page).filter({ hasText: 'Symbol editing layer' })
  await expect(symbolRow).toHaveCount(1)
  await expect(symbolRow.locator('.ml-layer-table-warning')).toBeVisible()
  // The drawing keeps drawing where it did.
  expect((await drawingState(page)).currentLayer).toBe('0')

  // Nothing on layer 0 outside of symbols: not listed, and not drawn on.
  await load(page, symbolOnlyPath)
  await expect(layerRows(page).first()).toBeVisible()
  await expect(
    layerRows(page).filter({ hasText: 'Symbol editing layer' })
  ).toHaveCount(0)
  const outside = await drawingState(page)
  expect(outside.layers).toContain('0')
  expect(outside.currentLayer).not.toBe('0')

  // Inside a symbol it is listed, without a warning, and current.
  const symbolId = await page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    const docs = mod.AcApDocManager.instance
    for (const entity of docs.curDocument.database.tables.blockTable.modelSpace.newIterator()) {
      if (entity.type === 'BlockReference') {
        docs.curView.selectionSet.clear()
        docs.curView.selectionSet.add(entity.objectId)
        docs.sendStringToExecute('refedit')
        return entity.objectId as string
      }
    }
    return undefined
  }, viewerModuleUrl!)
  expect(symbolId).toBeTruthy()
  await expect(bar(page)).toBeVisible()
  const editingRow = layerRows(page).filter({
    hasText: 'Symbol editing layer'
  })
  await expect(editingRow).toHaveCount(1)
  await expect(editingRow.locator('.ml-layer-table-warning')).toHaveCount(0)
  expect((await drawingState(page)).currentLayer).toBe('0')

  await bar(page).getByRole('button', { name: 'Done' }).click()
  await expect(bar(page)).toBeHidden()
  await expect(
    layerRows(page).filter({ hasText: 'Symbol editing layer' })
  ).toHaveCount(0)
  expect((await drawingState(page)).currentLayer).toBe(outside.currentLayer)
})

test('a new drawing gets a layer to draw on instead of layer 0', async ({
  page
}) => {
  await page.goto('/?new=1')
  await expect(page.locator('.ml-cad-container')).toBeVisible({
    timeout: 30000
  })
  await page.waitForTimeout(2500)
  const state = await drawingState(page)
  expect(state.currentLayer).toBe('Layer1')
  await expect(layerRows(page).filter({ hasText: 'Layer1' })).toHaveCount(1)
  await expect(
    layerRows(page).filter({ hasText: 'Symbol editing layer' })
  ).toHaveCount(0)
})

test('the CAD profile lists layer 0 as it is and leaves the current layer', async ({
  page
}) => {
  await useCadProfile(page)
  await load(page, symbolOnlyPath)
  await page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    mod.AcApDocManager.instance.sendStringToExecute('layer')
  }, viewerModuleUrl!)
  await expect(layerRows(page).first()).toBeVisible()
  await expect(
    layerRows(page).filter({ hasText: 'Symbol editing layer' })
  ).toHaveCount(0)
  await expect(
    layerRows(page).locator('.ml-layer-table-name-text', { hasText: /^\s*0\s*$/ })
  ).toHaveCount(1)
  expect((await drawingState(page)).currentLayer).toBe('0')
})
