import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import { uploadFixture } from '../helpers/fileUpload'
import { useCadProfile } from '../helpers/operationProfile'

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
  return box
}

const tab = (page: Page, name: string) =>
  page.locator('.ml-overflow-tab', { hasText: name })
const layersSection = (page: Page) => page.getByTestId('palette-layers-section')

test('simple: a thin top bar instead of the ribbon, with the main menu', async ({
  page
}) => {
  await loadFixture(page)
  await expect(page.getByTestId('top-bar')).toBeVisible()
  await expect(page.locator('.ml-ribbon-toolbar-container')).toHaveCount(0)
  await expect(page.getByTestId('top-bar-file-name')).toHaveText(
    'two-lines.dxf'
  )

  await page.getByTestId('top-bar-menu').click()
  const menu = page.locator('.ml-context-menu').first()
  await expect(menu).toBeVisible()
  await expect(menu).toContainText('Open Drawing')
  await expect(menu).toContainText('Settings')
  // Pressing the button again closes it.
  await page.getByTestId('top-bar-menu').click()
  await expect(page.locator('.ml-context-menu')).toHaveCount(0)

  // Settings from the menu opens the settings dialog.
  await page.getByTestId('top-bar-menu').click()
  await page.locator('.ml-context-menu-item', { hasText: 'Settings' }).click()
  await expect(page.locator('.ml-settings-dlg')).toBeVisible()
})

test('simple: undo / redo of the top bar', async ({ page }) => {
  await loadFixture(page)
  const undo = page.getByTestId('top-bar-undo')
  await expect(undo).toBeDisabled()
  await focusCanvas(page)
  // Select all, delete: something to undo.
  await page.keyboard.press('Control+a')
  await page.keyboard.press('Delete')
  await expect(undo).toBeEnabled()
  await undo.click()
  await expect(page.getByTestId('top-bar-redo')).toBeEnabled()
})

test('simple: the layers have their own section under the properties', async ({
  page
}) => {
  await loadFixture(page)
  await expect(layersSection(page)).toBeVisible()
  // Only the properties above: no layers tab, no task panels.
  await expect(page.locator('.ml-overflow-tab:visible')).toHaveCount(1)
  await expect(tab(page, 'Properties')).toBeVisible()
  await expect(layersSection(page).locator('.ml-layer-list-wrapper')).toBeVisible()

  // Collapsed: the header keeps the current layer name.
  await page.getByTestId('palette-layers-toggle').click()
  await expect(page.getByTestId('palette-layers-current')).toHaveText('0')
  await expect(layersSection(page).locator('.ml-layer-list-wrapper')).toHaveCount(0)
  await page.getByTestId('palette-layers-toggle').click()
  await expect(layersSection(page).locator('.ml-layer-list-wrapper')).toBeVisible()

  // ⋯ > into the tabs: one palette with the layers as the first tab.
  await page.getByTestId('palette-layers-more').click()
  await page.getByTestId('palette-layers-merge').click()
  await expect(layersSection(page)).toHaveCount(0)
  await expect(tab(page, 'Layers')).toHaveClass(/is-active/)
  // And back.
  await page.getByTestId('palette-more').click()
  await page.getByTestId('palette-layers-split').click()
  await expect(layersSection(page)).toBeVisible()
})

test('each profile keeps its own palette layout', async ({ page }) => {
  await useCadProfile(page)
  await loadFixture(page)
  // CAD: one palette, the layers first.
  await expect(layersSection(page)).toHaveCount(0)
  await expect(tab(page, 'Layers')).toBeVisible()
  await expect(tab(page, 'Properties')).toBeVisible()
  // The ribbon, not the top bar.
  await expect(page.getByTestId('top-bar')).toHaveCount(0)

  await page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    mod.AcApSettingManager.instance.operationProfile = 'simple'
  }, viewerModuleUrl!)
  await expect(page.getByTestId('top-bar')).toBeVisible()
  await expect(layersSection(page)).toBeVisible()
})

test('task panels open as closable tabs', async ({ page }) => {
  await loadFixture(page)
  await focusCanvas(page)
  // The measurement panel from the command palette.
  await page.keyboard.press('Control+k')
  await page.locator('.ml-command-palette-input').fill('measurementpanel')
  await page.keyboard.press('Enter')
  const measurements = page.locator('.ml-overflow-tab.is-active')
  await expect(measurements).toBeVisible()
  await expect(measurements.locator('.ml-overflow-tab-close')).toBeVisible()
  // The properties tab cannot be closed.
  await expect(
    tab(page, 'Properties').locator('.ml-overflow-tab-close')
  ).toHaveCount(0)
  await measurements.locator('.ml-overflow-tab-close').click()
  await expect(page.locator('.ml-overflow-tab:visible')).toHaveCount(1)
  await expect(tab(page, 'Properties')).toHaveClass(/is-active/)
})

test('simple: the text editor options float over the drawing while editing', async ({
  page
}) => {
  await loadFixture(page)
  const box = await focusCanvas(page)
  await expect(page.getByTestId('floating-context-bar')).toHaveCount(0)
  await page.keyboard.press('t')
  await page.mouse.click(box.x + 300, box.y + 300)
  await page.mouse.click(box.x + 500, box.y + 400)
  const bar = page.getByTestId('floating-context-bar')
  await expect(bar).toBeVisible()
  await expect(bar).toContainText('Text Editor')
  // Not the ribbon: no file menu in it.
  await expect(bar.locator('.ml-ribbon-file-menu')).toHaveCount(0)
  await page.keyboard.press('Escape')
  await expect(page.getByTestId('floating-context-bar')).toHaveCount(0)
})
