import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import { uploadFixture } from '../helpers/fileUpload'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const samples = path.resolve(currentDir, '../../../../resources/cad-data/samples')

async function exportAs(page: Page, label: string, target: string) {
  await page.getByText('File', { exact: true }).first().click()
  await page.getByText('Export', { exact: true }).first().hover()
  const download = page.waitForEvent('download')
  await page.getByText(label, { exact: true }).first().click()
  const file = await download
  await file.saveAs(target)
  return file.suggestedFilename()
}

for (const [label, extension] of [
  ['Export to JWW', 'jww'],
  ['Export to SFC', 'sfc'],
  ['Export to P21', 'p21']
] as const) {
  test(`exports a drawing as ${extension} and opens it again`, async ({
    page
  }, testInfo) => {
    const pageErrors: string[] = []
    page.on('pageerror', error => pageErrors.push(error.message))

    await page.goto('/')
    await uploadFixture(page, path.join(samples, 'jww-sample.jww'))
    await expect(page.getByText('jww-sample.jww').first()).toBeVisible()

    const target = testInfo.outputPath(`exported.${extension}`)
    expect(await exportAs(page, label, target)).toBe(`jww-sample.${extension}`)
    await expect(page.getByText(/Could not export/)).toHaveCount(0)

    // Open the written file in a fresh viewer.
    await page.goto('/')
    await uploadFixture(page, target)
    await expect(page.getByText(`exported.${extension}`).first()).toBeVisible()
    await expect(page.getByText(/Failed to open/)).toHaveCount(0)
    expect(pageErrors).toEqual([])
  })
}
