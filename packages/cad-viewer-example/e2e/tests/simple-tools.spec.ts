import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import { uploadFixture } from '../helpers/fileUpload'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
/** Two horizontal lines: y = 0 and y = 30, both from x = 0 to x = 100. */
const fixturePath = path.resolve(currentDir, '..', 'fixtures', 'two-lines.dxf')

const LOWER = { x: 25, y: 0 }

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
}

/** Reads view / document state through the viewer module. */
async function viewState(page: Page) {
  expect(viewerModuleUrl, 'viewer module url captured').toBeTruthy()
  return page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    const docs = mod.AcApDocManager.instance
    const view = docs.curView
    let entities = 0
    for (const _ of docs.curDocument.database.tables.blockTable.modelSpace.newIterator()) {
      entities++
    }
    return {
      mode: view.mode as number,
      cursor: view.canvas.style.cursor as string,
      selected: view.selectionSet.count as number,
      tool: view.toolManager.state.tool as string,
      running: view.toolManager.isCommandRunning as boolean,
      entities
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

const toolStatus = (page: Page) => page.locator('.ml-tool-status')

test('L draws one line and goes back to the select tool', async ({ page }) => {
  await loadFixture(page)
  await expect(toolStatus(page)).toHaveText('Select')
  expect((await viewState(page)).cursor).toBe('default')
  const before = (await viewState(page)).entities
  // Keys reach the viewer once it has the focus.
  await clickAt(page, { x: 50, y: 15 })

  await page.keyboard.press('KeyL')
  await expect(toolStatus(page)).toContainText('Line')
  await expect.poll(async () => (await viewState(page)).tool).toBe('line')
  // Tool name next to the cursor, in front of the prompt.
  await expect(page.locator('.ml-floating-input-tool').first()).toHaveText(
    'Line:'
  )

  // Between the two fixture lines, away from their snap points.
  await clickAt(page, { x: 20, y: 10 })
  await clickAt(page, { x: 80, y: 20 })

  await expect.poll(async () => (await viewState(page)).running).toBe(false)
  const after = await viewState(page)
  expect(after.entities).toBe(before + 1)
  expect(after.tool).toBe('select')
  expect(after.cursor).toBe('default')
  await expect(toolStatus(page)).toHaveText('Select')
})

test('Esc cancels the tool first, then clears the selection', async ({
  page
}) => {
  await loadFixture(page)
  await clickAt(page, LOWER)
  await expect.poll(async () => (await viewState(page)).selected).toBe(1)

  // H: pan tool. Esc goes back to the select tool and keeps the selection.
  await page.keyboard.press('KeyH')
  await expect.poll(async () => (await viewState(page)).tool).toBe('pan')
  expect((await viewState(page)).cursor).toBe('grab')
  await page.keyboard.press('Escape')
  await expect.poll(async () => (await viewState(page)).tool).toBe('select')
  expect((await viewState(page)).selected).toBe(1)

  // A running tool: Esc cancels it and keeps the selection.
  await page.keyboard.press('KeyR')
  await expect.poll(async () => (await viewState(page)).running).toBe(true)
  await page.keyboard.press('Escape')
  await expect.poll(async () => (await viewState(page)).running).toBe(false)
  expect((await viewState(page)).selected).toBe(1)

  // Nothing left to cancel: Esc clears the selection.
  await page.keyboard.press('Escape')
  await expect.poll(async () => (await viewState(page)).selected).toBe(0)
})

test('Space held pans and gives the tool back', async ({ page }) => {
  await loadFixture(page)
  await clickAt(page, { x: 50, y: 15 })

  await page.keyboard.down('Space')
  await expect.poll(async () => (await viewState(page)).mode).toBe(1)
  expect((await viewState(page)).cursor).toBe('grab')
  await page.keyboard.up('Space')
  await expect.poll(async () => (await viewState(page)).mode).toBe(0)
  expect((await viewState(page)).cursor).toBe('default')
})

test('single-key tools are off in the CAD profile', async ({ page }) => {
  await loadFixture(page)
  await page.locator('.ml-operation-profile-button').click()
  await clickAt(page, { x: 50, y: 15 })

  await page.keyboard.press('KeyL')
  await page.waitForTimeout(300)
  const state = await viewState(page)
  expect(state.running).toBe(false)
  expect(state.cursor).not.toBe('default')
})
