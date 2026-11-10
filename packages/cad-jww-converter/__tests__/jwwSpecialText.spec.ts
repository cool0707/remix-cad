import * as ezjww from 'ezjww'
import { readFileSync } from 'fs'

import {
  escapeTextCarets,
  hasJwwSpecialCodes,
  layoutJwwText
} from '../src/jwwSpecialText'
import { convertJwwToDxf } from '../src/jwwToDxf'

beforeAll(() => {
  const wasm = require.resolve('ezjww/wasm/ezjww_wasm_bg.wasm')
  ezjww.initSync(readFileSync(wasm))
})

describe('layoutJwwText', () => {
  it('keeps text without codes as one run', () => {
    expect(hasJwwSpecialCodes('居間・食堂')).toBe(false)
    expect(layoutJwwText('居間・食堂')).toEqual([
      { text: '居間・食堂', x: 0, y: 0, scale: 1 }
    ])
  })

  it('centres ^o on the previous character', () => {
    expect(layoutJwwText('〇^oア')).toEqual([
      { text: '〇', x: 0, y: 0, scale: 1 },
      { text: 'ア', x: 0.2, y: 0.2, scale: 0.6 }
    ])
    // A half-width overlay on the second character; text continues after it.
    const runs = layoutJwwText('A○^o1B')
    expect(runs.map(r => r.text)).toEqual(['A○', '1', 'B'])
    expect(runs[1].x).toBeCloseTo(0.5 + (1 - 0.3) / 2)
    expect(runs[2].x).toBe(1.5)
  })

  it('centres the two characters of ^w on the previous character', () => {
    const runs = layoutJwwText('○^w12')
    expect(runs.map(r => r.text)).toEqual(['○', '12'])
    expect(runs[1].x).toBeCloseTo(0.2)
  })

  it('overlays ^n at full size', () => {
    expect(layoutJwwText('□^n×')).toEqual([
      { text: '□', x: 0, y: 0, scale: 1 },
      { text: '×', x: 0, y: 0, scale: 1 }
    ])
  })

  it('draws ^u / ^d / ^c small and advances by their width', () => {
    const runs = layoutJwwText('m^u2^d3^cx')
    expect(runs).toEqual([
      { text: 'm', x: 0, y: 0, scale: 1 },
      { text: '2', x: 0.5, y: 0.5, scale: 0.5 },
      { text: '3', x: 0.75, y: 0, scale: 0.5 },
      { text: 'x', x: 1, y: 0.25, scale: 0.5 }
    ])
  })

  it('keeps carets that are not codes', () => {
    expect(layoutJwwText('a^z^')).toEqual([
      { text: 'a^z^', x: 0, y: 0, scale: 1 }
    ])
    expect(escapeTextCarets('a^z^')).toBe('a^ z^')
  })
})

describe('convertJwwToDxf with 特殊文字', () => {
  function drawing(content: string) {
    const doc = ezjww.newJwwDocument()
    doc.entities.push({
      type: 'TEXT',
      base: {
        group: 0,
        pen_style: 1,
        pen_color: 1,
        pen_width: 0,
        layer: 0,
        layer_group: 0,
        flag: 0
      },
      start_x: 10,
      start_y: 20,
      end_x: 20,
      end_y: 20,
      text_type: 0,
      size_x: 4,
      size_y: 4,
      spacing: 0,
      angle: 0,
      font_name: 'ＭＳ ゴシック',
      content
    })
    return ezjww.toJwwBytes(doc)
  }

  function texts(dxf: string) {
    const lines = dxf.split(/\r?\n/)
    const result: string[] = []
    for (let i = 0; i < lines.length - 1; i += 2) {
      if (lines[i].trim() === '1' && lines.slice(0, i).reverse().includes('TEXT')) {
        result.push(lines[i + 1])
      }
    }
    return result
  }

  it('writes overlaid characters as separate TEXT entities', () => {
    const { dxf } = convertJwwToDxf(ezjww, drawing('〇^oア'))
    expect(dxf).not.toContain('^o')
    const strings = texts(dxf)
    expect(strings).toContain('〇')
    expect(strings).toContain('ア')
  })

  it('escapes literal carets', () => {
    const { dxf } = convertJwwToDxf(ezjww, drawing('A^Z'))
    expect(texts(dxf)).toContain('A^ Z')
  })
})
