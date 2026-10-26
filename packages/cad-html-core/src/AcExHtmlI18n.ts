/** Supported locales in the offline HTML viewer. */
export type AcExHtmlLocale = 'en' | 'ja' | 'zh' | 'cs' | 'tr' | 'ar'

/**
 * All locales accepted by the offline viewer, in display order.
 * The language strip lists these options; add a locale here plus a
 * {@link ACEX_HTML_LOCALE_BADGES} entry and a `MESSAGES` tree to support it.
 */
export const ACEX_HTML_LOCALES: AcExHtmlLocale[] = [
  'en',
  'ja',
  'zh',
  'cs',
  'tr',
  'ar'
]

/** Short button badge per locale (shown on the language parent and strip). */
export const ACEX_HTML_LOCALE_BADGES: Record<AcExHtmlLocale, string> = {
  en: 'EN',
  ja: '日',
  zh: '中',
  cs: 'CS',
  tr: 'TR',
  ar: 'AR'
}

/**
 * `localStorage` key used to persist the user's language choice
 * across reloads of exported HTML files.
 */
export const ACEX_HTML_LOCALE_STORAGE_KEY = 'mlcad-html-locale'

/**
 * Dot-separated message keys resolved by {@link AcExHtmlI18n.t}.
 * Must exist in the internal `MESSAGES` tree for each {@link AcExHtmlLocale}.
 */
export type AcExHtmlMessageKey =
  | 'toolbar.viewerTools'
  | 'toolbar.select'
  | 'toolbar.pan'
  | 'toolbar.zoom'
  | 'toolbar.zoomExtents'
  | 'toolbar.zoomSmartExtents'
  | 'toolbar.zoomWindow'
  | 'toolbar.zoomSaved'
  | 'toolbar.zoomOriginal'
  | 'toolbar.measureDistance'
  | 'toolbar.measureContinuous'
  | 'toolbar.measureAngle'
  | 'toolbar.measureArc'
  | 'toolbar.measureRadius'
  | 'toolbar.measureArea'
  | 'toolbar.measureCoordinate'
  | 'toolbar.clearMeasurements'
  | 'toolbar.measureHide'
  | 'toolbar.measureShow'
  | 'toolbar.measureImport'
  | 'toolbar.measureExport'
  | 'toolbar.measurementPanel'
  | 'toolbar.measure'
  | 'toolbar.annotation'
  | 'toolbar.markupCloud'
  | 'toolbar.markupCallout'
  | 'toolbar.markupText'
  | 'toolbar.markupRect'
  | 'toolbar.markupCircle'
  | 'toolbar.markupArrow'
  | 'toolbar.markupStamp'
  | 'toolbar.markupPanel'
  | 'toolbar.markupHide'
  | 'toolbar.markupShow'
  | 'toolbar.clearMarkups'
  | 'toolbar.markupImport'
  | 'toolbar.markupExport'
  | 'toolbar.snap'
  | 'toolbar.layers'
  | 'toolbar.layout'
  | 'toolbar.settings'
  | 'toolbar.simulatedMouseOn'
  | 'toolbar.simulatedMouseOff'
  | 'toolbar.themeLight'
  | 'toolbar.themeDark'
  | 'toolbar.switchBg'
  | 'toolbar.language'
  | 'toolbar.localeEn'
  | 'toolbar.localeJa'
  | 'toolbar.localeZh'
  | 'toolbar.localeCs'
  | 'toolbar.localeTr'
  | 'toolbar.localeAr'
  | 'toolbar.collapse'
  | 'toolbar.expand'
  | 'toolbar.moreOverflow'
  | 'settings.ortho'
  | 'settings.polar'
  | 'settings.polarAngles'
  | 'drawStyle.color'
  | 'drawStyle.fontSize'
  | 'drawStyle.pickerTitle'
  | 'drawStyle.close'
  | 'drawStyle.ok'
  | 'drawStyle.cancel'
  | 'drawStyle.index'
  | 'drawStyle.rgb'
  | 'drawStyle.input'
  | 'drawStyle.inputPlaceholder'
  | 'shortCutToolbar.more'
  | 'shortCutToolbar.undo'
  | 'shortCutToolbar.redo'
  | 'shortCutToolbar.erase'
  | 'shortCutToolbar.collapse'
  | 'shortCutToolbar.expand'
  | 'textHeight.title'
  | 'textHeight.close'
  | 'textHeight.ok'
  | 'textHeight.cancel'
  | 'textHeight.adaptive'
  | 'textHeight.custom'
  | 'textHeight.customPlaceholder'
  | 'textHeight.fromScreen'
  | 'textHeight.fromScreenHint'
  | 'textHeight.screenPxPlaceholder'
  | 'textHeight.screenUnit'
  | 'textHeight.convert'
  | 'entityPick.cancel'
  | 'layers.title'
  | 'layers.close'
  | 'layers.showAll'
  | 'layers.hideAll'
  | 'layers.zoomTo'
  | 'review.title'
  | 'review.close'
  | 'review.searchPlaceholder'
  | 'review.empty'
  | 'review.type'
  | 'review.status'
  | 'review.author'
  | 'review.summary'
  | 'review.details'
  | 'review.closeDetails'
  | 'review.label'
  | 'review.comment'
  | 'review.zoomTo'
  | 'review.delete'
  | 'review.clear'
  | 'review.statusValues.open'
  | 'review.statusValues.question'
  | 'review.statusValues.answered'
  | 'review.statusValues.closed'
  | 'measurePanel.title'
  | 'measurePanel.close'
  | 'measurePanel.filterGroup'
  | 'measurePanel.filterDistance'
  | 'measurePanel.filterArc'
  | 'measurePanel.filterRadius'
  | 'measurePanel.filterAngle'
  | 'measurePanel.filterArea'
  | 'measurePanel.empty'
  | 'measurePanel.type'
  | 'measurePanel.value'
  | 'measurePanel.delete'
  | 'measurePanel.clear'
  | 'session.length'
  | 'session.angle'
  | 'session.dx'
  | 'session.dy'
  | 'session.x'
  | 'session.y'
  | 'session.confirm'
  | 'session.cancel'
  | 'session.help'
  | 'session.back'
  | 'session.collapse'
  | 'session.expand'
  | 'session.undo'
  | 'touchPointTutorial.title'
  | 'touchPointTutorial.description'
  | 'touchPointTutorial.snoozeToday'
  | 'touchPointTutorial.hideForever'
  | 'touchPointTutorial.ok'
  | 'status.ready'
  | 'status.zoomWindowHint'
  | 'status.measureDistanceHint'
  | 'status.measureContinuousHint'
  | 'status.measureAngleHint'
  | 'status.measureArcHint'
  | 'status.measureRadiusHint'
  | 'status.measureAreaHint'
  | 'status.measureCoordinateHint'
  | 'status.measureExported'
  | 'status.measureImported'
  | 'status.measureImportFailed'
  | 'status.markupCloudHint'
  | 'status.markupCalloutHint'
  | 'status.markupTextHint'
  | 'status.markupRectHint'
  | 'status.markupCircleHint'
  | 'status.markupArrowHint'
  | 'status.markupStampHint'
  | 'status.markupArrowEndHint'
  | 'status.markupRectCornerHint'
  | 'status.markupCloudCornerHint'
  | 'status.markupCalloutAnchorHint'
  | 'status.markupCircleRadiusHint'
  | 'status.markupTextPrompt'
  | 'status.markupTextEditHint'
  | 'status.markupShapeCalloutHint'
  | 'status.markupDefaultLabel'
  | 'status.markupSelected'
  | 'status.markupSelectedCount'
  | 'status.markupCount'
  | 'status.markupExported'
  | 'status.markupImported'
  | 'status.markupImportFailed'
  | 'status.distance'
  | 'status.coordinates'
  | 'status.angle'
  | 'status.arcLength'
  | 'status.radius'
  | 'status.continuousTotal'
  | 'status.area'
  | 'status.lengthTotal'
  | 'status.areaTotal'
  | 'status.zoomLayer'
  | 'status.loadFailed'
  | 'status.noLayout'
  | 'status.loadingChunks'
  | 'status.loadingOsnap'
  | 'status.buildingOsnap'
  | 'package.title'
  | 'package.hint'
  | 'package.hintUrlOnly'
  | 'package.chooseFolder'
  | 'package.urlPlaceholder'
  | 'package.openUrl'
  | 'package.urlRequired'
  | 'package.manifestNotFound'
  | 'package.invalidManifest'
  | 'package.folderMissingManifest'
  | 'package.folderUnsupported'
  | 'package.loadFailed'
  | 'access.title'
  | 'access.passwordPrompt'
  | 'access.passwordPlaceholder'
  | 'access.unlock'
  | 'access.passwordRequired'
  | 'access.wrongPassword'
  | 'access.expired'
  | 'access.expiredTitle'
  | 'access.expiredDetail'
  | 'access.expiresAt'
  | 'access.badgeExpires'
  | 'access.badgeCountdown'
  | 'access.tooManyAttempts'

/**
 * Nested string table used for locale message lookup.
 * @internal
 */
interface AcExMessageTree {
  [key: string]: string | AcExMessageTree
}

const BASE_MESSAGES: Record<
  Exclude<AcExHtmlLocale, 'ar' | 'ja'>,
  AcExMessageTree
> = {
  en: {
    toolbar: {
      viewerTools: 'Viewer tools',
      select: 'Select',
      pan: 'Pan',
      zoom: 'Zoom',
      zoomExtents: 'Extents',
      zoomSmartExtents: 'Smart',
      zoomWindow: 'Window',
      zoomSaved: 'Saved',
      zoomOriginal: 'Saved',
      measureDistance: 'Distance',
      measureContinuous: 'Continuous',
      measureAngle: 'Angle',
      measureArc: 'Arc',
      measureRadius: 'Radius',
      measureArea: 'Area',
      measureCoordinate: 'XY',
      clearMeasurements: 'Clear',
      measureHide: 'Hide',
      measureShow: 'Show',
      measureImport: 'Import',
      measureExport: 'Export',
      measurementPanel: 'Results',
      measure: 'Measure',
      annotation: 'Comments',
      markupCloud: 'Cloud',
      markupCallout: 'Callout',
      markupText: 'Text',
      markupRect: 'Rect',
      markupCircle: 'Circle',
      markupArrow: 'Arrow',
      markupStamp: 'Stamp',
      markupPanel: 'Results',
      markupHide: 'Hide',
      markupShow: 'Show',
      clearMarkups: 'Clear',
      markupImport: 'Import',
      markupExport: 'Export',
      snap: 'Snap',
      layers: 'Layers',
      layout: 'Print page',
      settings: 'Settings',
      simulatedMouseOn: 'Mouse',
      simulatedMouseOff: 'Loupe',
      themeLight: 'Light',
      themeDark: 'Dark',
      switchBg: 'Background',
      language: 'Language',
      localeEn: 'English',
      localeJa: '日本語',
      localeZh: '中文',
      localeCs: 'Čeština',
      localeTr: 'Türkçe',
      localeAr: 'العربية',
      collapse: 'Collapse toolbar',
      expand: 'Expand toolbar',
      moreOverflow: 'More tools'
    },
    settings: {
      ortho: 'Toggle orthogonal mode',
      polar: 'Angle snapping',
      polarAngles: 'Snap angles'
    },
    drawStyle: {
      color: 'Color',
      fontSize: 'Text height',
      pickerTitle: 'Select Color',
      close: 'Close',
      ok: 'OK',
      cancel: 'Cancel',
      index: 'Color Index: ',
      rgb: 'RGB: ',
      input: 'Color',
      inputPlaceholder: '1-255 or #RRGGBB'
    },
    shortCutToolbar: {
      more: 'More',
      undo: 'Undo',
      redo: 'Redo',
      erase: 'Delete',
      collapse: 'Collapse toolbar',
      expand: 'Expand toolbar'
    },
    textHeight: {
      title: 'Text Height',
      close: 'Close',
      ok: 'OK',
      cancel: 'Cancel',
      adaptive: 'Fit to screen',
      custom: 'Custom text height',
      customPlaceholder: 'World height',
      fromScreen: 'From screen size',
      fromScreenHint:
        'Enter how large the text should look on screen at the current zoom. It is converted to a fixed world-space height that stays constant when you zoom later.',
      screenPxPlaceholder: 'Font size',
      screenUnit: 'px',
      convert: 'Convert'
    },
    entityPick: {
      cancel: 'Cancel selection'
    },
    layers: {
      title: 'Layers',
      close: 'Close layers',
      showAll: 'Show all',
      hideAll: 'Hide all',
      zoomTo: 'Zoom to {name}'
    },
    review: {
      title: 'Comments',
      close: 'Close comments',
      searchPlaceholder: 'Search markups',
      empty: 'No markups yet',
      type: 'Type',
      status: 'Status',
      author: 'Author',
      summary: 'Summary',
      details: 'Details',
      closeDetails: 'Close details',
      label: 'Label',
      comment: 'Comment',
      zoomTo: 'Zoom to',
      delete: 'Delete',
      clear: 'Clear all',
      statusValues: {
        open: 'Open',
        question: 'Question',
        answered: 'Answered',
        closed: 'Closed'
      }
    },
    measurePanel: {
      title: 'Measurements',
      close: 'Close measurements',
      filterGroup: 'Filter by type',
      filterDistance: 'Distance',
      filterArc: 'Arc',
      filterRadius: 'Radius',
      filterAngle: 'Angle',
      filterArea: 'Area',
      empty: 'No measurements yet',
      type: 'Type',
      value: 'Value',
      delete: 'Delete',
      clear: 'Clear all'
    },
    session: {
      length: 'Length',
      angle: 'Angle',
      dx: 'ΔX',
      dy: 'ΔY',
      x: 'X',
      y: 'Y',
      confirm: 'Confirm',
      cancel: 'Cancel',
      help: 'Help',
      back: 'Back',
      collapse: 'Collapse',
      expand: 'Expand',
      undo: 'Undo'
    },
    touchPointTutorial: {
      title: 'How to pick points precisely?',
      description:
        'Long-press on the screen for about 0.5 seconds. A cross appears above your finger and follows as you move, snapping to geometry for more accurate picks.',
      snoozeToday: 'Don\'t remind me today',
      hideForever: 'Don\'t remind me again',
      ok: 'Got it'
    },
    status: {
      ready: 'Ready',
      zoomWindowHint: 'Click two corners to zoom to a window.',
      measureDistanceHint:
        'Click two points to measure distance (object snap enabled).',
      measureContinuousHint:
        'Tap successive points to measure each segment; tap ✓ to finish. Long-press for precise snap.',
      measureAreaHint:
        'Tap polygon vertices; tap ✓ to finish when at least three points are set. Long-press for precise snap.',
      measureAngleHint:
        'Click vertex, then two points on each arm (object snap enabled).',
      measureArcHint:
        'Click a circle or arc to measure along it, or click start, a point on the arc, then end (object snap enabled). Ctrl (⌘ on Mac) switches major/minor arc.',
      measureRadiusHint:
        'Click a circle or arc to measure its radius (object snap enabled).',
      measureCoordinateHint:
        'Click a point to read its X/Y coordinates (object snap enabled).',
      measureExported: 'Exported {count} measurement(s).',
      measureImported: 'Imported {count} measurement(s).',
      measureImportFailed: 'Failed to import measurements: {error}',
      markupCloudHint: 'Click two corners to draw a revision cloud.',
      markupCalloutHint:
        'Click the leader tip, or the outline of a cloud / rectangle / circle that has no callout, then the text anchor.',
      markupTextHint: 'Click a point to place text.',
      markupRectHint: 'Click two corners to draw a rectangle.',
      markupCircleHint: 'Click the center, then a point on the circumference.',
      markupArrowHint: 'Click the start point, then the arrow tip.',
      markupStampHint:
        'Click to place a stamp (cycles approved / rejected / …).',
      markupArrowEndHint: 'Click the arrow tip.',
      markupRectCornerHint: 'Click the opposite corner.',
      markupCloudCornerHint: 'Click the opposite corner.',
      markupCalloutAnchorHint: 'Click the text bubble position.',
      markupCircleRadiusHint: 'Click a point on the circumference.',
      markupTextPrompt: 'Enter markup text',
      markupTextEditHint:
        'Type text on the canvas. Enter to finish, Esc to cancel.',
      markupShapeCalloutHint:
        'Click to place the text box (leader attaches to the shape). Esc cancels the callout.',
      markupDefaultLabel: 'Note',
      markupSelected: 'Selected markup: {type}',
      markupSelectedCount: 'Selected markups: {count}',
      markupCount: 'Markups: {count}',
      markupExported: 'Exported {count} markup(s).',
      markupImported: 'Imported {count} markup(s).',
      markupImportFailed: 'Failed to import markups: {error}',
      distance: 'Distance: {value}',
      coordinates: 'X: {x} | Y: {y}',
      angle: 'Angle: {value}',
      arcLength:
        'Arc length: {length} | Radius: {radius} | Angle: {angle} | Chord: {chord}',
      radius: 'Radius: {value}',
      continuousTotal: 'Total length: {value}',
      area: 'Area: {value}',
      lengthTotal: 'Length total: {value}',
      areaTotal: 'Area total: {value}',
      zoomLayer: 'Zoom: {name}',
      loadFailed: 'Failed to load drawing: {error}',
      noLayout: 'No print page data in snapshot.',
      loadingChunks: 'Loading geometry… {loaded}/{total}',
      loadingOsnap: 'Loading object snap… {loaded}/{total}',
      buildingOsnap: 'Building object snap index…'
    },
    package: {
      title: 'Open drawing package',
      hint: 'No drawing.acex.json was found next to this page. Choose a local package folder or enter the manifest URL.',
      hintUrlOnly:
        'No drawing.acex.json was found next to this page. Enter the manifest URL to open the package.',
      chooseFolder: 'Choose local folder',
      urlPlaceholder: 'https://example.com/drawing.acex.json',
      openUrl: 'Open URL',
      urlRequired: 'Please enter a manifest URL.',
      manifestNotFound: 'drawing.acex.json was not found next to this page.',
      invalidManifest:
        'The package manifest is invalid or uses an unsupported version: {error}',
      folderMissingManifest:
        'The selected folder must contain drawing.acex.json.',
      folderUnsupported:
        'This browser cannot open a local package folder. Paste a manifest URL instead.',
      loadFailed: 'Failed to open package: {error}'
    },
    access: {
      title: 'Protected drawing',
      passwordPrompt: 'Enter the password to open this file.',
      passwordPlaceholder: 'Password',
      unlock: 'Unlock',
      passwordRequired: 'Please enter a password.',
      wrongPassword: 'Incorrect password. Try again.',
      expired: 'This file has expired and can no longer be opened.',
      expiredTitle: 'File expired',
      expiredDetail:
        'This file expired on {time} and can no longer be opened.',
      expiresAt: 'Expires: {time}',
      badgeExpires: 'Expires {time}',
      badgeCountdown: 'Expires in {time}',
      tooManyAttempts:
        'Too many incorrect password attempts. Refresh the page to try again.'
    }
  },
  zh: {
    toolbar: {
      viewerTools: '查看器工具',
      select: '选择',
      pan: '平移',
      zoom: '缩放',
      zoomExtents: '范围',
      zoomSmartExtents: '智能',
      zoomWindow: '窗口',
      zoomSaved: '保存的视图',
      zoomOriginal: '保存的视图',
      measureDistance: '测距离',
      measureContinuous: '连续测',
      measureAngle: '测角度',
      measureArc: '测弧长',
      measureRadius: '测半径',
      measureArea: '测面积',
      measureCoordinate: '测坐标',
      clearMeasurements: '清除',
      measureHide: '隐藏',
      measureShow: '显示',
      measureImport: '导入',
      measureExport: '导出',
      measurementPanel: '看结果',
      measure: '测量',
      annotation: '批注',
      markupCloud: '云线',
      markupCallout: '标注',
      markupText: '文字',
      markupRect: '矩形',
      markupCircle: '圆',
      markupArrow: '箭头',
      markupStamp: '图章',
      markupPanel: '看结果',
      markupHide: '隐藏',
      markupShow: '显示',
      clearMarkups: '清除',
      markupImport: '导入',
      markupExport: '导出',
      snap: '捕捉',
      layers: '图层',
      layout: '打印页',
      settings: '设置',
      simulatedMouseOn: '鼠标',
      simulatedMouseOff: '放大',
      themeLight: '浅色',
      themeDark: '深色',
      switchBg: '背景',
      language: '语言',
      localeEn: 'English',
      localeJa: '日本語',
      localeZh: '中文',
      localeCs: 'Čeština',
      localeTr: 'Türkçe',
      collapse: '收起工具栏',
      expand: '展开工具栏',
      moreOverflow: '更多工具'
    },
    settings: {
      ortho: '切换正交模式',
      polar: '角度吸附',
      polarAngles: '吸附角度'
    },
    drawStyle: {
      color: '颜色',
      fontSize: '字高',
      pickerTitle: '选择颜色',
      close: '关闭',
      ok: '确定',
      cancel: '取消',
      index: '颜色索引：',
      rgb: 'RGB：',
      input: '颜色',
      inputPlaceholder: '1-255 或 #RRGGBB'
    },
    shortCutToolbar: {
      more: '更多',
      undo: '撤销',
      redo: '重做',
      erase: '删除',
      collapse: '收起工具栏',
      expand: '展开工具栏'
    },
    textHeight: {
      title: '字高设置',
      close: '关闭',
      ok: '确定',
      cancel: '取消',
      adaptive: '自适应屏幕',
      custom: '自定义字高',
      customPlaceholder: '世界坐标字高',
      fromScreen: '按屏幕字号换算',
      fromScreenHint:
        '按当前视图缩放，输入希望看到的屏幕字号（像素），换算为固定的世界坐标字高；之后缩放时字的世界高度不变。',
      screenPxPlaceholder: '屏幕字号',
      screenUnit: 'px',
      convert: '换算'
    },
    entityPick: {
      cancel: '取消选择'
    },
    layers: {
      title: '图层',
      close: '关闭图层',
      showAll: '全部显示',
      hideAll: '全部隐藏',
      zoomTo: '缩放到 {name}'
    },
    review: {
      title: '批注',
      close: '关闭批注面板',
      searchPlaceholder: '搜索批注',
      empty: '暂无批注',
      type: '类型',
      status: '状态',
      author: '作者',
      summary: '摘要',
      details: '详情',
      closeDetails: '关闭详情',
      label: '标签',
      comment: '评论',
      zoomTo: '缩放到',
      delete: '删除',
      clear: '全部清除',
      statusValues: {
        open: '打开',
        question: '疑问',
        answered: '已答复',
        closed: '已关闭'
      }
    },
    measurePanel: {
      title: '测量',
      close: '关闭测量面板',
      filterGroup: '按类型筛选',
      filterDistance: '距离',
      filterArc: '弧长',
      filterRadius: '半径',
      filterAngle: '角度',
      filterArea: '面积',
      empty: '暂无测量',
      type: '类型',
      value: '数值',
      delete: '删除',
      clear: '全部清除'
    },
    session: {
      length: '长度',
      angle: '角度',
      dx: 'ΔX',
      dy: 'ΔY',
      x: 'X',
      y: 'Y',
      confirm: '确定',
      cancel: '取消',
      help: '帮助',
      back: '返回',
      collapse: '收起',
      expand: '展开',
      undo: '撤销'
    },
    touchPointTutorial: {
      title: '怎样可以精确取点？',
      description:
        '手指在屏幕上长按0.5s左右，上方出现十字，手指移动时十字跟随移动并自动捕捉。取点更精准。',
      snoozeToday: '今日不再提醒',
      hideForever: '不再提醒',
      ok: '我知道了'
    },
    status: {
      ready: '就绪',
      zoomWindowHint: '点击两个角点以窗口缩放。',
      measureDistanceHint: '点击两点以测量距离（已启用对象捕捉）。',
      measureContinuousHint:
        '依次点击多个点测量各段距离，点 ✓ 完成。长按可精确捕捉。',
      measureAreaHint: '依次点击多边形顶点；至少三点后点 ✓ 完成。长按可精确捕捉。',
      measureAngleHint: '依次点击顶点与两条边上的点（已启用对象捕捉）。',
      measureArcHint:
        '点击圆或圆弧可沿其测量；否则依次点击弧起点、弧上一点与弧端点（已启用对象捕捉）。锁定后按 Ctrl（Mac 为 Control 或 ⌘）可在大弧与小弧之间切换。',
      measureRadiusHint: '点击圆或圆弧以测量半径（已启用对象捕捉）。',
      measureCoordinateHint: '点击一点以读取其 X/Y 坐标（已启用对象捕捉）。',
      measureExported: '已导出 {count} 条测量。',
      measureImported: '已导入 {count} 条测量。',
      measureImportFailed: '导入测量失败：{error}',
      markupCloudHint: '点击两个对角点绘制修订云线。',
      markupCalloutHint:
        '先点击引线端点，或点击尚无标注的云线/矩形/圆外框，再点击文字位置。',
      markupTextHint: '点击一点放置文字。',
      markupRectHint: '点击两个对角点绘制矩形。',
      markupCircleHint: '先点击圆心，再点击圆周上一点。',
      markupArrowHint: '先点击起点，再点击箭头端点。',
      markupStampHint: '点击放置图章（在批准/拒绝等之间循环）。',
      markupArrowEndHint: '点击箭头端点。',
      markupRectCornerHint: '点击对角点。',
      markupCloudCornerHint: '点击对角点。',
      markupCalloutAnchorHint: '点击文字气泡位置。',
      markupCircleRadiusHint: '点击圆周上一点。',
      markupTextPrompt: '输入批注文字',
      markupTextEditHint: '在画布上输入文字。Enter 完成，Esc 取消。',
      markupShapeCalloutHint:
        '点击放置文本框（引线自动贴到图形）。Esc 取消引线和文本框。',
      markupDefaultLabel: '批注',
      markupSelected: '已选批注：{type}',
      markupSelectedCount: '已选批注：{count} 个',
      markupCount: '批注数：{count}',
      markupExported: '已导出 {count} 条批注。',
      markupImported: '已导入 {count} 条批注。',
      markupImportFailed: '导入批注失败：{error}',
      distance: '距离：{value}',
      coordinates: 'X：{x} | Y：{y}',
      angle: '角度：{value}',
      arcLength:
        '弧长：{length} | 半径：{radius} | 总角度：{angle} | 弦长：{chord}',
      radius: '半径：{value}',
      continuousTotal: '总长度：{value}',
      area: '面积：{value}',
      lengthTotal: '长度合计：{value}',
      areaTotal: '面积合计：{value}',
      zoomLayer: '缩放：{name}',
      loadFailed: '无法加载图纸：{error}',
      noLayout: '快照中没有打印页数据。',
      loadingChunks: '正在加载几何… {loaded}/{total}',
      loadingOsnap: '正在加载对象捕捉… {loaded}/{total}',
      buildingOsnap: '正在构建对象捕捉索引…'
    },
    package: {
      title: '打开图纸包',
      hint: '当前页面同级目录未找到 drawing.acex.json。请选择本地包文件夹，或输入清单 URL。',
      hintUrlOnly:
        '当前页面同级目录未找到 drawing.acex.json。请输入清单 URL 以打开图纸包。',
      chooseFolder: '选择本地文件夹',
      urlPlaceholder: 'https://example.com/drawing.acex.json',
      openUrl: '打开 URL',
      urlRequired: '请输入清单 URL。',
      manifestNotFound: '当前页面同级目录未找到 drawing.acex.json。',
      invalidManifest: '包清单无效或版本不受支持：{error}',
      folderMissingManifest: '所选文件夹必须包含 drawing.acex.json。',
      folderUnsupported:
        '当前浏览器无法选择本地包文件夹，请改为输入清单 URL。',
      loadFailed: '无法打开图纸包：{error}'
    },
    access: {
      title: '受保护的图纸',
      passwordPrompt: '请输入密码以打开此文件。',
      passwordPlaceholder: '密码',
      unlock: '解锁',
      passwordRequired: '请输入密码。',
      wrongPassword: '密码错误，请重试。',
      expired: '此文件已过期，无法打开。',
      expiredTitle: '文件已过期',
      expiredDetail: '此文件已于 {time} 过期，无法打开。',
      expiresAt: '有效期至：{time}',
      badgeExpires: '有效期至 {time}',
      badgeCountdown: '剩余 {time}',
      tooManyAttempts: '密码错误次数过多，请刷新页面后重新输入。'
    }
  },
  cs: {
    toolbar: {
      viewerTools: 'Nástroje prohlížeče',
      select: 'Výběr',
      pan: 'Posun',
      zoom: 'Přiblížení',
      zoomExtents: 'Rozsah',
      zoomSmartExtents: 'Chytrý',
      zoomWindow: 'Okno',
      zoomSaved: 'Uložený',
      zoomOriginal: 'Uložený',
      measureDistance: 'Vzdálenost',
      measureContinuous: 'Spojité',
      measureAngle: 'Úhel',
      measureArc: 'Oblouk',
      measureRadius: 'Poloměr',
      measureArea: 'Plocha',
      measureCoordinate: 'Souřadnice',
      clearMeasurements: 'Vymazat',
      measureHide: 'Skrýt',
      measureShow: 'Zobrazit',
      measureImport: 'Import',
      measureExport: 'Export',
      measurementPanel: 'Výsledky',
      measure: 'Měření',
      annotation: 'Komentáře',
      markupCloud: 'Obláček',
      markupCallout: 'Odkaz',
      markupText: 'Text',
      markupRect: 'Obdélník',
      markupCircle: 'Kružnice',
      markupArrow: 'Šipka',
      markupStamp: 'Razítko',
      markupPanel: 'Výsledky',
      markupHide: 'Skrýt',
      markupShow: 'Zobrazit',
      clearMarkups: 'Vymazat',
      markupImport: 'Import',
      markupExport: 'Export',
      snap: 'Uchopit',
      layers: 'Hladiny',
      layout: 'Tisková stránka',
      settings: 'Nastavení',
      simulatedMouseOn: 'Myš',
      simulatedMouseOff: 'Lupa',
      themeLight: 'Světlý',
      themeDark: 'Tmavý',
      switchBg: 'Pozadí',
      language: 'Jazyk',
      localeEn: 'English',
      localeJa: '日本語',
      localeZh: '中文',
      localeCs: 'Čeština',
      localeTr: 'Türkçe',
      collapse: 'Sbalit panel nástrojů',
      expand: 'Rozbalit panel nástrojů',
      moreOverflow: 'Další nástroje'
    },
    settings: {
      ortho: 'Přepnout ortogonální režim',
      polar: 'Přichytávání úhlu',
      polarAngles: 'Úhly přichycení'
    },
    drawStyle: {
      color: 'Barva',
      fontSize: 'Výška textu',
      pickerTitle: 'Vybrat barvu',
      close: 'Zavřít',
      ok: 'OK',
      cancel: 'Zrušit',
      index: 'Index barvy: ',
      rgb: 'RGB: ',
      input: 'Barva',
      inputPlaceholder: '1-255 nebo #RRGGBB'
    },
    shortCutToolbar: {
      more: 'Více',
      undo: 'Zpět',
      redo: 'Znovu',
      erase: 'Smazat',
      collapse: 'Sbalit panel nástrojů',
      expand: 'Rozbalit panel nástrojů'
    },
    textHeight: {
      title: 'Výška textu',
      close: 'Zavřít',
      ok: 'OK',
      cancel: 'Zrušit',
      adaptive: 'Přizpůsobit obrazovce',
      custom: 'Vlastní výška textu',
      customPlaceholder: 'Světová výška',
      fromScreen: 'Ze velikosti na obrazovce',
      fromScreenHint:
        'Zadejte, jak velký má text vypadat na obrazovce při aktuálním zoomu. Přepočítá se na pevnou světovou výšku, která se při pozdějším zoomování nemění.',
      screenPxPlaceholder: 'Velikost písma',
      screenUnit: 'px',
      convert: 'Přepočítat'
    },
    entityPick: {
      cancel: 'Zrušit výběr'
    },
    layers: {
      title: 'Hladiny',
      close: 'Zavřít hladiny',
      showAll: 'Zobrazit vše',
      hideAll: 'Skrýt vše',
      zoomTo: 'Přiblížit na {name}'
    },
    review: {
      title: 'Komentáře',
      close: 'Zavřít komentáře',
      searchPlaceholder: 'Hledat poznámky',
      empty: 'Zatím žádné poznámky',
      type: 'Typ',
      status: 'Stav',
      author: 'Autor',
      summary: 'Souhrn',
      details: 'Podrobnosti',
      closeDetails: 'Zavřít podrobnosti',
      label: 'Popisek',
      comment: 'Komentář',
      zoomTo: 'Přiblížit na',
      delete: 'Odstranit',
      clear: 'Vymazat vše',
      statusValues: {
        open: 'Otevřeno',
        question: 'Otázka',
        answered: 'Zodpovězeno',
        closed: 'Uzavřeno'
      }
    },
    measurePanel: {
      title: 'Měření',
      close: 'Zavřít měření',
      filterGroup: 'Filtrovat podle typu',
      filterDistance: 'Vzdálenost',
      filterArc: 'Oblouk',
      filterRadius: 'Poloměr',
      filterAngle: 'Úhel',
      filterArea: 'Plocha',
      empty: 'Zatím žádná měření',
      type: 'Typ',
      value: 'Hodnota',
      delete: 'Odstranit',
      clear: 'Vymazat vše'
    },
    session: {
      length: 'Délka',
      angle: 'Úhel',
      dx: 'ΔX',
      dy: 'ΔY',
      x: 'X',
      y: 'Y',
      confirm: 'Potvrdit',
      cancel: 'Zrušit',
      help: 'Nápověda',
      back: 'Zpět',
      collapse: 'Sbalit',
      expand: 'Rozbalit',
      undo: 'Zpět'
    },
    touchPointTutorial: {
      title: 'Jak přesně vybrat bod?',
      description:
        'Podržte prst na obrazovce asi 0,5 sekundy. Nad prstem se objeví kříž, který při pohybu sleduje prst a přichytává se k geometrii pro přesnější výběr.',
      snoozeToday: 'Dnes už nepřipomínat',
      hideForever: 'Už nepřipomínat',
      ok: 'Rozumím'
    },
    status: {
      ready: 'Připraveno',
      zoomWindowHint: 'Klikněte na dva rohy pro přiblížení oknem.',
      measureDistanceHint:
        'Klikněte na dva body pro změření vzdálenosti (uchopení objektů zapnuto).',
      measureContinuousHint:
        'Klepejte na další body pro měření každého úseku; dokončete klepnutím na ✓. Dlouhé stisknutí pro přesné uchopení.',
      measureAngleHint:
        'Klikněte na vrchol, poté na dva body na každém rameni (uchopení objektů zapnuto).',
      measureArcHint:
        'Klikněte na kružnici nebo oblouk pro měření podél něj, nebo klikněte na začátek, bod na oblouku a konec (uchopení objektů zapnuto). Ctrl (⌘ na Macu) přepíná velký/malý oblouk.',
      measureRadiusHint:
        'Klikněte na kružnici nebo oblouk pro změření poloměru (uchopení objektů zapnuto).',
      measureAreaHint:
        'Klepejte na vrcholy mnohoúhelníku; dokončete klepnutím na ✓ po alespoň třech bodech.',
      measureCoordinateHint:
        'Klikněte na bod pro zobrazení jeho souřadnic X/Y (uchopení objektů zapnuto).',
      measureExported: 'Exportováno {count} měření.',
      measureImported: 'Importováno {count} měření.',
      measureImportFailed: 'Import měření selhal: {error}',
      markupCloudHint: 'Klikněte na dva rohy pro nakreslení obláčku.',
      markupCalloutHint:
        'Klikněte na hrot vodítka, nebo na obrys obláčku/obdélníku/kružnice bez odkazu, a poté na kotvu textu.',
      markupTextHint: 'Klikněte pro umístění textu.',
      markupRectHint: 'Klikněte na dva rohy pro nakreslení obdélníku.',
      markupCircleHint: 'Klikněte na střed a poté na bod na kružnici.',
      markupArrowHint: 'Klikněte na začátek a poté na hrot šipky.',
      markupStampHint:
        'Klikněte pro umístění razítka (schváleno / zamítnuto / …).',
      markupArrowEndHint: 'Klikněte na hrot šipky.',
      markupRectCornerHint: 'Klikněte na protilehlý roh.',
      markupCloudCornerHint: 'Klikněte na protilehlý roh.',
      markupCalloutAnchorHint: 'Klikněte na pozici textové bubliny.',
      markupCircleRadiusHint: 'Klikněte na bod na kružnici.',
      markupTextPrompt: 'Zadejte text poznámky',
      markupTextEditHint:
        'Pište text přímo na plátno. Enter dokončí, Esc zruší.',
      markupShapeCalloutHint:
        'Klikněte pro umístění textového pole (vodítko se připojí k tvaru). Esc zruší odkaz.',
      markupDefaultLabel: 'Poznámka',
      markupSelected: 'Vybraná poznámka: {type}',
      markupSelectedCount: 'Vybrané poznámky: {count}',
      markupCount: 'Poznámky: {count}',
      markupExported: 'Exportováno {count} poznámek.',
      markupImported: 'Importováno {count} poznámek.',
      markupImportFailed: 'Import poznámek selhal: {error}',
      distance: 'Vzdálenost: {value}',
      coordinates: 'X: {x} | Y: {y}',
      angle: 'Úhel: {value}',
      arcLength:
        'Délka oblouku: {length} | Poloměr: {radius} | Úhel: {angle} | Tětiva: {chord}',
      radius: 'Poloměr: {value}',
      continuousTotal: 'Celková délka: {value}',
      area: 'Plocha: {value}',
      lengthTotal: 'Celková délka: {value}',
      areaTotal: 'Celková plocha: {value}',
      zoomLayer: 'Zoom: {name}',
      loadFailed: 'Nepodařilo se načíst výkres: {error}',
      noLayout: 'Snímek neobsahuje data tiskových stránek.',
      loadingChunks: 'Načítání geometrie… {loaded}/{total}',
      loadingOsnap: 'Načítání uchopování… {loaded}/{total}',
      buildingOsnap: 'Sestavování indexu uchopování…'
    },
    package: {
      title: 'Otevřít balíček výkresu',
      hint: 'Vedle této stránky nebyl nalezen drawing.acex.json. Vyberte místní složku balíčku nebo zadejte URL manifestu.',
      hintUrlOnly:
        'Vedle této stránky nebyl nalezen drawing.acex.json. Zadejte URL manifestu pro otevření balíčku.',
      chooseFolder: 'Vybrat místní složku',
      urlPlaceholder: 'https://example.com/drawing.acex.json',
      openUrl: 'Otevřít URL',
      urlRequired: 'Zadejte URL manifestu.',
      manifestNotFound: 'drawing.acex.json nebyl vedle této stránky nalezen.',
      invalidManifest:
        'Manifest balíčku je neplatný nebo používá nepodporovanou verzi: {error}',
      folderMissingManifest:
        'Vybraná složka musí obsahovat drawing.acex.json.',
      folderUnsupported:
        'Tento prohlížeč neumí otevřít místní složku balíčku. Zadejte místo toho URL manifestu.',
      loadFailed: 'Nepodařilo se otevřít balíček: {error}'
    },
    access: {
      title: 'Chráněný výkres',
      passwordPrompt: 'Zadejte heslo pro otevření tohoto souboru.',
      passwordPlaceholder: 'Heslo',
      unlock: 'Odemknout',
      passwordRequired: 'Zadejte heslo.',
      wrongPassword: 'Nesprávné heslo. Zkuste to znovu.',
      expired: 'Platnost tohoto souboru vypršela a nelze jej otevřít.',
      expiredTitle: 'Soubor vypršel',
      expiredDetail:
        'Platnost tohoto souboru vypršela dne {time} a již jej nelze otevřít.',
      expiresAt: 'Platnost do: {time}',
      badgeExpires: 'Platnost do {time}',
      badgeCountdown: 'Vyprší za {time}',
      tooManyAttempts:
        'Příliš mnoho nesprávných pokusů o heslo. Obnovte stránku a zkuste to znovu.'
    }
  },
  tr: {
    toolbar: {
      viewerTools: 'Görüntüleyici araçları',
      select: 'Seç',
      pan: 'Kaydır',
      zoom: 'Yakınlaştır',
      zoomExtents: 'Sınırlar',
      zoomSmartExtents: 'Akıllı',
      zoomWindow: 'Pencere',
      zoomSaved: 'Kayıtlı',
      zoomOriginal: 'Kayıtlı',
      measureDistance: 'Mesafe',
      measureContinuous: 'Sürekli',
      measureAngle: 'Açı',
      measureArc: 'Yay',
      measureRadius: 'Yarıçap',
      measureArea: 'Alan',
      measureCoordinate: 'XY',
      clearMeasurements: 'Temizle',
      measureHide: 'Gizle',
      measureShow: 'Göster',
      measureImport: 'İçe aktar',
      measureExport: 'Dışa aktar',
      measurementPanel: 'Sonuç',
      measure: 'Ölçüm',
      annotation: 'Yorumlar',
      markupCloud: 'Bulut',
      markupCallout: 'Çağrı',
      markupText: 'Metin',
      markupRect: 'Dörtgen',
      markupCircle: 'Daire',
      markupArrow: 'Ok',
      markupStamp: 'Damga',
      markupPanel: 'Sonuç',
      markupHide: 'Gizle',
      markupShow: 'Göster',
      clearMarkups: 'Temizle',
      markupImport: 'İçe aktar',
      markupExport: 'Dışa aktar',
      snap: 'Yakalama',
      layers: 'Katman',
      layout: 'Baskı sayfası',
      settings: 'Ayarlar',
      simulatedMouseOn: 'Fare',
      simulatedMouseOff: 'Büyüteç',
      themeLight: 'Açık',
      themeDark: 'Koyu',
      switchBg: 'Arka plan',
      language: 'Dil',
      localeEn: 'English',
      localeJa: '日本語',
      localeZh: '中文',
      localeCs: 'Čeština',
      localeTr: 'Türkçe',
      collapse: 'Araç çubuğunu daralt',
      expand: 'Araç çubuğunu genişlet',
      moreOverflow: 'Diğer araçlar'
    },
    settings: {
      ortho: 'Dik modu aç/kapat',
      polar: 'Açı yakalama',
      polarAngles: 'Yakalama açıları'
    },
    drawStyle: {
      color: 'Renk',
      fontSize: 'Yazı yüksekliği',
      pickerTitle: 'Renk Seç',
      close: 'Kapat',
      ok: 'Tamam',
      cancel: 'İptal',
      index: 'Renk İndeksi: ',
      rgb: 'RGB: ',
      input: 'Renk',
      inputPlaceholder: '1-255 veya #RRGGBB'
    },
    shortCutToolbar: {
      more: 'Daha fazla',
      undo: 'Geri al',
      redo: 'Yinele',
      erase: 'Sil',
      collapse: 'Araç çubuğunu daralt',
      expand: 'Araç çubuğunu genişlet'
    },
    textHeight: {
      title: 'Yazı Yüksekliği',
      close: 'Kapat',
      ok: 'Tamam',
      cancel: 'İptal',
      adaptive: 'Ekrana uyarla',
      custom: 'Özel yazı yüksekliği',
      customPlaceholder: 'Dünya yüksekliği',
      fromScreen: 'Ekran boyutundan',
      fromScreenHint:
        'Geçerli yakınlaştırmada ekranda istediğiniz yazı boyutunu girin. Sabit bir dünya yüksekliğine dönüştürülür; sonra yakınlaştırınca bu yükseklik değişmez.',
      screenPxPlaceholder: 'Yazı boyutu',
      screenUnit: 'px',
      convert: 'Dönüştür'
    },
    entityPick: {
      cancel: 'Seçimi iptal et'
    },
    layers: {
      title: 'Katmanlar',
      close: 'Katmanları kapat',
      showAll: 'Tümünü göster',
      hideAll: 'Tümünü gizle',
      zoomTo: '{name} katmanına yakınlaştır'
    },
    review: {
      title: 'Yorumlar',
      close: 'Yorumları kapat',
      searchPlaceholder: 'İşaretlerde ara',
      empty: 'Henüz işaret yok',
      type: 'Tür',
      status: 'Durum',
      author: 'Yazar',
      summary: 'Özet',
      details: 'Ayrıntılar',
      closeDetails: 'Ayrıntıları kapat',
      label: 'Etiket',
      comment: 'Yorum',
      zoomTo: 'Yakınlaştır',
      delete: 'Sil',
      clear: 'Tümünü temizle',
      statusValues: {
        open: 'Açık',
        question: 'Soru',
        answered: 'Yanıtlandı',
        closed: 'Kapalı'
      }
    },
    measurePanel: {
      title: 'Ölçümler',
      close: 'Ölçümleri kapat',
      filterGroup: 'Türe göre filtrele',
      filterDistance: 'Mesafe',
      filterArc: 'Yay',
      filterRadius: 'Yarıçap',
      filterAngle: 'Açı',
      filterArea: 'Alan',
      empty: 'Henüz ölçüm yok',
      type: 'Tür',
      value: 'Değer',
      delete: 'Sil',
      clear: 'Tümünü temizle'
    },
    session: {
      length: 'Uzunluk',
      angle: 'Açı',
      dx: 'ΔX',
      dy: 'ΔY',
      x: 'X',
      y: 'Y',
      confirm: 'Onayla',
      cancel: 'İptal',
      help: 'Yardım',
      back: 'Geri',
      collapse: 'Daralt',
      expand: 'Genişlet',
      undo: 'Geri al'
    },
    touchPointTutorial: {
      title: 'Noktalar nasıl hassas seçilir?',
      description:
        'Ekranda yaklaşık 0,5 saniye basılı tutun. Parmağınızın üstünde bir artı belirir ve hareket ederken geometriye yapışarak daha doğru seçim yapmanızı sağlar.',
      snoozeToday: 'Bugün tekrar hatırlatma',
      hideForever: 'Bir daha hatırlatma',
      ok: 'Anladım'
    },
    status: {
      ready: 'Hazır',
      zoomWindowHint: 'Pencere yakınlaştırmak için iki köşeyi tıklayın.',
      measureDistanceHint:
        'Mesafe ölçmek için iki nokta tıklayın (nesne yakalama etkin).',
      measureContinuousHint:
        'Her segmenti ölçmek için ardışık noktalar dokunun; bitirmek için ✓. Hassas yakalama için basılı tutun.',
      measureAngleHint:
        'Önce köşe noktasını, sonra her koldan birer nokta tıklayın (nesne yakalama etkin).',
      measureArcHint:
        'Ölçmek için bir çember veya yaya tıklayın; ya da yay başlangıcı, yay üzerindeki bir nokta ve yay sonunu tıklayın (nesne yakalama etkin). Ctrl (Mac’te ⌘) büyük/küçük yay arasında geçiş yapar.',
      measureRadiusHint:
        'Yarıçap ölçmek için bir çember veya yaya tıklayın (nesne yakalama etkin).',
      measureAreaHint:
        'Çokgen köşelerini dokunun; en az üç noktadan sonra bitirmek için ✓.',
      measureCoordinateHint:
        'X/Y koordinatlarını okumak için bir nokta tıklayın (nesne yakalama etkin).',
      measureExported: '{count} ölçüm dışa aktarıldı.',
      measureImported: '{count} ölçüm içe aktarıldı.',
      measureImportFailed: 'Ölçüm içe aktarılamadı: {error}',
      markupCloudHint: 'Revizyon bulutu çizmek için iki köşe tıklayın.',
      markupCalloutHint:
        'Lider ucunu veya çağrısı olmayan bulut/dikdörtgen/daire dış çerçevesini tıklayın, ardından metin konumunu tıklayın.',
      markupTextHint: 'Metin yerleştirmek için bir nokta tıklayın.',
      markupRectHint: 'Dikdörtgen çizmek için iki köşe tıklayın.',
      markupCircleHint:
        'Önce merkezi, sonra çevre üzerindeki bir noktayı tıklayın.',
      markupArrowHint: 'Önce başlangıcı, sonra ok ucunu tıklayın.',
      markupStampHint:
        'Damga yerleştirmek için tıklayın (onaylandı / reddedildi / …).',
      markupArrowEndHint: 'Ok ucunu tıklayın.',
      markupRectCornerHint: 'Karşı köşeyi tıklayın.',
      markupCloudCornerHint: 'Karşı köşeyi tıklayın.',
      markupCalloutAnchorHint: 'Metin balonu konumunu tıklayın.',
      markupCircleRadiusHint: 'Çevre üzerindeki bir noktayı tıklayın.',
      markupTextPrompt: 'İşaretleme metnini girin',
      markupTextEditHint:
        'Metni tuval üzerinde yazın. Enter ile bitirin, Esc ile iptal edin.',
      markupShapeCalloutHint:
        'Metin kutusunu yerleştirmek için tıklayın (lider şekle bağlanır). Esc çağrıyı iptal eder.',
      markupDefaultLabel: 'Not',
      markupSelected: 'Seçili işaretleme: {type}',
      markupSelectedCount: 'Seçili işaretlemeler: {count}',
      markupCount: 'İşaretlemeler: {count}',
      markupExported: '{count} işaretleme dışa aktarıldı.',
      markupImported: '{count} işaretleme içe aktarıldı.',
      markupImportFailed: 'İşaretleme içe aktarılamadı: {error}',
      distance: 'Mesafe: {value}',
      coordinates: 'X: {x} | Y: {y}',
      angle: 'Açı: {value}',
      arcLength:
        'Yay uzunluğu: {length} | Yarıçap: {radius} | Açı: {angle} | Kiriş: {chord}',
      radius: 'Yarıçap: {value}',
      continuousTotal: 'Toplam uzunluk: {value}',
      area: 'Alan: {value}',
      lengthTotal: 'Toplam uzunluk: {value}',
      areaTotal: 'Toplam alan: {value}',
      zoomLayer: 'Yakınlaştır: {name}',
      loadFailed: 'Çizim yüklenemedi: {error}',
      noLayout: 'Anlık görüntüde baskı sayfası verisi yok.',
      loadingChunks: 'Geometri yükleniyor… {loaded}/{total}',
      loadingOsnap: 'Nesne yakalama yükleniyor… {loaded}/{total}',
      buildingOsnap: 'Nesne yakalama dizini oluşturuluyor…'
    },
    package: {
      title: 'Çizim paketini aç',
      hint: 'Bu sayfanın yanında drawing.acex.json bulunamadı. Yerel bir paket klasörü seçin veya manifesto URL’sini girin.',
      hintUrlOnly:
        'Bu sayfanın yanında drawing.acex.json bulunamadı. Paketi açmak için manifesto URL’sini girin.',
      chooseFolder: 'Yerel klasör seç',
      urlPlaceholder: 'https://example.com/drawing.acex.json',
      openUrl: 'URL aç',
      urlRequired: 'Lütfen bir manifesto URL’si girin.',
      manifestNotFound: 'Bu sayfanın yanında drawing.acex.json bulunamadı.',
      invalidManifest:
        'Paket manifestosu geçersiz veya desteklenmeyen bir sürüm kullanıyor: {error}',
      folderMissingManifest:
        'Seçilen klasör drawing.acex.json içermelidir.',
      folderUnsupported:
        'Bu tarayıcı yerel paket klasörü açamıyor. Bunun yerine manifesto URL’si yapıştırın.',
      loadFailed: 'Paket açılamadı: {error}'
    },
    access: {
      title: 'Korumalı çizim',
      passwordPrompt: 'Bu dosyayı açmak için parolayı girin.',
      passwordPlaceholder: 'Parola',
      unlock: 'Kilidi aç',
      passwordRequired: 'Lütfen bir parola girin.',
      wrongPassword: 'Parola yanlış. Tekrar deneyin.',
      expired: 'Bu dosyanın süresi doldu ve artık açılamaz.',
      expiredTitle: 'Dosyanın süresi doldu',
      expiredDetail:
        'Bu dosyanın süresi {time} tarihinde doldu ve artık açılamaz.',
      expiresAt: 'Son geçerlilik: {time}',
      badgeExpires: 'Son geçerlilik {time}',
      badgeCountdown: 'Kalan süre {time}',
      tooManyAttempts:
        'Çok fazla yanlış parola denemesi yapıldı. Tekrar denemek için sayfayı yenileyin.'
    }
  }
}

const AR_MESSAGES: AcExMessageTree = {
  'toolbar': {
    'viewerTools': 'أدوات العارض',
    'select': 'تحديد',
    'pan': 'تحريك',
    'zoom': 'تكبير/تصغير',
    'zoomExtents': 'ملاءمة',
    'zoomSmartExtents': 'ذكية',
    'zoomWindow': 'نافذة',
    'zoomSaved': 'محفوظ',
    'zoomOriginal': 'محفوظ',
    'measureDistance': 'مسافة',
    'measureContinuous': 'مستمر',
    'measureAngle': 'زاوية',
    'measureArc': 'قوس',
    'measureRadius': 'نصف القطر',
    'measureArea': 'مساحة',
    'measureCoordinate': 'إحداثيات',
    'clearMeasurements': 'مسح',
    'measureHide': 'إخفاء',
    'measureShow': 'إظهار',
    'measureImport': 'استيراد',
    'measureExport': 'تصدير',
    'measurementPanel': 'نتائج',
    'measure': 'قياس',
    'annotation': 'مراجعة',
    'markupCloud': 'سحابة',
    'markupCallout': 'تعليق',
    'markupText': 'نص',
    'markupRect': 'مستطيل',
    'markupCircle': 'دائرة',
    'markupArrow': 'سهم',
    'markupStamp': 'ختم',
    'markupPanel': 'نتائج',
    'markupHide': 'إخفاء',
    'markupShow': 'إظهار',
    'clearMarkups': 'مسح',
    'markupImport': 'استيراد',
    'markupExport': 'تصدير',
    'snap': 'التقاط',
    'layers': 'طبقات',
    'layout': 'صفحة الطباعة',
    'settings': 'إعدادات',
    'simulatedMouseOn': 'ماوس',
    'simulatedMouseOff': 'عدسة',
    'themeLight': 'فاتح',
    'themeDark': 'داكن',
    'switchBg': 'خلفية',
    'language': 'اللغة',
    'localeEn': 'English',
    'localeJa': '日本語',
    'localeZh': '中文',
    'localeCs': 'Čeština',
    'localeTr': 'Türkçe',
    'localeAr': 'العربية',
    'collapse': 'طي شريط الأدوات',
    'expand': 'توسيع شريط الأدوات',
    'moreOverflow': 'المزيد من الأدوات'
  },
  'settings': {
    'ortho': 'تبديل الوضع المتعامد',
    'polar': 'التقاط الزاوية',
    'polarAngles': 'زوايا الالتقاط'
  },
  'drawStyle': {
    'color': 'اللون',
    'fontSize': 'ارتفاع النص',
    'pickerTitle': 'تحديد اللون',
    'close': 'إغلاق',
    'ok': 'موافق',
    'cancel': 'إلغاء',
    'index': 'فهرس اللون: ',
    'rgb': 'RGB: ',
    'input': 'اللون',
    'inputPlaceholder': '1-255 أو #RRGGBB'
  },
  'textHeight': {
    'title': 'ارتفاع النص',
    'close': 'إغلاق',
    'ok': 'موافق',
    'cancel': 'إلغاء',
    'adaptive': 'ملاءمة الشاشة',
    'custom': 'ارتفاع نص مخصص',
    'customPlaceholder': 'ارتفاع العالم',
    'fromScreen': 'من حجم الشاشة',
    'fromScreenHint':
      'أدخل حجم النص المطلوب على الشاشة عند التكبير الحالي. يُحوَّل إلى ارتفاع ثابت في إحداثيات الرسم ويبقى كما هو عند تغيير التكبير لاحقًا.',
    'screenPxPlaceholder': 'حجم الخط',
    'screenUnit': 'px',
    'convert': 'تحويل'
  },
  'layers': {
    'title': 'الطبقات',
    'close': 'إغلاق الطبقات',
    'showAll': 'إظهار الكل',
    'hideAll': 'إخفاء الكل',
    'zoomTo': 'تكبير إلى {name}'
  },
  'review': {
    'title': 'مراجعة',
    'close': 'إغلاق المراجعة',
    'searchPlaceholder': 'البحث في الملاحظات',
    'empty': 'لا توجد ملاحظات بعد',
    'type': 'النوع',
    'status': 'الحالة',
    'author': 'المؤلف',
    'summary': 'الملخص',
    'details': 'التفاصيل',
    'closeDetails': 'إغلاق التفاصيل',
    'label': 'التسمية',
    'comment': 'التعليق',
    'zoomTo': 'تكبير إلى',
    'delete': 'حذف',
    'clear': 'مسح الكل',
    'statusValues': {
      'open': 'مفتوح',
      'question': 'سؤال',
      'answered': 'تمت الإجابة',
      'closed': 'مغلق'
    }
  },
  'measurePanel': {
    'title': 'القياسات',
    'close': 'إغلاق القياسات',
    'filterGroup': 'التصفية حسب النوع',
    'filterDistance': 'مسافة',
    'filterArc': 'قوس',
    'filterRadius': 'نصف القطر',
    'filterAngle': 'زاوية',
    'filterArea': 'مساحة',
    'empty': 'لا توجد قياسات حتى الآن',
    'type': 'النوع',
    'value': 'القيمة',
    'delete': 'حذف',
    'clear': 'مسح الكل'
  },
  'session': {
    'length': 'الطول',
    'angle': 'الزاوية',
    'dx': 'ΔX',
    'dy': 'ΔY',
    'x': 'X',
    'y': 'Y',
    'confirm': 'تأكيد',
    'cancel': 'إلغاء',
    'help': 'مساعدة',
    'back': 'رجوع',
    'collapse': 'طي',
    'expand': 'توسيع',
    'undo': 'تراجع'
  },
  'touchPointTutorial': {
    'title': 'كيف أختار النقاط بدقة؟',
    'description':
      'اضغط مطولاً على الشاشة لمدة نصف ثانية تقريباً. يظهر صليب فوق إصبعك ويتبعه أثناء الحركة ويلتقط إلى الهندسة لاختيار أدق.',
    'snoozeToday': 'لا تذكرني اليوم',
    'hideForever': 'لا تذكرني مرة أخرى',
    'ok': 'فهمت'
  },
  'status': {
    'ready': 'جاهز',
    'zoomWindowHint': 'انقر على ركنين لتحديد نافذة التكبير.',
    'measureDistanceHint': 'انقر على نقطتين لقياس المسافة (التقاط الكائنات مفعّل).',
    'measureContinuousHint': 'انقر على نقاط متتالية لقياس كل قطعة؛ انقر ✓ للإنهاء. اضغط مطولاً للالتقاط الدقيق.',
    'measureAngleHint': 'انقر على رأس الزاوية، ثم نقطة على كل ضلع (التقاط الكائنات مفعّل).',
    'measureArcHint': 'انقر على دائرة أو قوس للقياس عليه، أو انقر على نقطة البداية ثم نقطة على القوس ثم نقطة النهاية (التقاط الكائنات مفعّل). استخدم Ctrl (⌘ على Mac) للتبديل بين القوس الأكبر والأصغر.',
    'measureRadiusHint': 'انقر على دائرة أو قوس لقياس نصف القطر (التقاط الكائنات مفعّل).',
    'measureAreaHint': 'انقر على رؤوس المضلع؛ انقر ✓ للإنهاء بعد ثلاث نقاط على الأقل.',
    'measureCoordinateHint': 'انقر على نقطة لقراءة إحداثيات X/Y الخاصة بها (التقاط الكائنات مفعّل).',
    'measureExported': 'تم تصدير {count} من القياسات.',
    'measureImported': 'تم استيراد {count} من القياسات.',
    'measureImportFailed': 'فشل استيراد القياسات: {error}',
    'markupCloudHint': 'انقر على ركنين لرسم سحابة مراجعة.',
    'markupCalloutHint':
      'انقر على طرف خط الإشارة، أو على إطار سحابة/مستطيل/دائرة بدون تعليق توضيحي، ثم موضع النص.',
    'markupTextHint': 'انقر على نقطة لوضع النص.',
    'markupRectHint': 'انقر على ركنين لرسم مستطيل.',
    'markupCircleHint': 'انقر على المركز، ثم على نقطة على المحيط.',
    'markupArrowHint': 'انقر على نقطة البداية، ثم على رأس السهم.',
    'markupStampHint': 'انقر لوضع ختم (يتنقل بين معتمد / مرفوض / …).',
    'markupArrowEndHint': 'انقر على رأس السهم.',
    'markupRectCornerHint': 'انقر على الركن المقابل.',
    'markupCloudCornerHint': 'انقر على الركن المقابل.',
    'markupCalloutAnchorHint': 'انقر على موضع فقاعة النص.',
    'markupCircleRadiusHint': 'انقر على نقطة على المحيط.',
    'markupTextPrompt': 'أدخل نص الملاحظة',
    'markupTextEditHint': 'اكتب النص على مساحة الرسم. اضغط Enter للإنهاء أو Esc للإلغاء.',
    'markupShapeCalloutHint': 'انقر لوضع مربع النص (يتصل خط الإشارة بالشكل). اضغط Esc لإلغاء التعليق التوضيحي.',
    'markupDefaultLabel': 'ملاحظة',
    'markupSelected': 'الملاحظة المحددة: {type}',
    'markupSelectedCount': 'الملاحظات المحددة: {count}',
    'markupCount': 'عدد الملاحظات: {count}',
    'markupExported': 'تم تصدير {count} من الملاحظات.',
    'markupImported': 'تم استيراد {count} من الملاحظات.',
    'markupImportFailed': 'فشل استيراد الملاحظات: {error}',
    'distance': 'المسافة: {value}',
    'coordinates': 'X: {x} | Y: {y}',
    'angle': 'الزاوية: {value}',
    'arcLength':
      'طول القوس: {length} | نصف القطر: {radius} | الزاوية: {angle} | الوتر: {chord}',
    'radius': 'نصف القطر: {value}',
    'continuousTotal': 'إجمالي الطول: {value}',
    'area': 'المساحة: {value}',
    'lengthTotal': 'إجمالي الطول: {value}',
    'areaTotal': 'إجمالي المساحة: {value}',
    'zoomLayer': 'تكبير: {name}',
    'loadFailed': 'فشل تحميل الرسم: {error}',
    'noLayout': 'لا توجد بيانات صفحات الطباعة في اللقطة.',
    'loadingChunks': 'جاري تحميل الهندسة… {loaded}/{total}',
    'loadingOsnap': 'جاري تحميل الالتقاط… {loaded}/{total}',
    'buildingOsnap': 'جاري بناء فهرس الالتقاط…'
  },
  package: {
    title: 'فتح حزمة الرسم',
    hint: 'لم يتم العثور على drawing.acex.json بجانب هذه الصفحة. اختر مجلد الحزمة المحلي أو أدخل عنوان URL للقائمة.',
    hintUrlOnly:
      'لم يتم العثور على drawing.acex.json بجانب هذه الصفحة. أدخل عنوان URL للقائمة لفتح الحزمة.',
    chooseFolder: 'اختيار مجلد محلي',
    urlPlaceholder: 'https://example.com/drawing.acex.json',
    openUrl: 'فتح الرابط',
    urlRequired: 'يرجى إدخال عنوان URL للقائمة.',
    manifestNotFound: 'لم يتم العثور على drawing.acex.json بجانب هذه الصفحة.',
    invalidManifest:
      'قائمة الحزمة غير صالحة أو تستخدم إصداراً غير مدعوم: {error}',
    folderMissingManifest:
      'يجب أن يحتوي المجلد المحدد على drawing.acex.json.',
    folderUnsupported:
      'لا يمكن لهذا المتصفح فتح مجلد حزمة محلي. الصق عنوان URL للقائمة بدلاً من ذلك.',
    loadFailed: 'تعذر فتح الحزمة: {error}'
  },
  access: {
    title: 'رسم محمي',
    passwordPrompt: 'أدخل كلمة المرور لفتح هذا الملف.',
    passwordPlaceholder: 'كلمة المرور',
    unlock: 'فتح',
    passwordRequired: 'يرجى إدخال كلمة المرور.',
    wrongPassword: 'كلمة المرور غير صحيحة. حاول مرة أخرى.',
    expired: 'انتهت صلاحية هذا الملف ولا يمكن فتحه.',
    expiredTitle: 'انتهت صلاحية الملف',
    expiredDetail:
      'انتهت صلاحية هذا الملف في {time} ولا يمكن فتحه.',
    expiresAt: 'ينتهي في: {time}',
    badgeExpires: 'ينتهي في {time}',
    badgeCountdown: 'متبقي {time}',
    tooManyAttempts:
      'عدد محاولات إدخال كلمة المرور كبير جدًا. قم بتحديث الصفحة للمحاولة مرة أخرى.'
  }
}

const JA_MESSAGES: AcExMessageTree = {
  toolbar: {
    viewerTools: 'ビューアツール',
    select: '選択',
    pan: '画面移動',
    zoom: 'ズーム',
    zoomExtents: '範囲',
    zoomSmartExtents: 'スマート',
    zoomWindow: '窓',
    zoomSaved: '保存ビュー',
    zoomOriginal: '保存ビュー',
    measureDistance: '距離',
    measureContinuous: '連続',
    measureAngle: '角度',
    measureArc: '円弧',
    measureRadius: '半径',
    measureArea: '面積',
    measureCoordinate: 'XY',
    clearMeasurements: 'クリア',
    measureHide: '非表示',
    measureShow: '表示',
    measureImport: '読み込み',
    measureExport: '書き出し',
    measurementPanel: '結果',
    measure: '計測',
    annotation: 'コメント',
    markupCloud: '雲マーク',
    markupCallout: '吹き出し',
    markupText: '文字',
    markupRect: '長方形',
    markupCircle: '円',
    markupArrow: '矢印',
    markupStamp: 'スタンプ',
    markupPanel: '結果',
    markupHide: '非表示',
    markupShow: '表示',
    clearMarkups: 'クリア',
    markupImport: '読み込み',
    markupExport: '書き出し',
    snap: 'スナップ',
    layers: 'レイヤー',
    layout: '印刷ページ',
    settings: '設定',
    simulatedMouseOn: 'マウス',
    simulatedMouseOff: 'ルーペ',
    themeLight: 'ライト',
    themeDark: 'ダーク',
    switchBg: '背景',
    language: '言語',
    localeEn: 'English',
    localeJa: '日本語',
    localeZh: '中文',
    localeCs: 'Čeština',
    localeTr: 'Türkçe',
    localeAr: 'العربية',
    collapse: 'ツールバーを折りたたむ',
    expand: 'ツールバーを展開',
    moreOverflow: 'その他のツール'
  },
  settings: {
    ortho: '直交モードの切り替え',
    polar: '角度スナップ',
    polarAngles: 'スナップする角度'
  },
  drawStyle: {
    color: '色',
    fontSize: '文字の高さ',
    pickerTitle: '色を選択',
    close: '閉じる',
    ok: 'OK',
    cancel: 'キャンセル',
    index: 'インデックスカラー: ',
    rgb: 'RGB: ',
    input: '色',
    inputPlaceholder: '1～255 または #RRGGBB'
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
  layers: {
    title: 'レイヤー',
    close: 'レイヤーを閉じる',
    showAll: 'すべて表示',
    hideAll: 'すべて非表示',
    zoomTo: '{name} にズーム'
  },
  review: {
    title: 'コメント',
    close: 'コメントを閉じる',
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
  measurePanel: {
    title: '計測',
    close: '計測を閉じる',
    filterGroup: '種類で絞り込み',
    filterDistance: '距離',
    filterArc: '円弧',
    filterRadius: '半径',
    filterAngle: '角度',
    filterArea: '面積',
    empty: '計測はまだありません',
    type: '種類',
    value: '値',
    delete: '削除',
    clear: 'すべてクリア'
  },
  session: {
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
    expand: '展開',
    undo: '元に戻す'
  },
  touchPointTutorial: {
    title: '点を正確に指定するには',
    description:
      '画面を約 0.5 秒長押しします。指の上に十字カーソルが表示されて指の動きに追従し、図形にスナップするので、より正確に指定できます。',
    snoozeToday: '今日は表示しない',
    hideForever: '今後表示しない',
    ok: 'わかりました'
  },
  status: {
    ready: '準備完了',
    zoomWindowHint: '2 つのコーナーをクリックすると、その窓にズームします。',
    measureDistanceHint:
      '2 点をクリックして距離を計測します (オブジェクトスナップ有効)。',
    measureContinuousHint:
      '点を順にタップして各区間を計測し、✓ で終了します。長押しで正確にスナップします。',
    measureAreaHint:
      '多角形の頂点をタップし、3 点以上指定したら ✓ で終了します。長押しで正確にスナップします。',
    measureAngleHint:
      '頂点をクリックし、続けて各辺上の点をクリックします (オブジェクトスナップ有効)。',
    measureArcHint:
      '円または円弧をクリックしてその長さを計測するか、始点、円弧上の点、終点の順にクリックします (オブジェクトスナップ有効)。Ctrl (Mac は ⌘) で優弧/劣弧を切り替えます。',
    measureRadiusHint:
      '円または円弧をクリックして半径を計測します (オブジェクトスナップ有効)。',
    measureCoordinateHint:
      '点をクリックして X/Y 座標を読み取ります (オブジェクトスナップ有効)。',
    measureExported: '{count} 件の計測を書き出しました。',
    measureImported: '{count} 件の計測を読み込みました。',
    measureImportFailed: '計測を読み込めませんでした: {error}',
    markupCloudHint: '2 つのコーナーをクリックして雲マークを作成します。',
    markupCalloutHint:
      '引出線の先端、または吹き出しのない雲マーク/長方形/円の輪郭をクリックし、次に文字の位置をクリックします。',
    markupTextHint: '点をクリックして文字を配置します。',
    markupRectHint: '2 つのコーナーをクリックして長方形を作成します。',
    markupCircleHint: '中心をクリックし、次に円周上の点をクリックします。',
    markupArrowHint: '始点をクリックし、次に矢印の先端をクリックします。',
    markupStampHint:
      'クリックしてスタンプを配置します (承認 / 却下 / … を順に切り替え)。',
    markupArrowEndHint: '矢印の先端をクリックします。',
    markupRectCornerHint: 'もう一方のコーナーをクリックします。',
    markupCloudCornerHint: 'もう一方のコーナーをクリックします。',
    markupCalloutAnchorHint: '吹き出しの位置をクリックします。',
    markupCircleRadiusHint: '円周上の点をクリックします。',
    markupTextPrompt: 'マークアップの文字を入力',
    markupTextEditHint:
      'キャンバス上で文字を入力します。Enter で確定、Esc でキャンセルします。',
    markupShapeCalloutHint:
      'クリックしてテキストボックスを配置します (引出線は図形に接続されます)。Esc で吹き出しをキャンセルします。',
    markupDefaultLabel: 'メモ',
    markupSelected: '選択中のマークアップ: {type}',
    markupSelectedCount: '選択中のマークアップ: {count} 件',
    markupCount: 'マークアップ: {count} 件',
    markupExported: '{count} 件のマークアップを書き出しました。',
    markupImported: '{count} 件のマークアップを読み込みました。',
    markupImportFailed: 'マークアップを読み込めませんでした: {error}',
    distance: '距離: {value}',
    coordinates: 'X: {x} | Y: {y}',
    angle: '角度: {value}',
    arcLength:
      '円弧の長さ: {length} | 半径: {radius} | 角度: {angle} | 弦: {chord}',
    radius: '半径: {value}',
    continuousTotal: '合計の長さ: {value}',
    area: '面積: {value}',
    lengthTotal: '長さの合計: {value}',
    areaTotal: '面積の合計: {value}',
    zoomLayer: 'ズーム: {name}',
    loadFailed: '図面を読み込めませんでした: {error}',
    noLayout: 'スナップショットに印刷ページのデータがありません。',
    loadingChunks: '図形を読み込んでいます… {loaded}/{total}',
    loadingOsnap: 'オブジェクトスナップを読み込んでいます… {loaded}/{total}',
    buildingOsnap: 'オブジェクトスナップのインデックスを作成しています…'
  },
  package: {
    title: '図面パッケージを開く',
    hint: 'このページの隣に drawing.acex.json が見つかりませんでした。ローカルのパッケージフォルダを選択するか、マニフェストの URL を入力してください。',
    hintUrlOnly:
      'このページの隣に drawing.acex.json が見つかりませんでした。パッケージを開くにはマニフェストの URL を入力してください。',
    chooseFolder: 'ローカルフォルダを選択',
    urlPlaceholder: 'https://example.com/drawing.acex.json',
    openUrl: 'URL を開く',
    urlRequired: 'マニフェストの URL を入力してください。',
    manifestNotFound: 'このページの隣に drawing.acex.json が見つかりませんでした。',
    invalidManifest:
      'パッケージのマニフェストが無効か、サポートされていないバージョンです: {error}',
    folderMissingManifest:
      '選択したフォルダには drawing.acex.json が含まれている必要があります。',
    folderUnsupported:
      'このブラウザではローカルのパッケージフォルダを開けません。代わりにマニフェストの URL を貼り付けてください。',
    loadFailed: 'パッケージを開けませんでした: {error}'
  },
  access: {
    title: '保護された図面',
    passwordPrompt: 'このファイルを開くにはパスワードを入力してください。',
    passwordPlaceholder: 'パスワード',
    unlock: 'ロック解除',
    passwordRequired: 'パスワードを入力してください。',
    wrongPassword: 'パスワードが正しくありません。もう一度入力してください。',
    expired: 'このファイルは有効期限が切れているため開けません。',
    expiredTitle: '有効期限切れ',
    expiredDetail: 'このファイルは {time} に有効期限が切れたため開けません。',
    expiresAt: '有効期限: {time}',
    badgeExpires: '{time} まで有効',
    badgeCountdown: '残り {time}',
    tooManyAttempts:
      'パスワードの入力に何度も失敗しました。ページを再読み込みしてもう一度お試しください。'
  }
}

const MESSAGES: Record<AcExHtmlLocale, AcExMessageTree> = {
  ...BASE_MESSAGES,
  ja: JA_MESSAGES,
  ar: AR_MESSAGES
}

/**
 * Type guard for {@link AcExHtmlLocale}.
 *
 * @param value - Arbitrary string to test.
 * @returns `true` when `value` is one of {@link ACEX_HTML_LOCALES}.
 */
export function isAcExHtmlLocale(value: string): value is AcExHtmlLocale {
  return (ACEX_HTML_LOCALES as readonly string[]).includes(value)
}

/**
 * Normalizes a BCP 47 or short locale tag to a supported {@link AcExHtmlLocale}.
 *
 * @param value - Locale string from snapshot meta, `<html lang>`, or `navigator.language`.
 * @returns a supported locale, or `null` when unrecognized.
 */
export function resolveAcExHtmlLocale(
  value?: string | null
): AcExHtmlLocale | null {
  if (value == null || value === '') return null
  const normalized = value.toLowerCase().replace('_', '-')
  for (const locale of ACEX_HTML_LOCALES) {
    if (normalized === locale || normalized.startsWith(`${locale}-`)) {
      return locale
    }
  }
  return null
}

/**
 * Detects locale from the browser's language preferences.
 * Returns the first preferred language that maps to a supported locale;
 * defaults to `'en'`.
 */
export function detectBrowserAcExHtmlLocale(): AcExHtmlLocale {
  if (typeof navigator === 'undefined') return 'en'

  const candidates = [
    ...(navigator.languages ?? []),
    navigator.language
  ].filter(Boolean)

  for (const candidate of candidates) {
    const resolved = resolveAcExHtmlLocale(candidate)
    if (resolved) return resolved
  }

  return 'en'
}

/**
 * Chooses the initial locale for the offline viewer using, in order:
 * persisted user choice in `localStorage`, then {@link detectBrowserAcExHtmlLocale}.
 *
 * @returns Resolved locale, defaulting to `'en'`.
 */
export function detectAcExHtmlLocale(): AcExHtmlLocale {
  if (typeof localStorage !== 'undefined') {
    try {
      const stored = localStorage.getItem(ACEX_HTML_LOCALE_STORAGE_KEY)
      const fromStorage = resolveAcExHtmlLocale(stored)
      if (fromStorage) return fromStorage
    } catch {
      /* private mode */
    }
  }

  return detectBrowserAcExHtmlLocale()
}

function lookupMessage(tree: AcExMessageTree, key: string): string | undefined {
  const parts = key.split('.')
  let node: string | AcExMessageTree | undefined = tree
  for (const part of parts) {
    if (node == null || typeof node === 'string') return undefined
    node = node[part]
  }
  return typeof node === 'string' ? node : undefined
}

/**
 * Replaces `{name}` placeholders in a message template.
 *
 * @param template - Localized string possibly containing `{param}` tokens.
 * @param params - Values substituted by token name; missing keys are left unchanged.
 * @returns Interpolated user-visible string.
 */
export function formatAcExHtmlMessage(
  template: string,
  params?: Record<string, string | number>
): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (_, name: string) => {
    const value = params[name]
    return value != null ? String(value) : `{${name}}`
  })
}

/**
 * Lightweight i18n helper for the exported HTML viewer shell.
 * Updates elements marked with `data-i18n-text` / `data-i18n-attr` and persists locale choice.
 */
export class AcExHtmlI18n {
  private _locale: AcExHtmlLocale
  private _onChange: (() => void) | null = null

  /**
   * @param initialLocale - Starting locale; defaults to {@link detectAcExHtmlLocale} when omitted.
   */
  constructor(initialLocale?: AcExHtmlLocale) {
    this._locale = initialLocale ?? detectAcExHtmlLocale()
  }

  /** Active locale used for {@link AcExHtmlI18n.t}. */
  get locale(): AcExHtmlLocale {
    return this._locale
  }

  /** Short badge text shown on the language parent button and locale strip. */
  get localeBadge(): string {
    return ACEX_HTML_LOCALE_BADGES[this._locale]
  }

  /**
   * Registers a callback invoked after {@link AcExHtmlI18n.setLocale} or
   * {@link AcExHtmlI18n.toggleLocale} updates the UI.
   *
   * @param handler - Listener, or `null` to clear.
   */
  setOnChange(handler: (() => void) | null): void {
    this._onChange = handler
  }

  /**
   * Resolves and formats a message for the active locale, falling back to English.
   *
   * @param key - Dot-separated message key.
   * @param params - Optional placeholder values for `{name}` tokens.
   */
  t(key: AcExHtmlMessageKey, params?: Record<string, string | number>): string {
    const template =
      lookupMessage(MESSAGES[this._locale], key) ??
      lookupMessage(MESSAGES.en, key) ??
      key
    return formatAcExHtmlMessage(template, params)
  }

  /**
   * Advances to the next locale in {@link ACEX_HTML_LOCALES} (wrapping around),
   * persists the choice, and refreshes the DOM. Kept for tests and hosts that
   * still cycle locales programmatically.
   *
   * @returns The locale after switching.
   */
  toggleLocale(): AcExHtmlLocale {
    const index = ACEX_HTML_LOCALES.indexOf(this._locale)
    const next = ACEX_HTML_LOCALES[(index + 1) % ACEX_HTML_LOCALES.length]
    this.setLocale(next)
    return next
  }

  /**
   * Sets the active locale, updates `<html lang>`, storage, and bound DOM nodes.
   *
   * @param locale - Target locale.
   */
  setLocale(locale: AcExHtmlLocale): void {
    if (this._locale === locale) return
    this._locale = locale
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale
    }
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(ACEX_HTML_LOCALE_STORAGE_KEY, locale)
      }
    } catch {
      /* private mode */
    }
    this.applyToDocument()
    this._onChange?.()
  }

  /**
   * Applies translated text to elements under `root` (or the full document).
   * Only updates leaf nodes with `data-i18n-text` to avoid clobbering icon markup.
   *
   * @param root - Subtree to scan; defaults to `document` when omitted.
   */
  applyToDocument(root?: ParentNode): void {
    if (typeof document === 'undefined') return
    const scope = root ?? document
    document.documentElement.lang = this._locale

    // Only leaf text targets — never set textContent on containers or icon buttons.
    scope.querySelectorAll<HTMLElement>('[data-i18n-text]').forEach(el => {
      const key = el.dataset.i18nKey as AcExHtmlMessageKey | undefined
      if (!key) return
      el.textContent = this.t(key)
    })

    scope.querySelectorAll<HTMLElement>('[data-i18n-attr]').forEach(el => {
      const key = el.dataset.i18nKey as AcExHtmlMessageKey | undefined
      const attrs = el.dataset.i18nAttr?.split(/\s+/) ?? []
      if (!key || attrs.length === 0) return
      const text = this.t(key)
      for (const attr of attrs) {
        el.setAttribute(attr, text)
      }
    })

    const badge = document.getElementById('mlcad-lang-badge')
    if (badge) badge.textContent = this.localeBadge
  }
}
