/**
 * Text helpers shared by the JWW and SXF writers.
 *
 * Jw_cad and SXF size text by the character cell (the em of a full-width
 * character); DXF sizes it by the height of a capital letter. The readers in
 * cad-jww-converter / cad-sxf-converter convert cell → capital height with the
 * metrics of the bundled NS-Font faces, so the writers use the inverse to make
 * a drawing survive a round trip unchanged.
 */

/**
 * Metrics of the bundled NS-Font faces (`resources/cad-data/fonts`), as
 * fractions of the em: the height of a capital "A" (the renderer sizes
 * TrueType text so that the DXF height equals it) and the descender.
 * All faces have em 1000 and descender 141.
 */
const FONT_METRICS = {
  // nsgothic.woff (NS Gothic): "A" 770 — MS Gothic's tall half-width Latin
  gothic: { capHeight: 770 / 1000, descender: 141 / 1000 },
  // nspgothic.woff / nsuigothic.woff (NS PGothic / NS UI Gothic): "A" 688
  pgothic: { capHeight: 688 / 1000, descender: 141 / 1000 },
  // nsmincho.woff (NS Mincho): "A" 684
  mincho: { capHeight: 684 / 1000, descender: 141 / 1000 },
  // nspmincho.woff (NS PMincho): "A" 695
  pmincho: { capHeight: 695 / 1000, descender: 141 / 1000 }
}

/** Which bundled face a font name is drawn with. */
export type CellFontFace = keyof typeof FONT_METRICS

/**
 * The bundled face the viewer substitutes for a font name, following the
 * aliases in `resources/cad-data/fonts/fonts.json` (unknown names fall back
 * to NS Gothic). A leading `@` (Windows vertical font) is ignored.
 */
export function cellFontFace(font: string): CellFontFace {
  const name = font.trim().replace(/^@/, '')
  const mincho = /明朝|mincho/i.test(name)
  const proportional =
    /[PＰ]\s*(ゴシック|明朝|gothic|mincho)|\bUI\b|uigothic|meiryo|メイリオ|yu\s*(gothic|mincho)|游|hiragino|ヒラギノ/i.test(
      name
    )
  if (mincho) return proportional ? 'pmincho' : 'mincho'
  return proportional ? 'pgothic' : 'gothic'
}

/** Metrics of the font the viewer substitutes for a font name. */
export function cellFontMetrics(font: string) {
  return FONT_METRICS[cellFontFace(font)]
}

/** Character cells of a string: half-width characters take half a cell. */
export function textCells(text: string) {
  let cells = 0
  for (const ch of text) {
    // ASCII and half-width katakana (CP932 single-byte characters).
    cells += /[ -~｡-ﾟ]/.test(ch) ? 0.5 : 1
  }
  return cells
}

/** Japanese font names Jw_cad and SXF viewers know. */
export const DEFAULT_GOTHIC_FONT = 'ＭＳ ゴシック'
export const DEFAULT_MINCHO_FONT = 'ＭＳ 明朝'

/**
 * Font name for Jw_cad / SXF: TrueType families are kept, SHX fonts and
 * unknown names become ＭＳ ゴシック (ＭＳ 明朝 for serif-looking names).
 * A leading `@` (vertical font) is kept.
 */
export function cellFontName(font: string) {
  const trimmed = font.replace(/[\p{Cc}]/gu, '').trim()
  const vertical = trimmed.startsWith('@')
  const name = vertical ? trimmed.slice(1) : trimmed
  let result: string
  if (!name || /\.shx$/i.test(name) || /^(txt|simplex|romans)$/i.test(name)) {
    result = DEFAULT_GOTHIC_FONT
  } else if (/\.(ttf|ttc|otf)$/i.test(name)) {
    result = /min|明朝|serif|times/i.test(name)
      ? DEFAULT_MINCHO_FONT
      : DEFAULT_GOTHIC_FONT
  } else {
    result = name
  }
  return vertical ? `@${result}` : result
}

/**
 * Splits MTEXT contents into plain lines: removes formatting codes
 * (`\f…;`, `\H…;`, `\C…;`, `\L \l \O \o \K \k`, braces), decodes `\~`,
 * `\U+XXXX`, stacked fractions and `%%c %%d %%p`.
 */
export function mtextLines(contents: string): string[] {
  return contents
    .split(/\\P|\n/)
    .map(line => mtextPlain(line))
    .filter((line, i, lines) => line !== '' || i < lines.length - 1)
}

function mtextPlain(contents: string) {
  const codes = /\\(U\+[0-9a-fA-F]{4}|[X~SfFHWTQCcAaRrpLlOoKkN\\{}])|[{}]/g
  const parts: string[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = codes.exec(contents))) {
    parts.push(contents.slice(lastIndex, match.index))
    const code = match[1]
    let replacement = ''
    if (code?.startsWith('U+')) {
      replacement = String.fromCharCode(parseInt(code.slice(2), 16))
    } else if (code === '~') {
      replacement = ' '
    } else if (code === '\\' || code === '{' || code === '}') {
      replacement = code
    } else if (code && /[SfFHWTQCcAaRrp]/.test(code)) {
      const end = contents.indexOf(';', codes.lastIndex)
      if (end === -1) {
        replacement = match[0]
      } else {
        if (code === 'S') {
          const stack = contents.slice(codes.lastIndex, end)
          const separator = stack.search(/[\^#/]/)
          replacement =
            separator === -1
              ? stack
              : stack.slice(0, separator) + '/' + stack.slice(separator + 1)
        }
        codes.lastIndex = end + 1
      }
    }
    parts.push(replacement)
    lastIndex = codes.lastIndex
  }
  parts.push(contents.slice(lastIndex))
  return decodeControlCodes(parts.join(''))
}

/** Decodes `%%c`, `%%d`, `%%p` and `%%%` special-character codes. */
export function decodeControlCodes(value: string): string {
  return value
    .replace(/%%[cC]/g, 'Ø')
    .replace(/%%[dD]/g, '°')
    .replace(/%%[pP]/g, '±')
    .replace(/%%[uUoO]/g, '')
    .replace(/%%%/g, '%')
}
