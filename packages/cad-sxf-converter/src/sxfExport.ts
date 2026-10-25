/**
 * SXF writer: SFC (feature comment file) and P21 (ISO 10303-21, AP202).
 *
 * The drawing is laid out like a CAD-made delivery drawing: the drawing sheet
 * holds one partial drawing (部分図, `sfig_org` kind 1) in real millimetres,
 * placed at the sheet scale. Layers, colours (16 predefined + user RGB),
 * predefined line types and widths and text fonts become SXF code tables.
 *
 * The feature layouts and the AP202 presentation graph follow ezsxf (MIT,
 * https://github.com/monozukuri-ai/ezsxf): `src/features.rs`, `src/writer.rs`,
 * `src/p21_writer.rs`, `src/p21_hatches.rs` and `src/p21_annotations.rs`.
 */
import {
  cellFontMetrics,
  cellFontName,
  collectExportDrawing,
  type CollectOptions,
  type ExportDrawing,
  type ExportEntity,
  type ExportStyle,
  principalCurve,
  type Rgb,
  textCells,
  type Vec2
} from '@mlightcad/cad-export-model'
import type { AcDbDatabase } from '@mlightcad/data-model'
import { zipSync } from 'fflate'

import { encodeShiftJis } from './shiftJis'
import {
  SXF_PREDEFINED_COLORS,
  SXF_PREDEFINED_LINE_TYPES,
  SXF_PREDEFINED_WIDTHS
} from './style'

export interface SxfWriteOptions {
  /** File name written to the header (`FILE_NAME`). */
  fileName?: string
  /** ISO 8601 time stamp for the header; defaults to now. */
  timestamp?: string
  /** Author and organization for the header. */
  author?: string
  organization?: string
}

export interface SxfWriteResult {
  bytes: Uint8Array
  /** Parts of the drawing that were written only approximately. */
  warnings: string[]
}

// ---------------------------------------------------------------------------
// Feature model

/** SFC parameter: integer, real (length / angle), semantic string or list. */
type Param =
  | { i: number }
  | { r: number }
  | { s: string }
  | { list: number[]; int?: boolean }

interface Feature {
  id: number
  keyword: string
  params: Param[]
}

const int = (i: number): Param => ({ i: Math.round(i) })
/** Length: at most six fractional digits (SFC rule; P21 uses the same values). */
const real = (r: number): Param => ({ r: round(r, 6) })
/** Angle or scale. */
const ang = (r: number): Param => ({ r: round(r, 10) })

function round(value: number, digits: number) {
  const r = Number(value.toFixed(digits))
  return Object.is(r, -0) ? 0 : r
}
const str = (s: string): Param => ({ s })

const COLOR_NAMES = [
  'black',
  'red',
  'green',
  'blue',
  'yellow',
  'magenta',
  'cyan',
  'white',
  'deeppink',
  'brown',
  'orange',
  'lightgreen',
  'lightblue',
  'lavender',
  'lightgray',
  'darkgray'
]

/** SXF line type names the SXF reader gives DXF line types. */
const SXF_LINE_TYPE_BY_DXF_NAME: Record<string, number> = {
  SXF_DASHED: 2,
  SXF_DASHED_SPACED: 3,
  SXF_LONG_DASH_DOT: 4,
  SXF_LONG_DASHED_DOTTED: 4,
  SXF_LONG_DASH_2DOT: 5,
  SXF_LONG_DASHED_DOUBLE_DOTTED: 5,
  SXF_LONG_DASH_3DOT: 6,
  SXF_LONG_DASHED_TRIPLICATE_DOTTED: 6,
  SXF_DOTTED: 7,
  SXF_CHAIN: 8,
  SXF_CHAIN_2DASH: 9,
  SXF_CHAIN_DOUBLE_DASH: 9,
  SXF_DASH_DOT: 10,
  SXF_DASHED_DOTTED: 10,
  SXF_2DASH_DOT: 11,
  SXF_DOUBLE_DASHED_DOTTED: 11,
  SXF_DASH_2DOT: 12,
  SXF_DASHED_DOUBLE_DOTTED: 12,
  SXF_2DASH_2DOT: 13,
  SXF_DOUBLE_DASHED_DOUBLE_DOTTED: 13,
  SXF_DASH_3DOT: 14,
  SXF_DASHED_TRIPLICATE_DOTTED: 14,
  SXF_2DASH_3DOT: 15,
  SXF_DOUBLE_DASHED_TRIPLICATE_DOTTED: 15
}

/**
 * Predefined SXF line type (1–15) for a style: SXF names keep their code,
 * other patterns are matched by shape (dashes, dash + dots).
 */
export function sxfLineTypeCode(style: ExportStyle, scale: number): number {
  const known = SXF_LINE_TYPE_BY_DXF_NAME[style.lineType]
  if (known) return known
  const pattern = style.lineTypePattern.map(v => v / scale)
  if (pattern.length < 2) return 1
  const dashes = pattern.filter(v => v >= 0)
  const gaps = pattern.filter(v => v < 0).map(v => -v)
  if (dashes.length === 0 || gaps.length === 0) return 1
  const longest = Math.max(...dashes)
  const dots = dashes.filter(v => v < longest / 3).length
  if (dots >= 3) return 6
  if (dots === 2) return 5
  if (dots === 1) return dashes.length > 2 ? 11 : 4
  const gap = Math.max(...gaps)
  if (longest <= gap * 0.5) return 7
  if (longest <= gap) return 3
  return 2
}

function nearestWidthCode(width: number) {
  if (!(width > 0)) return 1
  let best = 0
  for (let i = 1; i < SXF_PREDEFINED_WIDTHS.length; i++) {
    if (
      Math.abs(SXF_PREDEFINED_WIDTHS[i] - width) <
      Math.abs(SXF_PREDEFINED_WIDTHS[best] - width)
    ) {
      best = i
    }
  }
  return best + 1
}

/** Sheet type (0–4 = A0–A4, 9 = free) and orientation (0 portrait, 1 landscape). */
function sheetCodes(drawing: ExportDrawing) {
  const sheet = drawing.sheet
  const type = { A0: 0, A1: 1, A2: 2, A3: 3, A4: 4 }[sheet.paper] ?? 9
  return { type, orientation: sheet.portrait ? 0 : 1 }
}

interface Model {
  features: Feature[]
  title: string
  layers: string[]
  /** Layer code → visible. */
  layerVisible: Map<number, boolean>
  /** Colour code → definition id (declared colours). */
  colors: Map<number, Feature>
  lineTypes: Map<number, Feature>
  widths: Map<number, Feature>
  fonts: Map<number, Feature>
  /** Composite curve feature id → its boundary feature ids. */
  composites: Map<number, number[]>
  /** Composite curve code (1-based order) → feature id. */
  compositeCodes: number[]
  /** sfig_org id → component ids. */
  sfigComponents: Map<number, number[]>
  sheetComponents: number[]
  sheet: {
    name: string
    type: number
    orientation: number
    width: number
    height: number
  }
  warnings: string[]
}

/** Builds the SXF features of a drawing (shared by the SFC and P21 writers). */
class FeatureBuilder {
  private readonly features: Feature[] = []
  private nextId = 1
  private readonly warnings: string[] = []
  private readonly layerCodes = new Map<string, number>()
  private readonly colorCodes = new Map<string, number>()
  private readonly userColors: Rgb[] = []
  private readonly usedLineTypes = new Set<number>()
  private readonly usedWidths = new Set<number>()
  private readonly fontCodes = new Map<string, number>()
  private readonly usedColors = new Set<number>()
  private readonly scale: number

  constructor(private readonly drawing: ExportDrawing) {
    this.scale = drawing.sheet.scale > 0 ? drawing.sheet.scale : 1
  }

  private warnOnce(message: string) {
    if (!this.warnings.includes(message)) this.warnings.push(message)
  }

  private add(keyword: string, params: Param[]): Feature {
    const feature = { id: this.nextId++, keyword, params }
    this.features.push(feature)
    return feature
  }

  private layer(name: string) {
    return this.layerCodes.get(name) ?? 1
  }

  private color(style: ExportStyle) {
    let code: number
    if (style.foreground) {
      code = 1
    } else {
      const key = style.color.join(',')
      const cached = this.colorCodes.get(key)
      if (cached) return cached
      const predefined = Object.entries(SXF_PREDEFINED_COLORS).find(([, rgb]) =>
        rgb.every((v, i) => v === style.color[i])
      )
      if (predefined) {
        code = Number(predefined[0])
      } else if (this.userColors.length < 240) {
        this.userColors.push(style.color)
        code = 16 + this.userColors.length
      } else {
        this.warnOnce(
          'More than 240 colours: the rest use the nearest predefined colour'
        )
        code = nearestPredefinedColor(style.color)
      }
      this.colorCodes.set(key, code)
    }
    if (code <= 16) this.usedColors.add(code)
    return code
  }

  private lineType(style: ExportStyle) {
    const code = sxfLineTypeCode(style, this.scale)
    this.usedLineTypes.add(code)
    return code
  }

  private width(style: ExportStyle) {
    const code = nearestWidthCode(style.lineWeight)
    this.usedWidths.add(code)
    return code
  }

  private font(name: string) {
    let code = this.fontCodes.get(name)
    if (!code) {
      code = this.fontCodes.size + 1
      this.fontCodes.set(name, code)
    }
    return code
  }

  private lineStyle(style: ExportStyle): Param[] {
    return [
      int(this.layer(style.layer)),
      int(this.color(style)),
      int(this.lineType(style)),
      int(this.width(style))
    ]
  }

  build(): Model {
    const drawing = this.drawing
    drawing.layers.forEach((layer, i) => this.layerCodes.set(layer.name, i + 1))
    if (drawing.layers.length === 0) this.layerCodes.set('0', 1)
    if (drawing.layers.length > 256) {
      this.warnOnce('SXF has 256 layers; the remaining layers use the last one')
    }
    const layerNames =
      drawing.layers.length > 0 ? drawing.layers.map(l => l.name) : ['0']

    // Elements first (they decide which table entries are used); the tables
    // are written in front of them afterwards.
    const composites = new Map<number, number[]>()
    const compositeCodes: number[] = []
    const components: number[] = []
    for (const entity of drawing.entities) {
      this.addEntity(entity, components, composites, compositeCodes)
    }
    // SFC hierarchy: a composite curve owns every feature since the previous
    // definition, so fill boundaries and their composite curves come first.
    const boundaryIds = new Set<number>()
    for (const [id, parts] of composites) {
      boundaryIds.add(id)
      parts.forEach(part => boundaryIds.add(part))
    }
    const allElements = this.features.splice(0)
    const elements = [
      ...allElements.filter(f => boundaryIds.has(f.id)),
      ...allElements.filter(f => !boundaryIds.has(f.id))
    ]

    const colors = new Map<number, Feature>()
    const lineTypes = new Map<number, Feature>()
    const widths = new Map<number, Feature>()
    const fonts = new Map<number, Feature>()
    const layerVisible = new Map<number, boolean>()
    const hidden = new Set(
      drawing.layers.filter(l => l.hidden).map(l => l.name)
    )
    layerNames.slice(0, 256).forEach((name, i) => {
      layerVisible.set(i + 1, !hidden.has(name))
      this.add('layer_feature', [str(name), int(hidden.has(name) ? 0 : 1)])
    })
    for (const code of [...this.usedLineTypes].sort((a, b) => a - b)) {
      lineTypes.set(
        code,
        this.add('pre_defined_font_feature', [
          str(SXF_PREDEFINED_LINE_TYPES[code - 1])
        ])
      )
    }
    for (const code of [...this.usedColors].sort((a, b) => a - b)) {
      colors.set(
        code,
        this.add('pre_defined_colour_feature', [str(COLOR_NAMES[code - 1])])
      )
    }
    this.userColors.forEach((rgb, i) => {
      colors.set(
        17 + i,
        this.add(
          'user_defined_colour_feature',
          rgb.map(v => int(v))
        )
      )
    })
    for (const code of [...this.usedWidths].sort((a, b) => a - b)) {
      widths.set(
        code,
        this.add('width_feature', [real(SXF_PREDEFINED_WIDTHS[code - 1])])
      )
    }
    for (const [name, code] of this.fontCodes) {
      fonts.set(code, this.add('text_font_feature', [str(name)]))
    }
    const tables = this.features.splice(0)

    // Elements, then the partial drawing that owns them, its placement and
    // the sheet.
    const title = drawing.title.trim() || '図面'
    const sfig = this.add('sfig_org_feature', [str(title), int(1)])
    const sheet = drawing.sheet
    const placement = this.add('sfig_locate_feature', [
      int(1),
      str(title),
      real(-sheet.origin[0] / this.scale),
      real(-sheet.origin[1] / this.scale),
      ang(0),
      ang(1 / this.scale),
      ang(1 / this.scale)
    ])
    const { type, orientation } = sheetCodes(drawing)
    this.add('drawing_sheet_feature', [
      str(title),
      int(type),
      int(orientation),
      int(Math.round(sheet.width)),
      int(Math.round(sheet.height))
    ])
    const trailer = this.features.splice(0)

    // Renumber in file order so that ids increase through the file.
    const ordered = [...tables, ...elements, ...trailer]
    const renumber = new Map<number, number>()
    ordered.forEach((f, i) => renumber.set(f.id, i + 1))
    for (const f of ordered) f.id = renumber.get(f.id)!
    const mapIds = (ids: number[]) => ids.map(id => renumber.get(id)!)
    const compositeMap = new Map<number, number[]>()
    for (const [id, parts] of composites)
      compositeMap.set(renumber.get(id)!, mapIds(parts))

    return {
      features: ordered,
      title,
      layers: layerNames,
      layerVisible,
      colors,
      lineTypes,
      widths,
      fonts,
      composites: compositeMap,
      compositeCodes: mapIds(compositeCodes),
      sfigComponents: new Map([[sfig.id, mapIds(components)]]),
      sheetComponents: [placement.id],
      sheet: {
        name: title,
        type,
        orientation,
        width: Math.round(sheet.width),
        height: Math.round(sheet.height)
      },
      warnings: [...this.drawing.warnings, ...this.warnings]
    }
  }

  private addEntity(
    entity: ExportEntity,
    components: number[],
    composites: Map<number, number[]>,
    compositeCodes: number[]
  ) {
    const style = entity.style
    switch (entity.kind) {
      case 'polyline': {
        const id = this.addPolyline(style, entity.points, entity.closed)
        if (id) components.push(id)
        break
      }
      case 'curve': {
        const c = principalCurve(entity.curve)
        if (!(c.radiusX > 0)) break
        const deg = (a: number) => (a * 180) / Math.PI
        const norm = (a: number) => ((deg(a) % 360) + 360) % 360
        let feature: Feature
        if (c.circular && c.full) {
          feature = this.add('circle_feature', [
            ...this.lineStyle(style),
            real(c.center[0]),
            real(c.center[1]),
            real(c.radiusX)
          ])
        } else if (c.circular) {
          const start = norm(c.rotation + c.start)
          feature = this.add('arc_feature', [
            ...this.lineStyle(style),
            real(c.center[0]),
            real(c.center[1]),
            real(c.radiusX),
            int(0),
            ang(start),
            ang(norm(c.rotation + c.end))
          ])
        } else if (c.full) {
          feature = this.add('ellipse_feature', [
            ...this.lineStyle(style),
            real(c.center[0]),
            real(c.center[1]),
            real(c.radiusX),
            real(c.radiusY),
            ang(norm(c.rotation))
          ])
        } else {
          feature = this.add('ellipse_arc_feature', [
            ...this.lineStyle(style),
            real(c.center[0]),
            real(c.center[1]),
            real(c.radiusX),
            real(c.radiusY),
            int(0),
            ang(norm(c.rotation)),
            ang(norm(c.start)),
            ang(norm(c.end))
          ])
        }
        components.push(feature.id)
        break
      }
      case 'point': {
        const f = this.add('point_marker_feature', [
          int(this.layer(style.layer)),
          int(this.color(style)),
          real(entity.position[0]),
          real(entity.position[1]),
          int(3),
          ang(0),
          ang(1)
        ])
        components.push(f.id)
        break
      }
      case 'text': {
        const content = entity.text.replace(/[\p{Cc}]/gu, ' ')
        if (!content.trim() || !(entity.height > 0)) break
        const font = cellFontName(entity.font)
        const metrics = cellFontMetrics(font)
        const em = entity.height / metrics.capHeight
        const r = entity.rotation
        const rise = em * metrics.descender
        // Bottom-left of the text box (base point 1).
        const x = entity.position[0] + Math.sin(r) * rise
        const y = entity.position[1] - Math.cos(r) * rise
        const width =
          textCells(content) *
          em *
          (entity.widthFactor > 0 ? entity.widthFactor : 1)
        const f = this.add('text_string_feature', [
          int(this.layer(style.layer)),
          int(this.color(style)),
          int(this.font(font)),
          str(content),
          real(x),
          real(y),
          real(em),
          real(width),
          real(0),
          ang(((((r * 180) / Math.PI) % 360) + 360) % 360),
          ang(0),
          int(1),
          int(1)
        ])
        components.push(f.id)
        break
      }
      case 'fill': {
        const codes: number[] = []
        for (const loop of entity.loops) {
          if (loop.length < 3) continue
          const boundary = this.addPolyline(style, loop, true)
          if (!boundary) continue
          const composite = this.add('composite_curve_feature', [
            int(this.color(style)),
            int(1),
            int(1),
            int(0)
          ])
          this.usedLineTypes.add(1)
          this.usedWidths.add(1)
          composites.set(composite.id, [boundary])
          compositeCodes.push(composite.id)
          codes.push(compositeCodes.length)
        }
        if (codes.length === 0) break
        const f = this.add('fill_area_style_colour_feature', [
          int(this.layer(style.layer)),
          int(this.color(style)),
          int(codes[0]),
          int(codes.length - 1),
          { list: codes.slice(1), int: true }
        ])
        components.push(f.id)
        break
      }
      case 'image':
        this.warnOnce('Raster images are not exported to SXF')
        break
    }
  }

  private addPolyline(style: ExportStyle, points: Vec2[], closed: boolean) {
    const list = closed ? [...points, points[0]] : points
    if (list.length < 2) return undefined
    if (list.length === 2) {
      const [a, b] = list
      if (a[0] === b[0] && a[1] === b[1]) return undefined
      return this.add('line_feature', [
        ...this.lineStyle(style),
        real(a[0]),
        real(a[1]),
        real(b[0]),
        real(b[1])
      ]).id
    }
    return this.add('polyline_feature', [
      ...this.lineStyle(style),
      int(list.length),
      { list: list.map(p => round(p[0], 6)) },
      { list: list.map(p => round(p[1], 6)) }
    ]).id
  }
}

function nearestPredefinedColor(rgb: Rgb) {
  let best = 1
  let bestDistance = Infinity
  for (const [code, color] of Object.entries(SXF_PREDEFINED_COLORS)) {
    const d = color.reduce((sum, v, i) => sum + (v - rgb[i]) ** 2, 0)
    if (d < bestDistance) {
      best = Number(code)
      bestDistance = d
    }
  }
  return best
}

// ---------------------------------------------------------------------------
// Number and string formats

/** Decimal real without exponent, at most `digits` fractional digits. */
/** Shortest decimal spelling without an exponent. */
function decimal(value: number) {
  if (!Number.isFinite(value) || value === 0) return '0'
  const text = String(value)
  if (!/e/i.test(text)) return text
  const fixed = value.toFixed(20)
  return fixed.includes('.')
    ? fixed.replace(/0+$/, '').replace(/\.$/, '')
    : fixed
}

function headerTimestamp(options: SxfWriteOptions) {
  return options.timestamp ?? new Date().toISOString().replace(/\.\d+Z$/, '')
}

function headerFileName(
  options: SxfWriteOptions,
  extension: string,
  title: string
) {
  const name = options.fileName?.trim() || `${title || 'drawing'}.${extension}`
  return name.replace(/\.[^.]*$/, '') + '.' + extension
}

// ---------------------------------------------------------------------------
// SFC

function sfcParam(p: Param): string {
  if ('i' in p) return `'${p.i}'`
  if ('r' in p) return `'${decimal(p.r)}'`
  if ('s' in p) {
    // Semantic string: \'…\' with backslashes doubled.
    return `\\'${p.s.replace(/\\/g, '\\\\')}\\'`
  }
  return `'(${p.list.map(v => (p.int ? String(Math.round(v)) : decimal(v))).join(',')})'`
}

/** Header string (a plain STEP string: apostrophes doubled). */
function stepText(value: string) {
  return `'${value.replace(/'/g, '\'\'')}'`
}

/** Builds the SFC text of a drawing. */
export function sxfToSfcText(
  drawing: ExportDrawing,
  options: SxfWriteOptions = {}
) {
  const model = new FeatureBuilder(drawing).build()
  const lines = [
    'ISO-10303-21;',
    'HEADER;',
    'FILE_DESCRIPTION((\'SCADEC level2 feature_mode\'),\'2;1\');',
    `FILE_NAME(${stepText(headerFileName(options, 'sfc', model.title))},${stepText(headerTimestamp(options))},(${stepText(options.author ?? '')}),(${stepText(options.organization ?? '')}),'RemixCAD$$3.1','RemixCAD','');`,
    'FILE_SCHEMA((\'ASSOCIATIVE_DRAUGHTING\'));',
    'ENDSEC;',
    'DATA;'
  ]
  for (const f of model.features) {
    lines.push('/*SXF')
    lines.push(`#${f.id} = ${f.keyword}(${f.params.map(sfcParam).join(',')})`)
    lines.push('SXF*/')
  }
  lines.push('ENDSEC;', 'END-ISO-10303-21;', '')
  return { text: lines.join('\r\n'), warnings: model.warnings }
}

/** Writes a drawing as an SFC file (Shift_JIS). */
export function writeSfc(
  drawing: ExportDrawing,
  options: SxfWriteOptions = {}
): SxfWriteResult {
  const { text, warnings } = sxfToSfcText(drawing, options)
  const { bytes, unmapped } = encodeShiftJis(text)
  if (unmapped.length > 0) {
    warnings.push(
      `Characters without a Shift_JIS code were written as "?": ${unmapped.slice(0, 20).join(' ')}`
    )
  }
  return { bytes, warnings }
}

// ---------------------------------------------------------------------------
// P21 (AP202)

type Value =
  | { s: string }
  | { r: number }
  | { i: number }
  | { e: string }
  | { ref: number }
  | { typed: string; params: Value[] }
  | Value[]
  | '$'
  | '*'

interface StepRecord {
  keyword: string
  params: Value[]
}

const vs = (s: string): Value => ({ s })
const vr = (r: number): Value => ({ r })
const ve = (e: string): Value => ({ e })
const ref = (id: number): Value => ({ ref: id })
const refs = (ids: number[]): Value => ids.map(ref)
const measure = (keyword: string, value: number): Value => ({
  typed: keyword,
  params: [vr(value)]
})
const rec = (keyword: string, params: Value[] = []): StepRecord => ({
  keyword,
  params
})

/** STEP string: plain ASCII as is, anything else as one `\X2\` run. */
function stepString(value: string) {
  const clean = value.replace(/[\p{Cc}]/gu, ' ')
  if (/^[\x20-\x7e]*$/.test(clean) && !/[\\']/.test(clean)) return clean
  let out = '\\X2\\'
  for (let i = 0; i < clean.length; i++) {
    out += clean.charCodeAt(i).toString(16).toUpperCase().padStart(4, '0')
  }
  return out + '\\X0\\'
}

function stepReal(value: number) {
  const text = decimal(value)
  return text.includes('.') ? text : `${text}.0`
}

function stepValue(v: Value): string {
  if (v === '$' || v === '*') return v
  if (Array.isArray(v)) return `(${v.map(stepValue).join(',')})`
  if ('s' in v) return `'${stepString(v.s)}'`
  if ('r' in v) return stepReal(v.r)
  if ('i' in v) return String(v.i)
  if ('e' in v) return `.${v.e}.`
  if ('ref' in v) return `#${v.ref}`
  return `${v.typed}(${v.params.map(stepValue).join(',')})`
}

class StepGraph {
  readonly entities: (StepRecord | StepRecord[])[] = []
  readonly layerItems = new Map<number, number[]>()
  private readonly pointIds = new Map<string, number>()
  readonly styles = new Map<string, number>()
  colors = new Map<number, number>()
  lineTypes = new Map<number, number>()
  widths = new Map<number, number>()
  fonts = new Map<number, number>()
  curves = new Map<number, number>()
  items = new Map<number, number>()
  context = 0
  lengthUnit = 0
  source = 0

  add(keyword: string, params: Value[] = []) {
    this.entities.push(rec(keyword, params))
    return this.entities.length
  }

  complex(records: StepRecord[]) {
    records.sort((a, b) =>
      a.keyword < b.keyword ? -1 : a.keyword > b.keyword ? 1 : 0
    )
    this.entities.push(records)
    return this.entities.length
  }

  point(p: Vec2) {
    const key = `${p[0] === 0 ? 0 : p[0]},${p[1] === 0 ? 0 : p[1]}`
    let id = this.pointIds.get(key)
    if (!id) {
      id = this.add('CARTESIAN_POINT', [vs(''), [vr(p[0]), vr(p[1])]])
      this.pointIds.set(key, id)
    }
    return id
  }

  axis(p: Vec2, angleDeg: number) {
    const point = this.point(p)
    const a = (angleDeg * Math.PI) / 180
    const direction = this.add('DIRECTION', [
      vs(''),
      [vr(Math.cos(a)), vr(Math.sin(a))]
    ])
    return this.add('AXIS2_PLACEMENT_2D', [vs(''), ref(point), ref(direction)])
  }

  predefinedColor(name: string) {
    const rgb: Record<string, [number, number, number]> = {
      deeppink: [0.75, 0, 0.5],
      brown: [0.75, 0.5, 0.25],
      orange: [1, 0.5, 0],
      lightgreen: [0.5, 0.75, 0.5],
      lightblue: [0, 0.5, 1],
      lavender: [0.5, 0.25, 1],
      lightgray: [0.75, 0.75, 0.75],
      darkgray: [0.5, 0.5, 0.5]
    }
    const value = rgb[name]
    return value
      ? this.add('COLOUR_RGB', [vs(`$$SXF_${name}`), ...value.map(vr)])
      : this.add('DRAUGHTING_PRE_DEFINED_COLOUR', [vs(name)])
  }

  occurrence(
    kind: string,
    name: string,
    target: number,
    style: number,
    layer: number
  ) {
    const records = [
      rec('ANNOTATION_OCCURRENCE'),
      rec(kind),
      rec('DRAUGHTING_ANNOTATION_OCCURRENCE'),
      rec('GEOMETRIC_REPRESENTATION_ITEM'),
      rec('REPRESENTATION_ITEM', [vs(name)]),
      rec('STYLED_ITEM', [refs([style]), ref(target)])
    ]
    if (kind === 'ANNOTATION_SUBFIGURE_OCCURRENCE') {
      records.push(rec('ANNOTATION_SYMBOL_OCCURRENCE'))
    }
    const id = this.complex(records)
    const list = this.layerItems.get(layer) ?? []
    list.push(id)
    this.layerItems.set(layer, list)
    return id
  }

  curveStyle(color: number, lineType: number, width: number) {
    const key = `${color || 1},${lineType || 1},${width || 1}`
    let id = this.styles.get(key)
    if (!id) {
      const curveStyle = this.add('CURVE_STYLE', [
        vs(''),
        ref(this.lineTypes.get(lineType || 1)!),
        ref(this.widths.get(width || 1)!),
        ref(this.colors.get(color || 1)!)
      ])
      id = this.add('PRESENTATION_STYLE_ASSIGNMENT', [refs([curveStyle])])
      this.styles.set(key, id)
    }
    return id
  }
}

const num = (p: Param) => ('i' in p ? p.i : 'r' in p ? p.r : 0)

/** Builds the P21 (AP202) text of a drawing. */
export function sxfToP21Text(
  drawing: ExportDrawing,
  options: SxfWriteOptions = {}
) {
  const model = new FeatureBuilder(drawing).build()
  const g = new StepGraph()
  const angleUnit = g.complex([
    rec('NAMED_UNIT', ['*']),
    rec('PLANE_ANGLE_UNIT'),
    rec('SI_UNIT', ['$', ve('RADIAN')])
  ])
  g.lengthUnit = g.complex([
    rec('LENGTH_UNIT'),
    rec('NAMED_UNIT', ['*']),
    rec('SI_UNIT', [ve('MILLI'), ve('METRE')])
  ])
  g.context = g.complex([
    rec('GEOMETRIC_REPRESENTATION_CONTEXT', [{ i: 2 }]),
    rec('GLOBAL_UNIT_ASSIGNED_CONTEXT', [refs([angleUnit, g.lengthUnit])]),
    rec('REPRESENTATION_CONTEXT', [vs('ID1'), vs('2D')])
  ])
  for (const [code, f] of model.colors) {
    if (f.keyword === 'pre_defined_colour_feature') {
      g.colors.set(code, g.predefinedColor((f.params[0] as { s: string }).s))
    } else {
      g.colors.set(
        code,
        g.add('COLOUR_RGB', [vs(''), ...f.params.map(p => vr(num(p) / 255))])
      )
    }
  }
  for (const [code, f] of model.lineTypes) {
    g.lineTypes.set(
      code,
      g.add('DRAUGHTING_PRE_DEFINED_CURVE_FONT', [
        vs((f.params[0] as { s: string }).s)
      ])
    )
  }
  const widthMeasure = (w: number) =>
    g.add('LENGTH_MEASURE_WITH_UNIT', [
      measure('POSITIVE_LENGTH_MEASURE', w),
      ref(g.lengthUnit)
    ])
  for (const [code, f] of model.widths)
    g.widths.set(code, widthMeasure(num(f.params[0])))
  // Predefined codes are valid without a declaration.
  COLOR_NAMES.forEach((name, i) => {
    if (!g.colors.has(i + 1)) g.colors.set(i + 1, g.predefinedColor(name))
  })
  SXF_PREDEFINED_LINE_TYPES.forEach((name, i) => {
    if (!g.lineTypes.has(i + 1)) {
      g.lineTypes.set(
        i + 1,
        g.add('DRAUGHTING_PRE_DEFINED_CURVE_FONT', [vs(name)])
      )
    }
  })
  SXF_PREDEFINED_WIDTHS.forEach((w, i) => {
    if (!g.widths.has(i + 1)) g.widths.set(i + 1, widthMeasure(w))
  })
  g.source = g.add('EXTERNAL_SOURCE', [
    { typed: 'IDENTIFIER', params: [vs('SCADEC')] }
  ])
  for (const [code, f] of model.fonts) {
    g.fonts.set(
      code,
      g.add('EXTERNALLY_DEFINED_TEXT_FONT', [
        { typed: 'IDENTIFIER', params: [vs((f.params[0] as { s: string }).s)] },
        ref(g.source)
      ])
    )
  }

  const byId = new Map(model.features.map(f => [f.id, f]))
  const compositeOf = new Map<number, number>()
  model.compositeCodes.forEach((id, i) => compositeOf.set(i + 1, id))
  let sfigMap = 0
  let sfigName = ''
  for (const f of model.features) {
    const p = f.params
    const item = ((): number | undefined => {
      switch (f.keyword) {
        case 'line_feature':
        case 'polyline_feature':
        case 'circle_feature':
        case 'arc_feature':
        case 'ellipse_feature':
        case 'ellipse_arc_feature': {
          const style = g.curveStyle(num(p[1]), num(p[2]), num(p[3]))
          const geometry = curveGeometry(g, f)
          g.curves.set(f.id, geometry)
          return g.occurrence(
            'ANNOTATION_CURVE_OCCURRENCE',
            '',
            geometry,
            style,
            num(p[0])
          )
        }
        case 'text_string_feature':
          return textOccurrence(g, p)
        case 'point_marker_feature': {
          const definition = g.add('PRE_DEFINED_POINT_MARKER_SYMBOL', [
            vs('dot')
          ])
          const axis = g.axis([num(p[2]), num(p[3])], num(p[5]))
          const target = g.add('SYMBOL_TARGET', [
            vs(''),
            ref(axis),
            vr(num(p[6])),
            vr(num(p[6]))
          ])
          const symbol = g.add('DEFINED_SYMBOL', [
            vs(''),
            ref(definition),
            ref(target)
          ])
          const color = g.add('SYMBOL_COLOUR', [
            ref(g.colors.get(num(p[1]) || 1)!)
          ])
          const style = g.add('SYMBOL_STYLE', [vs(''), ref(color)])
          const assignment = g.add('PRESENTATION_STYLE_ASSIGNMENT', [
            refs([style])
          ])
          return g.occurrence(
            'ANNOTATION_SYMBOL_OCCURRENCE',
            '',
            symbol,
            assignment,
            num(p[0])
          )
        }
        case 'composite_curve_feature': {
          const segments = (model.composites.get(f.id) ?? []).map(child =>
            g.add('COMPOSITE_CURVE_SEGMENT', [
              ve('CONTINUOUS'),
              ve('T'),
              ref(g.curves.get(child)!)
            ])
          )
          const geometry = g.add('COMPOSITE_CURVE', [
            vs(''),
            refs(segments),
            ve('F')
          ])
          g.curves.set(f.id, geometry)
          const style = g.curveStyle(num(p[0]), num(p[1]), num(p[2]))
          const occurrence = g.occurrence(
            'ANNOTATION_CURVE_OCCURRENCE',
            '',
            geometry,
            style,
            0
          )
          if (num(p[3]) === 0) g.add('INVISIBILITY', [refs([occurrence])])
          return occurrence
        }
        case 'fill_area_style_colour_feature': {
          const codes = [
            num(p[2]),
            ...((p[4] as { list: number[] }).list ?? [])
          ]
          const ids = codes.map(code => compositeOf.get(code)!)
          const boundaries = ids.map(id => g.curves.get(id)!)
          const polygons = ids.map(id =>
            (model.composites.get(id) ?? []).flatMap(child =>
              polylinePoints(byId.get(child)!)
            )
          )
          const target = g.point(interiorPoint(polygons))
          const area = g.add('ANNOTATION_FILL_AREA', [vs(''), refs(boundaries)])
          const colour = g.add('FILL_AREA_STYLE_COLOUR', [
            vs(''),
            ref(g.colors.get(num(p[1]) || 1)!)
          ])
          const fillStyle = g.add('FILL_AREA_STYLE', [vs(''), refs([colour])])
          const assignment = g.add('PRESENTATION_STYLE_ASSIGNMENT', [
            refs([fillStyle])
          ])
          const id = g.complex([
            rec('ANNOTATION_FILL_AREA_OCCURRENCE', [ref(target)]),
            rec('ANNOTATION_OCCURRENCE'),
            rec('DRAUGHTING_ANNOTATION_OCCURRENCE'),
            rec('GEOMETRIC_REPRESENTATION_ITEM'),
            rec('REPRESENTATION_ITEM', [vs('')]),
            rec('STYLED_ITEM', [refs([assignment]), ref(area)])
          ])
          const layer = num(p[0])
          g.layerItems.set(layer, [...(g.layerItems.get(layer) ?? []), id])
          return id
        }
        case 'sfig_org_feature': {
          const components = (model.sfigComponents.get(f.id) ?? []).map(
            id => g.items.get(id)!
          )
          const axis = g.axis([0, 0], 0)
          sfigName = `$$SXF_FM_${(p[0] as { s: string }).s}`
          const representation = g.add('DRAUGHTING_SUBFIGURE_REPRESENTATION', [
            vs(sfigName),
            refs([...components, axis]),
            ref(g.context)
          ])
          sfigMap = g.add('SYMBOL_REPRESENTATION_MAP', [
            ref(axis),
            ref(representation)
          ])
          return undefined
        }
        case 'sfig_locate_feature': {
          const axis = g.axis([num(p[2]), num(p[3])], num(p[4]))
          const target = g.add('SYMBOL_TARGET', [
            vs(''),
            ref(axis),
            vr(num(p[5])),
            vr(num(p[6]))
          ])
          const mapped = g.complex([
            rec('ANNOTATION_SYMBOL'),
            rec('GEOMETRIC_REPRESENTATION_ITEM'),
            rec('MAPPED_ITEM', [ref(sfigMap), ref(target)]),
            rec('REPRESENTATION_ITEM', [vs('')])
          ])
          const assignment = g.add('PRESENTATION_STYLE_ASSIGNMENT', [
            [{ typed: 'NULL_STYLE', params: [ve('NULL')] }]
          ])
          return g.occurrence(
            'ANNOTATION_SUBFIGURE_OCCURRENCE',
            sfigName,
            mapped,
            assignment,
            num(p[0])
          )
        }
        default:
          return undefined
      }
    })()
    if (item !== undefined) g.items.set(f.id, item)
  }

  // Title, sheet and layers.
  const definition = g.add('DRAWING_DEFINITION', [vs('01'), '$'])
  const revision = g.add('DRAUGHTING_DRAWING_REVISION', [
    vs('01'),
    ref(definition),
    '$'
  ])
  g.add('DRAUGHTING_TITLE', [
    refs([revision]),
    vs('JAPANESE'),
    vs(model.sheet.name)
  ])
  const axis = g.axis([0, 0], 0)
  const box = g.add('PLANAR_BOX', [
    vs(''),
    vr(model.sheet.width),
    vr(model.sheet.height),
    ref(axis)
  ])
  const sheetItems = [...model.sheetComponents.map(id => g.items.get(id)!), box]
  const paperName =
    model.sheet.type === 9
      ? 'FREE'
      : `A${model.sheet.type}_${model.sheet.orientation === 0 ? 'vertical' : 'horizontal'}`
  const sheetId = g.add('DRAWING_SHEET_REVISION', [
    vs(paperName),
    refs(sheetItems),
    ref(g.context),
    vs('01')
  ])
  g.add('DRAWING_SHEET_REVISION_USAGE', [ref(sheetId), ref(revision), vs('01')])
  g.add('PRESENTATION_SIZE', [ref(sheetId), ref(box)])
  model.layers.slice(0, 256).forEach((name, i) => {
    const items = g.layerItems.get(i + 1)
    if (!items) return
    const assignment = g.add('PRESENTATION_LAYER_ASSIGNMENT', [
      vs(name),
      vs(''),
      refs(items)
    ])
    g.add('PRESENTATION_LAYER_USAGE', [ref(assignment), ref(sheetId)])
    if (model.layerVisible.get(i + 1) === false)
      g.add('INVISIBILITY', [refs([assignment])])
  })
  const dummy = g.layerItems.get(0)
  if (dummy) {
    const assignment = g.add('PRESENTATION_LAYER_ASSIGNMENT', [
      vs('$$SXF_dummy_layer_for_subfigure'),
      vs(''),
      refs(dummy)
    ])
    g.add('PRESENTATION_LAYER_USAGE', [ref(assignment), ref(sheetId)])
  }

  const record = (r: StepRecord) =>
    `${r.keyword}(${r.params.map(stepValue).join(',')})`
  const lines = [
    'ISO-10303-21;',
    'HEADER;',
    'FILE_DESCRIPTION((\'SCADEC level2 AP202_mode\'),\'1\');',
    `FILE_NAME('${stepString(headerFileName(options, 'p21', model.title))}','${stepString(headerTimestamp(options))}',('${stepString(options.author ?? '')}'),('${stepString(options.organization ?? '')}'),'RemixCAD$$3.1','RemixCAD','');`,
    'FILE_SCHEMA((\'ASSOCIATIVE_DRAUGHTING\'));',
    'ENDSEC;',
    'DATA;'
  ]
  g.entities.forEach((entity, i) => {
    lines.push(
      `#${i + 1}=${Array.isArray(entity) ? `(${entity.map(record).join('')})` : record(entity)};`
    )
  })
  lines.push('ENDSEC;', 'END-ISO-10303-21;', '')
  return { text: lines.join('\r\n'), warnings: model.warnings }
}

/** Writes a drawing as a P21 file (ASCII; other characters as `\X2\`). */
export function writeP21(
  drawing: ExportDrawing,
  options: SxfWriteOptions = {}
): SxfWriteResult {
  const { text, warnings } = sxfToP21Text(drawing, options)
  return { bytes: new TextEncoder().encode(text), warnings }
}

/**
 * Writes the ZIP form of an SXF file (`.sfz` for SFC, `.p2z` for P21): the
 * drawing file alone, named `<name>.sfc` / `<name>.p21`.
 */
export function zipSxf(bytes: Uint8Array, fileName: string): Uint8Array {
  return zipSync({ [fileName]: bytes })
}

function curveGeometry(g: StepGraph, f: Feature) {
  const p = f.params.map(num)
  const list = (i: number) => (f.params[i] as { list: number[] }).list
  switch (f.keyword) {
    case 'line_feature': {
      const start = g.point([p[4], p[5]])
      const end = g.point([p[6], p[7]])
      const dx = p[6] - p[4]
      const dy = p[7] - p[5]
      const length = Math.hypot(dx, dy) || 1
      const direction = g.add('DIRECTION', [
        vs(''),
        [vr(dx / length), vr(dy / length)]
      ])
      const vector = g.add('VECTOR', [vs(''), ref(direction), vr(1)])
      const basis = g.add('LINE', [vs(''), ref(start), ref(vector)])
      return g.add('TRIMMED_CURVE', [
        vs(''),
        ref(basis),
        refs([start]),
        refs([end]),
        ve('T'),
        ve('CARTESIAN')
      ])
    }
    case 'polyline_feature': {
      const xs = list(5)
      const ys = list(6)
      return g.add('POLYLINE', [
        vs(''),
        refs(xs.map((x, i) => g.point([x, ys[i]])))
      ])
    }
    case 'circle_feature': {
      const axis = g.axis([p[4], p[5]], 0)
      return g.add('CIRCLE', [vs(''), ref(axis), vr(p[6])])
    }
    case 'arc_feature': {
      const axis = g.axis([p[4], p[5]], 0)
      const circle = g.add('CIRCLE', [vs(''), ref(axis), vr(p[6])])
      return trimmed(g, circle, p[8], p[9], p[7])
    }
    case 'ellipse_feature': {
      const axis = g.axis([p[4], p[5]], p[8])
      return g.add('ELLIPSE', [vs(''), ref(axis), vr(p[6]), vr(p[7])])
    }
    default: {
      // ellipse_arc_feature
      const axis = g.axis([p[4], p[5]], p[9])
      const ellipse = g.add('ELLIPSE', [vs(''), ref(axis), vr(p[6]), vr(p[7])])
      return trimmed(g, ellipse, p[10], p[11], p[8])
    }
  }
}

function trimmed(
  g: StepGraph,
  basis: number,
  startDeg: number,
  endDeg: number,
  direction: number
) {
  return g.add('TRIMMED_CURVE', [
    vs(''),
    ref(basis),
    [measure('PARAMETER_VALUE', (startDeg * Math.PI) / 180)],
    [measure('PARAMETER_VALUE', (endDeg * Math.PI) / 180)],
    ve(direction === 0 ? 'T' : 'F'),
    ve('PARAMETER')
  ])
}

function textOccurrence(g: StepGraph, p: Param[]) {
  const color = g.colors.get(num(p[1]) || 1)!
  const font = g.fonts.get(num(p[2]) || 1)!
  const height = num(p[6])
  const width = num(p[7])
  const angle = num(p[9])
  const basePoint = num(p[11]) || 1
  const extent = g.add('PLANAR_EXTENT', [vs(''), vr(width), vr(height)])
  // AP202 places the baseline origin, not the box anchor (ezsxf).
  const offset = [0.5, -0.5, -1][Math.floor((basePoint - 1) / 3)] * height
  const r = (angle * Math.PI) / 180
  const baseline: Vec2 = [
    num(p[4]) - Math.sin(r) * offset,
    num(p[5]) + Math.cos(r) * offset
  ]
  const axis = g.axis(baseline, angle)
  const horizontal = ['left', 'centre', 'right'][(basePoint - 1) % 3]
  const vertical = ['baseline', 'middleline', 'topline'][
    Math.floor((basePoint - 1) / 3)
  ]
  const literal = g.add('TEXT_LITERAL_WITH_EXTENT', [
    vs(`$$SXF_${vertical} ${horizontal}`),
    vs((p[3] as { s: string }).s),
    ref(axis),
    vs(`baseline ${horizontal}`),
    ve(num(p[12]) === 2 ? 'DOWN' : 'RIGHT'),
    ref(font),
    ref(extent)
  ])
  const appearance = g.add('TEXT_STYLE_FOR_DEFINED_FONT', [ref(color)])
  const style = g.complex([
    rec('TEXT_STYLE', [vs(''), ref(appearance)]),
    rec('TEXT_STYLE_WITH_BOX_CHARACTERISTICS', [
      [
        measure('BOX_HEIGHT', height),
        measure('BOX_WIDTH', width),
        measure('BOX_SLANT_ANGLE', (num(p[10]) * Math.PI) / 180),
        measure('BOX_ROTATE_ANGLE', 0)
      ]
    ]),
    rec('TEXT_STYLE_WITH_SPACING', [measure('LENGTH_MEASURE', num(p[8]))])
  ])
  const assignment = g.add('PRESENTATION_STYLE_ASSIGNMENT', [refs([style])])
  return g.occurrence(
    'ANNOTATION_TEXT_OCCURRENCE',
    '',
    literal,
    assignment,
    num(p[0])
  )
}

function polylinePoints(f: Feature): Vec2[] {
  if (f.keyword === 'line_feature') {
    const p = f.params.map(num)
    return [
      [p[4], p[5]],
      [p[6], p[7]]
    ]
  }
  const xs = (f.params[5] as { list: number[] }).list
  const ys = (f.params[6] as { list: number[] }).list
  return xs.map((x, i) => [x, ys[i]] as Vec2)
}

/** A point inside the filled region (scanline between boundary crossings). */
function interiorPoint(polygons: Vec2[][]): Vec2 {
  const ys = [...new Set(polygons.flat().map(p => p[1]))].sort((a, b) => a - b)
  for (let i = 0; i + 1 < ys.length; i++) {
    const y = ys[i] + (ys[i + 1] - ys[i]) / 2
    if (y === ys[i] || y === ys[i + 1]) continue
    const crossings: number[] = []
    for (const polygon of polygons) {
      for (let j = 0; j + 1 < polygon.length; j++) {
        const a = polygon[j]
        const b = polygon[j + 1]
        if (a[1] > y !== b[1] > y) {
          crossings.push(a[0] + ((y - a[1]) * (b[0] - a[0])) / (b[1] - a[1]))
        }
      }
    }
    crossings.sort((a, b) => a - b)
    for (let j = 0; j + 1 < crossings.length; j += 2) {
      if (crossings[j + 1] - crossings[j] > 1e-6) {
        return [crossings[j] + (crossings[j + 1] - crossings[j]) / 2, y]
      }
    }
  }
  return polygons[0]?.[0] ?? [0, 0]
}

/** SXF file forms {@link exportSxf} writes. */
export type SxfExportFormat = 'sfc' | 'p21' | 'sfz' | 'p2z'

/**
 * Writes a drawing database as an SXF file (`sfc` / `p21`, or their ZIP
 * forms `sfz` / `p2z`).
 *
 * @param options - Sheet options (paper, orientation, scale; chosen from the
 *   drawing limits or the drawing size by default), the title and the header
 */
export function exportSxf(
  db: AcDbDatabase,
  format: SxfExportFormat,
  options: CollectOptions & SxfWriteOptions = {}
): SxfWriteResult {
  const { fileName, timestamp, author, organization, ...collect } = options
  const drawing = collectExportDrawing(db, collect)
  const header = { fileName, timestamp, author, organization }
  const zipped = format === 'sfz' || format === 'p2z'
  const inner = format === 'sfz' ? 'sfc' : format === 'p2z' ? 'p21' : format
  const result =
    inner === 'sfc' ? writeSfc(drawing, header) : writeP21(drawing, header)
  if (!zipped) return result
  const name = headerFileName(header, inner, drawing.title)
  return { ...result, bytes: zipSxf(result.bytes, name) }
}
