import { expect, test, type Page } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import { useCadProfile } from '../helpers/operationProfile'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const fixturePath = path.resolve(
  currentDir,
  '..',
  'fixtures',
  'minimal-line.dxf'
)

async function openFixture(page: Page) {
  await useCadProfile(page)
  await page.goto('/')
  const fileInput = page.locator('input[type="file"]').first()
  await expect(fileInput).toBeAttached()
  await fileInput.setInputFiles(fixturePath)
  await expect(page.locator('.ml-cad-container')).toBeVisible({
    timeout: 30000
  })
  await expect(page.locator('.ml-ccl-overlay:visible')).toHaveCount(0, {
    timeout: 30000
  })
  await page.waitForTimeout(500)
}

/** The view scale shown in the status bar (e.g. "1/7.4"). */
async function viewScale(page: Page) {
  const text = await page.locator('body').innerText()
  return text.match(/\b1\/[0-9.]+/)?.[0]
}

async function runCommand(page: Page, name: string) {
  const commandInput = page.getByRole('textbox', { name: 'Type command' })
  await commandInput.click()
  await commandInput.fill(name)
  await commandInput.press('Enter')
  await page.waitForTimeout(300)
}

/**
 * Count prompts (POLYGON sides) open with a number in the box; the wheel
 * steps it instead of zooming and a click commits it.
 */
test('polygon sides: wheel steps the count, click confirms', async ({
  page
}) => {
  await openFixture(page)
  const canvas = page.locator('.ml-cad-container canvas').first()
  const box = await canvas.boundingBox()
  if (!box) throw new Error('Canvas bounding box is unavailable')

  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5)
  await runCommand(page, 'polygon')
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5)

  const input = page.locator('.ml-floating-input input').first()
  await expect(input).toHaveValue('4')
  await expect(page.locator('.ml-floating-input-wheel-hint')).toBeVisible()

  const before = await viewScale(page)
  await page.mouse.wheel(0, -100)
  await page.waitForTimeout(100)
  await page.mouse.wheel(0, -100)
  await page.waitForTimeout(100)
  await page.mouse.wheel(0, -100)
  await page.waitForTimeout(100)
  await page.mouse.wheel(0, 100)
  await page.waitForTimeout(400)
  await expect(input).toHaveValue('6')
  // The view must not have zoomed.
  expect(await viewScale(page)).toBe(before)

  // Never below the 3-side minimum.
  for (let i = 0; i < 5; i++) {
    await page.mouse.wheel(0, 100)
    await page.waitForTimeout(50)
  }
  await expect(input).toHaveValue('3')
  await page.mouse.wheel(0, -100)
  await page.waitForTimeout(100)
  await page.mouse.wheel(0, -100)
  await expect(input).toHaveValue('5')

  // Click commits: the next prompt (center) no longer shows a count.
  await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.5)
  await page.waitForTimeout(300)
  await expect(page.locator('.ml-floating-input-wheel-hint')).toHaveCount(0)
  await page.keyboard.press('Escape')

  // The next POLYGON opens with the last count.
  await runCommand(page, 'polygon')
  await expect(page.locator('.ml-floating-input input').first()).toHaveValue(
    '5'
  )
  await page.keyboard.press('Escape')

  // Outside count prompts the wheel zooms again.
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5)
  await page.waitForTimeout(300)
  const idle = await viewScale(page)
  await page.mouse.wheel(0, -300)
  await page.waitForTimeout(600)
  expect(await viewScale(page)).not.toBe(idle)
})
