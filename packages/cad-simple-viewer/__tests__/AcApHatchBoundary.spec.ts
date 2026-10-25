import {
  AcApHatchBoundaryFinder,
  type AcApHatchPolyline,
  acapHatchSignedArea,
  acapHatchSnapEnds
} from '../src/command/draw/AcApHatchBoundary'

const line = (x1: number, y1: number, x2: number, y2: number) => [
  { x: x1, y: y1 },
  { x: x2, y: y2 }
]

const rect = (x1: number, y1: number, x2: number, y2: number) => [
  line(x1, y1, x2, y1),
  line(x2, y1, x2, y2),
  line(x2, y2, x1, y2),
  line(x1, y2, x1, y1)
]

const circle = (cx: number, cy: number, r: number, n = 64) => [
  Array.from({ length: n + 1 }, (_, i) => ({
    x: cx + r * Math.cos((i / n) * Math.PI * 2),
    y: cy + r * Math.sin((i / n) * Math.PI * 2)
  }))
]

const finder = (polys: AcApHatchPolyline[]) =>
  new AcApHatchBoundaryFinder(acapHatchSnapEnds(polys, 0.01, 1e-7), 1e-7)

describe('AcApHatchBoundaryFinder.boundaryAt', () => {
  test('finds the room around the point when rooms share a wall', () => {
    // Two rooms drawn as separate rectangles: the middle wall is drawn twice.
    const f = finder([...rect(0, 0, 10, 10), ...rect(10, 0, 20, 10)])
    const left = f.boundaryAt({ x: 5, y: 5 })
    const right = f.boundaryAt({ x: 15, y: 5 })
    expect(acapHatchSignedArea(left!.outer)).toBeCloseTo(100)
    expect(acapHatchSignedArea(right!.outer)).toBeCloseTo(100)
  })

  test('splits lines where they cross (overhanging ends)', () => {
    // A "#": four lines that cross, each sticking out past the others.
    const f = finder([
      line(-5, 0, 15, 0),
      line(-5, 10, 15, 10),
      line(0, -5, 0, 15),
      line(10, -5, 10, 15)
    ])
    const found = f.boundaryAt({ x: 5, y: 5 })
    expect(acapHatchSignedArea(found!.outer)).toBeCloseTo(100)
    // Outside the square nothing is enclosed.
    expect(f.boundaryAt({ x: 12, y: 12 })).toBeUndefined()
  })

  test('divides a room with a line that ends on its walls (T junctions)', () => {
    const f = finder([...rect(0, 0, 10, 10), line(4, 0, 4, 10)])
    expect(
      acapHatchSignedArea(f.boundaryAt({ x: 2, y: 5 })!.outer)
    ).toBeCloseTo(40)
    expect(
      acapHatchSignedArea(f.boundaryAt({ x: 7, y: 5 })!.outer)
    ).toBeCloseTo(60)
  })

  test('closes a line that stops a hair short of a wall', () => {
    const f = finder([...rect(0, 0, 10, 10), line(4, 0, 4, 9.995)])
    expect(
      acapHatchSignedArea(f.boundaryAt({ x: 2, y: 5 })!.outer)
    ).toBeCloseTo(40, 2)
  })

  test('splits collinear overlapping lines', () => {
    const f = finder([
      line(0, 0, 6, 0),
      line(4, 0, 10, 0),
      line(10, 0, 10, 10),
      line(10, 10, 0, 10),
      line(0, 10, 0, 0),
      line(5, 0, 5, 10)
    ])
    expect(
      acapHatchSignedArea(f.boundaryAt({ x: 2, y: 5 })!.outer)
    ).toBeCloseTo(50)
    expect(
      acapHatchSignedArea(f.boundaryAt({ x: 8, y: 5 })!.outer)
    ).toBeCloseTo(50)
  })

  test('reports curves inside the area as islands', () => {
    const f = finder([
      ...rect(0, 0, 20, 20),
      ...circle(5, 10, 2),
      ...rect(12, 8, 16, 12)
    ])
    const found = f.boundaryAt({ x: 10, y: 2 })!
    expect(acapHatchSignedArea(found.outer)).toBeCloseTo(400)
    expect(found.islands).toHaveLength(2)
    // Picking inside an island fills the island.
    const inside = f.boundaryAt({ x: 5, y: 10 })!
    expect(acapHatchSignedArea(inside.outer)).toBeCloseTo(Math.PI * 4, 0)
    expect(inside.islands).toHaveLength(0)
  })

  test('finds nothing in an open shape', () => {
    const f = finder([line(0, 0, 10, 0), line(10, 0, 10, 10)])
    expect(f.boundaryAt({ x: 8, y: 2 })).toBeUndefined()
  })

  test('names the curves that make up the outer loop', () => {
    const polys = [...rect(0, 0, 10, 10), line(4, 0, 4, 10)]
    const found = finder(polys).boundaryAt({ x: 2, y: 5 })!
    // Bottom, top and left walls plus the divider; not the right wall.
    expect(found.outerSources).toEqual([0, 2, 3, 4])
  })
})

describe('AcApHatchBoundaryFinder.closedOutlines', () => {
  test('returns the outline of every closed group, without dangling ends', () => {
    const f = finder([
      ...rect(0, 0, 10, 10),
      line(10, 5, 15, 5),
      ...rect(20, 0, 30, 10),
      line(40, 0, 50, 0)
    ])
    const outlines = f.closedOutlines()
    expect(outlines).toHaveLength(2)
    outlines.forEach(o =>
      expect(acapHatchSignedArea(o.outline)).toBeCloseTo(100)
    )
  })
})
