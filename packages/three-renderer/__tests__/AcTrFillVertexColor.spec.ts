import {
  AcCmColor,
  AcGeArea2d,
  AcGePoint2d,
  AcGePolyline2d,
  AcGiSubEntityTraits
} from '@mlightcad/data-model'
import * as THREE from 'three'

import { AcTrBatchedGroup } from '../src/batch/AcTrBatchedGroup'
import {
  buildAreaGeometry,
  setForceGeneralAreaPath
} from '../src/object/AcTrLineGeometryBuilder'
import { AcTrRenderContext } from '../src/renderer/AcTrRenderContext'
import { getMaterialMetadata } from '../src/style/AcTrMaterialMetadata'
import { AcTrStyleManager } from '../src/style/AcTrStyleManager'
import { AcTrSubEntityTraitsUtil } from '../src/util'
import { AcTrMaterialUtil } from '../src/util/AcTrMaterialUtil'

function fillTraits(rgb: number, layer = 'Shades'): AcGiSubEntityTraits {
  const traits = AcTrSubEntityTraitsUtil.createDefaultTraits()
  traits.layer = layer
  traits.color = new AcCmColor().setRGBValue(rgb)
  return traits
}

function quad(): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(
      new Float32Array([0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0]),
      3
    )
  )
  geometry.setIndex([0, 1, 2, 0, 2, 3])
  return geometry
}

/** A square of side 1 at `x`, as a SOLID entity hands it to the renderer. */
function square(x: number): AcGeArea2d {
  const area = new AcGeArea2d()
  area.add(
    new AcGePolyline2d(
      [
        new AcGePoint2d(x, 0),
        new AcGePoint2d(x + 1, 0),
        new AcGePoint2d(x + 1, 1),
        new AcGePoint2d(x, 1)
      ],
      true
    )
  )
  return area
}

/** The colour written on vertex `index`, as 0..1 components. */
function vertexColor(geometry: THREE.BufferGeometry, index = 0) {
  const color = geometry.getAttribute('color')
  return [color.getX(index), color.getY(index), color.getZ(index)]
}

/** What a material of this colour hands to the shader. */
function materialColor(rgb: number) {
  const color = new THREE.Color(rgb)
  return [color.r, color.g, color.b]
}

describe('fills coloured through the geometry', () => {
  it('shares one material between fills of different fixed colours', () => {
    const styles = new AcTrStyleManager()
    const red = quad()
    const blue = quad()

    const redMaterial = styles.getFillMaterial(
      fillTraits(0xff0000),
      undefined,
      undefined,
      red
    ) as THREE.MeshBasicMaterial
    const blueMaterial = styles.getFillMaterial(
      fillTraits(0x0000ff),
      undefined,
      undefined,
      blue
    )

    expect(blueMaterial).toBe(redMaterial)
    expect(getMaterialMetadata(redMaterial).vertexColors).toBe(true)
    expect(redMaterial.vertexColors).toBe(true)
    // White, so the shader's product is the vertex colour alone.
    expect(redMaterial.color.getHex()).toBe(0xffffff)
    expect(vertexColor(red)).toEqual([1, 0, 0])
    expect(vertexColor(blue)).toEqual([0, 0, 1])
    expect(red.getAttribute('color').count).toBe(4)
  })

  it('writes the same values a material colour would give the shader', () => {
    const styles = new AcTrStyleManager()
    const geometry = quad()
    styles.getFillMaterial(fillTraits(0x336699), undefined, undefined, geometry)
    const expected = materialColor(0x336699)
    for (const vertex of [0, 3]) {
      vertexColor(geometry, vertex).forEach((value, at) =>
        expect(value).toBeCloseTo(expected[at], 6)
      )
    }
  })

  it('keeps a material per colour when no geometry is given', () => {
    const styles = new AcTrStyleManager()
    const red = styles.getFillMaterial(
      fillTraits(0xff0000)
    ) as THREE.MeshBasicMaterial
    const blue = styles.getFillMaterial(fillTraits(0x0000ff))

    expect(blue).not.toBe(red)
    expect(red.vertexColors).toBe(false)
    expect(red.color.getHex()).toBe(0xff0000)
    // And it is not the material of fills that do carry their colour.
    const painted = quad()
    expect(
      styles.getFillMaterial(
        fillTraits(0xff0000),
        undefined,
        undefined,
        painted
      )
    ).not.toBe(red)
  })

  it('separates layers, draw-order tiers and transparency', () => {
    const styles = new AcTrStyleManager()
    const get = (traits: AcGiSubEntityTraits) =>
      styles.getFillMaterial(traits, undefined, undefined, quad())

    const base = get(fillTraits(0x112233))
    expect(get(fillTraits(0x445566, 'Other'))).not.toBe(base)

    const hatch = fillTraits(0x445566)
    hatch.drawOrder = -1
    expect(get(hatch)).not.toBe(base)
    expect(getMaterialMetadata(get(hatch)).drawOrder).toBe(-1)
  })

  it('leaves colours that can change later on the material', () => {
    const styles = new AcTrStyleManager()
    const cases: Array<[string, (traits: AcGiSubEntityTraits) => void]> = [
      ['ByLayer', traits => traits.color.setByLayer()],
      ['ByBlock', traits => traits.color.setByBlock()],
      ['ACI 7', traits => (traits.color = new AcCmColor().setForeground())],
      ['wipeout', traits => (traits.isBackgroundFill = true)],
      [
        'pattern',
        traits =>
          (traits.fillType = {
            ...traits.fillType,
            solidFill: false,
            patternAngle: 0,
            definitionLines: [
              {
                angle: 0,
                base: { x: 0, y: 0 },
                offset: { x: 0, y: 1 },
                dashLengths: []
              }
            ]
          })
      ]
    ]
    for (const [name, change] of cases) {
      const traits = fillTraits(0x00ff00)
      change(traits)
      const geometry = quad()
      const material = styles.getFillMaterial(
        traits,
        undefined,
        undefined,
        geometry
      )
      expect([name, getMaterialMetadata(material).vertexColors]).toEqual([
        name,
        false
      ])
      // No attribute either: it would be the layout of the batch it starts.
      expect([name, geometry.hasAttribute('color')]).toEqual([name, false])
    }
  })

  it('stays vertex coloured when mirrored or moved to another layer', () => {
    const styles = new AcTrStyleManager()
    const material = styles.getFillMaterial(
      fillTraits(0xff8800, '0'),
      undefined,
      undefined,
      quad()
    )

    const mirrored = styles.getBackSideVariant(
      material
    ) as THREE.MeshBasicMaterial
    expect(mirrored).not.toBe(material)
    expect(mirrored.side).toBe(THREE.BackSide)
    expect(mirrored.vertexColors).toBe(true)
    expect(getMaterialMetadata(mirrored).vertexColors).toBe(true)

    // Block content on layer 0 takes the layer of the INSERT.
    const layerColor = new AcCmColor().setRGBValue(0x00ffff)
    const onRoad = styles.getLayerBoundMaterial(material, 'ROAD', {
      layer: 'ROAD',
      color: layerColor
    }) as THREE.MeshBasicMaterial
    expect(onRoad).not.toBe(material)
    expect(getMaterialMetadata(onRoad).layer).toBe('ROAD')
    expect(onRoad.vertexColors).toBe(true)
    // The entity's own colour is kept; the layer's is not painted over it.
    expect(onRoad.color.getHex()).toBe(0xffffff)

    // Editing the layer afterwards leaves the fill alone as well.
    const updates = styles.updateLayerMaterial('ROAD', {
      layer: 'ROAD',
      color: new AcCmColor().setRGBValue(0xff00ff)
    })
    const updated = (updates[onRoad.id] ?? onRoad) as THREE.MeshBasicMaterial
    expect(updated.vertexColors).toBe(true)
    expect(updated.color.getHex()).toBe(0xffffff)
  })

  it('is one colour again once the material is painted for a highlight', () => {
    const styles = new AcTrStyleManager()
    const material = styles.getFillMaterial(
      fillTraits(0x123456),
      undefined,
      undefined,
      quad()
    ) as THREE.MeshBasicMaterial

    const highlight = AcTrMaterialUtil.cloneMaterial(
      material
    ) as THREE.MeshBasicMaterial
    AcTrMaterialUtil.setMaterialColor(highlight, new THREE.Color(0x08e8de))

    expect(highlight.vertexColors).toBe(false)
    expect(highlight.color.getHex()).toBe(0x08e8de)
    // The shared material is untouched.
    expect(material.vertexColors).toBe(true)
    expect(material.color.getHex()).toBe(0xffffff)
  })
})

describe('a drawing shaded with many colours', () => {
  afterEach(() => setForceGeneralAreaPath(false))

  const COLORS = 300

  /** Draws `COLORS` squares, each in a colour of its own, into one group. */
  function drawShades(context: AcTrRenderContext) {
    const group = new AcTrBatchedGroup()
    const materials = new Set<THREE.Material>()
    for (let index = 0; index < COLORS; index++) {
      const rgb = ((index * 7919) % 0xffffff) + 1
      const built = buildAreaGeometry(
        square(index * 2),
        fillTraits(rgb),
        context
      )
      if (!built) throw new Error('no geometry for a solid fill')
      materials.add(built.material)
      expect(
        group.appendMeshGeometry(
          built.geometry as THREE.BufferGeometry,
          built.material,
          built.worldOffset,
          { objectId: `solid-${index}`, visible: true }
        )
      ).toBe(true)
      built.geometry.dispose()
    }
    return { group, materials }
  }

  function meshBatches(group: AcTrBatchedGroup) {
    const { indexed, nonIndexed } = group.stats.mesh
    return indexed.count + nonIndexed.count
  }

  it('draws them all in one batch', () => {
    const { group, materials } = drawShades(new AcTrRenderContext())
    expect(materials.size).toBe(1)
    expect(group.entityCount).toBe(COLORS)
    expect(meshBatches(group)).toBe(1)
  })

  it('keeps every colour in the batch', () => {
    const { group } = drawShades(new AcTrRenderContext())
    const batches: THREE.Mesh[] = []
    group.traverse(object => {
      if (object instanceof THREE.Mesh && object.geometry.hasAttribute('color'))
        batches.push(object)
    })
    expect(batches).toHaveLength(1)

    const color = batches[0].geometry.getAttribute('color')
    const seen = new Set<string>()
    for (let vertex = 0; vertex < COLORS * 4; vertex++) {
      seen.add(
        [color.getX(vertex), color.getY(vertex), color.getZ(vertex)]
          .map(value => value.toFixed(5))
          .join(',')
      )
    }
    expect(seen.size).toBe(COLORS)
    // The batch draws with a material of its own, still vertex coloured.
    expect((batches[0].material as THREE.MeshBasicMaterial).vertexColors).toBe(
      true
    )
  })

  it('does the same through the general (earcut) path', () => {
    setForceGeneralAreaPath(true)
    const { group, materials } = drawShades(new AcTrRenderContext())
    expect(materials.size).toBe(1)
    expect(meshBatches(group)).toBe(1)
  })
})
