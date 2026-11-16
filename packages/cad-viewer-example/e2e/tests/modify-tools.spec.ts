import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import { uploadFixture } from '../helpers/fileUpload'
import { useCadProfile } from '../helpers/operationProfile'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
/**
 * Lines (all on layer 0):
 * - A (0,0)-(100,0) between the walls B x=30 and C x=70 (y -20…20)
 * - D (0,50)-(40,50) and the boundary E x=80 (y 40…60)
 * - F (0,100)-(50,100) and G (60,105)-(60,150), meeting at (60,100)
 */
const fixturePath = path.resolve(
  currentDir,
  '..',
  'fixtures',
  'modify-tools.dxf'
)

let viewerModuleUrl: string | undefined

test.beforeEach(async ({ page }) => {
  // Right-click answers the prompt in the CAD profile ("Undo" in TRIM).
  await useCadProfile(page)
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

interface Shape {
  type: string
  shown: boolean
  points: number[]
}

/** Model-space entities (rounded end points / center) and the tool state. */
async function state(page: Page) {
  return page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    const docs = mod.AcApDocManager.instance
    const view = docs.curView
    const r = (v: number) => Math.round(v * 1000) / 1000 || 0
    const shapes: Shape[] = []
    for (const entity of docs.curDocument.database.tables.blockTable.modelSpace.newIterator()) {
      const e = entity as {
        type: string
        objectId: string
        startPoint?: { x: number; y: number }
        endPoint?: { x: number; y: number }
        center?: { x: number; y: number }
        radius?: number
      }
      const points =
        e.type === 'Line'
          ? [e.startPoint!.x, e.startPoint!.y, e.endPoint!.x, e.endPoint!.y]
          : e.center
            ? [e.center.x, e.center.y, e.radius ?? 0]
            : []
      shapes.push({
        type: e.type,
        shown: view.hasEntity(e.objectId),
        points: points.map(r)
      })
    }
    return {
      shapes,
      running: view.toolManager.isCommandRunning as boolean
    }
  }, viewerModuleUrl!)
}

const lines = (shapes: Shape[]) =>
  shapes.filter(s => s.type === 'Line').map(s => s.points)

async function clickAt(
  page: Page,
  point: { x: number; y: number },
  button: 'left' | 'right' = 'left'
) {
  const client = await page.evaluate(
    async ({ url, point }) => {
      const mod = await import(/* @vite-ignore */ url)
      const view = mod.AcApDocManager.instance.curView
      const rect = view.canvas.getBoundingClientRect()
      const screen = view.worldToScreen(point)
      return { x: rect.left + screen.x, y: rect.top + screen.y }
    },
    { url: viewerModuleUrl!, point }
  )
  await page.mouse.move(client.x, client.y, { steps: 3 })
  await page.mouse.click(client.x, client.y, { button })
  await page.waitForTimeout(300)
}

async function run(page: Page, command: string) {
  await page.evaluate(
    async ({ url, command }) => {
      const mod = await import(/* @vite-ignore */ url)
      mod.AcApDocManager.instance.sendStringToExecute(command)
    },
    { url: viewerModuleUrl!, command }
  )
  await expect.poll(async () => (await state(page)).running).toBe(true)
  // Let the first prompt take the input.
  await page.waitForTimeout(500)
}

async function undo(page: Page) {
  await page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    mod.AcApDocManager.instance.sendStringToExecute('undo')
  }, viewerModuleUrl!)
}

/** Selects the line passing through `point` (and nothing else). */
async function selectLineAt(page: Page, point: { x: number; y: number }) {
  const count = await page.evaluate(
    async ({ url, point }) => {
      const mod = await import(/* @vite-ignore */ url)
      const docs = mod.AcApDocManager.instance
      const view = docs.curView
      view.selectionSet.clear()
      for (const e of docs.curDocument.database.tables.blockTable.modelSpace.newIterator()) {
        const line = e as {
          type: string
          objectId: string
          startPoint: { x: number; y: number }
          endPoint: { x: number; y: number }
        }
        if (line.type !== 'Line') continue
        const { startPoint: a, endPoint: b } = line
        const cross =
          (b.x - a.x) * (point.y - a.y) - (b.y - a.y) * (point.x - a.x)
        const within =
          Math.min(a.x, b.x) <= point.x &&
          point.x <= Math.max(a.x, b.x) &&
          Math.min(a.y, b.y) <= point.y &&
          point.y <= Math.max(a.y, b.y)
        if (Math.abs(cross) < 1e-6 && within) view.selectionSet.add([line.objectId])
      }
      return view.selectionSet.count as number
    },
    { url: viewerModuleUrl!, point }
  )
  expect(count).toBe(1)
}

async function type(page: Page, text: string) {
  await page.keyboard.type(text)
  await page.keyboard.press('Enter')
  await page.waitForTimeout(200)
}

/** Types a point into the X / Y fields next to the cursor. */
async function typePoint(page: Page, x: number, y: number) {
  await page.keyboard.type(String(x))
  await page.keyboard.press('Tab')
  await page.keyboard.type(String(y))
  await page.keyboard.press('Enter')
  await page.waitForTimeout(200)
}

async function focusViewer(page: Page) {
  await clickAt(page, { x: 15, y: 75 })
  await page.keyboard.press('Escape')
}

test('TRIM cuts between the walls; Undo inside and after the command', async ({
  page
}) => {
  await loadFixture(page)
  await focusViewer(page)

  await run(page, 'trim')
  await clickAt(page, { x: 50, y: 0 })
  await expect
    .poll(async () => lines((await state(page)).shapes))
    .toEqual(
      expect.arrayContaining([
        [0, 0, 30, 0],
        [70, 0, 100, 0]
      ])
    )
  let current = await state(page)
  expect(current.running).toBe(true)
  expect(current.shapes.every(s => s.shown)).toBe(true)

  // Right-click = "Undo" of the last pick.
  await clickAt(page, { x: 50, y: 75 }, 'right')
  current = await state(page)
  expect(lines(current.shapes)).toContainEqual([0, 0, 100, 0])
  expect(current.shapes).toHaveLength(7)

  // Trim the end beyond C, then finish.
  await clickAt(page, { x: 90, y: 0 })
  await page.keyboard.press('Escape')
  await expect.poll(async () => (await state(page)).running).toBe(false)
  expect(lines((await state(page)).shapes)).toContainEqual([0, 0, 70, 0])

  // One Undo of the drawing takes the whole command back.
  await undo(page)
  await expect
    .poll(async () => lines((await state(page)).shapes))
    .toContainEqual([0, 0, 100, 0])
})

test('EXTEND lengthens a line to the next object', async ({ page }) => {
  await loadFixture(page)
  await focusViewer(page)

  await run(page, 'extend')
  await clickAt(page, { x: 35, y: 50 })
  await page.keyboard.press('Escape')
  await expect.poll(async () => (await state(page)).running).toBe(false)
  expect(lines((await state(page)).shapes)).toContainEqual([0, 50, 80, 50])
})

test('FILLET rounds the corner of two lines with the given radius', async ({
  page
}) => {
  await loadFixture(page)
  await focusViewer(page)

  await run(page, 'fillet')
  await type(page, 'R')
  await type(page, '5')
  await clickAt(page, { x: 25, y: 100 })
  await clickAt(page, { x: 60, y: 130 })
  await expect.poll(async () => (await state(page)).running).toBe(false)
  const shapes = (await state(page)).shapes
  expect(lines(shapes)).toEqual(
    expect.arrayContaining([
      [0, 100, 55, 100],
      [60, 105, 60, 150]
    ])
  )
  expect(shapes.filter(s => s.type === 'Arc').map(s => s.points)).toEqual([
    [55, 105, 5]
  ])
})

test('FILLET joins parallel lines with a half circle', async ({ page }) => {
  await loadFixture(page)
  await focusViewer(page)

  // D (y = 50, 0…40) and F (y = 100, 0…50), picked near their right ends.
  await run(page, 'fillet')
  await clickAt(page, { x: 35, y: 50 })
  await clickAt(page, { x: 45, y: 100 })
  await expect.poll(async () => (await state(page)).running).toBe(false)
  const shapes = (await state(page)).shapes
  expect(lines(shapes)).toEqual(
    expect.arrayContaining([
      [0, 50, 40, 50],
      [0, 100, 40, 100]
    ])
  )
  expect(shapes.filter(s => s.type === 'Arc').map(s => s.points)).toEqual([
    [40, 75, 25]
  ])
})

test('MIRROR and ARRAY copy the selection', async ({ page }) => {
  await loadFixture(page)
  await focusViewer(page)

  // Mirror D across the Y axis, keeping the original.
  await selectLineAt(page, { x: 20, y: 50 })
  await run(page, 'mirror')
  await typePoint(page, 0, 0)
  await typePoint(page, 0, 10)
  await page.keyboard.press('Enter')
  await expect.poll(async () => (await state(page)).running).toBe(false)
  expect(lines((await state(page)).shapes)).toEqual(
    expect.arrayContaining([
      [0, 50, 40, 50],
      [0, 50, -40, 50]
    ])
  )

  // 3 columns × 2 rows of E, 10 and 30 apart: 5 copies.
  await selectLineAt(page, { x: 80, y: 55 })
  await run(page, 'array')
  await page.keyboard.press('Enter')
  await type(page, '3')
  await type(page, '2')
  await type(page, '10')
  await type(page, '30')
  await expect.poll(async () => (await state(page)).running).toBe(false)
  const all = lines((await state(page)).shapes)
  expect(all).toHaveLength(8 + 5)
  expect(all).toEqual(
    expect.arrayContaining([
      [90, 40, 90, 60],
      [100, 40, 100, 60],
      [80, 70, 80, 90],
      [100, 70, 100, 90]
    ])
  )
})
