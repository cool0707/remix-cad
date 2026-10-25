# RemixCAD

[English](./README.md) | [日本語](./README.ja.md) | [简体中文](./README.zh-CN.md) | [한국어](./README.ko.md) | [Español](./README.es.md) | [Português](./README.pt.md) | [Русский](./README.ru.md) | [Čeština](./README.cs.md)

> **This is a fork.** RemixCAD is a fork of
> [mlightcad/cad-viewer](https://github.com/mlightcad/cad-viewer) (MIT License).
> It is maintained independently and is **not affiliated with or supported by
> the upstream author**. Please report problems with this fork in
> [this repository's issues](https://github.com/cool0707/remix-cad/issues),
> not upstream.

A DXF/DWG viewer and editor that runs entirely in the browser — parsing,
geometry processing and rendering (Three.js / WebGL) happen on the client, so
drawings never leave the user's device.

## What this fork adds

- **Japanese UI** — a complete `ja` locale for every package (viewer, ribbon,
  command line, dialogs, plugins, diff viewer, offline HTML export). The
  browser language is detected automatically.
- **Self-hosted fonts, no CAD CDN** — fonts and drawing templates are served
  from the app itself (`resources/cad-data` → `./cad-data/`).
  - Drawing text: **BIZ UD Gothic / Mincho** are bundled and used for
    MS Gothic / MS Mincho and as the default fallback, so Japanese never falls
    back to Chinese glyph shapes.
  - Other scripts load on demand from **Google Fonts** (Arial → Arimo,
    SimSun → Noto Serif SC, Malgun Gothic → Noto Sans KR, …).
  - UI text: **Noto Sans JP** (self-hosted via `@fontsource-variable/noto-sans-jp`).
- **Localized new drawings** — print page tabs show `キャンバス / 印刷ページ1 / 印刷ページ2`
  (or the active language) instead of the template's Chinese names.
- **Plain-language terms for non-CAD users** — the UI uses everyday words: Block → Symbol,
  block attribute → symbol property, Model space → Canvas, Layout → Print page,
  Hatch → Pattern fill, Xref → Linked drawing, Quick Select → Select by Criteria, and so on.
  Tooltips keep the CAD term in parentheses (all locales).
- **Movable tool bar** — drag the grip (⠿) to move the tool bar anywhere; the ⋯ menu next to it switches
  between vertical and horizontal or puts the bar back in its home position: the left edge of the drawing
  area, or the right edge while the floating panel (layers etc.) is over the left. A bar the panel would cover goes back there by itself.
  Sub-menus open toward the centre of the screen, and the position is remembered.
- **Selection style switch** — a status bar button switches clicks between
  CAD style (every click adds) and replace on click (Shift + click adds or removes,
  clicking empty space clears the selection). CAD style stays the default for now.
- **Property inspector** — the Properties tab groups values into sections (General, Placement, Symbol…)
  and edits them directly (one undo step per change). With several objects selected, a Selection
  section shows X / Y / W / H with a 9-point reference point, counts per type (click to keep only
  that type) and total length / area; values that differ show as "Mixed" and can be set at once.
  Symbol properties (block attributes) are edited in the same panel; in the replace-on-click style,
  double-clicking a symbol jumps to its field.
- **JWW / JWC (Jw_cad) import** — `.jww` and the older `.jwc` files open in the example app through
  `@mlightcad/cad-jww-converter` (MIT; parser: [ezjww](https://github.com/monozukuri-ai/ezjww),
  Rust → WebAssembly, in a Web Worker). Coordinates are converted from paper
  millimetres to real millimetres with the layer-group scale, the sheet becomes
  the drawing limits, and layers are named `<group>-<layer> <names>`.
- **SXF import** (Japanese public-works CAD exchange standard) — `.sfc`, `.p21`
  and their ZIP forms `.sfz` / `.p2z` open in the example app through
  `@mlightcad/cad-sxf-converter` (MIT, TypeScript; ported from
  [ezsxf](https://github.com/monozukuri-ai/ezsxf)). Partial drawings are shown at
  the real size of the main view, the sheet becomes the drawing limits.
- **JWW / SXF export** — File → Export saves the drawing as JWW (Jw_cad), SXF SFC or SXF P21
  (commands `cjww`, `csfc`, `cp21`). Blocks, dimensions and hatches are exploded; the sheet and
  scale come from the drawing limits (drawings read from JWW / SXF keep theirs) or are chosen
  automatically (A3, smallest standard scale that fits).
  Before export a dialog asks for paper, orientation and scale (Auto by default); DXF export writes
  the choice as the drawing limits and PDF export can print model space on a paper size at a scale.
- **Vertical text (縦書き)** — text in a Windows vertical font (`@ＭＳ ゴシック`, e.g. Jw_cad
  縦字) and TEXT whose text style has the AutoCAD "vertical" flag are written top to bottom
  on screen and in SVG / PDF export, with the bundled BIZ UD fonts
  (`@mlightcad/cad-vertical-text`).

## Demo

- Online: <https://cool0707.github.io/remix-cad/> (published from the
  `gh-pages` branch by `.github/workflows/demo.yml`)
- Local:

  ```bash
  pnpm install
  pnpm demo:build   # build all packages and assemble demo-dist/
  pnpm demo         # http://localhost:4300/
  ```

The demo landing page (`demo/index.html`) links to the full viewer, the
simple viewer, the diff viewer and a font test drawing
(`resources/cad-data/samples/fonts-sample.dxf`). The full viewer also accepts
`?url=<drawing>`, `?new=1` and `?lang=ja|en|…`.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 24
- [pnpm](https://pnpm.io/) >= 10

### Install

```bash
git clone https://github.com/cool0707/remix-cad.git
cd remix-cad
pnpm install
```

### Develop

```bash
pnpm dev          # full-featured viewer (Vue + Element Plus)
pnpm dev:simple   # simple viewer (framework-agnostic)
pnpm dev:diff     # drawing comparison
```

### Build and test

```bash
pnpm build
pnpm test
```

## Fonts and resources

Everything the viewer downloads at runtime lives in `resources/cad-data/`
(see its [README](./resources/cad-data/README.md)):

| Path | Contents |
| --- | --- |
| `fonts/fonts.json` | Font catalog (local files and Google Fonts URLs) |
| `fonts/*.woff` | BIZ UD Gothic / PGothic / Mincho / PMincho (SIL OFL 1.1) |
| `templates/acad*.dxf` | New-drawing templates |
| `samples/fonts-sample.dxf` | Font mapping test drawing |
| `samples/jww-sample.jww` | JWW sample (generated by `tools/make-jww-sample.mjs`) |
| `samples/sxf-sample.*` | SXF samples: `.sfc`, `.p21`, `.sfz`, `.p2z` (generated by `tools/make-sxf-sample.py`) |

The example apps copy this folder next to their build output. Hosts that embed
the packages directly can pass `baseUrl` to `AcApDocManager` (relative URLs are
resolved against the page) and change the fallback chain with the
`defaultFonts` / `symbolFonts` options.

SHX fonts are not bundled; text that uses them is drawn with BIZ UD Gothic and
reported in the notification center.

## Packages

The monorepo layout is unchanged from upstream:

| Package | Role |
| --- | --- |
| `@mlightcad/cad-simple-viewer` | Core viewer (no UI framework) |
| `@mlightcad/cad-viewer` | Full Vue 3 viewer with ribbon and palettes |
| `@mlightcad/cad-simple-ui-plugin` | Toolbar / layer / review UI for the simple viewer |
| `@mlightcad/cad-html-plugin`, `cad-pdf-plugin`, `cad-svg-plugin` | HTML / PDF / SVG export |
| `@mlightcad/cad-diff-viewer` | Side-by-side drawing comparison |
| `@mlightcad/three-renderer` | Three.js rendering |
| `@mlightcad/cad-jww-converter` | JWW (Jw_cad) reader and writer (ezjww, WebAssembly) |
| `@mlightcad/cad-sxf-converter` | SXF (SFC / P21 / SFZ / P2Z) reader and writer (TypeScript) |
| `@mlightcad/cad-export-model` | Flattens a drawing into 2D primitives + sheet for the JWW / SXF writers |
| `@mlightcad/cad-vertical-text` | Vertical text (縦書き) layout shared by screen, SVG and PDF |

Package names keep the upstream `@mlightcad/` scope; this fork is not
published to npm.

## DWG support

DXF is parsed by the built-in MIT parser. DWG support is optional through
`@mlightcad/libredwg-converter`, which is based on
[LibreDWG](https://github.com/LibreDWG/libredwg) and licensed under **GPL-3.0**;
the example apps register it explicitly. Check the GPL implications before
distributing a product that includes it.

## JWW / JWC support

`@mlightcad/cad-jww-converter` reads Jw_cad drawings (`.jww`, and the older `.jwc`). It parses the file
with ezjww (MIT) in a Web Worker, converts it to DXF and loads it through the
built-in DXF reader. Register it and deploy `jww-parser-worker.js` and
`jww-parser.wasm` (both in the package's `dist/`) next to each other:

```ts
import { registerJwwConverter } from '@mlightcad/cad-jww-converter'

registerJwwConverter('./assets/jww-parser-worker.js')
```

JWW stores coordinates in paper millimetres. By default everything is scaled by
the scale of the main layer group (the one with the most entities), so the
drawing looks as it does in Jw_cad and the main drawing measures in real
millimetres. `scaleMode: 'layer-group'` scales each group by its own scale (like
Jw_cad's DXF export) and `scaleMode: 'paper'` keeps paper millimetres. JWC files are
converted the same way (they have no font information, so text uses ＭＳ ゴシック).
Images placed with `^@BM` are shown as raster images: images embedded in the JWW are
displayed directly, and images that refer to external files appear as missing images that you
can supply from the viewer. Trimmed images (Jw_cad 画像編集 → トリミング) embedded in the JWW show only the trimmed
part (BMP, and any format the browser decodes, such as JPEG / PNG / GIF); trimmed external images
are shown whole.

## SXF support

`@mlightcad/cad-sxf-converter` reads SXF Ver.3.1 drawings: SFC (`.sfc`), P21
(`.p21`, AP202) and their ZIP forms (`.sfz`, `.p2z`). The parser is written in
TypeScript (no WebAssembly) and its feature handling is ported from ezsxf (MIT).
The drawing is flattened into lines, curves, text, fills and hatches and loaded
through the built-in DXF reader.

```ts
import { registerSxfConverter } from '@mlightcad/cad-sxf-converter'

registerSxfConverter()
```

SXF coordinates are paper millimetres, and partial drawings (部分図) are placed
with a scale ratio. By default everything is scaled by the main partial
drawing's scale, so the sheet looks as printed and the main view measures in
real millimetres; `scaleMode: 'paper'` keeps paper millimetres. Circles, arcs
and ellipses stay true curves, and text is sized from its SXF character box.
Raster images (SXF 3.1 image attributes) are shown when the image file is bundled in the
`.sfz` / `.p2z`; monochrome TIFF (G4) is converted for the browser, JPEG is used as is. A plain
`.sfc` / `.p21` shows the image frame as a missing image. SAF attribute files are not loaded.

## JWW / SXF export

The drawing is first flattened by `@mlightcad/cad-export-model` into lines, arcs / ellipses,
single-line text, points and fills in real millimetres (blocks, dimensions, leaders, splines and
hatch patterns are exploded), together with a sheet (paper + scale). The writers then produce:

| Format | Writer | Notes |
| --- | --- | --- |
| JWW | `AcDbJwwConverter.exportDatabase()` (ezjww's writer, in the parser worker) | Paper A0–A4 (landscape), every layer group at the sheet scale, layers named `<group>-<layer> …` go back to their slots, colours → pens 1–9, line types → Jw_cad line types, `@` fonts → 縦字, fills → solids |
| SFC / P21 | `exportSxf(db, 'sfc' \| 'p21' \| 'sfz' \| 'p2z')` (TypeScript) | One partial drawing (部分図) at the sheet scale; predefined + user RGB colours, predefined line types and widths; SFC in Shift_JIS, P21 as an AP202 graph (checked with ezsxf) |

```ts
import { registerJwwConverter } from '@mlightcad/cad-jww-converter'
import { exportSxf } from '@mlightcad/cad-sxf-converter'

const jww = registerJwwConverter('./assets/jww-parser-worker.js')
const { bytes } = await jww.exportDatabase(db, { title: 'plan' })
const sfc = exportSxf(db, 'sfc', { title: 'plan', paper: 'A1', scale: 100 })
```

The example app registers both with `acapRegisterDrawingExporter()` (`cad-simple-viewer`).
Raster images are embedded in JWW (not yet written to SXF), and DWG export is not available (the npm build of
LibreDWG used for reading has writing disabled).

## License

[MIT](./LICENSE). The original copyright notice of mlightcad is retained as
required by the license. Bundled fonts: BIZ UD fonts (© Morisawa Inc.) and
Noto Sans JP are licensed under the SIL Open Font License 1.1.
