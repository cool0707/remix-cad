/**
 * Jw_cad 特殊文字 (special characters).
 *
 * Jw_cad draws a few two-letter codes in a text string specially instead of
 * printing them:
 *
 * | code | effect                                                        |
 * | ---- | ------------------------------------------------------------- |
 * | `^u` | 上付き: the next character, small, at the top of the cell     |
 * | `^d` | 下付き: the next character, small, at the bottom of the cell  |
 * | `^c` | 中付き: the next character, small, in the middle of the cell  |
 * | `^o` | 重ね文字: the next character, small, centred on the previous one |
 * | `^w` | 重ね文字: the next two (half-width) characters, small, centred on the previous one |
 * | `^n` `^b` `^B` | 重ね文字: the next character, full size, centred on the previous one |
 * | `^0`–`^9` | 文字の均等縮小: not drawn; Jw_cad narrows the text by that many half-width cells |
 *
 * DXF has no equivalent, and a TEXT string goes through the MTEXT parser
 * where `^x` is a control character (drawn as "▯", which the fonts show as
 * "?"). The small characters of `^u` / `^d` / `^c` keep the width of the
 * character at normal size, like Jw_cad. {@link layoutJwwText} therefore splits such a string into runs that
 * become separate TEXT entities.
 *
 * Jw_cad saves the end point of a text where the drawn characters end, so
 * the codes take no room and 均等縮小 is already applied. The width of the
 * characters is that length over {@link jwwTextCells} cells.
 */

/** A piece of a Jw_cad text drawn as one DXF TEXT. */
export interface JwwTextRun {
  /** Characters, without special codes. */
  text: string
  /** Start along the string, in character cells (full-width = 1). */
  x: number
  /** Bottom of the characters above the cell bottom, in cell heights. */
  y: number
  /** Size relative to the text size. */
  scale: number
}

/** Size of small (上付き・下付き・中付き・重ね) characters. */
const SMALL = 0.5
/** Size of `^o` / `^w` characters drawn inside the previous character. */
const OVERLAY = 0.6

/** Width of a character in cells: CP932 single-byte characters are half. */
export function jwwCharCells(ch: string) {
  return /[ -~｡-ﾟ]/.test(ch) ? 0.5 : 1
}

/** Whether `text` contains a Jw_cad special-character code. */
export function hasJwwSpecialCodes(text: string) {
  return /\^[udcownbB0-9]/.test(text)
}

/**
 * Splits a Jw_cad text into runs, applying the special-character codes.
 * Text without codes is a single run.
 */
export function layoutJwwText(text: string): JwwTextRun[] {
  return layout(text).runs
}

/**
 * Length of a Jw_cad text in character cells (full-width = 1) as drawn,
 * without the special-character codes.
 */
export function jwwTextCells(text: string) {
  return layout(text).cells
}

function layout(text: string) {
  const chars = [...text]
  const runs: JwwTextRun[] = []
  let x = 0
  // The current run of normal characters.
  let plain: JwwTextRun | undefined
  // Cell of the last character drawn, which overlays are centred on.
  let last: { x: number; width: number } | undefined

  const addPlain = (ch: string) => {
    if (!plain) {
      plain = { text: '', x, y: 0, scale: 1 }
      runs.push(plain)
    }
    plain.text += ch
    const width = jwwCharCells(ch)
    last = { x, width }
    x += width
  }
  const addRun = (run: JwwTextRun) => {
    plain = undefined
    if (run.text) runs.push(run)
  }

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i]
    const code = ch === '^' ? chars[i + 1] : undefined
    if (code && /[0-9]/.test(code)) {
      // Jw_cad hides these (均等縮小 etc.) without changing the text.
      i += 1
      continue
    }
    const next = chars[i + 2]
    if (!code || !next || !'udcownbB'.includes(code)) {
      addPlain(ch)
      continue
    }
    switch (code) {
      case 'u':
      case 'd':
      case 'c': {
        // Jw_cad keeps the full width of the character for it.
        const width = jwwCharCells(next)
        const y = code === 'u' ? 1 - SMALL : code === 'd' ? 0 : (1 - SMALL) / 2
        addRun({ text: next, x, y, scale: SMALL })
        last = { x, width }
        x += width
        i += 2
        break
      }
      case 'w': {
        const pair = chars.slice(i + 2, i + 4).join('')
        addOverlay(pair, OVERLAY)
        i += 1 + [...pair].length
        break
      }
      case 'o':
        addOverlay(next, OVERLAY)
        i += 2
        break
      default:
        addOverlay(next, 1)
        i += 2
        break
    }
  }
  return { runs, cells: x }

  function addOverlay(chars: string, scale: number) {
    const width = [...chars].reduce((sum, c) => sum + jwwCharCells(c), 0)
    // Without a previous character the overlay takes a cell of its own.
    const cell = last ?? { x, width: 0 }
    if (!last) x += width * scale
    addRun({
      text: chars,
      x: cell.x + (cell.width - width * scale) / 2,
      y: (1 - scale) / 2,
      scale
    })
  }
}

/**
 * Escapes the carets the MTEXT parser would read as control characters
 * (`^x`), so that they are drawn as typed (`^ ` is a literal caret).
 */
export function escapeTextCarets(text: string) {
  return text.replace(/\^(?=\S)/g, '^ ')
}
