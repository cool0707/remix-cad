import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import {
  type AcGiMTextData,
  AcGiMTextFlowDirection,
  type AcGiTextStyle
} from '@mlightcad/data-model'

import { AcPdfFontManager } from '../src/pdf/AcPdfFontManager'
import { AcPdfEntity } from '../src/renderer/AcPdfEntity'
import { AcPdfRenderer } from '../src/renderer/AcPdfRenderer'
import type { AcPdfGlyphProvider } from '../src/text/AcPdfGlyphProvider'

const FONT = resolve(
  __dirname,
  '../../../resources/cad-data/fonts/nsgothic.woff'
)

function style(font: string, standardFlag = 0): AcGiTextStyle {
  return {
    name: 'TATE',
    standardFlag,
    fixedTextHeight: 0,
    widthFactor: 1,
    obliqueAngle: 0,
    textGenerationFlag: 0,
    lastHeight: 0,
    font,
    bigFont: ''
  }
}

function text(contents: string): AcGiMTextData {
  return {
    text: contents,
    height: 10,
    width: Infinity,
    widthFactor: 1,
    position: { x: 100, y: 200, z: 0 },
    rotation: (3 * Math.PI) / 2,
    // TEXT / ATTRIB
    drawingDirection: AcGiMTextFlowDirection.BOTTOM_TO_TOP,
    attachmentPoint: 10
  }
}

const vectorCalls: AcGiTextStyle[] = []
const glyphProvider: AcPdfGlyphProvider = {
  async renderMText(data, textStyle) {
    vectorCalls.push(textStyle)
    return {
      primitives: {
        triangles: new Float32Array([0, 0, 1, 0, 0, 1]),
        polylines: new Float32Array(0)
      },
      box: { min: { x: 0, y: 0 }, max: { x: 1, y: 1 } },
      actualText: data.text ?? ''
    }
  },
  async renderShape() {
    return {
      primitives: {
        triangles: new Float32Array(0),
        polylines: new Float32Array(0)
      },
      box: { min: { x: 0, y: 0 }, max: { x: 0, y: 0 } }
    }
  }
}

async function textModeRenderer() {
  const bytes = new Uint8Array(readFileSync(FONT))
  const renderer = new AcPdfRenderer()
  renderer.configureExport({
    glyphProvider,
    textMode: 'text',
    background: 'none',
    title: 'vertical-text'
  })
  renderer.textFontManager = new AcPdfFontManager(async name =>
    /nsgothic|ゴシック/i.test(name) ? bytes : undefined
  )
  return renderer
}

function textOps(entity: AcPdfEntity) {
  const ops: { text: string; x: number; y: number; angleDeg: number }[] = []
  entity.forEachOp(op => {
    if (op.kind === 'text') ops.push(op)
  })
  return ops
}

describe('vertical text in text-mode PDF', () => {
  beforeEach(() => {
    vectorCalls.length = 0
  })

  it('paints each character of an @ font upright down the line', async () => {
    const renderer = await textModeRenderer()
    // The @ is dropped to find the font.
    await renderer.textFontManager!.load('ＭＳ ゴシック')
    const entity = renderer.mtext(
      text('縦書き'),
      style('@ＭＳ ゴシック')
    ) as AcPdfEntity
    await renderer.awaitPending()

    const ops = textOps(entity)
    expect(ops.map(op => op.text)).toEqual(['縦', '書', 'き'])
    expect(vectorCalls).toHaveLength(0)
    for (const op of ops) {
      // Upright: the 270° rotation and the +90° turn cancel out.
      expect(op.angleDeg).toBeCloseTo(0, 6)
    }
    // One column, top to bottom, one em apart.
    expect(ops[1].x).toBeCloseTo(ops[0].x, 6)
    expect(ops[2].x).toBeCloseTo(ops[0].x, 6)
    const step = ops[0].y - ops[1].y
    expect(step).toBeGreaterThan(10)
    expect(ops[1].y - ops[2].y).toBeCloseTo(step, 6)
  })

  it('turns 「ー」 sideways for a vertical text style', async () => {
    const renderer = await textModeRenderer()
    await renderer.textFontManager!.load('ＭＳ ゴシック')
    const entity = renderer.mtext(
      text('縦ー'),
      style('ＭＳ ゴシック', 4)
    ) as AcPdfEntity
    await renderer.awaitPending()

    const [upright, sideways] = textOps(entity)
    expect(upright.angleDeg).toBeCloseTo(0, 6)
    expect(((sideways.angleDeg % 360) + 360) % 360).toBeCloseTo(270, 6)
  })

  it('passes the @ font to the glyph provider in vector mode', async () => {
    const renderer = new AcPdfRenderer()
    renderer.configureExport({
      glyphProvider,
      textMode: 'vector',
      background: 'none',
      title: 'vertical-vector'
    })
    renderer.mtext(text('縦書き'), style('@ＭＳ ゴシック'))
    await renderer.awaitPending()
    // The provider lays the text out vertically itself (cad-pdf-plugin).
    expect(vectorCalls.map(s => s.font)).toEqual(['@ＭＳ ゴシック'])
  })
})
