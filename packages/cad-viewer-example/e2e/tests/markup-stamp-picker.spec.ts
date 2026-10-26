import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import { uploadFixture } from '../helpers/fileUpload'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const fixturePath = path.resolve(currentDir, '../fixtures/two-lines.dxf')

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

async function runCommand(page: Page, command: string) {
  await page.evaluate(
    async ({ url, command }) => {
      const mod = await import(/* @vite-ignore */ url!)
      mod.AcApDocManager.instance.sendStringToExecute(command)
    },
    { url: viewerModuleUrl, command }
  )
}

test('MARKUPSTAMP lets the user pick a stamp from a gallery', async ({
  page
}) => {
  await page.goto('/')
  await uploadFixture(page, fixturePath, { accessMode: 'Comments' })
  await expect(page.locator('.ml-cad-container')).toBeVisible({
    timeout: 30000
  })
  await expect.poll(() => viewerModuleUrl).toBeTruthy()

  await runCommand(page, 'markupstamp')

  const dialog = page.locator('.ml-ui-stamp-picker-dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.locator('.ml-ui-stamp-tile')).toHaveCount(5)

  await dialog.locator('.ml-ui-stamp-caption input').fill('A-101')
  await dialog.locator('[data-stamp-id="rejected"]').click()
  await expect(dialog).toBeHidden()

  const canvas = page.locator('.ml-cad-container canvas').first()
  const box = (await canvas.boundingBox())!
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)

  const stamp = page.locator('.ml-html-stamp')
  await expect(stamp).toHaveCount(1)
  await expect(stamp.locator('.ml-html-stamp-badge')).toHaveText('REJECTED')
  await expect(stamp.locator('.ml-html-stamp-text')).toHaveText('A-101')
})
