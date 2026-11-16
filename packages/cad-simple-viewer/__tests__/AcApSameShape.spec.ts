import {
  AcDbArc,
  AcDbAttribute,
  AcDbAttributeDefinition,
  AcDbBlockReference,
  AcDbBlockTableRecord,
  AcDbCircle,
  AcDbDatabase,
  AcDbEntity,
  AcDbLine,
  AcDbPolyline,
  AcDbText,
  AcGeMatrix3d,
  AcGePoint2d,
  AcGePoint3d
} from '@mlightcad/data-model'

import {
  acapCanMakeSameShapeSymbols,
  acapFindSameShape,
  acapReplaceSameShapesWithSymbol,
  acapSameShapeSymbolName
} from '../src/app/AcApSameShape'
import {
  acapMatchShapes,
  type AcApShapeMatchOptions,
  type AcApShapePart,
  type AcApShapeUnit
} from '../src/app/AcApShapeMatch'
import { acapShapePartsOf } from '../src/app/AcApShapeParts'
import { acapExplodeBlockReferences } from '../src/service/AcApBlockExplode'
import { acapRunServiceEdit } from '../src/service/AcApServiceEdit'

const ALL: AcApShapeMatchOptions = { rotate: true, mirror: true, scale: true }
const MOVE_ONLY: AcApShapeMatchOptions = {
  rotate: false,
  mirror: false,
  scale: false
}

type Pt = [number, number]

/** An "L" with a hook: not symmetric, so turns and mirrors differ. */
const HOOK: Pt[][] = [
  [
    [0, 0],
    [4, 0]
  ],
  [
    [0, 0],
    [0, 2]
  ],
  [
    [0, 2],
    [1, 2]
  ]
]

function linesOf(segments: Pt[][], map: (p: Pt) => Pt = p => p) {
  return segments.map(([p, q]) => {
    const a = map(p)
    const b = map(q)
    return new AcDbLine(
      new AcGePoint3d(a[0], a[1], 0),
      new AcGePoint3d(b[0], b[1], 0)
    )
  })
}

function turn(angle: number, dx: number, dy: number, s = 1, mirror = false) {
  return ([x, y]: Pt): Pt => {
    const yy = mirror ? -y : y
    return [
      s * (x * Math.cos(angle) - yy * Math.sin(angle)) + dx,
      s * (x * Math.sin(angle) + yy * Math.cos(angle)) + dy
    ]
  }
}

function units(entities: AcDbEntity[]): AcApShapeUnit<AcDbEntity>[] {
  return entities.map(entity => ({
    key: entity,
    parts: acapShapePartsOf(entity)
  }))
}

function partsOf(entities: AcDbEntity[]): AcApShapePart[] {
  return entities.flatMap(entity => acapShapePartsOf(entity))
}

describe('acapMatchShapes', () => {
  const pattern = partsOf(linesOf(HOOK))
  const moved = linesOf(HOOK, turn(0, 100, 0))
  const turned = linesOf(HOOK, turn(Math.PI / 6, 0, 100))
  const mirrored = linesOf(HOOK, turn(0, 100, 100, 1, true))
  const larger = linesOf(HOOK, turn(0, 200, 0, 2))
  const all = [...moved, ...turned, ...mirrored, ...larger]

  const count = (options: AcApShapeMatchOptions) =>
    acapMatchShapes(pattern, units(all), options).matches.length

  test('finds moved copies only, when nothing else is allowed', () => {
    const result = acapMatchShapes(pattern, units(all), MOVE_ONLY)
    expect(result.matches).toHaveLength(1)
    expect(result.matches[0].keys).toHaveLength(moved.length)
    expect(
      result.matches[0].keys.every(k => moved.includes(k as AcDbLine))
    ).toBe(true)
    expect(result.matches[0].transform.tx).toBeCloseTo(100)
    expect(result.matches[0].rotation).toBeCloseTo(0)
  })

  test('each option adds its copies', () => {
    expect(count({ ...MOVE_ONLY, rotate: true })).toBe(2)
    expect(count({ ...MOVE_ONLY, mirror: true })).toBe(2)
    expect(count({ ...MOVE_ONLY, scale: true })).toBe(2)
    expect(count(ALL)).toBe(4)
  })

  test('reports the turn, the mirror and the size', () => {
    const matches = acapMatchShapes(pattern, units(all), ALL).matches
    const of = (entities: AcDbEntity[]) =>
      matches.find(m => m.keys.includes(entities[0]))!
    expect(of(turned).rotation).toBeCloseTo(Math.PI / 6)
    expect(of(mirrored).mirrored).toBe(true)
    expect(of(larger).scale).toBeCloseTo(2)
    expect(of(moved).mirrored).toBe(false)
  })

  test('a mirror about a vertical axis counts without turning', () => {
    const flipped = linesOf(HOOK, ([x, y]) => [-x + 50, y])
    const result = acapMatchShapes(pattern, units(flipped), {
      ...MOVE_ONLY,
      mirror: true
    })
    expect(result.matches).toHaveLength(1)
    expect(result.matches[0].mirrored).toBe(true)
  })

  test('a polyline drawn over the same lines is the same shape', () => {
    const polyline = new AcDbPolyline()
    ;[
      [1, 2],
      [0, 2],
      [0, 0],
      [4, 0]
    ].forEach(([x, y], i) =>
      polyline.addVertexAt(i, new AcGePoint2d(x + 10, y))
    )
    const result = acapMatchShapes(pattern, units([polyline]), MOVE_ONLY)
    expect(result.matches).toHaveLength(1)
    expect(result.matches[0].keys).toHaveLength(1)
    expect(result.matches[0].keys[0]).toBe(polyline)
  })

  test('an entity that is only partly the shape is not a match', () => {
    const polyline = new AcDbPolyline()
    ;[
      [1, 2],
      [0, 2],
      [0, 0],
      [4, 0],
      [4, 3]
    ].forEach(([x, y], i) =>
      polyline.addVertexAt(i, new AcGePoint2d(x + 10, y))
    )
    expect(
      acapMatchShapes(pattern, units([polyline]), ALL).matches
    ).toHaveLength(0)
  })

  test('a symmetric shape is reported with the plainest transform', () => {
    const square: Pt[][] = [
      [
        [0, 0],
        [1, 0]
      ],
      [
        [1, 0],
        [1, 1]
      ],
      [
        [1, 1],
        [0, 1]
      ],
      [
        [0, 1],
        [0, 0]
      ]
    ]
    const result = acapMatchShapes(
      partsOf(linesOf(square)),
      units(linesOf(square, turn(0, 5, 5))),
      ALL
    )
    expect(result.matches).toHaveLength(1)
    expect(result.matches[0].mirrored).toBe(false)
    expect(result.matches[0].rotation).toBeCloseTo(0)
  })

  test('circles alone: by the distance between them', () => {
    const circle = (x: number, y: number, r: number) =>
      new AcDbCircle(new AcGePoint3d(x, y, 0), r)
    const pair = [circle(0, 0, 1), circle(3, 0, 0.5)]
    const copy = [circle(10, 10, 1), circle(10, 13, 0.5)]
    const other = [circle(20, 0, 1), circle(24, 0, 0.5)]
    const result = acapMatchShapes(
      partsOf(pair),
      units([...copy, ...other]),
      ALL
    )
    expect(result.matches).toHaveLength(1)
    expect(result.matches[0].keys).toHaveLength(2)
    expect(
      result.matches[0].keys.every(k => copy.includes(k as AcDbCircle))
    ).toBe(true)
  })

  test('one circle: any circle as large', () => {
    const result = acapMatchShapes(
      partsOf([new AcDbCircle(new AcGePoint3d(0, 0, 0), 2)]),
      units([
        new AcDbCircle(new AcGePoint3d(9, 9, 0), 2),
        new AcDbCircle(new AcGePoint3d(5, 5, 0), 3)
      ]),
      MOVE_ONLY
    )
    expect(result.matches).toHaveLength(1)
  })
})

/** A drawing with a DOOR symbol: a leaf (line) and its swing (arc). */
function doorDrawing(withProperty = false) {
  const db = new AcDbDatabase()
  db.createDefaultData()
  const block = new AcDbBlockTableRecord()
  block.name = 'DOOR'
  db.tables.blockTable.add(block)
  const leaf = new AcDbLine(new AcGePoint3d(0, 0, 0), new AcGePoint3d(0, 10, 0))
  const swing = new AcDbArc(new AcGePoint3d(0, 0, 0), 10, 0, Math.PI / 2)
  const jamb = new AcDbLine(new AcGePoint3d(0, 0, 0), new AcGePoint3d(12, 0, 0))
  const contents: AcDbEntity[] = [leaf, swing, jamb]
  if (withProperty) {
    const definition = new AcDbAttributeDefinition()
    definition.tag = 'NO'
    definition.textString = 'D?'
    definition.height = 2
    definition.position = new AcGePoint3d(2, 2, 0)
    contents.push(definition)
  }
  block.appendEntity(contents)
  const space = db.tables.blockTable.modelSpace
  const place = (
    x: number,
    y: number,
    rotation = 0,
    sx = 1,
    value?: string
  ) => {
    const ref = new AcDbBlockReference('DOOR')
    ref.position = new AcGePoint3d(x, y, 0)
    ref.rotation = rotation
    ref.scaleFactors = new AcGePoint3d(sx, 1, 1)
    space.appendEntity(ref)
    if (value != null) {
      for (const definition of block.newIterator()) {
        if (!(definition instanceof AcDbAttributeDefinition)) continue
        const attribute = new AcDbAttribute()
        attribute.tag = definition.tag
        attribute.textString = value
        attribute.height = definition.height
        attribute.position = definition.position.clone()
        attribute.transformBy(
          new AcGeMatrix3d().multiplyMatrices(
            new AcGeMatrix3d().setFromExtrusionDirection(ref.normal),
            ref.blockTransform
          )
        )
        ref.appendAttributes(attribute)
      }
    }
    return ref
  }
  return { db, space, place }
}

function modelEntities(db: AcDbDatabase) {
  return [...db.tables.blockTable.modelSpace.newIterator()]
}

describe('acapFindSameShape', () => {
  test('finds placed, exploded and copied symbols', () => {
    const { db, space, place } = doorDrawing()
    const original = place(0, 0)
    place(100, 0, Math.PI / 2)
    place(200, 0, 0, -1) // mirrored
    const exploded = place(300, 0, Math.PI)
    acapRunServiceEdit(db, 'Explode', () =>
      acapExplodeBlockReferences(db, [exploded])
    )
    // A loose copy, as if copied after exploding.
    const copy = linesOf([
      [
        [400, 0],
        [400, 10]
      ],
      [
        [400, 0],
        [412, 0]
      ]
    ])
    space.appendEntity([
      ...copy,
      new AcDbArc(new AcGePoint3d(400, 0, 0), 10, 0, Math.PI / 2)
    ])
    // Something else.
    space.appendEntity(
      linesOf([
        [
          [500, 0],
          [500, 10]
        ]
      ])
    )

    const result = acapFindSameShape(
      db,
      space.objectId,
      [original.objectId],
      ALL
    )
    expect(result.patternBlockName).toBe('DOOR')
    expect(result.found).toHaveLength(4)
    expect(result.found.filter(f => f.blockName === 'DOOR')).toHaveLength(2)
    const loose = result.found.filter(f => !f.blockName)
    expect(loose.map(f => f.ids.length)).toEqual([3, 3])
    expect(acapCanMakeSameShapeSymbols(result)).toBe(true)

    const plain = acapFindSameShape(db, space.objectId, [original.objectId], {
      rotate: false,
      mirror: false,
      scale: false
    })
    expect(plain.found).toHaveLength(1)
  })

  test('turns loose copies back into the symbol, in one undo step', () => {
    const { db, space, place } = doorDrawing()
    const original = place(0, 0)
    const turned = place(100, 50, Math.PI / 3)
    const mirrored = place(200, 0, 0.5, -1)
    acapRunServiceEdit(db, 'Explode', () =>
      acapExplodeBlockReferences(db, [turned, mirrored])
    )
    const before = modelEntities(db).length
    const result = acapFindSameShape(
      db,
      space.objectId,
      [original.objectId],
      ALL
    )
    expect(result.found).toHaveLength(2)

    const replaced = acapRunServiceEdit(db, 'ToSymbol', () =>
      acapReplaceSameShapesWithSymbol(result, { newBlockName: 'unused' })
    )!
    expect(replaced.blockName).toBe('DOOR')
    expect(replaced.created).toBe(false)
    expect(replaced.inserts).toHaveLength(2)
    const entities = modelEntities(db)
    expect(entities).toHaveLength(3)
    expect(entities.every(e => e instanceof AcDbBlockReference)).toBe(true)

    // The new symbols are where the exploded ones were.
    const again = acapFindSameShape(db, space.objectId, [original.objectId], {
      rotate: false,
      mirror: false,
      scale: false
    })
    expect(again.found).toHaveLength(0)
    const exact = acapFindSameShape(
      db,
      space.objectId,
      [original.objectId],
      ALL
    )
    expect(exact.found).toHaveLength(2)
    const insert = replaced.inserts.find(i => i.position.x > 150)!
    expect(insert.position.x).toBeCloseTo(200)
    expect(insert.position.y).toBeCloseTo(0)
    expect(insert.scaleFactors.x * insert.scaleFactors.y).toBeLessThan(0)

    expect(db.transactionManager.undo()).toBe(true)
    expect(modelEntities(db)).toHaveLength(before)
  })

  test('makes a new symbol from loose shapes', () => {
    const { db, space } = doorDrawing()
    const pattern = linesOf(HOOK, turn(0, 10, 10))
    const copies = [
      ...linesOf(HOOK, turn(Math.PI / 2, 50, 10)),
      ...linesOf(HOOK, turn(0, 80, 10))
    ]
    space.appendEntity([...pattern, ...copies])
    const result = acapFindSameShape(
      db,
      space.objectId,
      pattern.map(e => e.objectId),
      ALL
    )
    expect(result.found).toHaveLength(2)
    expect(acapSameShapeSymbolName(result)).toBeUndefined()

    const replaced = acapRunServiceEdit(db, 'ToSymbol', () =>
      acapReplaceSameShapesWithSymbol(result, { newBlockName: 'HOOK' })
    )!
    expect(replaced.created).toBe(true)
    expect(replaced.inserts).toHaveLength(3)
    expect(db.tables.blockTable.getAt('HOOK')).toBeDefined()
    // Base point: the bottom left corner of the selection.
    const first = replaced.inserts[0]
    expect(first.position.x).toBeCloseTo(10)
    expect(first.position.y).toBeCloseTo(10)
    const symbols = modelEntities(db).filter(
      e => e instanceof AcDbBlockReference
    )
    const found = acapFindSameShape(db, space.objectId, [symbols[0].objectId], {
      rotate: true,
      mirror: false,
      scale: false
    })
    expect(found.found).toHaveLength(2)
    expect(found.found.every(f => f.blockName === 'HOOK')).toBe(true)
  })

  test('takes property values from the texts an explode left', () => {
    const { db, space, place } = doorDrawing(true)
    const original = place(0, 0, 0, 1, 'D1')
    const other = place(100, 0, Math.PI / 2, 1, 'D2')
    acapRunServiceEdit(db, 'Explode', () =>
      acapExplodeBlockReferences(db, [other])
    )
    expect(
      modelEntities(db).some(
        e => e instanceof AcDbText && e.textString === 'D2'
      )
    ).toBe(true)
    const result = acapFindSameShape(
      db,
      space.objectId,
      [original.objectId],
      ALL
    )
    expect(result.found).toHaveLength(1)
    const replaced = acapRunServiceEdit(db, 'ToSymbol', () =>
      acapReplaceSameShapesWithSymbol(result, { newBlockName: 'x' })
    )!
    expect(replaced.inserts).toHaveLength(1)
    const values = [...replaced.inserts[0].attributeIterator()].map(
      a => a.textString
    )
    expect(values).toEqual(['D2'])
    expect(
      modelEntities(db).some(
        e => e instanceof AcDbText && !(e instanceof AcDbAttribute)
      )
    ).toBe(false)
  })

  test('leaves out what cannot be compared, and other spaces', () => {
    const { db, space, place } = doorDrawing()
    const original = place(0, 0)
    const empty = new AcDbText()
    space.appendEntity(empty)
    const result = acapFindSameShape(
      db,
      space.objectId,
      [original.objectId, empty.objectId, 'missing'],
      ALL
    )
    expect(result.pattern).toEqual([original.objectId])
    expect(result.ignored).toEqual([empty.objectId])
  })
})
