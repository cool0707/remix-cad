import { cellFontMetrics } from '@mlightcad/cad-export-model'
import { readFileSync } from 'fs'
import { resolve } from 'path'

import { jwwTextFontMetrics } from '../src/jwwToDxf'

const catalog: { file: string; name: string[] }[] = JSON.parse(
  readFileSync(
    resolve(__dirname, '../../../resources/cad-data/fonts/fonts.json'),
    'utf8'
  )
)

describe('jwwTextFontMetrics', () => {
  it('uses the same metrics as the JWW writer (cellFontMetrics)', () => {
    const names = catalog
      .filter(entry => /^ns.*\.woff$/.test(entry.file))
      .flatMap(entry => entry.name)
    expect(names.length).toBeGreaterThan(0)
    for (const name of [...names, '', 'Unknown', '@ＭＳ 明朝']) {
      expect([name, jwwTextFontMetrics(name)]).toEqual([
        name,
        cellFontMetrics(name)
      ])
    }
  })
})
