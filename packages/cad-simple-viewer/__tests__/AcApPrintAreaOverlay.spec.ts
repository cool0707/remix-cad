/**
 * @jest-environment jsdom
 */
import {
  AcCmEventManager,
  AcDbDatabase,
  acdbHostApplicationServices,
  AcDbLine,
  AcGePoint3d
} from '@mlightcad/data-model'

import type { AcApDocManager } from '../src/app/AcApDocManager'
import {
  acapPrintAreaColors,
  acapPrintAreaLabel,
  AcApPrintAreaOverlay
} from '../src/app/AcApPrintAreaOverlay'
import { AcApSettingManager } from '../src/app/AcApSettingManager'

function drawing() {
  const db = new AcDbDatabase()
  db.createDefaultData()
  acdbHostApplicationServices().workingDatabase = db
  db.tables.blockTable.modelSpace.appendEntity(
    new AcDbLine(new AcGePoint3d(0, 0, 0), new AcGePoint3d(30000, 10000, 0))
  )
  return db
}

/** A view showing world x / 100, y flipped, in a 800 × 600 canvas. */
function fakeView() {
  return {
    container: document.createElement('div'),
    width: 800,
    height: 600,
    backgroundColor: 0x000000,
    activeLayoutBtrId: 'model',
    modelSpaceBtrId: 'model',
    events: {
      viewChanged: new AcCmEventManager<void>(),
      viewResize: new AcCmEventManager<unknown>(),
      renderFrame: new AcCmEventManager<unknown>()
    },
    worldToScreen: (p: { x: number; y: number }) => ({
      x: p.x / 100 + 200,
      y: 300 - p.y / 100
    })
  }
}

function setup() {
  const view = fakeView()
  const docManager = {
    curView: view,
    curDocument: { database: drawing() },
    events: { documentActivated: new AcCmEventManager<unknown>() }
  }
  const overlay = new AcApPrintAreaOverlay(
    docManager as unknown as AcApDocManager
  )
  const root = view.container.querySelector('svg') as SVGSVGElement
  return { view, overlay, root }
}

describe('AcApPrintAreaOverlay', () => {
  afterEach(() => {
    AcApSettingManager.instance.set('isShowPrintArea', false)
  })

  it('stays hidden until the setting is turned on', () => {
    const { root, overlay } = setup()
    expect(root.style.display).toBe('none')
    expect(overlay.currentSheet).toBeUndefined()
  })

  it('masks everything outside the sheet on screen', () => {
    const { root, overlay, view } = setup()
    AcApSettingManager.instance.set('isShowPrintArea', true)
    expect(root.style.display).toBe('')
    expect(overlay.currentSheet?.sheet).toMatchObject({
      paper: 'A3',
      scale: 100
    })
    // A3 at 1:100 centred on (15000, 5000): x -6000…36000, y -9850…19850.
    expect(root.querySelector('path')!.getAttribute('d')).toBe(
      'M-10,-10H810V610H-10Z M140.0,398.5 L560.0,398.5 L560.0,101.5 L140.0,101.5Z'
    )
    // No outline around the sheet.
    expect(root.querySelector('polygon')).toBeNull()
    expect(root.querySelector('text')!.textContent).toBe('A3 1:100')
    expect(root.querySelector('text')!.getAttribute('fill')).toBe('#fff')

    // Follows the canvas background.
    view.backgroundColor = 0xffffff
    view.events.renderFrame.dispatch({})
    expect(root.querySelector('path')!.getAttribute('fill')).toBe(
      acapPrintAreaColors(0xffffff).mask
    )
    expect(root.querySelector('text')!.getAttribute('fill')).toBe('#000')

    // Follows pan / zoom.
    view.worldToScreen = p => ({ x: p.x / 100, y: 300 - p.y / 100 })
    view.events.viewChanged.dispatch()
    expect(root.querySelector('path')!.getAttribute('d')).toContain(
      'M-60.0,398.5'
    )
  })

  it('hides in a print page (paper space)', () => {
    const { root, view, overlay } = setup()
    view.activeLayoutBtrId = 'paper'
    AcApSettingManager.instance.set('isShowPrintArea', true)
    expect(root.style.display).toBe('none')
    view.activeLayoutBtrId = 'model'
    overlay.refresh()
    expect(root.style.display).toBe('')
  })
})

describe('acapPrintAreaColors', () => {
  it('keeps the mask close to the background', () => {
    expect(acapPrintAreaColors(0xffffff).mask).toBe('rgba(217, 217, 217, 0.7)')
    expect(acapPrintAreaColors(0x000000).mask).toBe('rgba(38, 38, 38, 0.7)')
  })

  it('labels in black on light backgrounds and white on dark ones', () => {
    expect(acapPrintAreaColors(0xffffff).label).toBe('#000')
    expect(acapPrintAreaColors(0x212830).label).toBe('#fff')
  })
})

describe('acapPrintAreaLabel', () => {
  it('shows the paper and the scale', () => {
    expect(
      acapPrintAreaLabel({
        paper: 'A1',
        portrait: true,
        width: 594,
        height: 841,
        scale: 2.5,
        origin: [0, 0]
      })
    ).toBe('A1 1:2.5')
  })
})
