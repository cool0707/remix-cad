import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, test } from '@playwright/test'

import { uploadFixture } from '../helpers/fileUpload'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
/** Layers 0 (current) and DOORS. */
const fixturePath = path.resolve(
  currentDir,
  '..',
  'fixtures',
  'symbol-attributes.dxf'
)

test('the pencil before a layer name makes it the current layer', async ({
  page
}) => {
  let viewerModuleUrl: string | undefined
  page.on('request', request => {
    if (
      /cad-simple-viewer\/(src\/index\.ts|dist\/cad-simple-viewer\.js)/.test(
        request.url()
      )
    ) {
      viewerModuleUrl = request.url()
    }
  })
  await page.goto('/')
  await uploadFixture(page, fixturePath, { accessMode: 'Write' })
  await expect(page.locator('.ml-cad-container')).toBeVisible({
    timeout: 30000
  })

  const pencil = (layer: string) =>
    page
      .locator('.ml-layer-table tr', {
        has: page.locator('.ml-layer-table-name-text', {
          hasText: new RegExp(`^${layer}$`)
        })
      })
      .locator('.ml-layer-table-current-button')
  const currentLayer = () =>
    page.evaluate(async url => {
      const mod = await import(/* @vite-ignore */ url)
      return mod.AcApDocManager.instance.curDocument.database.clayer as string
    }, viewerModuleUrl!)

  await expect(pencil('0')).toHaveClass(/is-current/)
  await expect(pencil('DOORS')).not.toHaveClass(/is-current/)

  await pencil('DOORS').click()
  await expect.poll(currentLayer).toBe('DOORS')
  await expect(pencil('DOORS')).toHaveClass(/is-current/)
  await expect(pencil('0')).not.toHaveClass(/is-current/)
  await page
    .locator('.ml-layer-table')
    .screenshot({ path: test.info().outputPath('layer-table.png') })
})
