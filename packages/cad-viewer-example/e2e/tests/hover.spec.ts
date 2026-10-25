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

const canvasCursor = (page: Page) =>
  page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    return mod.AcApDocManager.instance.curView.canvas.style.cursor as string
  }, viewerModuleUrl!)

/**
 * Most theme-purple pixel (#AF61DA) in a small column around a point: high
 * red and blue, low green. Lines are 1px, so look a few pixels around.
 */
async function purpleAt(page: Page, point: { x: number; y: number }) {
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
      const score = Math.min(data[i], data[i + 2]) - data[i + 1]
      best = Math.max(best, score)
    }
    return best
  }, shot.toString('base64'))
}

for (const profile of ['simple', 'cad'] as const) {
  test(`hover colors a selectable line (${profile} profile)`, async ({
    page
  }) => {
    await loadFixture(page)
    if (profile === 'cad') {
      await page.locator('.ml-operation-profile-button').click()
    }
    const away = await clientPoint(page, { x: 50, y: 15 })
    await page.mouse.move(away.x, away.y)
    await page.waitForTimeout(300)
    expect(await purpleAt(page, { x: 50, y: 0 })).toBeLessThan(15)

    const on = await clientPoint(page, { x: 50, y: 0 })
    await page.mouse.move(on.x, on.y, { steps: 4 })
    await expect
      .poll(() => purpleAt(page, { x: 50, y: 0 }), { timeout: 3000 })
      .toBeGreaterThan(15)

    await page.mouse.move(away.x, away.y, { steps: 4 })
    await expect
      .poll(() => purpleAt(page, { x: 50, y: 0 }), { timeout: 3000 })
      .toBeLessThan(15)
  })
}

test('simple profile: the move cursor over a selected line', async ({
  page
}) => {
  await loadFixture(page)
  const lower = await clientPoint(page, { x: 50, y: 0 })
  const upper = await clientPoint(page, { x: 50, y: 30 })
  const away = await clientPoint(page, { x: 50, y: 15 })
  await page.mouse.click(lower.x, lower.y)
  await page.mouse.move(away.x, away.y, { steps: 4 })
  await expect.poll(() => canvasCursor(page)).not.toBe('move')

  await page.mouse.move(lower.x, lower.y, { steps: 4 })
  await expect.poll(() => canvasCursor(page)).toBe('move')

  // Not over an unselected line, and back to the arrow off the selection.
  await page.mouse.move(upper.x, upper.y, { steps: 4 })
  await expect.poll(() => canvasCursor(page)).not.toBe('move')
  await page.mouse.move(away.x, away.y, { steps: 4 })
  await expect.poll(() => canvasCursor(page)).toBe('default')

  // The CAD profile keeps its crosshair.
  await page.locator('.ml-operation-profile-button').click()
  await page.mouse.move(lower.x, lower.y, { steps: 4 })
  await page.waitForTimeout(500)
  expect(await canvasCursor(page)).not.toBe('move')
})

test('hover also colors objects while a command asks to select one', async ({
  page
}) => {
  await loadFixture(page)
  const away = await clientPoint(page, { x: 50, y: 15 })
  await page.mouse.click(away.x, away.y)
  await page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    mod.AcApDocManager.instance.sendStringToExecute('offset')
  }, viewerModuleUrl!)
  await page.waitForTimeout(500)
  await page.keyboard.type('5')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(500)

  const on = await clientPoint(page, { x: 50, y: 30 })
  await page.mouse.move(on.x, on.y, { steps: 4 })
  await expect
    .poll(() => purpleAt(page, { x: 50, y: 30 }), { timeout: 3000 })
    .toBeGreaterThan(15)
})
