import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import { uploadFixture } from '../helpers/fileUpload'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const samples = path.resolve(currentDir, '../../../../resources/cad-data/samples')

async function openExport(page: Page, label: string) {
  await page.getByText('File', { exact: true }).first().click()
  await page.getByText('Export', { exact: true }).first().hover()
  await page.getByText(label, { exact: true }).first().click()
}

/** Picks an option of the n-th select of the paper / scale fields. */
async function pickSheetOption(page: Page, index: number, option: string) {
  await page.locator('.ml-export-sheet-fields .el-select').nth(index).click()
  await page.getByRole('option', { name: option, exact: true }).click()
}

async function exportAs(page: Page, label: string, target: string) {
  await openExport(page, label)
  // Paper and scale dialog: keep Auto.
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'OK' }).click()
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

test('writes the chosen paper and scale as DXF limits', async ({ page }) => {
  await page.goto('/')
  await uploadFixture(page, path.join(samples, 'jww-sample.jww'))
  await expect(page.getByText('jww-sample.jww').first()).toBeVisible()

  await openExport(page, 'Export to DXF')
  await pickSheetOption(page, 0, 'A2')
  await pickSheetOption(page, 2, '1:200')
  await expect(page.getByText('Sheet: A2 Landscape 1:200')).toBeVisible()
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'OK' }).click()
  const dxf = await readFile(await (await download).path(), 'utf8')
  const value = (name: string) => {
    const lines = dxf.split(/\r?\n/).map(line => line.trim())
    const i = lines.indexOf(name)
    return [Number(lines[i + 2]), Number(lines[i + 4])]
  }
  const [x0, y0] = value('$LIMMIN')
  const [x1, y1] = value('$LIMMAX')
  expect(x1 - x0).toBeCloseTo(594 * 200, 3)
  expect(y1 - y0).toBeCloseTo(420 * 200, 3)
})
