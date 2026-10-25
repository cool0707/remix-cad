/**
 * Shift_JIS (Windows-31J / CP932) encoder. Browsers only decode Shift_JIS,
 * so the encoding table is built once by decoding every double-byte code
 * with `TextDecoder('shift_jis')`.
 */

let table: Map<number, number> | undefined

function encodingTable() {
  if (table) return table
  table = new Map()
  const decoder = new TextDecoder('shift_jis')
  const pair = new Uint8Array(2)
  const leads = [
    ...Array.from({ length: 0x9f - 0x81 + 1 }, (_, i) => 0x81 + i),
    ...Array.from({ length: 0xfc - 0xe0 + 1 }, (_, i) => 0xe0 + i)
  ]
  for (const lead of leads) {
    for (let trail = 0x40; trail <= 0xfc; trail++) {
      if (trail === 0x7f) continue
      pair[0] = lead
      pair[1] = trail
      const ch = decoder.decode(pair)
      if (ch.length !== 1 || ch === '�') continue
      const code = ch.charCodeAt(0)
      // Keep the first (standard) code of characters with duplicates
      // (NEC / IBM extensions).
      if (!table.has(code)) table.set(code, (lead << 8) | trail)
    }
  }
  // Characters the WHATWG encoder maps onto other codes.
  table.set(0x00a5, 0x5c) // ¥
  table.set(0x203e, 0x7e) // ‾
  table.set(0x2212, 0x817c) // − (minus) → －
  return table
}

/**
 * Encodes a string as Shift_JIS. Characters without a Shift_JIS code become
 * `?` and are reported in `unmapped`.
 */
export function encodeShiftJis(text: string): {
  bytes: Uint8Array
  unmapped: string[]
} {
  const map = encodingTable()
  const out: number[] = []
  const unmapped = new Set<string>()
  for (const ch of text) {
    const code = ch.codePointAt(0)!
    const sjis = code <= 0xffff ? map.get(code) : undefined
    if (code < 0x80) {
      out.push(code)
    } else if (sjis !== undefined) {
      out.push(sjis > 0xff ? sjis >> 8 : sjis)
      if (sjis > 0xff) out.push(sjis & 0xff)
    } else if (code >= 0xff61 && code <= 0xff9f) {
      // Half-width katakana.
      out.push(code - 0xff61 + 0xa1)
    } else {
      unmapped.add(ch)
      out.push(0x3f)
    }
  }
  return { bytes: Uint8Array.from(out), unmapped: [...unmapped] }
}
