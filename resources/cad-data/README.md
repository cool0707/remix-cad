# cad-data (self-hosted resources)

Fonts and drawing templates that the viewer loads from `baseUrl`
(default: `cad-data/` next to the app). The example apps copy this folder
into their build output, so no third-party CAD CDN is needed.

## fonts/

`fonts.json` is the font catalog read by `@mlightcad/mtext-renderer`.

| File | Font | Used for (aliases) |
| --- | --- | --- |
| `nsgothic.woff` | NS Gothic | default fallback, symbols, MS Gothic, BIZ UDGothic, IPA Gothic … |
| `nspgothic.woff` | NS PGothic | MS PGothic, BIZ UDPGothic, Meiryo, Yu Gothic … |
| `nsuigothic.woff` | NS UI Gothic | MS UI Gothic, Meiryo UI, Yu Gothic UI |
| `nsmincho.woff` | NS Mincho | MS Mincho, BIZ UDMincho, IPA Mincho … |
| `nspmincho.woff` | NS PMincho | MS PMincho, BIZ UDPMincho, Yu Mincho … |

These are [NS-Font](https://github.com/cool0707/NS-Font): Noto Sans / Serif
CJK JP with the glyph size, advance widths and line height of the MS Gothic /
MS Mincho family, so drawings made with Windows fonts keep their layout. The
files are the regular weight of the "Japanese variants" edition
(`dist/Regular-JPVariants/*.ttf`, converted to WOFF with fontTools; opentype.js
cannot read WOFF2): JIS X 0213 level 1–4 kanji, NEC / IBM extensions and the
Adobe-Japan1 ideographic variation sequences (drawn on screen through
`patches/@mlightcad__mtext-renderer@0.13.5.patch`, which resolves cmap format
14). NS-Font is licensed under the SIL
Open Font License 1.1 (`OFL-NSFont.txt`).

The text-height correction of the JWW / SXF readers and writers depends on
the capital "A" and descender of these faces (`cellFontMetrics` in
`packages/cad-export-model/src/text.ts`; checked by
`packages/cad-export-model/__tests__/fontMetrics.spec.ts`), so update it when
replacing the files.

Entries whose `file` is an absolute URL (Arimo, Tinos, Cousine, Noto Sans /
Serif SC, TC, KR, Arabic, Hebrew, Thai) are downloaded from Google Fonts only
when a drawing references them (e.g. Arial, SimSun, Malgun Gothic). Absolute
URLs in `fonts.json` are supported through
`patches/@mlightcad__mtext-renderer@0.13.5.patch`.

## templates/

`acad.dxf` / `acadiso.dxf` are the new-drawing templates. Their paper-space
layouts are named `Layout1` / `Layout2`; `AcApDocManager.newDocument()`
renames them for the active UI language (e.g. `レイアウト1`).

## samples/

`fonts-sample.dxf` exercises the font mapping (ＭＳ ゴシック / 明朝 / Ｐゴシック,
SHX + big font, Arial, 宋体, 맑은 고딕). The demo page opens it with
`cad-viewer/?url=cad-data/samples/fonts-sample.dxf`.

`sjis-sample.dxf` is a Shift_JIS DXF that declares `ANSI_1252` (as several
Japanese tools do); it checks the encoding detection added in
`patches/@mlightcad__data-model@1.15.14.patch`.

`limits-sample.dxf` is a minimal R12 DXF without a TABLES section whose
`$LIMMIN`/`$LIMMAX` (A1 sheet) leave out a circle far outside the sheet. Open
it with `?view=limits` and `?view=extents` to compare the 図面範囲 (limits)
and extents initial views.

`jww-sample.jww` is a Jw_cad (JWW, version 7.00) drawing generated with the
ezjww writer by `tools/make-jww-sample.mjs`: an A3 floor plan at 1/100 in layer
group 0 (grid lines in a chain line type, walls, a door, room names, a
dimension, a north-arrow block) and a 1/1 title block in group 1. It is opened
by the e2e test `packages/cad-viewer-example/e2e/tests/jww.spec.ts` and by the
demo page (`?url=cad-data/samples/jww-sample.jww&view=limits`).

`sxf-sample.sfc` / `.p21` / `.sfz` / `.p2z` are the same SXF drawing in the
four SXF forms, generated with ezsxf (MIT) by `tools/make-sxf-sample.py`: an A3
sheet with a 1/100 partial drawing (grid lines, walls, door, table, rug, column
fill, hatched area, room names, dimension) and a 1/1 border and title. They are
opened by `packages/cad-sxf-converter/__tests__` and the e2e test
`packages/cad-viewer-example/e2e/tests/sxf.spec.ts`, and by the demo page.
