import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import { uploadFixture } from '../helpers/fileUpload'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
/**
 * Two DOOR symbols (20 × 20, inserted at x = 0 and x = 40) on layer DOORS.
 * Attributes: MARK (prompt "記号", D1 / D2), WIDTH (prompt "幅", 800 / 800)
 * and the hidden MAKER (ACME). Two lines on layer 0 below them
 * (y = -20 and y = -30, x = 0 … 60).
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
  await uploadFixture(page, fixturePath)
  await expect(page.locator('.ml-cad-container')).toBeVisible({
    timeout: 30000
  })
  await page.waitForTimeout(2500)
  await page.locator('.ml-overflow-tab', { hasText: 'Properties' }).click()
}

/** Selects the entities of the given DXF types (in drawing order). */
async function selectByType(page: Page, types: string[]) {
  expect(viewerModuleUrl, 'viewer module url captured').toBeTruthy()
  await page.evaluate(
    async ({ url, types }) => {
      const mod = await import(/* @vite-ignore */ url)
      const manager = mod.AcApDocManager.instance
      const ids: string[] = []
      for (const entity of manager.curDocument.database.tables.blockTable.modelSpace.newIterator()) {
        if (types.includes(entity.type)) ids.push(entity.objectId)
      }
      manager.curView.selectionSet.clear()
      manager.curView.selectionSet.add(ids)
    },
    { url: viewerModuleUrl!, types }
  )
}

async function readDrawing(page: Page) {
  return page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    const db = mod.AcApDocManager.instance.curDocument.database
    const symbols: {
      x: number
      layer: string
      attrs: Record<string, string>
    }[] = []
    const lines: { layer: string; startY: number }[] = []
    for (const entity of db.tables.blockTable.modelSpace.newIterator()) {
      if (entity.type === 'BlockReference') {
        const attrs: Record<string, string> = {}
        for (const attr of entity.attributeIterator()) {
          attrs[attr.tag] = attr.textString
        }
        symbols.push({ x: entity.position.x, layer: entity.layer, attrs })
      } else if (entity.type === 'Line') {
        lines.push({ layer: entity.layer, startY: entity.startPoint.y })
      }
    }
    return { symbols, lines }
  }, viewerModuleUrl!)
}

async function undo(page: Page) {
  await page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    mod.AcApDocManager.instance.sendStringToExecute('undo')
  }, viewerModuleUrl!)
  await page.waitForTimeout(300)
}

const inspector = (page: Page) => page.locator('.ml-entity-properties')
const field = (page: Page, tag: string) =>
  inspector(page).locator(`[data-symbol-tag="${tag}"] input`)

test('shows symbol properties with prompts, mixed values and hidden fields', async ({
  page
}) => {
  await loadFixture(page)
  await selectByType(page, ['BlockReference'])

  await expect(inspector(page)).toContainText('Selection')
  await expect(inspector(page)).toContainText('Placement')
  // Labels come from the ATTDEF prompt, falling back to the tag.
  await expect(inspector(page)).toContainText('記号')
  await expect(inspector(page)).toContainText('幅')
  await expect(inspector(page)).toContainText('MAKER')
  await expect(
    inspector(page).locator('[data-symbol-tag="MAKER"]')
  ).toHaveClass(/is-invisible/)

  await expect(field(page, 'MARK')).toHaveValue('')
  await expect(field(page, 'MARK')).toHaveAttribute('placeholder', 'Mixed')
  await expect(field(page, 'WIDTH')).toHaveValue('800')
})

test('edits a symbol property of every selected symbol in one undo step', async ({
  page
}) => {
  await loadFixture(page)
  await selectByType(page, ['BlockReference'])

  await field(page, 'MARK').fill('D9')
  await field(page, 'MARK').press('Enter')
  await expect
    .poll(async () => (await readDrawing(page)).symbols.map(s => s.attrs.MARK))
    .toEqual(['D9', 'D9'])
  await expect(field(page, 'MARK')).toHaveValue('D9')

  await undo(page)
  await expect
    .poll(async () => (await readDrawing(page)).symbols.map(s => s.attrs.MARK))
    .toEqual(['D1', 'D2'])
  await expect(field(page, 'MARK')).toHaveAttribute('placeholder', 'Mixed')
})

test('moves the selection with the X field and lists entity types', async ({
  page
}) => {
  await loadFixture(page)
  await selectByType(page, ['BlockReference', 'Line'])

  const types = inspector(page).locator('.ml-inspector-types__item')
  await expect(types).toHaveCount(2)
  await expect(inspector(page)).toContainText('Total length')

  // Bottom-left reference point by default: X = left edge (0).
  const x = inspector(page)
    .locator('.ml-inspector-box__field')
    .first()
    .locator('input')
  await expect(x).toHaveValue('0')
  await x.fill('100')
  await x.press('Enter')
  await expect
    .poll(async () => (await readDrawing(page)).symbols.map(s => s.x))
    .toEqual([100, 140])

  // Clicking a type narrows the selection to it.
  await types.filter({ hasText: 'Line' }).click()
  await expect(types).toHaveCount(1)
  await expect(types).toContainText('Line')
  await expect(inspector(page)).toContainText('2 entities selected')
})

test('changes the layer of mixed entities at once', async ({ page }) => {
  await loadFixture(page)
  await selectByType(page, ['BlockReference', 'Line'])

  await expect(inspector(page).locator('.ml-layer-select')).toContainText(
    'Mixed'
  )
  await inspector(page).locator('.ml-layer-select').first().click()
  await page
    .locator('.el-select-dropdown__item:visible', { hasText: 'DOORS' })
    .first()
    .click()
  await expect
    .poll(async () => {
      const { symbols, lines } = await readDrawing(page)
      return [...symbols, ...lines].map(e => e.layer)
    })
    .toEqual(['DOORS', 'DOORS', 'DOORS', 'DOORS'])
})

test('double-click on a symbol focuses its field in the simple profile', async ({
  page
}) => {
  await loadFixture(page)
  await page.locator('.ml-overflow-tab', { hasText: 'Layers' }).click()

  const client = await page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    const view = mod.AcApDocManager.instance.curView
    const rect = view.canvas.getBoundingClientRect()
    // On the symbol's top edge (a line of the block).
    const screen = view.worldToScreen({ x: 10, y: 20 })
    return { x: rect.left + screen.x, y: rect.top + screen.y }
  }, viewerModuleUrl!)
  await page.mouse.dblclick(client.x, client.y)

  await expect(page.locator('.ml-att-edit-dlg')).toHaveCount(0)
  await expect(field(page, 'MARK')).toBeFocused()
  await expect(field(page, 'MARK')).toHaveValue('D1')
})
