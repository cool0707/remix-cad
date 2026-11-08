/**
 * Linetype table names (lower case, `SXF_` prefix stripped) mapped to
 * `entity.lineTypeName.*` keys. Covers acad.lin and the names the SXF / JWW
 * converters write.
 */
const LINE_TYPE_NAME_KEYS: Record<string, string> = {
  continuous: 'continuous',
  dashed: 'dashed',
  dashed_spaced: 'dashedSpaced',
  hidden: 'hidden',
  dot: 'dot',
  dotted: 'dot',
  dashdot: 'dashDot',
  chain: 'dashDot',
  center: 'center',
  divide: 'divide',
  chain_2dash: 'divide',
  phantom: 'phantom',
  border: 'border',
  long_dash_dot: 'longDashDot',
  long_dash_2dot: 'longDashDoubleDot',
  long_dash_3dot: 'longDashTripleDot',
  dash_dot: 'dashDotShort',
  '2dash_dot': 'doubleDashDot',
  dash_2dot: 'dashDoubleDot',
  '2dash_2dot': 'doubleDashDoubleDot',
  dash_3dot: 'dashTripleDot',
  '2dash_3dot': 'doubleDashTripleDot',
  // Jw_cad line types (names written by the JWW reader, ezjww).
  jww_dashed1: 'jwwDashed1',
  jww_dashed2: 'jwwDashed2',
  jww_dashed3: 'jwwDashed3',
  jww_dashdot1: 'jwwDashDot1',
  jww_dashdot2: 'jwwDashDot2',
  jww_divide1: 'jwwDivide1',
  jww_divide2: 'jwwDivide2',
  jww_construction: 'jwwConstruction',
  jww_dashed_x2: 'jwwDashedX2',
  jww_dashed_x4: 'jwwDashedX4',
  jww_dashdot_x2: 'jwwDashDotX2',
  jww_divide_x2: 'jwwDivideX2'
}

/** `ACAD_ISO02W100` … `ACAD_ISO15W100` (ISO 128 line types 02–15). */
const ISO_LINE_TYPE_NAME_KEYS: Record<string, string> = {
  '02': 'dashed',
  '03': 'dashedSpaced',
  '04': 'longDashDot',
  '05': 'longDashDoubleDot',
  '06': 'longDashTripleDot',
  '07': 'dot',
  '08': 'dashDot',
  '09': 'divide',
  '10': 'dashDotShort',
  '11': 'doubleDashDot',
  '12': 'dashDoubleDot',
  '13': 'doubleDashDoubleDot',
  '14': 'dashTripleDot',
  '15': 'doubleDashTripleDot'
}

/**
 * Maps a linetype table name to its `entity.lineTypeName.*` key, plus a
 * scale suffix for acad.lin variants (`DASHED2`, `DASHEDX2`). Returns
 * `undefined` for user-defined names.
 */
export function resolveLineTypeNameKey(
  name: string
): { key: string; suffix: string } | undefined {
  const normalized = name.trim().toLowerCase()
  const iso = /^acad_iso(\d\d)w\d+$/.exec(normalized)
  const key = iso
    ? ISO_LINE_TYPE_NAME_KEYS[iso[1]]
    : LINE_TYPE_NAME_KEYS[normalized.replace(/^sxf_/, '')]
  if (key) return { key, suffix: '' }

  // acad.lin variants: DASHED2 (half scale), DASHEDX2 (double scale).
  const variant = /^(.+?)(x2|2)$/.exec(normalized)
  const base = variant && LINE_TYPE_NAME_KEYS[variant[1]]
  if (!variant || !base) return undefined
  return { key: base, suffix: variant[2] === 'x2' ? ' (×2)' : ' (2)' }
}
