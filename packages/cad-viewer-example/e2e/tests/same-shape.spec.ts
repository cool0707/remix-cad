import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import { uploadFixture } from '../helpers/fileUpload'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
/**
 * A HOOK symbol (three lines and an arc): placed at (0, 0) and turned 90° at
 * (100, 0); exploded at (200, 0); copied loose and turned 180° at (300, 0).
 * Plus one unrelated line.
 */
const fixturePath = path.resolve(currentDir, '..', 'fixtures', 'same-shape.dxf')

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

async function loadFixture(page: Page) {
  await page.goto('/')
  await uploadFixture(page, fixturePath, { accessMode: 'Write' })
  await expect(page.locator('.ml-cad-container')).toBeVisible({
    timeout: 30000
  })
  await page.waitForTimeout(2500)
  await expect
    .poll(() =>
      page.evaluate(async url => {
        const mod = await import(/* @vite-ignore */ url)
        return mod.AcApDocManager.instance.curView
          .isProcessingEntities as boolean
      }, viewerModuleUrl!)
    )
    .toBe(false)
  await expect(page.locator('.ml-ccl-overlay:visible')).toHaveCount(0)
}

/** Selects the symbol placed at the origin. */
function selectFirstSymbol(page: Page) {
  return page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    const manager = mod.AcApDocManager.instance
    const space = manager.curDocument.database.tables.blockTable.modelSpace
    const first = [...space.newIterator()].find(
      (entity: { blockName?: string }) => entity.blockName === 'HOOK'
    )
    manager.curView.applySelection([first.objectId], 'replace')
  }, viewerModuleUrl!)
}

/** Model space: number of entities and of symbols; the selection size. */
function drawingState(page: Page) {
  return page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    const manager = mod.AcApDocManager.instance
    const space = manager.curDocument.database.tables.blockTable.modelSpace
    const entities = [...space.newIterator()] as { blockName?: string }[]
    return {
      count: entities.length,
      symbols: entities.filter(entity => entity.blockName === 'HOOK').length,
      selected: manager.curView.selectionSet.count as number
    }
  }, viewerModuleUrl!)
}

/** Clicks an empty spot of the drawing so keys go to the viewer. */
async function focusCanvas(page: Page) {
  const canvas = page.locator('.ml-cad-container canvas').first()
  const box = (await canvas.boundingBox())!
  await page.mouse.click(box.x + 20, box.y + box.height - 20)
  await page.waitForTimeout(200)
}

/** Right-clicks an empty spot of the canvas (keeps the selection). */
async function rightClickEmpty(page: Page) {
  const point = await page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    const view = mod.AcApDocManager.instance.curView
    const rect = view.canvas.getBoundingClientRect()
    const screen = view.worldToScreen({ x: 150, y: -40 })
    return { x: rect.left + screen.x, y: rect.top + screen.y }
  }, viewerModuleUrl!)
  await page.mouse.click(point.x, point.y, { button: 'right' })
}

test('finds placed, exploded and copied symbols; replaces the loose ones', async ({
  page
}) => {
  await loadFixture(page)
  expect(await drawingState(page)).toMatchObject({ count: 11, symbols: 2 })

  await selectFirstSymbol(page)
  await rightClickEmpty(page)
  await page.locator('.ml-context-menu [data-id="findSameShape"]').click()

  const panel = page.getByTestId('same-shape-palette')
  await expect(panel).toBeVisible()
  await expect(page.getByTestId('same-shape-pattern')).toHaveText(
    'Symbol "HOOK"'
  )
  // The turned symbol, the exploded one and the turned copy.
  await expect(page.getByTestId('same-shape-count')).toHaveText('3 more places')
  await expect(page.getByTestId('same-shape-row')).toHaveCount(4)

  // Without turned ones: only the exploded copy.
  await page.getByTestId('same-shape-rotate').click()
  await expect(page.getByTestId('same-shape-count')).toHaveText('1 more places')
  await page.getByTestId('same-shape-rotate').click()
  await expect(page.getByTestId('same-shape-count')).toHaveText('3 more places')

  // A row selects that place.
  await page.getByTestId('same-shape-row').nth(1).click()
  expect((await drawingState(page)).selected).toBeGreaterThan(0)

  // Select everything found: 2 symbols + 2 × 4 loose shapes.
  await page.getByTestId('same-shape-select-all').click()
  expect((await drawingState(page)).selected).toBe(10)

  // The loose ones become HOOK symbols, in one undo step.
  await page.getByTestId('same-shape-to-symbol').click()
  await expect
    .poll(async () => drawingState(page))
    .toMatchObject({ count: 5, symbols: 4, selected: 2 })
  await expect(page.getByTestId('same-shape-count')).toHaveText('3 more places')

  await focusCanvas(page)
  await page.keyboard.press('Control+z')
  await expect
    .poll(async () => drawingState(page))
    .toMatchObject({ count: 11, symbols: 2 })
  await expect(page.getByTestId('same-shape-search-again')).toBeVisible()
})

test('the command palette opens the panel with the selection', async ({
  page
}) => {
  await loadFixture(page)
  await focusCanvas(page)
  await selectFirstSymbol(page)
  await page.keyboard.press('Control+k')
  await page.keyboard.type('same shape')
  await page.keyboard.press('Enter')
  await expect(page.getByTestId('same-shape-count')).toHaveText('3 more places')
})
