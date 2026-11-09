import {
  AcGiMTextAttachmentPoint,
  AcGiMTextFlowDirection
} from '@mlightcad/data-model'
import type {
  MTextData,
  MTextObject,
  TextStyle
} from '@mlightcad/mtext-renderer'
import * as THREE from 'three'

import {
  AcTrVerticalTextLayout,
  acTrVerticalTextMode
} from '../src/util/AcTrVerticalText'

const HEIGHT = 10
/** Em of the fake font: like NS Gothic, "A" is 770 / 1000 em. */
const EM = (HEIGHT * 1000) / 770
/** Baseline to em-box centre (NS-Font descender 141 / 1000). */
const CENTER = (0.5 - 141 / 1000) * EM

function style(font: string, standardFlag = 0): TextStyle {
  return {
    name: 'S',
    standardFlag,
    fixedTextHeight: 0,
    widthFactor: 1,
    obliqueAngle: 0,
    textGenerationFlag: 0,
    lastHeight: 0,
    font,
    bigFont: ''
  } as TextStyle
}

function text(contents: string, overrides: Record<string, unknown> = {}) {
  return {
    text: contents,
    height: HEIGHT,
    width: Infinity,
    position: { x: 100, y: 200, z: 0 },
    rotation: (3 * Math.PI) / 2,
    drawingDirection: AcGiMTextFlowDirection.BOTTOM_TO_TOP,
    attachmentPoint: AcGiMTextAttachmentPoint.BaselineLeft,
    ...overrides
  } as unknown as MTextData
}

/**
 * Stand-in for the mtext-renderer: a box as wide as the advance (1 em for
 * full-width characters, half an em otherwise), anchored like the real one.
 */
function fakeRender(piece: { data: MTextData }): MTextObject {
  const chars = [...piece.data.text]
  const advance =
    chars.reduce((sum, ch) => sum + (/[\x20-\x7e]/.test(ch) ? 0.5 : 1), 0) *
    EM *
    (piece.data.widthFactor ?? 1)
  const centered =
    (piece.data.attachmentPoint as number) ===
    AcGiMTextAttachmentPoint.BaselineCenter
  const minX = centered ? -advance / 2 : 0
  const object = new THREE.Object3D() as MTextObject
  object.box = new THREE.Box3(
    new THREE.Vector3(minX, (-141 / 1000) * EM, 0),
    new THREE.Vector3(minX + advance, (1 - 141 / 1000) * EM, 0)
  )
  object.createLayoutData = () => ({ lines: [], chars: [] })
  return object
}

function place(layout: AcTrVerticalTextLayout) {
  const rendered = layout.pieces.map(fakeRender)
  const root = layout.compose(rendered)
  root.updateMatrixWorld(true)
  return rendered.map((object, i) => ({
    text: layout.pieces[i].data.text,
    origin: new THREE.Vector3().setFromMatrixPosition(object.matrixWorld),
    angle: new THREE.Euler().setFromRotationMatrix(object.matrixWorld).z,
    box: root.box
  }))
}

describe('acTrVerticalTextMode', () => {
  it('detects @ fonts and vertical TEXT styles', () => {
    expect(acTrVerticalTextMode(text('a'), style('@ＭＳ ゴシック'))).toBe(
      'atFont'
    )
    expect(
      acTrVerticalTextMode(text('a'), {
        ...style('msgothic'),
        extendedFont: '@ＭＳ 明朝'
      })
    ).toBe('atFont')
    expect(acTrVerticalTextMode(text('a'), style('ＭＳ ゴシック', 4))).toBe(
      'style'
    )
    expect(acTrVerticalTextMode(text('a'), style('ＭＳ ゴシック'))).toBe(
      undefined
    )
  })

  it('ignores the vertical style flag for MTEXT, like AutoCAD', () => {
    const mtext = text('a', {
      drawingDirection: AcGiMTextFlowDirection.LEFT_TO_RIGHT
    })
    expect(acTrVerticalTextMode(mtext, style('ＭＳ ゴシック', 4))).toBe(
      undefined
    )
    expect(acTrVerticalTextMode(mtext, style('@ＭＳ ゴシック'))).toBe('atFont')
  })
})

describe('AcTrVerticalTextLayout', () => {
  it('renders without the @ and the vertical flag', () => {
    const layout = new AcTrVerticalTextLayout(
      'atFont',
      text('縦'),
      style('@ＭＳ ゴシック', 4)
    )
    expect(layout.pieces[0].style.font).toBe('ＭＳ ゴシック')
    expect(layout.pieces[0].style.standardFlag & 4).toBe(0)
  })

  it('stacks full-width characters of an @ font upright down the line', () => {
    const pieces = place(
      new AcTrVerticalTextLayout(
        'atFont',
        text('縦書'),
        style('@ＭＳ ゴシック')
      )
    )
    expect(pieces).toHaveLength(2)
    pieces.forEach((piece, i) => {
      // Upright: the 270° rotation and the +90° turn cancel out.
      expect(Math.abs(Math.sin(piece.angle))).toBeCloseTo(0, 6)
      expect(Math.cos(piece.angle)).toBeCloseTo(1, 6)
      // The column is centred one em-box centre to the right of the baseline.
      expect(piece.origin.x).toBeCloseTo(100 + CENTER, 6)
      // Cell i is centred (i + 0.5) em below the start; the piece's baseline
      // sits CENTER below the cell centre.
      expect(piece.origin.y).toBeCloseTo(200 - (i + 0.5) * EM - CENTER, 6)
    })
  })

  it('keeps half-width runs of an @ font sideways on the baseline', () => {
    const pieces = place(
      new AcTrVerticalTextLayout(
        'atFont',
        text('縦AB'),
        style('@ＭＳ ゴシック')
      )
    )
    expect(pieces.map(p => p.text)).toEqual(['縦', 'AB'])
    const run = pieces[1]
    // Drawn along the 270° rotation, starting one em below the insertion.
    expect(Math.sin(run.angle)).toBeCloseTo(-1, 6)
    expect(run.origin.x).toBeCloseTo(100, 6)
    expect(run.origin.y).toBeCloseTo(200 - EM, 6)
  })

  it('centres vertical-style text on the insertion line', () => {
    const pieces = place(
      new AcTrVerticalTextLayout(
        'style',
        text('縦A'),
        style('ＭＳ ゴシック', 4)
      )
    )
    // Half-width characters stand upright too, one em per character.
    expect(pieces.map(p => p.text)).toEqual(['縦', 'A'])
    pieces.forEach((piece, i) => {
      expect(Math.cos(piece.angle)).toBeCloseTo(1, 6)
      expect(piece.origin.x).toBeCloseTo(100, 6)
      expect(piece.origin.y).toBeCloseTo(200 - (i + 0.5) * EM - CENTER, 6)
    })
    const box = pieces[0].box
    expect(box.max.y).toBeCloseTo(200, 6)
    expect(box.min.y).toBeCloseTo(200 - 2 * EM, 6)
  })

  it('turns long vowel marks and brackets sideways', () => {
    const pieces = place(
      new AcTrVerticalTextLayout(
        'style',
        text('（ー）'),
        style('ＭＳ ゴシック', 4)
      )
    )
    expect(pieces).toHaveLength(3)
    for (const piece of pieces) {
      expect(Math.sin(piece.angle)).toBeCloseTo(-1, 6)
    }
  })

  it('moves 、 and 。 to the upper right of the cell', () => {
    const [plain, comma] = place(
      new AcTrVerticalTextLayout(
        'style',
        text('あ、'),
        style('ＭＳ ゴシック', 4)
      )
    )
    expect(comma.origin.x - plain.origin.x).toBeCloseTo(0.55 * EM, 6)
    expect(plain.origin.y - comma.origin.y).toBeCloseTo(EM - 0.6 * EM, 6)
  })

  it('applies the attachment point to the whole column', () => {
    const pieces = place(
      new AcTrVerticalTextLayout(
        'style',
        text('縦書', {
          attachmentPoint: AcGiMTextAttachmentPoint.MiddleCenter
        }),
        style('ＭＳ ゴシック', 4)
      )
    )
    const box = pieces[0].box
    expect((box.min.y + box.max.y) / 2).toBeCloseTo(200, 6)
    expect((box.min.x + box.max.x) / 2).toBeCloseTo(100, 6)
  })
})
