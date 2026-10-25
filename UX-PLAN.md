# UX-PLAN.md — CAD 未経験者向け UI への作り替え計画

CAD を使ったことがない人でも、図面を開いてすぐ見て、軽く編集できるようにする。
AutoCAD 風の「コマンド入力 → 対象を選ぶ」操作の流れを残したまま、
Figma / Illustrator 風の「先に選ぶ → ドラッグ / 右サイドバーで直す」操作を上に重ねる。

- **データモデル (`@mlightcad/data-model`) は変えない。** UI と操作 (イベントの処理) だけを変える。
- 下の「決定事項」はユーザーと合意済み。蒸し返さずにそのまま実装する。
- 実装は**簡単なものから順番に**行う (下の「実装ステップ」の順)。1 ステップ = 1 ブランチ / PR を目安にする。
- 共通ルールは [`CLAUDE.md`](./CLAUDE.md) に従う。特に i18n は 6 ロケール全部 (en / ja / zh / tr / cs / ar)。

---

## 1. 決定事項

### 1.1 全体の構成: 「操作プロファイル」
- 既存の AutoCAD 風操作は消さずに **「CAD (従来)」プロファイル**として残す。新しい操作は **「シンプル」プロファイル**として作る。
- 既存のコマンド (`AcEdCommand` + 入力待ちの状態機械 `AcEdPromptStateMachine`) は処理の裏側としてそのまま使う。
  新しく作るツール (選択・パン・線・矩形…) はイベントを受け取り、既存コマンドを入力済みの状態で呼び出す。
  こうすると元に戻す (Undo)、スナップ、プレビューが自動的に揃う。
- プロファイルで切り替えるもの: 選択の挙動 / 右クリック / コマンドラインの表示 / 用語辞書。
- 既存の e2e テストは CAD プロファイルの動作を前提にしているので、CAD プロファイルでは今の動作を変えない。
  CAD の流れを前提にする e2e は `e2e/helpers/operationProfile.ts` の `useCadProfile(page)` で CAD にしてから動かす。
- **既定はシンプル** (ステップ 6 で決定)。コマンドラインはシンプルでも表示したまま
  (コマンドパレットが入るステップ 8 までは隠さない)。

### 1.2 用語 (シンプルのプロファイル)
| CAD 用語 (現在の ja) | 新しい用語 | 備考 |
|---|---|---|
| 画層 | **レイヤー** | |
| ブロック | **シンボル** | 「コンポーネント」は使わない |
| ブロック属性 (ATTRIB / ATTDEF) | **シンボルのプロパティ** | 1.6 参照 |
| モデル空間 | **キャンバス** | |
| レイアウト / ペーパー空間 | **印刷ページ** | |
| ビューポート | **ビューポート** (変更なし) | 一般用語なので変えない |
| 線種 / 線の太さ | 線の種類 / 線の太さ | |
| ハッチング | 塗りつぶし (パターン) | |
| 外部参照 | リンク図面 | |
| 再作図 (REGEN) | 表示を更新 | |
| クイック選択 | **条件で選択** | 1.7 参照 |

- ツールチップには CAD 用語を括弧で併記する (例: 「レイヤー (画層)」)。CAD 経験者が検索しても見つけられるようにするため。
- コマンドパレットでは CAD 用語の別名でも検索できるようにする。
- en など他のロケールも同じ方針で一般用語にする (Layer / Symbol / Symbol properties / Canvas / Print page / Viewport …)。

### 1.3 モードの表示
- 現在のツールをカーソルの形で示す (Photoshop 式)。カーソル横に小さなバッジ (例: 「線: 2点目」) を出し、ステータスバーにも常に表示する。
- 左端に縦のツールバーを置く。一番上は常に**選択ツール**のボタン。
  - (済) 使用中のツールのボタンをテーマカラーで塗る (Illustrator / Photoshop 式)。実行中のコマンドが無いときは
    選択 / パンのうちビューが今いる方。フライアウトの中のツールなら親ボタンも塗る。
    仕組みは `AcUiToolbar.setActiveCommand()` と、それを DocManager につなぐ `acapBindToolbarDocState()`。
- 単キーのショートカット: V 選択 / H パン / L 線 / R 矩形 / T テキスト。Space を押しながらドラッグで一時的にパン。
- Esc は段階的に動く: 1 回目 = 今の操作を取り消し → 2 回目 = 選択ツールに戻る → 3 回目 = 選択を解除。
- 作図が 1 回終わったら選択ツールに自動で戻る (連続作図は設定で選べるようにする)。

### 1.4 フリーズ
- フリーズは**UI から無くす**。フリーズされた画層は UI 上「非表示」として見せる。
- そのレイヤーを表示にしたときは、フリーズの解除も同時に行う (表示にしたのに出てこない状態を作らない)。
- 読み込んだファイルのフリーズ情報は描画で必ず守る (作成者が隠したものを出さない)。
- VP フリーズは「印刷ページ」の中で「このビューポートで隠す」として残す。
- **全体表示と印刷範囲**は、非表示 (およびフリーズ) のレイヤーの図形を除外して計算する。

### 1.5 選択
- **シンプルの既定**: クリックで置き換え。Shift + クリック = 追加・解除の切り替え。Ctrl / Cmd + クリック = シンボル内部の図形を直接選択。何もない所をクリック = 選択解除。
- **CAD 式**: クリックするたびに追加 (今の動作)。ステータスバーのトグルで簡単に切り替えられるようにする。
- 範囲選択の「左から右 = 完全に囲んだものだけ / 右から左 = 触れたものも」は残す。枠の色と線種 (実線 / 破線) の違いをはっきり見せる。

### 1.6 右サイドバー (プロパティインスペクタ)
グループ分けした 1 枚のパネルにする。シンボルを選んだときの例:
```
▼ 一般              レイヤー / 色 / 線の種類 / 線の太さ
▼ 配置              X・Y / 回転 / 倍率 X・Y
▼ シンボル          シンボル名  [シンボルを編集]
▼ シンボルのプロパティ
    記号    [ D1  ]
    幅      [ 800 ]
    メーカー[ ○○  ]  (目のアイコン = 非表示の項目)
```
- **シンボルのプロパティ** (= ブロック属性) は、他のプロパティと同じパネルでそのまま編集する。
  - 欄の名前は、定義側の問い合わせ文を優先して表示し、無ければタグ名を使う。
  - 非表示の項目は目のアイコン付きで薄く表示する。定数の項目は読み取り専用。
  - 同じシンボルを複数選んでいれば、項目ごとに「複数の値」を表示してまとめて変更できる。違うシンボルが混ざっているときは、共通するタグだけを表示する。
  - 「+ プロパティを追加」はシンボルの編集中だけ出す (今の `MlAttDefDlg.vue` をこの中で使う)。
  - シンプルでは、ダブルクリックしたとき `MlAttEditDlg.vue` を開く代わりに、サイドバーの該当欄にフォーカスする。
- **複数選択時は「選択範囲」セクション**を一番上に出す:
  - X / Y / 幅 / 高さを数値で編集できる。基準点は Illustrator 式の **9 点セレクタ** (左下・右上・中心などを切り替える)。
  - 種類ごとの件数 (線 12、文字 3 …)。
  - 共通のプロパティは、値が揃っていなければ「複数の値」と表示し、まとめて変更できる。
  - 長さ合計・面積など、図形の種類に応じた集計。

### 1.7 条件で選択 (旧: クイック選択)
- 名前を「**条件で選択**」に変える。ダイアログをやめ、**ペイン** (`MlPaletteManager` のパレット) にする。
```
▼ 条件で選択
  対象   (●) キャンバス全体  ( ) 今の選択の中
  ┌ 種類       [すべて ▾]               ✕ ┐
  │ レイヤー   [が次と等しい ▾] [寸法 ▾] ✕ │
  └ + 条件を追加                           ┘
  一致: 128 件                         ← 条件を変えると即更新
  [選択] [選択に追加] [選択から除外]
```
- 条件を複数並べられる (AND 条件)。
- 条件を変えるたびに、件数とキャンバス上のハイライトを即時に更新する。ボタンを押すと確定する。
- 選択できる項目の追加: シンボル名 / シンボルのプロパティ / 文字の内容 (含む) / 長さ・面積の範囲。
- レイヤーや色の値は、図面内に実在する値だけをドロップダウンで出す。「ハンドル」はシンプルでは隠す。
- 右サイドバーのプロパティ欄から「この値で条件で選択」を実行すると、条件を入れた状態でペインを開く (「同じ○○を選択」はここに集約する)。

### 1.8 その他 (合意済み)
- **ドラッグ移動**: 選択中の図形本体をドラッグで移動、Alt を押しながらドラッグで複製。矢印キーで少しずつ移動 (Shift で 10 倍)。
- **バウンディングボックス変形**: 選択範囲の四角形のハンドルで拡大縮小・回転。CAD のグリップ (頂点編集) は図形 1 つをダブルクリックしたときだけ出す。
- **スナップ**: 個別設定 (端点・中点…) は詳細設定に隠し、「スナップ ON/OFF」1 つにする。Figma 風の整列ガイドを追加。
- **シンボルの編集**: ダブルクリックでシンボルの中に入る。周りは薄く表示し、上部にパンくずリストを出す。
- **コマンドパレット**: コマンドラインの代わりに Ctrl+K。一般用語でも CAD 用語でも検索できる。
- **上部バー**: リボンの代わりに「ファイル・元に戻す・印刷」だけの細いバー。選択内容に応じて変わるツールバーを選択範囲の近くに浮かせる。
- **最初の体験**: 何も開いていない画面にドラッグ & ドロップの案内。ツールチップにはショートカットキーを併記。
- **右クリックメニュー**: コンテキストメニューにする。**中身は実装時に決める。**
- **パレット (レイヤーなど) は常に表示** (済): 最初から右にドッキングし、× ボタンは無い。折りたたんでタイトルバーだけにはできるが、完全には消せない。
  ドッキング中は図面エリア (canvas) をパレットの分だけ縮め、図面がパレットの裏に隠れないようにする (`store.paletteDockInsets`)。

### 1.9 やらないこと
- **閲覧と編集の切り替え**は作らない (Web なので元のファイルは壊れない。切り替えの存在自体が混乱のもとになる)。
- データモデルの変更 (画層・ブロックなどの内部名や API 名は変えない)。

---

## 2. 実装ステップ (簡単な順)

各ステップの「起点」は、今のコードで最初に見るべき場所。調査済みの事実だけを書いている。

### ステップ 1: 用語の変更 + クイック選択の名前変更 (済)
- **実施内容 (結果)**:
  - 方式は (b) 文字列の直接書き換え。プロファイル別辞書 (a) はステップ 6 でプロファイルを入れるときに検討する。
  - 対象: cad-simple-viewer / cad-viewer / cad-viewer-example / cad-simple-ui-plugin / cad-html-core と README 8 言語。
    cad-diff-viewer と cad-script-plugin (API 名に直結する開発者向け文言) は CAD 用語のまま残した。
  - 各言語の訳語:
    | CAD 用語 | en | zh | tr | cs | ar |
    |---|---|---|---|---|---|
    | ブロック → シンボル | Symbol | 符号 | Sembol | Symbol | رمز |
    | ブロック属性 → シンボルのプロパティ | Symbol property | 符号属性 | Sembol özelliği | Vlastnost symbolu | خاصية الرمز |
    | モデル空間 → キャンバス | Canvas | 画布 | Tuval | Plátno | لوحة الرسم |
    | レイアウト → 印刷ページ | Print page | 打印页 | Baskı sayfası | Tisková stránka | صفحة الطباعة |
    | 線種 → 線の種類 | Line type | 线条类型 | Çizgi türü | (typ čáry のまま) | (نوع الخط のまま) |
    | ハッチング → 塗りつぶし | Pattern fill / Fill pattern | (填充 のまま) | Desen dolgusu | Vzorová výplň | تعبئة بنمط |
    | 外部参照 → リンク図面 | Linked drawing | 链接图纸 | Bağlantılı çizim | Propojený výkres | رسم مرتبط |
    | クイック選択 → 条件で選択 | Select by Criteria | 按条件选择 | Ölçüte Göre Seç | Výběr podle kritérií | تحديد حسب الشروط |
    | 再作図 → 表示を更新 | display refresh | 刷新显示 | ekran yenileme | obnovení zobrazení | تحديث العرض |
    - 画像の外部参照 (IMAGEATTACH) は「リンク図面」ではなく「リンク」とした。
    - レイヤーは en / zh / tr / cs / ar ではもともと一般用語 (Layer / 图层 / Katman / Hladina / طبقة) なので変更なし。
  - ツールチップ (cad-viewer `main.ribbon.tooltip.*` とツールバーの説明) には CAD 用語を括弧で併記した。
  - 新規図面の印刷ページ名の接頭辞 (`main.newDrawing.layoutPrefix`) は ja「印刷ページ」、en「Page」、zh「打印页」、
    tr「Sayfa」、cs「Stránka」、ar「صفحة」。これはファイルに保存されるデータ名になる。
  - フリーズ関連の文言はステップ 2 で UI から消すので、用語の置き換えだけにとどめた。
  - 用語に依存していた jest / e2e の期待値を更新した (findLocale, findPaletteLocale, AcUiFindPaletteView,
    AcExHtmlI18n, find-layouts.spec.ts)。
  - e2e のメモ: playwright.config.ts は既定で `channel: 'chrome'` を使う。Chrome が無い環境では
    `/opt/pw-browsers/chromium-*/chrome-linux/chrome` を `launchOptions.executablePath` に指定した一時 config で実行する。
- 以下は着手前の調査メモ:
- 対象のロケールファイル (ja だけで「画層」が約 150 か所):
  - `packages/cad-simple-viewer/src/i18n/{en,ja,zh,tr,cs,ar}/` (command.ts, jig.ts, main.ts)
  - `packages/cad-viewer/src/locale/{…}/` (main.ts, dialog.ts, command.ts, entity.ts)
  - `packages/cad-viewer-example/src/locale/*.ts`
  - このほか、「画層」は `cad-simple-ui-plugin` / `cad-diff-viewer` / `cad-html-core` / `cad-script-plugin` の i18n にもある。どこまで直すかは最初に決める。
- 方式は 2 通りある:
  - (a) プロファイル別の上書き辞書を作る (CAD プロファイルでは今の用語を残せる)
  - (b) 文字列を直接書き換える
  - (a) が本来の形だが、最初は (b) で始めて後から (a) に移ってもよい。着手時にユーザーに確認する。
- クイック選択の文字列: `dialog.quickSelectDlg.*` と `main.ts` のリボン・コマンド名 (ja では「クイック\n選択」など)。コマンドは `packages/cad-viewer/src/command/AcApQSelectCmd.ts`。
- README は 8 言語あるので、用語が出てくる箇所を合わせて直す。

### ステップ 2: フリーズを UI から無くす + 全体表示から非表示を除外 (済)
- **実施内容 (結果)**:
  - 調べた結果: `scene.box` (= `AcTrLayout.box`) は**もともと非表示・フリーズのレイヤーを除外していた**。
    レイヤーの `computeBatchBoundingBox()` が非表示のレイヤーで空を返し、バッチ側も
    `unionActiveVisibleBoundingBoxInto()` で図形単位の非表示 (INSERT のレイヤーのフリーズ) を除外する。
    ZOOM 全体表示・ファイルを開いたときの初期表示 (`resolveFirstVisitFrameBox()`) はこれを使うので変更不要だった。
  - 除外していなかったもの (直した):
    - **ZOOM スマート範囲** (`AcTrLayout.collectSpatialExtentBoxes[Async]()`): 空間インデックスは非表示の図形も持っている。
      `AcTrHierarchicalSpatialIndex.all()` / `allAsync()` にルート ID の絞り込みを足し、`AcTrLayout.isEntityShown()` で除外。
      全レイヤーが表示中なら絞り込み自体をしない。
    - **PDF 書き出し** (`pdf-renderer`): 非表示・フリーズのレイヤーも描画し、ページ範囲にも含めていた
      (`includeHiddenLayers` オプションは定義だけで未使用だった)。`viewport/AcPdfHiddenLayers.ts` で
      非表示のレイヤーの図形を `visible = false` にし、描画とページ範囲の両方から外す。
      INSERT は AutoCAD と同じ扱い (INSERT のレイヤーがフリーズ = 全体を隠す / オフ = そのレイヤーに属する部分だけ隠す)。
      一部だけ隠れた INSERT はノードの範囲がそのまま残る (全部隠れたときだけ範囲から外れる)。
    - **HTML 書き出しのビューアの全体表示** (`cad-html-plugin` の `fit()`): 書き出したすべてのレイヤーで範囲を計算していた。
      `cad-html-core` に `computeVisibleLayoutExtents()` を追加し、表示中のレイヤーだけで計算する。
      「非表示のレイヤーも書き出す」オプション自体はそのまま。
  - フリーズの UI を削除: レイヤー一覧 (`MlLayerTable.vue` のフリーズ列)、リボンのレイヤー選択 (`MlLayerSelect.vue` の雪アイコン)、
    リボンの「レイヤーフリーズ」「フリーズ解除」ボタン。不要になった文言キーも 6 ロケールから削除した。
  - 表示の扱い: UI の「表示」は `isOn && !isFrozen` (`MlLayerTable.ts` の `isLayerShown()`)。
    表示にするときは `AcApLayerService.setLayerVisible()` でオンとフリーズ解除を 1 回の Undo にまとめて行う。
    非表示にするときはオフにするだけ (フリーズのビットは触らない)。
    レイヤー一覧の「すべて表示」チェックボックスとリボンの「全レイヤー表示」も `setAllLayersVisible()` でフリーズを解除する
    (リボンは `LAYON` コマンドを呼ばずに直接処理する)。
  - 残したもの: コマンド (`LAYFRZ` / `LAYTHW` / `LAYON` など) は AutoCAD 互換のまま。`useLayers` の `setLayerFrozen()` など API も残した。
    VP フリーズ (`AcDbViewport.frozenLayerIds`) を編集する UI はもともと無いので、「このビューポートで隠す」はまだ無い
    (描画では守っている)。
- 以下は着手前の調査メモ:
- フリーズの UI があるファイル: `packages/cad-viewer/src/component/common/MlLayerTable.vue`, `MlLayerSelect.vue`, `component/palette/MlLayerList.vue`, `component/ribbon/MlRibbonCommands.vue`, `composable/useLayers.ts`。
- 全体表示の計算: `packages/cad-simple-viewer/src/view/AcTrView2d.ts` の `getDrawingExtents()` が `this._scene.box` を返し、`src/util/AcApDrawingExtents.ts` の `resolveDrawingExtents()` がそれを使う。
  **scene.box が非表示のレイヤーを含むかは未確認。** 最初に確かめること。
  ズームは `src/command/AcApZoomCmd.ts`、ファイルを開いたときの初期表示は `AcTrView2d.applyInitialZoom()` / `resolveFirstVisitFrameBox()`。
- 印刷範囲: `MlExportPdfDlg.vue` / `MlExportHtmlDlg.vue` を見る (「非表示の画層も書き出す」オプションがすでにある)。

### ステップ 3: 選択方式の切り替え (済)
- **実施内容 (結果)**:
  - `AcEdSelectionAction` に `'toggle'` (選択済みは外し、それ以外は足す) と、選択方式の型 `AcEdSelectionStyle = 'cad' | 'simple'` を追加。
    `resolvePointerSelectionAction(e, style, isClick)` が方式ごとに解決する:
    | 操作 | CAD 式 (`'cad'`) | シンプル (`'simple'`) |
    |---|---|---|
    | クリック / ドラッグ | add | replace (何もない所のクリックで選択解除) |
    | Shift + クリック | remove | toggle |
    | Shift + ドラッグ | remove | add (範囲の切り替えは結果が読みにくいので追加にした) |
    | Ctrl / Cmd | add | add |
  - 設定は `AcApSettingManager` の `selectionStyle` (localStorage に保存)。**既定は `'cad'`** のまま
    (既定のプロファイルはステップ 4 の後に決める方針どおり)。
  - ステータスバーに切り替えボタン `MlSelectionStyleButton.vue` (選択ツールの矢印アイコン、シンプルのとき青) を追加。
    ツールチップは `main.statusBar.selectionStyle.{simple,cad}` (6 ロケール)。
  - toggle はロックされたレイヤーの図形を「足さない」が「外す」ことはできる (remove と同じ扱い)。
    マークアップ・計測のオーバーレイも toggle に対応 (`AcEdReviewOverlayPick.ts`)。
  - 対象は**コマンド待ちでないときの選択** (`AcTrView2d`) だけ。コマンド実行中の「オブジェクトを選択」
    (`AcEdInputManager` の選択の入力待ち) は両方式とも今の CAD 式のまま (足していく動作がコマンドには自然なため)。
    スマホ・タブレットのタップ / 範囲選択はもともと replace。
  - **未実施**: Ctrl / Cmd + クリックで「シンボル内部の図形を直接選択」(1.5) はシンボルの編集 (ステップ 8) と
    一緒に入れる。今は Ctrl / Cmd = 追加。
  - 分かったこと: 選択中の図形のグリップ (端点・中点) の上でクリックするとグリップ編集が始まり、選択は変わらない
    (どちらの方式でも同じ)。ステップ 7 でバウンディングボックス変形に変えるときに扱う。
  - テスト: jest `AcEdSelectionAction.spec.ts` / `AcEdSelectionToggle.spec.ts`、e2e `selection-style.spec.ts`
    (fixture `two-lines.dxf`)。
- 以下は着手前の調査メモ:
- `packages/cad-simple-viewer/src/editor/view/AcEdSelectionAction.ts`
  - `resolvePointerSelectionAction()` がクリックの既定を `'add'` (CAD 式) にしている。
  - `resolveSelectionActionFromEvent()` は今 Shift = remove / Ctrl・Meta = add。
- 呼び出し元: `AcTrView2d.getPointerSelectionAction()` (1046 行付近)、`AcEdBaseView.ts` (923 行付近)。
- 設定は `AcApSettingManager` に置き、ステータスバーのトグルから切り替える。
- Shift で切り替え (toggle) にするには、`AcEdSelectionAction` に `'toggle'` を追加する必要がある。

### ステップ 4: 右サイドバーの「選択範囲」セクション + シンボルのプロパティ (済)
- **実施内容 (結果)**:
  - 調べた結果: 元のプロパティパネルは `editable` が渡されておらず**全項目が読み取り専用**だった
    (編集のイベント `update-property` も誰も受けていない)。複数選択の共通値は `===` で比べていたので、
    色 (`AcCmColor`) のようなオブジェクトは同じ値でも必ず「違う」扱いになっていた。
  - 構成: 計算は `cad-viewer/src/composable/entityInspector.ts` (DB に触らない純粋関数。jest
    `__tests__/entityInspector.spec.ts`)、DB への書き込みと再描画は `composable/useEntityInspector.ts`、
    画面は `component/palette/MlEntityProperties.vue` (作り直し) と `palette/inspector/` の
    `MlInspectorInput.vue` (Enter / フォーカスを外したときだけ確定、Esc で戻す。全角数字も可)・`MlAnchorPicker.vue` (9 点)。
    `MlPaletteManager.vue` は選択中の ID を渡すだけになった。
  - 編集: 1 回の変更 = 1 回の Undo (`acapRunDatabaseEdit` + `openEntityForWrite` で、データモデルの
    `properties` のアクセサーを書き込み用に開いた図形に対して呼ぶ)。ロックされたレイヤーの図形は飛ばし、
    一部がロックされているときは上部に注意書き、全部なら読み取り専用。読み取り専用で開いた文書も編集不可。
    Undo / Redo や他の操作のあとも `undo-stack-changed` で表示を更新する。
  - 項目の種類ごとの入力: レイヤー = `MlLayerSelect`、線の種類 = `MlLineTypeSelect`、線の太さ = `MlLineWeightSelect`、
    色 = `MlColorDropdown`、列挙 = セレクト、数値・文字 = `MlInspectorInput`。透過性は編集部品が無いので読み取り専用のまま。
    配列 (ポリラインの頂点など) は 1 図形のときだけ、番号を切り替えて読み取り専用で表示する。
    角度 (`rotation` / `startAngle` / `endAngle`、ラジアンで保存されている図形だけ) は**度**で表示・入力する。
    数値の桁数は図面の精度に従う: 長さ・座標・面積は LUPREC、角度は AUPREC (「図面の単位」ダイアログで変えるとすぐ反映)。
    倍率・線の間隔スケール・幅係数・法線など単位の無い値は丸めない (最大 6 桁)。末尾の 0 は付けない。
  - 複数選択: どの図形にもある項目 (グループ名 + 項目名が一致) だけを出す (種類が混ざると「一般」だけになる)。
    値が揃っていなければ「複数の値」と表示し、変更すると全部に入る。ハンドルは 1 図形のときだけ表示。
  - シンボル (全部がシンボルのとき): 「一般 / 配置 (位置 X・Y、回転、倍率 X・Y) / シンボル (シンボル名) /
    シンボルのプロパティ / 詳細 (Z・法線など、最初は折りたたみ)」に並べ替える。ja の「尺度」は「倍率」にした。
  - **選択範囲** (2 個以上のとき一番上): X / Y / 幅 / 高さと 9 点の基準点 (既定は左下)、種類ごとの件数のボタン
    (押すとその種類だけを選択し直す。旧ドロップダウンの「1 個ずつ見る」の代わり)、長さの合計 (`length` /
    `arcLength` / `perimeter` を持つ図形)、面積の合計 (閉じたポリライン・円・閉じた楕円・塗りつぶし)。
    - X / Y の変更は平行移動、**幅・高さの変更は基準点を中心にした縦横比固定の拡大縮小**にした
      (円・文字・シンボルは片方向だけに伸ばせないため)。範囲は `geometricExtents` の和で、無限の構築線・放射線は除く。
    - 範囲の数値は Undo に乗る (`entityService.transformEntities`、ロックされたレイヤーは飛ばす)。
  - **シンボルのプロパティ**: 欄の名前は ATTDEF の問い合わせ文、無ければタグ (ツールチップに両方)。
    非表示の項目は目のアイコン付きで薄く、定数は鍵アイコンで読み取り専用。同じシンボルの複数選択は項目ごとに「複数の値」、
    違うシンボルが混ざっていれば共通するタグだけ (タグは大文字小文字を区別しない)。書き込みは `useAttEdit.ts` に移した
    `openAttributeForWrite()` (`MlAttEditDlg.vue` と共用) で行い、書いたあとシンボルを `updateEntity` で描き直す。
  - **ダブルクリック**: 選択方式が「シンプル」(`selectionStyle === 'simple'`) のときだけ、属性付きシンボルを
    ダブルクリックすると `MlAttEditDlg` を開く代わりに `eventBus` の `focus-symbol-property` を出し、
    パレットの「プロパティ」タブを開いて該当欄 (属性の文字を押したらその欄、シンボルの線なら最初の欄) にフォーカスする。
    受け手 (cad-viewer) がいないとき (シンプルビューアなど) は従来どおり `attedit`。
    操作プロファイル (ステップ 6) を入れたら、条件を `selectionStyle` からプロファイルに置き換える。
  - **未実施**: 「+ プロパティを追加」と [シンボルを編集] ボタンはシンボルの編集 (ステップ 8) と一緒に入れる。
    右サイドバーからの「この値で条件で選択」はステップ 5。
  - 分かったこと: 非表示 (フラグ 1) の属性も画面に描かれている (描画側の既存の挙動。ATTMODE 未対応)。
    e2e 用の DXF で ATTRIB を INSERT に結び付けるには、ATTRIB にハンドル (5) と所有者 (330 = INSERT のハンドル) が要り、
    タグなどはサブクラスマーカー (`100 AcDbAttribute`) の後ろに置かないと読まれない。
  - テスト: jest `cad-viewer/__tests__/entityInspector.spec.ts`、e2e `property-inspector.spec.ts`
    (fixture `symbol-attributes.dxf`: DOOR シンボル 2 個 + 線 2 本)。
- 以下は着手前の調査メモ:
- `packages/cad-viewer/src/component/palette/MlEntityProperties.vue` (今は複数選択を 1 図形ずつドロップダウンで切り替える形)、`composable/useSelectionSet.ts`。
- 属性: `component/dialog/MlAttDefDlg.vue`, `MlAttEditDlg.vue`, `composable/useAttEdit.ts`。

### ステップ 5: 条件で選択ペイン (保留)
- ユーザーの判断で保留にし、先にステップ 6 を行った。
- 今の実装: `component/dialog/MlQuickSelectDlg.vue`, `composable/useQuickSelect.ts`, `command/AcApQSelectCmd.ts`。
- ペインの登録: `component/palette/MlPaletteManager.vue`。

### ステップ 6: ツール層 + カーソル + 選択ツールに戻るボタン + Esc の段階動作 (済)
- **着手時に決めたこと** (ユーザーと合意):
  - 「作図が 1 回終わったら選択ツールに戻る」の 1 回 = **線は 1 本** (2 点目で終わる)。ポリラインはダブルクリック / Enter で終わる。
    矩形・円などはもともと 1 個で終わる。
  - シンプルでも**コマンドラインは表示したまま** (ステップ 8 のコマンドパレットまで)。
  - プロファイルの切り替えは**ステータスバーのボタン** (旧「選択方式」ボタンを置き換え)。切り替えると選択方式も連動する。
    選択方式だけを変えたい人向けに、設定メニューに「クリックで選択を置き換える」を残した。
  - **既定はシンプル**。
- **実施内容 (結果)**:
  - 設定 (`AcApSettingManager`): `operationProfile: 'cad' | 'simple'` (既定 `'simple'`)、`continuousDraw` (既定 `false`)。
    `operationProfile` のセッターは `selectionStyle` も同じ値にする。`selectionStyle` の既定も `'simple'` にした。
    以前のビルドで選択方式を切り替えていた人は、その値をプロファイルに引き継ぐ (`migrateStoredSettings`)。
  - 入力待ちのイベント: `AcEditor.events.promptStarted` (`{ message }`) / `promptEnded` (`{ status }`)。
    `AcEdInputManager.executePrompt()` (getPoint など全プロンプトが通る 1 か所) で出す。
  - ツール層 `cad-simple-viewer/src/app/AcApToolManager.ts` (ビューごとに 1 つ、`view.toolManager`)。ツール = 既存コマンド。
    `commandWillStart` / `commandEnded` / `promptStarted` / `promptEnded` を見て次を行う (シンプルのときだけ。CAD では状態を通知するだけ):
    - カーソル: 選択ツール = 矢印、パン = 手、コマンドが入力待ちの間 = 十字。CAD は従来どおり十字。
      **OrbitControls は作られるたびに canvas の cursor を `auto` に戻す** (connect → disconnect)。
      レイアウトのビューを作ったとき・切り替えたときにカーソルを付け直す (CAD プロファイルでも、ファイルを開いたあと十字が消えていた不具合が直った)。
    - カーソル横の入力待ちの文言の前にツール名を出す (`線: 次の点を指定`)。`view.promptBadge` を `AcEdFloatingMessage` が読む。
    - 線は 2 点目を取ったら、次の入力待ちに空の入力 (= Enter) を入れて終わらせる (`SINGLE_SHOT_POINTS`)。
      スクリプト (入力付きの `sendStringToExecute`) で動かしたコマンドには何もしない。
    - 入力待ちが 1 回以上あったコマンドが終わったら選択ツールに戻す (パンにいても)。
      連続作図が ON なら作図コマンド (`DRAW_TOOLS`) を `setTimeout` でもう一度起動する。ただし別のコマンドが先に始まったら起動しない。
    - Esc の段階: ① 実行中のコマンドを取り消す (選択は残す) → ② パンから選択ツールへ → ③ 選択を解除。
      連続作図中は、点を 1 つでも取っていれば ① でそのツールにとどまり、何も取っていなければ選択ツールに戻る。
    - 状態は `AcApToolManager.events.changed` (static) で `{ view, tool, label, prompt }` を通知。ツール名は i18n `main.tool.*`。
  - キー (`view/AcEdViewKeyHandler.ts`、シンプルのときだけ): V 選択 / H パン / L 線 / R 矩形 / T 文字 (`AcApToolShortcuts.ts`、`e.code` で判定)。
    コマンドの実行中・修飾キー付き・文字入力中は無効。開いている文書で使えないコマンド (読み取り専用で線など) も無視。
    Space を押している間だけパン (コマンド実行中は無効。keyup と window の blur で戻す)。
    - コマンドラインは入力待ちのたびに自分でフォーカスを取るので、**空のコマンドラインで、ユーザーがクリックして入ったのでない**ときは
      「文字入力中」と見なさない (`AcEdCommandLine` がクリックで `data-user-focus` を付け、blur で外す)。
    - 空のコマンドラインでの Esc は、シンプルではビューに渡す (CAD は従来どおりコマンドラインが「*キャンセル*」で受ける)。
    - 入力ボックスが消えるとフォーカスが `<body>` に落ち、ビューのキー処理 (ビューの中のキーだけ扱う) に届かなくなる。
      コマンドが終わったとき、フォーカスがどこにも無ければビューのコンテナに戻す。
  - ダブルクリックで属性付きシンボルの欄にフォーカスする条件を `selectionStyle` から `operationProfile` に変えた。
  - UI (cad-viewer): ステータスバーに使用中のツールと入力待ちの文言 (`MlToolStatus.vue`、`useActiveTool`) と
    プロファイル切り替え (`MlOperationProfileButton.vue`、「シンプル」/「CAD」の文字ボタン)。
    設定メニューに「クリックで選択を置き換える」「作図を続ける (選択ツールに戻らない)」(後者はシンプルのときだけ)。
    左ツールバーのツールチップに、シンプルのときだけショートカットキーを併記 (`選択 (V)` など)。`MlSelectionStyleButton.vue` は削除。
  - 「選択ツールに戻るボタン」は、左ツールバーの一番上の選択ボタンがそのまま役目を果たす (押すと実行中のコマンドを取り消して選択ツールへ)。
  - テスト: jest `AcApToolManager.spec.ts`・`AcEdViewKeyHandler.spec.ts` (シンプルのキー)・`AcApSettingManager.spec.ts`、
    e2e `simple-tools.spec.ts` (fixture `two-lines.dxf`)。`selection-style.spec.ts` / `property-inspector.spec.ts` は既定がシンプルになったのに合わせて直し、
    `draw-after-load.spec.ts` は CAD プロファイルで動かす。
- **未実施 / 残り**:
  - プロファイル別の用語辞書 (1.2 の方式 (a)) は入れていない。今は両プロファイルとも一般用語。
  - 右クリックの挙動とコマンドラインの表示はプロファイルで変えていない (ステップ 8)。
  - Space でのパンはコマンドの実行中には効かない (入力待ちのクリックと区別する仕組みが要る)。作図中は中ボタンのドラッグでパンできる。
  - 単キーのツールはコマンドの実行中 (連続作図で次の作図を待っているときも) は効かない。Esc で選択ツールに戻ってから押す。
- 以下は着手前の調査メモ:
- `editor/input/AcEdCursorManager.ts`, `editor/input/AcEditor.ts`, `editor/command/AcEdCommandStack.ts`, `view/AcEdViewKeyHandler.ts`。
- 操作プロファイル (1.1) の切り替えはこのステップで入れる。

### ステップ 7: ドラッグ移動・矢印キー移動・バウンディングボックス変形・整列ガイド
- グリップ編集の仕組みを流用する: `editor/grip/AcEdGripManager.ts`, `AcEdGripEditSession.ts`, `AcEdGripPreviewJig.ts`。
- 移動・複製は `command/modify/` の既存コマンドを使い、Undo に乗せる。

### ステップ 8: シンボルの中に入る編集・コマンドパレット・右クリックメニュー・上部バー

---

## 3. 新しいセッションの始め方

1. `CLAUDE.md` → この `UX-PLAN.md` の順に読む。
2. `main` から作業ブランチを切る。
3. 「ステップ N をやって」と指示する。ステップ内で決めることがあれば、着手時にユーザーに確認する。
4. 確認: `npx jest` (ルートで)、`pnpm --filter @mlightcad/cad-viewer-example test:e2e`、`pnpm dev` で実際に操作する。
   push すれば https://cool0707.github.io/remix-cad/preview/<ブランチ名>/ でも確認できる (数分後)。
5. 終わったら、このファイルのステップに「(済)」と、分かったこと (未確認だった点の結果など) を追記する。
