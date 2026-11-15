# 引き継ぎ資料 — JWW / SXF 対応、DWG の acadrust 移行

作成: 2026-10-23 (それまでの作業はクラウド上の Claude セッションで実施)。最終更新: 2026-11-14 (2.8・2.9)。
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
| `claude/acadrust-migration-optimization-jppe4j` | **DWG を acadrust に移行 (LibreDWG = GPL を撤去)、DWG / DXF 書き出し**、Worker・wasm・WebGL の後始末 (2.8・2.9) |

デモ: <https://cool0707.github.io/remix-cad/> (`?url=` `?new=1` `?lang=` `?view=extents|saved|limits` が使える)

### 既存パッチ (`patches/`)

| パッケージ | 目的 |
| --- | --- |
| `@mlightcad/data-model@1.15.14` | ① `lib/base/AcDbDxfPairReader.js`: 文字コード自動判定 (`acdbGuessLegacyEncoding`)、② `lib/dxf/AcDbDxfHeaderReader.js`: `$LIMMIN/$LIMMAX/$PLIMMIN/$PLIMMAX` を `db.limmin` 等に格納 (+ `.d.ts`)、③ `lib/dxf/AcDbNativeDxfConverter.js`: 読み込み直後に画層 0 と参照画層を作成 (`acdbEnsureReferencedLayers`)、④ `lib/entity/AcDbRasterImage.js` + `dist/data-model.cjs`: `boundaryPath()` の回転の中心が右下の角になっていた・負の角度を無視していたのを、挿入点 (左下) 中心・0 以外すべてに修正。**以下は 2026-11-14 追加 (ESM の `lib/` と Jest 用の `dist/data-model.cjs` の両方)**: ⑤ `lib/dxf/AcDbDxfDocumentReader.js` `shouldAcceptBlockEntity`: BLOCKS セクションの `*Paper_Space0` 以降 (アクティブでないレイアウト) の図形を捨てていた。AutoCAD も acadrust もそこに書くので、アクティブ以外のレイアウトが空になっていた。⑥ `lib/dxf/AcDbDxfHeaderReader.js`: `$EXTMIN = 1e20` / `$EXTMAX = -1e20` (図形が無いときの番兵。data-model 自身もこう書く) を範囲として読んで ±1e20 の箱にしていた。⑦ `lib/dxf/AcDbDxfObjectsReader.js` `finishNamedObjectDictionaries` / `materializeBufferedDictionaries`: 新規データベースの組み込み辞書に振られた仮ハンドル (A〜16) がハンドル表に残り、ファイル側の同じハンドルの辞書と取り違えていた (ezdxf / acadrust 既定の配置では ACAD_MLINESTYLE = 10 がレイアウト辞書 = 10 に混ざり、名前の無いレイアウトができる)。束縛前に仮ハンドルを外し、ファイルに無い辞書には `$HANDSEED` より後の新しいハンドルを振る。⑧ `lib/database/AcDbDatabase.js` `writeDxfExtentsHeader`: `db.limmin` 等を `$LIMMIN` … として `dxfOut` に書く (②で読んだ図面範囲が保存で落ちていた。DWG 書き出しはこの DXF を経由する)。CJS には②相当の読み込みも入れた (Jest でも limits が読める)。⑨ `lib/dxf/AcDbDxfDocumentReader.js` `ensureBlockTableRecord`: BLOCK にパス名 (グループ 1) があるだけで xref フラグを立てていた。ファイルから挿入したブロックは xref でなくてもパスが残るので、書き出すと xref として出てしまい、読む側 (acadrust も AutoCAD も) が中身を捨てる → フラグ (グループ 70) だけを信じる。⑩ `lib/database/AcDbLayerTableRecord.js` `dxfOutFields`: オフのレイヤーを負の色番号 (62) で書く (読むだけで書いておらず、書き出すと全レイヤーがオンになっていた)。⑪ `lib/entity/AcDbBlockReference.js` `dxfOutFields`: 属性を持つ INSERT に `66=1` (属性が続く) を書く。無いと後続の ATTRIB が読み手に捨てられ、属性値が全部消える。⑫ `lib/entity/AcDbPolyline.js` `dxfInFields`: 一定幅 (43) があるのに頂点ごとの幅 (40/41) が 0 で併記されている LWPOLYLINE (acadrust はこう書く) を幅 0 として読んでいた → 一定幅を使う。⑬ `lib/dxf/AcDbDxfDocumentReader.js` `acceptEntity` / `linkOrDeferAttribute`: 所有者ハンドル (330) の無い ATTRIB (R12 形式) を捨てていた → 直前の INSERT に付ける。⑨〜⑬ は ESM と CJS の両方。回帰テストは `cad-acadrust-converter/__tests__/exportFidelity.spec.ts` |
| `@mlightcad/geometry-engine@3.15.14` | NURBS 評価の高速パス。`AcGeNurbsCurve.createFitPointsForClosedCurve` (ESM + UMD): 閉じたフィット点スプラインは DWG / DXF では始点が末尾に重複して入っている。閉じた Catmull-Rom がそれを長さ 0 の区間にし、弦長パラメータ化が 0 で割って継ぎ目付近で大きく膨らんでいたので、重複点を落とす (2026-11-14) |
| `@mlightcad/mtext-renderer@0.13.5` | `fonts.json` の絶対 URL (Google Fonts) を許可 |
| `@mlightcad/ui-components@0.1.11` | `useBoundingRect` (`dist/*.js` と `src/`): 左右にドッキングしたパレットを、ウィンドウのリサイズ時と折りたたみ/展開時に端から位置を計算し直す。元はリサイズ時に幅の差分を足していたので、ビューア側の再配置と合わせて 2 倍ずれていた。折りたたみ中にタイトルバーを押すと記憶位置が折りたたみ位置で上書きされ、展開すると右にはみ出していた |
| `ezjww@0.7.3` | npm 版は Node 専用 (読み込み時に `fs` で wasm を読む)。`initSync` / `initAsync` を追加し、wasm を後から渡せるようにした (`exports` に wasm パスも追加) |

注意: `lib/dxf/AcDbNativeDxfConverter.js` は末尾に改行が無く、そのまま `pnpm patch-commit` すると最終行 (`}`) が落ちたパッチになりビルドが壊れる。
編集ディレクトリでこのファイルの末尾に改行を足してから commit すること (`pnpm patch` で展開するたびに毎回必要)。
`@mlightcad/libredwg-converter` のパッチは LibreDWG の撤去と一緒に削除した (2.8)。

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
  - **特殊文字** (`^u` 上付き・`^d` 下付き・`^c` 中付き・`^o` `^w` `^n` `^b` `^B` 重ね文字): DXF に相当機能がなく、そのまま TEXT に入れると mtext-parser が `^x` を制御文字として「▯」(フォントでは「?」) にしてしまう。`src/jwwSpecialText.ts` の `layoutJwwText()` で文字列を分け、小さい文字・重ねる文字を別の TEXT にして位置をずらして置く (全角 = 1 枠、半角 = 0.5 枠で計算。小文字は 0.5 倍で元の文字幅の枠を使う (Jw_cad が保存する終点から確認)、`^o` `^w` は 0.6 倍で前の文字の中央、`^n` `^b` `^B` は等倍で前の文字の中央)。大きさ・位置は Jw_cad の画面と見比べて合わせた近似。`^` + 数字 (文字の均等縮小) は表示せず、Jw_cad が保存する終点 (縮小後の長さ。`^3` なら半角 3 文字分短い) に表示する文字だけが収まる幅係数にする。ezjww の幅係数はコード文字も数えているので、特殊文字を含む文字列はすべて「全文字の枠数 / 表示する文字の枠数」を掛けて直す (`jwwTextCells()`)。縦字では処理しない。コード以外の `^` は `^ ` (リテラル) にエスケープ。
  - **未対応: 文字間隔** (JWW の `spacing`)。全 JWW 文字で無視しているので、間隔付きの文字は Jw_cad より詰まって見える。TEXT には字間の項目が無く、mtext-renderer の `\T` (トラッキング) は文字列に書式コードを入れる必要があるため保留。
  - 線種パターンは図寸 mm なので、線種レコード (LTYPE) のパターンに主縮尺を掛けて図面単位で書く。要素の線種尺度 (48) は 1
    (グループ別モードで主縮尺と違うグループの要素と、ブロック内の要素だけ `縮尺 / 主縮尺`)。
    後から追加する標準線種 (下記) と同じ決め方なので、読み込んだ線種を新しい線に使っても、読み込んだ線を標準線種に変えても模様の大きさが合う。
    SXF (`sxfToDxf.ts`) も同じ。書き出しはパターン × 線種尺度の積で見るので影響なし。
  - 線種テーブルには使われている線種しか書かない。選べる線種は UI 側で補う:
    `cad-simple-viewer/src/app/AcApStandardLineTypes.ts` の汎用線種 (DASHED / HIDDEN / DOT / CENTER / PHANTOM、acadiso.lin の値) を
    全図面に、Jw_cad 線種 (`JWW_*` 12 種、ezjww の定義と同じ) を JWW 由来の図面 (拡張子 .jww/.jwc か `JWW_*` 線種を持つ) にだけ
    ドロップダウンへ出し、選んだときに図面へ追加する (`MlLineTypeSelect` → `acapEnsureStandardLineType`)。
    追加するパターンは図面の縮尺 (`acapDrawingHatchScale`) を掛けた図面単位なので、新しく描いた線も用紙上で正しい長さになる。
  - ハッチの模様の大きさ (`HPSCALE`) は、図面を開いたときに `$LIMMIN/$LIMMAX` が表す用紙の縮尺にする (`acapDrawingHatchScale()`、`AcApDocManager.syncHatchScale()`)。
    実寸の 1/100 図面で倍率 1 のままだと、模様の間隔が図寸 0.03mm になって白く潰れるため。SXF も同じ。
    ハッチの柄は線種と違って共有のテーブルが無く、要素ごとの尺度 (41) で大きさを決めるしかないので、こちらは要素側で縮尺を持つ。
    SXF の塗りつぶし (SOLID の HATCH) にも同じ縮尺を 41 に書いておき、後から柄に変えても新しいハッチと同じ大きさになるようにしている
    (JWW の塗りつぶしは SOLID 要素なのでハッチの尺度は無い)。
    `HPSCALE` はセッション変数なので、図面ごとに値を覚えて切り替え時に戻す。リミットが標準縮尺の用紙でない図面 (普通の DXF) は 1。
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
  画層名は読み込み時に `<g>-<l> グループ名 - レイヤ名` / `<g>-<l> レイヤ名` (グループ名なし) / `<g>-<l> グループ名 -` (レイヤ名なし) / `<g>-<l>` にする。
  `Group0` のように番号を繰り返すだけのグループ名と `0-1` のようなレイヤ名は名前なし扱い (`jwwLayerLabel` / `parseJwwLayerLabel`)。
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
- **DWG 書き出し — 済 (2026-11-14、2.8)**: acadrust (MPL-2.0) で実装した。当初の案 (CADcraft を取り込み、`ExportDrawing` を入力にする)
  とは違い、**データベースが書いたバイナリ DXF を acadrust が DWG にする**ので、ブロック・寸法・レイアウトを分解せずそのまま保存できる
  (JWW / SXF のような平坦化はしない)。DWG の読み込みも acadrust に置き換え、LibreDWG (GPL) は外した。
  以前の調査メモ: `@mlightcad/libredwg-web` は `disable-write` ビルドで書けない。ODA File Converter は無償だがプロプライエタリ。
- **Rust CLI (Windows) への道筋**: ezjww (`ezjww-core` crate、読み書き) と ezsxf (読み書き。ただし PyO3 と一体の cdylib なので
  `writer.rs` / `p21_writer.rs` / `parser.rs` を切り出す必要あり) はどちらも Rust・MIT。`ExportDrawing` は素のデータなので Rust の struct に
  1:1 で写せる。CLI は「入力 (DXF: `dxf` crate / JWW: ezjww / SXF: ezsxf) → ExportDrawing 相当 → 出力」にし、平坦化 (`collect.ts`) と
  writer (`jwwExport.ts` / `sxfExport.ts`) を Rust に移植するのが最短。共有したくなったら逆に Rust 側を wasm にしてブラウザから使う。

## 2.6 ハッチングの境界検出 (2026-10-25)

HATCH (`AcApHatchCmd`、リボンの `AcApHatchRibbonCmd` も継承) を AutoCAD の -HATCH に合わせて作り直した。
以前は「線を端点同士でつなぐだけ」(`AcGeLoop2d.buildFromEdges`) で、交差・T 字・共有辺で閉じず、
`AcGeLoop2d.closed` が常に true なので開いた形も多角形扱いになっていた。

- 境界検出は CADCraft (MIT OR Apache-2.0) の `crates/geom/src/region.rs` を TypeScript に移植
  (`command/draw/AcApHatchBoundary.ts`、MIT の表記をファイル先頭に残している)。線を交点で分割 → 平面グラフ →
  点から +X 方向の光線で当たった辺から最小の面をたどる → 面の内側で境界に触れない図形のまとまりを島にする。
  追加分: 重なった同一直線上の線の分割、許容差ビンの隣接チェック、端点スナップのグリッド化、`closedOutlines` (オブジェクト選択用)。
- 境界セット (`AcApHatchBoundarySet.ts`): モデル空間の図形のうち、オンでフリーズされていないレイヤーにあるもの (画面の外の図形も含む)。
  非表示の図形、他のハッチ、画像、3D は除外。
  ブロック参照は展開し、ブロック内のレイヤー 0 は参照のレイヤーとみなす。曲線は `subGetIntersectCurves()` で取り出して折れ線にする。
  円・閉じたポリラインがそのまま境界/島になるときは元の形 (円弧) を残す。
  線分が上限 (環境設定「境界を調べる線分の上限」= `AcApSettings.hatchMaxSegments`、既定 6 万本) を超える図面は、
  画面の枠にかかっている図形だけで調べる (AutoCAD の既定の境界セットと同じ)。
- 点を指定 (既定): Osnap は切る (線上に吸着すると内側にならない)。島はハッチスタイルで扱う (標準 = 全部、外側 = 一番外側だけ、無視 = なし)。
  同じ範囲を 2 回クリックすると警告。オブジェクトを選択: 閉じた図形、または組み合わせて閉じる線のまとまりが境界、入れ子は島。
- 失敗時は通知 (`jig.hatch.boundaryNotFound` / `tooComplex` / `alreadyHatched` / `invalidBoundary` / `selectNotClosed`)。
- やり残し: AutoCAD はクリックした範囲を Enter でまとめて 1 つのハッチにする (HPSEPARATE=0) が、ここではクリックごとに 1 つ作る。
  文字を島として避ける処理、自動調整 (境界の変更への追従) は未実装。
- 隙間の許容値 HPGAPTOL (0〜5000 図面単位、既定 0): AutoCAD と同じく図面ではなくユーザーごとの値なので `AcApSettings.hatchGapTolerance`
  (localStorage) に置き、環境設定・塗りつぶしリボンの「オプション」・コマンド `HPGAPTOL` のどれからでも変えられる。
  線の途中に届かない端はその線上へ延ばし、端と端の隙間は直線で橋渡しする (両方の端を互いに引き寄せると角がずれるため)。
  HPGAPTOL が 0 でも、図面サイズの 1/20000 以内の隙間 (円弧を折れ線にしたときのずれなど) は閉じる。

## 2.7 印刷ページ (レイアウト) タブの編集 (2026-11-08)

- 操作本体は `packages/cad-simple-viewer/src/app/AcApLayoutActions.ts` (`acapCreateLayout` / `acapCopyLayout` /
  `acapRenameLayout` / `acapDeleteLayout` / `acapMoveLayout` / `acapSetLayoutPageSetup`)。変更のたびに
  `acapLayoutEvents.layoutsChanged` を出し、`useLayouts` がタブを作り直す。UI は `MlLayoutTabs.vue` と `MlLayoutPageSetupDlg.vue`。
- data-model の `AcDbLayoutManager` には頼っていない: `createLayout` は tabOrder が既存と重なり BTR とも結び付けず、
  `renameLayout` は辞書のキーを変えない (改名後に名前で引けず、DXF にも旧名で出る) ため。改名は辞書の `_recordsByName` を
  直接作り直している (data-model を上げたら確認すること)。
- ページ設定は用紙 (A0〜A4) と向きだけ。レイアウトの LIMITS (用紙の大きさ、左下は維持) と plotPaperSize / canonicalMediaName を書く。
  ペーパー空間の単位は plotPaperUnits (mm / inch) とみなす。印刷範囲表示 (`AcApPrintAreaOverlay`) は印刷ページでは LIMITS を用紙として描く。
- 元に戻す (undo) には載せていない (やり残し)。読み取り専用で開いたときは + とメニューを出さない。

## 2.8 DWG / DXF を acadrust に移行 (2026-11-14)

LibreDWG (GPL-3.0) を撤去し、DWG の読み書きを [acadrust](https://github.com/hakanaktt/acadrust) 0.6.8 (MPL-2.0、Rust) に
置き換えた。**リポジトリから GPL の依存は無くなった** (`pnpm-lock.yaml` に libredwg は 0 件)。パッケージは
`packages/cad-acadrust-converter` (`README.md` に図と数値がある)。

### 構成

```
 ページ                          Worker (アイドル 20 秒で終了)
 ファイルのバイト列 ──転送──▶  acadrust: DWG / DXF → CadDocument → バイナリ DXF
 AcDbDatabase      ◀──転送──   (図面 1 枚ごとに wasm の新しいインスタンス)
   ▲
   └─ data-model の AcDbNativeDxfConverter がバイナリのペアをそのまま読む
```

- **受け渡しはバイナリ DXF**。data-model は元からバイナリ DXF をペア単位で直接データベースに流し込めるので、
  中間のオブジェクト木 (LibreDWG の `DwgDatabase`) も、構造化クローンも、メインスレッドでの数値の文字列パースも無い。
  DXF → データベースの変換ロジック (このフォークのパッチ込み) をそのまま使えるのも理由。
- **エンジン** (`engine/`、Rust、MIT): acadrust への薄いラッパー。`wasm32-wasip1` の cdylib で、wasm-bindgen などの
  生成グルーは無い。WASI の import 6 個 (`random_get` `environ_*` `clock_time_get` `fd_write` `proc_exit`) と自前の 2 個
  (`cad_progress` `cad_panic`) を `src/engineHost.ts` が実装する。同じファイルが Worker・ページ・Node で動く
  (ezjww のような「npm 版は Node 専用」問題が起きない)。入口は `cad_convert` 1 つ。入力は解析が済んだら出力を書く前に解放する。
- **メモリ**: WebAssembly のメモリは縮まないので、**ジョブごとにインスタンスを作り直し**、コンパイル済みモジュールだけ
  Worker 内で使い回す。Worker は 20 秒使われなければ終了 (`idleTimeoutMs`)。ジョブは 1 件ずつ (2 枚同時に解析してピークを重ねない)。
  実ブラウザで「DWG を開くと Worker 起動 → 28 秒後には Worker 0 個」「DXF では worker も wasm も取得しない」を確認した。
- **wasm はビルド済みをコミット** (`wasm/acadrust-engine.wasm` 6.5 MB、gzip 1.9 MB。LibreDWG は 10.8 MB)。`pnpm build` と CI に
  Rust は不要。`engine/` を変えたら `pnpm --filter @mlightcad/cad-acadrust-converter build:wasm`。`wasm/BUILD_INFO.json` に
  ソースのハッシュがあり、ずれていると Jest (`engineHost.spec.ts`) が落ちる。`opt-level = "s"` は 1.5 MB (gzip) になるが 3 割遅いので 3 のまま。
- **panic**: wasm の標準ライブラリは `panic = abort`。acadrust は壊れたレコードを `catch_unwind` で救う箇所があるが、wasm では効かず
  そのジョブのインスタンスが落ちる (ホストがエラーにして捨てる)。壊した DWG 440 件を流してトラップは 0 件
  (読めた 204・エラー 236) だったので、unwind 対応 (`-Zbuild-std`、nightly 相当) は入れていない。

### DXF は既定で従来の TS リーダーのまま

依頼は「DWG・DXF の読み込みを acadrust に」だったが、計測すると DXF は遅く・重くなるので、**DXF の既定は data-model の
リーダーのまま**にした (もともと MIT なので GPL 撤去には関係しない)。Node での計測 (同じマシン):

| ファイル | TS リーダー (メイン) | acadrust 経由 |
| --- | --- | --- |
| DXF 1.9 MB・11,858 図形 | 79–125 ms | Worker 52 ms + メイン 69 ms |
| DXF 53 MB・296,450 図形 | 1.8 s | Worker 2.4–2.8 s + メイン 1.6–1.8 s、Worker のメモリ約 370 MB |

メインスレッドの時間は「テキストの解析」ではなく「データベースの構築」が占めるので、バイナリにしても減らない。
`registerAcadrustConverter(url, { dxf: 'engine' })` で DXF も acadrust 経由にできる (失敗したら TS リーダーに戻る)。
example は `?dxf=acadrust`。壊れた DXF の救済用。文字コードの判定 (Shift_JIS なのに ANSI_1252 と書いてある等) は
`engine/src/encoding.rs` に data-model パッチ①と同じ規則を移植し、acadrust が誤る場合だけ UTF-8 に変換して渡す。

### DWG の計測 (Node、旧経路 = LibreDWG の解析 + 変換)

| ファイル | 旧 | 新 |
| --- | --- | --- |
| DWG 0.4 MB・11,858 図形 | 944–962 ms | Worker 32–115 ms + メイン 111–159 ms |
| DWG 10.5 MB・296,450 図形 | 7.5–7.9 s | Worker 1.5–1.9 s + メイン 1.8 s (wasm のメモリ約 415 MB、終了で解放) |

旧経路はブラウザではさらに「開くたびに Worker 起動 + 10.8 MB の wasm をコンパイル」「結果を構造化クローン」が乗っていた。

### 書き出し

- `AcDbAcadrustConverter.exportDatabase(db, { format: 'dwg' | 'dxf' | 'dxf-binary', version, limits })`。
  `db.dxfOut(…, 'AC1032', { format: 'binary' })` (文字列を作らない) → acadrust → DWG / 別バージョンの DXF。
- UI: `cdwg` と ファイル → 書き出し → DWG (バージョン 2000〜2018、既定 2018)。DXF の書き出しダイアログにも「バージョン」
  (既定「図面と同じ」= 従来どおり data-model が書く。他を選ぶと acadrust 経由。R12 は本物の R12)。
  仕組みは `AcApExportSheetRequest.variants` / `AcApDrawingExporter.variants` / `acapSetDxfVersionWriter()`。
  「図面と同じ」の値は空文字にしない (el-select が未選択扱いにする)。
- 用紙: すべて自動なら図面の LIMITS のまま、選べば `limits` として書く (DXF と同じ `autoKeepsDrawing`)。
- DWG のサムネイル: DXF に書く場所が無いので、エンジンが別に返して `db.thumbnailImage` に入れる (HTML エクスポーターの preview.jpg 用)。

### 検証

- **Jest** `packages/cad-acadrust-converter/__tests__` 40 件: DXF → DWG → 読み戻しが全レイアウト・文字・画層で一致、
  R2000 (コードページ) DWG で日本語、DWG 6 バージョン、図面範囲、R12 DXF、バイナリ DXF、進捗の順序、エラー分類、壊れたファイル、
  書き出しで落ちていた情報 (`exportFidelity.spec.ts`。下の「実図面での検証」)。
  `cargo test` 16 件 (文字コード判定、R12 のブロック名)。e2e `dwg.spec.ts` 6 件 (実ブラウザで読み込み・書き出し・再読み込み)。
- リポジトリの DXF 24 件は TS リーダーと acadrust 経由でデータベースが一致 (パッチ⑤⑦の後)。
- 書き出した DWG (サンプル 21 件 × 6 バージョン) は acadrust と **LibreDWG (独立した実装)** の両方で読み戻して図形数が一致。
- acadrust のテスト用 DWG 13 件 (AC1024〜AC1032、小さいもの。作成元の CAD はまちまち) を旧経路と比較: 図形の種類と数は一致。
  違いが出たのは 3 点で、どれも新経路のほうが筋が通る (寸法の種類: 旧は回転 90° の長さ寸法を平行寸法として読む。
  スプライン: 旧は周期スプラインが 1 点に潰れる。一部の文字: 旧は空で読む)。
  無名ブロックの番号 (`*U2` など) は振り方が違うが、ブロックと参照の対応は合っている。
- 実務の AutoCAD 製 DWG は下の「実図面での検証」。**書き出した DWG を AutoCAD / Jw_cad 実機で開く確認はしていない**
  (読み戻しは acadrust と LibreDWG、表示はこのビューアで確認した)。
- 検証に使ったスクリプトはリポジトリに入れていない (比較は Jest に移した)。DWG サンプルは `node tools/make-dwg-sample.mjs`
  (JWW サンプルを DWG 2018 にしたもの。画像は DWG に同梱できないので「見つからない画像」になる)。

### 実図面での検証 (2026-11-15)

AutoCAD 2007 形式 (AC1021) の DWG 4 件 (0.5〜2.4 MB、11,683〜47,562 図形、レイアウト 3〜9 枚、日本語とアイスランド語の文字・属性を含む)。
ファイルはリポジトリに入れていない (権利が分からないため)。

**読み込み**

- 4 件ともエラー・スキップ・復旧なしで読めた。図形の種類と数は LibreDWG (生の `libredwg-web`) と一致 (ATTRIB / VERTEX / SEQEND を
  LibreDWG は親の中に数えるので、その分を除いて完全一致)。1 件は LibreDWG では読めず (図形 0)、acadrust だけが読めた。
- 文字 (TEXT / MTEXT / ATTRIB / ATTDEF。LibreDWG が読めた 3 件で計 9,249 個) をハンドル単位で突き合わせ: 位置は全部一致、
  acadrust が空で LibreDWG に文字があるものは 0。逆に LibreDWG が空で acadrust が読めているものが 224 個。
- Node での時間 (エンジン + TS リーダー): 0.5 MB で 0.1 + 0.3 秒、2.4 MB (47,562 図形) で 0.3 + 0.9 秒。wasm のピークは 21〜85 MB。
  ブラウザでファイルを選んでから図面が開くまでは 2〜4.5 秒 (ヘッドレス Chromium)。

**書き出し** (各ファイル → DWG 6 バージョン + DXF R12)

- 読み戻し (acadrust) は元のデータベースと一致。違いはスプラインフィットの 2D ポリライン計 3 本が LWPOLYLINE になる点だけ (下の制限)。
  LibreDWG で読み戻した図形数も元と一致 (LibreDWG が元ファイルを読めない 1 件を除く)。
- 書き出した DWG (2018 と 2000) をこのビューアで開いたスクリーンショットは、元ファイルと画素単位で一致
  (1 件だけ塗りの重なる縁で 24 / 148 画素の差)。R2000 はトゥルーカラーを持てないので、色は近い ACI 色になる (形式の制限)。

**見つけて直したもの**

| 症状 | 原因 | 直した場所 |
| --- | --- | --- |
| モデルタブに切り替えると何も映らない (ズームが 3.7e18 倍) | ペーパー空間で保存した DWG の Model レイアウトは図面範囲が (0,0)–(0,0)。それにフィットしていた | `AcApLayoutViewFraming.ts` `toFrameBox` (点だけの箱は枠にしない)、`AcTrBaseView.zoomTo` (大きさの無い箱は中心に移るだけ) |
| 色違いの塗り 36,000 個の図面が開くのに 12〜15 秒、1 フレーム約 0.5 秒 | 色ごとにマテリアル・バッチ・テクスチャ | 2.9 の「塗りの色を頂点に」 |
| 書き出すとブロックの中身が消える (368 図形) | data-model がパス名のあるブロックを xref 扱い | パッチ⑨ |
| 書き出すとオフのレイヤーが全部オンになる (隠してあったビューポート枠が出る) | オフ状態を書いていない | パッチ⑩ |
| 書き出すとブロックの属性値が消える (通り芯記号の文字など。53 個中 53 個、280 個中 277 個) | INSERT に `66=1` が無い | パッチ⑪ |
| 書き出した DWG を開くと幅付きポリライン (塗りつぶした円) が細い線になる | 一定幅 + 頂点幅 0 の読み方 | パッチ⑫ |
| DXF R12 への書き出しがエンジンごと止まる | acadrust の R12 ライターがブロック名を 12 バイト目で切る (`name[..12]`)。そこがマルチバイト文字の途中だと panic (例: `FL記号（階高）`) | `engine/src/lib.rs` `keep_r12_writer_from_splitting_block_names` (R12 のときだけ、該当するブロック名を先に ASCII にする。R12 のシンボル名はもともと ASCII だけ) |

**残っている制限** (どれも data-model のモデルに無い情報)

- スプラインフィット / カーブフィットした 2D ポリライン (POLYLINE のフラグ 2・4): フィット後の頂点で読むので形は合うが、
  書き出すと普通のポリラインになる (制御フレームは戻らない)。
- DXF R12 を読むとき、サブクラスマーカーの無い ATTRIB / ATTDEF のタグ名 (グループ 2) は読めない (値と位置は読める)。
- 無名ブロックの番号 (`*X23` → `*X24`) は DWG に書くと振り直される (参照の対応は保たれる。AutoCAD も同じ)。

### 撤去したもの

`@mlightcad/libredwg-converter` / `libredwg-web` (依存・override・パッチ)、各 example の `registerLibreDwg.ts`、
`tools/use-dwg-converter.mjs` (上流の商用コンバーターへの切り替え)、`LIBREDWG_*` / `DWG_PARSER_*` 定数、
メモリ不足時の商用パーサー購入リンク (`{dwgParserLink}`、6 言語)、`cad-html-exporter/examples/check-thumbnail.mjs`。
`packages/examples/public/cdn-bootstrap/cad-viewer.html` (上流の公開パッケージを CDN から読む例) は DXF 専用にした。
`cad-html-exporter` の `dwgParser` は `'acadrust'` (既定) か `'dwg'` (上流の商用、任意)。
three-renderer / pdf-renderer に残る「LibreDWG が…」というコメントは、LibreDWG 由来のデータの癖への対処で、依存ではない。

## 2.9 Worker / wasm / WebGL の整理 (2026-11-14)

棚卸しして、確認できたものだけ直した。

**Worker / wasm**

| 対象 | 以前 | 今 |
| --- | --- | --- |
| DWG | 開くたびに Worker + 10.8 MB の wasm を作り直し、結果は構造化クローン | 2.8 |
| JWW (`AcDbJwwConverter`) | Worker は一度作ると常駐。DXF は文字列でクローン → メインで `TextEncoder` | 20 秒アイドルで終了 (`idleTimeoutMs`)。DXF は Worker で UTF-8 にして転送 |
| JWW / SXF の DXF | 登録済みの DXF コンバーターへ | `AcDbNativeDxfConverter` へ直接 (DXF を acadrust 経由にしても影響しない) |
| MTEXT (`mtext-renderer`) | 差分ビューアだけ Worker モード (最大 4 個を起動時に作り、各自フォントを解析) | 差分ビューアも既定はメインスレッド (`useMainThreadDraw`、他のホストと同じ) |
| PDF 取り込み | `getDocument()` を破棄せず、取り込むたびに pdf.js の Worker が残る | `loadingTask.destroy()` |

**WebGL** (コンテキストはビューごとに 1 つで、もともと増えていない。問題は後始末)

実ブラウザでの計測 (three.js の `renderer.info.memory`。JWW サンプルを開く → 全選択 → 閉じる、を 5 回):

| | 開く前 | 1 回後 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- | --- | --- |
| テクスチャ (修正前) | 3 | 16 | 29 | 42 | 55 | 68 |
| テクスチャ (修正後) | 3 | 3 | 3 | 3 | 3 | 3 |
| ジオメトリ (修正前) | 3 | 4 | 5 | 6 | 7 | 8 |
| ジオメトリ (修正後) | 3 | 3 | 3 | 3 | 3 | 3 |

- バッチ (`AcTrBatchedMixin.dispose`) がジオメトリしか破棄していなかった。バッチ専用のマテリアル複製、ハイライト用マスクテクスチャ、
  ハッチ模様テクスチャの参照カウントが残り、図面を閉じても再生成しても GPU に残っていた → まとめて破棄。`updateMaterial` で差し替えた古い複製も破棄。
- ラスター画像の複製マテリアルとテクスチャ (`cloneUnbatchedTexturedMaterial`) が破棄されていなかった (1 枚で数十 MB になりうる) → `ownsTexturedMaterial` を付けて破棄。
- `AcTrRenderer` が `FontManager` のシングルトンに付けたリスナーを外しておらず、破棄したレンダラーが残り続けた → `destroy()` を追加
  (`dispose()` は「キャッシュを空にする」意味で再利用されるので別にした)。HTML エクスポートの使い捨てレンダラーも `destroy()`。
- レイアウトビューの `OrbitControls` が共有キャンバスに付いたまま破棄されなかった。しかも**別タブに切り替えて待機中の図面のカメラ操作が有効なまま**で、
  表示中の図面のパン・ズームに一緒に反応していた (実ブラウザで確認: 2 枚目をホイールで拡大すると、待機中の 1 枚目のカメラが
  ズーム 11.6 → 467 に動いていた) → 待機時は入力を切り (`AcTrLayoutViewManager.inputEnabled`)、閉じるときに `dispose()`。
  軸ギズモのラベルのテクスチャも破棄。e2e `parked-document-view.spec.ts`。
- 計測・マークアップのオーバーレイ用キャンバス: 倍率を 2 で頭打ちに (WebGL と同じ)。端数の倍率 (125 %・150 %) で `canvas.width !== w * dpr` が
  常に真になり、描画のたびにキャンバスを作り直していたのを修正。
- 描画バッファの倍率を起動時の一度しか読んでいなかった → リサイズ時に追従 (モニター移動・ブラウザの拡大)。
- **塗りの色を頂点に** (2026-11-15): バッチはマテリアルごと、塗りのマテリアルは色ごとだったので、色の数だけバッチ (ジオメトリ・
  ハイライト用テクスチャ・描画呼び出し) ができていた。トゥルーカラーで塗り分けた図面 (色違いの SOLID 36,095 個) で計測:

  | | 修正前 | 修正後 |
  | --- | --- | --- |
  | GPU のジオメトリ / テクスチャ | 32,109 / 32,109 | 17 / 17 |
  | ファイルを選んでから開くまで | 12〜15 秒 | 3〜4.5 秒 |
  | 2 フレームの時間 (ヘッドレス、ソフトウェア描画) | 約 1,100 ms | 約 120 ms |

  固定色 (ByLayer・ByBlock・ACI 7・ワイプアウト・模様・グラデーション以外) の単純な塗りは、色をジオメトリの `color` 属性に書き、
  白い共有マテリアル (`vertexColors`) で描く。`AcTrStyleManager.getFillMaterial(traits, …, geometry)` にジオメトリを渡すと切り替わる
  (渡さなければ従来どおり色ごとのマテリアル。MTEXT のグリフは渡していない)。マテリアルのメタデータ `vertexColors` が目印。
  あとから色が変わるもの (レイヤー色・背景で反転する色) は 1 つのマテリアルを塗り替える仕組みなので対象外。
  ハイライト用の複製は `AcTrMaterialUtil.setMaterialColor` が `vertexColors` を切って単色にする。
  描画結果は修正前と画素単位で同じ (重なった塗りの縁だけ、色別バッチ順から図形順に変わる)。テスト `AcTrFillVertexColor.spec.ts`。
  線は対象外 (レイヤー × 色 × 線種 × 線幅で、実図面では数が増えない)。

**直していないもの (判断)**

- 描画ループは毎フレーム rAF が回るが、汚れていなければ WebGL は何もしない。必要時だけ回す形にするには `_isDirty` の代入 59 か所と
  `renderFrame` を毎フレーム受ける 2 か所 (MTEXT エディター・印刷範囲) の整理が要る。効果が小さいので見送り。
- 計測・マークアップは 1 個ごとにビュー全体の大きさのキャンバスを持つ (個数に比例してメモリを使う)。共有キャンバス 1 枚にまとめるのが本筋だが、
  選択の見た目やレイヤー別表示が 1 キャンバス 1 要素を前提にしているので、マークアップ側の作り直しになる。未着手。
- 別タブで待機中の図面は GPU のジオメトリを持ったまま (切り替えを速くするための元からの設計)。タブを多く開くと GPU メモリが増える。
- バッチの頂点配列は CPU 側にも残している (ピック・範囲計算が読む)。
- ezjww (JWW、1 MB) と acadrust (6.5 MB) を 1 つの wasm にはしていない (JWW だけ使う人に 6.5 MB を読ませないため)。

## 3. 既知の問題・やり残し

- e2e `context-menu.spec.ts` の「empty canvas: the menu creates things; select all; repeat」がこの作業環境では不安定
  (単体で 12 回中 5 回失敗。描画・ビューのソースを 2.9 の修正前に戻しても同じ割合なので、今回の変更とは無関係)。
  メニューから始めた長方形の 2 点目が入らず図形数が 2 のままになる。CI (GitHub Actions) での状況は未確認。

- DWG を開く処理は acadrust に置き換えて速くなった (2.8 の計測)。残る時間の大半はメインスレッドでのデータベース構築と描画。
- acadrust 経由の DWG は AutoCAD 2007 形式の実図面 4 件で確認した (2.8 の「実図面での検証」。制限もそこ)。
  それ以外の形式 (R2010 以降・R2000) の実図面と、書き出した DWG を AutoCAD / Jw_cad 実機で開く確認は未実施。
- 文字コード自動判定: ヘッダーのない EUC-KR を GBK と誤判定することがある (日本語は問題なし)。
- Google Fonts からのフォント読み込み (Arial → Arimo など) は、作業環境から外部に出られなかったため実ブラウザでは未確認。
- vue-tsc の既存エラー (MlStatusBar / MlEntityProperties など) と eslint の既存エラーは上流由来。

## 4. 検証のやり方 (これまで)

- `pnpm build && node tools/build-demo.mjs` → `node tools/serve-demo.mjs 4300` → Playwright で `http://localhost:4300/cad-viewer/?url=...&view=...` を開いてスクリーンショット比較。
- 大きな DWG のサンプルとして canteen.dwg (dwgmodels.com、レイアウトタブ有り) を使った。リポジトリには入れていない。
- e2e をこの環境で回すとき: `channel` を外し `launchOptions.executablePath: '/opt/pw-browsers/chromium'` にした一時設定を作り、
  `pnpm exec playwright test --config <一時設定> --trace off` (パッケージ内で `pnpm exec`。`npx` だと別の版の Playwright を拾って失敗する)。
  `pnpm dev` のサーバーは `/?url=...` を 403 にするので、URL 指定の確認はデモ (`demo-dist`) で行う。
- 同梱サンプル: `resources/cad-data/samples/fonts-sample.dxf` (フォント置き換え), `sjis-sample.dxf` (Shift_JIS 判定), `limits-sample.dxf` (図面範囲表示、TABLES 無し R12)。
