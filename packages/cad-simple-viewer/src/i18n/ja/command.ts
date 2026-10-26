export default {
  ACAD: {
    '-hatch': {
      description:
        'リボン UI を使わずにコマンドラインのオプションで塗りつぶしを作成します'
    },
    '-layer': {
      description: 'コマンドラインのオプションでレイヤーを管理します'
    },
    about: {
      description: 'RemixCAD の情報を表示します'
    },
    acadver: {
      description:
        '図面データベースのバージョン識別子を保持します (読み取り専用)'
    },
    angbase: {
      description: '現在の UCS に対する基準角度 0 の方向を設定します'
    },
    angdir: {
      description: '正の角度を時計回りと反時計回りのどちらで測るかを設定します'
    },
    arc: {
      description: '円弧を作成します'
    },
    aunits: {
      description: '角度の表示形式を設定します'
    },
    auprec: {
      description: '角度の表示精度を設定します (AUNITS と組み合わせて使用)'
    },
    bmpout: {
      description: 'BMP に書き出します'
    },
    cdxf: {
      description: '現在の図面を DXF に書き出します'
    },
    cimage: {
      description: '画像に書き出します (表示画面・オブジェクト範囲・用紙と縮尺、PNG / JPEG / BMP / TIFF)'
    },
    cjww: {
      description: '現在の図面を JWW (Jw_cad) に書き出します'
    },
    csfc: {
      description: '現在の図面を SXF (SFC) に書き出します'
    },
    cp21: {
      description: '現在の図面を SXF (P21) に書き出します'
    },
    cpdf: {
      description: '現在の図面を PDF に書き出します'
    },
    '-cpdf': {
      description: 'コマンドラインのオプションで現在の図面を PDF に書き出します'
    },
    cecolor: {
      description: '新しく作成するオブジェクトの既定の色を設定します'
    },
    celtscale: {
      description: '新しく作成するオブジェクトの線の間隔スケールを設定します'
    },
    celtype: {
      description: '新しく作成するオブジェクトの線の種類を設定します'
    },
    celweight: {
      description: '新しく作成するオブジェクトの既定の線の太さを設定します'
    },
    cetransparency: {
      description: '新しく作成するオブジェクトの透過性を設定します'
    },
    cachefont: {
      description:
        '文字の描画に使うローカルのフォントファイルを IndexedDB にキャッシュします'
    },
    circle: {
      description: '中心と半径を指定して円を作成します'
    },
    clayer: {
      description:
        '新しく作成するオブジェクトが入る編集レイヤーを設定します'
    },
    cmleaderstyle: {
      description: '現在のマルチ引出線スタイルの名前を設定します'
    },
    cmlscale: {
      description: 'マルチラインの全体の幅を設定します'
    },
    cmlstyle: {
      description: '現在のマルチラインスタイルの名前を設定します'
    },
    colortheme: {
      description:
        'ユーザーインタフェースの配色テーマ (ダーク/ライト) を設定します'
    },
    copy: {
      description: '選択したオブジェクトを新しい位置に複写します',
      prompt: 'オブジェクトを選択'
    },
    csvg: {
      description: '現在の図面を SVG に変換します'
    },
    chtml: {
      description:
        '現在の図面を単体で動作するオフライン HTML ファイルに書き出します'
    },
    '-chtml': {
      description:
        'コマンドラインのオプションで現在の図面を HTML に書き出します'
    },
    dimlinear: {
      description: '長さ寸法を作成します'
    },
    dimstyle: {
      description: '現在の寸法スタイルの名前を設定します'
    },
    dwgname: {
      description: '現在の図面ファイルの名前を保持します (読み取り専用)'
    },
    loginname: {
      description: 'ユーザーのログイン名を表示します (読み取り専用)'
    },
    dynmode: {
      description: 'カーソル位置のダイナミック入力の設定を制御します'
    },
    dynprompt: {
      description:
        'ダイナミック入力のツールチップにプロンプトを表示するかを制御します'
    },
    ellipse: {
      description: '軸の端点または中心を指定して楕円または楕円弧を作成します'
    },
    erase: {
      description: '選択したオブジェクトを図面から削除します',
      prompt: 'オブジェクトを選択'
    },
    extmax: {
      description: 'キャンバスの図面範囲の右上隅を保持します (読み取り専用)'
    },
    extmin: {
      description: 'キャンバスの図面範囲の左下隅を保持します (読み取り専用)'
    },
    entout: {
      description: '選択したオブジェクトをまとめたプレビュー画像を書き出します',
      prompt: 'オブジェクトを選択'
    },
    hideobjects: {
      description: '選択したオブジェクトを一時的に非表示にします',
      prompt: 'オブジェクトを選択'
    },
    imageattach: {
      description: 'ラスター画像をリンクとして現在の図面にアタッチします'
    },
    '-insert': {
      description: 'シンボル定義を現在の図面に挿入します (コマンドライン)'
    },
    xattach: {
      description:
        'DWG または DXF 図面をリンク図面として現在の図面にアタッチします'
    },
    gripcolor: {
      description:
        '選択したオブジェクトに表示される未選択グリップの色を設定します'
    },
    griphot: {
      description: '選択された (ホット) グリップの色を設定します'
    },
    gripobjlimit: {
      description:
        '選択セットが指定した数を超えるとグリップを表示しません (0 = 制限なし)'
    },
    grips: {
      description: '選択したオブジェクトにグリップを表示するかを制御します'
    },
    gripsize: {
      description: 'グリップのボックスのサイズをピクセル単位で設定します'
    },
    hatch: {
      description:
        '閉じた領域または選択したオブジェクトをパターンで塗りつぶします'
    },
    ipdf: {
      description: 'PDF ファイルからベクトル図形を読み込みます'
    },
    hpang: {
      description:
        '新しく作成する塗りつぶしパターンの既定の角度 (ラジアン) を設定します'
    },
    hpassoc: {
      description: '新しく作成する塗りつぶしを自動調整にするかを制御します'
    },
    hpbackgroundcolor: {
      description: '新しく作成する塗りつぶしパターンの既定の背景色を設定します'
    },
    hpcolor: {
      description: '新しく作成する塗りつぶしの既定の色を設定します'
    },
    hpdouble: {
      description: 'ユーザー定義の塗りつぶしパターンを二重にするかを制御します'
    },
    hpgaptol: {
      description: '塗りつぶしの境界で、閉じているとみなす隙間の最大幅 (図面単位) を設定します'
    },
    hpislanddetection: {
      description: '新しく作成する塗りつぶし境界内の島の扱いを制御します'
    },
    hplayer: {
      description: '新しく作成する塗りつぶしの既定のレイヤーを設定します'
    },
    hpname: {
      description:
        'このセッションで新しく作成する塗りつぶしの既定のパターン名を設定します'
    },
    hpscale: {
      description: '新しく作成する塗りつぶしパターンの既定の尺度を設定します'
    },
    hpseparate: {
      description:
        '複数の境界に対して塗りつぶしを 1 つにするか個別に作成するかを制御します'
    },
    hptransparency: {
      description: '新しく作成する塗りつぶしの既定の透過性を設定します'
    },
    insunits: {
      description:
        '挿入するシンボル、イメージ、リンク図面を自動的に尺度調整するための図面単位を指定します'
    },
    jpgout: {
      description: 'JPEG に書き出します'
    },
    laycur: {
      description: '選択したオブジェクトのレイヤーを編集レイヤーに移します',
      prompt: '編集レイヤーに移すオブジェクトを選択'
    },
    laydel: {
      description: 'レイヤーとそのレイヤー上のすべてのオブジェクトを削除します'
    },
    layerclose: {
      description: 'レイヤープロパティ管理を閉じます'
    },
    layerp: {
      description: 'レイヤー設定に対する直前の変更を元に戻します'
    },
    layfrz: {
      description: '選択したオブジェクトのレイヤーをフリーズします',
      prompt: 'フリーズするレイヤー上のオブジェクトを選択'
    },
    layiso: {
      description: '選択したオブジェクトのレイヤーを選択表示します',
      prompt: '選択表示するレイヤー上のオブジェクトを選択'
    },
    laylck: {
      description: '選択したオブジェクトのレイヤーをロックします',
      prompt: 'ロックするレイヤー上のオブジェクトを選択'
    },
    layoff: {
      description: '選択したオブジェクトのレイヤーを非表示にします',
      prompt: '非表示にするレイヤー上のオブジェクトを選択'
    },
    layon: {
      description: '図面内のすべてのレイヤーを表示します'
    },
    laythw: {
      description: '図面内のフリーズされたすべてのレイヤーをフリーズ解除します'
    },
    layulk: {
      description: '選択したオブジェクトのレイヤーのロックを解除します',
      prompt: 'ロックを解除するレイヤー上のオブジェクトを選択'
    },
    layuniso: {
      description: 'LAYISO で非表示またはロックされたレイヤーを元に戻します'
    },
    line: {
      description: '点と点の間に線分を作成します'
    },
    log: {
      description: 'デバッグ情報をコンソールに出力します'
    },
    ltscale: {
      description: '図面全体の線の間隔スケールを設定します'
    },
    lunits: {
      description: '座標と距離の表示形式を設定します'
    },
    luprec: {
      description: '長さの表示精度を設定します (LUNITS と組み合わせて使用)'
    },
    lwdisplay: {
      description: '図面に線の太さを表示するかを制御します'
    },
    clearmeasurements: {
      description: '現在の印刷ページのすべての計測を削除します'
    },
    measurementvis: {
      description: '現在の印刷ページの計測を表示/非表示にします'
    },
    measurementpanel: {
      description: '計測パレットを開きます'
    },
    measurementexport: {
      description: '計測をサイドカー JSON ファイルに書き出します'
    },
    measurementimport: {
      description: 'サイドカー JSON ファイルから計測を読み込みます'
    },
    measurearea: {
      description: '選択したオブジェクトまたは点の面積と周長を計算します'
    },
    measureangle: {
      description: '2 本の線または 3 点の間の角度を計測します'
    },
    measurearc: {
      description: '円弧の長さを計測します'
    },
    measuredistance: {
      description: '2 点間の距離と各方向の差分を計測します'
    },
    measurecontinuous: {
      description:
        'Enter またはキャンセルまで点を順に指定して連続した距離を計測します'
    },
    measurepoint: {
      description: '指定した点の X/Y 座標を計測します'
    },
    measurement: {
      description:
        '図面の単位をヤード・ポンド法とメートル法のどちらにするかを設定します'
    },
    measurementcolor: {
      description: '計測の表示に使う色を設定します'
    },
    modelbkcolor: {
      description: 'キャンバスの作図領域の背景色を設定します'
    },
    mline: {
      description: '複数の平行線を 1 つのマルチラインとして作成します'
    },
    move: {
      description: '選択したオブジェクトを移動します',
      prompt: 'オブジェクトを選択'
    },
    offset: {
      description: '指定した距離に平行な曲線、ポリライン、円を作成します'
    },
    mtext: {
      description: 'マルチテキストを作成します'
    },
    open: {
      description: '既存の図面ファイルを開きます'
    },
    openprof: {
      description:
        'ファイルを開く処理の各段階の所要時間をコンソールに出力するかを制御します'
    },
    openperf: {
      description:
        '直前に図面を開いたときの所要時間を表示するパフォーマンスパレットを開きます'
    },
    orthomode: {
      description: 'カーソルの動きを水平方向または垂直方向に拘束します'
    },
    osmode: {
      description: '定常オブジェクトスナップのモードをビットコードで設定します'
    },
    pan: {
      description: '表示方向や倍率を変えずに表示位置を移動します'
    },
    paperbkcolor: {
      description: '印刷ページの作図領域の背景色を設定します'
    },
    pdmode: {
      description: '点オブジェクトの表示方法を設定します'
    },
    pdsize: {
      description: '点オブジェクトの表示サイズを設定します'
    },
    pickbox: {
      description:
        'オブジェクトの選択に使うピックボックスのサイズ (ピクセル) を設定します'
    },
    pline: {
      description: '複数の点を指定してポリラインを作成します'
    },
    pngout: {
      description: 'PNG に書き出します'
    },
    point: {
      description: '点を作成します'
    },
    polaraddang: {
      description: '極トラッキングの追加角度をセミコロン区切りで保持します'
    },
    polarang: {
      description: '極トラッキングの角度の増分を設定します'
    },
    polarmode: {
      description:
        '極トラッキングとオブジェクトスナップトラッキングの設定を制御します'
    },
    polygon: {
      description: '中心と半径、または 1 辺を指定して正多角形を作成します'
    },
    qnew: {
      description: '新しい図面を開始します'
    },
    close: {
      description: '現在の図面を閉じます'
    },
    ray: {
      description: '1 点から無限に延びる放射線を作成します'
    },
    rectang: {
      description: '対角の 2 点を指定して長方形を作成します'
    },
    regen: {
      description: '現在の図面を再描画します'
    },
    revcloud: {
      description: '雲マークを作成または修正します'
    },
    markuptext: {
      description: '文字のマークアップを配置します'
    },
    markupline: {
      description: '線のマークアップを作成します'
    },
    markuparrow: {
      description: '矢印のマークアップを作成します'
    },
    markupcloud: {
      description: '雲マークのマークアップを作成します'
    },
    markuprect: {
      description: '長方形のマークアップを作成します'
    },
    markupcircle: {
      description: '円のマークアップを作成します'
    },
    markuphighlight: {
      description: 'ハイライト (長方形) のマークアップを作成します'
    },
    markupcallout: {
      description:
        '吹き出しを作成します: 引出線の先端を指定し、テキストボックスを配置して文字を入力します'
    },
    markupstamp: {
      description: '一覧からスタンプを選んで配置します'
    },
    markupvis: {
      description: 'マークアップを表示/非表示にします'
    },
    clearmarkups: {
      description: '現在の印刷ページのすべてのマークアップを削除します'
    },
    markupexport: {
      description: 'マークアップをサイドカー JSON ファイルに書き出します'
    },
    markupimport: {
      description: 'サイドカー JSON ファイルからマークアップを読み込みます'
    },
    markuppanel: {
      description: 'マークアップパレットを開きます'
    },
    rotate: {
      description: '選択したオブジェクトを基点を中心に回転します',
      prompt: 'オブジェクトを選択'
    },
    select: {
      description: 'オブジェクトを選択します'
    },
    shortcutmenu: {
      description: '作図領域でショートカットメニューを使えるかを制御します'
    },
    sketch: {
      description: 'フリーハンドの一連の線分を作成します'
    },
    spline: {
      description: '制御点を指定して滑らかなスプライン曲線を作成します'
    },
    textstyle: {
      description: '現在の文字スタイルの名前を設定します'
    },
    unitmode: {
      description:
        'LUNITS が建築単位または分数のときの座標の分数表示を制御します'
    },
    switchbg: {
      description: '作図領域の背景を白と黒で切り替えます'
    },
    readingmode: {
      description:
        '閲覧モードを切り替えます: 白い背景に黒い線で表示してレビューしやすくします'
    },
    unisolateobjects: {
      description:
        'HIDEOBJECTS で非表示にしたすべてのオブジェクトを再表示します'
    },
    undo: {
      description: '直前のデータベース編集操作を元に戻します',
      nothingToUndo: '元に戻す操作はありません。'
    },
    redo: {
      description: '元に戻したデータベース編集操作をやり直します',
      nothingToRedo: 'やり直す操作はありません。'
    },
    xline: {
      description: '両方向に無限に延びる構築線を作成します'
    },
    zoom: {
      description: 'すべてのオブジェクトの範囲を最大に表示します'
    }
  },
  USER: {}
}
