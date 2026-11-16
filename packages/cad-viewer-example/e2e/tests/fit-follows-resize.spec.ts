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

/** Where the ends of the lines are on the canvas, and the canvas width. */
async function framing(page: Page) {
  return page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    const view = mod.AcApDocManager.instance.curView
    const left = view.worldToScreen({ x: 0, y: 0 }).x as number
    const right = view.worldToScreen({ x: 100, y: 0 }).x as number
    return {
      left,
      right,
      width: view.canvas.clientWidth as number,
      processing: view.isProcessingEntities as boolean
    }
  }, viewerModuleUrl!)
}

/**
 * A panel docking beside the canvas right after a drawing opened used to
 * leave the drawing fitted to the old, wider canvas: its left end ended up
 * under the toolbar. The fit now follows the canvas size until the view is
 * moved.
 */
test('a fitted drawing stays fitted when the canvas changes size, until the view is moved', async ({
  page
}) => {
  await page.goto('/')
  await uploadFixture(page, fixturePath, { accessMode: 'Write' })
  await expect(page.locator('.ml-cad-container')).toBeVisible({
    timeout: 30000
  })
  await page.waitForTimeout(2500)
  await expect.poll(async () => (await framing(page)).processing).toBe(false)

  const fitsCanvas = async () => {
    const { left, right, width } = await framing(page)
    return left > 0 && right < width && right - left > width * 0.8
  }
  expect(await fitsCanvas()).toBe(true)
  const wide = await framing(page)

  // A narrower window: the drawing is fitted again.
  await page.setViewportSize({ width: 900, height: 720 })
  await expect.poll(async () => (await framing(page)).width).toBeLessThan(
    wide.width
  )
  await expect.poll(fitsCanvas).toBe(true)
  const narrow = await framing(page)
  expect(narrow.right - narrow.left).toBeLessThan(wide.right - wide.left)

  // Once the view is moved (zoomed with the wheel), its scale is kept.
  const canvas = page.locator('.ml-cad-container canvas').first()
  const box = (await canvas.boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.wheel(0, -400)
  await expect
    .poll(async () => {
      const { left, right } = await framing(page)
      return right - left
    })
    .toBeGreaterThan(narrow.right - narrow.left)
  await page.waitForTimeout(300)
  const zoomed = await framing(page)

  await page.setViewportSize({ width: 1280, height: 720 })
  await expect.poll(async () => (await framing(page)).width).toBeGreaterThan(
    narrow.width
  )
  const after = await framing(page)
  expect(after.right - after.left).toBeCloseTo(zoomed.right - zoomed.left, 3)
})
