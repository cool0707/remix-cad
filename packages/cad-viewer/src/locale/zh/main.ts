export default {
  mainMenu: {
    new: '新建图纸',
    open: '打开图纸',
    drawingUnits: '图形单位',
    exportMenu: '导出',
    export: '导出为DXF',
    exportHtml: '导出为 HTML',
    exportPdf: '导出为PDF',
    exportSvg: '导出为 SVG',
    exportAs: '导出为 {format}',
    exportImage: '导出图片',
    exportImageArea: '导出选定区域为图像',
    settings: '设置',
    about: '关于'
  },
  ribbon: {
    tab: {
      home: '常用',
      insert: '插入',
      review: '审阅',
      measurement: '测量',
      hatchContext: '填充',
      mtextEditorContext: '文字编辑器'
    },
    hatch: {
      group: {
        boundary: '边界',
        pattern: '图案',
        properties: '特性',
        options: '选项',
        close: '关闭'
      },
      command: {
        pickPoints: '拾取点',
        selectObjects: '选择对象',
        close: '关闭'
      },
      field: {
        pattern: '图案',
        scale: '比例',
        angle: '角度',
        style: '样式',
        associative: '关联',
        fillType: '填充类型',
        fillColor: '颜色',
        patternColor: '图案颜色',
        gradient1Color: '渐变色1',
        backgroundColor: '背景颜色',
        gradient2Color: '渐变色2',
        opacity: '透明度',
        gapTolerance: '间隙公差',
        imageScale: '图片比例'
      },
      style: {
        normal: '普通',
        outer: '外部',
        ignore: '忽略'
      },
      fillType: {
        solid: '实体',
        pattern: '图案',
        gradient: '渐变色'
      },
      associative: {
        on: '开',
        off: '关'
      },
      tooltip: {
        pickPoints: '拾取内部点来创建填充区域。',
        selectObjects: '选择围住填充区域的对象（闭合对象，或共同围成闭合区域的线）。',
        pattern: '设置填充图案名称。',
        scale: '设置填充图案比例。',
        angle: '设置填充图案角度（度）。',
        style: '控制填充时的岛屿检测样式。',
        associative: '切换关联填充模式。',
        fillType: '选择填充类型：实体、图案或渐变色。',
        fillColor: '选择填充颜色。',
        patternColor: '选择图案线条颜色。',
        gradient1Color: '选择第一个渐变颜色。',
        backgroundColor: '为图案填充选择背景颜色。',
        gradient2Color: '选择第二个渐变颜色。',
        opacity: '设置填充透明度（0-90）。',
        gapTolerance: '线端之间的间隙不超过此宽度（图形单位）时仍视为闭合边界（HPGAPTOL，0–5000）。',
        imageScale: '设置填充图片比例。',
        close: '退出填充创建并关闭该上下文标签。'
      }
    },
    mtext: {
      group: {
        textStyle: '文字样式',
        format: '格式',
        paragraph: '段落',
        insert: '插入',
        close: '关闭'
      },
      field: {
        textStyle: '文字样式',
        font: '字体',
        color: '颜色',
        height: '高度',
        obliqueAngle: '倾斜角度',
        tracking: '追踪',
        widthFactor: '宽度因子'
      },
      characterMap: {
        title: '字符映射表',
        font: '字体(F):',
        charsToCopy: '复制字符(A):',
        select: '选择(S)',
        copy: '复制(C)',
        noGlyphs: '该字体没有可显示的字符。',
        copyFailed: '无法复制到剪贴板。'
      },
      command: {
        bold: '粗体',
        underline: '下划线',
        superscript: '上标',
        italic: '斜体',
        overline: '上划线',
        subscript: '下标',
        strikethrough: '删除线',
        stack: '堆叠',
        toggleCase: '大小写',
        attachment: '对正',
        list: '项目符号和编号',
        lineSpacing: '行距',
        paragraphAlignment: '段落对齐',
        symbol: '符号',
        close: '关闭'
      },
      tooltip: {
        textStyle: '选择当前图纸中的文字样式。',
        bold: '切换粗体格式。',
        underline: '切换下划线格式。',
        superscript: '切换上标格式。',
        italic: '切换斜体格式。',
        overline: '切换上划线格式。',
        subscript: '切换下标格式。',
        strikethrough: '切换删除线格式。',
        stack: '将选中的分数字符堆叠或还原。',
        toggleCase: '切换选中文字的大小写。',
        font: '设置当前文字字体。',
        color: '设置当前文字颜色。',
        height: '设置当前文字高度，可输入自定义值。',
        obliqueAngle: '设置选中字符的倾斜角度（度；负值为另一方向倾斜）。',
        tracking: '增大或减小选中字符之间的间距（1 为默认间距）。',
        widthFactor: '加宽或压缩选中字符的水平宽度（1 为默认比例）。',
        attachment: '设置多行文字的附着点。',
        list: '插入或设置项目符号和编号。',
        lineSpacing: '设置行距。',
        paragraphAlignment: '设置段落水平对齐方式。',
        symbol: '插入常用工程符号。',
        close: '关闭文字编辑器并关闭该上下文标签。'
      },
      attachment: {
        TL: '左上 TL',
        TC: '中上 TC',
        TR: '右上 TR',
        ML: '左中 ML',
        MC: '正中 MC',
        MR: '右中 MR',
        BL: '左下 BL',
        BC: '中下 BC',
        BR: '右下 BR'
      },
      list: {
        off: '关闭',
        number: '以数字标记',
        letter: '以字母标记',
        bullet: '以项目符号标记',
        start: '起点',
        continue: '连续',
        auto: '允许自动项目符号和编号',
        allowList: '允许项目符号和列表'
      },
      lineSpacing: {
        more: '更多...',
        clear: '清除行间距'
      },
      paragraphAlign: {
        default: '默认',
        left: '左对齐',
        center: '居中',
        right: '右对齐',
        justified: '对正',
        distributed: '分散对齐'
      },
      symbol: {
        degree: '度数  %%d',
        plusMinus: '正/负  %%p',
        diameter: '直径  %%c',
        almostEqual: '几乎相等  \\U+2248',
        angle: '角度  \\U+2220',
        boundary: '边界线  \\U+E100',
        centerLine: '中心线  \\U+2104',
        delta: '差值  \\U+0394',
        electricalPhase: '电相角  \\U+0278',
        flowLine: '流线  \\U+E101',
        identical: '恒等于  \\U+2261',
        notEqual: '不相等  \\U+2260',
        ohm: '欧姆  \\U+2126',
        omega: '欧米加  \\U+03A9',
        propertyLine: '地界线  \\U+214A',
        subscriptTwo: '下标 2  \\U+2082',
        squared: '平方  \\U+00B2',
        cubed: '立方  \\U+00B3',
        nbsp: '不断空格 Ctrl+Shift+Space',
        other: '其他...'
      }
    },
    group: {
      draw: '绘制',
      modify: '修改',
      layer: '图层',
      properties: '属性',
      utilities: '实用工具',
      annotation: '批注',
      review: '审阅',
      measurement: '测量',
      style: '样式',
      lengthUnits: '长度单位',
      angleUnits: '角度单位',
      reference: '参照',
      block: '符号'
    },
    insertBlock: {
      empty: '没有可用的符号',
      currentDrawing: '当前图形',
      previewMenu: '符号预览画廊'
    },
    property: {
      color: '颜色',
      lineColor: '线条颜色',
      lineType: '线条类型',
      lineWeight: '线宽'
    },
    layerTools: {
      select: '图层',
      off: '关闭图层',
      isolate: '隔离',
      lock: '锁定图层',
      current: '置为当前',
      allOn: '图层全开',
      unisolate: '取消隔离',
      unlock: '解锁图层',
      restore: '图层恢复'
    },
    arc: {
      threePoint: '三点',
      startCenterEnd: '起点、圆心、终点',
      startCenterAngle: '起点、圆心、角度',
      startCenterLength: '起点、圆心、长度',
      startEndAngle: '起点、终点、角度',
      startEndDirection: '起点、终点、方向',
      startEndRadius: '起点、终点、半径',
      centerStartEnd: '圆心、起点、终点',
      centerStartAngle: '圆心、起点、角度',
      centerStartLength: '圆心、起点、长度'
    },
    circle: {
      centerRadius: '圆心、半径',
      centerDiameter: '圆心、直径',
      twoPoint: '两点',
      threePoint: '三点',
      tanTanRadius: '相切、相切、半径',
      tanTanTan: '相切、相切、相切'
    },
    ellipse: {
      ellipse: '椭圆',
      arc: '椭圆弧'
    },
    tooltip: {
      line: '绘制单段直线。',
      polyline: '以一个对象绘制由直线或圆弧组成的连续线段。',
      spline: '通过拟合点或控制点绘制平滑样条曲线。',
      sketch: '创建一系列徒手线段。',
      revcloud: '创建修订云线以突出显示图纸区域。',
      circle: '使用多种构造方式绘制圆。',
      arc: '使用多种构造方式绘制圆弧。',
      mline: '将多条平行线作为一个多线对象进行绘制。',
      ray: '从起点绘制沿单向无限延伸的构造射线。',
      xline: '绘制无限长的构造线。',
      ellipse: '绘制椭圆或椭圆弧。',
      rect: '绘制矩形或正多边形。',
      point: '在图纸中放置点对象。',
      hatch: '用图案填充闭合区域（图案填充）。',
      text: '在图纸中创建多行文字标注。',
      move: '将选中的对象移动到新位置。',
      rotate: '围绕基点旋转选中的对象。',
      copy: '将选中的对象复制到新位置。',
      erase: '从图纸中删除选中的对象。',
      offset: '按指定距离创建对象的平行副本。',
      undo: '撤销上一次编辑操作。',
      redo: '重做上一次撤销的操作。',
      properties: '打开当前所选对象的属性面板。',
      quickSelect: '打开“按条件选择”（快速选择），按类型、图层等条件筛选并选择图元。',
      find: '打开查找面板，在整个图纸或当前打印页中搜索文字。',
      countList: '打开计数面板以查看并管理符号（块）计数。',
      missingResources: '打开缺失/外部资源面板以处理字体、图片和链接图纸（外部参照）。',
      drawingUnits: '打开图形单位对话框，设置坐标格式、精度与插入缩放单位。',
      attachDwg: '将 DWG 或 DXF 图纸作为链接图纸（外部参照）附着（XATTACH）。',
      attachImage: '将光栅图像作为链接附着（IMAGEATTACH）。',
      insert: '打开符号（块）面板以浏览并插入符号定义（INSERT）。',
      editAttributes: '编辑符号属性（块属性）的值与显示特性（ATTEDIT）。',
      defineAttribute: '创建用于符号的属性（属性定义）（ATTDEF）。',
      agent: '打开 CAD Agent 工具面板，使用自然语言描述并绘制图形。',
      propertyColor: '设置新建对象或当前选中对象使用的颜色。',
      propertyLineType: '设置新建对象或当前选中对象使用的线条类型（线型）。',
      propertyLineWeight: '设置新建对象或当前选中对象使用的线宽。',
      layerAction: {
        off: '关闭当前选中的图层，使该图层上的对象隐藏。',
        isolate: '仅显示当前选中的图层，并隐藏其他图层，方便专注处理相关对象。',
        lock: '锁定当前选中的图层，使其对象保持可见，但不能被编辑。',
        current:
          '将当前选中的图层设为当前图层，之后新建对象会默认放在该图层上。',
        allOn: '显示所有已隐藏的图层。',
        unisolate:
          '恢复被图层隔离隐藏或锁定的图层，同时保留隔离之后的其他图层更改。',
        unlock: '解锁当前选中的图层，使其对象可以再次被选择和编辑。',
        restore: '恢复此 Ribbon 中最近一次图层操作之前的图层状态。'
      },
      circleOption: {
        centerRadius: '通过指定圆心和半径创建圆。',
        centerDiameter: '通过指定圆心和直径创建圆。',
        twoPoint: '通过两个点定义直径来创建圆。',
        threePoint: '创建经过三个点的圆。',
        tanTanRadius: '创建与两个对象相切并指定半径的圆。',
        tanTanTan: '创建与三个对象相切的圆。'
      },
      arcOption: {
        threePoint: '通过起点、中间点和终点创建圆弧。',
        startCenterEnd: '通过起点、圆心和终点创建圆弧。',
        startCenterAngle: '通过起点、圆心和夹角创建圆弧。',
        startCenterLength: '通过起点、圆心和弧长创建圆弧。',
        startEndAngle: '通过起点、终点和夹角创建圆弧。',
        startEndDirection: '通过起点、终点和起点切线方向创建圆弧。',
        startEndRadius: '通过起点、终点和指定半径创建圆弧。',
        centerStartEnd: '通过圆心、起点和终点创建圆弧。',
        centerStartAngle: '通过圆心、起点和夹角创建圆弧。',
        centerStartLength: '通过圆心、起点和弧长创建圆弧。'
      },
      rectOption: {
        rectangle: '通过指定对角点或尺寸创建矩形。',
        polygon: '通过指定边数和构造方式创建正多边形。'
      },
      ellipseOption: {
        ellipse: '通过指定主轴和次轴创建完整椭圆。',
        arc: '通过指定椭圆轴和弧段范围创建椭圆弧。'
      }
    },
    command: {
      line: '直线',
      polyline: '多段线',
      circle: '圆',
      arc: '圆弧',
      mline: '多线',
      ray: '射线',
      xline: '构造线',
      ellipse: '椭圆',
      spline: '样条曲线',
      sketch: '草图',
      revcloud: '修订云线',
      rect: '矩形',
      rectangle: '矩形',
      polygon: '多边形',
      point: '点',
      divide: '定数等分',
      hatch: '填充',
      text: '文字',
      gradient: '渐变',
      move: '移动',
      rotate: '旋转',
      copy: '复制',
      erase: '删除',
      offset: '偏移',
      undo: '撤销',
      redo: '重做',
      properties: '属性',
      quickSelect: '按条件选择',
      find: '查找',
      countList: '计数',
      drawingUnits: '图形单位',
      attachDwg: '附着\nDWG',
      attachImage: '附着\n图像',
      insert: '插入',
      editAttributes: '编辑属性',
      defineAttribute: '定义属性',
      agent: 'CAD Agent'
    }
  },
  verticalToolbar: {
    chrome: {
      collapse: '收起工具栏',
      expand: '展开工具栏',
      moreOverflow: '更多工具',
      move: '拖动以移动（双击恢复原位）',
      layoutMenu: '工具栏布局',
      vertical: '竖排',
      horizontal: '横排',
      resetPosition: '恢复原位'
    },
    measure: {
      text: '测量',
      description: '测量工具'
    },
    measureDistance: {
      text: '距离',
      description: '测量两点之间的距离'
    },
    measureContinuous: {
      text: '连续测',
      description: '连续拾取多个点测量各段距离，直到按 Enter 或取消'
    },
    measureAngle: {
      text: '角度',
      description: '测量共享一个顶点的两条线之间的角度'
    },
    measureArea: {
      text: '面积',
      description: '测量多边形的面积'
    },
    measureArc: {
      text: '弧长',
      description: '测量由三点定义的弧长'
    },
    measurePoint: {
      text: '坐标',
      description: '测量拾取点的 X/Y 坐标'
    },
    measurementPanel: {
      text: '测量面板',
      description: '打开测量面板'
    },
    clearMeasurements: {
      text: '清除',
      description: '清除当前打印页上的所有测量标注'
    },
    measurementImport: {
      text: '导入',
      description: '从 sidecar JSON 文件导入测量标注'
    },
    measurementExport: {
      text: '导出',
      description: '将测量标注导出为 sidecar JSON 文件'
    },
    annotation: {
      text: '审阅',
      description: '审阅工具'
    },
    layer: {
      text: '图层',
      description: '管理图层'
    },
    text: {
      text: '文字 (多行文字)',
      description: '在图纸中创建多行文字注释'
    },
    pan: {
      text: '移动',
      description: '平移视图'
    },
    markupPanel: {
      text: '批注面板',
      description: '打开批注面板'
    },
    markupText: {
      text: '文字',
      description: '放置文字批注'
    },
    markupCloud: {
      text: '云线',
      description: '创建云线批注'
    },
    markupRect: {
      text: '矩形',
      description: '创建矩形批注'
    },
    markupCircle: {
      text: '圆',
      description: '创建圆形批注'
    },
    markupArrow: {
      text: '箭头',
      description: '创建箭头批注'
    },
    markupLine: {
      text: '直线',
      description: '创建直线批注'
    },
    markupCallout: {
      text: '标注',
      description: '创建引线标注'
    },
    markupStamp: {
      text: '图章',
      description: '放置图章'
    },
    markupImport: {
      text: '导入',
      description: '从 sidecar JSON 文件导入批注'
    },
    markupExport: {
      text: '导出',
      description: '将批注导出为 sidecar JSON 文件'
    },
    markupColor: {
      text: '颜色',
      description: '设置新建批注的颜色'
    },
    markupFontSize: {
      text: '字高',
      description: '打开字高设置（适应屏幕或世界坐标高度）',
      fit: '适应',
      wcs: 'WCS'
    },
    measurementColor: {
      text: '颜色',
      description: '有选中测量标注时修改其颜色；未选中时用于后续添加的测量标注'
    },
    measurementFontSize: {
      text: '字高',
      description: '有选中测量标注时修改其字高；未选中时用于后续添加的测量标注',
      fit: '适应',
      wcs: 'WCS'
    },
    showMarkup: {
      text: '显示批注',
      description: '显示批注'
    },
    hideMarkup: {
      text: '隐藏批注',
      description: '隐藏批注'
    },
    showMeasurements: {
      text: '显示测量',
      description: '显示测量标注'
    },
    hideMeasurements: {
      text: '隐藏测量',
      description: '隐藏测量标注'
    },
    clearMarkups: {
      text: '清除',
      description: '清除当前打印页上的所有批注'
    },
    select: {
      text: '选择',
      description: '选择图元'
    },
    switchBg: {
      text: '切换背景色',
      description: '在白色与黑色之间切换绘图背景色',
      disabledInReadingMode: '阅读模式下不可用（白底固定）'
    },
    readingMode: {
      text: '阅读模式',
      description: '切换阅读模式（白底黑线，便于审阅）'
    },
    zoom: {
      text: '缩放',
      description: '缩放工具：保存的视图、范围、智能范围、窗口'
    },
    zoomSaved: {
      text: '保存的视图',
      description: '恢复 AutoCAD 保存的视图（VPORT / 打印页界限），或打开时的初始视口'
    },
    zoomToExtent: {
      text: '范围',
      description: '缩放以显示所有对象'
    },
    zoomSmartExtents: {
      text: '智能',
      description: '缩放到主要几何簇，忽略远处异常图元'
    },
    zoomToBox: {
      text: '窗口',
      description: '缩放以显示矩形窗口内的对象'
    }
  },
  statusBar: {
    setting: {
      commandLine: '命令行',
      coordinate: '坐标',
      entityInfo: '图元信息',
      languageSelector: '语言菜单',
      ribbon: '功能区',
      toolbar: '工具栏',
      stats: '性能面板',
      replaceOnClick: '单击替换选择',
      continuousDraw: '连续绘图 (不返回选择工具)'
    },
    osnap: {
      on: '关闭捕捉',
      off: '打开捕捉',
      enabled: '使用捕捉',
      tooltip: '对象捕捉',
      endpoint: '端点',
      midpoint: '中点',
      center: '圆心',
      node: '节点',
      quadrant: '象限点',
      intersection: '交点',
      insertion: '插入',
      nearest: '最近点'
    },
    pointStyle: {
      tooltip: '修改点样式'
    },
    fullScreen: {
      on: '切换到全屏模式',
      off: '退出全屏模式'
    },
    dynamicInput: {
      on: '打开动态输入',
      off: '关闭动态输入'
    },
    lineWidth: {
      on: '隐藏线宽',
      off: '显示线宽'
    },
    operationProfile: {
      simple: '简单',
      cad: 'CAD',
      simpleTooltip:
        '简单操作：单击替换选择，每次绘图后返回选择工具。单键切换工具 (V 选择 / H 平移 / L 直线 / R 矩形 / T 文字，按住空格拖动可平移)。点击切换为 CAD (传统) 操作',
      cadTooltip:
        'CAD (传统) 操作：每次单击都添加到选择，绘图命令持续到 Enter / Esc。点击切换为简单操作'
    },
    orthoMode: {
      on: '关闭正交模式',
      off: '打开正交模式'
    },
    polarTracking: {
      on: '关闭极轴追踪',
      off: '打开极轴追踪'
    },
    zoom: {
      zoomIn: '放大',
      zoomOut: '缩小',
      fitAll: '全部显示',
      tooltip:
        '显示比例 (屏幕上的长度 : 实际长度)。点击可从列表选择'
    },
    theme: {
      toLight: '切换到明亮主题',
      toDark: '切换到暗黑主题'
    },
    warning: {
      font: '没有找到如下字体：'
    },
    notification: {
      tooltip: '显示通知'
    },
    export: {
      tooltip: '导出图片为 PNG'
    },
    modelTab: '画布',
    moreLayouts: '更多打印页'
  },
  toolPalette: {
    entityProperties: {
      tab: '属性',
      title: '图元属性',
      propertyPanel: {
        noEntitySelected: '未选择任何图元！',
        multipleEntitySelected: '{count}个图元',
        propValCopied: '属性值已复制',
        failedToCopyPropVal: '复制属性值失败！',
        selection: '选择范围',
        mixed: '多种',
        x: 'X',
        y: 'Y',
        width: '宽',
        height: '高',
        keepAspectHint: '保持宽高比进行缩放',
        referencePoint: '参考点',
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
        selectOnlyType: '仅选择{type}',
        totalLength: '总长度',
        totalArea: '总面积',
        itemCount: '({count} 个)',
        invisibleAttribute: '隐藏项',
        constantAttribute: '固定值（不可更改）',
        allLocked: '这些对象位于锁定的图层上，无法更改',
        someLocked: '位于锁定图层上的对象不会被更改'
      }
    },
    layerManager: {
      tab: '图层',
      title: '图层管理器',
      currentLayerLabel: '当前图层: {name}',
      searchPlaceholder: '搜索图层',
      filters: '过滤器',
      collapseFilters: '收起过滤器',
      expandFilters: '展开过滤器',
      filterAll: '全部',
      filterAllUsed: '所有使用的图层',
      toolbar: {
        showFilters: '图层过滤器',
        newFilter: '新建过滤器',
        newFilterGroup: '新建过滤器组',
        newLayer: '新建图层',
        deleteLayer: '删除图层',
        setCurrent: '置为当前'
      },
      prompts: {
        newFilterTitle: '新建过滤器',
        newFilterName: '请输入过滤器名称',
        newFilterGroupTitle: '新建过滤器组',
        newFilterGroupName: '请输入过滤器组名称',
        newLayerTitle: '新建图层',
        newLayerName: '请输入图层名称',
        confirm: '确定',
        cancel: '取消'
      },
      messages: {
        filterCreated: '已创建过滤器 "{name}"',
        filterExists: '过滤器 "{name}" 已存在',
        filterCreateFailed: '创建过滤器失败',
        layerCreated: '已创建图层 "{name}"',
        layerExists: '图层 "{name}" 已存在',
        layerCreateFailed: '创建图层失败',
        layerDeleted: '已删除图层 "{name}"',
        layerDeleteFailed: '删除图层 "{name}" 失败',
        cannotDeleteLayer0: '无法删除图层 "0"',
        cannotDeleteCurrent: '无法删除当前图层',
        selectLayerFirst: '请先选择一个图层',
        setCurrentSuccess: '当前图层已设为 "{name}"',
        setCurrentFailed: '设置当前图层失败'
      },
      layerList: {
        name: '名称',
        on: '开',
        lock: '锁定',
        plot: '打印',
        color: '颜色',
        linetype: '线条类型',
        lineweight: '线宽',
        transparency: '透明度',
        description: '说明',
        currentLayer: '当前图层',
        newLayerPlaceholder: '图层名称',
        zoomToLayer: '已缩放到所点击的图层"{layer}"',
        lineWeightDefault: '默认'
      }
    },
    find: {
      tab: '查找',
      title: '查找',
      placeholder: '查找文字',
      input: '搜索文字',
      find: '查找',
      matchCase: '区分大小写',
      currentLayoutOnly: '仅当前打印页',
      hint: '按回车键在整个图纸（所有打印页）中搜索文字、多行文字、符号属性，以及符号、标注、引线和表格中的文字。',
      hintLayout:
        '按回车键在当前打印页中搜索文字、多行文字、符号属性，以及符号、标注、引线和表格中的文字。',
      noResults: '未找到文字',
      count: '找到 {count} 项',
      countLayouts: '在 {layouts} 个打印页中找到 {count} 项',
      countTruncated: '仅显示前 {count} 项结果，请缩小搜索范围',
      noDocument: '请先打开图纸再搜索',
      layoutUnavailable: '无法打开打印页“{layout}”',
      unnamedLayout: '（未命名打印页）',
      kind: {
        text: '文字',
        mtext: '多行文字',
        attribute: '符号属性',
        block: '符号文字',
        dimension: '标注',
        leader: '引线',
        table: '表格'
      }
    },
    countList: {
      tab: '计数',
      title: '计数',
      searchPlaceholder: '搜索符号名称',
      countInArea: '指定区域计数',
      areaSet: '计数区域已更新',
      areaCleared: '正在对整个画布计数',
      blockName: '符号',
      count: '数量',
      empty: '未找到可见符号',
      prompt: {
        firstCorner: '指定计数区域的第一个角点或 [Entire(整个)]: ',
        secondCorner: '指定对角点: '
      }
    },
    designReview: {
      tab: '批注',
      title: '批注',
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
    measurements: {
      tab: '测量',
      title: '测量',
      empty: '暂无测量',
      type: '类型',
      value: '数值',
      filterAll: '全部',
      delete: '删除',
      clear: '全部清除',
      typeValues: {
        distance: '距离',
        angle: '角度',
        area: '面积',
        arc: '弧长',
        point: '坐标'
      }
    },
    missingResources: {
      tab: '资源',
      title: '缺失 / 外部资源',
      fontTab: '字体',
      imageTab: '图片',
      xrefTab: '链接图纸',
      attach: '附着',
      attachDwg: '附着 DWG/DXF ...',
      attachImage: '附着图像 ...',
      attachImageFailed: '附着图像 "{name}" 失败',
      fileReferences: '文件参照',
      details: '详细信息',
      foundAt: '找到位置',
      selectReference: '选择参照以查看详细信息',
      expandDetails: '展开详细信息',
      collapseDetails: '收起详细信息',
      apply: '应用',
      applyDone: '已应用替换',
      emptyFonts: '没有缺失字体',
      emptyImages: '没有缺失图片',
      matchFontType: '匹配字体类型（SHX / 网格）',
      missedFont: '缺失字体',
      replacedFont: '替换字体',
      selectFont: '选择替换字体',
      selectLocalFont: '选择本地字体文件',
      file: '文件',
      replace: '替换',
      name: '名称',
      path: '保存路径',
      type: '类型',
      typeAttach: '附着',
      typeOverlay: '覆盖',
      typeImage: '图像',
      status: '状态',
      statusMissing: '缺失',
      statusLoaded: '已加载',
      actions: '操作',
      visible: '可见',
      browse: '浏览…',
      fromUrl: 'URL…',
      unload: '卸载',
      load: '加载',
      empty: '当前图纸没有链接图纸或图像',
      urlPrompt: '输入图纸文件（DWG、DXF 等）的 URL',
      urlRequired: '请输入 URL',
      loadFailed: '加载参照 "{name}" 失败'
    },
    memoryProfile: {
      tab: '内存',
      title: '内存分析',
      refresh: '刷新',
      collecting: '正在分析内存 ...',
      showPie: '显示汇总图表',
      hidePie: '隐藏汇总图表',
      collectedAt: '采集时间 {time}',
      heapUsed: 'JS 堆 {used} / {total}',
      estimateNote: '几何体大小来自缓冲区 byteLength，其余类别为估算值。',
      estimated: '估',
      pieTotal: '已统计',
      pieAriaLabel: '按类别划分的内存占用',
      empty: '暂无数据',
      missedFonts: '缺失字体',
      fontMemory: '字体 / 文字渲染内存',
      fontMemorySummary: '内存 {live}（主线程 {main} · Worker {workers}）',
      fontStorage: 'IndexedDB 存储（不计入内存）',
      fontStorageSummary: '{count} 个缓存字体 · {size}',
      materialPoint: '点',
      materialLine: '线',
      materialFill: '填充',
      materialTotal: '合计',
      dataModelCounts: '{entities} 个图元 · {objects} 个对象 · {total}',
      dataModelCategories: '按类别',
      dataModelEntityTypes: '按图元类型',
      categories: {
        heap: 'JS 堆',
        geometry: '几何体',
        mapping: '映射元数据',
        spatial: '空间索引',
        dataModel: '数据模型',
        materials: '材质缓存',
        fonts: '字体'
      },
      tabs: {
        geometry: '几何体',
        spatial: '空间索引',
        dataModel: '数据模型',
        materials: '材质',
        fonts: '字体'
      },
      columns: {
        layout: '打印页',
        layer: '图层',
        geometry: '几何体',
        mapping: '映射',
        entities: '图元',
        rootItems: '根项',
        childItems: '子项',
        estimated: '估计大小',
        type: '类型',
        count: '数量',
        category: '类别',
        font: '字体'
      }
    },
    openFileProfile: {
      tab: '打开性能',
      title: '打开性能',
      refresh: '刷新',
      copy: '复制',
      copied: '性能数据已复制',
      copyFailed: '复制性能数据失败',
      collectedAt: '采集时间 {time}',
      hint: '每次打开图纸后自动采集。设置 OPENPROF=1 可同时输出到控制台。',
      noData: '暂无打开性能数据。请先打开图纸，再运行 OPENPERF。',
      empty: '暂无数据',
      timing: '墙钟耗时',
      progressive: '渐进打开',
      progressiveMode: '模式',
      progressiveOn: '开启',
      progressiveOff: '关闭',
      midOpenPaints: '打开中绘制次数',
      yields: '让出次数',
      cache: 'INSERT 渲染缓存（顶层）',
      slowBlocks: '最慢符号模板 miss',
      total: '打开总计',
      read: 'db.read',
      parse: 'PARSE',
      entity: 'ENTITY 刷入',
      convert: '场景转换',
      cacheHits: '缓存命中',
      cacheMisses: '缓存未命中',
      cacheBuild: 'Miss 构建',
      cacheCompact: 'Miss 压缩',
      cacheHitPath: '命中路径',
      columns: {
        stage: '阶段',
        duration: '耗时',
        share: '占比',
        metric: '指标',
        value: '值',
        block: '符号',
        build: '构建',
        compact: '压缩'
      }
    },
    blocks: {
      tab: '符号',
      title: '符号',
      tabCurrentDrawing: '当前图形',
      tabRecent: '最近使用',
      tabFavorites: '收藏夹',
      tabLibraries: '库',
      sectionCurrentDrawing: '当前图形中的符号',
      sectionRecent: '最近使用的符号',
      sectionFavorites: '收藏的符号',
      sectionLibraries: '符号库',
      filterPlaceholder: '过滤器...',
      empty: '没有可用的符号',
      emptyRecent: '没有最近插入的符号',
      emptyFavorites: '没有收藏的符号',
      emptyLibraries: '尚未配置符号库',
      toggleFavorite: '切换收藏',
      options: '选项',
      insertionPoint: '插入点',
      scale: '比例',
      rotation: '旋转',
      angle: '角度',
      autoPlacement: '自动放置',
      repeatPlacement: '重复放置',
      explode: '分解'
    }
  },
  colorDropdown: {
    custom: '自定义'
  },
  lineTypeSelect: {
    placeholder: '线条类型'
  },
  colorIndexPicker: {
    color: '颜色：',
    colorIndex: '颜色索引：',
    inputPlaceholder: '0-256, BYLAYER, BYBLOCK',
    rgb: 'RGB: '
  },
  entityInfo: {
    color: '颜色',
    layer: '图层',
    lineType: '线条类型'
  },
  ribbonProperty: {
    color: '颜色',
    lineType: '线条类型',
    lineWeight: '线宽',
    layer: '图层'
  },
  layerSelect: {
    searchPlaceholder: '请输入图层名字进行搜索',
    noLayerAvailable: '无可用图层',
    noMatchedLayer: '未找到匹配图层',
    tooltip: {
      layer: '图层',
      visibility: '可见性',
      lock: '锁定',
      lineType: '线条类型',
      color: '颜色',
      visible: '显示',
      hidden: '隐藏',
      locked: '已锁定',
      unlocked: '未锁定'
    }
  },
  message: {
    loadingFonts: '正在加载字体...',
    loadingDwgConverter: '正在加载DWG转换器...',
    fontsNotFound: '在字体库中找不到字体：{fonts}。',
    fontsNotLoaded: '无法加载字体：{fonts}。',
    fontMissedInDrawing:
      '字体 "{font}" 被 {count} 个文字对象使用，但不可用，已使用 "{replacementFont}" 显示。',
    fontMissedReplacement: '"{font}"（已用 "{replacement}" 显示）',
    fontCached: '字体 "{font}" 已成功缓存。',
    fontCacheFailed: '缓存字体 "{fileName}" 失败。',
    failedToGetAvaiableFonts: '无法从"{url}"获取可用的字体信息！',
    failedToOpenFile: '无法打开文件"{fileName}"！',
    failedToOpenFileToast: '无法打开"{fileName}"。详情请查看通知中心。',
    failedToOpenFileWorkerOom:
      '无法打开"{fileName}"。使用 LibreDWG 解析器时内存不足，导致打开失败。可点击{dwgParserLink}购买商用 DWG Parser，以支持更大图纸并避免此问题。',
    failedToOpenFileWorkerOomLink: '此页面',
    failedToOpenFileWorkerTimeout: '无法打开"{fileName}"。解析图纸时操作超时。',
    failedToOpenFileFontLoadFailed:
      '无法打开"{fileName}"。无法加载图纸所需的字体。',
    failedToOpenFileLicenseExpired:
      '无法打开"{fileName}"。DWG 转换器许可证已过期。',
    failedToOpenFileLicenseInvalid:
      '无法打开"{fileName}"。DWG 转换器许可证缺失或无效。',
    fetchingDrawingFile: '正在加载图纸文件...',
    unknownEntities:
      '这张图纸中包含了{count}个未知或不支持的实体，这些实体将无法显示！',
    tianzhengEntities:
      '检测到天正（或同类第三方）自定义图元（约 {count} 个）。当前环境无法完整解析这些图元，部分内容可能无法显示。',
    emptyProxyEntities:
      '这张图纸中包含了{count}个缺少代理图形的自定义实体，这些实体将无法显示！'
  },
  notification: {
    center: {
      title: '通知',
      clearAll: '清除全部',
      noNotifications: '暂无通知'
    },
    group: {
      fontMissed: '字体缺失',
      fontMissedSummary: '共 {count} 条字体相关消息，点击展开查看详情',
      unsupportedEntities: '不支持的图元',
      unsupportedEntitiesSummary: '共 {count} 条解析相关消息，点击展开查看详情',
      genericSummary: '共 {count} 条消息，点击展开查看详情'
    },
    time: {
      justNow: '刚刚',
      minutesAgo: '{count} 分钟前',
      hoursAgo: '{count} 小时前',
      daysAgo: '{count} 天前'
    },
    title: {
      failedToOpenFile: '无法打开文件',
      failedToOpenFileWorkerOom: '内存不足',
      failedToOpenFileWorkerTimeout: '打开超时',
      failedToOpenFileFontLoadFailed: '字体加载失败',
      failedToOpenFileLicenseExpired: '许可证已过期',
      failedToOpenFileLicenseInvalid: '许可证无效',
      fontNotFound: '找不到字体',
      fontNotLoaded: '无法加载字体',
      parsingWarning: '解析图纸问题',
      systemMessage: '系统消息',
      systemWarning: '系统警告',
      systemError: '系统错误',
      systemInfo: '系统信息'
    }
  }
}
