# 引き継ぎ資料 — JWW / SXF 読み込み対応

作成: 2026-10-23 (それまでの作業はクラウド上の Claude セッションで実施)。
リポジトリの基本ルール・コマンドは [`CLAUDE.md`](./CLAUDE.md)。

---

## 1. ここまでに終わっていること

`main` (= `ja-localization`) の上流 `mlightcad/cad-viewer` 1.7.7-preview.1 からの差分コミット:

| コミット | 内容 |
| --- | --- |
| `27f8e77` | 全パッケージの日本語ロケール (`ja`) 追加、フォント同梱 (BIZ UD)、mlight CDN 廃止、新規図面のレイアウト名ローカライズ |
| `457ebf5` | UI フォントを Noto Sans JP に |
| `292a44d` | README 8 言語をフォークとして書き直し、デモページ (`demo/`, GitHub Pages) |
| `f384068` | NURBS 評価の高速化 (canteen.dwg 5.4s → 3.1s) |
| `0564556` | DXF の Shift_JIS 等の自動判定 (コードページ宣言が ANSI_1252 でも化けない) |
| `641b60b` | 初期表示「図面範囲」(モデル = LIMITS、レイアウト = 用紙枠)、TABLES の無い DXF で画層を自動作成 |
| `7bb415d` (PR #1) | **JWW 読み込み** (`packages/cad-jww-converter`)、拡張子判定の一般化 (`AcApDrawingFileTypes`) |
| (このブランチ) | JWW 文字サイズ補正、**JWC**、**SXF (SFC / P21 / SFZ / P2Z)** (`packages/cad-sxf-converter`) |

デモ: <https://cool0707.github.io/remix-cad/> (`?url=` `?new=1` `?lang=` `?view=extents|saved|limits` が使える)

### 既存パッチ (`patches/`)

| パッケージ | 目的 |
| --- | --- |
| `@mlightcad/data-model@1.15.14` | ① `lib/base/AcDbDxfPairReader.js`: 文字コード自動判定 (`acdbGuessLegacyEncoding`)、② `lib/dxf/AcDbDxfHeaderReader.js`: `$LIMMIN/$LIMMAX/$PLIMMIN/$PLIMMAX` を `db.limmin` 等に格納 (+ `.d.ts`)、③ `lib/dxf/AcDbNativeDxfConverter.js`: 読み込み直後に画層 0 と参照画層を作成 (`acdbEnsureReferencedLayers`)、④ `lib/entity/AcDbRasterImage.js` + `dist/data-model.cjs`: `boundaryPath()` の回転の中心が右下の角になっていた・負の角度を無視していたのを、挿入点 (左下) 中心・0 以外すべてに修正 |
| `@mlightcad/libredwg-converter@3.15.14` | DWG ヘッダーの LIMMIN 等を `db` に格納 |
| `@mlightcad/geometry-engine@3.15.14` | NURBS 評価の高速パス |
| `@mlightcad/mtext-renderer@0.13.5` | `fonts.json` の絶対 URL (Google Fonts) を許可 |
| `@mlightcad/ui-components@0.1.11` | `useBoundingRect` (`dist/*.js` と `src/`): 左右にドッキングしたパレットを、ウィンドウのリサイズ時と折りたたみ/展開時に端から位置を計算し直す。元はリサイズ時に幅の差分を足していたので、ビューア側の再配置と合わせて 2 倍ずれていた。折りたたみ中にタイトルバーを押すと記憶位置が折りたたみ位置で上書きされ、展開すると右にはみ出していた |
| `ezjww@0.7.3` | npm 版は Node 専用 (読み込み時に `fs` で wasm を読む)。`initSync` / `initAsync` を追加し、wasm を後から渡せるようにした (`exports` に wasm パスも追加) |

注意: `lib/dxf/AcDbNativeDxfConverter.js` は末尾に改行が無く、そのまま `pnpm patch-commit` すると最終行 (`}`) が落ちたパッチになりビルドが壊れる。
編集ディレクトリでこのファイルの末尾に改行を足してから commit すること。

---

## 2. JWW / JWC / SXF (済)

### 2.0 JWW でやったこと (2026-10-23)

- `packages/cad-jww-converter` (MIT): `AcDbJwwConverter` (Worker で ezjww → `convertJwwToDxf()` で DXF 文字列 → 登録済み DXF コンバーターで読み込み = パターン A)。
  example の `main.ts` で `registerJwwConverter('./assets/jww-parser-worker.js')`。
  配布物は `dist/jww-parser-worker.js` + `dist/jww-parser.wasm` (約 1MB)。example の `vite.config.ts` と `tools/copy-workers.mjs` でコピー。
- ezjww の DXF 出力をそのまま使わず、`readDxfDocument` (構造化) + `readDocument` (フォント名・レイヤグループ) から **自前で DXF を書いている** (`src/jwwToDxf.ts`)。理由:
  - JWW の座標は **図寸 (用紙 mm、用紙中心が原点)**。ezjww は縮尺を掛けないので計測値が図寸になる → 主レイヤグループ (要素数最多) の縮尺で一律に実寸化 (`scaleMode: 'drawing'`、既定)。グループ別 (`'layer-group'`、Jw_cad の DXF 出力相当) と図寸 (`'paper'`) も選べる。グループ別を既定にしないのは、1/1 の図枠グループと 1/100 の平面図グループが混在するとき図枠が極小になるため。
  - 用紙サイズ (`paper_size`: 0–4 = A0–A4、8–11 = 2A–5A、12–14 = 10m/50m/100m) → `$LIMMIN/$LIMMAX` (原点中心、主縮尺倍)。
  - 画層名を `<グループ>-<レイヤ> <グループ名> - <レイヤ名>` (16 進、Jw_cad と同じ) にし、使われている画層だけ作る。ezjww の画層名 → (グループ, レイヤ) は ezjww の `layer_name_map` を移植した `ezjwwLayerNames()` で逆引き。
  - 文字のフォント (ＭＳ ゴシック等) ごとに文字スタイルを作る (ezjww の DXF は全部 STANDARD)。
  - **文字高さの補正**: mtext-renderer は TrueType を「DXF の文字高さ = 英大文字 A の高さ」(`unitsPerEm / A.yMax` 倍) で描く。Jw_cad の文字サイズは全角の文字枠 (em) の高さなので、そのままだと BIZ UD で 1.27 倍 (明朝 1.29 倍) になり枠からはみ出す。高さに `A.yMax / em` (ゴシック 1617/2048、明朝 1587/2048) を掛け、基点も descender (246/2048) 分上げて文字枠の下端に合わせている (`jwwTextFontMetrics()`)。同梱フォントを差し替えたらこの値も更新すること。DXF/DWG は AutoCAD 互換の挙動なので触っていない。
  - 線種パターンは図寸 mm なので、要素の線種尺度 (48) に縮尺を入れる。
- 拡張子判定: `cad-simple-viewer/src/app/AcApDrawingFileTypes.ts` (`acapDrawingFileTypes()` など。DWG/DXF + `AcDbDatabaseConverterManager` に登録済みの形式)。`AcApDocument.openDocument`、ファイル選択パネル (タグ表示も)、ローカル/URL データソース、マークアップ/計測サイドカー名、example の `FileUpload.vue` が使う。`AcDbDatabase.openUri()` は元から未知の拡張子を converter type として渡すので変更不要。
- サンプル: `resources/cad-data/samples/jww-sample.jww` (`node tools/make-jww-sample.mjs` で ezjww の writer から生成、自作なのでライセンス問題なし)。テスト: `packages/cad-jww-converter/__tests__`、`cad-simple-viewer/__tests__/AcApDrawingFileTypes.spec.ts`、e2e `cad-viewer-example/e2e/tests/jww.spec.ts`。
- ezjww リポジトリの `jww_samples/` (実際の Jw_cad 図面: マンション平面例、木造平面例など) でもブラウザ表示を確認済み (リポジトリには入れていない)。
- 注意: Jest は data-model の CJS ビルドを読むので、data-model パッチ (`$LIMMIN` 読み込みなど) は Jest では効かない。`db.limmin` はブラウザでしか確認できない。
- **JWC (旧形式)** も同じコンバーターで読む (`jwc` にも登録)。`readJwcDocument` のヘッダー (レイヤグループ・縮尺・用紙 A0–A4) を JWW と同じ形 (`JwSource`) に正規化し、`readDxfDocument(…, { jwcCoordinates: 'paper_millimeters' })` (用紙中心原点の図寸 mm) を同じ writer に通す。JWC にはフォントが無いので ＭＳ ゴシック 扱い。ezjww が受け付ける JWC は 2 種類の固定ヘッダー形式だけで、それ以外はエラー。テスト用 JWC は ezjww の MIT サンプル (`packages/cad-jww-converter/__tests__/fixtures/`)。縮尺のテストはオフセット 1797 の f32 を書き換えて作っている。
- **画像 (`^@BM`)**: 文字要素 `^@BM<パス>,<幅>,<高さ>[,…]` を DXF の `IMAGE` (+ OBJECTS の `IMAGEDEF`) にする (`src/jwwImage.ts`、`writeImage()`)。
  左下 = 文字の始点、幅 × 高さは図寸 mm、回転は文字の角度。画素数は 1 × 1 として U / V ベクトルに全体の大きさを入れている。
  同梱画像 (`%temp%<名前>`) は ezjww の `readDocument().images` (base64、`compressed` なら gzip → fflate で展開) を
  `JwwConversionResult.images` で返し、DXF 読み込み後に `attachJwwImages()` が `AcDbRasterImage.image` に Blob を入れる。
  外部パスの画像は Blob 無しのまま = 既存の「見つからない画像」(ステータスバー・リソースパレット) に出るので、ユーザーがファイルを指定できる。
  ezjww の writer は `.gz` 名の同梱画像を `%temp%<.gz を除いた名前>` で参照する。サンプル JWW には gzip 同梱の BMP を 1 枚入れた。
  追加パラメータ `,<左>,<下>,<幅の比>,<?>,<R>,<G>,<B>` (既定 `0,0,1,0,255,255,255`) の先頭 3 つはトリミング。
  Jw_cad で実際にトリミングした図面とスクリーンショットから解析した (例: 100×66.6667 の画像 →
  `64.2072,29.8105,0.154785,0.196061,0.642072,…`): <左>・<下> はトリミング範囲の左下の角の、元画像の左下からの位置、
  <幅の比> はトリミング後の幅 (= 1 番目の幅) ÷ 元画像の幅。**3 つとも元画像の「幅」に対する比** (下も高さではなく幅で割る)。
  文字の基点はトリミング範囲の左下に移る (画像は動かない)。
  同梱 BMP はそのピクセルを切り出して別の同梱画像 `<名前>~trimN.bmp` (24bit BMP) にし、その IMAGEDEF を参照させる
  (`JwwDxfWriter.imagePath()`、`jwwTrimPixelRect()`・`cropBmp()`)。画面・SVG・PDF のどれでも同じに出るよう、
  DXF の IMAGE クリップ境界ではなく画像自体を切っている (data-model / AcTrImage のクリップ処理は UV が境界の外接矩形基準で使えない)。
  BMP 以外 (Jw_cad の画像拡張で同梱される JPEG・PNG・GIF など) は wasm Worker の同期変換では切れないので、
  `convertJwwToDxf()` は `imageCrops` に積むだけにして、`cropJwwImages()` (Worker / main thread 両方で変換直後に呼ぶ) が
  `createImageBitmap` + `OffscreenCanvas` で切り出す (JPEG は JPEG、他は PNG。名前は `<名前>~trimN.jpg|png`)。
  ピクセル数はデコード後に分かるので、範囲の計算もそこで行う。Node (テスト) など切り出せない環境では元画像全体 + 警告。
  外部参照の画像は警告を出して画像全体を表示。
  4 番目以降 (`0,255,255,255`、回転・透過色らしい) が既定と違うときは警告だけ出して無視する。
  回転した画像は元々正しく描けていなかったので、data-model パッチ④と `three-renderer/src/object/AcTrImage.ts` の UV (画像の軸に沿って計算) も直した。SVG / PDF 書き出しの回転画像は未確認。
- 未対応: JWS、外部参照画像のトリミング、Worker 無しの main thread モードはテストのみで使用 (`wasmUrl` 指定で動く)。外部参照 (XATTACH) は DWG/DXF のまま。

以下は着手前の調査メモ (JWW 部分は上記で対応済み)。

### 2.0.1 縦書き (2026-10-24)

同梱の BIZ UD には縦書き用の `@` フォントが無いので、`@` フォントのまま描くと横書きの回転になってしまう。
そこで **描画側で縦に組む** ようにした。組み方は `packages/cad-vertical-text` (依存なし) にまとめ、画面 (three-renderer の `AcTrVerticalTextLayout`、`AcTrMText` から使う)・SVG・PDF で共有している。

- 対象: ① フォント名 (`font` / `extendedFont`) が `@` で始まる文字 (TEXT・MTEXT。Jw_cad 縦字、AutoCAD の `@ＭＳ ゴシック` など)、
  ② 文字スタイルの「縦書き」フラグ (グループ 70 の bit 4) が立った TEXT / ATTRIB。AutoCAD と同じく MTEXT には効かない
  (TEXT は描画方向 `BOTTOM_TO_TOP` で来るので、それで見分けている)。文字スタイルダイアログの「縦書き」も ② になる。
- 方法: 文字ごと (横向きのままにする部分は連続した塊ごと) に mtext-renderer で原点に描き、測った幅を使って縦の列に並べ直し、1 つのオブジェクトにまとめる。フォントは `@` を外して解決する。
  - `@` フォント: Windows / AutoCAD と同じ。文字の回転方向 (縦字なら 270°) に並べ、全角文字を 90° 起こす。半角は横倒しのまま。列はベースラインから em 枠の中心 (0.38 em) ずれる。幅係数は列方向にかかる。
  - 縦書きスタイル: 挿入点を通る線を中心に全文字を立てて積む (半角も 1 em)。左揃え = 列の上端、中央・中心 = 列の中央、右揃え = 下端。
  - 共通: 「ー」「～」「…」・括弧類は横倒し、「、」「。」は右上、小書きの仮名は少し右上へ。MTEXT の書式コードは外して素の文字列で描く (文字ごとの色・高さ変更は無視)。
- JWW: 縦字 (`@` フォント) の回転角は文字の角度ではなく **始点 → 終点の向き** にする (`jwwTextRotation()`)。サンプル JWW に縦字「収納（押入れ）」を追加。
- SVG 出力の既存不具合を修正 (2026-10-24): TEXT の描画方向 `BOTTOM_TO_TOP` を縦書き (下から上) として扱っていたため、普通の TEXT まで縦に並んでいた。mtext-renderer と同じく横書きとして扱う。回転も逆向き (`rotate(-θ)`、文書全体が Y 反転しているので正しくは `+θ`) で、範囲計算は回転を無視していたので併せて修正。
- `cad-vertical-text` の使い方: `VerticalTextLayout` が文字を「ピース」(立てる 1 文字か、横倒しのままの塊) に分け、描画側が各ピースを原点に横書きで描いて送り幅を返すと、`place()` が各ピースを縦の列へ動かす行列 (`[a,b,c,d,e,f]`、SVG `matrix()` / PDF `cm` と同じ) を返す。使う側には通常の `dependencies` として入れているので、各パッケージのビルドに同梱される (アプリ側の設定は不要)。Jest は `jest.config.ts` の `moduleNameMapper` で src を読むが、ts-jest の型チェックは `lib/` を見るので、先に `cad-vertical-text` をビルドしておくこと。
- SVG 出力 (`cad-svg-plugin`): 縦書きは 1 ピース = 1 つの `<text>` に `matrix()` を付けて出す。SVG は文字幅を推定 (半角 0.6、全角 1) しているので、立てる文字は `text-anchor="middle"` で閲覧側に中央揃えさせる。書式コードは外す。
- PDF 出力: ベクターモードは `cad-pdf-plugin` のグリフ生成器が画面と同じ `AcTrVerticalTextLayout` を使うので画面と一致する。テキストモード (検索可) は `pdf-renderer` が 1 ピース = 1 つの文字列として位置・角度・横倍率付きで書く (PDF の縦書きモード Identity-V / WMode 1 は使っていない。pdf-lib が非対応)。検索・コピーはできるが、コピーした文字列はビューアによって 1 文字ずつ改行される。
- **PDF テキストモードで一部の文字が描かれない不具合 (修正済み)**: 「居間・食堂」が「居間」だけになるなど。原因は pdf-lib が使う `@pdf-lib/fontkit` のサブセット化 (TTFSubset) で、グリフのバイト列をそのままコピーし、小さいサブセットでは short 形式の `loca` (オフセット ÷ 2) を書く。BIZ UD は奇数長のグリフを持つ (long `loca` なら合法) ため、最初の奇数長グリフ以降のオフセットがずれて字形が壊れていた。`AcPdfFontManager` の `decodeFontProgram` で WOFF / TTF を読むときに全グリフを 4 バイト境界にパディングし `loca` を long で書き直して回避 (`__tests__/AcPdfFontSubset.spec.ts`)。`pdffonts` の `sub no` は pdf-lib がサブセット名に `ABCDEF+` を付けないだけで、実際はサブセット埋め込み。
- SVG の SHX 以外のフォントは閲覧側のフォントで描かれる (縦書き以前からの仕様)。SXF の縦書き (DOWN / 方向 2) は従来どおり 90° 回転で代用。Jw_cad 縦字の文字幅・高さの向き (`size_x` / `size_y`) と終点の扱いは実図面で未確認。

### 2.1 ビューア側の差し込み口 (調査済み)

形式ごとの読み込みは `AcDbDatabaseConverter` (data-model) を継承したコンバーターを
`AcDbDatabaseConverterManager.instance.register(fileType, converter)` で登録する仕組み。
DWG はこの方式で example 側から opt-in 登録している (`packages/cad-viewer-example/src/registerLibreDwg.ts`)。

ただし **拡張子 → 形式の判定が dwg / dxf の 2 択でハードコードされている箇所がある**ので、そこを直す必要がある:

| 場所 | 現状 | 対応 |
| --- | --- | --- |
| `packages/cad-simple-viewer/src/app/AcApDocument.ts` `openDocument()` | `fileExtension == 'dwg' ? DWG : DXF` | 拡張子をそのまま converter type として使い、未登録なら DXF にフォールバック |
| data-model `AcDbDatabase.openUri()` (`lib/database/AcDbDatabase.js` 2350 行付近) | `dwg` / `dxf` 以外は読まない | data-model パッチで一般化する。または `AcApDocument.openUri()` 側で fetch してから `database.read(buf, opts, type)` を呼ぶ |
| `packages/cad-viewer-example/src/components/FileUpload.vue` | `validExtensions = ['.dwg', '.dxf']` | 追加 (`useFileTypes()` で登録済み形式から生成するのが理想) |
| `packages/cad-simple-viewer/src/ui/AcUiFileOpenPanel.ts` | `SUPPORTED_EXTENSIONS` | 同上 |
| `packages/cad-simple-viewer/src/app/dataSource/AcApLocalDataSource.ts` | `SUPPORTED_EXTENSIONS` | 同上 |
| `packages/cad-simple-viewer/src/app/dataSource/AcApUrlDataSource.ts` | `/\.(dwg|dxf)$/i` | 同上 |
| `packages/cad-viewer/src/composable/useFileTypes.ts` | 登録済み形式の Set を返す | 受け入れ拡張子の元データとして使える |
| `packages/cad-viewer/.../MlExternalReferences.vue` | 外部参照は `.dwg,.dxf` | 当面対象外で良い |

i18n: ファイル選択画面などの「DWG / DXF」表記 (`packages/cad-simple-viewer/src/i18n/*/main.ts` など) も全ロケールで更新する。

コンバーターの実装パターン:

- **A. DXF 経由 (最短)**: 外部ライブラリで JWW → DXF 文字列に変換し、既存の `AcDbNativeDxfConverter` に渡す。
  ```ts
  class AcDbJwwConverter extends AcDbDatabaseConverter {
    async read(data: ArrayBuffer, db: AcDbDatabase, options?: AcDbDatabaseConverterReadOptions) {
      const dxf = readDxfString(new Uint8Array(data), { targetVersion: 'AC1024' }) // AC1024 = UTF-8
      const bytes = new TextEncoder().encode(dxf)
      const dxfConverter = AcDbDatabaseConverterManager.instance.get(AcDbFileType.DXF)!
      await dxfConverter.read(bytes.buffer, db, { ...options, encoding: 'utf-8' })
    }
  }
  ```
  変換コストが 2 回かかるが、画層・ブロック・寸法などの扱いを既存 DXF パスに任せられる。まずこれで動かすのを推奨。
- **B. 直接変換**: パース結果から `AcDbLine` 等を直接 `db` に追加する (libredwg-converter の `processLayers` / `processEntities` 構成が参考)。性能・忠実度は上がるが工数大。A で足りない所だけ B に寄せる。

配置案: `packages/cad-jww-converter` / `packages/cad-sxf-converter` を新設し、example の `main.ts` で `registerLibreDwg` と同様に登録。wasm を使う場合は `tools/worker-assets.mjs` と example の `vite.config.ts` (`viteStaticCopy`) に配布ファイルを追加する (LibreDWG の wasm がそのやり方)。

### 2.2 JWW (Jw_cad)

候補ライブラリ: **ezjww** (npm `ezjww` 0.7.3, MIT, Rust → WebAssembly)。リポジトリ <https://github.com/monozukuri-ai/ezjww>

- `detectFileFormat` (`jww` / `jwc` / `jws`)、`readDocument` (ヘッダー + エンティティ)、`readDxfString` / `readDxfDocument` (DXF 変換) がある。JWC (旧形式) も一部読める。
- 型定義から分かる情報: ヘッダーに `version`, `paper_size`, `layer_groups[16]` (各 `scale`, `name`, `layers[16]`)、ペン色・線種 (SXF 線種含む)。エンティティは `LINE` / 円弧 (`center`, `radius`, `start_angle`, `arc_angle`, `flatness`, `tilt_angle` → 楕円弧) / 点 / 文字 (`font_name`, `size_x/y`, `spacing`, `angle`) / 寸法 / ソリッド / ブロック。
- **注意: npm 版は Node 専用ビルド**。`wasm/ezjww_wasm.js` が `require('fs').readFileSync` で wasm を読む (wasm-pack の nodejs ターゲット)。ブラウザで使うには
  1. リポジトリをクローンして `wasm-pack build --target web` で web 版をビルド (README に `packages/ezjww/examples/browser` がある)、または
  2. npm 版の glue を pnpm patch して `fetch` + `WebAssembly.instantiate` に差し替える、
  のどちらか。wasm は約 1MB なので Worker で読むのが望ましい。
- JWW 固有で確認すべき点:
  - 座標単位と縮尺: レイヤグループごとに縮尺がある。ezjww は JWC のみ `jwcCoordinates` (用紙 mm / 実寸 mm) を持つので、JWW は実寸 mm で入っていると思われるが要確認。
  - 用紙サイズ (`paper_size`) → 「図面範囲」表示 (`$LIMMIN/$LIMMAX` もしくはペーパーレイアウト) に反映すると、今回入れた初期表示「図面範囲」がそのまま効く。
  - レイヤ名: 16 グループ × 16 レイヤ。DXF 画層名を `グループ名-レイヤ名` などにする規則を決める (名前が空のときは `0-0` 形式など)。
  - 色: Jw_cad のペン番号 1–9 と SXF 拡張色 → ACI / TrueColor 対応表が必要。
  - 文字: 新しい版は UTF-16、古い版は CP932。フォント名 (ＭＳ ゴシック等) は既存の `fonts.json` エイリアスで BIZ UD に置き換わる。
- 自前実装する場合: Jw_cad 本体に同梱/公開されているフォーマット資料 (JWW は MFC `CArchive` のシリアライズ形式、先頭シグネチャ `JwwData.`) を参照。LibreCAD にも JWW 読み込み (jwwlib) があるが **GPL なのでコードは流用しない**。

### 2.3 SXF (P21 / SFC / P2Z / SFZ)

**実装済み (2026-10-23)** — `packages/cad-sxf-converter` (MIT、TypeScript のみ、wasm・Worker なし、ZIP は fflate)。

- ezsxf (MIT) のうち、仕様の実装部分を TS に移植した: `features.rs` (各 feature の引数位置)、`document.rs` (コード表の採番と、
  「部品は定義 (sfig_org / composite_curve_org / drawing_sheet) より前に並ぶ」階層規則)、`_drawing_*.py` (スタイル解決・複合図形の展開・
  寸法・ハッチ)、`_p21_drawing.py` (AP202 の表現グラフ)。ezsxf の DXF 出力は全部ポリライン化するので、出力側 (`sxfToDxf.ts`) は自前:
  - 円・円弧・楕円は共役半径 (u, v) で持ち、DXF では主軸に直して CIRCLE / ARC / ELLIPSE にする (非等倍の配置でも正確)。
  - 縮尺: 図寸 (用紙 mm) で展開し、各プリミティブに配置倍率を持たせ、最も多いものを主縮尺として全体を拡大 (`scaleMode: 'drawing'`、JWW と同じ考え方)。
  - 文字: SXF の高さ・幅は文字枠 (幅は文字列全体)。JWW と同じ BIZ UD の補正 (高さ × A の高さ/em、基点を descender 分上げる) と、枠幅に合う幅係数。基点 1–9 は自前で左下ベースラインに換算 (DXF の 72/73 配置には頼らない)。
  - 黒・白は ACI 7 (背景に応じて反転)。それ以外は 420 の True Color。
  - DXF 読み込み側 (data-model) は `100 AcDbCircle` などのサブクラスマーカーが無いと `100 AcDbEntity` 以降の値を読まない。エンティティには必ず正しいマーカーを書く。
- ezsxf と意図的に変えた点: 部分図 (sfig 種別 1・2、P21 の `$$SXF_FM_` / `$$SXF_FG_`) の配置では子要素の画層を上書きしない (ezsxf は配置画層が 0 以外なら上書き。ezsxf の writer は配置に画層 1 を付けるので、そのままだと平面図の画層がすべて図枠画層になる)。
- サンプル: `tools/make-sxf-sample.py` (ezsxf の作成 API、`pip install ezsxf==0.3.4`) で `sxf-sample.sfc/.p21/.sfz/.p2z` を生成。SFC 版と P21 版が同じ図形になることをテストで確認している。
- ezsxf リポジトリの `data/D0LS004Z*` (ABC-CAD 出力の実データ、配布条件不明なのでコミットしない) で SFC / P21 とも同じ結果になり、ezsxf のプロットとも一致することを確認済み。P21 1.4MB の変換は約 0.3 秒 (初回は JIT で約 1 秒)。
- **ラスター画像** (SXF 3.1 共通の画像属性): 名前が `$$ATRU$$<ID>$$<図形名>$$画像$$<ファイル名>[$$STR]` (P21 は先頭に `$$SXF_G_`) の
  複合図形 (種別 3) が矩形ポリライン 1 本を包んでいる。矩形は左下から時計回り (左下・左上・右上・右下)。
  SFC は `renderPlacement`、P21 は `renderMappedItem` で、その中身を描く代わりに `SxfImage` (原点・U・V) にする (`sxfImageFromPaths()`)。
  DXF では IMAGE / IMAGEDEF (線や文字より先に書くので下に描かれる)。画像本体は SFZ / P2Z に同梱されたファイルをファイル名 (大文字小文字無視) で探す。
  SXF の画像は白黒 TIFF (G4) か JPEG。ブラウザは TIFF を表示できないので utif2 (MIT) でデコードして BMP にする (`src/image.ts`):
  1bit はそのまま 1bit BMP、長辺 4096px を超えるとき (A1 400dpi のスキャンは約 13000 × 9000) は縮小して 8bit グレーにする。
  `.sfc` / `.p21` 単体では画像は「見つからない画像」になる。ただしユーザーが TIFF を指定してもビューア側は TIFF を表示できない (未対応)。
  サンプル (`tools/make-sxf-sample.py`) に 640 × 480 の G4 TIFF (案内図) を追加。生成には Pillow (libtiff 付き) が要る。SFZ / P2Z だけが TIFF を含む。
- 未対応: 縦書き (90° 回転で代用)、矢印種別 (すべて開き矢印)、外部定義ハッチ・タイルハッチ (境界のみ)、外部定義シンボル (点)、SAF 属性 (SAF 経由 = ATRF の画像も)、背景色属性。

以下は着手前の調査メモ。

SXF は国交省・JACIC (現 OCF) の CAD データ交換標準。電子納品で使われる。

- **SFC**: SXF 独自のテキスト形式 (フィーチャコメント)。Shift_JIS。TS で自前パーサーを書く現実的な対象。
- **P21**: ISO 10303-21 (STEP) 形式 (AP202 ベース)。文字列は `\X2\...\X0\` (UTF-16 16進) エスケープなどがある。
- **P2Z / SFZ**: それぞれ P21 / SFC を ZIP 圧縮したもの (属性ファイル SAF や画像が同梱されることも)。展開には fflate 等の MIT ライブラリ。
- 参考実装: **ezsxf** (PyPI, MIT, Rust + PyO3) <https://github.com/monozukuri-ai/ezsxf> — SXF Ver.3.1 の 34 フィーチャ全種をパースし DXF 変換もできると説明されている。npm/wasm 版は無いので、Rust 部分を wasm-bindgen でビルドするか、構造を参考に TS で書く。
- SXF 固有で確認すべき点:
  - 用紙 (sheet フィーチャ: A0–A4 等、縦横) → ペーパーレイアウト / 図面範囲。
  - レイヤ、既定色 16 色 + ユーザー定義色、既定線種・線幅 → DXF 画層・線種・線の太さ。
  - 複合図形 (定義と配置) → ブロック定義 / INSERT。
  - 寸法・引出線・バルーン・ハッチング・塗り・クロソイド・スプライン。
  - 仕様書本体は OCF (旧 JACIC) が公開している「SXF 仕様書」。版 (Ver.2.0 / 3.0 / 3.1) の差に注意。

### 2.4 進め方の提案

1. ~~拡張子判定の一般化~~ (済)
2. ~~JWW~~ (済。2.0 参照)
3. ~~SFC~~ (済。2.3 参照)
4. ~~P21 / P2Z / SFZ~~ (済)
5. ~~サンプル・デモ・README~~ (済)

---

## 2.5 JWW / SXF への書き出し (2026-10-24)

構成: `packages/cad-export-model` (MIT、data-model のみ依存) が図面を **形式に依存しない 2D モデル** (`ExportDrawing`:
実寸 mm の polyline / curve (共役半径の楕円弧) / 1 行文字 / 点 / 塗りつぶし / 画像 + 画層 + 用紙 `ExportSheet`) に平坦化し、
各コンバーターがそれを書く。

- 平坦化 (`collectExportDrawing`): LINE / ARC / CIRCLE / ELLIPSE / LWPOLYLINE (bulge → 円弧) / TEXT / MTEXT (行に分割、位置は文字セルで推定) /
  POINT / SOLID / INSERT (展開。画層 0 は INSERT の画層、ByBlock 色・線種を継承) / RASTER IMAGE は直接変換。
  それ以外 (寸法・引出線・スプライン・ハッチング・表など) は `AcExRecordingRenderer` (AcGiRenderer の記録版) で `worldDraw` の出力を取る。
  ハッチング模様は画面のシェーダーと同じ規則で線分に切り出す (`hatchPatternSegments`、20 万本超は境界のみ)。
  `AcDbRenderingCache` は前後で clear する (記録物をビューアに使わせない)。非表示画層の「記録」経由の要素は worldDraw が描かないので落ちる。
- 用紙 (`chooseSheet`): `$LIMMIN/$LIMMAX` が A0–A4 × 縮尺ちょうどならそれ (JWW / SXF から読んだ図面は往復で一致)。
  A2 と A4 は比が同じなので標準縮尺 → 小さい用紙を優先。無ければ A3 (縦長なら縦) に 85% で収まる最小の標準縮尺、図面中心に配置。
  Jest は data-model の CJS ビルドでパッチが効かず limits が読めないので、テストでは `db.limmin` を直接入れている。
- 文字: DXF の高さ (英大文字の高さ) ↔ Jw_cad / SXF の文字枠 (em) を読み込みと同じ BIZ UD の値 (`cellFontMetrics`) で逆変換。
  JWW・SXF とも往復で位置・高さ・幅係数が一致する (テスト済み)。
- **JWW** (`cad-jww-converter/src/jwwExport.ts`、ezjww の `toJwwBytes`): 読み込みと同じ Worker で書く (`AcDbJwwConverter.exportDatabase()` / `writeJww()`)。
  用紙 A0–A4 横のみ、全レイヤグループに同じ縮尺、座標は用紙中心原点の図寸。`<g>-<l> グループ名 - レイヤ名` の画層は元の位置へ、他は順に詰める。
  色 → 既定パレットで最も近い線色 1–9 (黒白 = 2、`colorMode: 'exact'` で SXF 拡張色)、線種は `JWW_*` 名はそのまま・他はパターンの形で 1–9、
  `@` フォント → 縦字 (角度 = 文字列方向 + 90°)、塗りつぶし → 三角形分割したソリッド (色は COLORREF で正確)、画像 → `^@BM%temp%名前` + gzip 同梱。
- **SXF** (`cad-sxf-converter/src/sxfExport.ts`、`exportSxf(db, 'sfc'|'p21'|'sfz'|'p2z')`): 要素は図面縮尺の部分図 1 つ (sfig_org 種別 1) に実寸で入れ、
  sfig_locate で用紙に置く。色は既定 16 色 or ユーザ定義 RGB、線種・線幅は既定のみ (形で分類)。SFC は Shift_JIS (`shiftJis.ts`、TextDecoder から表を作る)。
  **SFC の階層規則: composite_curve はその直前の定義以降の要素を全部部品にする** ので、塗りつぶし境界 + composite は要素の先頭にまとめて出す。
  P21 は ezsxf `p21_writer.rs` の AP202 グラフを移植。ezsxf (Python) の strict パースで警告なし、ezsxf が同じ SFC から作る P21 と数値の最下位桁以外一致。
  画像は未対応 (SFZ / P2Z に TIFF / JPEG を同梱し、属性付き複合図形を書く必要がある)。
- UI: `cad-simple-viewer` の `acapRegisterDrawingExporter()` に登録すると、コマンド (`cjww` / `csfc` / `cp21`) とファイル → 書き出しのメニュー項目
  (`main.mainMenu.exportAs`) ができる。example は `src/registerExporters.ts` で登録。警告は詳細をコンソール、通知は i18n の定型文。
- テスト: `cad-export-model/__tests__`、`cad-jww-converter/__tests__/jwwExport.spec.ts`、`cad-sxf-converter/__tests__/sxfExport.spec.ts`、e2e `export.spec.ts`。
  e2e をこの環境で回すときは channel を外し `launchOptions.executablePath` を `/opt/pw-browsers/chromium-*/chrome-linux64/chrome` にした一時設定を使った。
- 用紙・縮尺ダイアログ (2026-10-25): DXF / JWW / SFC / P21 の書き出し前に `MlExportDrawingDlg` が開く。
  cad-simple-viewer の `acapSetExportSheetPrompt()` に cad-viewer がダイアログを差し込み、コマンド (`cdxf` / `cjww` …) は
  `acapPromptExportSheet()` で聞く (差し込みが無ければ自動)。入力部品 `MlExportSheetFields` (用紙・向き・縮尺、1:N は自由入力可、
  選んだ結果を「書き出す用紙: A3 横 1:100」と表示) は PDF ダイアログの 3 枚目のカード「用紙と縮尺」でも使う。
  用紙の決め方は全形式で `acapResolveDrawingSheet()` / `chooseSheet()` (図面範囲 → 無ければ A3 に収まる最小の標準縮尺)。
  DXF: すべて自動なら今までどおり、指定があれば `$LIMMIN/$LIMMAX` を HEADER に書き込む (`acapSetDxfLimits`、dxfOut は書かない)。
  PDF: モデルのページを用紙サイズにし、用紙の範囲を `fitBox`、`pagePadding: 0` で縮尺どおり (pdf-renderer に `pagePadding` を追加。
  印刷ページのページには用紙指定を適用しない)。`-cpdf` のコマンドライン版には未追加。
  e2e で PDF を試すと、開発サーバーが初回に pdf-lib を最適化してページを再読み込みする (example の `optimizeDeps.include` の
  pdf-lib が解決できていない既存の問題) ので、PDF の e2e は入れていない。
- 画像に書き出し (2026-10-25): `cimage` → `MlExportImageDlg`。キャンバスの選び方は PDF と同じ 3 択 (表示画面・オブジェクト範囲・用紙と縮尺、
  カードは共通部品 `MlChoiceCards` + `exportCanvas.ts`、PDF ダイアログもこれに置き換え)、形式 PNG / JPEG / BMP / TIFF (TIFF は `acapEncodeTiff` の自前実装: 24bit RGB・PackBits・解像度タグに dpi)、
  長辺 px (用紙と縮尺のときは解像度 dpi から計算)。描画は既存の `AcApRasterImageConvertor` (画面の背景色のまま)。
  長辺は GPU のテクスチャ上限と 8192 px の小さい方で頭打ち (`AcApRasterImageConvertor.maxLongSide()`、ダイアログに表示)。
  範囲を 2 点で指定する従来の `pngout` はメニュー「選択範囲を画像に書き出し」として残した。
- 未対応・やり残し: ブロックを JWW / SXF のブロック・複合図形として残す、
  寸法を寸法要素として残す、SXF の画像、Jw_cad 実機での確認 (Wine / Windows)。
- **DWG 書き出し — 方針 (2026-10-24 決定)**: CADcraft の DWG 対応がまともになったら、それを取り込む (ライセンスは MPL-2.0)。
  MPL-2.0 はファイル単位のコピーレフトなので MIT の本体と組み合わせてよいが、取り込んだファイルは MPL-2.0 のまま
  (ライセンス表記を残す・そのファイルを改変したら改変後のソースを公開する) にし、自前コードと混ぜずに専用パッケージ
  (例: `packages/cad-dwg-writer`) に分けておく。書き出しは `ExportDrawing` を入力にすれば JWW / SXF と同じ流れに乗る。
  進捗次第で **DWG の読み込みも CADcraft に置き換え**、LibreDWG (GPL) を外す (example の `registerLibreDwg.ts`・
  `@mlightcad/libredwg-converter` とそのパッチ・worker の配信をやめる)。そうなれば DWG を含めて GPL の部分が無くなり、
  Rust CLI も MIT + MPL ファイルで配布できる (CLI を先に GPL で公開していても、自分だけが書いたコードなら後から MIT にできる。
  公開済みの GPL 版はそのまま GPL)。
  以下はそれ以前に調べた別案。
- **DWG 書き出し (調査メモ)**: 読み込みに使っている npm の `@mlightcad/libredwg-web` は `disable-write` でビルドされていて書けない。
  LibreDWG を書き込み有効で wasm ビルドすれば (GPL のまま example 側 opt-in) R2000 DWG は出せるが、LibreDWG の DWG writer は実験的。
  他の候補は ODA File Converter (無償だがプロプライエタリ、デスクトップ専用 = CLI 側なら外部ツールとして呼べる) か商用 SDK。
- **Rust CLI (Windows) への道筋**: ezjww (`ezjww-core` crate、読み書き) と ezsxf (読み書き。ただし PyO3 と一体の cdylib なので
  `writer.rs` / `p21_writer.rs` / `parser.rs` を切り出す必要あり) はどちらも Rust・MIT。`ExportDrawing` は素のデータなので Rust の struct に
  1:1 で写せる。CLI は「入力 (DXF: `dxf` crate / JWW: ezjww / SXF: ezsxf) → ExportDrawing 相当 → 出力」にし、平坦化 (`collect.ts`) と
  writer (`jwwExport.ts` / `sxfExport.ts`) を Rust に移植するのが最短。共有したくなったら逆に Rust 側を wasm にしてブラウザから使う。

## 3. 既知の問題・やり残し

- DWG を開く処理: NURBS 以外では、LibreDWG の `convertEx` (embind) が約 1 秒かかる。ここは手付かず。
- 文字コード自動判定: ヘッダーのない EUC-KR を GBK と誤判定することがある (日本語は問題なし)。
- LibreDWG のメモリ不足エラー文言が mlightcad の商用 DWG パーサー購入リンク (`{dwgParserLink}`) を案内している (`packages/cad-viewer/src/locale/*/main.ts`)。フォークとしては消すか差し替えたい。
- Google Fonts からのフォント読み込み (Arial → Arimo など) は、作業環境から外部に出られなかったため実ブラウザでは未確認。
- vue-tsc の既存エラー (MlStatusBar / MlEntityProperties など) と eslint の既存エラーは上流由来。

## 4. 検証のやり方 (これまで)

- `pnpm build && node tools/build-demo.mjs` → `node tools/serve-demo.mjs 4300` → Playwright で `http://localhost:4300/cad-viewer/?url=...&view=...` を開いてスクリーンショット比較。
- 大きな DWG のサンプルとして canteen.dwg (dwgmodels.com、レイアウトタブ有り) を使った。リポジトリには入れていない。
- 同梱サンプル: `resources/cad-data/samples/fonts-sample.dxf` (フォント置き換え), `sjis-sample.dxf` (Shift_JIS 判定), `limits-sample.dxf` (図面範囲表示、TABLES 無し R12)。
