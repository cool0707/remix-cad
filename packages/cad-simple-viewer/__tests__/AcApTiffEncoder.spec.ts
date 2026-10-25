import { resolve } from 'path'

import { acapEncodeTiff } from '../src/util/AcApTiffEncoder'

// utif2 (MIT) is the SXF reader's TIFF decoder: an independent check.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const UTIF = require(
  require.resolve('utif2', {
    paths: [resolve(__dirname, '../../cad-sxf-converter')]
  })
)

describe('acapEncodeTiff', () => {
  it('writes RGB pixels that a TIFF decoder reads back', () => {
    const width = 300
    const height = 7
    const rgba = new Uint8Array(width * height * 4)
    for (let i = 0; i < width * height; i++) {
      const x = i % width
      // Long runs, literal bytes and a transparent pixel.
      const value = x < 150 ? 0 : 255
      // Grey runs (a CAD background) compress; coloured gradients do not.
      const rgb = x < 200 ? [value, value, value] : [x & 255, (x * 3) & 255, 9]
      rgba.set([...rgb, 255], i * 4)
    }
    rgba[3] = 0
    const tiff = acapEncodeTiff(rgba, width, height, 150)
    const [ifd] = UTIF.decode(tiff.buffer)
    UTIF.decodeImage(tiff.buffer, ifd)
    const decoded = new Uint8Array(UTIF.toRGBA8(ifd))
    expect(ifd.width).toBe(width)
    expect(ifd.height).toBe(height)
    expect(ifd.t259).toEqual([32773])
    expect(ifd.t282[0]).toEqual([150, 1])
    // The transparent pixel is composited on white.
    expect([...decoded.subarray(0, 4)]).toEqual([255, 255, 255, 255])
    for (const i of [1, 150, 299, width * 3 + 120]) {
      expect([...decoded.subarray(i * 4, i * 4 + 3)]).toEqual([
        ...rgba.subarray(i * 4, i * 4 + 3)
      ])
    }
    // PackBits keeps uniform rows small.
    expect(tiff.length).toBeLessThan(width * height * 3)
  })
})
