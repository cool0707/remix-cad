const mockSettings = { hatchGapTolerance: 0, hatchMaxSegments: 60_000 }

jest.mock('../src/app', () => ({
  AcApSettingManager: {
    get instance() {
      return mockSettings
    }
  },
  AcApDocManager: {
    instance: {
      editor: {
        getDouble: jest.fn(),
        getEntity: jest.fn(),
        getKeywords: jest.fn(),
        getPoint: jest.fn(),
        getSelection: jest.fn(),
        getString: jest.fn()
      }
    }
  }
}))

jest.mock('../src/editor', () => {
  class AcEdCommand {
    mode: unknown
    notify = jest.fn()
    showMessage = jest.fn()
  }

  class MockKeywordCollection {
    add(display: string, global: string, local: string) {
      return { display, global, local }
    }
  }

  class AcEdPromptDoubleOptions {
    allowNegative = false
    allowNone = false
    allowZero = false
    defaultValue = 0
    useDefaultValue = false

    constructor(readonly message: string) {}
  }

  class AcEdPromptEntityOptions {
    allowNone = false
    keywords = new MockKeywordCollection()

    constructor(readonly message: string) {}
    addAllowedClass = jest.fn()
    setRejectMessage = jest.fn()
  }

  class AcEdPromptKeywordOptions {
    allowNone = false
    keywords = new MockKeywordCollection()

    constructor(readonly message: string) {}
  }

  class AcEdPromptPointOptions {
    allowNone = false
    disableOSnap = false
    keywords = new MockKeywordCollection()

    constructor(readonly message: string) {}
  }

  class AcEdPromptSelectionOptions {
    constructor(readonly message: string) {}
  }

  class AcEdPromptStringOptions {
    allowEmpty = false
    defaultValue = ''
    useDefaultValue = false

    constructor(readonly message: string) {}
  }

  return {
    AcEdCommand,
    AcEdOpenMode: {
      Write: 'Write'
    },
    AcEdPromptDoubleOptions,
    AcEdPromptEntityOptions,
    AcEdPromptKeywordOptions,
    AcEdPromptPointOptions,
    AcEdPromptSelectionOptions,
    AcEdPromptStatus: {
      OK: 'OK',
      Keyword: 'Keyword',
      Cancel: 'Cancel'
    },
    AcEdPromptStringOptions
  }
})

jest.mock('../src/i18n', () => ({
  AcApI18n: {
    t: (key: string) => key
  }
}))

import {
  AcDbBlockReference,
  AcDbBlockTableRecord,
  AcDbCircle,
  AcDbDatabase,
  AcDbEntity,
  AcDbHatch,
  AcDbHatchStyle,
  acdbHostApplicationServices,
  AcDbLayerTableRecord,
  AcDbLine,
  AcDbSystemVariables,
  AcDbSysVarManager,
  AcGeCircArc2d,
  AcGeLine2d,
  AcGeLoop2d,
  AcGePoint3d,
  AcGePolyline2d,
  DEFAULT_HATCH_PATTERN_IMPERIAL,
  HATCH_PATTERN_SOLID
} from '@mlightcad/data-model'

import {
  AcApHatchCmd,
  type HatchSettings
} from '../src/command/draw/AcApHatchCmd'

class TestHatchCmd extends AcApHatchCmd {
  constructor(private readonly testSettings: HatchSettings) {
    super()
  }

  protected override get settings() {
    return this.testSettings
  }

  appendForTest(context: never, loops: ReadonlyArray<AcGeLoop2d>) {
    return this.appendHatch(context, loops)
  }

  pickForTest(context: never, x: number, y: number) {
    return this.hatchAtPoint(context, { x, y })
  }

  selectForTest(context: never, ids: string[]) {
    return this.hatchSelectedObjects(context, ids)
  }
}

class DefaultHatchCmd extends AcApHatchCmd {
  appendForTest(context: never, loops: ReadonlyArray<AcGeLoop2d>) {
    return this.appendHatch(context, loops)
  }
}

const createSquareLoop = () =>
  new AcGeLoop2d([
    new AcGeLine2d({ x: 0, y: 0 }, { x: 10, y: 0 }),
    new AcGeLine2d({ x: 10, y: 0 }, { x: 10, y: 10 }),
    new AcGeLine2d({ x: 10, y: 10 }, { x: 0, y: 10 }),
    new AcGeLine2d({ x: 0, y: 10 }, { x: 0, y: 0 })
  ])

const createContext = () => {
  const database = new AcDbDatabase()
  const appended: AcDbHatch[] = []
  const appendEntity = jest.spyOn(
    database.tables.blockTable.modelSpace,
    'appendEntity'
  )
  appendEntity.mockImplementation(entity => {
    const entities = Array.isArray(entity) ? entity : [entity]
    entities.forEach(item => {
      if (item instanceof AcDbHatch) appended.push(item)
    })
  })
  const addEntity = jest.fn()
  const context = {
    doc: {
      database
    },
    view: { addEntity }
  }

  return { addEntity, appended, context, database }
}

const createSettings = (
  overrides: Partial<HatchSettings> = {}
): HatchSettings => ({
  patternName: DEFAULT_HATCH_PATTERN_IMPERIAL,
  patternScale: 2,
  patternAngleDeg: 15,
  style: AcDbHatchStyle.Normal,
  associative: true,
  ...overrides
})

describe('AcApHatchCmd', () => {
  test('creates SOLID hatches by default', () => {
    const { addEntity, appended, context, database } = createContext()
    AcDbSysVarManager.instance().setVar(
      AcDbSystemVariables.HPNAME,
      HATCH_PATTERN_SOLID,
      database
    )
    const cmd = new DefaultHatchCmd()

    expect(cmd.appendForTest(context as never, [createSquareLoop()])).toBe(true)

    const hatch = appended[0]
    // Shown right away, while HATCH goes on asking for boundaries.
    expect(addEntity).toHaveBeenCalledWith(hatch)
    expect(hatch.patternName).toBe(HATCH_PATTERN_SOLID)
    expect(hatch.isSolidFill).toBe(true)
    expect(hatch.definitionLines).toHaveLength(0)
  })

  test('expands predefined pattern names into hatch definition lines', () => {
    const { appended, context, database } = createContext()
    AcDbSysVarManager.instance().setVar(
      AcDbSystemVariables.HPNAME,
      DEFAULT_HATCH_PATTERN_IMPERIAL,
      database
    )
    AcDbSysVarManager.instance().setVar(
      AcDbSystemVariables.HPSCALE,
      2,
      database
    )
    AcDbSysVarManager.instance().setVar(
      AcDbSystemVariables.HPANG,
      Math.PI / 12,
      database
    )
    const cmd = new TestHatchCmd(createSettings())

    expect(cmd.appendForTest(context as never, [createSquareLoop()])).toBe(true)

    const hatch = appended[0]
    expect(hatch).toBeInstanceOf(AcDbHatch)
    expect(hatch.patternName).toBe(DEFAULT_HATCH_PATTERN_IMPERIAL)
    expect(hatch.patternScale).toBe(2)
    expect(hatch.patternAngle).toBeCloseTo(Math.PI / 12)
    expect(hatch.isSolidFill).toBe(false)
    expect(hatch.definitionLines.length).toBeGreaterThan(0)
    expect(hatch.definitionLines[0].angle).toBeCloseTo(Math.PI / 4)
    // ANSI31 lines are 3.175 apart (x2 here), measured across the 45° lines:
    // the offset is stored in WCS, perpendicular to them (45° + 90° = 135°).
    const { offset } = hatch.definitionLines[0]
    expect(offset.x).toBeCloseTo(-3.175 * 2 * Math.SQRT1_2)
    expect(offset.y).toBeCloseTo(3.175 * 2 * Math.SQRT1_2)
    expect(Math.hypot(offset.x, offset.y)).toBeCloseTo(3.175 * 2)
  })

  test('keeps SOLID hatches as solid fills without pattern definition lines', () => {
    const { appended, context, database } = createContext()
    AcDbSysVarManager.instance().setVar(
      AcDbSystemVariables.HPNAME,
      HATCH_PATTERN_SOLID,
      database
    )
    const cmd = new TestHatchCmd(createSettings({ patternName: 'solid' }))

    expect(cmd.appendForTest(context as never, [createSquareLoop()])).toBe(true)

    const hatch = appended[0]
    expect(hatch.patternName).toBe(HATCH_PATTERN_SOLID)
    expect(hatch.isSolidFill).toBe(true)
    expect(hatch.definitionLines).toHaveLength(0)
  })
})

const segment = (x1: number, y1: number, x2: number, y2: number) =>
  new AcDbLine(new AcGePoint3d(x1, y1, 0), new AcGePoint3d(x2, y2, 0))

/**
 * A drawing with the given boundary objects (or the objects `entities` makes
 * in the new database); hatches are captured, not stored.
 */
const createDrawing = (
  entities: AcDbEntity[] | ((database: AcDbDatabase) => AcDbEntity[])
) => {
  const database = new AcDbDatabase()
  const modelSpace = database.tables.blockTable.modelSpace
  const items = typeof entities === 'function' ? entities(database) : entities
  items.forEach(entity => modelSpace.appendEntity(entity))
  const appended: AcDbHatch[] = []
  jest.spyOn(modelSpace, 'appendEntity').mockImplementation(entity => {
    const items = Array.isArray(entity) ? entity : [entity]
    items.forEach(item => {
      if (item instanceof AcDbHatch) appended.push(item)
    })
  })
  const context = { doc: { database }, view: { addEntity: jest.fn() } }
  return { appended, context: context as never, database }
}

/** Area of a hatch loop. */
const loopArea = (loop: unknown) => {
  const pts = (loop as AcGePolyline2d | AcGeLoop2d).tessellate()
  let sum = 0
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    sum += pts[j].x * pts[i].y - pts[i].x * pts[j].y
  }
  return Math.abs(sum / 2)
}

/** The message mocks of the mocked AcEdCommand. */
const spies = (cmd: object) =>
  cmd as unknown as { notify: jest.Mock; showMessage: jest.Mock }

const hatchLoops = (hatch: AcDbHatch) =>
  (hatch as unknown as { _geo: { loops: unknown[] } })._geo.loops

describe('AcApHatchCmd boundary detection', () => {
  const room = () => [
    // Walls drawn as crossing lines that stick out, plus a divider.
    segment(-1, 0, 21, 0),
    segment(-1, 10, 21, 10),
    segment(0, -1, 0, 11),
    segment(20, -1, 20, 11),
    segment(8, 0, 8, 10)
  ]

  test('pick point hatches the smallest closed area around the point', () => {
    const { appended, context } = createDrawing(room())
    const cmd = new TestHatchCmd(createSettings())

    expect(cmd.pickForTest(context, 4, 5)).toBe(true)
    expect(cmd.pickForTest(context, 14, 5)).toBe(true)

    expect(appended).toHaveLength(2)
    expect(loopArea(hatchLoops(appended[0])[0])).toBeCloseTo(80)
    expect(loopArea(hatchLoops(appended[1])[0])).toBeCloseTo(120)
    expect(spies(cmd).showMessage).toHaveBeenCalledWith(
      'jig.hatch.boundaryFound'
    )
  })

  test('warns when the point is not enclosed or the area is already hatched', () => {
    const { appended, context } = createDrawing(room())
    const cmd = new TestHatchCmd(createSettings())

    expect(cmd.pickForTest(context, 30, 5)).toBe(false)
    expect(spies(cmd).notify).toHaveBeenLastCalledWith(
      'jig.hatch.boundaryNotFound',
      'warning'
    )

    expect(cmd.pickForTest(context, 4, 5)).toBe(true)
    expect(cmd.pickForTest(context, 5, 6)).toBe(false)
    expect(spies(cmd).notify).toHaveBeenLastCalledWith(
      'jig.hatch.alreadyHatched',
      'warning'
    )
    expect(appended).toHaveLength(1)
  })

  test('ignores objects on layers that are off', () => {
    const divider = segment(8, 0, 8, 10)
    divider.layer = 'HIDDEN'
    const { appended, context, database } = createDrawing([
      ...room().slice(0, 4),
      divider
    ])
    const layer = new AcDbLayerTableRecord({ name: 'HIDDEN' })
    database.tables.layerTable.add(layer)
    layer.isOff = true
    const cmd = new TestHatchCmd(createSettings())

    expect(cmd.pickForTest(context, 4, 5)).toBe(true)
    expect(loopArea(hatchLoops(appended[0])[0])).toBeCloseTo(200)
  })

  test('keeps a circle exact and leaves islands out with the Ignore style', () => {
    const circle = new AcDbCircle(new AcGePoint3d(14, 5, 0), 2)
    const normal = createDrawing([...room(), circle])
    const cmd = new TestHatchCmd(createSettings())

    expect(cmd.pickForTest(normal.context, 18, 9)).toBe(true)
    let loops = hatchLoops(normal.appended[0])
    expect(loops).toHaveLength(2)
    expect(spies(cmd).showMessage).toHaveBeenLastCalledWith(
      'jig.hatch.boundaryFoundIslands'
    )
    // The island is the circle itself, not a polygon approximating it.
    expect(loops[1]).toBeInstanceOf(AcGeLoop2d)
    expect((loops[1] as AcGeLoop2d).curves[0]).toBeInstanceOf(AcGeCircArc2d)

    const ignore = createDrawing([
      ...room(),
      new AcDbCircle(new AcGePoint3d(14, 5, 0), 2)
    ])
    const ignoreCmd = new TestHatchCmd(
      createSettings({ style: AcDbHatchStyle.Ignore })
    )
    expect(ignoreCmd.pickForTest(ignore.context, 18, 9)).toBe(true)
    loops = hatchLoops(ignore.appended[0])
    expect(loops).toHaveLength(1)
  })

  test('traces lines inside block references', () => {
    const services = acdbHostApplicationServices() as unknown as {
      _workingDatabase: AcDbDatabase | null
      workingDatabase: AcDbDatabase
    }
    const previous = services._workingDatabase
    try {
      const { appended, context } = createDrawing(database => {
        // Block references find their block through the working database.
        services.workingDatabase = database
        const block = new AcDbBlockTableRecord()
        block.name = 'SQUARE'
        database.tables.blockTable.add(block)
        block.appendEntity(segment(0, 0, 10, 0))
        block.appendEntity(segment(10, 0, 10, 10))
        block.appendEntity(segment(10, 10, 0, 10))
        block.appendEntity(segment(0, 10, 0, 0))
        const insert = new AcDbBlockReference('SQUARE')
        insert.position = new AcGePoint3d(100, 0, 0)
        insert.scaleFactors = new AcGePoint3d(2, 2, 1)
        return [insert]
      })
      const cmd = new TestHatchCmd(createSettings())

      expect(cmd.pickForTest(context, 110, 10)).toBe(true)
      expect(loopArea(hatchLoops(appended[0])[0])).toBeCloseTo(400)
    } finally {
      services._workingDatabase = previous
    }
  })

  test('closes gaps up to the gap tolerance (HPGAPTOL)', () => {
    // A square whose right side stops 0.5 short of the bottom corner.
    const square = () => [
      segment(0, 0, 10, 0),
      segment(10, 0.5, 10, 10),
      segment(10, 10, 0, 10),
      segment(0, 10, 0, 0)
    ]
    try {
      const strict = createDrawing(square())
      const strictCmd = new TestHatchCmd(createSettings())
      expect(strictCmd.pickForTest(strict.context, 5, 5)).toBe(false)

      mockSettings.hatchGapTolerance = 1
      const loose = createDrawing(square())
      const looseCmd = new TestHatchCmd(createSettings())
      expect(looseCmd.pickForTest(loose.context, 5, 5)).toBe(true)
      expect(loopArea(hatchLoops(loose.appended[0])[0])).toBeCloseTo(100, 0)

      // A divider that stops 0.5 short of the top wall closes on it too.
      const divided = createDrawing([
        segment(0, 0, 10, 0),
        segment(10, 0, 10, 10),
        segment(10, 10, 0, 10),
        segment(0, 10, 0, 0),
        segment(4, 0, 4, 9.5)
      ])
      const dividedCmd = new TestHatchCmd(createSettings())
      expect(dividedCmd.pickForTest(divided.context, 2, 5)).toBe(true)
      expect(loopArea(hatchLoops(divided.appended[0])[0])).toBeCloseTo(40)
    } finally {
      mockSettings.hatchGapTolerance = 0
    }
  })

  test('falls back to the objects in view past the segment limit', () => {
    const { appended, context } = createDrawing([
      segment(0, 0, 10, 0),
      segment(10, 0, 10, 10),
      segment(10, 10, 0, 10),
      segment(0, 10, 0, 0),
      // Far away, outside the view.
      segment(1000, 0, 1010, 0),
      segment(1000, 5, 1010, 5)
    ])
    const view = context as unknown as {
      view: Record<string, unknown>
      doc: { database: AcDbDatabase }
    }
    const ids = [
      ...view.doc.database.tables.blockTable.modelSpace.newIterator()
    ].map(e => e.objectId)
    const search = jest.fn(() => ids.slice(0, 4).map(id => ({ id })))
    Object.assign(view.view, {
      width: 100,
      height: 100,
      screenToWorld: (p: { x: number; y: number }) => p,
      search
    })
    try {
      mockSettings.hatchMaxSegments = 5
      const cmd = new TestHatchCmd(createSettings())
      expect(cmd.pickForTest(context, 5, 5)).toBe(true)
      expect(search).toHaveBeenCalled()
      expect(loopArea(hatchLoops(appended[0])[0])).toBeCloseTo(100)

      // Still too many in view.
      mockSettings.hatchMaxSegments = 3
      const tight = new TestHatchCmd(createSettings())
      expect(tight.pickForTest(context, 5, 5)).toBe(false)
      expect(spies(tight).notify).toHaveBeenLastCalledWith(
        'jig.hatch.tooComplex',
        'warning'
      )
    } finally {
      mockSettings.hatchMaxSegments = 60_000
    }
  })

  test('select objects hatches what the selected objects enclose', () => {
    const lines = [
      segment(0, 0, 10, 0),
      segment(10, 0, 10, 10),
      segment(10, 10, 0, 10),
      segment(0, 10, 0, 0)
    ]
    const stray = segment(20, 0, 30, 0)
    const { appended, context } = createDrawing([...lines, stray])
    const cmd = new TestHatchCmd(createSettings())

    expect(
      cmd.selectForTest(
        context,
        [...lines, stray].map(e => e.objectId)
      )
    ).toBe(true)
    expect(appended).toHaveLength(1)
    expect(loopArea(hatchLoops(appended[0])[0])).toBeCloseTo(100)
    expect(spies(cmd).showMessage).toHaveBeenCalledWith('jig.hatch.selectFound')
    expect(spies(cmd).notify).toHaveBeenCalledWith(
      'jig.hatch.selectNotClosed',
      'warning'
    )
  })

  test('select objects warns when nothing selected is closed', () => {
    const stray = segment(20, 0, 30, 0)
    const { appended, context } = createDrawing([stray])
    const cmd = new TestHatchCmd(createSettings())

    expect(cmd.selectForTest(context, [stray.objectId])).toBe(false)
    expect(appended).toHaveLength(0)
    expect(spies(cmd).notify).toHaveBeenCalledWith(
      'jig.hatch.invalidBoundary',
      'warning'
    )
  })
})
