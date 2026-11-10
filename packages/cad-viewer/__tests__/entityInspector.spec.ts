import type {
  AcDbEntityProperties,
  AcDbEntityRuntimeProperty
} from '@mlightcad/data-model'

import {
  ADVANCED_GROUP,
  boxFields,
  boxFieldTransform,
  buildInspectorGroups,
  buildSymbolPropertyRows,
  collectSymbolContentLayers,
  formatInspectorNumber,
  inspectorValueKey,
  type MlInspectorSymbol,
  type MlLayeredEntity,
  numberKind,
  PLACEMENT_GROUP,
  summarizeSelection,
  SYMBOL_GROUP,
  toStoredValue
} from '../src/composable/entityInspector'

function prop(
  name: string,
  value: unknown,
  type: AcDbEntityRuntimeProperty['type'] = 'float',
  editable = true
): AcDbEntityRuntimeProperty {
  let current = value
  return {
    name,
    type,
    editable,
    accessor: {
      get: () => current,
      set: editable
        ? (v: unknown) => {
            current = v
          }
        : undefined
    }
  }
}

class FakeColor {
  constructor(private readonly name: string) {}
  toString() {
    return this.name
  }
}

function line(layer: string, color: string, length: number) {
  return {
    type: 'Line',
    groups: [
      {
        groupName: 'general',
        properties: [
          prop('handle', '1A', 'int', false),
          prop('color', new FakeColor(color), 'color'),
          prop('layer', layer, 'string')
        ]
      },
      {
        groupName: 'geometry',
        properties: [prop('startX', 0), prop('length', length, 'float', false)]
      }
    ]
  } as AcDbEntityProperties
}

function circle(layer: string) {
  return {
    type: 'Circle',
    groups: [
      {
        groupName: 'general',
        properties: [
          prop('handle', '2B', 'int', false),
          prop('color', new FakeColor('ByLayer'), 'color'),
          prop('layer', layer, 'string')
        ]
      },
      {
        groupName: 'geometry',
        properties: [prop('radius', 5), prop('perimeter', 10 * Math.PI)]
      }
    ]
  } as AcDbEntityProperties
}

function symbol(rotation: number, x: number) {
  return {
    type: 'BlockReference',
    groups: [
      {
        groupName: 'general',
        properties: [prop('layer', '0', 'string')]
      },
      {
        groupName: 'geometry',
        properties: [
          prop('blockName', 'DOOR', 'float', false),
          prop('positionX', x),
          prop('positionY', 0),
          prop('positionZ', 0),
          prop('rotation', rotation),
          prop('scaleFactorsX', 1),
          prop('scaleFactorsY', 1),
          prop('normalZ', 1)
        ]
      },
      {
        groupName: 'attribute',
        properties: [prop('WIDTH', '800', 'string')]
      }
    ]
  } as AcDbEntityProperties
}

describe('inspectorValueKey', () => {
  it('compares objects by their string form', () => {
    expect(inspectorValueKey(new FakeColor('Red'))).toBe(
      inspectorValueKey(new FakeColor('Red'))
    )
    expect(inspectorValueKey(0.1 + 0.2)).toBe(inspectorValueKey(0.3))
  })
})

describe('buildInspectorGroups', () => {
  it('shows every property of a single entity', () => {
    const groups = buildInspectorGroups([line('A', 'Red', 10)])
    expect(groups.map(g => g.groupName)).toEqual(['general', 'geometry'])
    const layer = groups[0].rows.find(r => r.name === 'layer')!
    expect(layer).toMatchObject({ mixed: false, value: 'A', editable: true })
    expect(layer.property).toBeDefined()
    expect(groups[0].rows.find(r => r.name === 'handle')!.editable).toBe(false)
  })

  it('reports differing values as mixed', () => {
    const groups = buildInspectorGroups([
      line('A', 'Red', 10),
      line('B', 'Red', 20)
    ])
    const general = groups.find(g => g.groupName === 'general')!
    expect(general.rows.find(r => r.name === 'layer')).toMatchObject({
      mixed: true,
      value: undefined
    })
    // Colors are objects: equal colors must not be reported as mixed.
    expect(general.rows.find(r => r.name === 'color')!.mixed).toBe(false)
    expect(
      groups
        .find(g => g.groupName === 'geometry')!
        .rows.find(r => r.name === 'startX')!.mixed
    ).toBe(false)
  })

  it('only keeps the shared rows for different types', () => {
    const groups = buildInspectorGroups([line('A', 'Red', 10), circle('A')])
    expect(groups.map(g => g.groupName)).toEqual(['general'])
    // Handles always differ, so they are only shown for one entity.
    expect(groups[0].rows.map(r => r.name)).toEqual(['color', 'layer'])
  })

  it('lays out symbols as general / placement / symbol / advanced', () => {
    const groups = buildInspectorGroups([symbol(Math.PI / 2, 1)])
    expect(groups.map(g => g.groupName)).toEqual([
      'general',
      PLACEMENT_GROUP,
      SYMBOL_GROUP,
      ADVANCED_GROUP
    ])
    const placement = groups[1].rows
    expect(placement.map(r => r.name)).toEqual([
      'positionX',
      'positionY',
      'rotation',
      'scaleFactorsX',
      'scaleFactorsY'
    ])
    const rotation = placement.find(r => r.name === 'rotation')!
    expect(rotation.unit).toBe('degree')
    expect(rotation.value).toBeCloseTo(90)
    expect(toStoredValue(rotation, 180)).toBeCloseTo(Math.PI)
    expect(groups[3].rows.map(r => r.name)).toEqual(['positionZ', 'normalZ'])
    // Attributes are handled by the symbol properties section.
    expect(groups.some(g => g.groupName === 'attribute')).toBe(false)
  })
})

describe('buildSymbolPropertyRows', () => {
  const make = (
    attrs: [string, string, boolean?, boolean?][],
    prompts: Record<string, string> = {}
  ): MlInspectorSymbol => ({
    blockName: 'DOOR',
    attributes: attrs.map(([tag, textString, isConst, isInvisible]) => ({
      tag,
      textString,
      isConst: !!isConst,
      isInvisible: !!isInvisible
    })),
    promptOf: tag => prompts[tag] ?? ''
  })

  it('labels fields with the prompt, falling back to the tag', () => {
    const rows = buildSymbolPropertyRows([
      make(
        [
          ['MARK', 'D1'],
          ['WIDTH', '800'],
          ['MAKER', 'ACME', false, true],
          ['KIND', 'door', true]
        ],
        { WIDTH: '幅' }
      )
    ])
    expect(rows.map(r => r.label)).toEqual(['MARK', '幅', 'MAKER', 'KIND'])
    expect(rows[2].isInvisible).toBe(true)
    expect(rows[3].isConst).toBe(true)
    expect(rows[0]).toMatchObject({ value: 'D1', mixed: false, tagKey: 'MARK' })
  })

  it('shows only shared tags and marks differing values as mixed', () => {
    const rows = buildSymbolPropertyRows([
      make([
        ['MARK', 'D1'],
        ['WIDTH', '800']
      ]),
      make([
        ['mark', 'D2'],
        ['WIDTH', '800'],
        ['EXTRA', 'x']
      ])
    ])
    expect(rows.map(r => r.tagKey)).toEqual(['MARK', 'WIDTH'])
    expect(rows[0]).toMatchObject({ mixed: true, value: undefined })
    expect(rows[1]).toMatchObject({ mixed: false, value: '800' })
  })
})

describe('summarizeSelection', () => {
  it('counts types and sums lengths and closed areas', () => {
    const summary = summarizeSelection([
      { type: 'Line', properties: line('A', 'Red', 10) },
      { type: 'Line', properties: line('A', 'Red', 5) },
      {
        type: 'Circle',
        properties: circle('A'),
        closed: true,
        area: 25 * Math.PI
      },
      {
        type: 'Polyline',
        properties: { type: 'Polyline', groups: [] },
        closed: false,
        area: 99
      }
    ])
    expect(summary.types).toEqual([
      { type: 'Line', count: 2 },
      { type: 'Circle', count: 1 },
      { type: 'Polyline', count: 1 }
    ])
    expect(summary.totalLength).toBeCloseTo(15 + 10 * Math.PI)
    expect(summary.lengthCount).toBe(3)
    // The open polyline's area is not counted.
    expect(summary.totalArea).toBeCloseTo(25 * Math.PI)
    expect(summary.areaCount).toBe(1)
  })
})

describe('selection box', () => {
  const box = { minX: 10, minY: 20, maxX: 30, maxY: 60 }

  it('reports X / Y at the reference point', () => {
    expect(boxFields(box, { x: 0, y: 0 })).toEqual({
      x: 10,
      y: 20,
      width: 20,
      height: 40
    })
    expect(boxFields(box, { x: 0.5, y: 1 })).toMatchObject({ x: 20, y: 60 })
  })

  it('moves the selection when X or Y changes', () => {
    expect(boxFieldTransform(box, { x: 1, y: 0 }, 'x', 50)).toEqual({
      kind: 'translate',
      dx: 20,
      dy: 0
    })
    expect(boxFieldTransform(box, { x: 0, y: 0 }, 'y', 20)).toBeUndefined()
  })

  it('scales uniformly around the reference point', () => {
    expect(boxFieldTransform(box, { x: 0.5, y: 0.5 }, 'width', 40)).toEqual({
      kind: 'scale',
      factor: 2,
      baseX: 20,
      baseY: 40
    })
    expect(boxFieldTransform(box, { x: 0, y: 0 }, 'height', 10)).toMatchObject({
      factor: 0.25,
      baseX: 10,
      baseY: 20
    })
    // Zero or negative sizes are rejected; so is a flat box.
    expect(boxFieldTransform(box, { x: 0, y: 0 }, 'width', 0)).toBeUndefined()
    expect(
      boxFieldTransform(
        { minX: 0, minY: 0, maxX: 0, maxY: 10 },
        { x: 0, y: 0 },
        'width',
        5
      )
    ).toBeUndefined()
  })
})

describe('number precision', () => {
  it('rounds lengths, angles and unitless values differently', () => {
    expect(numberKind({ name: 'positionX' })).toBe('length')
    expect(numberKind({ name: 'radius' })).toBe('length')
    expect(numberKind({ name: 'rotation', unit: 'degree' })).toBe('angle')
    expect(numberKind({ name: 'totalAngle' })).toBe('angle')
    expect(numberKind({ name: 'scaleFactorsX' })).toBe('plain')
    expect(numberKind({ name: 'linetypeScale' })).toBe('plain')
    expect(numberKind({ name: 'widthFactor' })).toBe('plain')
    expect(numberKind({ name: 'normalZ' })).toBe('plain')
  })

  it('formats with at most the given decimals and no trailing zeros', () => {
    expect(formatInspectorNumber(-144.456973377328, 4)).toBe('-144.457')
    expect(formatInspectorNumber(-144.456973377328, 2)).toBe('-144.46')
    expect(formatInspectorNumber(12.5, 0)).toBe('13')
    expect(formatInspectorNumber(100, 4)).toBe('100')
    expect(formatInspectorNumber(-0.00001, 2)).toBe('0')
    expect(formatInspectorNumber(1 / 3)).toBe('0.333333')
  })
})

describe('collectSymbolContentLayers', () => {
  const entity = (type: string, layer: string): MlLayeredEntity => ({
    type,
    layer
  })
  const block = (id: string, entities: MlLayeredEntity[]) => ({
    objectId: id,
    newIterator: () => entities
  })
  const insert = (
    layer: string,
    def: ReturnType<typeof block>,
    attributes: MlLayeredEntity[] = []
  ): MlLayeredEntity => ({
    type: 'BlockReference',
    layer,
    blockTableRecord: def,
    attributeIterator: () => attributes
  })

  it('lists the layers of the contents, not the symbol layer', () => {
    const def = block('B1', [
      entity('Line', '壁'),
      entity('Arc', '建具'),
      entity('Line', '壁')
    ])
    expect(collectSymbolContentLayers([insert('記号', def)])).toEqual([
      '壁',
      '建具'
    ])
  })

  it('gives contents on layer 0 the layer of the symbol', () => {
    const def = block('B1', [entity('Line', '0'), entity('Line', '壁')])
    expect(collectSymbolContentLayers([insert('記号', def)])).toEqual([
      '記号',
      '壁'
    ])
  })

  it('follows nested symbols and attributes, skips attribute definitions', () => {
    const inner = block('B2', [entity('Line', '0'), entity('Circle', '設備')])
    const outer = block('B1', [
      entity('AttDef', '文字'),
      insert('建具', inner),
      insert('0', inner)
    ])
    expect(
      collectSymbolContentLayers([
        insert('記号', outer, [entity('Attrib', '文字')])
      ])
    ).toEqual(['文字', '建具', '設備', '記号'])
  })

  it('merges several symbols and stops on cyclic definitions', () => {
    const cyclic: ReturnType<typeof block> = block('B1', [])
    const items = [entity('Line', '壁')]
    cyclic.newIterator = () => [...items, insert('0', cyclic)]
    const other = block('B3', [entity('Line', '寸法')])
    expect(
      collectSymbolContentLayers([insert('A', cyclic), insert('B', other)])
    ).toEqual(['壁', '寸法'])
  })
})
