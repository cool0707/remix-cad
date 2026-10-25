export default {
  newDrawing: {
    layoutPrefix: '印刷ページ'
  },
  document: {
    untitled: '無題'
  },
  commandLine: {
    noLast: '(直前のコマンドなし)',
    unknownCommand: '不明なコマンド',
    executed: 'コマンドを実行しました',
    showHistory: 'コマンド履歴を表示',
    placeholder: 'コマンドを入力',
    showMessages: 'メッセージ履歴を表示',
    canceled: '*キャンセル*',
    noHistory: '(履歴なし)',
    invalidInput: '入力が無効です。',
    close: 'コマンドラインを閉じる'
  },
  mobileCommand: {
    length: '長さ',
    angle: '角度',
    dx: 'ΔX',
    dy: 'ΔY',
    x: 'X',
    y: 'Y',
    confirm: '確定',
    cancel: 'キャンセル',
    help: 'ヘルプ',
    back: '戻る',
    collapse: '折りたたむ',
    expand: '展開'
  },
  inputManager: {
    firstCorner: '1 点目のコーナーを指定 または',
    secondCorner: 'もう一方のコーナーを指定 または'
  },
  message: {
    onLockedLayer: 'はロックされたレイヤー上にあります。',
    fetchingDrawingFile: 'ファイルを取得しています...',
    exportingDxf: 'DXF を書き出しています...',
    exportingPdf: 'PDF を書き出しています...',
    exportingSvg: 'SVG を書き出しています...',
    exportingDrawing: '{format} を書き出しています...',
    exportApproximate: '{format} に書き出しました。一部の要素は近似して書き出しています (詳細はブラウザのコンソール)。',
    exportFailed: '{format} に書き出せませんでした: {error}',
    calculatingSmartExtents: '表示範囲を計算しています...',
    importingPdf: 'PDF を読み込んでいます...',
    exportingEntityPreview: '画像を書き出しています...',
    collectingMemoryProfile: 'メモリを分析しています...',
    fontCached: 'フォントをキャッシュしました',
    fontCacheFailed: 'フォントのキャッシュに失敗しました',
    fontsNotFound: 'フォントリポジトリに見つからないフォント: {fonts}。',
    fontsNotLoaded: 'フォントの読み込みに失敗しました: {fonts}。',
    fontMissedInDrawing:
      'フォント「{font}」は {count} 個の文字オブジェクトで使用されていますが、利用できません。「{replacementFont}」で表示します。',
    fontMissedReplacement: '「{font}」(「{replacement}」で表示)',
    failedToGetAvaiableFonts:
      '「{url}」から利用可能なフォントを取得できませんでした。',
    failedToOpenFile: 'ファイル「{fileName}」を開けませんでした。',
    failedToOpenFileToast:
      '「{fileName}」を開けませんでした。詳細は通知センターを確認してください。',
    failedToOpenFileWorkerOom:
      '「{fileName}」を開けませんでした。使用可能なメモリが不足したため解析に失敗しました (LibreDWG パーサー)。{dwgParserLink}から商用 DWG パーサーを購入すると、大きな図面もこのエラーなしで開けます。',
    failedToOpenFileWorkerOomLink: 'こちらのページ',
    failedToOpenFileWorkerTimeout:
      '「{fileName}」を開けませんでした。図面の解析中にタイムアウトしました。',
    failedToOpenFileFontLoadFailed:
      '「{fileName}」を開けませんでした。必要なフォントを読み込めませんでした。',
    failedToOpenFileLicenseExpired:
      '「{fileName}」を開けませんでした。DWG コンバーターのライセンスの有効期限が切れています。',
    failedToOpenFileLicenseInvalid:
      '「{fileName}」を開けませんでした。DWG コンバーターのライセンスがないか無効です。',
    unknownEntities:
      'この図面には不明またはサポートされていないオブジェクトが {count} 個含まれています。これらは表示されません。',
    tianzhengEntities:
      'この図面には TArch / 天正 (または同様のサードパーティ製) のカスタムオブジェクトが約 {count} 個含まれています。この環境では完全に解析できないため、一部の内容が表示されない場合があります。',
    emptyProxyEntities:
      'この図面にはプロキシ図形を持たないカスタムオブジェクトが {count} 個含まれています。これらは表示されません。'
  },
  notification: {
    center: {
      title: '通知',
      clearAll: 'すべてクリア',
      noNotifications: '通知はありません'
    },
    group: {
      fontMissed: '見つからないフォント',
      fontMissedSummary:
        'フォントに関するメッセージが {count} 件あります。クリックすると詳細を表示します。',
      unsupportedEntities: 'サポートされていないオブジェクト',
      unsupportedEntitiesSummary:
        '解析に関するメッセージが {count} 件あります。クリックすると詳細を表示します。',
      genericSummary:
        'メッセージが {count} 件あります。クリックすると詳細を表示します。'
    },
    title: {
      failedToOpenFile: 'ファイルを開けませんでした',
      failedToOpenFileWorkerOom: 'メモリ不足',
      failedToOpenFileWorkerTimeout: 'タイムアウト',
      failedToOpenFileFontLoadFailed: 'フォントの読み込み失敗',
      failedToOpenFileLicenseExpired: 'ライセンス期限切れ',
      failedToOpenFileLicenseInvalid: '無効なライセンス',
      fontNotFound: 'フォントが見つかりません',
      fontNotLoaded: 'フォントを読み込めません',
      parsingWarning: '図面の解析に関する問題',
      systemMessage: 'システムメッセージ',
      systemWarning: 'システム警告',
      systemError: 'システムエラー',
      systemInfo: 'システム情報'
    }
  },
  progress: {
    start: 'ファイルの解析を開始しています...',
    parse: 'ファイルを解析しています...',
    font: '図面に必要なフォントをダウンロードしています...',
    ltype: '線の種類を解析しています...',
    style: '文字スタイルを解析しています...',
    dimstyle: '寸法スタイルを解析しています...',
    layer: 'レイヤーを解析しています...',
    vport: 'ビューポートを解析しています...',
    blockrecord: 'シンボルの定義を解析しています...',
    header: 'ヘッダーを解析しています...',
    block: 'シンボルを解析しています...',
    entity: 'オブジェクトを解析しています...',
    object: '名前付きディクショナリを解析しています...',
    rendering: '図面を描画しています...',
    end: '完了しました'
  },
  about: {
    title: 'バージョン情報',
    close: '閉じる',
    product: 'CAD Viewer',
    tagline: 'DWG / DXF / JWW / SXF 図面を開ける Web CAD ビューア。',
    website: 'Web サイト',
    docs: 'ドキュメント',
    repository: 'GitHub',
    copyright: '© {year} RemixCAD. MIT ライセンスで公開しています。',
    ok: 'OK'
  },
  drawStyle: {
    color: '色',
    fontSize: '文字の高さ'
  },
  shortCutToolbar: {
    more: 'その他',
    undo: '元に戻す',
    redo: 'やり直し',
    erase: '削除',
    collapse: 'ツールバーを折りたたむ',
    expand: 'ツールバーを展開'
  },
  textHeight: {
    title: '文字の高さ',
    close: '閉じる',
    ok: 'OK',
    cancel: 'キャンセル',
    adaptive: '画面に合わせる',
    custom: '文字の高さを指定',
    customPlaceholder: '図面上の高さ',
    fromScreen: '画面上のサイズから',
    fromScreenHint:
      '現在のズームで画面上に表示したい文字の大きさを入力します。図面上の固定の高さに変換されるため、後でズームしても変わりません。',
    screenPxPlaceholder: 'フォントサイズ',
    screenUnit: 'px',
    convert: '変換'
  },
  entityPick: {
    cancel: '選択をキャンセル'
  },
  colorPicker: {
    title: '色を選択',
    close: '閉じる',
    ok: 'OK',
    cancel: 'キャンセル',
    index: 'インデックスカラー: ',
    rgb: 'RGB: ',
    input: '色',
    inputPlaceholder: '1～255 または #RRGGBB'
  },
  touchPointTutorial: {
    title: '点を正確に指定するには',
    description:
      '画面を約 0.5 秒長押しします。指の上に十字カーソルが表示されて指の動きに追従し、図形にスナップするので、より正確に指定できます。',
    snoozeToday: '今日は表示しない',
    hideForever: '今後表示しない',
    ok: 'わかりました'
  },
  dataSource: {
    open: '開く',
    local: 'ローカルファイル',
    url: 'URL から',
    openFrom: '{name} から開く',
    signInTo: '{name} にサインイン',
    signOutOf: '{name} からサインアウト',
    signOutOfAccount: '{name} からサインアウト ({account})',
    urlDialogTitle: 'URL から開く',
    urlDialogHint: '.dwg または .dxf ファイルの URL を入力してください。',
    urlPlaceholder: 'https://example.com/drawing.dwg',
    cancel: 'キャンセル',
    onedrive: 'OneDrive',
    googledrive: 'Google ドライブ',
    or: 'または',
    dropFile: 'ここにファイルをドロップ または',
    browse: '参照',
    dropOrBrowse: '図面ファイルをここにドロップ、または参照',
    newDrawing: '新規図面',
    source: 'ソース',
    unavailable: 'このソースはまだ利用できません。',
    selectFile: 'ファイルを選択',
    signInRequired: 'ファイルを選択するには先にサインインしてください。',
    downloading: 'ファイルをダウンロードしています...'
  }
}
