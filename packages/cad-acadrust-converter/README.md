# @mlightcad/cad-acadrust-converter

DWG / DXF reader and writer for the CAD viewer, powered by
[acadrust](https://github.com/hakanaktt/acadrust) (MPL-2.0, Rust → WebAssembly).
It replaces the LibreDWG (GPL) converter: with this package the viewer has no
GPL dependency.

```ts
import {
  ACADRUST_WORKER_FILE,
  registerAcadrustConverter
} from '@mlightcad/cad-acadrust-converter'

// Deploy dist/acadrust-worker.js and dist/acadrust-engine.wasm side by side.
const converter = registerAcadrustConverter(`./assets/${ACADRUST_WORKER_FILE}`)

// Opening .dwg now works. Saving:
const { bytes } = await converter.exportDatabase(database, {
  format: 'dwg',
  version: 'AC1032' // 2018; AC1015 (2000) … AC1032
})
```

## How a drawing is read

```
 page                         worker (ended when idle)
 ────                         ───────────────────────
 file bytes ──transfer──▶  acadrust: DWG / DXF → document → binary DXF
 database  ◀──transfer──   (a fresh wasm instance per drawing)
   ▲
   └─ the data model's DXF reader streams the binary pairs into the database
```

- **Binary DXF is the hand-over format.** The data model already reads it, pair
  by pair, straight into the database, so there is no intermediate object tree
  and nothing is parsed from text on the page.
- **Nothing is copied between threads.** The file goes to the worker and the
  result comes back as transferred `ArrayBuffer`s.
- **The engine holds no memory between drawings.** WebAssembly memory only
  grows, so each drawing gets a fresh instance of the compiled module, and the
  worker is ended after 20 s without work (`idleTimeoutMs`). The next drawing
  starts a new worker; the wasm comes from the HTTP cache.
- **One drawing at a time.** Jobs are queued, so two large files never peak
  together.

Measured in Node on one machine (old path = LibreDWG parse + convert):

| Drawing | Old path | This package |
| --- | --- | --- |
| DWG, 0.4 MB, 11,858 entities | 944–962 ms | 32–115 ms in the worker + 111–159 ms on the page |
| DWG, 10.5 MB, 296,450 entities | 7.5–7.9 s | 1.5–1.9 s in the worker + 1.8 s on the page |

The engine is 6.5 MB (1.9 MB gzipped); LibreDWG's was 10.8 MB.

## DXF

By default **DXF files keep using the data model's own reader** (`dxf: 'native'`).
It streams the file into the database in one pass on the page, and nothing
beats that: for a 53 MB DXF (296,450 entities) it takes 1.8 s, while going
through acadrust takes 2.4–2.8 s in the worker plus 1.6–1.8 s on the page, and
about 370 MB of worker memory while it runs. The page-side work is the same
either way (it is building the database, not parsing text), so the detour only
adds to it.

`registerAcadrustConverter(url, { dxf: 'engine' })` sends DXF through acadrust
as well, with the built-in reader as the fallback. Use it for damaged files
acadrust can recover. The text encoding is detected the same way in both
readers (Shift_JIS behind an `ANSI_1252` header, UTF-8 in a pre-2007 file, …).

## Writing

`exportDatabase(database, { format, version, limits })`

| `format` | Output | `version` |
| --- | --- | --- |
| `dwg` | DWG | `AC1015` (2000) … `AC1032` (2018, default); also `AC1009` / `AC1012` / `AC1014` |
| `dxf` | ASCII DXF | any; `AC1009` writes genuine R12 (no handles, newer entities converted) |
| `dxf-binary` | Binary DXF | `AC1024` or later (older versions are promoted) |

The database writes itself as binary DXF and the engine converts that, so the
drawing is never held as text. `limits` stores `$LIMMIN` / `$LIMMAX` (the
sheet) without touching the database.

## Node

```ts
import { AcDbAcadrustConverter } from '@mlightcad/cad-acadrust-converter'
import { loadAcadrustWasm } from '@mlightcad/cad-acadrust-converter/node'

const converter = new AcDbAcadrustConverter({ wasm: loadAcadrustWasm })
```

Without a worker URL the engine runs on the calling thread. The wasm needs no
generated glue code: it is a `wasm32-wasip1` module whose six WASI imports are
implemented in `src/engineHost.ts`, the same file for workers, pages and Node.

## The engine

`engine/` is a small Rust crate (MIT) around acadrust: one entry point
(`cad_convert`), the input freed as soon as the document is parsed, text
encoding detection for ASCII DXF, and a JSON report (versions, entity counts,
skipped records). A damaged file comes back as an error or as a partial read
with diagnostics; a panic inside acadrust ends only that job's instance.

`wasm/acadrust-engine.wasm` is checked in so that building the viewer needs no
Rust toolchain. After changing `engine/` (or updating acadrust in
`engine/Cargo.toml`):

```bash
pnpm --filter @mlightcad/cad-acadrust-converter build:wasm   # needs rustup
pnpm --filter @mlightcad/cad-acadrust-converter check:wasm   # also run by the tests
```

## Development

```bash
pnpm --filter @mlightcad/cad-acadrust-converter build   # dist/ (library, worker, wasm)
npx jest packages/cad-acadrust-converter                # from the repository root
(cd packages/cad-acadrust-converter/engine && cargo test)
```

## License

MIT for this package. acadrust is MPL-2.0 and used unmodified; see
[`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md).
