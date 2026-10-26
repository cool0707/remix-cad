import {
  AcDbCircle,
  AcDbLine,
  AcDbPolyline,
  AcGePoint2d,
  AcGePoint3d
} from '@mlightcad/data-model'

import { acedGripKind } from '../src/editor/grip/AcEdGripKind'

function polyline(closed: boolean) {
  const pl = new AcDbPolyline()
  pl.addVertexAt(0, new AcGePoint2d(0, 0))
  pl.addVertexAt(1, new AcGePoint2d(10, 0))
  pl.addVertexAt(2, new AcGePoint2d(10, 10))
  pl.closed = closed
  return pl
}

describe('acedGripKind', () => {
  test('polyline vertices are point grips', () => {
    const pl = polyline(false)
    for (let i = 0; i < 3; i++) {
      expect(acedGripKind(pl, i)).toEqual({ kind: 'point' })
    }
  })

  test('polyline segment midpoints are edge grips along the segment', () => {
    const pl = polyline(false)
    const kind = acedGripKind(pl, 4)
    expect(kind.kind).toBe('edge')
    if (kind.kind !== 'edge') return
    expect([kind.from.x, kind.from.y]).toEqual([10, 0])
    expect([kind.to.x, kind.to.y]).toEqual([10, 10])
    // Open: 2 segments only.
    expect(acedGripKind(pl, 5)).toEqual({ kind: 'point' })
  })

  test('closed polyline closing segment wraps to the first vertex', () => {
    const kind = acedGripKind(polyline(true), 5)
    expect(kind.kind).toBe('edge')
    if (kind.kind !== 'edge') return
    expect([kind.from.x, kind.from.y]).toEqual([10, 10])
    expect([kind.to.x, kind.to.y]).toEqual([0, 0])
  })

  test('line midpoint is an edge grip, its ends are point grips', () => {
    const line = new AcDbLine(
      new AcGePoint3d(0, 0, 0),
      new AcGePoint3d(4, 3, 0)
    )
    expect(acedGripKind(line, 0).kind).toBe('edge')
    expect(acedGripKind(line, 1)).toEqual({ kind: 'point' })
    expect(acedGripKind(line, 2)).toEqual({ kind: 'point' })
  })

  test('other entities use point grips', () => {
    const circle = new AcDbCircle(new AcGePoint3d(0, 0, 0), 5)
    expect(acedGripKind(circle, 0)).toEqual({ kind: 'point' })
  })
})
