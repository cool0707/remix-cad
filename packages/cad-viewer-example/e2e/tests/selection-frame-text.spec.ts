import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import { uploadFixture } from '../helpers/fileUpload'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
/** Two TEXT entities, height 10: "ABCDEFG 123" at (0, 0), Japanese at (0, 40). */
const fixturePath = path.resolve(currentDir, '..', 'fixtures', 'texts.dxf')

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
}

/**
 * Client rectangle of the drawn text whose insertion point has the given Y
 * (from the spatial index, which is built from the rendered glyphs).
 */
async function drawnTextRect(page: Page, y: number) {
  return page.evaluate(
    async ({ url, y }) => {
      const mod = await import(/* @vite-ignore */ url)
      const docs = mod.AcApDocManager.instance
      const view = docs.curView
      let id: string | undefined
      for (const entity of docs.curDocument.database.tables.blockTable.modelSpace.newIterator()) {
        if (Math.abs(entity.position.y - y) < 1e-6) id = entity.objectId
      }
      const box = { min: { x: -1e6, y: -1e6 }, max: { x: 1e6, y: 1e6 } }
      const item = view
        .search(box)
        .find((hit: { id: string }) => hit.id === id)
      const rect = view.canvas.getBoundingClientRect()
      const p1 = view.worldToScreen({ x: item.minX, y: item.maxY })
      const p2 = view.worldToScreen({ x: item.maxX, y: item.minY })
      return {
        x: rect.left + p1.x,
        y: rect.top + p1.y,
        width: p2.x - p1.x,
        height: p2.y - p1.y
      }
    },
    { url: viewerModuleUrl!, y }
  )
}

const frame = (page: Page) => page.locator('[data-testid="selection-frame"]')

for (const [label, y] of [
  ['latin', 0],
  ['japanese', 40]
] as const) {
  test(`frame of a selected ${label} TEXT matches the drawn text`, async ({
    page
  }) => {
    await loadFixture(page)
    const drawn = await drawnTextRect(page, y)
    await page.mouse.click(
      drawn.x + drawn.width / 2,
      drawn.y + drawn.height / 2
    )
    await expect(frame(page)).toBeVisible()
    const box = (await frame(page).boundingBox())!
    // The frame may carry a border; allow a few pixels.
    expect(Math.abs(box.x - drawn.x)).toBeLessThan(4)
    expect(Math.abs(box.width - drawn.width)).toBeLessThan(6)
    expect(Math.abs(box.y - drawn.y)).toBeLessThan(4)
    expect(Math.abs(box.height - drawn.height)).toBeLessThan(6)

    if (process.env.FRAME_SHOT_DIR) {
      await page.screenshot({
        path: path.join(process.env.FRAME_SHOT_DIR, `frame-${label}.png`)
      })
    }

    // After an edit the text is redrawn; the frame follows the new drawing.
    await page.keyboard.press('Shift+ArrowRight')
    await page.waitForTimeout(500)
    const moved = await drawnTextRect(page, y)
    const after = (await frame(page).boundingBox())!
    expect(Math.abs(after.x - moved.x)).toBeLessThan(4)
    expect(Math.abs(after.width - moved.width)).toBeLessThan(6)
  })
}
