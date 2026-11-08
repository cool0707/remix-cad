import { expect, test, type Page } from '@playwright/test'

import { showCommandLine } from '../helpers/operationProfile'

type Clip = { x: number; y: number; width: number; height: number }

/** Counts bright pixels inside `clip` of the page screenshot. */
async function countBrightPixels(page: Page, clip: Clip) {
  const pngBase64 = (await page.screenshot({ clip })).toString('base64')
  return page.evaluate(async imageBase64 => {
    const image = new Image()
    image.src = `data:image/png;base64,${imageBase64}`
    await image.decode()
    const probe = document.createElement('canvas')
    probe.width = image.naturalWidth
    probe.height = image.naturalHeight
    const ctx = probe.getContext('2d')
    if (!ctx) throw new Error('Failed to create 2d context')
    ctx.drawImage(image, 0, 0)
    const { data } = ctx.getImageData(0, 0, probe.width, probe.height)
    let count = 0
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] + data[i + 1] + data[i + 2] > 300) count++
    }
    return count
  }, pngBase64)
}

/**
 * While the MTEXT editor is open, the typed text, the picked area and the IME
 * composition must be visible before the editor is closed. The editor draws
 * text/caret/frame with WebGL, so the view must redraw while typing.
 */
test('mtext editor shows typed text and IME composition while editing', async ({
  page
}) => {
  await showCommandLine(page)
  await page.goto('/?new=1')
  const canvas = page.locator('.ml-cad-container canvas').first()
  await expect(canvas).toBeVisible({ timeout: 30000 })
  await page.waitForTimeout(1500)
  const box = await canvas.boundingBox()
  if (!box) throw new Error('Canvas bounding box is unavailable')

  const commandInput = page.getByRole('textbox', { name: 'Type command' })
  await commandInput.click()
  await commandInput.fill('mtext')
  await commandInput.press('Enter')
  await page.waitForTimeout(300)

  const left = box.x + box.width * 0.3
  const top = box.y + box.height * 0.3
  await page.mouse.click(left, top)
  await page.waitForTimeout(200)
  await page.mouse.click(box.x + box.width * 0.6, box.y + box.height * 0.5)
  await page.waitForTimeout(800)

  const textClip = {
    x: left + 4,
    y: top + 4,
    width: box.width * 0.25,
    height: 32
  }
  const beforeTyping = await countBrightPixels(page, textClip)

  await page.keyboard.type('Hello', { delay: 30 })
  await page.waitForTimeout(800)
  const afterTyping = await countBrightPixels(page, textClip)
  expect(afterTyping - beforeTyping).toBeGreaterThan(100)

  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Input.imeSetComposition', {
    text: 'にほんご',
    selectionStart: 4,
    selectionEnd: 4
  })
  const composition = page.locator('.ml-mtext-ime-composition')
  await expect(composition).toBeVisible()
  await expect(composition).toHaveText('にほんご')

  await cdp.send('Input.insertText', { text: '日本語' })
  await expect(composition).toBeHidden()
  const text = await page.evaluate(() =>
    (
      globalThis as unknown as {
        __mlightcadAcEdMTextActiveInputBox__?: { getText(): string } | null
      }
    ).__mlightcadAcEdMTextActiveInputBox__?.getText()
  )
  expect(text).toContain('Hello日本語')
})
