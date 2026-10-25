import {
  collectExportDrawing,
  type ExportDrawing,
  resolveExportImages
} from '@mlightcad/cad-export-model'
import {
  AcDbArc,
  AcDbCircle,
  AcDbDatabase,
  AcDbDatabaseConverterManager,
  AcDbEllipse,
  AcDbEntity,
  acdbHostApplicationServices,
  AcDbLine,
  AcDbRasterImage,
  AcDbText
} from '@mlightcad/data-model'
import * as ezjww from 'ezjww'
import { readFileSync } from 'fs'
import { resolve } from 'path'

import { AcDbJwwConverter } from '../src/AcDbJwwConverter'
import {
  buildJwwDocument,
  jwwPenStyle,
  triangulate,
  writeJwwBytes
} from '../src/jwwExport'

const SAMPLE = resolve(
  __dirname,
  '../../../resources/cad-data/samples/jww-sample.jww'
)

function toArrayBuffer(bytes: Uint8Array) {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer
}

async function open(bytes: Uint8Array) {
  const db = new AcDbDatabase()
  acdbHostApplicationServices().workingDatabase = db
  await db.read(toArrayBuffer(bytes), { fileName: 'drawing.jww' }, 'jww')
  return db
}

function entitiesOf(db: AcDbDatabase) {
  return [...db.tables.blockTable.modelSpace.newIterator()] as AcDbEntity[]
}

/** Jest reads the CJS data-model without the $LIMMIN patch: set the A3 sheet of the sample. */
function withSampleLimits(db: AcDbDatabase) {
  Object.assign(db, {
    limmin: { x: -21000, y: -14850 },
    limmax: { x: 21000, y: 14850 }
  })
  return db
}

beforeAll(() => {
  ezjww.initSync(readFileSync(require.resolve('ezjww/wasm/ezjww_wasm_bg.wasm')))
  AcDbDatabaseConverterManager.instance.register(
    'jww',
    new AcDbJwwConverter({ useWorker: false })
  )
})

afterAll(() => {
  AcDbDatabaseConverterManager.instance.unregister('jww')
})

describe('JWW export', () => {
  let original: AcDbDatabase
  let drawing: ExportDrawing
  let reopened: AcDbDatabase

  beforeAll(async () => {
    original = withSampleLimits(
      await open(new Uint8Array(readFileSync(SAMPLE)))
    )
    drawing = collectExportDrawing(original)
    await resolveExportImages(drawing)
    const { bytes } = writeJwwBytes(ezjww, drawing)
    expect(ezjww.detectFileFormat(bytes)).toBe('jww')
    reopened = await open(bytes)
  })

  it('keeps the sheet and scale of a drawing read from JWW', () => {
    expect(drawing.sheet).toMatchObject({
      paper: 'A3',
      scale: 100,
      origin: [-21000, -14850]
    })
    const header = ezjww.readDocument(
      writeJwwBytes(ezjww, drawing).bytes
    ).header
    expect(header.paper_size).toBe(3)
    expect(header.layer_groups[0].scale).toBe(100)
  })

  it('puts layers back into their group and layer', () => {
    const header = ezjww.readDocument(
      writeJwwBytes(ezjww, drawing).bytes
    ).header
    expect(header.layer_groups[0].name).toBe('平面図')
    expect(header.layer_groups[0].layers[1].name).toBe('壁')
    expect(header.layer_groups[1].name).toBe('図枠')
    const names = [...reopened.tables.layerTable.newIterator()].map(l => l.name)
    expect(names).toEqual(
      expect.arrayContaining([
        '0-0 平面図 - 通り芯',
        '0-1 平面図 - 壁',
        '1-0 図枠 - 枠'
      ])
    )
  })

  it('reproduces lines, curves and text in real millimetres', () => {
    const before = entitiesOf(original)
    const after = entitiesOf(reopened)
    const count = (
      list: AcDbEntity[],
      type: new (...args: never[]) => AcDbEntity
    ) => list.filter(e => e instanceof type).length
    expect(count(after, AcDbArc)).toBe(count(before, AcDbArc))
    expect(count(after, AcDbEllipse)).toBe(count(before, AcDbEllipse))
    // The block (north arrow) and the dimension are exploded.
    expect(count(after, AcDbCircle)).toBe(count(before, AcDbCircle) + 1)
    expect(count(after, AcDbLine)).toBeGreaterThan(count(before, AcDbLine))
    const walls = after.filter(
      (e): e is AcDbLine =>
        e instanceof AcDbLine && e.layer === '0-1 平面図 - 壁'
    )
    expect(
      Math.max(...walls.map(w => w.startPoint.distanceTo(w.endPoint)))
    ).toBeCloseTo(10000, 4)
    const texts = (list: AcDbEntity[]) =>
      list
        .filter((e): e is AcDbText => e instanceof AcDbText)
        .map(t => ({
          text: t.textString,
          x: t.position.x,
          y: t.position.y,
          h: t.height,
          r: t.rotation
        }))
        .sort((a, b) => a.text.localeCompare(b.text))
    const a = texts(before)
    // "N" is the text of the exploded north arrow block.
    const b = texts(after).filter(t => t.text !== 'N')
    expect(b.map(t => t.text)).toEqual(a.map(t => t.text))
    b.forEach((t, i) => {
      expect(t.x).toBeCloseTo(a[i].x, 3)
      expect(t.y).toBeCloseTo(a[i].y, 3)
      expect(t.h).toBeCloseTo(a[i].h, 4)
      expect(t.r).toBeCloseTo(a[i].r, 6)
    })
  })

  it('embeds raster images', async () => {
    const images = (db: AcDbDatabase) =>
      entitiesOf(db).filter((e): e is AcDbRasterImage => e instanceof AcDbRasterImage)
    const [before] = images(original)
    const [after] = images(reopened)
    expect(images(reopened)).toHaveLength(1)
    expect(after.position.x).toBeCloseTo(before.position.x, 3)
    expect(after.position.y).toBeCloseTo(before.position.y, 3)
    expect(after.width).toBeCloseTo(before.width, 3)
    expect(after.height).toBeCloseTo(before.height, 3)
    expect(after.image).toBeDefined()
    const bytes = async (image: AcDbRasterImage) => new Uint8Array(await image.image!.arrayBuffer())
    expect(await bytes(after)).toEqual(await bytes(before))
  })

  it('keeps pen colours and line types', () => {
    const grid = entitiesOf(reopened).find(
      (e): e is AcDbLine =>
        e instanceof AcDbLine && e.layer === '0-0 平面図 - 通り芯'
    )!
    expect(grid.lineType).toBe('JWW_DASHDOT1')
    const doc = ezjww.readDocument(writeJwwBytes(ezjww, drawing).bytes)
    const original = ezjww.readDocument(new Uint8Array(readFileSync(SAMPLE)))
    // Layers whose lines were lines before (not exploded blocks / dimensions).
    const pens = (d: typeof doc) =>
      [
        ...new Set(
          d.entities
            .filter(
              e =>
                e.type === 'LINE' &&
                !(e.base.layer_group === 0 && e.base.layer >= 3)
            )
            .map(
              e => `${e.base.layer_group}-${e.base.layer}:${e.base.pen_color}`
            )
        )
      ].sort()
    expect(pens(doc)).toEqual(pens(original))
  })
})

describe('jwwPenStyle', () => {
  const style = (lineType: string, lineTypePattern: number[]) => ({
    layer: '0',
    color: [0, 0, 0] as [number, number, number],
    foreground: true,
    lineType,
    lineTypePattern,
    lineWeight: 0
  })
  it('maps patterns by shape', () => {
    expect(jwwPenStyle(style('CONTINUOUS', []), 1)).toBe(1)
    expect(jwwPenStyle(style('DASHED', [12.7, -6.35]), 1)).toBe(4)
    expect(jwwPenStyle(style('HIDDEN', [4, -4]), 1)).toBe(3)
    expect(jwwPenStyle(style('DOT', [0, -6.35]), 1)).toBe(2)
    expect(jwwPenStyle(style('CENTER', [31.75, -6.35, 6.35, -6.35]), 1)).toBe(5)
    expect(
      jwwPenStyle(style('PHANTOM', [31.75, -6.35, 6.35, -6.35, 6.35, -6.35]), 1)
    ).toBe(7)
    expect(jwwPenStyle(style('JWW_DIVIDE2', [1]), 1)).toBe(8)
  })
})

describe('triangulate', () => {
  const area = (tris: [number, number][][]) =>
    tris.reduce(
      (s, [a, b, c]) =>
        s +
        Math.abs(
          (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
        ) /
          2,
      0
    )
  it('covers concave polygons with holes', () => {
    const outer: [number, number][] = [
      [0, 0],
      [10, 0],
      [10, 10],
      [5, 5],
      [0, 10]
    ]
    expect(area(triangulate([outer]))).toBeCloseTo(75, 9)
    const square: [number, number][] = [
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10]
    ]
    const hole: [number, number][] = [
      [2, 2],
      [4, 2],
      [4, 4],
      [2, 4]
    ]
    expect(area(triangulate([square, hole]))).toBeCloseTo(96, 9)
  })
})

describe('buildJwwDocument', () => {
  it('fills layer slots in order for other layer names and writes exact fill colours', () => {
    const style = (layer: string) => ({
      layer,
      color: [255, 0, 0] as [number, number, number],
      foreground: false,
      lineType: 'CONTINUOUS',
      lineTypePattern: [],
      lineWeight: 0
    })
    const { document } = buildJwwDocument(ezjww.newJwwDocument(), {
      title: '',
      layers: [
        {
          name: 'A',
          color: [0, 0, 0],
          foreground: true,
          hidden: false,
          locked: false
        },
        {
          name: 'B',
          color: [0, 0, 0],
          foreground: true,
          hidden: true,
          locked: false
        }
      ],
      entities: [
        {
          kind: 'polyline',
          style: style('A'),
          points: [
            [0, 0],
            [1000, 0],
            [1000, 1000]
          ],
          closed: true
        },
        {
          kind: 'fill',
          style: style('B'),
          loops: [
            [
              [0, 0],
              [100, 0],
              [100, 100],
              [0, 100]
            ]
          ]
        }
      ],
      sheet: {
        paper: 'A4',
        portrait: false,
        width: 297,
        height: 210,
        scale: 50,
        origin: [0, 0]
      },
      warnings: []
    })
    expect(document.options.paper_size).toBe(4)
    expect(document.options.layer_groups[0].layers[0].name).toBe('A')
    expect(document.options.layer_groups[0].layers[1]).toMatchObject({
      name: 'B',
      state: 0
    })
    expect(document.entities.filter(e => e.type === 'LINE')).toHaveLength(3)
    const solids = document.entities.filter(e => e.type === 'SOLID')
    expect(solids).toHaveLength(2)
    expect(solids[0]).toMatchObject({
      color: 0x0000ff,
      base: { pen_color: 10, layer: 1 }
    })
    // Paper millimetres from the sheet centre (148.5, 105) at 1:50.
    expect(document.entities[0]).toMatchObject({
      start_x: -148.5,
      start_y: -105,
      end_x: -128.5
    })
    expect(ezjww.toJwwBytes(document).length).toBeGreaterThan(0)
  })
})
