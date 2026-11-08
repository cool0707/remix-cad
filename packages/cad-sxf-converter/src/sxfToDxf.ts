import {
  type Point,
  principalAxes,
  type Rgb,
  type SxfCurve,
  SxfDrawing,
  type SxfImage,
  type SxfPath,
  type SxfStyle
} from './drawing'
import { SXF_LINE_TYPE_PATTERNS } from './style'

/**
 * How SXF paper millimetres become drawing units.
 *
 * - `drawing`: everything is multiplied by the scale of the main partial
 *   drawing (部分図: the placement scale that holds the most primitives). The
 *   drawing looks as printed and the main view measures in real millimetres.
 * - `paper`: no scaling; units are paper millimetres.
 */
export type SxfScaleMode = 'drawing' | 'paper'

export interface SxfDxfOptions {
  /** @default 'drawing' */
  scaleMode?: SxfScaleMode
}

/** Text style used when a text names no font. */
const DEFAULT_FONT = 'ＭＳ ゴシック'

/**
 * Metrics of the bundled BIZ UD fonts that replace ＭＳ ゴシック / ＭＳ 明朝,
 * as fractions of the em (same values as cad-jww-converter).
 *
 * SXF text height is the height of the character box (the em of a
 * full-width character), but the renderer sizes TrueType text by the height
 * of a capital "A", which would draw Japanese text ~1.27× too large.
 */
const FONT_METRICS = {
  gothic: { capHeight: 1617 / 2048, descender: 246 / 2048 },
  mincho: { capHeight: 1587 / 2048, descender: 246 / 2048 }
}

export function sxfTextFontMetrics(font: string) {
  return /明朝|mincho/i.test(font) ? FONT_METRICS.mincho : FONT_METRICS.gothic
}

/** Character cells of a string: half-width characters take half a cell. */
export function sxfTextCells(text: string) {
  let cells = 0
  for (const ch of text) {
    // ASCII and half-width katakana (CP932 single-byte characters).
    cells += /[ -~｡-ﾟ]/.test(ch) ? 0.5 : 1
  }
  return cells
}

const LINE_WEIGHTS = [
  0, 5, 9, 13, 15, 18, 20, 25, 30, 35, 40, 50, 53, 60, 70, 80, 90, 100, 106,
  120, 140, 158, 200, 211
]

const LINE_TYPE_NAMES: Record<string, string> = {
  dashed: 'SXF_DASHED',
  'dashed spaced': 'SXF_DASHED_SPACED',
  'long dashed dotted': 'SXF_LONG_DASH_DOT',
  'long dashed double-dotted': 'SXF_LONG_DASH_2DOT',
  'long dashed triplicate-dotted': 'SXF_LONG_DASH_3DOT',
  dotted: 'SXF_DOTTED',
  chain: 'SXF_CHAIN',
  'chain double dash': 'SXF_CHAIN_2DASH',
  'dashed dotted': 'SXF_DASH_DOT',
  'double-dashed dotted': 'SXF_2DASH_DOT',
  'dashed double-dotted': 'SXF_DASH_2DOT',
  'double-dashed double-dotted': 'SXF_2DASH_2DOT',
  'dashed triplicate-dotted': 'SXF_DASH_3DOT',
  'double-dashed triplicate-dotted': 'SXF_2DASH_3DOT'
}

function tableName(raw: string) {
  return raw
    .replace(/[\p{Cc}<>/\\":;?*|=,]/gu, '_')
    .trim()
    .slice(0, 255)
}

function fmt(value: number) {
  if (!Number.isFinite(value) || Math.abs(value) < 1e-12) return '0.0'
  return String(Number(value.toFixed(10)))
}

/**
 * Scale (drawing units per paper millimetre) of the main partial drawing: the
 * placement scale shared by the most primitives.
 */
export function mainDrawingScale(drawing: SxfDrawing) {
  const counts = new Map<number, number>()
  const add = (scale: number) => {
    if (!(scale > 0)) return
    const key = Number((1 / scale).toPrecision(6))
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  for (const list of [
    drawing.paths,
    drawing.texts,
    drawing.fills,
    drawing.markers
  ]) {
    for (const p of list) add(p.scale)
  }
  let best = 1
  let bestCount = -1
  for (const [key, count] of counts) {
    if (count > bestCount) {
      best = key
      bestCount = count
    }
  }
  return best
}

/** Writes SXF drawing primitives as ASCII DXF (AC1024, UTF-8). */
export function sxfDrawingToDxf(
  drawing: SxfDrawing,
  options: SxfDxfOptions = {}
) {
  return new SxfDxfWriter(drawing, options.scaleMode ?? 'drawing').write()
}

class SxfDxfWriter {
  private out: string[] = []
  private handle = 0x10
  private readonly s: number
  private readonly layers = new Map<
    string,
    { name: string; visible: boolean }
  >()
  private readonly lineTypes = new Map<
    string,
    { name: string; pattern: number[] }
  >()
  private readonly styles = new Map<string, string>([
    [DEFAULT_FONT, 'STANDARD']
  ])
  /** Image file name → IMAGEDEF handle. */
  private readonly imageDefs = new Map<string, string>()

  constructor(
    private readonly drawing: SxfDrawing,
    scaleMode: SxfScaleMode
  ) {
    this.s = scaleMode === 'paper' ? 1 : mainDrawingScale(drawing)
  }

  write() {
    const entities = this.capture(() => {
      // Images first so that lines and text are drawn over them.
      for (const image of this.drawing.images) this.writeImage(image)
      for (const fill of this.drawing.fills)
        this.writeFill(fill.outer, fill.holes, fill.style)
      for (const path of this.drawing.paths) this.writePath(path)
      for (const text of this.drawing.texts) this.writeText(text)
      for (const marker of this.drawing.markers) {
        this.entity('POINT', marker.style, 'AcDbPoint')
        this.point(10, marker.position)
      }
    })

    this.section('HEADER')
    this.variable('$ACADVER', 1, 'AC1024')
    this.variable('$HANDSEED', 5, 'FFFFFFFF')
    this.variable('$DWGCODEPAGE', 3, 'ANSI_1252')
    this.variable('$INSUNITS', 70, '4')
    this.variable('$MEASUREMENT', 70, '1')
    this.variable('$TEXTSTYLE', 7, 'STANDARD')
    this.variable('$CLAYER', 8, '0')
    const sheet = this.drawing.sheet
    if (sheet) {
      this.pair(9, '$LIMMIN')
      this.point(10, [0, 0])
      this.pair(9, '$LIMMAX')
      this.point(10, [sheet.width, sheet.height])
    }
    this.pair(0, 'ENDSEC')

    this.section('TABLES')
    this.writeLineTypes()
    this.writeLayers()
    this.writeStyles()
    this.table('BLOCK_RECORD', 2)
    for (const name of ['*Model_Space', '*Paper_Space']) {
      this.pair(0, 'BLOCK_RECORD')
      this.pair(5, this.nextHandle())
      this.pair(100, 'AcDbSymbolTableRecord')
      this.pair(100, 'AcDbBlockTableRecord')
      this.pair(2, name)
    }
    this.pair(0, 'ENDTAB')
    this.pair(0, 'ENDSEC')

    this.section('BLOCKS')
    for (const name of ['*Model_Space', '*Paper_Space']) {
      this.pair(0, 'BLOCK')
      this.pair(5, this.nextHandle())
      this.pair(8, '0')
      this.pair(2, name)
      this.pair(70, '0')
      this.point(10, [0, 0])
      this.pair(3, name)
      this.pair(0, 'ENDBLK')
      this.pair(5, this.nextHandle())
      this.pair(8, '0')
    }
    this.pair(0, 'ENDSEC')

    this.section('ENTITIES')
    this.out.push(entities)
    this.pair(0, 'ENDSEC')
    this.writeObjects()
    this.pair(0, 'EOF')
    return this.out.join('')
  }

  private writePath(path: SxfPath) {
    if (path.curve && this.writeCurve(path.curve, path.style)) return
    const points = path.points
    if (points.length === 2 && !path.closed) {
      this.entity('LINE', path.style, 'AcDbLine')
      this.point(10, points[0])
      this.point(11, points[1])
      return
    }
    this.entity('LWPOLYLINE', path.style, 'AcDbPolyline')
    this.pair(90, String(points.length))
    this.pair(70, path.closed ? '1' : '0')
    for (const p of points) {
      this.pair(10, fmt(p[0] * this.s))
      this.pair(20, fmt(p[1] * this.s))
    }
  }

  /** Writes a circle / arc / ellipse exactly; false when it is degenerate. */
  private writeCurve(curve: SxfCurve, style: SxfStyle) {
    const axes = principalAxes(curve)
    if (!(axes.majorLength > 1e-12) || !(axes.minorLength > 1e-12)) return false
    const s = this.s
    const at = (t: number): Point => [
      curve.center[0] + curve.u[0] * Math.cos(t) + curve.v[0] * Math.sin(t),
      curve.center[1] + curve.u[1] * Math.cos(t) + curve.v[1] * Math.sin(t)
    ]
    // Counter-clockwise in the drawing when the parameter direction and the
    // handedness of (u, v) agree.
    const ccw = axes.orientation * Math.sign(curve.end - curve.start || 1) > 0
    let first = at(curve.start)
    let last = at(curve.end)
    if (!ccw) [first, last] = [last, first]

    if (Math.abs(axes.ratio - 1) < 1e-9) {
      const radius = axes.majorLength
      const angle = (p: Point) =>
        (Math.atan2(p[1] - curve.center[1], p[0] - curve.center[0]) * 180) /
        Math.PI
      if (curve.closed) {
        this.entity('CIRCLE', style, 'AcDbCircle')
        this.point(10, curve.center)
        this.pair(40, fmt(radius * s))
      } else {
        this.entity('ARC', style, 'AcDbCircle')
        this.point(10, curve.center)
        this.pair(40, fmt(radius * s))
        this.pair(100, 'AcDbArc')
        this.pair(50, fmt(angle(first)))
        this.pair(51, fmt(angle(last)))
      }
      return true
    }

    const major = axes.major
    const unit: Point = [
      major[0] / axes.majorLength,
      major[1] / axes.majorLength
    ]
    const param = (p: Point) => {
      const dx = p[0] - curve.center[0]
      const dy = p[1] - curve.center[1]
      const x = dx * unit[0] + dy * unit[1]
      const y = -dx * unit[1] + dy * unit[0]
      return Math.atan2(y / axes.minorLength, x / axes.majorLength)
    }
    this.entity('ELLIPSE', style, 'AcDbEllipse')
    this.point(10, curve.center)
    this.pair(11, fmt(major[0] * s))
    this.pair(21, fmt(major[1] * s))
    this.pair(31, '0.0')
    this.pair(40, fmt(axes.ratio))
    if (curve.closed) {
      this.pair(41, '0.0')
      this.pair(42, fmt(2 * Math.PI))
    } else {
      let start = param(first)
      let end = param(last)
      if (start < 0) start += 2 * Math.PI
      while (end <= start) end += 2 * Math.PI
      this.pair(41, fmt(start))
      this.pair(42, fmt(end))
    }
    return true
  }

  /** The pixel size is left at 1 × 1 so U / V carry the whole extent. */
  private writeImage(image: SxfImage) {
    let defHandle = this.imageDefs.get(image.fileName)
    if (!defHandle) {
      defHandle = this.nextHandle()
      this.imageDefs.set(image.fileName, defHandle)
    }
    this.entity('IMAGE', image.style, 'AcDbRasterImage')
    this.pair(90, '0')
    this.point(10, image.origin)
    this.point(11, image.u)
    this.point(12, image.v)
    this.pair(13, '1.0')
    this.pair(23, '1.0')
    this.pair(340, defHandle)
    this.pair(70, '3')
    this.pair(280, '0')
    this.pair(281, '50')
    this.pair(282, '50')
    this.pair(283, '0')
  }

  /** Image definitions referenced by IMAGE entities. */
  private writeObjects() {
    if (this.imageDefs.size === 0) return
    const root = this.nextHandle()
    const dict = this.nextHandle()
    this.section('OBJECTS')
    this.pair(0, 'DICTIONARY')
    this.pair(5, root)
    this.pair(100, 'AcDbDictionary')
    this.pair(3, 'ACAD_IMAGE_DICT')
    this.pair(350, dict)
    this.pair(0, 'DICTIONARY')
    this.pair(5, dict)
    this.pair(330, root)
    this.pair(100, 'AcDbDictionary')
    for (const handle of this.imageDefs.values()) {
      this.pair(3, `SXF_IMAGE_${handle}`)
      this.pair(350, handle)
    }
    for (const [fileName, handle] of this.imageDefs) {
      this.pair(0, 'IMAGEDEF')
      this.pair(5, handle)
      this.pair(330, dict)
      this.pair(100, 'AcDbRasterImageDef')
      this.pair(90, '0')
      this.pair(1, fileName.replace(/[\r\n]+/g, ' '))
      this.pair(10, '1.0')
      this.pair(20, '1.0')
      this.pair(11, '1.0')
      this.pair(21, '1.0')
      this.pair(280, '1')
      this.pair(281, '0')
    }
    this.pair(0, 'ENDSEC')
  }

  private writeFill(outer: Point[], holes: Point[][], style: SxfStyle) {
    const rings = [outer, ...holes].filter(r => r.length >= 3)
    if (!rings.length) return
    this.entity('HATCH', style, 'AcDbHatch')
    this.point(10, [0, 0])
    this.pair(210, '0.0')
    this.pair(220, '0.0')
    this.pair(230, '1.0')
    this.pair(2, 'SOLID')
    this.pair(70, '1')
    this.pair(71, '0')
    this.pair(91, String(rings.length))
    rings.forEach((ring, index) => {
      this.pair(92, index === 0 ? '3' : '2')
      this.pair(72, '0')
      this.pair(73, '1')
      this.pair(93, String(ring.length))
      for (const p of ring) {
        this.pair(10, fmt(p[0] * this.s))
        this.pair(20, fmt(p[1] * this.s))
      }
      this.pair(97, '0')
    })
    this.pair(75, '0')
    this.pair(76, '1')
    this.pair(98, '0')
  }

  private writeText(text: SxfDrawing['texts'][number]) {
    const content = text.text.replace(/[\r\n\0]+/g, ' ')
    if (!content.trim() || !(text.height > 0)) return
    const font = text.style.font?.trim() || DEFAULT_FONT
    const metrics = sxfTextFontMetrics(font)
    const r = (text.angleDeg * Math.PI) / 180
    const dir: Point = [Math.cos(r), Math.sin(r)]
    const nrm: Point = [-Math.sin(r), Math.cos(r)]
    const bp = Math.min(9, Math.max(1, Math.round(text.basePoint) || 1))
    const hx = [0, 0.5, 1][(bp - 1) % 3]
    const vy = [0, 0.5, 1][Math.floor((bp - 1) / 3)]
    const cells = sxfTextCells(content)
    const width = text.width > 0 ? text.width : text.height * cells
    // Bottom-left of the text box, then up to the baseline.
    const rise = text.height * metrics.descender - vy * text.height
    const x = text.anchor[0] - hx * width * dir[0] + rise * nrm[0]
    const y = text.anchor[1] - hx * width * dir[1] + rise * nrm[1]
    const factor = Math.min(10, Math.max(0.1, width / (text.height * cells)))
    this.entity('TEXT', text.style, 'AcDbText')
    this.point(10, [x, y])
    this.pair(40, fmt(text.height * metrics.capHeight * this.s))
    this.pair(1, content)
    this.pair(50, fmt(((text.angleDeg % 360) + 360) % 360))
    this.pair(41, fmt(factor))
    this.pair(7, this.styleName(font))
  }

  private styleName(font: string) {
    let name = this.styles.get(font)
    if (!name) {
      name = tableName(font) || `SXF_FONT_${this.styles.size}`
      this.styles.set(font, name)
    }
    return name
  }

  private entity(type: string, style: SxfStyle, subclass: string) {
    this.pair(0, type)
    this.pair(5, this.nextHandle())
    this.pair(100, 'AcDbEntity')
    this.pair(8, this.layerName(style))
    this.pair(6, this.lineTypeName(style))
    const color = colorCodes(style.color)
    this.pair(62, String(color.aci))
    if (color.trueColor !== undefined) this.pair(420, String(color.trueColor))
    this.pair(370, String(lineWeight(style.lineWidth)))
    this.pair(100, subclass)
  }

  private layerName(style: SxfStyle) {
    let layer = this.layers.get(style.layer)
    if (!layer) {
      const used = new Set(
        [...this.layers.values()].map(l => l.name.toLowerCase())
      )
      const base = tableName(style.layer) || '0'
      let name = base
      for (let i = 2; used.has(name.toLowerCase()); i++) name = `${base}_${i}`
      layer = { name, visible: style.visible }
      this.layers.set(style.layer, layer)
    }
    if (style.visible) layer.visible = true
    return layer.name
  }

  private lineTypeName(style: SxfStyle) {
    const key = style.lineType
    const known = this.lineTypes.get(key)
    if (known) return known.name
    const predefined = SXF_LINE_TYPE_PATTERNS[key]
    if (key === 'continuous' || (predefined && predefined.length === 0))
      return 'CONTINUOUS'
    const pattern = predefined ?? style.lineTypePattern ?? []
    if (pattern.length === 0) return 'CONTINUOUS'
    const name = LINE_TYPE_NAMES[key] ?? (tableName(`SXF_${key}`) || 'SXF_USER')
    this.lineTypes.set(key, { name, pattern })
    return name
  }

  private writeLineTypes() {
    const types = [
      { name: 'BYBLOCK', pattern: [] as number[] },
      { name: 'BYLAYER', pattern: [] as number[] },
      { name: 'CONTINUOUS', pattern: [] as number[] },
      ...this.lineTypes.values()
    ]
    this.table('LTYPE', types.length)
    for (const type of types) {
      this.pair(0, 'LTYPE')
      this.pair(5, this.nextHandle())
      this.pair(100, 'AcDbSymbolTableRecord')
      this.pair(100, 'AcDbLinetypeTableRecord')
      this.pair(2, type.name)
      this.pair(70, '0')
      this.pair(3, '')
      this.pair(72, '65')
      this.pair(73, String(type.pattern.length))
      // Patterns are paper millimetres; records hold them in drawing units,
      // like the standard line types added later, so entities need no line
      // type scale.
      this.pair(
        40,
        fmt(type.pattern.reduce((sum, v) => sum + Math.abs(v), 0) * this.s)
      )
      for (const v of type.pattern) {
        this.pair(49, fmt(v * this.s))
        this.pair(74, '0')
      }
    }
    this.pair(0, 'ENDTAB')
  }

  private writeLayers() {
    const layers = [...this.layers.values()].filter(l => l.name !== '0')
    this.table('LAYER', layers.length + 1)
    for (const layer of [
      { name: '0', visible: this.layers.get('0')?.visible ?? true },
      ...layers
    ]) {
      this.pair(0, 'LAYER')
      this.pair(5, this.nextHandle())
      this.pair(100, 'AcDbSymbolTableRecord')
      this.pair(100, 'AcDbLayerTableRecord')
      this.pair(2, layer.name)
      this.pair(70, '0')
      // A negative color turns the layer off (SXF layer flag 0 = hidden).
      this.pair(62, layer.visible ? '7' : '-7')
      this.pair(6, 'CONTINUOUS')
    }
    this.pair(0, 'ENDTAB')
  }

  private writeStyles() {
    this.table('STYLE', this.styles.size)
    for (const [font, name] of this.styles) {
      this.pair(0, 'STYLE')
      this.pair(5, this.nextHandle())
      this.pair(100, 'AcDbSymbolTableRecord')
      this.pair(100, 'AcDbTextStyleTableRecord')
      this.pair(2, name)
      this.pair(70, '0')
      this.pair(40, '0.0')
      this.pair(41, '1.0')
      this.pair(50, '0.0')
      this.pair(71, '0')
      this.pair(42, '2.5')
      this.pair(3, '')
      this.pair(4, '')
      // TrueType family name, matched against the aliases in fonts.json.
      this.pair(1001, 'ACAD')
      this.pair(1000, font.replace(/[\r\n]+/g, ' '))
      this.pair(1071, '0')
    }
    this.pair(0, 'ENDTAB')
  }

  private table(name: string, count: number) {
    this.pair(0, 'TABLE')
    this.pair(2, name)
    this.pair(5, this.nextHandle())
    this.pair(70, String(count))
  }

  private section(name: string) {
    this.pair(0, 'SECTION')
    this.pair(2, name)
  }

  private variable(name: string, code: number, value: string) {
    this.pair(9, name)
    this.pair(code, value)
  }

  /** A point, scaled to drawing units. */
  private point(code: number, p: Point) {
    this.pair(code, fmt(p[0] * this.s))
    this.pair(code + 10, fmt(p[1] * this.s))
    this.pair(code + 20, '0.0')
  }

  private pair(code: number, value: string) {
    this.out.push(`${code}\n${value}\n`)
  }

  private nextHandle() {
    return (this.handle++).toString(16).toUpperCase()
  }

  private capture(fn: () => void) {
    const saved = this.out
    this.out = []
    fn()
    const text = this.out.join('')
    this.out = saved
    return text
  }
}

/**
 * ACI / true colour for an SXF colour. Black and white become ACI 7, which
 * the viewer draws in the contrasting colour of the background (SXF drawings
 * assume white paper).
 */
function colorCodes(rgb: Rgb): { aci: number; trueColor?: number } {
  const [r, g, b] = rgb
  if (
    (r === 0 && g === 0 && b === 0) ||
    (r === 255 && g === 255 && b === 255)
  ) {
    return { aci: 7 }
  }
  return { aci: 7, trueColor: (r << 16) | (g << 8) | b }
}

function lineWeight(widthMm: number) {
  const requested = Math.max(0, Math.round(widthMm * 100))
  return LINE_WEIGHTS.reduce((best, w) =>
    Math.abs(w - requested) < Math.abs(best - requested) ? w : best
  )
}
