import {
  AcDbArc,
  AcDbCircle,
  AcDbIntersect,
  AcDbLine,
  AcDbPolyline,
  AcGePoint2d,
  AcGePoint3d
} from '@mlightcad/data-model'

import {
  acapBreakPieces,
  acapCorner,
  acapEndSegEntity,
  acapEntityFromSegs,
  acapExtendPath,
  acapParallelJoin,
  acapParamsOfPoints,
  acapPolylineVertices,
  acapProjectOnPath,
  acapReadCurvePath,
  acapSegEnd,
  acapSegPointAt,
  acapSegStart,
  acapTrimPieces,
  acapWriteSegs
} from '../src/command/modify/AcApCurvePath'

const close = (a: number, b: number, eps = 1e-6) =>
  expect(Math.abs(a - b)).toBeLessThan(eps)

const line = (x1: number, y1: number, x2: number, y2: number) =>
  new AcDbLine(new AcGePoint3d(x1, y1, 0), new AcGePoint3d(x2, y2, 0))

describe('AcApCurvePath', () => {
  test('trims the middle of a line between two crossing lines', () => {
    const target = line(0, 0, 10, 0)
    const path = acapReadCurvePath(target)!
    const hits = [line(3, -1, 3, 1), line(7, -1, 7, 1)].flatMap(c =>
      target.intersectWith(c, AcDbIntersect.OnBothOperands)
    )
    const cuts = acapParamsOfPoints(path, hits)
    expect(cuts).toHaveLength(2)
    const pick = acapProjectOnPath(path, { x: 5, y: 0.1 }).t
    const pieces = acapTrimPieces(path, cuts, pick)!
    expect(pieces).toHaveLength(2)
    close(acapSegEnd(pieces[0][0]).x, 3)
    close(acapSegStart(pieces[1][0]).x, 7)

    // Picking the end piece keeps only the rest.
    const endPieces = acapTrimPieces(
      path,
      cuts,
      acapProjectOnPath(path, { x: 9, y: 0 }).t
    )!
    expect(endPieces).toHaveLength(1)
    close(acapSegEnd(endPieces[0][0]).x, 7)
  })

  test('trim without any cut removes the object, a circle needs two cuts', () => {
    const path = acapReadCurvePath(line(0, 0, 10, 0))!
    expect(acapTrimPieces(path, [], 0.5)).toEqual([])

    const circle = new AcDbCircle(new AcGePoint3d(0, 0, 0), 5)
    const cpath = acapReadCurvePath(circle)!
    expect(acapTrimPieces(cpath, [0.1], 0.5)).toBeNull()
    // Cut at 0° and 90°, pick at 45°: the rest (90° → 360°) stays.
    const pieces = acapTrimPieces(cpath, [0, 0.25], 0.125)!
    expect(pieces).toHaveLength(1)
    const arc = acapEntityFromSegs('circle', pieces[0], 0) as AcDbArc
    expect(arc).toBeInstanceOf(AcDbArc)
    close(arc.startAngle, Math.PI / 2)
    close(arc.endAngle % (Math.PI * 2), 0)
    close(arc.endPoint.x, 5)
  })

  test('trims a closed polyline across its start vertex', () => {
    const pl = AcDbPolyline.from2dPoints(
      [
        new AcGePoint2d(0, 0),
        new AcGePoint2d(10, 0),
        new AcGePoint2d(10, 10),
        new AcGePoint2d(0, 10)
      ],
      true
    )
    const path = acapReadCurvePath(pl)!
    expect(path.segs).toHaveLength(4)
    // Cuts at (5,0) and (0,5); pick the corner (0,0) side.
    const cuts = acapParamsOfPoints(path, [
      { x: 5, y: 0 },
      { x: 0, y: 5 }
    ])
    const pieces = acapTrimPieces(
      path,
      cuts,
      acapProjectOnPath(path, { x: 1, y: 0 }).t
    )!
    expect(pieces).toHaveLength(1)
    const out = new AcDbPolyline()
    expect(acapWriteSegs(out, pieces[0], 0)).toBe(true)
    const v = acapPolylineVertices(out)
    expect(v.map(p => [p.x, p.y])).toEqual([
      [5, 0],
      [10, 0],
      [10, 10],
      [0, 10],
      [0, 5]
    ])
    expect(out.closed).toBe(false)
  })

  test('keeps arcs of a bulged polyline when trimming', () => {
    const pl = new AcDbPolyline()
    // Half circle from (0,0) to (10,0) through (5,-5) (CCW → bulge 1).
    pl.addVertexAt(0, new AcGePoint2d(0, 0), 1)
    pl.addVertexAt(1, new AcGePoint2d(10, 0), 0)
    pl.addVertexAt(2, new AcGePoint2d(20, 0), 0)
    const path = acapReadCurvePath(pl)!
    expect(path.segs[0].kind).toBe('arc')
    close(acapProjectOnPath(path, { x: 5, y: -5 }).t, 0.5)
    const pieces = acapBreakPieces(path, 0.5, 1.5)!
    expect(pieces).toHaveLength(2)
    const first = new AcDbPolyline()
    acapWriteSegs(first, pieces[0], 0)
    const v = acapPolylineVertices(first)
    close(v[0].bulge!, Math.tan(Math.PI / 8))
    close(v[1].x, 5)
    close(v[1].y, -5)
  })

  test('breaks a circle counter-clockwise from the first point', () => {
    const path = acapReadCurvePath(new AcDbCircle(new AcGePoint3d(0, 0, 0), 1))!
    const pieces = acapBreakPieces(path, 0, 0.25)!
    const arc = acapEntityFromSegs('circle', pieces[0], 0) as AcDbArc
    close(arc.startAngle, Math.PI / 2)
  })

  test('break at one point splits a line in two', () => {
    const path = acapReadCurvePath(line(0, 0, 10, 0))!
    const pieces = acapBreakPieces(path, 0.4, 0.4)!
    expect(pieces).toHaveLength(2)
    expect(acapBreakPieces(path, 0, 0)).toBeNull()
  })

  test('extends a line and an arc to a boundary', () => {
    const target = line(0, 0, 5, 0)
    const path = acapReadCurvePath(target)!
    const boundary = line(8, -5, 8, 5)
    const probe = acapEndSegEntity(path, 'end')
    const hits = probe.intersectWith(boundary, AcDbIntersect.ExtendThis)
    const extended = acapExtendPath(path, 'end', hits)!
    close(acapSegEnd(extended.segs[0]).x, 8)
    // Nothing behind the start.
    expect(acapExtendPath(path, 'start', hits)).toBeUndefined()

    // Arc of radius 5 from 0° to 90°, extended at its end to the line x = -3.
    const arc = new AcDbArc(new AcGePoint3d(0, 0, 0), 5, 0, Math.PI / 2)
    const apath = acapReadCurvePath(arc)!
    const wall = line(-3, -10, -3, 10)
    const ahits = acapEndSegEntity(apath, 'end').intersectWith(
      wall,
      AcDbIntersect.ExtendThis
    )
    const aext = acapExtendPath(apath, 'end', ahits)!
    const end = acapSegEnd(aext.segs[0])
    close(end.x, -3)
    close(end.y, 4)
  })

  test('fillet and chamfer corners', () => {
    const p = { x: 0, y: 0 }
    const fillet = acapCorner(p, { x: 1, y: 0 }, { x: 0, y: 1 }, { radius: 2 })!
    close(fillet.t1.x, 2)
    close(fillet.t2.y, 2)
    close(fillet.arc!.c.x, 2)
    close(fillet.arc!.c.y, 2)
    close(Math.abs(fillet.arc!.sweep), Math.PI / 2)
    close(acapSegEnd(fillet.arc!).y, 2)
    close(acapSegEnd(fillet.arc!).x, 0)

    const chamfer = acapCorner(p, { x: 1, y: 0 }, { x: 0, y: 1 }, { d1: 1, d2: 3 })!
    close(chamfer.t1.x, 1)
    close(chamfer.t2.y, 3)
    expect(acapCorner(p, { x: 1, y: 0 }, { x: -1, y: 0 }, { radius: 1 })).toBeUndefined()
  })
})

describe('acapParallelJoin', () => {
  test('joins two parallel lines with a half circle at the picked end', () => {
    // First line y = 0 (0…10), second y = 4 (2…20); picked near x = 10.
    const join = acapParallelJoin(
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 9, y: 0 },
      { x: 2, y: 4 },
      { x: 20, y: 4 }
    )!
    expect(join.moveStart2).toBe(false)
    expect(join.end2).toEqual({ x: 10, y: 4 })
    expect(join.arc.r).toBeCloseTo(2)
    // The half circle bulges outwards (to +x).
    const mid = acapSegPointAt(join.arc, 0.5)
    expect(mid.x).toBeCloseTo(12)
    expect(mid.y).toBeCloseTo(2)
    expect(acapSegEnd(join.arc).y).toBeCloseTo(4)

    // Picked near the start: the half circle goes out to −x.
    const left = acapParallelJoin(
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 1, y: 0 },
      { x: 20, y: 4 },
      { x: 2, y: 4 }
    )!
    expect(left.moveStart2).toBe(false)
    expect(left.end2).toEqual({ x: 0, y: 4 })
    expect(acapSegPointAt(left.arc, 0.5).x).toBeCloseTo(-2)
  })

  test('collinear lines cannot be joined', () => {
    expect(
      acapParallelJoin(
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 9, y: 0 },
        { x: 12, y: 0 },
        { x: 20, y: 0 }
      )
    ).toBeUndefined()
  })
})
