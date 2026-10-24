# CLAUDE.md — RemixCAD

mlightcad/cad-viewer (MIT) を日本向けにフォークしたブラウザ CAD ビューア。
JWW / JWC (`packages/cad-jww-converter`) と SXF (SFC・P21・SFZ・P2Z、`packages/cad-sxf-converter`)
の読み込みと、JWW・SXF (SFC・P21) への書き出し (`packages/cad-export-model` 経由) は実装済み。経緯と残課題は [`HANDOFF.md`](./HANDOFF.md) を最初に読むこと。
次の大きな作業は **CAD 未経験者向け UI への作り替え** — 計画と決定事項は [`UX-PLAN.md`](./UX-PLAN.md)。

## コマンド

```bash
pnpm install
pnpm build                 # nx run-many -t build (数分)。vue-tsc の既存エラーが出るが EXIT 0 なら問題なし
npx jest                   # ルートから実行 (パッケージ内で実行すると transform が失敗する)
npx jest packages/cad-simple-viewer/__tests__/AcApLayoutViewFraming.spec.ts   # 単体
pnpm dev                   # フル機能ビューア (cad-viewer-example)
pnpm demo:build && pnpm demo   # demo-dist/ を作って http://localhost:4300/
pnpm --filter @mlightcad/cad-viewer-example test:e2e   # Playwright e2e (fixtures: packages/cad-viewer-example/e2e/fixtures)
```

- Node 22 / pnpm 10 で動作確認済み (README は Node >= 24 と書いてあるが 22 でもビルド・テスト可)。
- `pnpm lint` には examples の vite.config.ts と `tools/*.mjs` に既存エラーがある。自分の変更分だけ見る。

## リポジトリ構成 (要点だけ)

- `packages/cad-simple-viewer` — フレームワーク非依存のコア (AcApDocManager, AcTrView2d, コマンド, i18n)。
- `packages/cad-viewer` — Vue3 + Element Plus の UI。`packages/cad-viewer-example` がデモ本体。
- `packages/cad-jww-converter` — JWW / JWC (Jw_cad) 読み込み。ezjww (MIT, wasm) を Worker で実行し DXF 経由で読む。example で opt-in 登録。
- `packages/cad-sxf-converter` — SXF 読み込み。TypeScript 実装 (ezsxf から移植、wasm なし)。DXF 経由で読む。example で opt-in 登録。
- `packages/cad-vertical-text` — 縦書きの組み方 (依存なし)。画面 (three-renderer)・SVG・PDF で共有。
- `@mlightcad/data-model` / `libredwg-converter` / `geometry-engine` / `mtext-renderer` は **npm 依存** (このリポジトリにソースは無い)。直すときは pnpm patch (下記)。
- `resources/cad-data/` — フォント (BIZ UD woff + fonts.json)・テンプレート・サンプル図面。ビルド時に各 example の `cad-data/` へコピーされる。
- `demo/index.html` + `tools/build-demo.mjs` → `demo-dist/` → GitHub Pages (`.github/workflows/demo.yml`, gh-pages ブランチ)。
  - `main` はサイトの直下、それ以外のブランチは `preview/<ブランチ名>/` に出る
    (例: https://cool0707.github.io/remix-cad/preview/<ブランチ名>/ 。名前の `/` などは `-` になる)。
    push してからビルドが終わるまで数分かかる。ブランチを削除するとプレビューも消える。
    gh-pages の更新は `tools/publish-pages.sh` (main の更新でも `preview/` は残す)。

## 依存パッケージの修正 = pnpm patch

`patches/` と `pnpm-workspace.yaml` の `patchedDependencies` で管理している。

```bash
pnpm patch @mlightcad/data-model@1.15.14 --edit-dir /tmp/dm-edit   # 既存パッチ適用済みの状態で展開される
# /tmp/dm-edit/lib/... を編集 (配布物の ES5 JS と .d.ts を直接直す)
pnpm patch-commit /tmp/dm-edit
```

現在のパッチと理由は HANDOFF.md の「既存パッチ」を参照。上流バージョンを上げるとパッチが当たらなくなるので注意。

## 守ること

- UI 文字列は必ず i18n に入れ、**en / ja / zh / tr / cs / ar 全ロケール**に追加する
  (cad-simple-viewer `src/i18n/*`, cad-viewer `src/locale/*`, cad-viewer-example `src/locale/*`)。日本語を最優先で自然に。
- 図面フォントは CDN を使わない。BIZ UD を同梱、他言語は Google Fonts (`fonts.json` の絶対 URL)。UI フォントは Noto Sans JP。
- LibreDWG (GPL) を本体パッケージに取り込まない。DWG は example 側で opt-in 登録している。JWW / SXF も同じく **MIT 互換のライブラリか自前実装** にする。
  例外として DWG 書き出しは CADcraft (MPL-2.0) を取り込む予定 — MPL のファイルは専用パッケージに分け、ライセンス表記を残す (HANDOFF.md 2.5)。
- `main` と `ja-localization` は現在同一。今後は `main` から作業ブランチを切ればよい。
- テーマカラーは **`packages/cad-simple-viewer/src/theme/theme.config.ts`** の 1 か所で決める
  (現在: 一色 `#AF61DA`、グラデーション `#EA60D4 → #9C62DC`)。書き換えて `pnpm build` すれば全 UI に反映される。
  色を直書きせず、CSS 変数 `--ml-brand` / `--ml-brand-gradient` / `--ml-brand-soft` / `--el-color-primary*` /
  `--ml-ui-accent` を使う (`acedApplyBrandTheme()` が実行時に定義、example の HTML には Vite プラグイン
  `packages/vite-config/pluginBrandTheme.ts`、デモのトップページには `tools/build-demo.mjs` が書き込む)。
- README は 8 言語 (`README*.md`) あるので、機能追加を書くときは全部更新する。
