import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import { uploadFixture } from '../helpers/fileUpload'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
/** Two horizontal lines: y = 0 and y = 30, both from x = 0 to x = 100. */
const fixturePath = path.resolve(currentDir, '..', 'fixtures', 'two-lines.dxf')

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

/** Clicks an empty spot of the drawing so keys go to the viewer. */
async function focusCanvas(page: Page) {
  const canvas = page.locator('.ml-cad-container canvas').first()
  const box = (await canvas.boundingBox())!
  await page.mouse.click(box.x + 20, box.y + box.height - 20)
  await page.waitForTimeout(200)
}

/** Picks the first line as a click would; returns how many are selected. */
function pickFirstLine(page: Page) {
  return page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    const manager = mod.AcApDocManager.instance
    const view = manager.curView
    const space = manager.curDocument.database.tables.blockTable.modelSpace
    const first = [...space.newIterator()][0]
    view.applySelection([first.objectId], 'replace')
    return view.selectionSet.count as number
  }, viewerModuleUrl!)
}

const groupRows = (page: Page) => page.getByTestId('group-row-group')
const expandFirstGroup = (page: Page) =>
  page
    .locator('.el-tree-node__content', { has: groupRows(page) })
    .first()
    .locator('.el-tree-node__expand-icon')
    .click()
const entityRows = (page: Page) => page.getByTestId('group-row-entity')

test('simple: group the selection, see it in the group tab, pick it as a whole', async ({
  page
}) => {
  await loadFixture(page)
  const section = page.getByTestId('palette-layers-section')
  await expect(section).toBeVisible()

  // The layers section has a layers tab and a groups tab.
  await page.getByTestId('palette-section-tab-groupManager').click()
  await expect(page.getByTestId('group-empty')).toBeVisible()
  await expect(section.locator('.ml-layer-manager-panel')).toHaveCount(0)

  // Select everything, Ctrl+G.
  await focusCanvas(page)
  await page.keyboard.press('Control+a')
  await page.keyboard.press('Control+g')
  await expect(groupRows(page)).toHaveCount(1)
  await expect(groupRows(page)).toContainText('Group1')
  await expect(groupRows(page)).toContainText('2 object(s)')

  // A click on one line selects the group.
  await page.keyboard.press('Escape')
  expect(await pickFirstLine(page)).toBe(2)
  // Group selection off: one by one.
  await page.getByTestId('group-selection-toggle').click()
  expect(await pickFirstLine(page)).toBe(1)
  await page.getByTestId('group-selection-toggle').click()
  expect(await pickFirstLine(page)).toBe(2)

  // The members are listed under the group; one can be taken out (undoable).
  await expandFirstGroup(page)
  await expect(entityRows(page)).toHaveCount(2)
  await entityRows(page).first().hover()
  await entityRows(page).first().getByTestId('group-remove-entity').click()
  await expect(groupRows(page)).toContainText('1 object(s)')
  await focusCanvas(page)
  await page.keyboard.press('Control+z')
  await expect(groupRows(page)).toContainText('2 object(s)')

  // Ungroup from the panel.
  await groupRows(page).click()
  await page.getByTestId('group-ungroup').click()
  await expect(page.getByTestId('group-empty')).toBeVisible()
  expect(await pickFirstLine(page)).toBe(1)

  // The layers tab is still there.
  await page.getByTestId('palette-section-tab-layerManager').click()
  await expect(section.locator('.ml-layer-manager-panel')).toBeVisible()
})

test('groups nest: grouping a group with more objects puts it inside', async ({
  page
}) => {
  await loadFixture(page)
  await page.getByTestId('palette-section-tab-groupManager').click()
  await focusCanvas(page)

  // First group: the first line only.
  expect(await pickFirstLine(page)).toBe(1)
  await page.keyboard.press('Control+g')
  await expect(groupRows(page)).toHaveCount(1)
  // Then everything: the first group goes inside the second.
  await page.keyboard.press('Control+a')
  await page.keyboard.press('Control+g')
  await expect(groupRows(page)).toHaveCount(1)
  await expect(groupRows(page)).toContainText('Group2')
  await expandFirstGroup(page)
  await expect(groupRows(page)).toHaveCount(2)
  await expect(groupRows(page).nth(1)).toContainText('Group1')

  // Ctrl+Shift+G takes the outer group apart, the inner one stays.
  await page.keyboard.press('Control+Shift+g')
  await expect(groupRows(page)).toHaveCount(1)
  await expect(groupRows(page)).toContainText('Group1')
})

test('merged palette: groups are a tab next to the layers', async ({
  page
}) => {
  await loadFixture(page)
  await page.getByTestId('palette-layers-more').click()
  await page.getByTestId('palette-layers-merge').click()
  const groupsTab = page.locator('.ml-overflow-tab', { hasText: 'Groups' })
  await expect(groupsTab).toBeVisible()
  await groupsTab.click()
  await expect(page.getByTestId('group-list')).toBeVisible()
  await page.getByTestId('palette-more').click()
  await page.getByTestId('palette-layers-split').click()
  await expect(page.getByTestId('palette-layers-section')).toBeVisible()
})
