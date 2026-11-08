import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import { uploadFixture } from '../helpers/fileUpload'
import { showCommandLine } from '../helpers/operationProfile'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const fixturePath = path.resolve(currentDir, '..', 'fixtures', 'two-lines.dxf')

const verticalToolbar = (page: Page) =>
  page.locator('.ml-vertical-toolbar-host > .ml-ex-ui-toolbar')
async function openLayerPalette(page: Page) {
  await showCommandLine(page)
  await page.goto('/')
  await uploadFixture(page, fixturePath)
  await expect(page.locator('.ml-cad-container')).toBeVisible({
    timeout: 30000
  })
  await page.waitForTimeout(2000)
  const commandLine = page.locator('input[placeholder="Type command"]')
  await commandLine.click()
  await commandLine.fill('layer')
  await page.keyboard.press('Enter')
  await expect(page.locator('.ml-layer-manager')).toBeVisible()
}

async function dockTo(page: Page, label: RegExp) {
  await page.locator('.ml-tool-palette-dock-btn').click()
  await page
    .locator('.ml-tool-palette-dock-menu li')
    .filter({ hasText: label })
    .click()
}

const boxOf = async (page: Page, selector: string) => {
  const box = await page.locator(selector).boundingBox()
  if (!box) throw new Error(`${selector} not visible`)
  return box
}

test('a docked palette shrinks the canvas, so the toolbar stays beside it', async ({
  page
}) => {
  await openLayerPalette(page)

  // Docked right by default: the bar keeps its left edge.
  await expect(verticalToolbar(page)).toHaveClass(/\bis-left\b/)

  await dockTo(page, /left/i)
  await expect(verticalToolbar(page)).toHaveClass(/\bis-left\b/)
  await expect
    .poll(async () => {
      const palette = await boxOf(page, '.ml-layer-manager')
      const bar = await boxOf(
        page,
        '.ml-vertical-toolbar-host > .ml-ex-ui-toolbar'
      )
      return bar.x >= palette.x + palette.width
    })
    .toBe(true)
})

test('the toolbar moves right under a floating palette and back when docked', async ({
  page
}) => {
  await openLayerPalette(page)
  // Floating, the palette sits over the top-left of the canvas.
  await dockTo(page, /undock/i)
  await expect(verticalToolbar(page)).toHaveClass(/\bis-right\b/)

  await dockTo(page, /right/i)
  await expect(verticalToolbar(page)).toHaveClass(/\bis-left\b/)
})

test('a dragged toolbar the palette covers is docked again', async ({
  page
}) => {
  await openLayerPalette(page)

  // Drag the bar from the left edge towards the top-left, where the floating
  // palette will land on top of it.
  const grip = verticalToolbar(page).locator('.ml-ex-ui-toolbar-grip')
  const box = await grip.boundingBox()
  if (!box) throw new Error('toolbar grip not visible')
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(200, 260, { steps: 10 })
  await page.mouse.up()
  await expect(verticalToolbar(page)).toHaveClass(/\bis-floating\b/)

  await dockTo(page, /undock/i)
  await expect(verticalToolbar(page)).not.toHaveClass(/\bis-floating\b/)
  await expect(verticalToolbar(page)).toHaveClass(/\bis-right\b/)
})
