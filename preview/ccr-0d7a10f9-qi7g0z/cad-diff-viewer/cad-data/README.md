# cad-data (self-hosted resources)

Fonts and drawing templates that the viewer loads from `baseUrl`
(default: `cad-data/` next to the app). The example apps copy this folder
into their build output, so no third-party CAD CDN is needed.

## fonts/

`fonts.json` is the font catalog read by `@mlightcad/mtext-renderer`.

| File | Font | Used for (aliases) |
| --- | --- | --- |
| `bizudgothic.woff` | BIZ UDGothic | default fallback, symbols, MS Gothic, IPA Gothic … |
| `bizudpgothic.woff` | BIZ UDPGothic | MS PGothic, MS UI Gothic, Meiryo, Yu Gothic … |
| `bizudmincho.woff` | BIZ UDMincho | MS Mincho, IPA Mincho … |
| `bizudpmincho.woff` | BIZ UDPMincho | MS PMincho, Yu Mincho … |

The BIZ UD fonts are © Morisawa Inc., licensed under the SIL Open Font
License 1.1 (`OFL-BIZUD.txt`); the WOFF files are converted from the TTFs in
[google/fonts](https://github.com/google/fonts).

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
