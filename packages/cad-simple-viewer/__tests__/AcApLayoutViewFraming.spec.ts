import { AcGeBox2d } from '@mlightcad/data-model'

import {
  acapBoxContains,
  acapFrameBoxToGeBox2d,
  acapLayoutLimitsBox,
  acapResolveLayoutFrameBox,
  acapViewportPaperBox
} from '../src/util/AcApLayoutViewFraming'

describe('acapViewportPaperBox', () => {
  it('builds a paper rectangle from center / width / height', () => {
    expect(
      acapViewportPaperBox({
        centerPoint: { x: 100, y: 200 },
        width: 40,
        height: 20
      })
    ).toEqual({
      min: { x: 80, y: 190 },
      max: { x: 120, y: 210 }
    })
  })

  it('rejects non-positive sizes', () => {
    expect(
      acapViewportPaperBox({
        centerPoint: { x: 0, y: 0 },
        width: 0,
        height: 10
      })
    ).toBeUndefined()
  })
})

describe('acapBoxContains', () => {
  it('requires full containment', () => {
    const outer = { min: { x: 0, y: 0 }, max: { x: 12, y: 9 } }
    const inner = { min: { x: -10, y: -10 }, max: { x: 10, y: 10 } }
    expect(acapBoxContains(outer, inner)).toBe(false)
    expect(
      acapBoxContains(outer, { min: { x: 1, y: 1 }, max: { x: 2, y: 2 } })
    ).toBe(true)
  })
})

describe('acapResolveLayoutFrameBox', () => {
  const templateLimits = { min: { x: 0, y: 0 }, max: { x: 12, y: 9 } }
  const realViewports = {
    min: { x: -522, y: -2680 },
    max: { x: 452, y: 877 }
  }
  const modelEntities = {
    min: { x: 489920, y: 3418677 },
    max: { x: 496000, y: 3424000 }
  }

  it('rejects template limits that do not contain viewports', () => {
    const framed = acapResolveLayoutFrameBox({
      limits: templateLimits,
      viewportsBox: realViewports
    })
    expect(framed?.source).toBe('viewports')
    expect(framed?.box.min.x).toBe(realViewports.min.x)
    expect(framed?.box.max.y).toBe(realViewports.max.y)
  })

  it('keeps limits when they contain viewports', () => {
    const sheet = { min: { x: -600, y: -2800 }, max: { x: 500, y: 1000 } }
    const framed = acapResolveLayoutFrameBox({
      limits: sheet,
      viewportsBox: realViewports
    })
    expect(framed?.source).toBe('limits')
    expect(framed?.box.min.x).toBe(sheet.min.x)
  })

  it('does not trust model template limits when there are no viewports', () => {
    const framed = acapResolveLayoutFrameBox({
      limits: templateLimits,
      entityBox: modelEntities
    })
    expect(framed?.source).toBe('entityBox')
    expect(framed?.box.min.x).toBe(modelEntities.min.x)
  })

  it('falls back to limits only when nothing else is available', () => {
    const framed = acapResolveLayoutFrameBox({
      limits: templateLimits
    })
    expect(framed?.source).toBe('limits')
  })

  it('prefers layout extents over entity box when viewports are absent', () => {
    const extents = { min: { x: 10, y: 20 }, max: { x: 30, y: 40 } }
    const framed = acapResolveLayoutFrameBox({
      layoutExtents: extents,
      entityBox: modelEntities
    })
    expect(framed?.source).toBe('layoutExtents')
  })

  it('ignores empty AcGeBox2d inputs', () => {
    const framed = acapResolveLayoutFrameBox({
      limits: new AcGeBox2d(),
      entityBox: modelEntities
    })
    expect(framed?.source).toBe('entityBox')
  })

  it('does not frame on extents that are a single point', () => {
    // The Model layout of a drawing saved in paper space: AutoCAD writes
    // its extents as (0,0)-(0,0).
    const framed = acapResolveLayoutFrameBox({
      layoutExtents: { min: { x: 0, y: 0 }, max: { x: 0, y: 0 } },
      entityBox: modelEntities
    })
    expect(framed?.source).toBe('entityBox')
    expect(framed?.box.max.x).toBe(modelEntities.max.x)

    // Nothing else to go by: no frame, rather than a frame of no size.
    expect(
      acapResolveLayoutFrameBox({
        layoutExtents: { min: { x: 0, y: 0 }, max: { x: 0, y: 0 } }
      })
    ).toBeUndefined()
  })

  it('still frames a drawing that is one straight line', () => {
    const framed = acapResolveLayoutFrameBox({
      entityBox: { min: { x: 0, y: 5 }, max: { x: 100, y: 5 } }
    })
    expect(framed?.source).toBe('entityBox')
  })

  it('round-trips through AcGeBox2d', () => {
    const box = acapFrameBoxToGeBox2d(templateLimits)
    expect(box.min.x).toBe(0)
    expect(box.max.y).toBe(9)
  })
})

describe('acapLayoutLimitsBox', () => {
  const emptyExtents = { isEmpty: () => true }
  const extentsOf = (minX: number, minY: number, maxX: number, maxY: number) => ({
    isEmpty: () => false,
    min: { x: minX, y: minY },
    max: { x: maxX, y: maxY }
  })
  const db = (fields: Record<string, unknown>) =>
    ({ extents: emptyExtents, ...fields }) as never
  const stale = { limits: new AcGeBox2d({ x: 0, y: 0 }, { x: 12, y: 9 }) }

  it('uses header LIMMIN/LIMMAX in model space over stale layout limits', () => {
    const box = acapLayoutLimitsBox(
      stale,
      db({ limmin: { x: 0, y: 0 }, limmax: { x: 841, y: 594 } }),
      { isModelSpace: true }
    )
    expect(box?.max.x).toBe(841)
    expect(box?.max.y).toBe(594)
  })

  it('falls back to extents when model limits miss the drawing', () => {
    const box = acapLayoutLimitsBox(
      stale,
      db({
        limmin: { x: 0, y: 0 },
        limmax: { x: 420, y: 297 },
        extents: extentsOf(10000, 10000, 20000, 20000)
      }),
      { isModelSpace: true }
    )
    expect(box).toBeUndefined()
  })

  it('uses the paper layout limits (sheet) in paper space', () => {
    const box = acapLayoutLimitsBox(
      { limits: new AcGeBox2d({ x: -20, y: -7.5 }, { x: 277, y: 202.5 }) },
      db({}),
      { isModelSpace: false, isActivePaperLayout: true }
    )
    expect(box?.min.x).toBe(-20)
    expect(box?.max.y).toBe(202.5)
  })

  it('uses PLIMMIN/PLIMMAX for the active paper layout without limits', () => {
    const box = acapLayoutLimitsBox(
      stale,
      db({ plimmin: { x: 0, y: 0 }, plimmax: { x: 420, y: 297 } }),
      { isModelSpace: false, isActivePaperLayout: true }
    )
    expect(box?.max.x).toBe(420)
  })

  it('returns undefined when only template defaults exist', () => {
    expect(
      acapLayoutLimitsBox(stale, db({}), { isModelSpace: false })
    ).toBeUndefined()
  })
})
