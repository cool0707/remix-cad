import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import { uploadFixture } from '../helpers/fileUpload'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const fixtures = path.resolve(currentDir, '../fixtures')
const SIMPLE_VIEWER_SRC =
  '/@fs' + path.resolve(currentDir, '../../../cad-simple-viewer/src/index.ts')

/** Camera of the document on screen, and how many documents are open. */
async function camera(page: Page) {
  return page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    const docs = mod.AcApDocManager.instance
    const internal = docs.curView.internalCamera
    return {
      documents: docs.documents.length as number,
      x: Number(internal.position.x.toFixed(3)),
      y: Number(internal.position.y.toFixed(3)),
      zoom: Number(internal.zoom.toFixed(5))
    }
  }, SIMPLE_VIEWER_SRC)
}

// Every open document has its own camera controls, and they all listen on
// the one canvas. A document that is not on screen must not follow the input
// meant for the one that is.
test('zooming one document leaves the view of the other as it was', async ({
  page
}) => {
  await page.goto('/')
  await uploadFixture(page, path.join(fixtures, 'two-lines.dxf'))
  await expect(page.getByText('two-lines.dxf').first()).toBeVisible()
  // Let the initial fit and the side panels settle.
  await page.waitForTimeout(1500)
  const first = await camera(page)

  // A second drawing opens in a session of its own; the first is parked.
  await page.evaluate(
    async ([url, dxf]) => {
      const mod = await import(/* @vite-ignore */ url)
      const bytes = new TextEncoder().encode(dxf)
      await mod.AcApDocManager.instance.openDocument(
        'second.dxf',
        bytes.buffer,
        { mode: mod.AcEdOpenMode.Write }
      )
    },
    [
      SIMPLE_VIEWER_SRC,
      readFileSync(path.join(fixtures, 'minimal-line.dxf'), 'utf8')
    ] as const
  )
  await page.waitForTimeout(1500)
  const second = await camera(page)
  expect(second.documents).toBe(2)

  const canvas = page.locator('.ml-cad-container canvas').first()
  const box = (await canvas.boundingBox())!
  await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.3)
  for (let step = 0; step < 6; step++) {
    await page.mouse.wheel(0, -240)
    await page.waitForTimeout(60)
  }
  await page.waitForTimeout(500)
  // The visible drawing did zoom.
  expect((await camera(page)).zoom).not.toBe(second.zoom)

  await page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    const docs = mod.AcApDocManager.instance
    await docs.activateDocument(docs.documents[0])
  }, SIMPLE_VIEWER_SRC)
  await page.waitForTimeout(800)
  const back = await camera(page)
  expect({ x: back.x, y: back.y, zoom: back.zoom }).toEqual({
    x: first.x,
    y: first.y,
    zoom: first.zoom
  })
})
