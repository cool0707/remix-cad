# RemixCAD

[English](./README.md) | [日本語](./README.ja.md) | [简体中文](./README.zh-CN.md) | [한국어](./README.ko.md) | [Español](./README.es.md) | [Português](./README.pt.md) | [Русский](./README.ru.md) | [Čeština](./README.cs.md)

> **これはフォークです。** RemixCAD は
> [mlightcad/cad-viewer](https://github.com/mlightcad/cad-viewer)（MIT ライセンス）の
> フォークで、独立して開発しています。**フォーク元の作者とは無関係で、フォーク元の
> サポート対象でもありません。** 不具合などはフォーク元ではなく
> [このリポジトリの Issues](https://github.com/cool0707/remix-cad/issues) に
> 報告してください。

ブラウザだけで動作する DXF/DWG ビューア兼エディタです。図面の解析、形状の処理、
描画（Three.js / WebGL）はすべてクライアント側で行うため、図面がサーバーに送信される
ことはありません。

## このフォークでの変更点

- **日本語 UI** — すべてのパッケージ（ビューア、リボン、コマンドライン、ダイアログ、
  プラグイン、差分ビューア、オフライン HTML 書き出し）に `ja` ロケールを追加。
  ブラウザの言語設定から自動で選ばれます。
- **フォントを自前で配信（CAD 用 CDN 不要）** — フォントと図面テンプレートは
  アプリ自身から配信します（`resources/cad-data` → `./cad-data/`）。
  - 図面の文字：**BIZ UD ゴシック／明朝** を同梱し、ＭＳ ゴシック／ＭＳ 明朝の代わりと
    既定の代替フォントに使います。日本語が中国語の字形で表示されることはありません。
  - その他の文字：必要になったときだけ **Google Fonts** から読み込みます
    （Arial → Arimo、SimSun → Noto Serif SC、Malgun Gothic → Noto Sans KR など）。
  - UI の文字：**Noto Sans JP**（`@fontsource-variable/noto-sans-jp` で同梱）。
- **新規図面の名前を日本語化** — 印刷ページのタブはテンプレートの中国語名ではなく
  「キャンバス／印刷ページ1／印刷ページ2」（表示言語に合わせた名前）になります。
- **CAD 未経験者向けの用語** — UI では一般的な言葉を使います: 画層 → レイヤー、ブロック → シンボル、
  ブロック属性 → シンボルのプロパティ、モデル空間 → キャンバス、レイアウト → 印刷ページ、
  ハッチング → 塗りつぶし、外部参照 → リンク図面、クイック選択 → 条件で選択 など。
  ツールチップには CAD 用語を括弧で併記しています（全ロケール）。
- **ツールバーを好きな位置へ** — つまみ（⠿）をドラッグして移動できます。隣の「⋯」メニューで縦置き／横置きの
  切り替えと、元の位置に戻す操作ができます。元の位置は図面エリアの左端で、浮かせたパネル（レイヤーなど）が左端に重なるときは右端です。
  パネルと重なったときは自動で元の位置に戻ります。サブメニューは画面の中心側に開き、位置は記憶されます。
- **操作プロファイル: シンプル (既定) / CAD** — ステータスバーのボタンで切り替えます。
  シンプルでは、クリックで選択を置き換え（Shift + クリックで追加・解除、何もない所をクリックで選択解除）、
  キー 1 つでツールを切り替え（V 選択 / H パン / L 線 / R 矩形 / T 文字、Space を押しながらドラッグでパン）、
  使用中のツールをカーソルの形・カーソル横・ステータスバーに表示、作図のあとは選択ツールに戻り
  （線は 1 本で終わる。環境設定の「作図を続ける」で連続作図）、Esc は段階的に動きます
  （操作の取り消し → 選択ツールに戻る → 選択の解除）。CAD は従来どおりの操作です
  （クリックするたびに追加、線は Enter まで続く）。
- **直接編集（シンプル）** — 選択範囲に枠が付き、四隅のドラッグで拡大縮小（縦横比固定、Alt で中心基準）、四隅の少し外側のドラッグで回転
  （Shift で 15° 刻み）。選択中の図形をドラッグで移動（Alt + ドラッグで複製、Shift で水平・垂直のみ）。つかんだ点はスナップに吸着し、
  スナップしないときは周りの図形の端・中心にそろう整列ガイドが出ます。矢印キーで画面の約 1px 分のきりのよい量だけ移動（Shift で 10 倍）。
  図形をダブルクリックすると CAD のグリップで頂点を編集できます。スナップはステータスバーの ON/OFF ボタン 1 つで、細かい設定は環境設定にあります。
  選択できる図形はカーソルを重ねるとテーマカラーで光ります（シンプル・CAD 共通）。選択中の図形の上ではドラッグで移動できることをカーソルで示します。
- **環境設定** — 「ファイル」→「環境設定」か、言語の選択の隣の歯車（コマンド `OPTIONS` でも可）で開く画面に、
  操作プロファイル・選択方式・作図を続ける・表示（テーマ・リボン・ツールバー・コマンドライン・座標・
  言語の選択・オブジェクト情報・統計）の設定をまとめています。
- **表示倍率** — ステータスバーに今の表示を図面の縮尺の形（`1/100` = 画面の 1 mm が図面の 100 mm。
  図面の単位と 96 px/inch から計算）で表示し、−/+ ボタンとスライダーで拡大・縮小できます。
  クリックすると「全体表示」と 1/1 〜 1/5000 から選べます。
- **プロパティパネル** — 「プロパティ」タブを「一般」「配置」「シンボル」などのグループに分け、
  その場で編集できます（1 回の変更が 1 回の元に戻す）。複数選択時は「選択範囲」に X / Y / 幅 / 高さ
  （9 点の基準点）、種類ごとの件数（クリックでその種類だけを選択）、長さ・面積の合計を表示します。
  値が揃っていない項目は「複数の値」と表示され、まとめて変更できます。シンボルのプロパティ（ブロック属性）も
  同じパネルで編集でき、クリックで置き換える方式ではシンボルのダブルクリックで該当欄に移動します。
- **JWW / JWC（Jw_cad）の読み込み** — サンプルアプリで `.jww` と旧形式の `.jwc` を開けます
  （`@mlightcad/cad-jww-converter`、MIT。解析は [ezjww](https://github.com/monozukuri-ai/ezjww)
  （Rust → WebAssembly）を Web Worker で実行）。座標はレイヤグループの縮尺で図寸から
  実寸 (mm) に変換し、用紙を図面範囲に、レイヤー名を「`グループ-レイヤ 名前`」にします。
- **SXF の読み込み**（国交省・電子納品の CAD データ交換標準）— サンプルアプリで
  `.sfc`・`.p21` と ZIP 版の `.sfz`・`.p2z` を開けます（`@mlightcad/cad-sxf-converter`、
  MIT、TypeScript。[ezsxf](https://github.com/monozukuri-ai/ezsxf) から移植）。
  部分図は主となる部分図の縮尺で実寸表示し、用紙を図面範囲にします。
- **JWW / SXF への書き出し** — ファイル → 書き出し から JWW（Jw_cad）・SXF（SFC）・SXF（P21）に
  保存できます（コマンド `cjww`・`csfc`・`cp21`）。ブロック・寸法・ハッチングは分解して書き出します。
  用紙と縮尺は図面範囲から決め（JWW / SXF から読んだ図面は元の用紙・縮尺のまま）、無ければ
  A3 に収まる最小の標準縮尺を自動で選びます。
  書き出す前に用紙・向き・縮尺を選ぶダイアログが出ます（既定は自動）。DXF への書き出しでは図面範囲として書き込み、
  PDF への書き出しでもキャンバスを用紙サイズに縮尺どおり配置できます。
  「画像に書き出し」も同じ選び方（表示画面・オブジェクト範囲・用紙と縮尺 + 解像度）で、PNG・JPEG・BMP・TIFF を選べます。
  範囲を指定する従来の書き出しは「選択範囲を画像に書き出し」として残しています。
- **縦書き** — 縦書きフォント（`@ＭＳ ゴシック` など。Jw_cad の縦字を含む）の文字と、
  文字スタイルで「縦書き」を指定した TEXT を、同梱の BIZ UD フォントのまま縦に表示します。
  SVG・PDF 出力も縦書きになります（`@mlightcad/cad-vertical-text`）。

## デモ

- オンライン：<https://cool0707.github.io/remix-cad/>
  （`.github/workflows/demo.yml` が `gh-pages` ブランチに公開）
- ローカル：

  ```bash
  pnpm install
  pnpm demo:build   # 全パッケージをビルドして demo-dist/ を作成
  pnpm demo         # http://localhost:4300/
  ```

デモのトップページ（`demo/index.html`）から、フル機能ビューア、シンプルビューア、
差分ビューア、フォント確認用の図面（`resources/cad-data/samples/fonts-sample.dxf`）を
開けます。フル機能ビューアは `?url=<図面>`、`?new=1`、`?lang=ja|en|…` にも対応しています。

## はじめに

### 必要なもの

- [Node.js](https://nodejs.org/) 24 以上
- [pnpm](https://pnpm.io/) 10 以上

### インストール

```bash
git clone https://github.com/cool0707/remix-cad.git
cd remix-cad
pnpm install
```

### 開発

```bash
pnpm dev          # フル機能ビューア（Vue + Element Plus）
pnpm dev:simple   # シンプルビューア（フレームワーク非依存）
pnpm dev:diff     # 図面の比較
```

### ビルドとテスト

```bash
pnpm build
pnpm test
```

## フォントとリソース

実行時にビューアが読み込むものはすべて `resources/cad-data/` にあります
（詳細は [README](./resources/cad-data/README.md)）。

| パス | 内容 |
| --- | --- |
| `fonts/fonts.json` | フォントの一覧（同梱ファイルと Google Fonts の URL） |
| `fonts/*.woff` | BIZ UD ゴシック／Pゴシック／明朝／P明朝（SIL OFL 1.1） |
| `templates/acad*.dxf` | 新規図面のテンプレート |
| `samples/fonts-sample.dxf` | フォント置き換えの確認用図面 |
| `samples/jww-sample.jww` | JWW のサンプル（`tools/make-jww-sample.mjs` で生成） |
| `samples/sxf-sample.*` | SXF のサンプル：`.sfc`・`.p21`・`.sfz`・`.p2z`（`tools/make-sxf-sample.py` で生成） |

サンプルアプリはこのフォルダをビルド出力の隣にコピーします。パッケージを直接組み込む
場合は、`AcApDocManager` に `baseUrl` を渡してください（相対 URL はページを基準に
解決されます）。代替フォントは `defaultFonts` / `symbolFonts` オプションで変更できます。

SHX フォントは同梱していません。SHX を使う文字は BIZ UD ゴシックで表示され、
通知センターに表示されます。

## パッケージ

モノレポの構成はフォーク元と同じです。

| パッケージ | 役割 |
| --- | --- |
| `@mlightcad/cad-simple-viewer` | ビューアの中核（UI フレームワークなし） |
| `@mlightcad/cad-viewer` | リボンやパレットを備えた Vue 3 版のフル機能ビューア |
| `@mlightcad/cad-simple-ui-plugin` | シンプルビューア用のツールバー・レイヤー・レビュー UI |
| `@mlightcad/cad-html-plugin`、`cad-pdf-plugin`、`cad-svg-plugin` | HTML / PDF / SVG 書き出し |
| `@mlightcad/cad-diff-viewer` | 図面の左右比較 |
| `@mlightcad/three-renderer` | Three.js による描画 |
| `@mlightcad/cad-jww-converter` | JWW / JWC（Jw_cad）の読み込みと JWW の書き出し（ezjww、WebAssembly） |
| `@mlightcad/cad-sxf-converter` | SXF（SFC / P21 / SFZ / P2Z）の読み込みと書き出し（TypeScript） |
| `@mlightcad/cad-export-model` | JWW / SXF 書き出し用に図面を 2D の図形と用紙に平坦化 |
| `@mlightcad/cad-vertical-text` | 縦書きの組み方（画面・SVG・PDF で共通） |

パッケージ名はフォーク元の `@mlightcad/` スコープのままです。このフォークは npm には
公開していません。

## DWG 対応

DXF は内蔵の MIT ライセンスのパーサーで読み込みます。DWG は任意で
`@mlightcad/libredwg-converter` を使って読み込めます。これは
[LibreDWG](https://github.com/LibreDWG/libredwg) をもとにしており、ライセンスは
**GPL-3.0** です。サンプルアプリでは明示的に登録しています。組み込んだ製品を配布する
場合は GPL の影響を確認してください。

## JWW / JWC 対応

`@mlightcad/cad-jww-converter` で Jw_cad の図面（`.jww` と旧形式の `.jwc`）を読み込めます。ezjww（MIT）で
Web Worker 内で解析し、DXF に変換してから内蔵の DXF リーダーで読み込みます。
登録したうえで、パッケージの `dist/` にある `jww-parser-worker.js` と `jww-parser.wasm` を
同じ場所に配置してください。

```ts
import { registerJwwConverter } from '@mlightcad/cad-jww-converter'

registerJwwConverter('./assets/jww-parser-worker.js')
```

JWW の座標は図寸（用紙上の mm）で保存されています。既定では主となるレイヤグループ
（要素数が最も多いグループ）の縮尺で全体を拡大するため、見た目は Jw_cad と同じで、
主図面は実寸で計測できます。`scaleMode: 'layer-group'` ではグループごとの縮尺で拡大し
（Jw_cad の DXF 書き出しと同じ）、`scaleMode: 'paper'` では図寸のままにします。
JWC も同じように変換します（JWC にはフォント情報がないため、文字は ＭＳ ゴシック として表示します）。
`^@BM` で配置された画像はラスター画像として表示します。JWW に同梱された画像はそのまま表示し、
外部ファイルを参照している画像は「見つからない画像」として表示されるので、ビューアから画像ファイルを
指定できます。トリミングした画像は、JWW に同梱されていればトリミング範囲だけを表示します
（BMP のほか、JPEG・PNG・GIF などブラウザが読める形式。外部ファイルの画像はトリミング前の全体を表示します）。

## SXF 対応

`@mlightcad/cad-sxf-converter` で SXF Ver.3.1 の図面（SFC `.sfc`、P21 `.p21`（AP202）、
それらの ZIP 版 `.sfz`・`.p2z`）を読み込めます。解析は TypeScript で実装しており
（WebAssembly 不要）、フィーチャの扱いは ezsxf（MIT）から移植しています。図面を線・曲線・
文字・塗りつぶし・ハッチングに展開し、内蔵の DXF リーダーで読み込みます。

```ts
import { registerSxfConverter } from '@mlightcad/cad-sxf-converter'

registerSxfConverter()
```

SXF の座標は図寸（用紙上の mm）で、部分図は縮尺（倍率）付きで配置されます。既定では
主となる部分図の縮尺で全体を拡大するため、見た目は印刷どおりで、主図面は実寸で計測できます。
`scaleMode: 'paper'` では図寸のままにします。円・円弧・楕円は曲線のまま、文字は SXF の
文字枠の大きさに合わせて表示します。ラスター画像（SXF 3.1 の画像属性）は、画像ファイルが
`.sfz`・`.p2z` に同梱されていれば表示します（白黒 TIFF（G4）はブラウザで表示できる形式に変換し、
JPEG はそのまま使います）。`.sfc`・`.p21` 単体では画像の枠を「見つからない画像」として表示します。
属性ファイル（SAF）は読み込みません。

## JWW / SXF への書き出し

まず `@mlightcad/cad-export-model` が図面を実寸 mm の線・円弧／楕円・1 行の文字・点・塗りつぶしに
平坦化し（ブロック・寸法・引出線・スプライン・ハッチングの模様は分解）、用紙と縮尺を決めます。
そのうえで各形式に書き出します。

| 形式 | 書き出し | 内容 |
| --- | --- | --- |
| JWW | `AcDbJwwConverter.exportDatabase()`（ezjww の writer、読み込みと同じ Worker） | 用紙 A0–A4（横）、全レイヤグループに図面の縮尺、`<グループ>-<レイヤ> …` の画層は元のレイヤに戻す、色 → 線色 1–9、線種 → Jw_cad の線種、`@` フォント → 縦字、塗りつぶし → ソリッド |
| SFC / P21 | `exportSxf(db, 'sfc' \| 'p21' \| 'sfz' \| 'p2z')`（TypeScript） | 図面の縮尺の部分図 1 つに配置。既定色＋ユーザ定義色（RGB）、既定線種・線幅。SFC は Shift_JIS、P21 は AP202 の表現グラフ（ezsxf で検証） |

```ts
import { registerJwwConverter } from '@mlightcad/cad-jww-converter'
import { exportSxf } from '@mlightcad/cad-sxf-converter'

const jww = registerJwwConverter('./assets/jww-parser-worker.js')
const { bytes } = await jww.exportDatabase(db, { title: '平面図' })
const sfc = exportSxf(db, 'sfc', { title: '平面図', paper: 'A1', scale: 100 })
```

サンプルアプリは `acapRegisterDrawingExporter()`（`cad-simple-viewer`）で両方を登録しています。
ラスター画像は JWW には同梱して書き出します（SXF にはまだ書き出しません）。DWG への書き出しは未対応です（読み込みに使っている
LibreDWG の npm ビルドは書き込み機能を外してあります）。

## ライセンス

[MIT](./LICENSE)。ライセンスの条件に従い、mlightcad の著作権表示はそのまま残しています。
同梱フォントの BIZ UD フォント（© Morisawa Inc.）と Noto Sans JP は SIL Open Font
License 1.1 です。
