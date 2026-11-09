import { cellFontMetrics } from '@mlightcad/cad-export-model'
import { readFileSync } from 'fs'
import { resolve } from 'path'

import { sxfTextFontMetrics } from '../src/sxfToDxf'

const catalog: { file: string; name: string[] }[] = JSON.parse(
  readFileSync(
    resolve(__dirname, '../../../resources/cad-data/fonts/fonts.json'),
    'utf8'
  )
)

describe('sxfTextFontMetrics', () => {
  it('uses the same metrics as the SXF writer (cellFontMetrics)', () => {
    const names = catalog
      .filter(entry => /^ns.*\.woff$/.test(entry.file))
      .flatMap(entry => entry.name)
    expect(names.length).toBeGreaterThan(0)
    for (const name of [...names, '', 'Unknown', '@ＭＳ 明朝']) {
      expect([name, sxfTextFontMetrics(name)]).toEqual([
        name,
        cellFontMetrics(name)
      ])
    }
  })
})
