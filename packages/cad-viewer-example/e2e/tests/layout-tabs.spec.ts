import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import { uploadFixture } from '../helpers/fileUpload'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
/** Layouts: Model, Planta, Alçados. */
const fixturePath = path.resolve(
  currentDir,
  '..',
  'fixtures',
  'find-layouts.dxf'
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

const tabs = (page: Page) => page.locator('.ml-layout-tabs-button')
const tab = (page: Page, name: string) =>
  page.locator('.ml-layout-tabs-button', { hasText: name })
const menuItem = (page: Page, name: string) =>
  page.locator('.ml-layout-tabs-menu-item', { hasText: name })

async function tabNames(page: Page) {
  return (await tabs(page).allInnerTexts()).map(text => text.trim())
}

/** Layout names in tab order, the current one and their limits. */
async function layoutState(page: Page) {
  expect(viewerModuleUrl, 'viewer module url captured').toBeTruthy()
  return page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    const db = mod.AcApDocManager.instance.curDocument.database
    const layouts = mod.acapListLayouts(db) as {
      layoutName: string
      tabOrder: number
      blockTableRecordId: string
      limits: { max: { x: number; y: number } }
    }[]
    return {
      names: layouts.map(layout => layout.layoutName),
      orders: layouts.map(layout => layout.tabOrder),
      current: layouts.find(
        layout => layout.blockTableRecordId === db.currentSpaceId
      )?.layoutName,
      limits: Object.fromEntries(
        layouts.map(layout => [
          layout.layoutName,
          [layout.limits.max.x, layout.limits.max.y]
        ])
      ),
      dictKeys: [...db.objects.layout.entries()].map(([key]) => key)
    }
  }, viewerModuleUrl!)
}

async function loadFixture(page: Page) {
  await page.goto('/')
  await uploadFixture(page, fixturePath)
  await expect(page.locator('.ml-cad-container')).toBeVisible({
    timeout: 30000
  })
  await expect(tabs(page)).toHaveCount(3, { timeout: 30000 })
  // The status bar ignores the pointer while the file is still opening.
  await expect(page.locator('.ml-status-bar.is-disabled')).toHaveCount(0, {
    timeout: 30000
  })
  // Neither does the busy overlay shown while the drawing is processed.
  await expect(page.locator('.ml-ccl-overlay:visible')).toHaveCount(0, {
    timeout: 30000
  })
}

test('plus button adds a print page and makes it current', async ({ page }) => {
  await loadFixture(page)
  await page.locator('.ml-layout-tabs-add-button').click()
  await expect(tabs(page)).toHaveCount(4)
  const state = await layoutState(page)
  expect(state.names).toHaveLength(4)
  const added = state.names[3]
  expect(state.current).toBe(added)
  // Page setup copied from the last print page, else A3 landscape.
  expect(state.orders).toEqual([0, 1, 2, 3])
  await expect(tab(page, added)).toHaveClass(/el-button--primary/)
})

test('tab menu renames, copies and deletes', async ({ page }) => {
  await loadFixture(page)

  await tab(page, 'Planta').click({ button: 'right' })
  await expect(page.locator('.ml-layout-tabs-menu')).toBeVisible()
  await menuItem(page, 'Rename').click()
  const input = page.locator('.el-message-box input')
  await input.fill('Alçados')
  await expect(page.locator('.el-message-box__errormsg')).toContainText(
    'already used'
  )
  await input.fill('Floor plan')
  await page
    .locator('.el-message-box')
    .getByRole('button', { name: 'OK' })
    .click()
  await expect(tab(page, 'Floor plan')).toBeVisible()
  let state = await layoutState(page)
  expect(state.names).toEqual(['Model', 'Floor plan', 'Alçados'])
  expect(state.dictKeys).toContain('Floor plan')
  expect(state.dictKeys).not.toContain('Planta')

  await tab(page, 'Floor plan').click({ button: 'right' })
  await menuItem(page, 'Copy').click()
  await expect(tabs(page)).toHaveCount(4)
  state = await layoutState(page)
  expect(state.names).toEqual([
    'Model',
    'Floor plan',
    'Floor plan (2)',
    'Alçados'
  ])
  expect(state.current).toBe('Floor plan (2)')

  await tab(page, 'Floor plan (2)').click({ button: 'right' })
  await menuItem(page, 'Delete').click()
  await page
    .locator('.el-message-box')
    .getByRole('button', { name: 'Delete' })
    .click()
  await expect(tabs(page)).toHaveCount(3)
  state = await layoutState(page)
  expect(state.names).toEqual(['Model', 'Floor plan', 'Alçados'])
  expect(state.current).toBe('Alçados')
})

test('model tab menu has only new print page', async ({ page }) => {
  await loadFixture(page)
  await tabs(page).first().click({ button: 'right' })
  await expect(page.locator('.ml-layout-tabs-menu-item')).toHaveCount(1)
  await page.keyboard.press('Escape')
  await expect(page.locator('.ml-layout-tabs-menu')).toHaveCount(0)
})

test('page setup sets the paper of a print page', async ({ page }) => {
  await loadFixture(page)
  await tab(page, 'Planta').click({ button: 'right' })
  await menuItem(page, 'Page setup').click()
  const dialog = page.locator('.ml-base-dialog')
  await expect(dialog).toBeVisible()
  await dialog.locator('.el-select').click()
  await page.locator('.el-select-dropdown__item', { hasText: 'A4' }).click()
  await dialog.getByText('Portrait').click()
  await dialog.getByRole('button', { name: 'OK' }).click()
  await expect(dialog).toHaveCount(0)
  const state = await layoutState(page)
  // Millimetre drawing: A4 portrait = 210 × 297.
  const [w, h] = state.limits['Planta']
  expect(h / w).toBeCloseTo(297 / 210, 3)
})

test('dragging a tab reorders the print pages', async ({ page }) => {
  await loadFixture(page)
  const before = await layoutState(page)
  const source = await tab(page, 'Alçados').boundingBox()
  const target = await tab(page, 'Planta').boundingBox()
  expect(source && target).toBeTruthy()
  await page.mouse.move(source!.x + source!.width / 2, source!.y + 5)
  await page.mouse.down()
  await page.mouse.move(target!.x + 4, target!.y + 5, { steps: 8 })
  await expect(page.locator('.ml-layout-tabs-drop-indicator')).toBeVisible()
  await page.mouse.up()
  await expect
    .poll(() => tabNames(page))
    .toEqual([expect.any(String), 'Alçados', 'Planta'])
  const state = await layoutState(page)
  expect(state.names).toEqual(['Model', 'Alçados', 'Planta'])
  expect(state.orders).toEqual([0, 1, 2])
  // The drag does not switch tabs.
  expect(state.current).toBe(before.current)
})
