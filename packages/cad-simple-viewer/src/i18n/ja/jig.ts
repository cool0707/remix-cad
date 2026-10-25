export default {
  arc: {
    startPointOrCenter: '円弧の始点を指定 または',
    secondPointOrOptions: '円弧の 2 点目を指定 または',
    secondPoint: '円弧の 2 点目を指定',
    startPoint: '円弧の始点を指定',
    centerPoint: '円弧の中心点を指定',
    endPoint: '円弧の終点を指定',
    endPointOrOptions: '円弧の終点を指定 または',
    centerPointOrOptions: '円弧の中心点を指定 または',
    includedAngle: '中心角を指定',
    chordLength: '弦の長さを指定',
    tangentDirection: '円弧の始点の接線方向を指定',
    radius: '円弧の半径を指定',
    keywords: {
      center: { display: '中心(C)', local: '中心', global: 'Center' },
      end: { display: '終点(E)', local: '終点', global: 'End' },
      angle: { display: '角度(A)', local: '角度', global: 'Angle' },
      chordLength: {
        display: '弦の長さ(L)',
        local: '弦の長さ',
        global: 'ChordLength'
      },
      direction: { display: '方向(D)', local: '方向', global: 'Direction' },
      radius: { display: '半径(R)', local: '半径', global: 'Radius' }
    },
    invalid: {
      threePoint:
        '3 点の円弧が無効です: 点が一直線上にあるか、円弧を決定できません。',
      center:
        '中心の入力が無効です: 始点と終点は同じ円周上にある必要があります。',
      angle:
        '角度の入力が無効です: 中心角は 0 度より大きく 360 度未満である必要があります。',
      chordLength: '弦の長さが無効です: 現在の半径に対して範囲外の値です。',
      direction: '方向が無効です: この接線方向からは円弧を作成できません。',
      radius: '半径が無効です: 指定した半径では始点と終点を結べません。'
    }
  },
  circle: {
    center: '円の中心を指定',
    centerOrOptions: '円の中心点を指定 または',
    radius: '円の半径を指定',
    radiusOrDiameter: '円の半径を指定 または',
    diameter: '円の直径を指定',
    twoPointFirst: '円の直径の 1 つ目の端点を指定',
    twoPointSecond: '円の直径の 2 つ目の端点を指定',
    threePointFirst: '円周上の 1 点目を指定',
    threePointSecond: '円周上の 2 点目を指定',
    threePointThird: '円周上の 3 点目を指定',
    keywords: {
      threeP: { display: '3 点(3P)', local: '3P', global: '3P' },
      twoP: { display: '2 点(2P)', local: '2P', global: '2P' },
      diameter: { display: '直径(D)', local: '直径', global: 'Diameter' }
    }
  },
  copy: {
    basePointOrOptions: '基点を指定 または',
    displacementOrArray: '移動距離を指定 または',
    secondPointOrArray: '2 点目を指定 または',
    modePrompt: '複写モードのオプションを入力',
    arrayItemCount: '元のオブジェクトを含む配列複写の数を入力',
    arraySecondPointOrFit: '2 点目を指定 または',
    arrayFitSecondPoint: '2 点目を指定',
    keywords: {
      displacement: {
        display: '移動距離(D)',
        local: '移動距離',
        global: 'Displacement'
      },
      mode: { display: 'モード(O)', local: 'モード', global: 'Mode' },
      multiple: { display: '複数(M)', local: '複数', global: 'Multiple' },
      single: { display: '一度(S)', local: '一度', global: 'Single' },
      array: { display: '配列複写(A)', local: '配列複写', global: 'Array' },
      fit: { display: 'フィット(F)', local: 'フィット', global: 'Fit' }
    }
  },
  dimlinear: {
    xLine1Point: '1 本目の寸法補助線の起点を指定',
    xLine2Point: '2 本目の寸法補助線の起点を指定',
    dimLinePoint: '寸法線の位置を指定'
  },
  ellipse: {
    axisEndpointOrOptions: '楕円の軸の端点を指定 または',
    arcAxisEndpointOrCenter: '楕円弧の軸の端点を指定 または',
    center: '楕円の中心を指定',
    firstAxisEndpoint: '軸の端点を指定',
    secondAxisEndpoint: '軸のもう一方の端点を指定',
    otherAxisOrRotation: 'もう一方の軸の距離を指定 または',
    rotationAngle: '長軸周りの回転角度を指定',
    arcStartAngle: '楕円弧の開始角度を指定',
    arcEndAngle: '楕円弧の終了角度を指定',
    keywords: {
      arc: { display: '円弧(A)', local: '円弧', global: 'Arc' },
      center: { display: '中心(C)', local: '中心', global: 'Center' },
      rotation: { display: '回転(R)', local: '回転', global: 'Rotation' }
    },
    invalid: {
      axis: '軸の入力が無効です: 軸の長さは 0 より大きい必要があります。',
      otherAxis:
        'もう一方の軸の入力が無効です: 距離は 0 より大きい必要があります。',
      rotation: '回転の入力が無効です: 短軸は 0 より大きい必要があります。'
    }
  },
  hatch: {
    prompt: '境界オブジェクトを選択 または',
    pickPoint: '内側の点を指定 (Enter で終了)',
    select: '塗りつぶすオブジェクトを選択',
    patternName: '塗りつぶしパターン名を入力',
    scale: '塗りつぶしパターンの尺度を指定',
    angle: '塗りつぶしパターンの角度を指定',
    style: '塗りつぶしのスタイルを入力',
    associative: '自動調整を指定',
    invalidBoundary: '選択したオブジェクトは閉じた境界を構成していません。',
    keywords: {
      pick: {
        display: '点をクリック(P)',
        local: '点をクリック',
        global: 'PickPoints'
      },
      select: {
        display: 'オブジェクトを選択(S)',
        local: 'オブジェクトを選択',
        global: 'SelectObjects'
      },
      cancel: {
        display: 'キャンセル(C)',
        local: 'キャンセル',
        global: 'Cancel'
      },
      pattern: { display: 'パターン(P)', local: 'パターン', global: 'Pattern' },
      scale: { display: '尺度(S)', local: '尺度', global: 'Scale' },
      angle: { display: '角度(A)', local: '角度', global: 'Angle' },
      style: {
        display: 'スタイル(T)',
        local: 'スタイル',
        global: 'HatchStyle'
      },
      associative: {
        display: '自動調整(AS)',
        local: '自動調整',
        global: 'AssociativeMode'
      },
      normal: { display: '標準(N)', local: '標準', global: 'Normal' },
      outer: { display: '外側(O)', local: '外側', global: 'Outer' },
      ignore: { display: '無視(I)', local: '無視', global: 'Ignore' },
      yes: { display: 'はい(Y)', local: 'はい', global: 'Yes' },
      no: { display: 'いいえ(N)', local: 'いいえ', global: 'No' }
    }
  },
  hideobjects: {
    hidden: '個のオブジェクトを非表示にしました',
    restored: '個のオブジェクトを再表示しました',
    nothingToRestore: '再表示する非表示オブジェクトはありません'
  },
  entout: {
    longSidePrompt: 'プレビューの長辺のサイズ (ピクセル) を入力',
    exported: '個のオブジェクトのプレビューを書き出しました',
    skipped: '個のオブジェクトをスキップしました',
    failed: {
      'no-preview-root': '選択したオブジェクトのプレビュー図形を作成できません',
      'no-bounds': '選択したオブジェクトのプレビュー範囲を計算できません',
      'capture-failed': 'オブジェクトのプレビュー画像を描画できません',
      'download-failed':
        'プレビューは描画されましたが、PNG のダウンロードに失敗しました'
    }
  },
  layer: {
    main: 'オプションを入力',
    listSummary: 'レイヤーの一覧をブラウザのコンソールに出力しました',
    emptyInput: 'レイヤー名が入力されていません。',
    newPrompt: '新しいレイヤーの名前を入力',
    makePrompt: '作成して現在にするレイヤーの名前を入力',
    setPrompt: '現在にするレイヤーの名前を入力',
    onPrompt: '表示するレイヤーの名前を入力',
    offPrompt: '非表示にするレイヤーの名前を入力',
    freezePrompt: 'フリーズするレイヤーの名前を入力',
    thawPrompt: 'フリーズ解除するレイヤーの名前を入力',
    lockPrompt: 'ロックするレイヤーの名前を入力',
    unlockPrompt: 'ロックを解除するレイヤーの名前を入力',
    colorLayerPrompt: '色を変更するレイヤーの名前を入力',
    colorValuePrompt:
      '色を入力 (ACI 1～255、255,0,0 のような RGB、または CSS の色名)',
    invalidColor: '色の入力が無効です。',
    descriptionLayerPrompt: '説明を編集するレイヤーの名前を入力',
    descriptionValuePrompt: '新しいレイヤーの説明を入力',
    created: '作成したレイヤーの数',
    alreadyExists: 'レイヤーは既に存在します',
    notFound: 'レイヤーが見つかりません',
    cannotChangeCurrent: '現在のレイヤーは非表示またはフリーズにできません。',
    keywords: {
      list: { display: '?(?)', local: '?', global: '?' },
      make: { display: '作成(M)', local: '作成', global: 'Make' },
      set: { display: '設定(S)', local: '設定', global: 'Set' },
      new: { display: '新規作成(N)', local: '新規作成', global: 'New' },
      on: { display: '表示(ON)', local: '表示', global: 'On' },
      off: { display: '非表示(OF)', local: '非表示', global: 'Off' },
      color: { display: '色(C)', local: '色', global: 'Color' },
      freeze: { display: 'フリーズ(F)', local: 'フリーズ', global: 'Freeze' },
      thaw: {
        display: 'フリーズ解除(T)',
        local: 'フリーズ解除',
        global: 'Thaw'
      },
      lock: { display: 'ロック(L)', local: 'ロック', global: 'Lock' },
      unlock: {
        display: 'ロック解除(U)',
        local: 'ロック解除',
        global: 'Unlock'
      },
      description: { display: '説明(D)', local: '説明', global: 'Description' }
    }
  },
  layon: {
    alreadyOn: 'すべてのレイヤーは既に表示されています。',
    turnedOn: '表示したレイヤー'
  },
  laycur: {
    prompt: '現在のレイヤーに変更するオブジェクトを選択',
    currentLayerNotFound: '現在のレイヤーが見つかりません。',
    noObjects: '有効なオブジェクトが選択されていません。',
    alreadyCurrent: '選択したオブジェクトは既に現在のレイヤー上にあります。',
    changed: '現在のレイヤーに変更したオブジェクト'
  },
  layfrz: {
    prompt: 'フリーズするレイヤー上のオブジェクトを選択 または',
    invalidSelection: '無効なオブジェクトが選択されました。',
    settingsPrompt: '変更する LAYFRZ の設定を入力',
    viewportPrompt: 'ビューポートでのフリーズ動作を指定',
    blockSelectionPrompt: 'ネストされたシンボルの選択動作を指定',
    vpfreezeFallback:
      '現在のビューアはビューポートごとのレイヤーフリーズに対応していないため、フリーズとして処理します。',
    nestedSelectionLimited:
      'ネストされたシンボルの選択設定は保存されますが、現在の選択では最上位オブジェクトのレイヤーが使われます。',
    layerNotFound: 'レイヤーが見つかりません',
    cannotFreezeCurrent: '現在のレイヤーはフリーズできません。',
    alreadyFrozen: 'レイヤーは既にフリーズされています',
    frozen: 'フリーズしたレイヤー',
    restored: '元に戻したレイヤー',
    nothingToUndo: '元に戻す LAYFRZ の操作はありません。',
    keywords: {
      settings: { display: '設定(S)', local: '設定', global: 'Settings' },
      undo: { display: '元に戻す(U)', local: '元に戻す', global: 'Undo' },
      viewports: {
        display: 'ビューポート(V)',
        local: 'ビューポート',
        global: 'Viewports'
      },
      blockSelection: {
        display: 'シンボル選択(B)',
        local: 'シンボル選択',
        global: 'BlockSelection'
      },
      freeze: { display: 'フリーズ(F)', local: 'フリーズ', global: 'Freeze' },
      vpfreeze: {
        display: 'VP フリーズ(V)',
        local: 'VP フリーズ',
        global: 'Vpfreeze'
      },
      block: { display: 'シンボル(B)', local: 'シンボル', global: 'Block' },
      entity: {
        display: 'オブジェクト(E)',
        local: 'オブジェクト',
        global: 'Entity'
      },
      none: { display: 'なし(N)', local: 'なし', global: 'None' }
    }
  },
  layiso: {
    prompt: '選択表示するレイヤー上のオブジェクトを選択 または',
    settingsPrompt: '選択表示しないレイヤーの設定を入力',
    offModePrompt: '選択表示しないレイヤーの非表示の方法を入力',
    noLayers: '有効なレイヤーが選択されていません。',
    layerNotFound: 'レイヤーが見つかりません',
    isolated: '選択表示したレイヤー',
    affectedLayers: '影響を受けるレイヤー',
    vpfreezeFallback:
      '現在のビューアはビューポートごとのレイヤーフリーズに対応していないため、非表示として処理します。',
    lockFadeFallback:
      '現在のビューアはレイヤーのフェード表示に対応していないため、選択表示しないレイヤーはフェードせずにロックされます。',
    keywords: {
      settings: { display: '設定(S)', local: '設定', global: 'Settings' },
      off: { display: '非表示(O)', local: '非表示', global: 'Off' },
      lockAndFade: {
        display: 'ロックとフェード(L)',
        local: 'ロックとフェード',
        global: 'LockAndFade'
      },
      vpfreeze: {
        display: 'VP フリーズ(V)',
        local: 'VP フリーズ',
        global: 'Vpfreeze'
      }
    }
  },
  layuniso: {
    noPrevious: '元に戻す LAYISO のレイヤー状態がありません。',
    layerNotFound: 'レイヤーが見つかりません',
    nothingRestored: 'LAYISO によるレイヤーの変更は元に戻されませんでした。',
    restored: '元に戻したレイヤー'
  },
  laythw: {
    alreadyThawed: 'すべてのレイヤーは既にフリーズ解除されています。',
    thawed: 'フリーズ解除したレイヤー'
  },
  laylck: {
    prompt: 'ロックするレイヤー上のオブジェクトを選択',
    invalidSelection: '無効なオブジェクトが選択されました。',
    layerNotFound: 'レイヤーが見つかりません',
    alreadyLocked: 'レイヤーは既にロックされています',
    locked: 'ロックしたレイヤー'
  },
  layulk: {
    prompt: 'ロックを解除するレイヤー上のオブジェクトを選択',
    invalidSelection: '無効なオブジェクトが選択されました。',
    layerNotFound: 'レイヤーが見つかりません',
    alreadyUnlocked: 'レイヤーは既にロック解除されています',
    unlocked: 'ロックを解除したレイヤー'
  },
  layoff: {
    prompt: '非表示にするレイヤー上のオブジェクトを選択 または',
    invalidSelection: '無効なオブジェクトが選択されました。',
    settingsPrompt: '変更する LAYOFF の設定を入力',
    viewportPrompt: 'ビューポートでの動作を指定',
    blockSelectionPrompt: 'ネストされたシンボルの選択動作を指定',
    vpfreezeFallback:
      '現在のビューアはビューポートごとのレイヤーの非表示に対応していないため、非表示として処理します。',
    nestedSelectionLimited:
      'ネストされたシンボルの選択設定は保存されますが、現在の選択では最上位オブジェクトのレイヤーが使われます。',
    layerNotFound: 'レイヤーが見つかりません',
    cannotTurnOffCurrent: '現在のレイヤーは非表示にできません。',
    alreadyOff: 'レイヤーは既に非表示です',
    turnedOff: '非表示にしたレイヤー',
    restored: '元に戻したレイヤー',
    nothingToUndo: '元に戻す LAYOFF の操作はありません。',
    keywords: {
      settings: { display: '設定(S)', local: '設定', global: 'Settings' },
      undo: { display: '元に戻す(U)', local: '元に戻す', global: 'Undo' },
      viewports: {
        display: 'ビューポート(V)',
        local: 'ビューポート',
        global: 'Viewports'
      },
      blockSelection: {
        display: 'シンボル選択(B)',
        local: 'シンボル選択',
        global: 'BlockSelection'
      },
      off: { display: '非表示(O)', local: '非表示', global: 'Off' },
      vpfreeze: {
        display: 'VP フリーズ(V)',
        local: 'VP フリーズ',
        global: 'Vpfreeze'
      },
      block: { display: 'シンボル(B)', local: 'シンボル', global: 'Block' },
      entity: {
        display: 'オブジェクト(E)',
        local: 'オブジェクト',
        global: 'Entity'
      },
      none: { display: 'なし(N)', local: 'なし', global: 'None' }
    }
  },
  layerp: {
    restored: '直前のレイヤー状態に戻しました。',
    noPreviousState: '元に戻す直前のレイヤー状態はありません。'
  },
  line: {
    firstPoint: '1 点目を指定',
    firstPointOrContinue: '1 点目を指定 または',
    nextPoint: '次の点を指定',
    nextPointWithOptions: '次の点を指定 または',
    keywords: {
      continue: { display: '継続(C)', local: '継続', global: 'Continue' },
      undo: { display: '元に戻す(U)', local: '元に戻す', global: 'Undo' },
      close: { display: '閉じる(C)', local: '閉じる', global: 'Close' }
    }
  },
  xline: {
    firstPointOrOptions: '点を指定 または',
    secondPoint: '2 点目を指定',
    throughPoint: '通過点を指定',
    angle: '構築線の角度を入力',
    invalidDirection: '構築線の方向が無効です。',
    keywords: {
      hor: { display: '水平(H)', local: '水平', global: 'Hor' },
      ver: { display: '垂直(V)', local: '垂直', global: 'Ver' },
      ang: { display: '角度(A)', local: '角度', global: 'Ang' }
    }
  },
  ray: {
    startPoint: '始点を指定',
    throughPoint: '通過点を指定'
  },
  mline: {
    startPointWithOptions: '始点を指定 または',
    nextPointWithOptions: '次の点を指定 または',
    justificationPrompt: '位置合わせのタイプを入力',
    scalePrompt: 'マルチラインの尺度を指定',
    stylePrompt: 'マルチラインスタイル名を入力 または [?] で一覧表示',
    styleNotFound: 'マルチラインスタイルが見つかりません',
    styleListHeader: '読み込まれているマルチラインスタイル',
    styleListEmpty:
      '現在の図面にはマルチラインスタイルが読み込まれていません。',
    keywords: {
      justification: {
        display: '位置合わせ(J)',
        local: '位置合わせ',
        global: 'Justification'
      },
      scale: { display: '尺度(S)', local: '尺度', global: 'Scale' },
      style: { display: 'スタイル(ST)', local: 'スタイル', global: 'Style' },
      undo: { display: '元に戻す(U)', local: '元に戻す', global: 'Undo' },
      close: { display: '閉じる(C)', local: '閉じる', global: 'Close' },
      top: { display: '上(T)', local: '上', global: 'Top' },
      zero: { display: 'ゼロ(Z)', local: 'ゼロ', global: 'Zero' },
      bottom: { display: '下(B)', local: '下', global: 'Bottom' }
    }
  },
  measureAngle: {
    vertex: '頂点を指定',
    arm1: '1 本目の辺上の点を指定',
    arm2: '2 本目の辺上の点を指定'
  },
  measureArc: {
    startPoint: '円弧の始点を指定',
    throughPoint: '円弧上の点を指定',
    endPoint: '円弧の終点を指定',
    lockedEndPoint: '円弧の終点を指定 (Ctrl で優弧/劣弧を切り替え)',
    invalidPoints: '3 点が一直線上にあるため円弧を決定できません。'
  },
  measureArea: {
    firstPoint: '1 点目を指定',
    nextPoint: '次の点を指定 (Enter で終了)'
  },
  measureDistance: {
    firstPoint: '1 点目を指定',
    secondPoint: '2 点目を指定'
  },
  measureContinuous: {
    firstPoint: '1 点目を指定',
    nextPoint: '次の点を指定 (Enter で終了)'
  },
  measurePoint: {
    point: '点を指定'
  },
  measurement: {
    import: {
      chooseFile: '計測のサイドカー JSON ファイルを選択'
    }
  },
  markup: {
    author: 'レビュー担当者を指定 (次回以降のために保存されます)',
    text: {
      point: '文字マークアップの位置を指定',
      content: 'マークアップの文字を入力'
    },
    line: {
      firstPoint: '線マークアップの 1 点目を指定',
      secondPoint: '線マークアップの 2 点目を指定'
    },
    arrow: {
      firstPoint: '矢印の始点を指定',
      secondPoint: '矢印の先端を指定'
    },
    cloud: {
      firstCorner: '雲マークの 1 つ目のコーナーを指定',
      secondCorner: '雲マークのもう一方のコーナーを指定'
    },
    rect: {
      firstCorner: '長方形の 1 つ目のコーナーを指定',
      secondCorner: '長方形のもう一方のコーナーを指定'
    },
    circle: {
      center: '円の中心を指定',
      radius: '円の半径を指定'
    },
    shape: {
      calloutOn: '[吹き出しあり]',
      calloutOff: '[吹き出しなし]',
      calloutAnchor: '吹き出しの文字の位置を指定',
      keywords: {
        callout: {
          display: '吹き出し(C)',
          local: '吹き出し',
          global: 'Callout'
        },
        noCallout: {
          display: '吹き出しなし(N)',
          local: '吹き出しなし',
          global: 'NoCallout'
        }
      }
    },
    highlight: {
      firstCorner: 'ハイライトの 1 つ目のコーナーを指定',
      secondCorner: 'ハイライトのもう一方のコーナーを指定'
    },
    callout: {
      tip: '引出線の先端を指定、または吹き出しのない雲マーク/長方形/円の輪郭を指定',
      anchor: '吹き出しの文字の位置を指定',
      content: '吹き出しの文字を入力'
    },
    stamp: {
      kind: 'スタンプ ID を入力 [approved/rejected/revised/for-review/custom]',
      imageUrl: 'カスタムスタンプの画像 URL を入力 (省略可)',
      caption: 'スタンプのキャプションを入力 (省略可)',
      point: 'スタンプの挿入位置を指定'
    },
    import: {
      chooseFile: 'マークアップのサイドカー JSON ファイルを選択'
    }
  },
  move: {
    basePointOrDisplacement: '基点を指定 または',
    secondPointOrDisplacement: '2 点目を指定 または',
    displacement: '移動距離を指定',
    keywords: {
      displacement: {
        display: '移動距離(D)',
        local: '移動距離',
        global: 'Displacement'
      }
    }
  },
  offset: {
    distance: 'オフセット距離を指定',
    selectObject: 'オフセットするオブジェクトを選択 (Enter で終了)',
    sidePoint: 'オフセットする側の点を指定',
    invalidDistance: 'オフセット距離は 0 より大きい必要があります。',
    invalidSelection: '選択したオブジェクトはオフセットできません。',
    offsetFailed: '指定した側にオフセット曲線を作成できません。'
  },
  mtext: {
    point: 'マルチテキストの挿入位置を指定'
  },
  bmpout: {
    boundsFirstCorner: '範囲の 1 つ目のコーナーを指定',
    boundsSecondCorner: 'もう一方のコーナーを指定',
    longSidePrompt: '長辺のサイズ (ピクセル) を入力'
  },
  jpgout: {
    boundsFirstCorner: '範囲の 1 つ目のコーナーを指定',
    boundsSecondCorner: 'もう一方のコーナーを指定',
    longSidePrompt: '長辺のサイズ (ピクセル) を入力'
  },
  pngout: {
    boundsFirstCorner: '範囲の 1 つ目のコーナーを指定',
    boundsSecondCorner: 'もう一方のコーナーを指定',
    longSidePrompt: '長辺のサイズ (ピクセル) を入力'
  },
  imageattach: {
    insertionPoint: '挿入位置を指定:',
    scale: '尺度を指定:',
    rotation: '回転角度を指定:',
    invalidScale: '尺度は 0 より大きい必要があります。',
    decodeFailed: '選択した画像ファイルを読み込めませんでした。'
  },
  insert: {
    blockName: 'シンボル名を入力:',
    insertionPoint: '挿入位置を指定:',
    scale: '尺度を指定:',
    rotation: '回転角度を指定:',
    invalidScale: '尺度は 0 より大きい必要があります。',
    invalidBlockName: 'シンボル名が無効です。',
    blockNotFound: 'シンボルが見つかりません',
    xrefNotAllowed: '-INSERT ではリンク図面を挿入できません。'
  },
  xattach: {
    insertionPoint: '挿入位置を指定:',
    scale: '尺度を指定:',
    rotation: '回転角度を指定:',
    invalidScale: '尺度は 0 より大きい必要があります。',
    unsupportedFile: 'DWG または DXF ファイルを選択してください。',
    loading: 'リンク図面を読み込んでいます...',
    loadFailed: '選択した図面ファイルを読み込めませんでした。'
  },
  point: {
    point: '点を指定'
  },
  polygon: {
    numberOfSides: '辺の数を入力',
    centerOrEdge: 'ポリゴンの中心を指定 または',
    radiusOrType: 'オプションを入力',
    edgeStart: '辺の 1 つ目の端点を指定',
    edgeEnd: '辺の 2 つ目の端点を指定',
    keywords: {
      edge: { display: '辺(E)', local: '辺', global: 'Edge' },
      inscribed: {
        display: '円に内接(I)',
        local: '円に内接',
        global: 'Inscribed'
      },
      circumscribed: {
        display: '円に外接(C)',
        local: '円に外接',
        global: 'Circumscribed'
      }
    },
    invalid: {
      sides: '辺の数が無効です。3～1024 の整数を入力してください。',
      radius: '半径が無効です。半径は 0 より大きい必要があります。',
      edge: '辺が無効です。辺の長さは 0 より大きい必要があります。'
    }
  },
  polyline: {
    firstPoint: '1 点目を指定',
    nextPoint: '次の点を指定 (Enter で終了)',
    nextPointWithOptions: '次の点を指定 または',
    nextPointWithArcOptions: '次の点を指定 または',
    keywords: {
      arc: { display: '円弧(A)', local: '円弧', global: 'Arc' },
      undo: { display: '元に戻す(U)', local: '元に戻す', global: 'Undo' },
      close: { display: '閉じる(J)', local: '閉じる', global: 'Close' },
      line: { display: '線分(L)', local: '線分', global: 'Line' },
      angle: { display: '角度(A)', local: '角度', global: 'Angle' },
      center: { display: '中心(C)', local: '中心', global: 'Center' },
      secondPoint: {
        display: '2 点目(P)',
        local: '2 点目',
        global: 'SecondPoint'
      },
      radius: { display: '半径(R)', local: '半径', global: 'Radius' }
    },
    arcAngle: '円弧の角度を指定',
    arcCenter: '中心点を指定',
    arcSecondPoint: '円弧上の 2 点目を指定',
    arcEndPoint: '円弧の終点を指定',
    arcRadius: '円弧の半径を指定'
  },
  rect: {
    firstPoint: '一方のコーナーを指定',
    nextPoint: 'もう一方のコーナーを指定',
    firstPointWithOptions: '一方のコーナーを指定 または',
    otherCornerWithOptions: 'もう一方のコーナーを指定 または',
    chamferFirst: '1 本目の面取り距離を指定',
    chamferSecond: '2 本目の面取り距離を指定',
    filletRadius: 'フィレットの半径を指定',
    segmentWidth: '長方形の線の幅を指定',
    elevationValue: '高度を指定',
    thicknessValue: '厚さを指定',
    rotationAngle: '長方形の回転角度を指定',
    dimensionLength: '長方形の長さを指定',
    dimensionWidth: '長方形の幅を指定',
    areaValue: '長方形の面積を指定',
    areaLengthOrWidth: '長方形の長さを指定',
    areaSpecifyWidth: '長方形の幅を指定',
    invalidPositive: '入力が無効です。0 より大きい値を入力してください。',
    invalidRect:
      '長方形を作成できません。有効なコーナーまたは寸法を指定してください。',
    thicknessNotSupported:
      '長方形の厚さは現在オブジェクトのデータに書き込まれません。厚さの設定は無視されます。',
    keywords: {
      chamfer: { display: '面取り(C)', local: '面取り', global: 'Chamfer' },
      elevation: { display: '高度(E)', local: '高度', global: 'Elevation' },
      fillet: {
        display: 'フィレット(F)',
        local: 'フィレット',
        global: 'Fillet'
      },
      thickness: { display: '厚さ(T)', local: '厚さ', global: 'Thickness' },
      width: { display: '幅(W)', local: '幅', global: 'Width' },
      area: { display: '面積(A)', local: '面積', global: 'Area' },
      dimensions: { display: '寸法(D)', local: '寸法', global: 'Dimensions' },
      rotation: { display: '回転(R)', local: '回転', global: 'Rotation' },
      length: { display: '長さ(L)', local: '長さ', global: 'Length' },
      rectWidth: { display: '幅(W)', local: '幅', global: 'Width' }
    }
  },
  rotate: {
    basePoint: '基点を指定',
    rotationAngleOrOptions: '回転角度を指定 または',
    referenceAngleOrPoints: '参照角度を指定 または',
    firstReferencePoint: '参照角度の 1 点目を指定',
    secondReferencePoint: '2 点目を指定',
    newAngle: '新しい角度を指定',
    keywords: {
      copy: { display: '複写(C)', local: '複写', global: 'Copy' },
      reference: { display: '参照(R)', local: '参照', global: 'Reference' },
      points: { display: '点(P)', local: '点', global: 'Points' }
    },
    invalid: {
      referencePoints: '参照点が無効です: 異なる点を指定してください。'
    }
  },
  revcloud: {
    firstCornerOrOptions: '一方のコーナーを指定 または',
    firstCorner: '一方のコーナーを指定',
    oppositeCorner: 'もう一方のコーナーを指定',
    startPoint: '始点を指定',
    nextPoint: '次の点を指定',
    nextPointOrUndo: '次の点を指定 または',
    firstPoint: '1 点目を指定',
    guideCursor: '雲マークの経路に沿ってカーソルを動かします (Enter で終了)',
    arcLength: '円弧の長さを指定',
    selectObject: 'オブジェクトを選択',
    style: '雲マークの円弧スタイルを入力',
    reverseDirection: '方向を反転',
    invalidArcLength: '円弧の長さは 0 より大きい必要があります。',
    invalidObject: '選択したオブジェクトは雲マークに変換できません。',
    keywords: {
      arcLength: {
        display: '円弧の長さ(A)',
        local: '円弧の長さ',
        global: 'ArcLength'
      },
      object: {
        display: 'オブジェクト(O)',
        local: 'オブジェクト',
        global: 'Object'
      },
      rectangular: {
        display: '長方形(R)',
        local: '長方形',
        global: 'Rectangular'
      },
      polygonal: {
        display: 'ポリゴン(P)',
        local: 'ポリゴン',
        global: 'Polygonal'
      },
      freehand: {
        display: 'フリーハンド(F)',
        local: 'フリーハンド',
        global: 'Freehand'
      },
      style: { display: 'スタイル(S)', local: 'スタイル', global: 'Style' },
      normal: { display: '標準(N)', local: '標準', global: 'Normal' },
      calligraphy: {
        display: 'カリグラフィ(C)',
        local: 'カリグラフィ',
        global: 'Calligraphy'
      },
      undo: { display: '元に戻す(U)', local: '元に戻す', global: 'Undo' },
      yes: { display: 'はい(Y)', local: 'はい', global: 'Yes' },
      no: { display: 'いいえ(N)', local: 'いいえ', global: 'No' }
    }
  },
  sketch: {
    specifySketch: 'スケッチを指定 または',
    sketching: 'ポインタを動かしてスケッチします (クリックまたは Enter で終了)',
    type: 'スケッチのタイプを入力',
    increment: 'スケッチの増分を指定',
    tolerance: 'スプラインの許容差を指定',
    firstPoint: '1 点目を指定',
    nextPoint: '終点を指定',
    keywords: {
      type: { display: 'タイプ(T)', local: 'タイプ', global: 'Type' },
      increment: { display: '増分(I)', local: '増分', global: 'Increment' },
      tolerance: { display: '許容差(L)', local: '許容差', global: 'Tolerance' },
      line: { display: '線分(L)', local: '線分', global: 'Lines' },
      polyline: {
        display: 'ポリライン(P)',
        local: 'ポリライン',
        global: 'Polyline'
      },
      spline: {
        display: 'スプライン(S)',
        local: 'スプライン',
        global: 'Spline'
      }
    }
  },
  spline: {
    firstPoint: '1 点目を指定',
    nextPoint: '次の点を指定 (Enter で終了)',
    firstPointWithOptions: '1 点目を指定 または',
    nextPointWithFitOptions: '次の点を指定 または',
    nextPointWithCvOptions: '次の制御点を指定 または',
    methodPrompt: 'スプラインの作成方法を入力',
    knotsPrompt: 'ノットのパラメータ化を入力',
    degreePrompt: 'スプラインの次数を指定',
    keywords: {
      method: { display: '方法(M)', local: '方法', global: 'Method' },
      fit: { display: 'フィット(F)', local: 'フィット', global: 'Fit' },
      cv: { display: '制御点(C)', local: '制御点', global: 'CV' },
      knots: { display: 'ノット(K)', local: 'ノット', global: 'Knots' },
      degree: { display: '次数(D)', local: '次数', global: 'Degree' },
      undo: { display: '元に戻す(U)', local: '元に戻す', global: 'Undo' },
      close: { display: '閉じる(C)', local: '閉じる', global: 'Close' },
      chord: { display: '弦長(C)', local: '弦長', global: 'Chord' },
      sqrtChord: {
        display: '弦長の平方根(S)',
        local: '弦長の平方根',
        global: 'SqrtChord'
      },
      uniform: { display: '均等(U)', local: '均等', global: 'Uniform' }
    }
  },
  sysvar: {
    prompt: '新しい値を入力してください'
  },
  zoom: {
    mainPrompt: '窓のコーナーを指定 または',
    firstCorner: '一方のコーナーを指定',
    secondCorner: 'もう一方のコーナーを指定',
    centerPoint: '中心点を指定',
    heightOrScale: '高さまたは倍率を入力 (nX または nXP)',
    scaleFactor: '倍率を入力 (nX または nXP)',
    keywords: {
      all: { display: '全体(A)', local: '全体', global: 'All' },
      center: { display: '中心(C)', local: '中心', global: 'Center' },
      extents: {
        display: 'オブジェクト範囲(E)',
        local: 'オブジェクト範囲',
        global: 'Extents'
      },
      previous: { display: '前画面(P)', local: '前画面', global: 'Previous' },
      original: {
        display: '元のサイズ(O)',
        local: '元のサイズ',
        global: 'Original'
      },
      saved: { display: '保存済み(V)', local: '保存済み', global: 'Saved' },
      smart: { display: 'スマート(I)', local: 'スマート', global: 'Smart' },
      scale: { display: '倍率(S)', local: '倍率', global: 'Scale' },
      window: { display: '窓(W)', local: '窓', global: 'Window' }
    }
  },
  chtml: {
    exportFormat: '書き出し形式',
    exportInvisibleLayers: '非表示のレイヤーも書き出す',
    exportLayouts: '印刷ページを書き出す',
    initialView: 'HTML を開いたときの初期表示',
    viewerMode: 'オフラインビューアのモード',
    chunkSizeMiB: 'チャンクのサイズ (MiB、複数ファイルのパッケージ)',
    compressChunks: 'チャンクを圧縮する (複数ファイルのパッケージ)',
    keywords: {
      single: {
        display: '単一ファイル(S)',
        local: '単一ファイル',
        global: 'Single'
      },
      multi: {
        display: '複数ファイルのパッケージ(M)',
        local: '複数ファイルのパッケージ',
        global: 'Multi'
      },
      yes: { display: 'はい(Y)', local: 'はい', global: 'Yes' },
      no: { display: 'いいえ(N)', local: 'いいえ', global: 'No' },
      extents: {
        display: 'オブジェクト範囲(E)',
        local: 'オブジェクト範囲',
        global: 'Extents'
      },
      current: {
        display: '現在の表示(C)',
        local: '現在の表示',
        global: 'Current'
      },
      view: { display: '閲覧(V)', local: '閲覧', global: 'View' },
      measure: {
        display: '計測とレビュー(M)',
        local: '計測とレビュー',
        global: 'Measure'
      }
    }
  },
  cpdf: {
    modelSpaceFit: 'キャンバスの範囲',
    exportLayouts: '印刷ページを書き出す',
    textMode: '文字の描画方法',
    keywords: {
      extents: {
        display: 'オブジェクト範囲(E)',
        local: 'オブジェクト範囲',
        global: 'Extents'
      },
      display: { display: '表示画面(D)', local: '表示画面', global: 'Display' },
      text: { display: '文字(T)', local: '文字', global: 'Text' },
      vector: { display: 'ベクトル(V)', local: 'ベクトル', global: 'Vector' },
      yes: { display: 'はい(Y)', local: 'はい', global: 'Yes' },
      no: { display: 'いいえ(N)', local: 'いいえ', global: 'No' }
    }
  }
}
