import { readFileSync } from 'node:fs'

import fontkit from '@pdf-lib/fontkit'
import {
  decodePDFRawStream,
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFName,
  PDFRawStream
} from 'pdf-lib'

import { AcPdfFontManager } from '../src/pdf/AcPdfFontManager'
import type { AcPdfOp } from '../src/renderer/AcPdfStyle'

/**
 * fontkit's subsetter copies glyphs verbatim and writes a short `loca` for
 * small subsets; fonts such as BIZ UD have odd-length glyphs, so without padding every glyph
 * after the first odd one was corrupt and PDF viewers painted nothing for it
 * ("居間・食堂" rendered as "居間").
 */
describe('AcPdfFontManager subset embedding', () => {
  function textOp(text: string): Extract<AcPdfOp, { kind: 'text' }> {
    return {
      kind: 'text',
      text,
      hex: '',
      font: 'f',
      size: 12,
      x: 0,
      y: 0,
      angleDeg: 0,
      hScale: 1,
      style: { rgb: { r: 0, g: 0, b: 0 }, opacity: 1 }
    }
  }

  function embeddedProgram(doc: PDFDocument, fonts: AcPdfFontManager) {
    const type0 = doc.context.lookup(fonts.resourceFor('f')!.ref, PDFDict)
    const cidFont = type0
      .lookup(PDFName.of('DescendantFonts'), PDFArray)
      .lookup(0, PDFDict)
    const descriptor = cidFont.lookup(PDFName.of('FontDescriptor'), PDFDict)
    const file = doc.context.lookup(descriptor.get(PDFName.of('FontFile2')))
    expect(file).toBeInstanceOf(PDFRawStream)
    return decodePDFRawStream(file as PDFRawStream).decode()
  }

  it.each(['nsgothic', 'nspgothic', 'nsuigothic', 'nsmincho', 'nspmincho'])(
    'keeps every subset glyph of %s intact',
    async name => {
      const woff = new Uint8Array(
        readFileSync(`resources/cad-data/fonts/${name}.woff`)
      )
      const fonts = new AcPdfFontManager(async () => woff)
      expect(await fonts.load('f')).toBe(true)

      const doc = await PDFDocument.create()
      const texts = [
        '居間・食堂',
        'サンプル平面図',
        'ABC abc 123',
        '寝室（洋室）'
      ]
      const ops = texts.map(textOp)
      for (const op of ops) {
        await fonts.embedOp(doc, op)
      }
      await fonts.finalize()

      const program = embeddedProgram(doc, fonts)
      const subset = fontkit.create(Buffer.from(program))
      const source = fontkit.create(Buffer.from(woff))

      ops.forEach(op => {
        const chars = [...op.text]
        const gids = op.hex.match(/.{4}/g)!.map(h => parseInt(h, 16))
        expect(gids).toHaveLength(chars.length)
        chars.forEach((char, i) => {
          const expected = source.glyphForCodePoint(char.codePointAt(0)!)
          const actual = subset.getGlyph(gids[i])
          expect(actual.path.toSVG()).toBe(expected.path.toSVG())
          expect(actual.advanceWidth).toBe(expected.advanceWidth)
        })
      })
    }
  )
})
