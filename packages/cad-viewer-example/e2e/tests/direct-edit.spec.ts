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

/** Lines of model space (start / end), lowest first, and the selection size. */
async function drawingState(page: Page) {
  return page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    const docs = mod.AcApDocManager.instance
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = []
    for (const entity of docs.curDocument.database.tables.blockTable.modelSpace.newIterator()) {
      const line = entity as {
        startPoint: { x: number; y: number }
        endPoint: { x: number; y: number }
      }
      lines.push({
        x1: line.startPoint.x,
        y1: line.startPoint.y,
        x2: line.endPoint.x,
        y2: line.endPoint.y
      })
    }
    lines.sort((a, b) => a.y1 - b.y1 || a.x1 - b.x1)
    return {
      lines,
      selected: docs.curView.selectionSet.count as number,
      osnapEnabled: mod.AcApSettingManager.instance.osnapEnabled as boolean
    }
  }, viewerModuleUrl!)
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

async function clickAt(page: Page, point: { x: number; y: number }) {
  const client = await clientPoint(page, point)
  await page.mouse.click(client.x, client.y)
  await page.waitForTimeout(200)
}

async function drag(
  page: Page,
  from: { x: number; y: number },
  to: { x: number; y: number },
  modifier?: 'Alt'
) {
  const a = await clientPoint(page, from)
  const b = await clientPoint(page, to)
  if (modifier) await page.keyboard.down(modifier)
  await page.mouse.move(a.x, a.y)
  await page.mouse.down()
  for (let i = 1; i <= 8; i++) {
    await page.mouse.move(
      a.x + ((b.x - a.x) * i) / 8,
      a.y + ((b.y - a.y) * i) / 8
    )
  }
  await page.mouse.up()
  if (modifier) await page.keyboard.up(modifier)
  await page.waitForTimeout(300)
}

const frame = (page: Page) => page.locator('[data-testid="selection-frame"]')

test('drag moves the selected line; Alt + drag copies it; undo restores', async ({
  page
}) => {
  await loadFixture(page)
  await clickAt(page, { x: 25, y: 0 })
  await expect.poll(async () => (await drawingState(page)).selected).toBe(1)
  await expect(frame(page)).toBeVisible()

  // Grabbed on the line (nearest snap), dropped below it.
  await drag(page, { x: 25, y: 0 }, { x: 25, y: -20 })
  let state = await drawingState(page)
  expect(state.lines).toHaveLength(2)
  expect(state.lines[0].y1).toBeCloseTo(-20, 0)
  expect(state.lines[0].y2).toBeCloseTo(-20, 0)
  expect(state.lines[0].x1).toBeCloseTo(0, 0)
  expect(state.selected).toBe(1)

  await page.keyboard.press('Control+z')
  await expect
    .poll(async () => (await drawingState(page)).lines[0].y1)
    .toBeCloseTo(0, 5)

  // Alt + drag: a copy, which becomes the selection.
  await drag(page, { x: 25, y: 0 }, { x: 25, y: -20 }, 'Alt')
  state = await drawingState(page)
  expect(state.lines).toHaveLength(3)
  expect(state.lines[0].y1).toBeCloseTo(-20, 0)
  expect(state.lines[1].y1).toBeCloseTo(0, 5)
  expect(state.selected).toBe(1)
})

test('a press that does not move is still a click', async ({ page }) => {
  await loadFixture(page)
  // Select both lines, then click one of them: the click replaces.
  await clickAt(page, { x: 50, y: 0 })
  const upper = await clientPoint(page, { x: 50, y: 30 })
  await page.keyboard.down('Shift')
  await page.mouse.click(upper.x, upper.y)
  await page.keyboard.up('Shift')
  await expect.poll(async () => (await drawingState(page)).selected).toBe(2)
  await clickAt(page, { x: 50, y: 30 })
  const state = await drawingState(page)
  expect(state.selected).toBe(1)
  expect(state.lines[1].y1).toBeCloseTo(30, 5)
})

test('arrow keys nudge the selection, Shift ten times as far', async ({
  page
}) => {
  await loadFixture(page)
  await clickAt(page, { x: 25, y: 0 })
  await expect.poll(async () => (await drawingState(page)).selected).toBe(1)

  await page.keyboard.press('ArrowUp')
  const step = (await drawingState(page)).lines[0].y1
  expect(step).toBeGreaterThan(0)
  await page.keyboard.press('Shift+ArrowUp')
  expect((await drawingState(page)).lines[0].y1).toBeCloseTo(step * 11, 5)
  await page.keyboard.press('ArrowLeft')
  expect((await drawingState(page)).lines[0].x1).toBeCloseTo(-step, 5)
})

test('corner handle scales around the opposite corner', async ({ page }) => {
  await loadFixture(page)
  await clickAt(page, { x: 25, y: 0 })
  await expect(frame(page)).toBeVisible()

  // Right end of the (flat) frame of the lower line: x = 100, y = 0.
  const handle = page.locator('.ml-sel-frame-handle[data-corner="10"]')
  const box = (await handle.boundingBox())!
  const target = await clientPoint(page, { x: 150, y: 0 })
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  for (let i = 1; i <= 8; i++) {
    const x =
      box.x + box.width / 2 + ((target.x - box.x - box.width / 2) * i) / 8
    await page.mouse.move(x, box.y + box.height / 2)
  }
  await page.mouse.up()
  await page.waitForTimeout(300)

  const line = (await drawingState(page)).lines[0]
  expect(line.x1).toBeCloseTo(0, 0)
  expect(Math.max(line.x1, line.x2)).toBeCloseTo(150, -1)
})

test('double-click shows the grips instead of the frame', async ({ page }) => {
  await loadFixture(page)
  await clickAt(page, { x: 25, y: 0 })
  await expect(frame(page)).toBeVisible()
  await expect(page.locator('.ml-grip-handle')).toHaveCount(0)

  const point = await clientPoint(page, { x: 25, y: 0 })
  await page.mouse.dblclick(point.x, point.y)
  await expect(page.locator('.ml-grip-handle').first()).toBeVisible()
  await expect(frame(page)).toBeHidden()

  // Selecting something else goes back to the frame.
  await clickAt(page, { x: 50, y: 30 })
  await expect(page.locator('.ml-grip-handle')).toHaveCount(0)
  await expect(frame(page)).toBeVisible()
})

test('the status bar turns snapping on and off', async ({ page }) => {
  await loadFixture(page)
  expect((await drawingState(page)).osnapEnabled).toBe(true)
  await page.locator('[data-testid="osnap-toggle"]').click()
  expect((await drawingState(page)).osnapEnabled).toBe(false)
  await page.locator('[data-testid="osnap-toggle"]').click()
  expect((await drawingState(page)).osnapEnabled).toBe(true)
})
