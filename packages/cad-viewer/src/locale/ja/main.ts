export default {
  mainMenu: {
    new: '新規図面',
    open: '図面を開く',
    drawingUnits: '図面単位',
    exportMenu: '書き出し',
    export: 'DXF に書き出し',
    exportHtml: 'HTML に書き出し',
    exportPdf: 'PDF に書き出し',
    exportSvg: 'SVG に書き出し',
    exportAs: '{format} に書き出し',
    exportImage: '画像に書き出し',
    exportImageArea: '選択範囲を画像に書き出し',
    settings: '環境設定',
    about: 'バージョン情報'
  },
  ribbon: {
    tab: {
      home: 'ホーム',
      insert: '挿入',
      review: 'レビュー',
      measurement: '計測',
      hatchContext: '塗りつぶし',
      mtextEditorContext: '文字エディタ'
    },
    hatch: {
      group: {
        boundary: '境界',
        pattern: 'パターン',
        properties: 'プロパティ',
        options: 'オプション',
        close: '閉じる'
      },
      command: {
        pickPoints: '点をクリック',
        selectObjects: 'オブジェクトを選択',
        close: '閉じる'
      },
      field: {
        pattern: 'パターン',
        scale: '大きさ',
        angle: '角度',
        style: 'スタイル',
        associative: '自動調整',
        fillType: '塗りつぶしの種類',
        fillColor: '色',
        patternColor: 'パターンの色',
        gradient1Color: 'グラデーション色 1',
        backgroundColor: '背景色',
        gradient2Color: 'グラデーション色 2',
        opacity: '透過性',
        gapTolerance: '隙間の許容値',
        imageScale: 'イメージの尺度'
      },
      style: {
        normal: '標準',
        outer: '外側',
        ignore: '無視'
      },
      fillType: {
        solid: 'ソリッド',
        pattern: 'パターン',
        gradient: 'グラデーション'
      },
      associative: {
        on: 'オン',
        off: 'オフ'
      },
      tooltip: {
        pickPoints: '内側の点をクリックして塗りつぶし領域を作成します。',
        selectObjects: '塗りつぶす範囲を囲むオブジェクトを選択します (閉じた図形、または組み合わせて閉じる線)。',
        pattern: '塗りつぶしパターン名を選択します。',
        scale:
          '模様の大きさを倍率で設定します (尺度)。図面を開いたときは用紙の縮尺 (1/100 なら 100) になります。',
        angle: '塗りつぶしパターンの角度 (度) を設定します。',
        style: '塗りつぶし作成時の島の検出スタイルを設定します。',
        associative: '自動調整の塗りつぶしのオン/オフを切り替えます。',
        fillType:
          '塗りつぶしの種類 (ソリッド、パターン、グラデーション) を選択します。',
        fillColor: '塗りつぶしの色を選択します。',
        patternColor: 'パターンの線の色を選択します。',
        gradient1Color: 'グラデーションの 1 つ目の色を選択します。',
        backgroundColor: 'パターン塗りつぶしの背景色を選択します。',
        gradient2Color: 'グラデーションの 2 つ目の色を選択します。',
        opacity: '塗りつぶしの透過性 (0～90) を設定します。',
        gapTolerance: '線の端どうしにこの幅 (図面単位) までの隙間があっても閉じた境界とみなします (HPGAPTOL、0〜5000)。',
        imageScale: '塗りつぶしイメージの尺度を設定します。',
        close: '塗りつぶしの作成を終了し、このコンテキストタブを閉じます。'
      }
    },
    mtext: {
      group: {
        textStyle: '文字スタイル',
        format: '書式',
        paragraph: '段落',
        insert: '挿入',
        close: '閉じる'
      },
      field: {
        textStyle: '文字スタイル',
        font: 'フォント',
        color: '色',
        height: '高さ',
        obliqueAngle: '傾斜角度',
        tracking: 'トラッキング',
        widthFactor: '幅係数'
      },
      characterMap: {
        title: '文字コード表',
        font: 'フォント(F):',
        charsToCopy: 'コピーする文字(A):',
        select: '選択(S)',
        copy: 'コピー(C)',
        noGlyphs: 'このフォントで使用できる文字はありません。',
        copyFailed: 'クリップボードにコピーできませんでした。'
      },
      command: {
        bold: '太字',
        underline: '下線',
        superscript: '上付き',
        italic: '斜体',
        overline: '上線',
        subscript: '下付き',
        strikethrough: '取り消し線',
        stack: 'スタック',
        toggleCase: '大文字/小文字',
        attachment: '位置合わせ',
        list: '箇条書きと段落番号',
        lineSpacing: '行間隔',
        paragraphAlignment: '段落の位置合わせ',
        symbol: '記号',
        close: '閉じる'
      },
      tooltip: {
        textStyle: '現在の図面の文字スタイルを選択します。',
        bold: '太字のオン/オフを切り替えます。',
        underline: '下線のオン/オフを切り替えます。',
        superscript: '上付きのオン/オフを切り替えます。',
        italic: '斜体のオン/オフを切り替えます。',
        overline: '上線のオン/オフを切り替えます。',
        subscript: '下付きのオン/オフを切り替えます。',
        strikethrough: '取り消し線のオン/オフを切り替えます。',
        stack: '選択した分数の文字をスタック/スタック解除します。',
        toggleCase: '選択した文字の大文字と小文字を切り替えます。',
        font: '現在の文字のフォントを設定します。',
        color: '現在の文字の色を設定します。',
        height: '現在の文字の高さを設定します。任意の値も入力できます。',
        obliqueAngle:
          '選択した文字の傾斜角度 (度) を設定します (負の値で逆方向に傾きます)。',
        tracking: '選択した文字の間隔を広げる/狭めます (既定値は 1)。',
        widthFactor: '選択した文字を横方向に伸縮します (既定値は 1)。',
        attachment: 'マルチテキストの位置合わせの基点を設定します。',
        list: '箇条書きと段落番号を挿入または設定します。',
        lineSpacing: '行間隔を設定します。',
        paragraphAlignment: '段落の水平方向の位置合わせを設定します。',
        symbol: 'よく使う製図記号を挿入します。',
        close: '文字エディタとこのコンテキストタブを閉じます。'
      },
      attachment: {
        TL: '左上 TL',
        TC: '上中心 TC',
        TR: '右上 TR',
        ML: '左中央 ML',
        MC: '中央 MC',
        MR: '右中央 MR',
        BL: '左下 BL',
        BC: '下中心 BC',
        BR: '右下 BR'
      },
      list: {
        off: 'オフ',
        number: '番号付き',
        letter: 'アルファベット',
        bullet: '箇条書き',
        start: '開始',
        continue: '継続',
        auto: '箇条書きと段落番号の自動設定を許可',
        allowList: '箇条書きとリストを許可'
      },
      lineSpacing: {
        more: 'その他...',
        clear: '段落の間隔をクリア'
      },
      paragraphAlign: {
        default: '既定',
        left: '左',
        center: '中心',
        right: '右',
        justified: '両端揃え',
        distributed: '均等割り付け'
      },
      symbol: {
        degree: '度  %%d',
        plusMinus: 'プラス/マイナス  %%p',
        diameter: '直径  %%c',
        almostEqual: 'ほぼ等しい  \\U+2248',
        angle: '角度  \\U+2220',
        boundary: '境界線  \\U+E100',
        centerLine: '中心線  \\U+2104',
        delta: 'デルタ  \\U+0394',
        electricalPhase: '電気位相  \\U+0278',
        flowLine: 'フローライン  \\U+E101',
        identical: '恒等  \\U+2261',
        notEqual: '等しくない  \\U+2260',
        ohm: 'オーム  \\U+2126',
        omega: 'オメガ  \\U+03A9',
        propertyLine: '敷地境界線  \\U+214A',
        subscriptTwo: '下付き 2  \\U+2082',
        squared: '2 乗  \\U+00B2',
        cubed: '3 乗  \\U+00B3',
        nbsp: 'ノーブレークスペース Ctrl+Shift+Space',
        other: 'その他...'
      }
    },
    group: {
      draw: '作成',
      modify: '修正',
      layer: 'レイヤー',
      properties: 'プロパティ',
      utilities: 'ユーティリティ',
      annotation: '注釈',
      review: 'レビュー',
      measurement: '計測',
      style: 'スタイル',
      lengthUnits: '長さの単位',
      angleUnits: '角度の単位',
      reference: '参照',
      block: 'シンボル'
    },
    insertBlock: {
      empty: '使用できるシンボルはありません',
      currentDrawing: '現在の図面',
      previewMenu: 'シンボルのプレビューギャラリー'
    },
    property: {
      color: '色',
      lineColor: '線の色',
      lineType: '線の種類',
      lineWeight: '線の太さ'
    },
    layerTools: {
      select: 'レイヤー',
      off: 'レイヤー非表示',
      isolate: '選択表示',
      lock: 'レイヤーロック',
      current: '現在に設定',
      allOn: '全レイヤー表示',
      unisolate: '選択表示解除',
      unlock: 'レイヤーロック解除',
      restore: 'レイヤーを元に戻す'
    },
    arc: {
      threePoint: '3 点',
      startCenterEnd: '始点、中心、終点',
      startCenterAngle: '始点、中心、角度',
      startCenterLength: '始点、中心、弦の長さ',
      startEndAngle: '始点、終点、角度',
      startEndDirection: '始点、終点、方向',
      startEndRadius: '始点、終点、半径',
      centerStartEnd: '中心、始点、終点',
      centerStartAngle: '中心、始点、角度',
      centerStartLength: '中心、始点、弦の長さ'
    },
    circle: {
      centerRadius: '中心、半径',
      centerDiameter: '中心、直径',
      twoPoint: '2 点',
      threePoint: '3 点',
      tanTanRadius: '接点、接点、半径',
      tanTanTan: '接点、接点、接点'
    },
    ellipse: {
      ellipse: '楕円',
      arc: '楕円弧'
    },
    tooltip: {
      line: '1 本の線分を作成します。',
      polyline: '連続した線分や円弧を 1 つのオブジェクトとして作成します。',
      spline:
        'フィット点または制御点を通る滑らかなスプライン曲線を作成します。',
      sketch: 'フリーハンドの一連の線分を作成します。',
      revcloud: '図面の領域を強調する雲マークを作成します。',
      circle: 'さまざまな方法で円を作成します。',
      arc: 'さまざまな方法で円弧を作成します。',
      mline: '複数の平行線を 1 つのマルチラインとして作成します。',
      ray: '始点から一方向に無限に延びる放射線を作成します。',
      xline: '無限に延びる構築線を作成します。',
      ellipse: '楕円または楕円弧を作成します。',
      rect: '長方形または正多角形を作成します。',
      point: '図面に点オブジェクトを配置します。',
      hatch: '閉じた領域をパターンで塗りつぶします (ハッチング)。',
      text: '図面にマルチテキストの注釈を作成します。',
      move: '選択したオブジェクトを新しい位置に移動します。',
      rotate: '選択したオブジェクトを基点を中心に回転します。',
      copy: '選択したオブジェクトを新しい位置に複写します。',
      erase: '選択したオブジェクトを図面から削除します。',
      offset: 'オブジェクトを指定した距離に平行に複写します。',
      undo: '直前の編集操作を元に戻します。',
      redo: '元に戻した編集操作をやり直します。',
      properties: '現在の選択のプロパティパレットを開きます。',
      quickSelect:
        '条件で選択 (クイック選択) を開き、種類やレイヤーなどの条件でオブジェクトを絞り込んで選択します。',
      find: '検索パレットを開き、図面全体または現在の印刷ページの文字を検索します。',
      countList:
        '個数カウントパレットを開き、シンボル (ブロック) の個数を確認・管理します。',
      missingResources:
        'フォント、イメージ、リンク図面 (外部参照) の不足/外部リソースパレットを開きます。',
      drawingUnits: '図面単位を開き、座標の形式、精度、挿入尺度を設定します。',
      attachDwg:
        'DWG または DXF 図面をリンク図面 (外部参照) としてアタッチします (XATTACH)。',
      attachImage: 'ラスター画像をリンクとしてアタッチします (IMAGEATTACH)。',
      insert:
        'シンボル (ブロック) パレットを開き、シンボルの定義を参照して挿入します (INSERT)。',
      editAttributes:
        'シンボルのプロパティ (ブロック属性) の値と表示設定を編集します (ATTEDIT)。',
      defineAttribute:
        'シンボルで使用するプロパティ (属性定義) を作成します (ATTDEF)。',
      agent:
        'CAD エージェントのパレットタブを開き、自然言語で図形を作成します。',
      propertyColor:
        '新しく作成するオブジェクトまたは選択したオブジェクトの色を設定します。',
      propertyLineType:
        '新しく作成するオブジェクトまたは選択したオブジェクトの線の種類 (線種) を設定します。',
      propertyLineWeight:
        '新しく作成するオブジェクトまたは選択したオブジェクトの線の太さを設定します。',
      layerAction: {
        off: '選択したレイヤー (画層) を非表示にします。',
        isolate:
          '選択したレイヤーだけを表示し、他のレイヤーを隠して関連するオブジェクトに集中できるようにします。',
        lock: '選択したレイヤーをロックします。オブジェクトは表示されたまま編集できなくなります。',
        current:
          '選択したレイヤーを現在のレイヤーにし、新しいオブジェクトをそのレイヤーに作成します。',
        allOn: '非表示になっているすべてのレイヤーを表示します。',
        unisolate:
          '選択表示で非表示またはロックされたレイヤーを元に戻します。その後のレイヤーの変更は保持されます。',
        unlock:
          '選択したレイヤーのロックを解除し、オブジェクトを再び選択・修正できるようにします。',
        restore: 'このリボンで直前に行ったレイヤー操作の前の状態に戻します。'
      },
      circleOption: {
        centerRadius: '中心点と半径を指定して円を作成します。',
        centerDiameter: '中心点と直径を指定して円を作成します。',
        twoPoint: '2 点で直径を指定して円を作成します。',
        threePoint: '3 点を通る円を作成します。',
        tanTanRadius:
          '2 つのオブジェクトに接する、指定した半径の円を作成します。',
        tanTanTan: '3 つのオブジェクトに接する円を作成します。'
      },
      arcOption: {
        threePoint: '始点、2 点目、終点を通る円弧を作成します。',
        startCenterEnd: '始点、中心点、終点を指定して円弧を作成します。',
        startCenterAngle: '始点、中心点、中心角を指定して円弧を作成します。',
        startCenterLength: '始点、中心点、弦の長さを指定して円弧を作成します。',
        startEndAngle: '始点、終点、中心角を指定して円弧を作成します。',
        startEndDirection:
          '始点、終点、始点での接線方向を指定して円弧を作成します。',
        startEndRadius: '始点、終点、半径を指定して円弧を作成します。',
        centerStartEnd: '中心点、始点、終点を指定して円弧を作成します。',
        centerStartAngle: '中心点、始点、中心角を指定して円弧を作成します。',
        centerStartLength: '中心点、始点、弦の長さを指定して円弧を作成します。'
      },
      rectOption: {
        rectangle: '対角のコーナーまたは寸法を指定して長方形を作成します。',
        polygon: '辺の数と作成方法を指定して正多角形を作成します。'
      },
      ellipseOption: {
        ellipse: '長軸と短軸を指定して楕円を作成します。',
        arc: '楕円の軸と円弧の範囲を指定して楕円弧を作成します。'
      }
    },
    command: {
      line: '線分',
      polyline: 'ポリライン',
      circle: '円',
      arc: '円弧',
      mline: 'マルチライン',
      ray: '放射線',
      xline: '構築線',
      ellipse: '楕円',
      spline: 'スプライン',
      sketch: 'スケッチ',
      revcloud: '雲マーク',
      rect: '長方形',
      rectangle: '長方形',
      polygon: 'ポリゴン',
      point: '点',
      divide: '等分割',
      hatch: '塗りつぶし',
      text: '文字',
      gradient: 'グラデーション',
      move: '移動',
      rotate: '回転',
      copy: '複写',
      erase: '削除',
      offset: 'オフセット',
      undo: '元に戻す',
      redo: 'やり直し',
      properties: 'プロパティ',
      quickSelect: '条件で\n選択',
      find: '検索',
      countList: '個数',
      drawingUnits: '図面\n単位',
      attachDwg: 'DWG\nアタッチ',
      attachImage: 'イメージ\nアタッチ',
      insert: '挿入',
      editAttributes: 'プロパティ\n編集',
      defineAttribute: 'プロパティ\n定義',
      agent: 'CAD\nエージェント'
    }
  },
  verticalToolbar: {
    chrome: {
      collapse: 'ツールバーを折りたたむ',
      expand: 'ツールバーを展開',
      moreOverflow: 'その他のツール',
      move: 'ドラッグで移動 (ダブルクリックで元の位置に戻す)',
      layoutMenu: 'ツールバーの配置',
      vertical: '縦置き',
      horizontal: '横置き',
      resetPosition: '元の位置に戻す'
    },
    measure: {
      text: '計測',
      description: '計測ツール'
    },
    measureDistance: {
      text: '距離',
      description: '2 点間の距離を計測します'
    },
    measureContinuous: {
      text: '連続',
      description:
        'Enter またはキャンセルまで点を順に指定して連続した距離を計測します'
    },
    measureAngle: {
      text: '角度',
      description: '共通の頂点を持つ 2 本の線の間の角度を計測します'
    },
    measureArea: {
      text: '面積',
      description: '多角形の面積を計測します'
    },
    measureArc: {
      text: '円弧',
      description: '3 点で定義される円弧の長さを計測します'
    },
    measurePoint: {
      text: '点',
      description: '指定した点の X/Y 座標を計測します'
    },
    measurementPanel: {
      text: 'パネル',
      description: '計測パレットを開きます'
    },
    clearMeasurements: {
      text: 'クリア',
      description: '現在の印刷ページのすべての計測を削除します'
    },
    measurementImport: {
      text: '読み込み',
      description: 'サイドカー JSON ファイルから計測を読み込みます'
    },
    measurementExport: {
      text: '書き出し',
      description: '計測をサイドカー JSON ファイルに書き出します'
    },
    annotation: {
      text: 'レビュー',
      description: 'レビューツール'
    },
    layer: {
      text: 'レイヤー',
      description: 'レイヤー (画層) を管理します'
    },
    text: {
      text: '文字 (マルチテキスト)',
      description: '図面に文字の注釈を作成します'
    },
    pan: {
      text: '画面移動',
      description: '表示方向や倍率を変えずに表示位置を移動します'
    },
    markupPanel: {
      text: 'パネル',
      description: 'マークアップパレットを開きます'
    },
    markupText: {
      text: '文字',
      description: '文字のマークアップを配置します'
    },
    markupCloud: {
      text: '雲マーク',
      description: '雲マークのマークアップを作成します'
    },
    markupRect: {
      text: '長方形',
      description: '長方形のマークアップを作成します'
    },
    markupCircle: {
      text: '円',
      description: '円のマークアップを作成します'
    },
    markupArrow: {
      text: '矢印',
      description: '矢印のマークアップを作成します'
    },
    markupLine: {
      text: '線分',
      description: '線のマークアップを作成します'
    },
    markupCallout: {
      text: '吹き出し',
      description: '吹き出しを作成します'
    },
    markupStamp: {
      text: 'スタンプ',
      description: 'スタンプを配置します'
    },
    markupImport: {
      text: '読み込み',
      description: 'サイドカー JSON ファイルからマークアップを読み込みます'
    },
    markupExport: {
      text: '書き出し',
      description: 'マークアップをサイドカー JSON ファイルに書き出します'
    },
    markupColor: {
      text: '色',
      description: '新しいマークアップの色を設定します'
    },
    markupFontSize: {
      text: '文字の高さ',
      description:
        'マークアップの文字の高さを設定します (画面に合わせる または 図面上の高さ)',
      fit: '画面',
      wcs: 'WCS'
    },
    measurementColor: {
      text: '色',
      description: '選択した計測、またはこれから追加する計測の色を設定します'
    },
    measurementFontSize: {
      text: '文字の高さ',
      description:
        '選択した計測、またはこれから追加する計測の文字の高さを設定します',
      fit: '画面',
      wcs: 'WCS'
    },
    showMarkup: {
      text: '表示',
      description: 'マークアップを表示します'
    },
    hideMarkup: {
      text: '非表示',
      description: 'マークアップを非表示にします'
    },
    showMeasurements: {
      text: '表示',
      description: '計測を表示します'
    },
    hideMeasurements: {
      text: '非表示',
      description: '計測を非表示にします'
    },
    clearMarkups: {
      text: 'クリア',
      description: '現在の印刷ページのすべてのマークアップを削除します'
    },
    select: {
      text: '選択',
      description: 'オブジェクトを選択します'
    },
    switchBg: {
      text: '背景切替',
      description: '作図領域の背景を白と黒で切り替えます',
      disabledInReadingMode: '閲覧モード中は使用できません (背景は白で固定)'
    },
    readingMode: {
      text: '閲覧',
      description:
        '閲覧モードを切り替えます: 白い背景に黒い線で表示してレビューしやすくします'
    },
    zoom: {
      text: 'ズーム',
      description:
        'ズームツール: 保存ビュー、オブジェクト範囲、スマート範囲、窓'
    },
    zoomSaved: {
      text: '保存ビュー',
      description:
        'AutoCAD の保存ビュー (VPORT / 印刷ページの図面範囲)、または開いたときのビューに戻します'
    },
    zoomToExtent: {
      text: '範囲',
      description: 'すべてのオブジェクトの範囲を最大に表示します'
    },
    zoomSmartExtents: {
      text: 'スマート',
      description:
        '遠く離れたオブジェクトを除き、主要な図形のまとまりにズームします'
    },
    zoomToBox: {
      text: '窓',
      description: '長方形の窓で指定した領域を表示します'
    }
  },
  statusBar: {
    setting: {
      commandLine: 'コマンドライン',
      coordinate: '座標',
      entityInfo: 'オブジェクト情報',
      languageSelector: '言語の選択',
      ribbon: 'リボン',
      toolbar: 'ツールバー',
      stats: '統計',
      replaceOnClick: 'クリックで選択を置き換える',
      continuousDraw: '作図を続ける (選択ツールに戻らない)'
    },
    osnap: {
      on: 'スナップをオフにする',
      off: 'スナップをオンにする',
      enabled: 'スナップを使う',
      tooltip: 'オブジェクトスナップ',
      endpoint: '端点',
      midpoint: '中点',
      center: '中心',
      node: '点',
      quadrant: '四半円点',
      intersection: '交点',
      insertion: '挿入基点',
      nearest: '近接点'
    },
    pointStyle: {
      tooltip: '点スタイルを変更'
    },
    fullScreen: {
      on: '全画面表示をオフにする',
      off: '全画面表示をオンにする'
    },
    dynamicInput: {
      on: 'ダイナミック入力をオフにする',
      off: 'ダイナミック入力をオンにする'
    },
    lineWidth: {
      on: '線の太さを非表示',
      off: '線の太さを表示'
    },
    operationProfile: {
      simple: 'シンプル',
      cad: 'CAD',
      simpleTooltip:
        'シンプル操作: クリックで選択を置き換え、作図のあとは選択ツールに戻ります。キー 1 つでツールを切り替え (V 選択 / H パン / L 線 / R 矩形 / T 文字、Space を押しながらドラッグでパン)。押すと CAD (従来) の操作に切り替え',
      cadTooltip:
        'CAD (従来) の操作: クリックするたびに選択に追加し、作図コマンドは Enter / Esc まで続きます。押すとシンプル操作に切り替え'
    },
    orthoMode: {
      on: '直交モードをオフにする',
      off: '直交モードをオンにする'
    },
    polarTracking: {
      on: '極トラッキングをオフにする',
      off: '極トラッキングをオンにする'
    },
    zoom: {
      zoomIn: '拡大',
      zoomOut: '縮小',
      fitAll: '全体表示',
      tooltip:
        '表示倍率 (画面上の長さ : 実際の長さ)。クリックで一覧から選べます'
    },
    theme: {
      toLight: 'ライトテーマに切り替え',
      toDark: 'ダークテーマに切り替え'
    },
    warning: {
      font: '次のフォントが見つかりません。'
    },
    notification: {
      tooltip: '通知を表示'
    },
    export: {
      tooltip: '画像を PNG で書き出し'
    },
    modelTab: 'キャンバス',
    moreLayouts: 'その他の印刷ページ'
  },
  toolPalette: {
    entityProperties: {
      tab: 'プロパティ',
      title: 'オブジェクトプロパティ',
      propertyPanel: {
        noEntitySelected: 'オブジェクトが選択されていません。',
        multipleEntitySelected: '{count} 個のオブジェクトを選択中',
        propValCopied: 'プロパティの値をコピーしました',
        failedToCopyPropVal: 'プロパティの値をコピーできませんでした。',
        selection: '選択範囲',
        mixed: '複数の値',
        x: 'X',
        y: 'Y',
        width: '幅',
        height: '高さ',
        keepAspectHint: '縦横比を保ったまま拡大・縮小します',
        referencePoint: '基準点',
        anchor: {
          topLeft: '左上',
          top: '上',
          topRight: '右上',
          left: '左',
          center: '中心',
          right: '右',
          bottomLeft: '左下',
          bottom: '下',
          bottomRight: '右下'
        },
        selectOnlyType: '{type}だけを選択',
        totalLength: '長さの合計',
        totalArea: '面積の合計',
        itemCount: '({count} 個)',
        invisibleAttribute: '非表示の項目',
        constantAttribute: '固定値 (変更できません)',
        allLocked: 'ロックされたレイヤーの図形なので変更できません',
        someLocked: 'ロックされたレイヤーの図形は変更されません'
      }
    },
    layerManager: {
      tab: 'レイヤー',
      title: 'レイヤー管理',
      currentLayerLabel: '現在のレイヤー: {name}',
      searchPlaceholder: 'レイヤーを検索',
      filters: 'フィルタ',
      collapseFilters: 'フィルタを折りたたむ',
      expandFilters: 'フィルタを展開',
      filterAll: 'すべて',
      filterAllUsed: '使用中のすべてのレイヤー',
      toolbar: {
        showFilters: 'レイヤーフィルタ',
        newFilter: '新しいフィルタ',
        newFilterGroup: '新しいグループフィルタ',
        newLayer: '新規レイヤー',
        deleteLayer: 'レイヤーを削除',
        setCurrent: '現在に設定'
      },
      prompts: {
        newFilterTitle: '新しいフィルタ',
        newFilterName: 'フィルタ名を入力',
        newFilterGroupTitle: '新しいグループフィルタ',
        newFilterGroupName: 'グループフィルタ名を入力',
        newLayerTitle: '新規レイヤー',
        newLayerName: 'レイヤー名を入力',
        confirm: 'OK',
        cancel: 'キャンセル'
      },
      messages: {
        filterCreated: 'フィルタ「{name}」を作成しました',
        filterExists: 'フィルタ「{name}」は既に存在します',
        filterCreateFailed: 'フィルタを作成できませんでした',
        layerCreated: 'レイヤー「{name}」を作成しました',
        layerExists: 'レイヤー「{name}」は既に存在します',
        layerCreateFailed: 'レイヤーを作成できませんでした',
        layerDeleted: 'レイヤー「{name}」を削除しました',
        layerDeleteFailed: 'レイヤー「{name}」を削除できませんでした',
        cannotDeleteLayer0: 'レイヤー「0」は削除できません',
        cannotDeleteCurrent: '現在のレイヤーは削除できません',
        selectLayerFirst: '先にレイヤーを選択してください',
        setCurrentSuccess: '現在のレイヤーを「{name}」に設定しました',
        setCurrentFailed: '現在のレイヤーを設定できませんでした'
      },
      layerList: {
        name: '名前',
        on: '表示',
        lock: 'ロック',
        plot: '印刷',
        color: '色',
        linetype: '線の種類',
        lineweight: '線の太さ',
        transparency: '透過性',
        description: '説明',
        currentLayer: '現在のレイヤー',
        newLayerPlaceholder: 'レイヤー名',
        zoomToLayer: 'クリックしたレイヤー「{layer}」にズームしました',
        lineWeightDefault: '既定'
      }
    },
    find: {
      tab: '検索',
      title: '検索',
      placeholder: '文字を検索',
      input: '検索する文字',
      find: '検索',
      matchCase: '大文字と小文字を区別',
      currentLayoutOnly: '現在の印刷ページのみ',
      hint: 'Enter を押すと、図面全体 (すべての印刷ページ) の文字、マルチテキスト、シンボルのプロパティ、およびシンボル・寸法・引出線・表の中の文字を検索します。',
      hintLayout:
        'Enter を押すと、現在の印刷ページの文字、マルチテキスト、シンボルのプロパティ、およびシンボル・寸法・引出線・表の中の文字を検索します。',
      noResults: '文字が見つかりません',
      count: '{count} 件見つかりました',
      countLayouts: '{layouts} 個の印刷ページで {count} 件見つかりました',
      countTruncated:
        '最初の {count} 件を表示しています — 検索条件を絞り込んでください',
      noDocument: '検索するには図面を開いてください',
      layoutUnavailable: '印刷ページ「{layout}」を開けませんでした',
      unnamedLayout: '(名前のない印刷ページ)',
      kind: {
        text: '文字',
        mtext: 'マルチテキスト',
        attribute: 'シンボルのプロパティ',
        block: 'シンボルの文字',
        dimension: '寸法',
        leader: '引出線',
        table: '表'
      }
    },
    countList: {
      tab: '個数',
      title: '個数カウント',
      searchPlaceholder: 'シンボル名を検索',
      countInArea: '範囲内をカウント',
      areaSet: 'カウント範囲を更新しました',
      areaCleared: 'キャンバス全体をカウントしています',
      blockName: 'シンボル',
      count: '個数',
      empty: '表示されているシンボルはありません',
      prompt: {
        firstCorner: 'カウント範囲の一方のコーナーを指定 または [全体]: ',
        secondCorner: 'もう一方のコーナーを指定: '
      }
    },
    designReview: {
      tab: 'レビュー',
      title: 'レビュー',
      searchPlaceholder: 'マークアップを検索',
      empty: 'マークアップはまだありません',
      type: '種類',
      status: 'ステータス',
      author: '作成者',
      summary: '概要',
      details: '詳細',
      closeDetails: '詳細を閉じる',
      label: 'ラベル',
      comment: 'コメント',
      zoomTo: 'ズーム',
      delete: '削除',
      clear: 'すべてクリア',
      statusValues: {
        open: '未対応',
        question: '質問',
        answered: '回答済み',
        closed: '完了'
      }
    },
    measurements: {
      tab: '計測',
      title: '計測',
      empty: '計測はまだありません',
      type: '種類',
      value: '値',
      filterAll: 'すべて',
      delete: '削除',
      clear: 'すべてクリア',
      typeValues: {
        distance: '距離',
        angle: '角度',
        area: '面積',
        arc: '円弧',
        point: 'XY'
      }
    },
    missingResources: {
      tab: 'リソース',
      title: '不足/外部リソース',
      fontTab: 'フォント',
      imageTab: 'イメージ',
      xrefTab: 'リンク図面',
      attach: 'アタッチ',
      attachDwg: 'DWG/DXF をアタッチ...',
      attachImage: 'イメージをアタッチ...',
      attachImageFailed: 'イメージ「{name}」をアタッチできませんでした',
      fileReferences: 'ファイル参照',
      details: '詳細',
      foundAt: '検出場所',
      selectReference: '詳細を表示する参照を選択してください',
      expandDetails: '詳細を展開',
      collapseDetails: '詳細を折りたたむ',
      apply: '適用',
      applyDone: '置き換えを適用しました',
      emptyFonts: '不足しているフォントはありません',
      emptyImages: '不足しているイメージはありません',
      matchFontType: 'フォントの種類を合わせる (SHX / メッシュ)',
      missedFont: '不足フォント',
      replacedFont: '置き換えフォント',
      selectFont: '置き換えるフォントを選択',
      selectLocalFont: 'ローカルのフォントファイルを選択',
      file: 'ファイル',
      replace: '置き換え',
      name: '名前',
      path: '保存パス',
      type: '種類',
      typeAttach: 'アタッチ',
      typeOverlay: 'オーバーレイ',
      typeImage: 'イメージ',
      status: 'ステータス',
      statusMissing: '見つかりません',
      statusLoaded: 'ロード済み',
      actions: '操作',
      visible: '表示',
      browse: '参照…',
      fromUrl: 'URL…',
      unload: 'アンロード',
      load: 'ロード',
      empty: 'この図面にリンク図面やイメージはありません',
      urlPrompt: '図面ファイル (DWG / DXF など) の URL を入力してください',
      urlRequired: 'URL を入力してください',
      loadFailed: '参照「{name}」をロードできませんでした'
    },
    memoryProfile: {
      tab: 'メモリ',
      title: 'メモリプロファイル',
      refresh: '更新',
      collecting: 'メモリを分析しています...',
      showPie: '概要グラフを表示',
      hidePie: '概要グラフを非表示',
      collectedAt: '{time} に取得',
      heapUsed: 'JS ヒープ {used} / {total}',
      estimateNote:
        '図形のサイズはバッファの byteLength から算出しています。その他の分類は推定値です。',
      estimated: '推定',
      pieTotal: '集計対象',
      pieAriaLabel: '分類別のメモリ内訳',
      empty: 'データなし',
      missedFonts: '不足フォント',
      fontMemory: 'フォント / mtext のメモリ',
      fontMemorySummary: 'メモリ {live} (メイン {main} · ワーカー {workers})',
      fontStorage: 'IndexedDB の容量 (メモリではありません)',
      fontStorageSummary: 'キャッシュ済みフォント {count} 個 · {size}',
      materialPoint: '点',
      materialLine: '線',
      materialFill: '塗りつぶし',
      materialTotal: '合計',
      dataModelCounts:
        'オブジェクト {entities} 個 · 非図形 {objects} 個 · {total}',
      dataModelCategories: '分類別',
      dataModelEntityTypes: 'オブジェクトの種類別',
      categories: {
        heap: 'JS ヒープ',
        geometry: '図形',
        mapping: 'マッピング',
        spatial: '空間インデックス',
        dataModel: 'データモデル',
        materials: 'マテリアル',
        fonts: 'フォント'
      },
      tabs: {
        geometry: '図形',
        spatial: '空間',
        dataModel: 'データモデル',
        materials: 'マテリアル',
        fonts: 'フォント'
      },
      columns: {
        layout: '印刷ページ',
        layer: 'レイヤー',
        geometry: '図形',
        mapping: 'マッピング',
        entities: 'オブジェクト',
        rootItems: 'ルート',
        childItems: '子',
        estimated: '推定サイズ',
        type: '種類',
        count: '個数',
        category: '分類',
        font: 'フォント'
      }
    },
    openFileProfile: {
      tab: '読み込み性能',
      title: '読み込みパフォーマンス',
      refresh: '更新',
      copy: 'コピー',
      copied: 'パフォーマンスデータをコピーしました',
      copyFailed: 'パフォーマンスデータをコピーできませんでした',
      collectedAt: '{time} に取得',
      hint: '直前に図面を開いたときに自動で記録されます。OPENPROF=1 にするとコンソールにも出力します。',
      noData:
        'まだ記録がありません。図面を開いてから OPENPERF を実行してください。',
      empty: 'データなし',
      timing: '経過時間',
      progressive: '段階的な読み込み',
      progressiveMode: 'モード',
      progressiveOn: 'オン',
      progressiveOff: 'オフ',
      midOpenPaints: '読み込み中の描画',
      yields: '処理の譲渡',
      cache: 'INSERT 描画キャッシュ (最上位)',
      slowBlocks: '最も遅いシンボルテンプレートのミス',
      total: '読み込み合計',
      read: 'db.read',
      parse: 'PARSE',
      entity: 'ENTITY フラッシュ',
      convert: 'シーン変換',
      cacheHits: 'キャッシュヒット',
      cacheMisses: 'キャッシュミス',
      cacheBuild: 'ミス時の構築',
      cacheCompact: 'ミス時の圧縮',
      cacheHitPath: 'ヒット時の処理',
      columns: {
        stage: '段階',
        duration: '所要時間',
        share: '割合',
        metric: '指標',
        value: '値',
        block: 'シンボル',
        build: '構築',
        compact: '圧縮'
      }
    },
    blocks: {
      tab: 'シンボル',
      title: 'シンボル',
      tabCurrentDrawing: '現在の図面',
      tabRecent: '最近使用',
      tabFavorites: 'お気に入り',
      tabLibraries: 'ライブラリ',
      sectionCurrentDrawing: '現在の図面のシンボル',
      sectionRecent: '最近使用したシンボル',
      sectionFavorites: 'お気に入りのシンボル',
      sectionLibraries: 'シンボルライブラリ',
      filterPlaceholder: 'フィルタ...',
      empty: '使用できるシンボルはありません',
      emptyRecent: '最近挿入したシンボルはありません',
      emptyFavorites: 'お気に入りのシンボルはありません',
      emptyLibraries: 'ライブラリが設定されていません',
      toggleFavorite: 'お気に入りの切り替え',
      options: 'オプション',
      insertionPoint: '挿入位置',
      scale: '尺度',
      rotation: '回転',
      angle: '角度',
      autoPlacement: '自動配置',
      repeatPlacement: '繰り返し配置',
      explode: '分解'
    }
  },
  colorDropdown: {
    custom: 'カスタム'
  },
  lineTypeSelect: {
    placeholder: '線の種類'
  },
  colorIndexPicker: {
    color: '色: ',
    colorIndex: 'インデックスカラー: ',
    inputPlaceholder: '0～256, BYLAYER, BYBLOCK',
    rgb: 'RGB: '
  },
  entityInfo: {
    color: '色',
    layer: 'レイヤー',
    lineType: '線の種類'
  },
  ribbonProperty: {
    color: '色',
    lineType: '線の種類',
    lineWeight: '線の太さ',
    layer: 'レイヤー'
  },
  layerSelect: {
    searchPlaceholder: 'レイヤー名を検索',
    noLayerAvailable: '使用できるレイヤーはありません',
    noMatchedLayer: '一致するレイヤーはありません',
    tooltip: {
      layer: 'レイヤー',
      visibility: '表示',
      lock: 'ロック',
      lineType: '線の種類',
      color: '色',
      visible: '表示',
      hidden: '非表示',
      locked: 'ロック',
      unlocked: 'ロック解除'
    }
  },
  message: {
    loadingFonts: 'フォントを読み込んでいます...',
    loadingDwgConverter: 'DWG コンバーターを読み込んでいます...',
    fontsNotFound: 'フォント {fonts} がフォントリポジトリに見つかりません。',
    fontsNotLoaded: 'フォント {fonts} を読み込めません。',
    fontMissedInDrawing:
      'フォント「{font}」は {count} 個の文字オブジェクトで使用されていますが、利用できません。「{replacementFont}」で表示します。',
    fontMissedReplacement: '「{font}」(「{replacement}」で表示)',
    fontCached: 'フォント「{font}」をキャッシュしました。',
    fontCacheFailed: 'フォント「{fileName}」をキャッシュできませんでした。',
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
    fetchingDrawingFile: 'ファイルを取得しています...',
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
    time: {
      justNow: 'たった今',
      minutesAgo: '{count} 分前',
      hoursAgo: '{count} 時間前',
      daysAgo: '{count} 日前'
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
  }
}
