/**
 * Vertical text (縦書き) layout for CAD TEXT / MTEXT.
 *
 * Renderers only know horizontal text. This module splits a vertical text
 * into pieces (one character, or a run of characters that stay sideways),
 * which the renderer draws horizontally at the origin, and then computes the
 * matrix that moves each piece into the vertical line. It has no
 * dependencies so the screen (three.js), SVG and PDF renderers share it.
 */

/**
 * How a text is written vertically.
 *
 * - `atFont`: the font name starts with `@` (Windows vertical font such as
 *   `@ＭＳ ゴシック`, used by Jw_cad 縦字 and AutoCAD). The text is laid out
 *   like horizontal text along its rotation, but full-width characters are
 *   turned 90° counter-clockwise, so a rotation of 270° reads top to bottom.
 *   Half-width characters stay on the baseline (they appear sideways).
 * - `style`: the text style has the AutoCAD "vertical" flag (group 70 bit 4).
 *   Every character is stacked upright along the rotation (270° by default),
 *   centred on the line through the insertion point. Like AutoCAD, this only
 *   applies to TEXT / ATTRIB, not MTEXT.
 */
export type VerticalTextMode = 'atFont' | 'style'

/** Text style flag (DXF group 70) bit for vertical text. */
export const VERTICAL_STYLE_FLAG = 4

/** `AcGiMTextFlowDirection.BOTTOM_TO_TOP`, which only TEXT / ATTRIB use. */
const FLOW_BOTTOM_TO_TOP = 4

/** `AcGiMTextAttachmentPoint` values used here (DXF group 71, plus baseline). */
const ATTACH_TOP_LEFT = 1
const ATTACH_TOP_RIGHT = 3
const ATTACH_MIDDLE_RIGHT = 6
const ATTACH_BASELINE_LEFT = 10

/**
 * Distance from the baseline to the centre of the em box, in em. Matches the
 * bundled NS-Font faces (descender 141 / 1000 em).
 */
export const EM_CENTER_ABOVE_BASELINE = 0.5 - 141 / 1000

/**
 * Em per DXF text height when the font is unknown: the bundled default face
 * NS Gothic ("A" is 770 / 1000 em).
 */
export const FALLBACK_EM_PER_HEIGHT = 1000 / 770

/** Characters drawn sideways (as in horizontal text) inside a vertical line. */
const SIDEWAYS = new Set(
  'ー―‐－—–～〜…‥＝＿：；（）「」『』【】〔〕［］｛｝〈〉《》＜＞≪≫｟｠〘〙〚〛｢｣()[]{}<>-~=_'
)

/** Punctuation that moves to the upper right of the cell in vertical text. */
const UPPER_RIGHT = new Set('、。，．')

/** Small kana that move slightly up and right in vertical text. */
const SMALL_KANA = new Set('ぁぃぅぇぉっゃゅょゎゕゖァィゥェォッャュョヮヵヶ')

/**
 * Whether a character is full-width (a double-byte character in Shift_JIS
 * terms). These are the characters a Windows `@` font turns upright.
 */
export function isVerticalWideChar(ch: string) {
  const cp = ch.codePointAt(0) ?? 0
  return (
    (cp >= 0x1100 && cp <= 0x115f) ||
    (cp >= 0x2e80 && cp <= 0xa4cf && cp !== 0x303f) ||
    (cp >= 0xac00 && cp <= 0xd7a3) ||
    (cp >= 0xf900 && cp <= 0xfaff) ||
    (cp >= 0xfe30 && cp <= 0xfe4f) ||
    (cp >= 0xff01 && cp <= 0xff60) ||
    (cp >= 0xffe0 && cp <= 0xffe6) ||
    (cp >= 0x20000 && cp <= 0x3fffd) ||
    // Symbols that Japanese fonts draw full-width.
    (cp >= 0x2190 && cp <= 0x22ff) ||
    (cp >= 0x2460 && cp <= 0x27bf) ||
    (cp >= 0x2160 && cp <= 0x217f) ||
    [
      0xa7, 0xa8, 0xb0, 0xb1, 0xb4, 0xb6, 0xd7, 0xf7, 0x2010, 0x2015, 0x2016,
      0x2018, 0x2019, 0x201c, 0x201d, 0x2020, 0x2021, 0x2025, 0x2026, 0x2030,
      0x2032, 0x2033, 0x203b, 0x2103, 0x2116, 0x2121
    ].includes(cp)
  )
}

function isAtFont(font: string | undefined) {
  return typeof font === 'string' && font.trim().startsWith('@')
}

/** Font name without the `@` of a Windows vertical font. */
export function stripVerticalFontPrefix<T extends string | undefined>(
  font: T
): T {
  return (isAtFont(font) ? font!.trim().slice(1) : font) as T
}

/** Text style fields that decide vertical writing. */
export interface VerticalTextStyleLike {
  font?: string
  extendedFont?: string
  bigFont?: string
  standardFlag?: number
  widthFactor?: number
}

/**
 * Returns how the text is written vertically, or `undefined` for horizontal
 * text.
 *
 * @param text - Renderer input; TEXT / ATTRIB pass `BOTTOM_TO_TOP` as the
 *   drawing direction, which MTEXT never uses.
 * @param style - Resolved text style.
 */
export function verticalTextMode(
  text: { drawingDirection?: number },
  style: VerticalTextStyleLike
): VerticalTextMode | undefined {
  if (isAtFont(style.font) || isAtFont(style.extendedFont)) return 'atFont'
  if (
    ((style.standardFlag ?? 0) & VERTICAL_STYLE_FLAG) !== 0 &&
    text.drawingDirection === FLOW_BOTTOM_TO_TOP
  ) {
    return 'style'
  }
  return undefined
}

/**
 * Copy of a text style to draw the pieces of a vertical text with: without
 * the `@` of the font names and without the vertical flag.
 */
export function horizontalTextStyle<T extends VerticalTextStyleLike>(
  style: T
): T {
  return {
    ...style,
    font: stripVerticalFontPrefix(style.font) ?? '',
    bigFont: stripVerticalFontPrefix(style.bigFont) ?? '',
    extendedFont: stripVerticalFontPrefix(style.extendedFont),
    standardFlag: (style.standardFlag ?? 0) & ~VERTICAL_STYLE_FLAG
  }
}

/** Skips an MTEXT formatting code up to its `;`. Returns the index of `;`. */
function codeEnd(text: string, from: number) {
  const end = text.indexOf(';', from)
  return end === -1 ? text.length - 1 : end
}

/**
 * Splits TEXT / MTEXT contents into plain lines: formatting codes are
 * dropped, `\P` breaks lines, `%%d` / `%%p` / `%%c` / `\U+XXXX` are decoded
 * and stacks become `a/b`.
 */
export function verticalTextLines(contents: string): string[] {
  const lines: string[] = []
  let line = ''
  for (let i = 0; i < contents.length; i++) {
    const ch = contents[i]
    if (ch === '{' || ch === '}' || ch === '\r') continue
    if (ch === '\n') {
      lines.push(line)
      line = ''
      continue
    }
    if (ch === '%' && contents[i + 1] === '%' && i + 2 < contents.length) {
      const code = contents[i + 2]
      const digits = /^\d{3}/.exec(contents.slice(i + 2))
      if (digits) {
        line += String.fromCharCode(Number(digits[0]))
        i += 4
      } else {
        const symbols: Record<string, string> = {
          c: 'Ø',
          d: '°',
          p: '±',
          '%': '%'
        }
        const symbol = symbols[code.toLowerCase()]
        if (symbol !== undefined) line += symbol
        else if (!/[uok]/i.test(code)) line += `%%${code}`
        i += 2
      }
      continue
    }
    if (ch !== '\\' || i + 1 >= contents.length) {
      line += ch
      continue
    }
    const code = contents[++i]
    if (code === 'P' || code === 'X') {
      lines.push(line)
      line = ''
    } else if (code === '~') {
      line += ' '
    } else if (code === '\\' || code === '{' || code === '}') {
      line += code
    } else if (
      code === 'U' &&
      /^\+[0-9a-fA-F]{4}/.test(contents.slice(i + 1, i + 6))
    ) {
      line += String.fromCharCode(parseInt(contents.slice(i + 2, i + 6), 16))
      i += 5
    } else if (code === 'S') {
      const end = codeEnd(contents, i + 1)
      line += contents.slice(i + 1, end).replace(/[\^#]/, '/')
      i = end
    } else if (/[fFHWTQCcAap]/.test(code)) {
      i = codeEnd(contents, i + 1)
    } else if (!/[LlOoKkN]/.test(code)) {
      line += code
    }
  }
  lines.push(line)
  return lines
}

/** Escapes plain text so an MTEXT renderer draws it literally. */
export function escapeMTextLiteral(text: string) {
  return text.replace(/[\\{}]/g, c => `\\${c}`).replace(/%%/g, '%%%%%%')
}

/** Text placement input (a subset of `AcGiMTextData`). */
export interface VerticalTextInput {
  text: string
  height: number
  widthFactor?: number
  position: { x: number; y: number }
  /** Radians, counter-clockwise. Ignored when {@link directionVector} is set. */
  rotation?: number
  directionVector?: { x: number; y: number }
  /** `AcGiMTextAttachmentPoint` (1–9 MTEXT, 10–12 TEXT baseline). */
  attachmentPoint?: number
  lineSpaceFactor?: number
}

/**
 * One character, or run of characters, that the renderer draws on its own as
 * horizontal text at the origin.
 */
export interface VerticalTextPiece {
  /** Plain text (escape it for MTEXT renderers). */
  text: string
  /**
   * Where the piece's origin is: upright pieces are anchored at the centre of
   * their baseline, sideways runs at the left end of the baseline.
   */
  anchor: 'baselineCenter' | 'baselineLeft'
  /** Width factor to draw the piece with. */
  widthFactor: number
  /** Upright pieces are turned to stand along the vertical line. */
  upright: boolean
  /** Full-width upright character (its advance is the em). */
  wide: boolean
  /** Offset inside the cell, in em (right, up as seen upright). */
  offset: [number, number]
  /** Index of the line (column) the piece is on. */
  line: number
}

/**
 * 2D affine matrix `[a, b, c, d, e, f]` as in SVG `matrix()` and the PDF
 * `cm` operator: `x' = a·x + c·y + e`, `y' = b·x + d·y + f`.
 */
export type VerticalTextMatrix = [
  number,
  number,
  number,
  number,
  number,
  number
]

export interface VerticalTextPlacement {
  /** Matrix of each piece, from its own (origin-anchored) frame to the drawing. */
  matrices: VerticalTextMatrix[]
  /** Em used for the layout, in drawing units. */
  em: number
  /** Corners of the whole text frame in drawing coordinates. */
  corners: { x: number; y: number }[]
}

/** A gap that is not rendered (spaces). Width in em. */
interface Gap {
  line: number
  em: number
}

function multiply(
  m: VerticalTextMatrix,
  n: VerticalTextMatrix
): VerticalTextMatrix {
  return [
    m[0] * n[0] + m[2] * n[1],
    m[1] * n[0] + m[3] * n[1],
    m[0] * n[2] + m[2] * n[3],
    m[1] * n[2] + m[3] * n[3],
    m[0] * n[4] + m[2] * n[5] + m[4],
    m[1] * n[4] + m[3] * n[5] + m[5]
  ]
}

const translate = (x: number, y: number): VerticalTextMatrix => [
  1,
  0,
  0,
  1,
  x,
  y
]
const rotate = (angle: number): VerticalTextMatrix => {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return [cos, sin, -sin, cos, 0, 0]
}
const scale = (x: number, y: number): VerticalTextMatrix => [x, 0, 0, y, 0, 0]

function apply(m: VerticalTextMatrix, x: number, y: number) {
  return { x: m[0] * x + m[2] * y + m[4], y: m[1] * x + m[3] * y + m[5] }
}

/**
 * Splits a vertical text into {@link pieces} and places them with
 * {@link place} once the renderer has measured them.
 */
export class VerticalTextLayout {
  /** Pieces to draw, in order. */
  readonly pieces: VerticalTextPiece[] = []
  private readonly items: (VerticalTextPiece | Gap)[] = []
  private readonly lineCount: number

  /**
   * @param mode - From {@link verticalTextMode}.
   * @param text - Placement of the text.
   * @param styleWidthFactor - Width factor of the text style, used when the
   *   text sets none.
   */
  constructor(
    private readonly mode: VerticalTextMode,
    private readonly text: VerticalTextInput,
    private readonly styleWidthFactor?: number
  ) {
    const lines = verticalTextLines(text.text ?? '')
    this.lineCount = lines.length
    lines.forEach((line, index) => this.split(line, index))
    for (const item of this.items) {
      if ('text' in item) this.pieces.push(item)
    }
  }

  /** Width factor along the line for @ fonts, across it for vertical styles. */
  private get widthFactor() {
    return this.text.widthFactor || this.styleWidthFactor || 1
  }

  private split(line: string, index: number) {
    let run = ''
    const flush = () => {
      if (!run) return
      this.items.push({
        text: run,
        anchor: 'baselineLeft',
        widthFactor: this.widthFactor,
        upright: false,
        wide: false,
        offset: [0, 0],
        line: index
      })
      run = ''
    }
    for (const ch of line) {
      if (ch === ' ' || ch === '\t' || ch === '　') {
        flush()
        this.items.push({ line: index, em: ch === '　' ? 1 : 0.5 })
        continue
      }
      const wide = isVerticalWideChar(ch)
      const upright = SIDEWAYS.has(ch) ? false : this.mode === 'style' || wide
      if (!upright) {
        run += ch
        // Vertical styles keep each sideways character in its own cell.
        if (this.mode === 'style') flush()
        continue
      }
      flush()
      const offset: [number, number] = UPPER_RIGHT.has(ch)
        ? [0.55, 0.6]
        : SMALL_KANA.has(ch)
          ? [0.1, 0.1]
          : [0, 0]
      this.items.push({
        text: ch,
        anchor: 'baselineCenter',
        // @ fonts scale the line direction, i.e. the height of upright glyphs.
        widthFactor: this.mode === 'atFont' ? 1 : this.widthFactor,
        upright: true,
        wide,
        offset,
        line: index
      })
    }
    flush()
  }

  /**
   * Computes where every piece goes.
   *
   * Works in a frame where `u` runs along the line (the text rotation) and
   * `v` is perpendicular to it (the "up" of horizontal text). Lines follow
   * each other in -v, so for a 270° rotation columns go right to left.
   *
   * @param advances - Advance width of each piece as drawn (with its
   *   {@link VerticalTextPiece.widthFactor}), in drawing units. A missing or
   *   zero value falls back to an estimate.
   * @param knownEm - Em of the font in drawing units, when the renderer knows
   *   it. Otherwise it is taken from the full-width pieces.
   */
  place(
    advances: (number | undefined)[],
    knownEm?: number
  ): VerticalTextPlacement {
    const pieces = this.pieces
    const wf = this.widthFactor

    let em = knownEm ?? 0
    if (!(em > 0)) {
      pieces.forEach((piece, i) => {
        if (piece.wide) {
          em = Math.max(em, (advances[i] ?? 0) / Math.abs(piece.widthFactor))
        }
      })
    }
    if (!(em > 0)) em = this.text.height * FALLBACK_EM_PER_HEIGHT
    // Length of one em along the line.
    const step = this.mode === 'atFont' ? em * Math.abs(wf) : em
    const center = this.mode === 'atFont' ? EM_CENTER_ABOVE_BASELINE * em : 0
    const pitch = (5 / 3) * this.text.height * (this.text.lineSpaceFactor || 1)

    // Pen position of each piece along its line.
    const lengths = new Array<number>(this.lineCount).fill(0)
    const starts: number[] = []
    const sizes: number[] = []
    let p = 0
    for (const item of this.items) {
      let advance: number
      if (!('text' in item)) advance = item.em * step
      else if (item.upright) advance = step
      else advance = advances[p] || [...item.text].length * step * 0.5
      if ('text' in item) {
        starts.push(lengths[item.line])
        sizes.push(advance)
        p++
      }
      lengths[item.line] += advance
    }
    const length = Math.max(0, ...lengths)

    const attachment = this.text.attachmentPoint ?? ATTACH_TOP_LEFT
    const column = (attachment - 1) % 3 // 0 left, 1 center, 2 right
    const vMax = center + em / 2
    const vMin = center - em / 2 - (this.lineCount - 1) * pitch
    const hu = (column / 2) * length
    const hv =
      attachment >= ATTACH_BASELINE_LEFT
        ? 0
        : attachment <= ATTACH_TOP_RIGHT
          ? vMax
          : attachment <= ATTACH_MIDDLE_RIGHT
            ? (vMin + vMax) / 2
            : vMin

    const direction = this.text.directionVector
    const angle =
      direction && (direction.x !== 0 || direction.y !== 0)
        ? Math.atan2(direction.y, direction.x)
        : this.text.rotation || 0
    const { x, y } = this.text.position
    const placement = multiply(
      multiply(translate(x, y), rotate(angle)),
      translate(-hu, -hv)
    )

    const matrices = pieces.map((piece, i) => {
      const lineShift = (column / 2) * (length - lengths[piece.line])
      const u = lineShift + starts[i]
      const v = center - piece.line * pitch
      const local = piece.upright
        ? multiply(
            multiply(
              multiply(translate(u + sizes[i] / 2, v), rotate(Math.PI / 2)),
              scale(1, this.mode === 'atFont' ? Math.abs(wf) : 1)
            ),
            translate(
              piece.offset[0] * em,
              (piece.offset[1] - EM_CENTER_ABOVE_BASELINE) * em
            )
          )
        : translate(u, v - EM_CENTER_ABOVE_BASELINE * em)
      return multiply(placement, local)
    })
    const corners = [
      apply(placement, 0, vMin),
      apply(placement, length, vMin),
      apply(placement, length, vMax),
      apply(placement, 0, vMax)
    ]
    return { matrices, em, corners }
  }
}
