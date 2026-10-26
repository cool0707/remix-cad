import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import { uploadFixture } from '../helpers/fileUpload'
import { useCadProfile } from '../helpers/operationProfile'

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
  // Repeating commands (LINE, COPY) run as in AutoCAD in the CAD profile.
  await useCadProfile(page)
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

async function dblclickAt(page: Page, point: { x: number; y: number }) {
  const client = await clientPoint(page, point)
  await page.mouse.move(client.x, client.y, { steps: 3 })
  await page.mouse.dblclick(client.x, client.y)
  await page.waitForTimeout(300)
}

async function run(page: Page, command: string) {
  await page.evaluate(
    async ({ url, command }) => {
      const mod = await import(/* @vite-ignore */ url)
      mod.AcApDocManager.instance.sendStringToExecute(command)
    },
    { url: viewerModuleUrl!, command }
  )
  await expect.poll(async () => (await state(page)).running).toBe(true)
}

/** Selects every model-space entity (the two fixture lines). */
async function selectAll(page: Page) {
  await page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    const docs = mod.AcApDocManager.instance
    const ids: string[] = []
    for (const entity of docs.curDocument.database.tables.blockTable.modelSpace.newIterator()) {
      ids.push(entity.objectId)
    }
    docs.curView.selectionSet.add(ids)
  }, viewerModuleUrl!)
}

test('LINE: right-click takes the last segment back, double-click ends', async ({
  page
}) => {
  await loadFixture(page)
  await clickAt(page, { x: 50, y: 15 })

  await run(page, 'line')
  await clickAt(page, { x: 10, y: 10 })
  await clickAt(page, { x: 20, y: 10 })
  await clickAt(page, { x: 20, y: 20 })
  expect((await state(page)).shown).toBe(4)

  await clickAt(page, { x: 30, y: 20 }, 'right')
  const current = await state(page)
  expect(current.running).toBe(true)
  expect(current.shown).toBe(3)

  await clickAt(page, { x: 30, y: 20 })
  expect((await state(page)).shown).toBe(4)
  // The first click of the pair adds a segment; the second ends LINE.
  await dblclickAt(page, { x: 40, y: 20 })
  await expect.poll(async () => (await state(page)).running).toBe(false)
  expect((await state(page)).shown).toBe(5)
})

test('COPY: right-click takes the last copy back, double-click ends', async ({
  page
}) => {
  await loadFixture(page)
  await clickAt(page, { x: 50, y: 15 })

  await selectAll(page)
  await run(page, 'copy')
  await clickAt(page, { x: 50, y: 15 })
  await clickAt(page, { x: 50, y: 20 })
  await clickAt(page, { x: 50, y: 25 })
  expect((await state(page)).shown).toBe(6)

  await clickAt(page, { x: 50, y: 20 }, 'right')
  const current = await state(page)
  expect(current.running).toBe(true)
  expect(current.shown).toBe(4)

  await dblclickAt(page, { x: 50, y: 20 })
  await expect.poll(async () => (await state(page)).running).toBe(false)
  expect((await state(page)).shown).toBe(6)
})
