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

/** Model-space entities, how many of them the view shows, and the tool state. */
async function state(page: Page) {
  return page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    const docs = mod.AcApDocManager.instance
    const view = docs.curView
    let entities = 0
    let shown = 0
    for (const entity of docs.curDocument.database.tables.blockTable.modelSpace.newIterator()) {
      entities++
      if (view.hasEntity(entity.objectId)) shown++
    }
    return {
      entities,
      shown,
      running: view.toolManager.isCommandRunning as boolean
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

async function clickAt(
  page: Page,
  point: { x: number; y: number },
  button: 'left' | 'right' = 'left'
) {
  const client = await clientPoint(page, point)
  await page.mouse.move(client.x, client.y, { steps: 3 })
  await page.mouse.click(client.x, client.y, { button })
  await page.waitForTimeout(300)
}

async function startOffset(page: Page) {
  await page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    mod.AcApDocManager.instance.sendStringToExecute('offset')
  }, viewerModuleUrl!)
  await expect.poll(async () => (await state(page)).running).toBe(true)
}

test('each offset shows at once; right-click takes the last distance', async ({
  page
}) => {
  await loadFixture(page)
  // Keys reach the viewer once it has the focus.
  await clickAt(page, { x: 50, y: 15 })

  await startOffset(page)
  await page.keyboard.type('5')
  await page.keyboard.press('Enter')
  await clickAt(page, { x: 50, y: 0 })
  await clickAt(page, { x: 50, y: -3 })

  // Still in OFFSET (selecting the next object), and the new line is drawn.
  let current = await state(page)
  expect(current.running).toBe(true)
  expect(current.entities).toBe(3)
  expect(current.shown).toBe(3)

  // Right-click at the selection prompt ends the command.
  await clickAt(page, { x: 50, y: 15 }, 'right')
  await expect.poll(async () => (await state(page)).running).toBe(false)

  // Next run: right-click accepts the default distance <5> and goes on.
  await startOffset(page)
  await clickAt(page, { x: 50, y: 15 }, 'right')
  expect((await state(page)).running).toBe(true)
  await clickAt(page, { x: 50, y: 30 })
  await clickAt(page, { x: 50, y: 33 })
  current = await state(page)
  expect(current.entities).toBe(4)
  expect(current.shown).toBe(4)
})
