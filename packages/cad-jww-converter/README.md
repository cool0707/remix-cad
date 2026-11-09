# @mlightcad/cad-jww-converter

Jw_cad (`.jww`, and the older `.jwc`) reader for the CAD viewer. The file is parsed by
[ezjww](https://github.com/monozukuri-ai/ezjww) (MIT, Rust → WebAssembly) in a
Web Worker, converted to DXF (AC1024, UTF-8) and loaded by the registered DXF
converter, so layers, blocks and text styles follow the regular DXF path.

```ts
import { registerJwwConverter } from '@mlightcad/cad-jww-converter'

// Deploy dist/jww-parser-worker.js and dist/jww-parser.wasm side by side.
registerJwwConverter('./assets/jww-parser-worker.js')
```

After registration `AcApDocManager.openDocument('plan.jww', …)` / `openUrl(…)`
and the viewer's file dialogs accept `.jww` and `.jwc`.

## Conversion

| JWW | Drawing |
| --- | --- |
| Paper millimetres | Real millimetres (`$INSUNITS` = mm), see `scaleMode` |
| Paper size (A0–A4, 2A–5A, 10m–100m) | `$LIMMIN` / `$LIMMAX` (centred on the origin) → "drawing limits" initial view |
| Layer group / layer | Layer `<group>-<layer> <group name> - <layer name>` (hex numbers as in Jw_cad); only used layers; hidden → frozen, protected → locked |
| Pen color, line type, width | ACI color, LTYPE (pattern in paper mm, entity linetype scale = drawing scale), lineweight (from ezjww) |
| Text font | Text style per font (ＭＳ ゴシック / ＭＳ 明朝 … → NS-Font via `fonts.json`) |
| Text size (character cell height) | DXF height = cell × cap height / em of the substituted NS-Font face, baseline raised by the descender — the renderer sizes TrueType text by the capital "A", which would otherwise draw Japanese text ~1.27× too large |
| Blocks | Block definitions + INSERT |
| Dimensions, solids | Lines + text, SOLID (from ezjww) |

`scaleMode` (`AcDbJwwConverterConfig`):

- `drawing` (default): everything is multiplied by the scale of the main layer
  group (the one with the most entities). The drawing looks as it does in
  Jw_cad and the main drawing measures in real millimetres.
- `layer-group`: each entity uses its own layer group's scale, like Jw_cad's DXF
  export. Groups with different scales (e.g. a 1/1 title block) no longer line up.
- `paper`: no scaling (paper millimetres).

JWC (the old format) goes through the same conversion: ezjww converts it to paper
millimetres with the origin at the sheet centre (sheets A0–A4), and the layer group
scales, layer names and text-height correction are applied as for JWW. JWC stores
no fonts, so text uses ＭＳ ゴシック (NS Gothic). Profiles ezjww does not accept
fail with its error message.

Not supported yet: JWS, embedded images (`^@BM`).

## ezjww in the browser

The published `ezjww` package is a Node build (wasm-pack `nodejs` target) that
reads the wasm with `fs` when it is loaded. `patches/ezjww@0.7.3.patch` turns
that into `initSync` / `initAsync`, which the worker calls with the fetched
`jww-parser.wasm`. Updating ezjww requires updating the patch.

## Development

```bash
pnpm --filter @mlightcad/cad-jww-converter build   # dist/ (library, worker, wasm)
npx jest packages/cad-jww-converter                # from the repository root
node tools/make-jww-sample.mjs                     # regenerate the sample drawing
```
