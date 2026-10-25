import { expect, test } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import { uploadFixture } from '../helpers/fileUpload'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const fixturePath = path.resolve(currentDir, '..', 'fixtures', 'two-lines.dxf')

test('Space + left drag pans, plain left drag does not', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', error => {
    pageErrors.push(error.message)
  })

  await page.goto('/')
  await uploadFixture(page, fixturePath, { initialView: 'Extents' })
  const canvas = page.locator('.ml-cad-container canvas').first()
  await expect(canvas).toBeVisible()
  await page.waitForTimeout(1200)

  const box = await canvas.boundingBox()
  if (!box) throw new Error('canvas has no bounding box')
  const cx = box.x + box.width / 2
  const cy = box.y + box.height / 2

  // Focus the viewer so document shortcuts are scoped to it.
  await page.mouse.click(box.x + 10, box.y + 10)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(250)
  const before = await canvas.screenshot()

  // Plain left drag is a box selection: the view must not move.
  await page.mouse.move(cx - 60, cy - 60)
  await page.mouse.down()
  await page.mouse.move(cx + 60, cy + 40, { steps: 8 })
  await page.mouse.up()
  await page.keyboard.press('Escape')
  await page.waitForTimeout(250)
  expect((await canvas.screenshot()).equals(before)).toBe(true)

  // Space + left drag pans.
  await page.keyboard.down('Space')
  await page.mouse.move(cx, cy)
  await page.mouse.down()
  await page.mouse.move(cx + 120, cy + 80, { steps: 8 })
  await page.mouse.up()
  await page.keyboard.up('Space')
  await page.waitForTimeout(250)
  expect((await canvas.screenshot()).equals(before)).toBe(false)

  // Releasing Space restores the default left-button behavior.
  const afterPan = await canvas.screenshot()
  await page.mouse.move(cx - 60, cy - 60)
  await page.mouse.down()
  await page.mouse.move(cx + 60, cy + 40, { steps: 8 })
  await page.mouse.up()
  await page.keyboard.press('Escape')
  await page.waitForTimeout(250)
  expect((await canvas.screenshot()).equals(afterPan)).toBe(true)

  expect(pageErrors).toEqual([])
})
