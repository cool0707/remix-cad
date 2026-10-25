import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import { uploadFixture } from '../helpers/fileUpload'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
/** Two horizontal lines: y = 0 and y = 30, both from x = 0 to x = 100. */
const fixturePath = path.resolve(currentDir, '..', 'fixtures', 'two-lines.dxf')

// Off the end / mid points so clicks on a selected line do not hit a grip.
const LOWER = { x: 25, y: 0 }
const UPPER = { x: 25, y: 30 }
const EMPTY = { x: 25, y: 15 }

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
  await uploadFixture(page, fixturePath)
  await expect(page.locator('.ml-cad-container')).toBeVisible({
    timeout: 30000
  })
  await page.waitForTimeout(2500)
  // Under load the drawing can still be converting after the fixed wait.
  await expect
    .poll(() =>
      page.evaluate(async url => {
        const mod = await import(/* @vite-ignore */ url)
        return mod.AcApDocManager.instance.curView.isProcessingEntities as boolean
      }, viewerModuleUrl!)
    )
    .toBe(false)
}

async function selectedCount(page: Page) {
  expect(viewerModuleUrl, 'viewer module url captured').toBeTruthy()
  return page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    return mod.AcApDocManager.instance.curView.selectionSet.count as number
  }, viewerModuleUrl!)
}

/** Clicks the page at a WCS point. */
async function clickAt(page: Page, point: { x: number; y: number }) {
  const client = await page.evaluate(
    async ({ url, point }) => {
      const mod = await import(/* @vite-ignore */ url)
      const view = mod.AcApDocManager.instance.curView
      const rect = view.canvas.getBoundingClientRect()
      const screen = view.worldToScreen(point)
      return { x: rect.left + screen.x, y: rect.top + screen.y }
    },
    { url: viewerModuleUrl!, point }
  )
  await page.mouse.click(client.x, client.y)
  await page.waitForTimeout(150)
}

async function shiftClickAt(page: Page, point: { x: number; y: number }) {
  await page.keyboard.down('Shift')
  await clickAt(page, point)
  await page.keyboard.up('Shift')
}

test('CAD profile adds every clicked entity to the selection', async ({
  page
}) => {
  await loadFixture(page)
  const toggle = page.locator('.ml-operation-profile-button')
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-pressed', 'false')

  await clickAt(page, LOWER)
  await clickAt(page, UPPER)
  await expect.poll(() => selectedCount(page)).toBe(2)
})

test('simple profile (default) replaces on click and toggles on Shift + click', async ({
  page
}) => {
  await loadFixture(page)

  await clickAt(page, LOWER)
  await expect.poll(() => selectedCount(page)).toBe(1)
  await clickAt(page, UPPER)
  await expect.poll(() => selectedCount(page)).toBe(1)

  await shiftClickAt(page, LOWER)
  await expect.poll(() => selectedCount(page)).toBe(2)
  await shiftClickAt(page, UPPER)
  await expect.poll(() => selectedCount(page)).toBe(1)

  await clickAt(page, EMPTY)
  await expect.poll(() => selectedCount(page)).toBe(0)
})
