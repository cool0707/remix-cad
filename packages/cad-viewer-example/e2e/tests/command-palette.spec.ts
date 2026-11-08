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
  await expect(page.locator('.ml-ccl-overlay:visible')).toHaveCount(0)
  // Keys go to the viewer.
  const canvas = page.locator('.ml-cad-container canvas').first()
  const box = (await canvas.boundingBox())!
  await page.mouse.click(box.x + 20, box.y + box.height - 20)
  await page.waitForTimeout(200)
}

/** Tool in use, whether a prompt waits, the selection and the current layer. */
async function viewerState(page: Page) {
  return page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    const docs = mod.AcApDocManager.instance
    const view = docs.curView
    return {
      tool: view.toolManager.state.tool as string,
      prompting: view.editor.isActive as boolean,
      selected: view.selectionSet.count as number,
      clayer: docs.curDocument.database.clayer as string
    }
  }, viewerModuleUrl!)
}

const palette = (page: Page) => page.locator('.ml-command-palette')
const paletteInput = (page: Page) => page.locator('.ml-command-palette-input')
const commandLine = (page: Page) => page.locator('.ml-cli-container')

/** Ids of the listed results. */
async function resultIds(page: Page) {
  return page
    .locator('.ml-command-palette-item')
    .evaluateAll(items => items.map(item => (item as HTMLElement).dataset.id))
}

async function search(page: Page, text: string) {
  await paletteInput(page).fill(text)
  await page.waitForTimeout(100)
}

test('simple: no command line; Ctrl+K finds and starts a command', async ({
  page
}) => {
  await loadFixture(page)
  await expect(commandLine(page)).toBeHidden()

  await page.keyboard.press('Control+k')
  await expect(palette(page)).toBeVisible()
  await expect(paletteInput(page)).toBeFocused()
  // An empty query lists commands, not layers.
  const all = await resultIds(page)
  expect(all.length).toBeGreaterThan(10)
  expect(all.some(id => id?.startsWith('layer:'))).toBe(false)

  // By the plain name, the command name or an alias.
  await search(page, 'rectangle')
  expect((await resultIds(page))[0]).toBe('command:rectang')
  await search(page, 'REC')
  expect((await resultIds(page))[0]).toBe('command:rectang')
  // By the CAD term: "block" finds "Place symbol".
  await search(page, 'block')
  expect(await resultIds(page)).toContain('command:insert')
  // Developer commands and system variables are not listed.
  await search(page, 'angbase')
  expect(await resultIds(page)).toEqual([])
  await expect(page.locator('.ml-command-palette-empty')).toBeVisible()

  await search(page, 'rectangle')
  await page.keyboard.press('Enter')
  await expect(palette(page)).toHaveCount(0)
  await expect.poll(async () => (await viewerState(page)).tool).toBe('rectang')

  // Esc in the palette closes only the palette, not the running tool.
  await page.keyboard.press('Control+k')
  await expect(palette(page)).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(palette(page)).toHaveCount(0)
  expect((await viewerState(page)).tool).toBe('rectang')
  await page.keyboard.press('Escape')
  await expect.poll(async () => (await viewerState(page)).tool).toBe('select')
})

test('edit actions and layers', async ({ page }) => {
  await loadFixture(page)
  await page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    const db = mod.AcApDocManager.instance.curDocument.database
    new mod.AcApLayerService(db).createLayers(['Walls'])
  }, viewerModuleUrl!)

  await page.keyboard.press('Control+k')
  await search(page, 'select all')
  expect((await resultIds(page))[0]).toBe('action:selectAll')
  await page.keyboard.press('Enter')
  await expect.poll(async () => (await viewerState(page)).selected).toBe(2)

  // A layer is found by its name; picking it makes it current.
  await page.keyboard.press('Control+k')
  await search(page, 'walls')
  expect(await resultIds(page)).toEqual(['layer:Walls'])
  await page.locator('.ml-command-palette-item').first().click()
  await expect.poll(async () => (await viewerState(page)).clayer).toBe('Walls')
})

test('status bar button opens the palette; a pick by mouse', async ({
  page
}) => {
  await loadFixture(page)
  await page.getByTestId('command-palette-button').click()
  await expect(palette(page)).toBeVisible()
  await search(page, 'line')
  await page.locator('.ml-command-palette-item[data-id="command:line"]').click()
  await expect.poll(async () => (await viewerState(page)).tool).toBe('line')
  await page.keyboard.press('Escape')

  // A press outside closes it.
  await page.getByTestId('command-palette-button').click()
  await expect(palette(page)).toBeVisible()
  await page.mouse.click(10, 300)
  await expect(palette(page)).toHaveCount(0)
})

test('simple: the command line comes up while a command asks for an option', async ({
  page
}) => {
  await loadFixture(page)
  await page.keyboard.press('Control+k')
  await search(page, 'offset')
  await page.keyboard.press('Enter')
  await expect.poll(async () => (await viewerState(page)).prompting).toBe(true)
  // The distance is typed at the cursor.
  await expect(commandLine(page)).toBeHidden()
  await page.keyboard.type('5')
  await page.keyboard.press('Enter')
  // Picking the object offers "Undo" / "Exit" in the command line.
  await expect(commandLine(page)).toBeVisible()
  await page.keyboard.press('Escape')
  await expect.poll(async () => (await viewerState(page)).prompting).toBe(false)
  await expect(commandLine(page)).toBeHidden()
})

test('CAD profile: the command line stays; system variables are listed', async ({
  page
}) => {
  await useCadProfile(page)
  await loadFixture(page)
  await expect(commandLine(page)).toBeVisible()

  await page.keyboard.press('Control+k')
  await expect(palette(page)).toBeVisible()
  await search(page, 'angbase')
  expect(await resultIds(page)).toEqual(['command:angbase'])
  await page.keyboard.press('Control+k')
  await expect(palette(page)).toHaveCount(0)
})
