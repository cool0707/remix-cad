import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import { uploadFixture } from '../helpers/fileUpload'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
/**
 * One symbol on layer SYMBOL whose contents are on WALL and DIM
 * (see multi-layer-symbol.spec.ts).
 */
const fixturePath = path.resolve(
  currentDir,
  '..',
  'fixtures',
  'multi-layer-symbol.dxf'
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

/** Layers, model space entities and whether the view draws them. */
async function readState(page: Page) {
  expect(viewerModuleUrl, 'viewer module url captured').toBeTruthy()
  return page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    const manager = mod.AcApDocManager.instance
    const db = manager.curDocument.database
    const entities = [...db.tables.blockTable.modelSpace.newIterator()]
    return {
      layers: [...db.tables.layerTable.newIterator()].map(
        (layer: { name: string }) => layer.name
      ),
      entities: entities.map(
        (entity: { type: string; layer: string }) =>
          `${entity.type}@${entity.layer}`
      ),
      drawn: entities.map((entity: { objectId: string }) =>
        manager.curView.hasEntity(entity.objectId)
      )
    }
  }, viewerModuleUrl!)
}

test('undoes a layer deleted from the layer panel with Ctrl+Z', async ({
  page
}) => {
  await page.goto('/')
  await uploadFixture(page, fixturePath)
  await expect(page.locator('.ml-cad-container')).toBeVisible({
    timeout: 30000
  })
  await page.waitForTimeout(2500)
  await expect.poll(async () => (await readState(page)).drawn).toEqual([true])

  await page.getByText('SYMBOL', { exact: true }).first().click()
  await page
    .getByRole('button', { name: /Delete layer/i })
    .first()
    .click()
  await expect.poll(async () => (await readState(page)).entities).toEqual([])

  // The focus is still on the layer panel's button.
  await page.keyboard.press('Control+z')
  await expect
    .poll(() => readState(page))
    .toEqual({
      layers: ['0', 'WALL', 'DIM', 'SYMBOL'],
      entities: ['BlockReference@SYMBOL'],
      drawn: [true]
    })
})
