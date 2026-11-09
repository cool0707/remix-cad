# @mlightcad/cad-sxf-converter

SXF reader for the CAD viewer. SXF is the CAD data exchange standard of the
Japanese Ministry of Land, Infrastructure, Transport and Tourism / OCF (formerly
JACIC), used for public-works deliverables (電子納品).

| Extension | Format |
| --- | --- |
| `.sfc` | SFC: SXF feature comment file (Shift_JIS) |
| `.p21` | P21: ISO 10303-21, AP202 associative draughting |
| `.sfz` / `.p2z` | SFC / P21 in a ZIP archive (attribute and image files are ignored) |

```ts
import { registerSxfConverter } from '@mlightcad/cad-sxf-converter'

registerSxfConverter() // registers sfc, p21, sfz, p2z
```

The parser is plain TypeScript (no WebAssembly, no worker; `fflate` for ZIP).
The SXF file is flattened into drawing primitives, written as DXF (AC1024,
UTF-8) and loaded by the registered DXF converter.

The feature layouts, code tables and P21 presentation-graph handling are ported
from [ezsxf](https://github.com/monozukuri-ai/ezsxf) (MIT): `src/features.rs`,
`src/document.rs` and `src/ezsxf/_drawing*.py`, `_p21_drawing.py`.

## Conversion

| SXF | Drawing |
| --- | --- |
| Sheet (A0–A4 / FREE, `drawing_sheet_feature` or P21 `PLANAR_BOX`) | `$LIMMIN` / `$LIMMAX` → "drawing limits" initial view |
| Paper millimetres; partial drawings (部分図) placed with a ratio | Real millimetres of the main partial drawing (`scaleMode`) |
| Layers (visibility) | Layers (hidden → off) |
| Predefined / user colours | True colour; black and white → ACI 7 (contrasts with the background) |
| Predefined / user line types, widths | `SXF_*` linetypes (pattern in paper mm, entity linetype scale = drawing scale), lineweight |
| Line, polyline, spline, clothoid | LINE / LWPOLYLINE (curves sampled) |
| Circle, arc, ellipse, elliptic arc | CIRCLE / ARC / ELLIPSE (exact, also under rotated or scaled placements) |
| Text (box height, width, base point 1–9) | TEXT with the NS-Font height / baseline correction and a width factor that fits the box; one text style per font |
| Dimensions, labels, balloons | Lines, open arrowheads and text |
| Colour fill / line hatching | Solid HATCH / clipped LINEs; externally defined and tile hatches show their visible boundaries |
| Composite figures (部分図, groups, parts) | Expanded in place |
| Point markers, externally defined symbols | POINT |

`scaleMode` (`AcDbSxfConverterConfig`):

- `drawing` (default): everything is multiplied by the scale of the main
  partial drawing (the placement scale shared by the most primitives). The
  sheet looks as printed and the main view measures in real millimetres.
- `paper`: paper millimetres.

Partial drawings (kinds 1, 2; P21 `$$SXF_FM_` / `$$SXF_FG_`) keep their
elements' layers; for groups and parts (kinds 3, 4) a non-zero placement layer
replaces the elements' layers, as in ezsxf.

Not supported: vertical text is rotated rather than stacked; arrowhead codes are
all drawn as open arrows; SAF attributes and raster images are not loaded.

## Development

```bash
pnpm --filter @mlightcad/cad-sxf-converter build
npx jest packages/cad-sxf-converter                    # from the repository root
python -m pip install ezsxf==0.3.4 && python tools/make-sxf-sample.py   # regenerate samples
```
