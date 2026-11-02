import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import { uploadFixture } from '../helpers/fileUpload'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const fixture = (name: string) =>
  path.resolve(currentDir, '..', 'fixtures', name)

/**
 * Drops files onto the viewer the way the browser does: dragenter, dragover
 * and drop with a DataTransfer holding the files.
 */
async function dropFiles(
  page: Page,
  files: { name: string; type: string; base64: string }[]
) {
  const dataTransfer = await page.evaluateHandle(entries => {
    const dt = new DataTransfer()
    for (const entry of entries) {
      const bytes = Uint8Array.from(atob(entry.base64), c => c.charCodeAt(0))
      dt.items.add(new File([bytes], entry.name, { type: entry.type }))
    }
    return dt
  }, files)
  const target = page.locator('.ml-cad-container canvas').first()
  const box = await target.boundingBox()
  if (!box) throw new Error('canvas has no bounding box')
  const position = {
    clientX: box.x + box.width / 2,
    clientY: box.y + box.height / 2
  }
  await target.dispatchEvent('dragenter', { dataTransfer, ...position })
  await target.dispatchEvent('dragover', { dataTransfer, ...position })
  return { dataTransfer, target, position }
}

/** Solid red PNG (made in the page so no binary fixture is needed). */
async function redPngBase64(page: Page) {
  return page.evaluate(async () => {
    const canvas = document.createElement('canvas')
    canvas.width = 40
    canvas.height = 30
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#ff0000'
    ctx.fillRect(0, 0, 40, 30)
    const blob = await new Promise<Blob>(resolve =>
      canvas.toBlob(b => resolve(b!), 'image/png')
    )
    const bytes = new Uint8Array(await blob.arrayBuffer())
    let binary = ''
    for (const b of bytes) binary += String.fromCharCode(b)
    return btoa(binary)
  })
}

async function countRedPixels(page: Page) {
  const canvas = page.locator('.ml-cad-container canvas').first()
  const pngBase64 = (await canvas.screenshot()).toString('base64')
  return page.evaluate(async imageBase64 => {
    const image = new Image()
    image.src = `data:image/png;base64,${imageBase64}`
    await image.decode()
    const probe = document.createElement('canvas')
    probe.width = image.naturalWidth
    probe.height = image.naturalHeight
    const ctx = probe.getContext('2d')!
    ctx.drawImage(image, 0, 0)
    const { data } = ctx.getImageData(0, 0, probe.width, probe.height)
    let count = 0
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] > 200 && data[i + 1] < 60 && data[i + 2] < 60) count++
    }
    return count
  }, pngBase64)
}

test('dropping a drawing file onto the viewer opens it', async ({ page }) => {
  await page.goto('/')
  await uploadFixture(page, fixture('minimal-line.dxf'))
  await expect(page.locator('.ml-cad-container canvas').first()).toBeVisible()
  await expect(page.getByText('minimal-line.dxf').first()).toBeVisible()

  const { dataTransfer, target, position } = await dropFiles(page, [
    {
      name: 'two-lines.dxf',
      type: '',
      base64: readFileSync(fixture('two-lines.dxf')).toString('base64')
    }
  ])
  await expect(page.locator('.ml-cad-drop-overlay')).toBeVisible()
  await target.dispatchEvent('drop', { dataTransfer, ...position })
  await expect(page.locator('.ml-cad-drop-overlay')).toHaveCount(0)
  await expect(page.getByText('two-lines.dxf').first()).toBeVisible()
  await expect(page.getByText(/Failed to open/)).toHaveCount(0)
})

test('dropping an image inserts it into the open drawing', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', error => pageErrors.push(error.message))
  await page.goto('/')
  await uploadFixture(page, fixture('minimal-line.dxf'))
  await expect(page.locator('.ml-cad-container canvas').first()).toBeVisible()
  await page.waitForTimeout(1500)
  expect(await countRedPixels(page)).toBe(0)

  const { dataTransfer, target, position } = await dropFiles(page, [
    { name: 'red.png', type: 'image/png', base64: await redPngBase64(page) }
  ])
  await expect(page.locator('.ml-cad-drop-overlay')).toContainText(/image/i)
  await target.dispatchEvent('drop', { dataTransfer, ...position })

  await expect
    .poll(() => countRedPixels(page), { timeout: 15_000 })
    .toBeGreaterThan(1000)
  expect(pageErrors).toEqual([])
})
