import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'

import { cellFontFace, cellFontMetrics } from '../src/text'

const FONTS = resolve(__dirname, '../../../resources/cad-data/fonts')

interface CatalogEntry {
  file: string
  name: string[]
}

const catalog: CatalogEntry[] = JSON.parse(
  readFileSync(resolve(FONTS, 'fonts.json'), 'utf8')
)

/** Bundled face files and the metrics class they belong to. */
const FACE_OF_FILE: Record<string, string> = {
  'nsgothic.woff': 'gothic',
  'nspgothic.woff': 'pgothic',
  'nsuigothic.woff': 'pgothic',
  'nsmincho.woff': 'mincho',
  'nspmincho.woff': 'pmincho'
}

describe('bundled font metrics', () => {
  it('classifies every catalog alias like fonts.json does', () => {
    for (const [file, face] of Object.entries(FACE_OF_FILE)) {
      const entry = catalog.find(e => e.file === file)
      expect(entry).toBeDefined()
      for (const name of entry!.name) {
        expect([name, cellFontFace(name)]).toEqual([name, face])
        expect([name, cellFontFace(`@${name}`)]).toEqual([name, face])
      }
    }
  })

  it('falls back to NS Gothic for unknown fonts', () => {
    expect(cellFontFace('')).toBe('gothic')
    expect(cellFontFace('HG丸ｺﾞｼｯｸM-PRO')).toBe('gothic')
  })

  it.each(Object.entries(FACE_OF_FILE))(
    'matches the capital "A" and descender of %s',
    (file, face) => {
      // fontkit is a dependency of pdf-renderer, not of this package.
      const fontkit = createRequire(
        resolve(__dirname, '../../pdf-renderer/package.json')
      )('@pdf-lib/fontkit')
      const font = fontkit.create(readFileSync(resolve(FONTS, file)))
      const name = catalog.find(e => e.file === file)!.name[1]
      expect(cellFontFace(name)).toBe(face)
      const metrics = cellFontMetrics(name)
      const a = font.glyphForCodePoint(0x41).bbox.maxY
      expect(metrics.capHeight).toBeCloseTo(a / font.unitsPerEm, 6)
      expect(metrics.descender).toBeCloseTo(-font.descent / font.unitsPerEm, 6)
    }
  )
})
