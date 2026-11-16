import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, type Page, test } from '@playwright/test'

import { uploadFixture } from '../helpers/fileUpload'
import { useCadProfile } from '../helpers/operationProfile'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
/** Two horizontal lines: y = 0 and y = 30, both from x = 0 to x = 100. */
const fixturePath = path.resolve(currentDir, '..', 'fixtures', 'two-lines.dxf')
/** One CARIMBO symbol (a text in a block) on layer NOTES. */
const symbolFixturePath = path.resolve(
  currentDir,
  '..',
  'fixtures',
  'find-blocks.dxf'
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

async function loadFixture(page: Page, file = fixturePath) {
  await page.goto('/')
  await uploadFixture(page, file, { accessMode: 'Write' })
  await expect(page.locator('.ml-cad-container')).toBeVisible({
    timeout: 30000
  })
  // TEMPORARY (CI diagnosis): before the wait below, so that the steps of
  // the tests keep the timing they have without it.
  // The failure follows the machine, not the recorder: record always.
  await page.waitForTimeout(300)
  await traceCommands(page, true)
  await page.waitForTimeout(2200)
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

/** Lines of model space (lowest first), the selection size and the tool. */
async function drawingState(page: Page) {
  return page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    const docs = mod.AcApDocManager.instance
    const view = docs.curView
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = []
    let count = 0
    for (const entity of docs.curDocument.database.tables.blockTable.modelSpace.newIterator()) {
      count++
      const line = entity as {
        startPoint?: { x: number; y: number }
        endPoint?: { x: number; y: number }
      }
      if (!line.startPoint || !line.endPoint) continue
      lines.push({
        x1: line.startPoint.x,
        y1: line.startPoint.y,
        x2: line.endPoint.x,
        y2: line.endPoint.y
      })
    }
    lines.sort((a, b) => a.y1 - b.y1 || a.x1 - b.x1)
    return {
      lines,
      count,
      selected: view.selectionSet.count as number,
      running: view.toolManager.isCommandRunning as boolean
    }
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

/** The busy overlay (spinner) covers the canvas while work runs. */
async function waitUntilIdle(page: Page) {
  await expect(page.locator('.ml-ccl-overlay:visible')).toHaveCount(0)
}

async function clickAt(
  page: Page,
  point: { x: number; y: number },
  button: 'left' | 'right' = 'left'
) {
  await waitUntilIdle(page)
  const client = await clientPoint(page, point)
  await page.mouse.click(client.x, client.y, { button })
  await page.waitForTimeout(250)
}

/**
 * TEMPORARY (CI diagnosis): records what the commands of the page do into
 * `window.__trace` — start / end, prompts, messages, appended and erased
 * entities, who cancels or aborts — without printing while it happens (the
 * failure only shows on a fast machine). {@link dumpTrace} prints it.
 */
async function traceCommands(page: Page, full: boolean) {
  page.on('pageerror', error => console.log(`[pageerror] ${error.message}`))
  page.on('console', message => {
    if (message.type() === 'error') {
      console.log(`[browser error] ${message.text()}`)
    }
  })
  await page.evaluate(async ({ url, full }) => {
    const mod = await import(/* @vite-ignore */ url)
    const docs = mod.AcApDocManager.instance
    const view = docs.curView
    const editor = view.editor
    const db = docs.curDocument.database
    const trace: string[] = []
    ;(window as unknown as { __trace: string[] }).__trace = trace
    const start = performance.now()
    const log = (...parts: unknown[]) =>
      trace.push(`${(performance.now() - start).toFixed(1)} ${parts.join(' ')}`)
    const where = () =>
      String(new Error().stack)
        .split('\n')
        .slice(3, 9)
        .map(line => line.trim().replace(/\?t=\d+/g, ''))
        .join(' | ')
    const model = () =>
      [...db.tables.blockTable.modelSpace.newIterator()]
        .map((entity: { type: string }) => entity.type)
        .join(',')
    const name = (args: { command: { globalName?: string } }) =>
      args.command.globalName
    editor.events.commandWillStart.addEventListener((args: never) =>
      log('start', name(args), 'model=' + model())
    )
    editor.events.commandEnded.addEventListener((args: never) =>
      log('end', name(args), 'model=' + model())
    )
    editor.events.promptStarted.addEventListener((args: { message: string }) =>
      log('prompt', JSON.stringify(args.message))
    )
    editor.events.promptEnded.addEventListener((args: { status: unknown }) =>
      log('promptEnded', String(args.status))
    )
    db.events.entityAppended.addEventListener(() =>
      log('appended model=' + model())
    )
    db.events.entityErased.addEventListener(() =>
      log('erased model=' + model(), where())
    )
    log('state', JSON.stringify({ clayer: db.clayer, model: model(), full }))
    if (!full) return
    // Synchronous wrappers only: an async one would shift the timing.
    const wrap = (owner: Record<string, unknown>, method: string) => {
      const original = owner[method] as (...args: unknown[]) => unknown
      if (typeof original !== 'function') return
      owner[method] = function (this: unknown, ...args: unknown[]) {
        log(
          method,
          JSON.stringify(
            args.map(arg => (typeof arg === 'string' ? arg : typeof arg))
          ),
          where()
        )
        return original.apply(this, args)
      }
    }
    wrap(docs, 'sendStringToExecute')
    wrap(docs.commandManager, 'cancelActive')
    wrap(editor, 'showMessage')
    wrap(editor, 'cancelActiveInput')
    wrap(db.transactionManager, 'abortTransaction')
    wrap(db.transactionManager, 'undo')
    wrap(db.tables.blockTable.modelSpace, 'removeEntity')
    const canvas = view.canvas as HTMLCanvasElement
    for (const type of [
      'pointerdown',
      'mousedown',
      'mouseup',
      'click',
      'dblclick',
      'contextmenu',
      'keydown'
    ]) {
      window.addEventListener(
        type,
        event => {
          const mouse = event as MouseEvent
          const target = mouse.target as HTMLElement
          const rect = canvas.getBoundingClientRect()
          const world = view.screenToWorld({
            x: (mouse.clientX ?? 0) - rect.left,
            y: (mouse.clientY ?? 0) - rect.top
          })
          log(
            type,
            `button=${mouse.button}`,
            `detail=${mouse.detail}`,
            `trusted=${event.isTrusted}`,
            `pointer=${(event as PointerEvent).pointerType ?? '-'}`,
            `key=${(event as KeyboardEvent).key}`,
            `target=${target.tagName}.${String(target.className).slice(0, 30)}`,
            `world=${world.x.toFixed(1)},${world.y.toFixed(1)}`,
            `running=${view.toolManager.isCommandRunning}`,
            `active=${editor.isActive}`
          )
        },
        true
      )
    }
    log(
      'state',
      JSON.stringify({
        clayer: db.clayer,
        profile: mod.AcApSettingManager.instance.operationProfile,
        continuous: mod.AcApSettingManager.instance.continuousDraw,
        canvas: [canvas.clientWidth, canvas.clientHeight],
        model: model()
      })
    )
  }, { url: viewerModuleUrl!, full })
}

/**
 * TEMPORARY (CI diagnosis): what the page looks like after a failure, read
 * without having installed anything before.
 */
async function dumpState(page: Page) {
  const points = [
    { x: 10, y: 5 },
    { x: 30, y: 20 },
    { x: 10, y: 10 },
    { x: 40, y: 10 },
    { x: 40, y: 25 },
    { x: 50, y: 15 },
    { x: 70, y: 20 }
  ]
  const state = await page
    .evaluate(
      async ({ url, points }) => {
        const mod = await import(/* @vite-ignore */ url)
        const docs = mod.AcApDocManager.instance
        const view = docs.curView
        const db = docs.curDocument.database
        const attempt = (read: () => unknown) => {
          try {
            return read()
          } catch (error) {
            return `!${error}`
          }
        }
        const rect = view.canvas.getBoundingClientRect()
        const describe = (element: Element | null) => {
          const chain: string[] = []
          for (let e = element; e && chain.length < 4; e = e.parentElement) {
            chain.push(
              e.tagName.toLowerCase() +
                (typeof e.className === 'string' && e.className
                  ? '.' + e.className.split(/\s+/).slice(0, 3).join('.')
                  : '')
            )
          }
          return chain.join(' < ')
        }
        const box = (selector: string) =>
          [...document.querySelectorAll(selector)].map(element => {
            const r = element.getBoundingClientRect()
            return `${selector} ${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)}`
          })
        return {
          model: attempt(() =>
            [...db.tables.blockTable.modelSpace.newIterator()].map(
              (e: {
                type: string
                layer: string
                numberOfVertices?: number
                geometricExtents?: {
                  min: { x: number; y: number }
                  max: { x: number; y: number }
                }
              }) =>
                `${e.type}@${e.layer}` +
                (e.numberOfVertices != null ? `#${e.numberOfVertices}` : '') +
                attempt(() => {
                  const x = e.geometricExtents!
                  return ` [${x.min.x.toFixed(1)},${x.min.y.toFixed(1)} ${x.max.x.toFixed(1)},${x.max.y.toFixed(1)}]`
                })
            )
          ),
          clayer: attempt(() => db.clayer),
          layers: attempt(() =>
            [...db.tables.layerTable.newIterator()].map(
              (l: {
                name: string
                isOff: boolean
                isFrozen: boolean
                isLocked: boolean
              }) =>
                `${l.name}${l.isOff ? ' off' : ''}${l.isFrozen ? ' frozen' : ''}${l.isLocked ? ' locked' : ''}`
            )
          ),
          undo: attempt(() =>
            db.transactionManager.undoStack.undoRecords.map(
              (r: { label?: string; name?: string }) => r.label ?? r.name ?? '?'
            )
          ),
          redo: attempt(
            () => db.transactionManager.undoStack.redoRecords?.length
          ),
          running: attempt(() => view.toolManager.isCommandRunning),
          editorActive: attempt(() => view.editor.isActive),
          symbolEdit: attempt(() => view.symbolEdit.isActive),
          selected: attempt(() => view.selectionSet.count),
          profile: attempt(
            () => mod.AcApSettingManager.instance.operationProfile
          ),
          continuous: attempt(
            () => mod.AcApSettingManager.instance.continuousDraw
          ),
          canvas: `${Math.round(rect.left)},${Math.round(rect.top)} ${Math.round(rect.width)}x${Math.round(rect.height)}`,
          window: `${window.innerWidth}x${window.innerHeight} dpr=${window.devicePixelRatio}`,
          agent: `${navigator.userAgent} cores=${navigator.hardwareConcurrency}`,
          under: points.map(point => {
            const s = view.worldToScreen(point)
            const x = rect.left + s.x
            const y = rect.top + s.y
            return `${point.x},${point.y} -> ${Math.round(x)},${Math.round(y)} ${describe(document.elementFromPoint(x, y))}`
          }),
          active: describe(document.activeElement),
          fonts: attempt(() =>
            [...document.fonts]
              .filter(f => f.status === 'loaded')
              .map(f => f.family)
              .filter((f, i, all) => all.indexOf(f) === i)
          ),
          bodyFont: getComputedStyle(document.body).fontFamily,
          messages: [
            ...document.querySelectorAll(
              '.el-message, .el-notification, .ml-command-line, [class*="toast"], [class*="hint"]'
            )
          ]
            .map(e => `${describe(e)}: ${(e.textContent ?? '').trim().slice(0, 160)}`)
            .slice(0, 12),
          boxes: [
            ...box('.ml-sidebar'),
            ...box('.ml-palette-manager'),
            ...box('.ml-layer-list'),
            ...box('.ml-symbol-edit-bar'),
            ...box('.ml-context-menu'),
            ...box('.ml-cad-container')
          ],
          overlays: [...document.querySelectorAll('body > *, .ml-cad-container > *')]
            .map(e => {
              const r = e.getBoundingClientRect()
              const style = getComputedStyle(e)
              return `${describe(e).split(' < ')[0]} ${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)} ${style.position} pe=${style.pointerEvents} d=${style.display} v=${style.visibility}`
            })
            .slice(0, 40)
        }
      },
      { url: viewerModuleUrl!, points }
    )
    .catch(error => `dumpState failed: ${error}`)
  console.log(`[state] ${JSON.stringify(state, null, 1)}`)
}

/** TEMPORARY (CI diagnosis): prints what {@link traceCommands} recorded. */
async function dumpTrace(page: Page) {
  const trace = await page
    .evaluate(() => (window as unknown as { __trace?: string[] }).__trace)
    .catch(() => undefined)
  if (trace) console.log(`[trace]\n${trace.join('\n')}`)
}

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus || process.env.DUMP_TRACE) {
    console.log(`[attempt] retry=${testInfo.retry} ${testInfo.title}`)
    await dumpState(page)
    await dumpTrace(page)
  }
})

const menu = (page: Page) => page.locator('.ml-context-menu').first()

/** Ids of the items of the (top level) menu, separators left out. */
async function menuIds(page: Page) {
  await expect(menu(page)).toBeVisible()
  return menu(page)
    .locator(':scope > .ml-context-menu-item')
    .evaluateAll(items => items.map(item => (item as HTMLElement).dataset.id))
}

async function pick(page: Page, id: string) {
  await page.locator(`.ml-context-menu [data-id="${id}"]`).click()
  await page.waitForTimeout(250)
}

test('empty canvas: the menu creates things; select all; repeat', async ({
  page
}) => {
  await loadFixture(page)

  await clickAt(page, { x: 50, y: 15 }, 'right')
  const ids = await menuIds(page)
  expect(ids).toEqual(
    expect.arrayContaining(['create', 'comment', 'selectAll', 'zoomExtents'])
  )
  expect(ids).not.toContain('cut')
  expect(ids).not.toContain('paste')
  // Nothing has been run yet.
  expect(ids).not.toContain('repeat')

  await pick(page, 'selectAll')
  await expect(menu(page)).toHaveCount(0)
  expect((await drawingState(page)).selected).toBe(2)

  // Esc clears the selection; draw a rectangle from the "Create" submenu.
  await page.keyboard.press('Escape')
  await clickAt(page, { x: 50, y: 15 }, 'right')
  await menuIds(page)
  await page.locator('.ml-context-menu [data-id="create"]').hover()
  await pick(page, 'tool:rectang')
  expect((await drawingState(page)).running).toBe(true)
  await clickAt(page, { x: 10, y: 5 })
  await clickAt(page, { x: 30, y: 20 })
  await expect.poll(async () => (await drawingState(page)).running).toBe(false)
  expect((await drawingState(page)).count).toBe(3)

  // "Repeat" runs the rectangle again.
  await page.keyboard.press('Escape')
  await clickAt(page, { x: 80, y: 15 }, 'right')
  expect(await menuIds(page)).toContain('repeat')
  await pick(page, 'repeat')
  expect((await drawingState(page)).running).toBe(true)
  await page.keyboard.press('Escape')
  await expect.poll(async () => (await drawingState(page)).running).toBe(false)
})

test('selection: right-click selects the line; copy, paste at the click, duplicate, delete', async ({
  page
}) => {
  await loadFixture(page)

  // Right-click on an unselected line selects it (simple profile).
  await clickAt(page, { x: 50, y: 0 }, 'right')
  expect((await drawingState(page)).selected).toBe(1)
  const ids = await menuIds(page)
  expect(ids).toEqual([
    'cut',
    'copy',
    'duplicate',
    'erase',
    'selectSameLayer',
    'properties'
  ])

  // Esc closes the menu; the next Esc reaches the view and clears the selection.
  await page.keyboard.press('Escape')
  await expect(menu(page)).toHaveCount(0)
  expect((await drawingState(page)).selected).toBe(1)
  await page.keyboard.press('Escape')
  await expect.poll(async () => (await drawingState(page)).selected).toBe(0)

  await clickAt(page, { x: 50, y: 0 }, 'right')
  await pick(page, 'copy')

  // Paste on empty space: the copy is centered on the click.
  await page.keyboard.press('Escape')
  await clickAt(page, { x: 50, y: 15 }, 'right')
  expect(await menuIds(page)).toContain('paste')
  await pick(page, 'paste')
  let state = await drawingState(page)
  expect(state.lines).toHaveLength(3)
  const pasted = state.lines[1]
  expect(pasted.y1).toBeCloseTo(15, 0)
  expect((pasted.x1 + pasted.x2) / 2).toBeCloseTo(50, 0)
  expect(state.selected).toBe(1)

  // One undo takes the paste back.
  await page.keyboard.press('Control+z')
  await expect
    .poll(async () => (await drawingState(page)).lines.length)
    .toBe(3 - 1)

  // Duplicate puts a copy next to the original and selects it.
  await clickAt(page, { x: 50, y: 30 }, 'right')
  await pick(page, 'duplicate')
  state = await drawingState(page)
  expect(state.lines).toHaveLength(3)
  expect(state.selected).toBe(1)

  // Delete the duplicate from the menu.
  await clickAt(page, { x: 50, y: 30 }, 'right')
  await pick(page, 'selectSameLayer')
  expect((await drawingState(page)).selected).toBe(3)
  await clickAt(page, { x: 50, y: 0 }, 'right')
  await pick(page, 'erase')
  await expect.poll(async () => (await drawingState(page)).lines.length).toBe(0)
})

test('Ctrl+C / Ctrl+V paste at the cursor; Ctrl+A selects all', async ({
  page
}) => {
  await loadFixture(page)
  await clickAt(page, { x: 50, y: 0 })
  await expect.poll(async () => (await drawingState(page)).selected).toBe(1)
  await page.keyboard.press('Control+c')
  const target = await clientPoint(page, { x: 20, y: 20 })
  await waitUntilIdle(page)
  await page.mouse.move(target.x, target.y)
  await page.keyboard.press('Control+v')
  const state = await drawingState(page)
  expect(state.lines).toHaveLength(3)
  expect(state.lines[1].y1).toBeCloseTo(20, 0)
  expect((state.lines[1].x1 + state.lines[1].x2) / 2).toBeCloseTo(20, 0)

  await page.keyboard.press('Control+a')
  expect((await drawingState(page)).selected).toBe(3)
})

test('while drawing (simple): Enter / undo / cancel menu', async ({ page }) => {
  await loadFixture(page)

  // Polyline: two points, then the menu takes the last one back.
  await clickAt(page, { x: 50, y: 15 }, 'right')
  await menuIds(page)
  await page.locator('.ml-context-menu [data-id="create"]').hover()
  await pick(page, 'tool:pline')
  await clickAt(page, { x: 10, y: 10 })
  await clickAt(page, { x: 40, y: 10 })
  await clickAt(page, { x: 40, y: 25 })
  await clickAt(page, { x: 70, y: 20 }, 'right')
  expect(await menuIds(page)).toEqual(['confirm', 'undoStep', 'cancel'])
  await pick(page, 'undoStep')
  expect((await drawingState(page)).running).toBe(true)

  // Enter ends the polyline with the two points left.
  await clickAt(page, { x: 70, y: 20 }, 'right')
  await pick(page, 'confirm')
  await expect.poll(async () => (await drawingState(page)).running).toBe(false)
  expect((await drawingState(page)).count).toBe(3)

  // Line: cancel from the menu draws nothing.
  await page.keyboard.press('l')
  await clickAt(page, { x: 10, y: 20 })
  await clickAt(page, { x: 70, y: 20 }, 'right')
  expect(await menuIds(page)).toContain('cancel')
  await pick(page, 'cancel')
  await expect.poll(async () => (await drawingState(page)).running).toBe(false)
  expect((await drawingState(page)).count).toBe(3)
})

test('CAD profile: menu when idle, right-click answers the prompt in a command', async ({
  page
}) => {
  await useCadProfile(page)
  await loadFixture(page)

  await clickAt(page, { x: 50, y: 15 }, 'right')
  expect(await menuIds(page)).toContain('selectAll')
  await page.keyboard.press('Escape')
  await expect(menu(page)).toHaveCount(0)

  // In LINE, right-click takes the last segment back (no menu).
  await page.locator('.ml-cli-text').first().click()
  await page.keyboard.type('line')
  await page.keyboard.press('Enter')
  await clickAt(page, { x: 10, y: 20 })
  await clickAt(page, { x: 40, y: 20 })
  await clickAt(page, { x: 40, y: 10 })
  expect((await drawingState(page)).count).toBe(4)
  await clickAt(page, { x: 70, y: 15 }, 'right')
  await expect(menu(page)).toHaveCount(0)
  const state = await drawingState(page)
  expect(state.running).toBe(true)
  expect(state.count).toBe(3)
  await page.keyboard.press('Escape')
  await expect.poll(async () => (await drawingState(page)).running).toBe(false)
})

/** Symbols of model space, the CARIMBO definition and the texts. */
async function symbolState(page: Page) {
  return page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    const db = mod.AcApDocManager.instance.curDocument.database
    let inserts = 0
    const texts: string[] = []
    for (const entity of db.tables.blockTable.modelSpace.newIterator()) {
      if (entity.dxfTypeName === 'INSERT') inserts++
      else if (entity.dxfTypeName === 'TEXT') texts.push(entity.textString)
    }
    return {
      inserts,
      texts,
      hasDefinition: !!db.tables.blockTable.getAt('CARIMBO')
    }
  }, viewerModuleUrl!)
}

async function symbolCenter(page: Page) {
  return page.evaluate(async url => {
    const mod = await import(/* @vite-ignore */ url)
    const db = mod.AcApDocManager.instance.curDocument.database
    for (const entity of db.tables.blockTable.modelSpace.newIterator()) {
      if (entity.dxfTypeName !== 'INSERT') continue
      const box = entity.geometricExtents
      return { x: (box.min.x + box.max.x) / 2, y: (box.min.y + box.max.y) / 2 }
    }
    throw new Error('no symbol')
  }, viewerModuleUrl!)
}

test('symbol: right-click explodes it and asks to drop the unused definition', async ({
  page
}) => {
  await loadFixture(page, symbolFixturePath)
  const before = await symbolState(page)
  expect(before.inserts).toBe(1)
  expect(before.hasDefinition).toBe(true)

  const center = await symbolCenter(page)
  await clickAt(page, center, 'right')
  expect(await menuIds(page)).toContain('explode')
  await pick(page, 'explode')

  // It was the last one: keeping it leaves the definition.
  const dialog = page.locator('.ml-ui-dialog')
  await expect(dialog).toBeVisible()
  await dialog.locator('.ml-ui-dialog-btn-secondary').click()
  await expect(dialog).toHaveCount(0)
  let state = await symbolState(page)
  expect(state.inserts).toBe(0)
  expect(state.texts.length).toBeGreaterThan(before.texts.length)
  expect(state.hasDefinition).toBe(true)

  // Undo brings the symbol back; explode again and remove the definition.
  await page.keyboard.press('Control+z')
  await expect.poll(async () => (await symbolState(page)).inserts).toBe(1)
  await clickAt(page, center, 'right')
  await pick(page, 'explode')
  await dialog.locator('.ml-ui-dialog-btn-primary').click()
  await expect(dialog).toHaveCount(0)
  state = await symbolState(page)
  expect(state.inserts).toBe(0)
  expect(state.hasDefinition).toBe(false)

  // One undo restores both the symbol and its definition.
  await page.keyboard.press('Control+z')
  await expect.poll(async () => (await symbolState(page)).inserts).toBe(1)
  expect((await symbolState(page)).hasDefinition).toBe(true)
})
