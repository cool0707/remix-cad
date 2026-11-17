import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import { uploadFixture } from '../helpers/fileUpload'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
/**
 * Two ByLayer lines from (0, 0) to (100, 0) on layer 0 and from (0, 30) to
 * (100, 30) on layer A, and a line from (0, 60) to (100, 60) on layer A with
 * its own colour (ACI 7). Both layers are ACI 7 and Continuous.
 */
const fixturePath = path.resolve(
  currentDir,
  '..',
  'fixtures',
  'bylayer-lines.dxf'
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
}

async function clientPoint(page: Page, point: { x: number; y: number }) {
  return page.evaluate(
    async ({ url, point }) => {
      const mod = await import(/* @vite-ignore */ url)
      const view = mod.AcApDocManager.instance.curView
      const rect = view.canvas.getBoundingClientRect()
      const screen = view.worldToScreen(point)
      return { x: rect.left + screen.x, y: rect.top + screen.y }
    },
    { url: viewerModuleUrl!, point }
  )
}

interface LineStats {
  /** Strongest green minus red over the strip. */
  green: number
  /** Share of strip columns where the line shows. */
  coverage: number
}

/** Samples a horizontal line between two world x positions at height y. */
async function lineStats(
  page: Page,
  y: number,
  x0: number,
  x1: number
): Promise<LineStats> {
  const a = await clientPoint(page, { x: x0, y })
  const b = await clientPoint(page, { x: x1, y })
  const shot = await page.screenshot({
    clip: { x: a.x, y: a.y - 3, width: b.x - a.x, height: 7 }
  })
  return page.evaluate(async base64 => {
    const img = new Image()
    img.src = `data:image/png;base64,${base64}`
    await img.decode()
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0)
    const data = ctx.getImageData(0, 0, img.width, img.height).data
    let green = 0
    let lit = 0
    for (let x = 0; x < img.width; x++) {
      let columnLit = false
      for (let y = 0; y < img.height; y++) {
        const i = (y * img.width + x) * 4
        green = Math.max(green, data[i + 1] - data[i])
        if (Math.max(data[i], data[i + 1], data[i + 2]) > 60) columnLit = true
      }
      if (columnLit) lit++
    }
    return { green, coverage: lit / img.width }
  }, shot.toString('base64'))
}

/** Changes a layer the way the layer panel does (through the layer store). */
async function setLayerStyle(
  page: Page,
  layerName: string,
  style: { color?: number; linetype?: string }
) {
  await page.evaluate(
    async ({ url, layerName, style }) => {
      const mod = await import(/* @vite-ignore */ url)
      const doc = mod.AcApDocManager.instance.curDocument
      if (style.color != null) {
        const color = doc.database.tables.layerTable
          .getAt(layerName)
          .color.clone()
        color.colorIndex = style.color
        doc.layerStore.setLayerColor(layerName, color)
      }
      if (style.linetype) {
        mod.acapEnsureStandardLineType(doc.database, style.linetype)
        doc.layerStore.setLayerLinetype(layerName, style.linetype)
      }
    },
    { url: viewerModuleUrl!, layerName, style }
  )
}

async function expectFollowsLayer(page: Page, layerName: string, y: number) {
  const line = () => lineStats(page, y, 25, 75)
  expect((await line()).coverage).toBeGreaterThan(0.95)

  await setLayerStyle(page, layerName, { color: 1 })
  await setLayerStyle(page, layerName, { color: 3 })
  await expect.poll(async () => (await line()).green).toBeGreaterThan(100)

  await setLayerStyle(page, layerName, { linetype: 'DASHED' })
  await expect.poll(async () => (await line()).coverage).toBeLessThan(0.85)
  expect((await line()).green).toBeGreaterThan(100)
}

test('a ByLayer line of the opened drawing follows its layer', async ({
  page
}) => {
  await loadFixture(page)
  await expectFollowsLayer(page, 'A', 30)

  // The line with its own colour and linetype keeps both.
  const own = await lineStats(page, 60, 25, 75)
  expect(own.green).toBeLessThan(40)
  expect(own.coverage).toBeGreaterThan(0.95)
})

test('a ByLayer line drawn on a new layer follows its layer', async ({
  page
}) => {
  await loadFixture(page)
  await page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    const doc = mod.AcApDocManager.instance.curDocument
    new mod.AcApLayerService(doc.database).createLayers(['NEW'])
    doc.layerStore.setCurrentLayer('NEW')
  }, viewerModuleUrl!)

  const start = await clientPoint(page, { x: 20, y: 15 })
  const end = await clientPoint(page, { x: 80, y: 15 })
  await page.mouse.click(start.x, start.y - 40)
  await page.keyboard.press('KeyL')
  await page.mouse.click(start.x, start.y)
  await page.mouse.click(end.x, end.y)
  await page.keyboard.press('Escape')
  await page.keyboard.press('Escape')

  await expect
    .poll(() =>
      page.evaluate(async url => {
        const mod = await import(/* @vite-ignore */ url)
        const db = mod.AcApDocManager.instance.curDocument.database
        let count = 0
        for (const entity of db.tables.blockTable.modelSpace.newIterator()) {
          if (entity.layer === 'NEW' && entity.color.isByLayer) count++
        }
        return count
      }, viewerModuleUrl!)
    )
    .toBe(1)

  await expectFollowsLayer(page, 'NEW', 15)
})
