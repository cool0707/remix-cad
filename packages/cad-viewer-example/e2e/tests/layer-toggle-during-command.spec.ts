import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import { uploadFixture } from '../helpers/fileUpload'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
/**
 * Two DOOR symbols (20 × 20, at x = 0 and x = 40) on layer DOORS (red) and
 * two lines on layer 0 below them.
 */
const fixturePath = path.resolve(
  currentDir,
  '..',
  'fixtures',
  'symbol-attributes.dxf'
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

/** Brightest red (red minus green) in a small column around a point. */
async function redAt(page: Page, point: { x: number; y: number }) {
  const client = await clientPoint(page, point)
  const shot = await page.screenshot({
    clip: { x: client.x - 2, y: client.y - 4, width: 5, height: 9 }
  })
  return page.evaluate(async base64 => {
    const img = new Image()
    img.src = `data:image/png;base64,${base64}`
    await img.decode()
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0)
    const data = ctx.getImageData(0, 0, img.width, img.height).data
    let best = 0
    for (let i = 0; i < data.length; i += 4) {
      best = Math.max(best, data[i] - data[i + 1])
    }
    return best
  }, shot.toString('base64'))
}

const commandRunning = (page: Page) =>
  page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    return mod.AcApDocManager.instance.curView.toolManager
      .isCommandRunning as boolean
  }, viewerModuleUrl!)

const doorsToggle = (page: Page) =>
  page
    .locator('tr', { hasText: 'DOORS' })
    .locator('.ml-layer-table-state-button')
    .first()

/** Top edge of the left DOOR symbol. */
const DOOR_EDGE = { x: 10, y: 20 }

for (const tool of ['KeyL', 'move'] as const) {
  test(`the layer panel hides and shows a layer while ${tool === 'KeyL' ? 'LINE' : 'MOVE'} runs`, async ({
    page
  }) => {
    await loadFixture(page)
    expect(await redAt(page, DOOR_EDGE)).toBeGreaterThan(100)

    const lineBelow = await clientPoint(page, { x: 30, y: -20 })
    await page.mouse.click(lineBelow.x, lineBelow.y)
    if (tool === 'KeyL') {
      await page.keyboard.press('KeyL')
    } else {
      await page.evaluate(async url => {
        const mod = await import(/* @vite-ignore */ url)
        mod.AcApDocManager.instance.sendStringToExecute('move')
      }, viewerModuleUrl!)
    }
    await expect.poll(() => commandRunning(page)).toBe(true)

    await doorsToggle(page).click()
    await expect.poll(() => redAt(page, DOOR_EDGE)).toBeLessThan(40)
    expect(await commandRunning(page)).toBe(true)

    await doorsToggle(page).click()
    await expect.poll(() => redAt(page, DOOR_EDGE)).toBeGreaterThan(100)
    expect(await commandRunning(page)).toBe(true)
  })
}
