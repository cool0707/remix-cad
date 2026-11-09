import {
  horizontalTextStyle,
  type VerticalTextInput,
  VerticalTextLayout,
  verticalTextLines,
  type VerticalTextMatrix,
  verticalTextMode
} from '../src'

const HEIGHT = 10
/** Em of NS Gothic: "A" is 770 / 1000 em. */
const EM = (HEIGHT * 1000) / 770
/** Baseline to em-box centre (NS-Font descender 141 / 1000). */
const CENTER = (0.5 - 141 / 1000) * EM

function input(text: string, overrides: Partial<VerticalTextInput> = {}) {
  return {
    text,
    height: HEIGHT,
    position: { x: 100, y: 200 },
    rotation: (3 * Math.PI) / 2,
    attachmentPoint: 10, // BaselineLeft
    ...overrides
  }
}

/** Advance of each piece like a monospace font: half-width = half an em. */
function advances(layout: VerticalTextLayout) {
  return layout.pieces.map(
    piece =>
      [...piece.text].reduce(
        (sum, ch) => sum + (/[\x20-\x7e]/.test(ch) ? 0.5 : 1),
        0
      ) *
      EM *
      piece.widthFactor
  )
}

const origin = (m: VerticalTextMatrix) => ({ x: m[4], y: m[5] })
/** Angle of the piece's x axis. */
const angle = (m: VerticalTextMatrix) => Math.atan2(m[1], m[0])

describe('verticalTextMode', () => {
  it('detects @ fonts and vertical TEXT styles', () => {
    expect(
      verticalTextMode({ drawingDirection: 4 }, { font: '@ＭＳ ゴシック' })
    ).toBe('atFont')
    expect(
      verticalTextMode({}, { font: 'msgothic', extendedFont: '@ＭＳ 明朝' })
    ).toBe('atFont')
    expect(
      verticalTextMode({ drawingDirection: 4 }, { font: 'x', standardFlag: 4 })
    ).toBe('style')
    expect(verticalTextMode({ drawingDirection: 4 }, { font: 'x' })).toBe(
      undefined
    )
  })

  it('ignores the vertical style flag for MTEXT, like AutoCAD', () => {
    expect(
      verticalTextMode({ drawingDirection: 1 }, { font: 'x', standardFlag: 4 })
    ).toBe(undefined)
  })
})

describe('horizontalTextStyle', () => {
  it('drops the @ and the vertical flag', () => {
    const style = horizontalTextStyle({
      font: '@ＭＳ ゴシック',
      bigFont: '',
      standardFlag: 5
    })
    expect(style.font).toBe('ＭＳ ゴシック')
    expect(style.standardFlag).toBe(1)
  })
})

describe('verticalTextLines', () => {
  it('drops MTEXT formatting and splits paragraphs', () => {
    expect(
      verticalTextLines('{\\fNS Gothic|b0;縦}書き\\P\\H2x;2行目%%d')
    ).toEqual(['縦書き', '2行目°'])
    expect(verticalTextLines('a\\\\b\\{c\\}\\U+3042\\S1^2;')).toEqual([
      'a\\b{c}あ1/2'
    ])
  })
})

describe('VerticalTextLayout', () => {
  it('stacks full-width characters of an @ font upright down the line', () => {
    const layout = new VerticalTextLayout('atFont', input('縦書'))
    const { matrices, em } = layout.place(advances(layout))
    expect(em).toBeCloseTo(EM, 6)
    matrices.forEach((m, i) => {
      expect(angle(m)).toBeCloseTo(0, 6)
      expect(origin(m).x).toBeCloseTo(100 + CENTER, 6)
      expect(origin(m).y).toBeCloseTo(200 - (i + 0.5) * EM - CENTER, 6)
    })
  })

  it('keeps half-width runs of an @ font sideways on the baseline', () => {
    const layout = new VerticalTextLayout('atFont', input('縦AB'))
    expect(layout.pieces.map(p => p.text)).toEqual(['縦', 'AB'])
    const run = layout.place(advances(layout)).matrices[1]
    expect(angle(run)).toBeCloseTo(-Math.PI / 2, 6)
    expect(origin(run).x).toBeCloseTo(100, 6)
    expect(origin(run).y).toBeCloseTo(200 - EM, 6)
  })

  it('centres vertical-style text on the insertion line', () => {
    const layout = new VerticalTextLayout('style', input('縦A'))
    const { matrices, corners } = layout.place(advances(layout))
    matrices.forEach((m, i) => {
      expect(angle(m)).toBeCloseTo(0, 6)
      expect(origin(m).x).toBeCloseTo(100, 6)
      expect(origin(m).y).toBeCloseTo(200 - (i + 0.5) * EM - CENTER, 6)
    })
    const ys = corners.map(c => c.y)
    expect(Math.max(...ys)).toBeCloseTo(200, 6)
    expect(Math.min(...ys)).toBeCloseTo(200 - 2 * EM, 6)
  })

  it('turns long vowel marks and brackets sideways', () => {
    const layout = new VerticalTextLayout('style', input('（ー）'))
    for (const m of layout.place(advances(layout)).matrices) {
      expect(angle(m)).toBeCloseTo(-Math.PI / 2, 6)
    }
  })

  it('moves 、 to the upper right of the cell', () => {
    const layout = new VerticalTextLayout('style', input('あ、'))
    const [plain, comma] = layout.place(advances(layout)).matrices.map(origin)
    expect(comma.x - plain.x).toBeCloseTo(0.55 * EM, 6)
    expect(plain.y - comma.y).toBeCloseTo(EM - 0.6 * EM, 6)
  })

  it('applies the attachment point to the whole column', () => {
    const layout = new VerticalTextLayout(
      'style',
      input('縦書', { attachmentPoint: 5 })
    )
    const { corners } = layout.place(advances(layout))
    const xs = corners.map(c => c.x)
    const ys = corners.map(c => c.y)
    expect((Math.min(...ys) + Math.max(...ys)) / 2).toBeCloseTo(200, 6)
    expect((Math.min(...xs) + Math.max(...xs)) / 2).toBeCloseTo(100, 6)
  })

  it('falls back to estimated advances', () => {
    const layout = new VerticalTextLayout('style', input('縦A'))
    const { em, matrices } = layout.place([])
    expect(em).toBeCloseTo(EM, 6)
    expect(origin(matrices[1]).y).toBeCloseTo(200 - 1.5 * EM - CENTER, 6)
  })
})
