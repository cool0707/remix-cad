/**
 * Baseline TIFF encoder: 24-bit RGB, PackBits compressed, one strip.
 *
 * Browsers cannot encode TIFF, so the file is written by hand. PackBits
 * (compression 32773) is part of baseline TIFF and shrinks the large uniform
 * areas of CAD images well.
 */

/**
 * PackBits-compresses one row (TIFF 6.0 section 9) into `out` at `at`;
 * returns the new end offset.
 */
function packBits(row: Uint8Array, out: Uint8Array, at: number) {
  let o = at
  let i = 0
  const n = row.length
  while (i < n) {
    // Run of equal bytes?
    let run = 1
    while (i + run < n && run < 128 && row[i + run] === row[i]) run++
    if (run >= 2) {
      out[o++] = 257 - run
      out[o++] = row[i]
      i += run
      continue
    }
    // Literal bytes until the next run of 3 or more.
    const start = i
    while (
      i < n &&
      i - start < 128 &&
      !(i + 2 < n && row[i] === row[i + 1] && row[i] === row[i + 2])
    ) {
      i++
    }
    out[o++] = i - start - 1
    out.set(row.subarray(start, i), o)
    o += i - start
  }
  return o
}

/**
 * Encodes top-down RGBA pixels as TIFF. Transparent pixels are composited on
 * white (as the BMP and JPEG exports do).
 *
 * @param dpi - Resolution written to the file (default 96)
 */
export function acapEncodeTiff(
  pixels: Uint8Array,
  width: number,
  height: number,
  dpi = 96
): Uint8Array {
  const row = new Uint8Array(width * 3)
  // Worst case: one header byte per 128 literal bytes.
  const packed = new Uint8Array(height * (row.length + Math.ceil(row.length / 128)))
  let packedLength = 0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      const alpha = (pixels[i + 3] ?? 255) / 255
      const inv = 255 * (1 - alpha)
      row[x * 3] = Math.round((pixels[i] ?? 0) * alpha + inv)
      row[x * 3 + 1] = Math.round((pixels[i + 1] ?? 0) * alpha + inv)
      row[x * 3 + 2] = Math.round((pixels[i + 2] ?? 0) * alpha + inv)
    }
    packedLength = packBits(row, packed, packedLength)
  }
  const data = packed.subarray(0, packedLength)

  const entries: [number, number, number, number][] = [] // tag, type, count, value
  const SHORT = 3
  const LONG = 4
  const RATIONAL = 5
  const tagCount = 12
  const ifdOffset = 8
  const ifdSize = 2 + tagCount * 12 + 4
  const bitsOffset = ifdOffset + ifdSize
  const xResOffset = bitsOffset + 6
  const yResOffset = xResOffset + 8
  const stripOffset = yResOffset + 8
  entries.push(
    [256, LONG, 1, width],
    [257, LONG, 1, height],
    [258, SHORT, 3, bitsOffset],
    [259, SHORT, 1, 32773],
    [262, SHORT, 1, 2],
    [273, LONG, 1, stripOffset],
    [277, SHORT, 1, 3],
    [278, LONG, 1, height],
    [279, LONG, 1, data.length],
    [282, RATIONAL, 1, xResOffset],
    [283, RATIONAL, 1, yResOffset],
    [296, SHORT, 1, 2]
  )
  const buffer = new ArrayBuffer(stripOffset + data.length)
  const view = new DataView(buffer)
  const bytes = new Uint8Array(buffer)
  view.setUint16(0, 0x4949, true) // "II": little endian
  view.setUint16(2, 42, true)
  view.setUint32(4, ifdOffset, true)
  view.setUint16(ifdOffset, tagCount, true)
  entries.forEach(([tag, type, count, value], k) => {
    const at = ifdOffset + 2 + k * 12
    view.setUint16(at, tag, true)
    view.setUint16(at + 2, type, true)
    view.setUint32(at + 4, count, true)
    if (type === SHORT && count === 1) view.setUint16(at + 8, value, true)
    else view.setUint32(at + 8, value, true)
  })
  view.setUint32(ifdOffset + 2 + tagCount * 12, 0, true) // no next IFD
  for (let k = 0; k < 3; k++) view.setUint16(bitsOffset + k * 2, 8, true)
  const resolution = Math.max(1, Math.round(dpi))
  for (const offset of [xResOffset, yResOffset]) {
    view.setUint32(offset, resolution, true)
    view.setUint32(offset + 4, 1, true)
  }
  bytes.set(data, stripOffset)
  return bytes
}
