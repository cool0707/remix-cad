import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import { uploadFixture } from '../helpers/fileUpload'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
// A floor plan of two rooms whose walls overlap the grid lines, with a door
// swing in the right room and a circle in the middle of the left room.
const jwwSamplePath = path.resolve(
  currentDir,
  '../../../../resources/cad-data/samples/jww-sample.jww'
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

async function loadSample(page: Page) {
  await page.goto('/')
  await uploadFixture(page, jwwSamplePath, { accessMode: 'Write' })
  await expect(page.locator('.ml-cad-container')).toBeVisible({
    timeout: 30000
  })
  await expect(page.getByText('jww-sample.jww').first()).toBeVisible({
    timeout: 30000
  })
  await expect
    .poll(() =>
      page.evaluate(async url => {
        if (!url) return true
        const mod = await import(/* @vite-ignore */ url)
        return mod.AcApDocManager.instance.curView
          .isProcessingEntities as boolean
      }, viewerModuleUrl)
    )
    .toBe(false)
}

/** The full circle in the left room (center and radius, in WCS). */
async function leftRoomCircle(page: Page) {
  return page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    const db = mod.AcApDocManager.instance.curDocument.database
    for (const entity of db.tables.blockTable.modelSpace.newIterator()) {
      if (entity.dxfTypeName === 'CIRCLE') {
        return {
          x: entity.center.x as number,
          y: entity.center.y as number,
          r: entity.radius as number
        }
      }
    }
    throw new Error('no circle')
  }, viewerModuleUrl!)
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

/** Loop count and bounding-box size of every hatch in model space. */
async function hatches(page: Page) {
  return page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    const db = mod.AcApDocManager.instance.curDocument.database
    const out: Array<{ loops: number; width: number; height: number }> = []
    for (const entity of db.tables.blockTable.modelSpace.newIterator()) {
      if (entity.dxfTypeName !== 'HATCH') continue
      const box = entity.geometricExtents
      out.push({
        loops: entity._geo.loops.length,
        width: box.max.x - box.min.x,
        height: box.max.y - box.min.y
      })
    }
    return out
  }, viewerModuleUrl!)
}

test('HATCH fills the room around a clicked point, leaving the circle as an island', async ({
  page
}) => {
  const pageErrors: string[] = []
  page.on('pageerror', error => pageErrors.push(error.message))
  await loadSample(page)
  const circle = await leftRoomCircle(page)

  await page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    mod.AcApDocManager.instance.sendStringToExecute('hatch')
  }, viewerModuleUrl!)
  await page.waitForTimeout(500)

  // Next to the circle, inside the left room.
  const inRoom = await clientPoint(page, {
    x: circle.x + circle.r * 2,
    y: circle.y
  })
  await page.mouse.click(inRoom.x, inRoom.y)
  await expect.poll(async () => (await hatches(page)).length).toBe(1)

  // Inside the circle: the circle itself.
  const inCircle = await clientPoint(page, { x: circle.x, y: circle.y })
  await page.mouse.click(inCircle.x, inCircle.y)
  await expect.poll(async () => (await hatches(page)).length).toBe(2)

  await page.keyboard.press('Escape')

  const [room, disc] = await hatches(page)
  expect(room.loops).toBe(2)
  // The room is wider than the circle on both axes, and stops at the walls
  // (the grid lines run past them).
  expect(room.width).toBeGreaterThan(circle.r * 4)
  expect(room.height).toBeGreaterThan(circle.r * 4)
  expect(room.width).toBeLessThan(circle.r * 10)
  expect(disc.loops).toBe(1)
  expect(disc.width).toBeCloseTo(circle.r * 2, 3)
  expect(pageErrors).toEqual([])
})
