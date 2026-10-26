export default {
  command: {
    ACAD: {
      quit: {
        description:
          'アプリケーションを終了し、開いているすべての図面を閉じます'
      },
      exit: {
        description:
          'アプリケーションを終了し、開いているすべての図面を閉じます'
      }
    }
  },

  example: {
    fileUpload: {
      title: '表示する CAD ファイルを選択',
      subtitle: 'DWG / DXF / JWW・JWC (Jw_cad) / SXF 図面をビューアに読み込みます',
      fontCdnNotice:
        '日本語フォント (BIZ UD) はビューアに同梱されています。その他の文字 (中国語、韓国語、欧文の代替フォントなど) のフォントは、図面で必要になったときに Google Fonts からダウンロードします。Google Fonts にアクセスできない環境では、それらの文字が正しく表示されない場合があります。',
      newDrawing: '新規図面',
      or: 'または',
      dropFile: 'ファイルをドロップ または',
      browse: '参照',

      openOptions: '開くときのオプション',

      initialView: '初期表示',
      auto: '自動',
      autoHint: 'アクセスモードに応じる',
      extents: '範囲',
      extentsHint: '図面全体を表示',
      saved: '保存ビュー',
      savedHint: 'AutoCAD の保存ビュー',
      limits: '図面範囲',
      limitsHint: '図面範囲 (LIMITS) / 用紙',

      accessMode: 'アクセスモード',
      read: '閲覧',
      readHint: '表示のみ',
      review: 'コメント',
      reviewHint: '表示とコメント',
      write: '編集',
      writeHint: 'すべての操作',

      textRendering: '文字の描画',
      worker: 'ワーカー',
      workerHint: '高速、メモリ多め',
      mainThread: 'メイン',
      mainThreadHint: '低速、メモリ少なめ',

      progressive: '段階的',
      progressiveRendering: '段階的な描画',
      on: 'オン',
      progressiveOnHint:
        '解析と変換が終わるまで UI をロックし、その後はシーンの読み込み中も画面移動・ズームできます',
      off: 'オフ',
      progressiveOffHint: 'オブジェクトと文字の変換が完了するまで待ちます',

      nonPlottable: '印刷しないレイヤー',
      nonPlottableLayers: '印刷しないレイヤー',
      hide: '非表示',
      hideHint: 'Web ビューアの既定',
      show: '表示',
      showHint: 'AutoCAD エディタと同じ動作',

      curveQuality: '曲線の品質',
      curveDraft: 'メモリ優先',
      curveDraftHint: '頂点が少なく、ファイルが小さい',
      curveStandard: '標準',
      curveStandardHint: 'バランス (円 1 つあたり 100 辺)',
      curveHigh: '品質優先',
      curveHighHint: '滑らかな曲線、メモリ多め',

      paperSpaceBackground: '用紙の背景',
      paperSpaceWhite: '白',
      paperSpaceWhiteHint: 'デスクトップ CAD / 印刷プレビュー',
      paperSpaceBlack: '黒',
      paperSpaceBlackHint: 'Web ビューアの好み',

      export: '書き出し',
      exportEnable: '有効',
      exportEnableHint: 'DXF/HTML/PDF/SVG/PNG の書き出しを許可',
      exportDisable: '無効',
      exportDisableHint: '書き出しコマンドとファイルメニューの項目を隠す',

      invalidFileType:
        'ファイルの種類が無効です。DWG / DXF / JWW / JWC / SXF (SFC・P21・SFZ・P2Z) ファイルをアップロードしてください。'
    }
  }
}
