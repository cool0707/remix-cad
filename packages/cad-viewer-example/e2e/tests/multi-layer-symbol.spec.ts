import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import { uploadFixture } from '../helpers/fileUpload'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
/**
 * One symbol MULTI_LAYER_BLK on layer SYMBOL. Its block holds a line on
 * layer WALL (y = 0) and a line on layer DIM (y = 10), x = 0 … 100.
 */
const fixturePath = path.resolve(
  currentDir,
  '..',
  'fixtures',
  'multi-layer-symbol.dxf'
)

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

/** Clicks the drawing at a world point. */
async function clickWorld(page: Page, x: number, y: number) {
  expect(viewerModuleUrl, 'viewer module url captured').toBeTruthy()
  const point = await page.evaluate(
    async ({ url, x, y }) => {
      const mod = await import(/* @vite-ignore */ url)
      const view = mod.AcApDocManager.instance.curView
      const screen = view.worldToScreen({ x, y })
      const rect = view.canvas.getBoundingClientRect()
      return { x: screen.x + rect.left, y: screen.y + rect.top }
    },
    { url: viewerModuleUrl!, x, y }
  )
  await page.mouse.move(point.x, point.y)
  await page.mouse.click(point.x, point.y)
}

async function isLayerOn(page: Page, name: string) {
  return page.evaluate(
    async ({ url, name }) => {
      const mod = await import(/* @vite-ignore */ url)
      const db = mod.AcApDocManager.instance.curDocument.database
      const layer = db.tables.layerTable.getAt(name)
      return layer ? !layer.isOff : undefined
    },
    { url: viewerModuleUrl!, name }
  )
}

test('shows the layers a symbol is drawn on and hides one of them', async ({
  page
}) => {
  await page.goto('/')
  await uploadFixture(page, fixturePath)
  await expect(page.locator('.ml-cad-container')).toBeVisible({
    timeout: 30000
  })
  await page.waitForTimeout(2500)
  await page.locator('.ml-overflow-tab', { hasText: 'Properties' }).click()

  await clickWorld(page, 50, 0)

  const inspector = page.locator('.ml-entity-properties')
  // The symbol's own layer…
  await expect(inspector.locator('.ml-layer-select')).toContainText('SYMBOL')
  // …and the layers its contents are drawn on.
  const contentLayers = inspector.locator('.ml-inspector-content-layer')
  await expect(inspector).toContainText('Content layers')
  await expect(contentLayers).toHaveText(['WALL', 'DIM'])

  await contentLayers
    .filter({ hasText: 'DIM' })
    .locator('.ml-inspector-content-layer__toggle')
    .click()
  await expect.poll(() => isLayerOn(page, 'DIM')).toBe(false)
  await expect(contentLayers.filter({ hasText: 'DIM' })).toHaveClass(
    /is-hidden/
  )
  await expect.poll(() => isLayerOn(page, 'WALL')).toBe(true)
})
