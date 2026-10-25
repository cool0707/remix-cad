import {
  AcDbDatabase,
  AcDbSystemVariables,
  AcDbSysVarManager
} from '@mlightcad/data-model'

import {
  constrainToAngleStep,
  constrainToTracking,
  isPolarTrackingEnabled,
  POLARMODE_POLAR_TRACKING
} from '../src/editor/input/AcEdPolarTracking'

describe('polar tracking', () => {
  let database: AcDbDatabase
  const reference = { x: 0, y: 0 }

  beforeEach(() => {
    database = new AcDbDatabase()
    const manager = AcDbSysVarManager.instance()
    manager.setVar(AcDbSystemVariables.POLARMODE, 0, database)
    manager.setVar(AcDbSystemVariables.POLARANG, 90, database)
    manager.setVar(AcDbSystemVariables.POLARADDANG, '', database)
    database.angbase = 0
    database.angdir = 0
  })

  it('reports disabled when POLARMODE bit 2 is clear', () => {
    expect(isPolarTrackingEnabled(database)).toBe(false)
  })

  it('reports enabled when POLARMODE bit 2 is set', () => {
    AcDbSysVarManager.instance().setVar(
      AcDbSystemVariables.POLARMODE,
      POLARMODE_POLAR_TRACKING,
      database
    )
    expect(isPolarTrackingEnabled(database)).toBe(true)
  })

  it('locks to 90° increments when polar tracking is on', () => {
    AcDbSysVarManager.instance().setVar(
      AcDbSystemVariables.POLARMODE,
      POLARMODE_POLAR_TRACKING,
      database
    )

    const cursor = { x: 10, y: 8 }
    const constrained = constrainToTracking(cursor, reference, database)
    const distance = Math.hypot(cursor.x, cursor.y)
    expect(constrained.x).toBeCloseTo(distance, 5)
    expect(constrained.y).toBeCloseTo(0, 5)
  })

  it('uses POLARANG increment when set to 45°', () => {
    AcDbSysVarManager.instance().setVar(
      AcDbSystemVariables.POLARMODE,
      POLARMODE_POLAR_TRACKING,
      database
    )
    AcDbSysVarManager.instance().setVar(
      AcDbSystemVariables.POLARANG,
      45,
      database
    )

    const constrained = constrainToTracking(
      { x: 10, y: 8 },
      reference,
      database
    )
    const angle = Math.atan2(constrained.y, constrained.x)
    expect(angle).toBeCloseTo(Math.PI / 4, 5)
  })
})

describe('constrainToAngleStep (Shift 45° snap)', () => {
  const base = { x: 10, y: 10 }
  const close = (p: { x: number; y: number }, x: number, y: number) => {
    expect(p.x).toBeCloseTo(x, 9)
    expect(p.y).toBeCloseTo(y, 9)
  }

  it('snaps to the nearest 0 / 45 / 90° ray by projection', () => {
    // 10° off horizontal → horizontal, projected length.
    close(constrainToAngleStep({ x: 20, y: 11 }, base), 20, 10)
    // Near 45° → diagonal through the projection.
    close(constrainToAngleStep({ x: 20, y: 19 }, base), 19.5, 19.5)
    // Near 90°.
    close(constrainToAngleStep({ x: 11, y: 30 }, base), 10, 30)
    // Near 225°.
    close(constrainToAngleStep({ x: 0, y: 1 }, base), 0.5, 0.5)
  })

  it('leaves a point on the base untouched', () => {
    close(constrainToAngleStep(base, base), 10, 10)
  })
})
