import type { DxfDocument, JwcDocument, JwwDocument } from 'ezjww'

import {
  bmpSize,
  cropBmp,
  cropJwwImage,
  decodeJwwImages,
  imageMimeType,
  type JwwImageCrop,
  jwwImageDisplayPath,
  type JwwImageFile,
  jwwImageKey,
  type JwwImageReference,
  jwwTrimPixelRect,
  parseJwwImageReference
} from './jwwImage'
import { jwwPaperSize } from './jwwPaper'

/**
 * The subset of the `ezjww` module API used for conversion. Accepting it as a
 * parameter keeps this module free of the wasm import, so the same code runs
 * in the parser worker, on the main thread and in Node tests.
 */
export interface EzjwwApi {
  detectFileFormat(input: Uint8Array): unknown
  readDocument(input: Uint8Array): JwwDocument
  readJwcDocument(input: Uint8Array): JwcDocument
  readDxfDocument(
    input: Uint8Array,
    options?: {
      explodeInserts?: boolean
      jwcCoordinates?: 'paper_millimeters' | 'model_millimeters'
    }
  ): DxfDocument
}

/**
 * How paper millimetres (JWW coordinates) become drawing units.
 *
 * - `drawing`: everything is multiplied by the scale of the main layer group
 *   (the one with the most entities). The drawing looks as it does on paper
 *   in Jw_cad and the main drawing measures in real millimetres.
 * - `layer-group`: each entity uses the scale of its own layer group, like
 *   Jw_cad's DXF export. Every group measures correctly, but groups with
 *   different scales (e.g. a 1/1 title block) no longer line up.
 * - `paper`: no scaling; units are paper millimetres.
 */
export type JwwScaleMode = 'drawing' | 'layer-group' | 'paper'

/** Options of {@link convertJwwToDxf}. */
export interface JwwConversionOptions {
  /** @default 'drawing' */
  scaleMode?: JwwScaleMode
}

/** Result of {@link convertJwwToDxf}. */
export interface JwwConversionResult {
  /** ASCII DXF (AC1024, UTF-8), in millimetres. */
  dxf: string
  /** Entity types ezjww could not convert, as reported by ezjww. */
  unsupportedEntities: string[]
  /**
   * Image files stored in the JWW. `IMAGE` entities in {@link dxf} name them
   * by file name; other images are referenced by their original path.
   */
  images: JwwImageFile[]
  /** Parts of the drawing that were converted only approximately. */
  warnings: string[]
  /**
   * Trimmed parts of non-BMP images still to be cut out (they need the
   * browser's image decoder); {@link cropJwwImages} adds them to `images`.
   */
  imageCrops?: JwwImageCrop[]
}

/** Text style used when a JWW text record names no font (and for JWC). */
const DEFAULT_FONT = 'ＭＳ ゴシック'

/**
 * Metrics of the bundled BIZ UD fonts that replace ＭＳ ゴシック / ＭＳ 明朝
 * (`resources/cad-data/fonts`), as fractions of the em.
 *
 * Jw_cad's text height is the height of the character cell (the em of a
 * full-width character), but the renderer scales TrueType fonts so that the
 * DXF text height equals the height of a capital "A". Without correction
 * Japanese text is drawn about 1.27 times too large.
 */
const TEXT_FONT_METRICS = {
  // bizudgothic / bizudpgothic: em 2048, "A" 1617, descender 246
  gothic: { capHeight: 1617 / 2048, descender: 246 / 2048 },
  // bizudmincho / bizudpmincho: em 2048, "A" 1587, descender 246
  mincho: { capHeight: 1587 / 2048, descender: 246 / 2048 }
}

/**
 * DXF rotation (degrees) of a JWW text.
 *
 * Jw_cad 縦字 uses a Windows vertical font (`@ＭＳ ゴシック`), which the
 * viewer draws vertically along the text rotation like AutoCAD does. Such a
 * text must therefore be rotated along the string, which runs from the start
 * point to the end point (downwards for 縦字 at 0°), not by the angle of the
 * characters.
 */
function jwwTextRotation(e: EzDxfEntity, font: string) {
  const rotation = typeof e.rotation === 'number' ? e.rotation : 0
  if (!font.trim().startsWith('@')) return rotation
  const dx = Number(e.end_x) - Number(e.x)
  const dy = Number(e.end_y) - Number(e.y)
  if (!(Math.hypot(dx, dy) > 1e-9)) return (((rotation - 90) % 360) + 360) % 360
  const degrees = (Math.atan2(dy, dx) * 180) / Math.PI
  return ((degrees % 360) + 360) % 360
}

/** Metrics of the font the viewer substitutes for a Jw_cad font name. */
export function jwwTextFontMetrics(font: string) {
  return /明朝|mincho/i.test(font)
    ? TEXT_FONT_METRICS.mincho
    : TEXT_FONT_METRICS.gothic
}

/** Linetype patterns ezjww references without defining them (paper mm). */
const BUILTIN_LINE_TYPES: Record<string, [string, number[]]> = {
  CONTINUOUS: ['Solid line', []],
  DASHED: ['Dashed line', [0.6, -0.3]],
  DASHED2: ['Dashed line x2', [1.2, -0.6]],
  DASHDOT: ['Dash dot', [0.6, -0.2, 0.1, -0.2]],
  DASHDOT2: ['Dash dot x2', [1.2, -0.4, 0.2, -0.4]],
  CENTER: ['Center line', [1.25, -0.25, 0.25, -0.25]],
  CENTER2: ['Center line x2', [2.5, -0.5, 0.5, -0.5]],
  DOT: ['Dotted line', [0.1, -0.1]],
  DOT2: ['Dotted line x2', [0.2, -0.2]]
}

/** One entity of ezjww's `readDxfDocument` output (fields vary by type). */
interface EzDxfEntity {
  type: string
  layer: string
  color: number
  line_type: string
  line_weight?: number
  [key: string]: unknown
}

/**
 * What the writer needs from a JWW or JWC header and its entities, on top of
 * ezjww's DXF conversion. Both formats store paper millimetres with the
 * origin at the centre of the sheet.
 */
interface JwSource {
  groups: {
    name: string
    scale: number
    hidden: boolean
    locked: boolean
    layers: { name: string; hidden: boolean; locked: boolean }[]
  }[]
  paper?: { width: number; height: number }
  writeGroup: number
  /** Layer group of each top-level entity (to find the main scale). */
  entityGroups: number[]
  /** Fonts of text records (JWC stores none). */
  texts: { content: unknown; x: unknown; y: unknown; font?: string }[]
  /** Image files stored in the drawing (JWC stores none). */
  images: JwwImageFile[]
}

function jwwSource(jww: JwwDocument): JwSource {
  const header = jww.header
  return {
    groups: header.layer_groups.map(group => ({
      name: group.name ?? '',
      scale: group.scale,
      hidden: group.state === 0,
      locked: group.protect !== 0,
      layers: group.layers.map(layer => ({
        name: layer.name ?? '',
        hidden: layer.state === 0,
        locked: layer.protect !== 0
      }))
    })),
    paper: jwwPaperSize(header.paper_size),
    writeGroup: header.write_layer_group ?? 0,
    entityGroups: jww.entities.map(e => e.base?.layer_group ?? 0),
    texts: [
      ...jww.entities,
      ...(jww.block_defs ?? []).flatMap(def => def.entities ?? [])
    ]
      .filter(e => e.type === 'TEXT')
      .map(e => ({
        content: e.content,
        x: e.start_x,
        y: e.start_y,
        font: e.font_name
      })),
    images: decodeJwwImages(jww.images ?? [])
  }
}

const JWC_PAPERS = ['A0', 'A1', 'A2', 'A3', 'A4']

function jwcSource(jwc: JwcDocument): JwSource {
  const header = jwc.header
  return {
    groups: header.layer_groups.map(group => ({
      name: group.name?.text ?? '',
      scale: group.scale,
      hidden: !group.state.visible,
      locked: group.state.protected,
      layers: group.layers.map(layer => ({
        name: layer.name?.text ?? '',
        hidden: !layer.state.visible,
        locked: layer.state.protected
      }))
    })),
    paper: jwwPaperSize(JWC_PAPERS.indexOf(header.paper)),
    writeGroup: header.write_layer_group ?? 0,
    entityGroups: jwc.entities
      .filter(e => e.type !== 'temporary_point')
      .map(e => ('attributes' in e ? e.attributes.layer : e.layer).group),
    texts: [],
    images: []
  }
}

interface LayerInfo {
  /** DXF layer name written to the drawing. */
  name: string
  group: number
  frozen: boolean
  locked: boolean
}

/**
 * Converts a Jw_cad file (JWW, or the older JWC) to DXF text that the native
 * DXF converter can read.
 *
 * Geometry, pen colors, line types and blocks come from ezjww. On top of that
 * this function:
 * - converts paper millimetres to real-world millimetres with the layer group
 *   scale (see {@link JwwScaleMode});
 * - names layers `<group>-<layer> <group name> - <layer name>` (hex numbers as
 *   in Jw_cad) and only writes layers that are used;
 * - writes the sheet as `$LIMMIN` / `$LIMMAX` so "drawing limits" shows the
 *   paper;
 * - keeps the font of each text as a text style (ＭＳ ゴシック etc.).
 */
export function convertJwwToDxf(
  ez: EzjwwApi,
  data: Uint8Array,
  options: JwwConversionOptions = {}
): JwwConversionResult {
  const format = ez.detectFileFormat(data)
  let source: JwSource
  if (format === 'jww') {
    source = jwwSource(ez.readDocument(data))
  } else if (format === 'jwc') {
    source = jwcSource(ez.readJwcDocument(data))
  } else {
    throw new Error(
      `Not a JWW / JWC (Jw_cad) file: detected format '${String(format ?? 'unknown')}'`
    )
  }
  const dxfDoc = ez.readDxfDocument(data, {
    explodeInserts: false,
    jwcCoordinates: 'paper_millimeters'
  })
  const writer = new JwwDxfWriter(
    source,
    dxfDoc,
    options.scaleMode ?? 'drawing'
  )
  return {
    dxf: writer.write(),
    unsupportedEntities: [...(dxfDoc.unsupported_entities ?? [])],
    images: [...source.images, ...writer.trimmedImages],
    warnings: writer.warnings,
    ...(writer.imageCrops.length > 0 ? { imageCrops: writer.imageCrops } : {})
  }
}

/**
 * Cuts out the trimmed parts of non-BMP images that {@link convertJwwToDxf}
 * left in `imageCrops`. Where the browser cannot do it, the whole image is
 * used (shown stretched over the trimmed frame) and a warning is added.
 */
export async function cropJwwImages(
  result: JwwConversionResult
): Promise<JwwConversionResult> {
  const { imageCrops = [], ...rest } = result
  if (imageCrops.length === 0) return rest
  const images = [...rest.images]
  const warnings = [...rest.warnings]
  for (const crop of imageCrops) {
    const data = await cropJwwImage(crop)
    if (!data) {
      const warning =
        'Some trimmed images could not be cut out and are shown whole'
      if (!warnings.includes(warning)) warnings.push(warning)
    }
    images.push({ name: crop.name, data: data ?? crop.source })
  }
  return { ...rest, images, warnings }
}

/**
 * Rebuilds ezjww's layer naming (`layer_name_map` in ezjww-core `dxf.rs`) so
 * that each DXF layer name it emits can be traced back to its JWW / JWC layer
 * group and layer number.
 */
export function ezjwwLayerNames(header: {
  layer_groups: { layers: { name: string }[] }[]
}): Map<string, [number, number]> {
  const result = new Map<string, [number, number]>()
  const used = new Set<string>(['0'])
  header.layer_groups.forEach((group, g) => {
    group.layers.forEach((layer, l) => {
      const fallback = `${hex(g)}-${hex(l)}`
      const candidate = sanitizeEzjwwName(layer.name, fallback)
      const name = uniqueName(candidate, `_${fallback}`, used)
      result.set(name, [g, l])
    })
  })
  return result
}

/**
 * Matches a layer group name that only repeats the group number, such as
 * "Group0" or "Group A" (written by converters and some templates).
 */
export function isDefaultJwwGroupName(name: string, group: number) {
  const match = /^group\s*([0-9a-f]+)$/i.exec(name.trim())
  if (!match) return false
  return (
    match[1] === String(group) ||
    match[1].toUpperCase() === hex(group)
  )
}

/**
 * The part of a JWW layer name after "G-L ":
 * - "<group> - <layer>" when both are named,
 * - "<layer>" when only the layer is named,
 * - "<group> -" when only the group is named,
 * - "" when neither is named.
 * Names that only repeat the numbers ("Group0", layer "0-1") count as unnamed.
 * `jwwExport.ts` parses this back (`parseJwwLayerLabel`).
 */
export function jwwLayerLabel(
  group: number,
  layer: number,
  groupName: string,
  layerName: string
) {
  const groupLabel = isDefaultJwwGroupName(groupName, group)
    ? ''
    : tableName(groupName)
  const layerLabel =
    layerName.trim().toUpperCase() === `${hex(group)}-${hex(layer)}`
      ? ''
      : tableName(layerName)
  if (groupLabel && layerLabel) return `${groupLabel} - ${layerLabel}`
  if (groupLabel) return `${groupLabel} -`
  return layerLabel
}

/** Inverse of `jwwLayerLabel`. */
export function parseJwwLayerLabel(label: string): {
  group?: string
  layer?: string
} {
  const split = label.indexOf(' - ')
  if (split >= 0) {
    return {
      group: label.slice(0, split) || undefined,
      layer: label.slice(split + 3) || undefined
    }
  }
  if (label.endsWith(' -')) return { group: label.slice(0, -2) || undefined }
  return { layer: label || undefined }
}

function hex(value: number) {
  return value.toString(16).toUpperCase()
}

function sanitizeEzjwwName(raw: string, fallback: string) {
  let name = Array.from(raw.trim())
    .slice(0, 255)
    .map(ch => (/\p{Cc}/u.test(ch) || '<>/\\":;?*|='.includes(ch) ? '_' : ch))
    .join('')
  if (name.replace(/^_+|_+$/g, '').trim() === '') {
    name = fallback
  }
  return name
}

function uniqueName(candidate: string, suffix: string, used: Set<string>) {
  if (!used.has(candidate)) {
    used.add(candidate)
    return candidate
  }
  const take = (s: string, n: number) => Array.from(s).slice(0, n).join('')
  let unique = take(candidate, 255 - Array.from(suffix).length) + suffix
  let collision = 2
  while (used.has(unique)) {
    const numbered = `${suffix}_${collision}`
    unique = take(candidate, 255 - Array.from(numbered).length) + numbered
    collision++
  }
  used.add(unique)
  return unique
}

/** Makes a string safe for a DXF symbol table name. */
function tableName(raw: string) {
  return raw
    .replace(/[\p{Cc}<>/\\":;?*|=]/gu, '_')
    .trim()
    .slice(0, 255)
}

/** Makes a string safe for a single-line DXF group value. */
function oneLine(value: string) {
  return value.replace(/[\r\n]+/g, ' ')
}

function fmt(value: unknown) {
  const n = typeof value === 'number' && Number.isFinite(value) ? value : 0
  // Avoid exponent notation, which some DXF readers reject.
  return Math.abs(n) < 1e-12 ? '0.0' : String(Number(n.toFixed(10)))
}

class JwwDxfWriter {
  private out: string[] = []
  private handle = 0x10
  private readonly layersByEzName = new Map<string, LayerInfo>()
  private readonly usedLayers = new Map<string, LayerInfo>()
  private readonly groupScales: number[]
  private readonly mainScale: number
  private readonly fontsByText = new Map<string, string[]>()
  private readonly styles = new Map<string, string>()
  private readonly textWidths: number[]
  private textWidthIndex = 0
  private readonly blockRecords = new Map<string, string>()
  /** Image path → IMAGEDEF handle. */
  private readonly imageDefs = new Map<string, string>()
  /** Trimmed parts of embedded images, cut out as their own image files. */
  readonly trimmedImages: JwwImageFile[] = []
  /** Trimmed parts of other embedded images, cut out later. */
  readonly imageCrops: JwwImageCrop[] = []
  /** Embedded image key + trimmed part → trimmed image name. */
  private readonly trimmedNames = new Map<string, string>()
  readonly warnings: string[] = []

  constructor(
    private readonly source: JwSource,
    private readonly dxf: DxfDocument,
    private readonly scaleMode: JwwScaleMode
  ) {
    this.groupScales = source.groups.map(group =>
      Number.isFinite(group.scale) && group.scale > 0 ? group.scale : 1
    )
    this.mainScale = scaleMode === 'paper' ? 1 : this.findMainScale()

    for (const [ezName, [g, l]] of ezjwwLayerNames({
      layer_groups: source.groups
    })) {
      const group = source.groups[g]
      const layer = group.layers[l]
      const label = jwwLayerLabel(g, l, group.name, layer.name)
      this.layersByEzName.set(ezName, {
        name: tableName(`${hex(g)}-${hex(l)}${label ? ` ${label}` : ''}`),
        group: g,
        frozen: layer.hidden || group.hidden,
        locked: layer.locked || group.locked
      })
    }

    for (const text of source.texts) {
      const key = textKey(text.content, text.x, text.y)
      const fonts = this.fontsByText.get(key)
      const font = text.font?.trim() || DEFAULT_FONT
      if (fonts) fonts.push(font)
      else this.fontsByText.set(key, [font])
    }
    this.styles.set(DEFAULT_FONT, 'STANDARD')
    this.textWidths =
      (dxf as DxfDocument & { text_width_factors?: number[] })
        .text_width_factors ?? []
  }

  write() {
    // Entities are converted first so that the tables only list what is used.
    const blocks = (this.dxf.blocks ?? []).map(block => {
      this.blockRecords.set(block.name, this.nextHandle())
      const body = this.capture(() => {
        for (const entity of block.entities as unknown as EzDxfEntity[]) {
          this.writeEntity(entity, 1)
        }
      })
      return { block, body }
    })
    const entities = this.capture(() => {
      for (const entity of this.dxf.entities as unknown as EzDxfEntity[]) {
        this.writeEntity(entity, this.scaleOf(entity.layer))
      }
    })

    this.writeHeader()
    this.section('TABLES')
    this.writeLineTypes()
    this.writeLayers()
    this.writeStyles()
    this.writeBlockRecords()
    this.pair(0, 'ENDSEC')

    this.section('BLOCKS')
    this.writeBlockBegin('*Model_Space', 0, 0)
    this.writeBlockEnd()
    this.writeBlockBegin('*Paper_Space', 0, 0)
    this.writeBlockEnd()
    for (const { block, body } of blocks) {
      this.writeBlockBegin(block.name, block.base_x, block.base_y)
      this.out.push(body)
      this.writeBlockEnd()
    }
    this.pair(0, 'ENDSEC')

    this.section('ENTITIES')
    this.out.push(entities)
    this.pair(0, 'ENDSEC')
    this.writeObjects()
    this.pair(0, 'EOF')
    return this.out.join('')
  }

  /** Scale of the layer group with the most entities (the main drawing). */
  private findMainScale() {
    const counts = new Map<number, number>()
    for (const g of this.source.entityGroups) {
      counts.set(g, (counts.get(g) ?? 0) + 1)
    }
    let best = this.source.writeGroup
    let bestCount = -1
    for (const [g, count] of counts) {
      if (count > bestCount) {
        best = g
        bestCount = count
      }
    }
    return this.groupScales[best] ?? 1
  }

  private scaleOf(ezLayer: string) {
    const layer = this.layersByEzName.get(ezLayer)
    return this.scaleMode === 'layer-group' && layer
      ? this.groupScales[layer.group]
      : this.mainScale
  }

  private layerName(ezLayer: string) {
    const layer = this.layersByEzName.get(ezLayer)
    if (!layer) return tableName(ezLayer) || '0'
    this.usedLayers.set(layer.name, layer)
    return layer.name
  }

  private styleFor(content: string, x: number, y: number) {
    const fonts = this.fontsByText.get(textKey(content, x, y))
    const font = fonts?.shift() ?? DEFAULT_FONT
    let style = this.styles.get(font)
    if (!style) {
      style = tableName(font) || `JW_FONT_${this.styles.size}`
      this.styles.set(font, style)
    }
    return { style, font }
  }

  private writeEntity(e: EzDxfEntity, s: number) {
    const n = (key: string) =>
      typeof e[key] === 'number' ? (e[key] as number) : 0
    switch (e.type) {
      case 'LINE':
        this.entityHeader('LINE', e, s)
        this.point(10, n('x1') * s, n('y1') * s)
        this.point(11, n('x2') * s, n('y2') * s)
        break
      case 'CIRCLE':
        this.entityHeader('CIRCLE', e, s)
        this.point(10, n('center_x') * s, n('center_y') * s)
        this.pair(40, fmt(n('radius') * s))
        break
      case 'ARC':
        this.entityHeader('ARC', e, s)
        this.point(10, n('center_x') * s, n('center_y') * s)
        this.pair(40, fmt(n('radius') * s))
        this.pair(50, fmt(n('start_angle')))
        this.pair(51, fmt(n('end_angle')))
        break
      case 'ELLIPSE':
        this.entityHeader('ELLIPSE', e, s)
        this.point(10, n('center_x') * s, n('center_y') * s)
        this.point(11, n('major_axis_x') * s, n('major_axis_y') * s)
        this.pair(40, fmt(n('minor_ratio')))
        this.pair(41, fmt(n('start_param')))
        this.pair(42, fmt(n('end_param')))
        break
      case 'POINT':
        this.entityHeader('POINT', e, s)
        this.point(10, n('x') * s, n('y') * s)
        break
      case 'TEXT': {
        const content = String(e.content ?? '')
        const image = parseJwwImageReference(content)
        if (image) {
          // Keep the per-text width factors aligned with ezjww's texts.
          this.textWidthIndex++
          this.writeImage(
            e,
            s,
            this.imagePath(image),
            image.width,
            image.height
          )
          if (image.hasExtra) {
            this.warnOnce(
              'Image parameters other than trimming (rotation, transparent colour) are ignored'
            )
          }
          break
        }
        const { style, font } = this.styleFor(content, n('x'), n('y'))
        const width =
          this.textWidths[this.textWidthIndex++] ?? (n('width_factor') || 1)
        // The JWW point is the bottom of the character cell; the DXF point
        // is the baseline, one descender above it.
        const metrics = jwwTextFontMetrics(font)
        const cell = n('height')
        const rotation = jwwTextRotation(e, font)
        const angle = (rotation * Math.PI) / 180
        const rise = cell * metrics.descender
        const x = n('x') - Math.sin(angle) * rise
        const y = n('y') + Math.cos(angle) * rise
        this.entityHeader('TEXT', e, s)
        this.point(10, x * s, y * s)
        this.pair(40, fmt(cell * metrics.capHeight * s))
        this.pair(41, fmt(width))
        this.pair(1, oneLine(content))
        this.pair(50, fmt(rotation))
        this.pair(7, style)
        break
      }
      case 'SOLID':
        this.entityHeader('SOLID', e, s)
        this.point(10, n('x1') * s, n('y1') * s)
        this.point(11, n('x2') * s, n('y2') * s)
        // DXF stores SOLID corners in "Z" order: 12 is the 4th corner.
        this.point(12, n('x4') * s, n('y4') * s)
        this.point(13, n('x3') * s, n('y3') * s)
        break
      case 'FILLED_POLYGON': {
        const points = ((e.points as { x: number; y: number }[]) ?? []).filter(
          p => Number.isFinite(p.x) && Number.isFinite(p.y)
        )
        for (let i = 1; i + 1 < points.length; i++) {
          this.entityHeader('SOLID', e, s)
          this.point(10, points[0].x * s, points[0].y * s)
          this.point(11, points[i].x * s, points[i].y * s)
          this.point(12, points[i + 1].x * s, points[i + 1].y * s)
          this.point(13, points[i + 1].x * s, points[i + 1].y * s)
        }
        break
      }
      case 'INSERT':
        this.entityHeader('INSERT', e, s)
        this.pair(2, String(e.block_name ?? ''))
        this.point(10, n('x') * s, n('y') * s)
        this.pair(41, fmt(n('scale_x') * s))
        this.pair(42, fmt(n('scale_y') * s))
        this.pair(43, fmt(s))
        this.pair(50, fmt(n('rotation')))
        break
      default:
        break
    }
  }

  /**
   * Path of the image file a placement shows. A trimmed placement of an
   * embedded image gets the trimmed pixels as an image file of its own (so
   * every renderer and exporter shows just that part): BMPs are cut here,
   * other formats by {@link cropJwwImages}. Trimmed images that are not
   * embedded are shown whole, stretched over the trimmed frame.
   */
  private imagePath(image: JwwImageReference) {
    const trim = image.trim
    if (!trim) return image.path
    const key = jwwImageKey(image.path)
    const file = this.source.images.find(f => jwwImageKey(f.name) === key)
    if (!file) {
      this.warnOnce(
        'Trimming of images not stored in the drawing is not supported; they are shown whole'
      )
      return image.path
    }
    const base = jwwImageDisplayPath(image.path).replace(/\.[^.\\/]*$/, '')
    const size = bmpSize(file.data)
    if (size) {
      const rect = jwwTrimPixelRect(image, trim, size.width, size.height)
      const data = rect && cropBmp(file.data, rect)
      if (!rect || !data) return image.path
      const id = `${key}|${rect.x},${rect.y},${rect.width},${rect.height}`
      return `%temp%${this.trimmedName(id, base, '.bmp', name =>
        this.trimmedImages.push({ name, data })
      )}`
    }
    // Other formats: the pixel size is known only once the image is decoded.
    const ratio = image.height / image.width
    const id = `${key}|${trim.left},${trim.bottom},${trim.width},${ratio}`
    const ext =
      imageMimeType(file.data, file.name) === 'image/jpeg' ? '.jpg' : '.png'
    return `%temp%${this.trimmedName(id, base, ext, name =>
      this.imageCrops.push({ name, source: file.data, reference: image, trim })
    )}`
  }

  /** Name of a trimmed image; `add` stores it the first time `id` is seen. */
  private trimmedName(
    id: string,
    base: string,
    ext: string,
    add: (name: string) => void
  ) {
    let name = this.trimmedNames.get(id)
    if (!name) {
      name = `${base}~trim${this.trimmedNames.size + 1}${ext}`
      this.trimmedNames.set(id, name)
      add(name)
    }
    return name
  }

  /**
   * Writes a `^@BM` image placement: lower-left corner at the text point,
   * width × height paper millimetres along the text angle. The pixel size is
   * left at 1 × 1 so the U / V vectors carry the whole extent.
   */
  private writeImage(
    e: EzDxfEntity,
    s: number,
    path: string,
    width: number,
    height: number
  ) {
    const n = (key: string) =>
      typeof e[key] === 'number' ? (e[key] as number) : 0
    const fileName = jwwImageDisplayPath(path)
    let defHandle = this.imageDefs.get(fileName)
    if (!defHandle) {
      defHandle = this.nextHandle()
      this.imageDefs.set(fileName, defHandle)
    }
    const angle = (n('rotation') * Math.PI) / 180
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    this.entityHeader('IMAGE', e, 1)
    this.pair(100, 'AcDbRasterImage')
    this.pair(90, '0')
    this.point(10, n('x') * s, n('y') * s)
    this.point(11, width * cos * s, width * sin * s)
    this.point(12, -height * sin * s, height * cos * s)
    this.pair(13, '1.0')
    this.pair(23, '1.0')
    this.pair(340, defHandle)
    this.pair(70, '3')
    this.pair(280, '0')
    this.pair(281, '50')
    this.pair(282, '50')
    this.pair(283, '0')
  }

  private warnOnce(message: string) {
    if (!this.warnings.includes(message)) this.warnings.push(message)
  }

  private entityHeader(type: string, e: EzDxfEntity, s: number) {
    this.pair(0, type)
    this.pair(5, this.nextHandle())
    if (type === 'IMAGE') this.pair(100, 'AcDbEntity')
    this.pair(8, this.layerName(e.layer))
    this.pair(6, e.line_type || 'BYLAYER')
    this.pair(62, String(e.color ?? 256))
    if (typeof e.line_weight === 'number' && e.line_weight >= 0) {
      this.pair(370, String(e.line_weight))
    }
    // Line type records are in drawing units of the main scale (like the
    // standard line types added later), so only entities drawn at another
    // scale (other layer groups, block contents) need a line type scale.
    const ltScale = s / this.mainScale
    if (ltScale !== 1 && type !== 'INSERT' && type !== 'IMAGE') {
      this.pair(48, fmt(ltScale))
    }
  }

  private writeHeader() {
    this.section('HEADER')
    this.variable('$ACADVER', 1, 'AC1024')
    this.variable('$HANDSEED', 5, 'FFFFFFFF')
    this.variable('$DWGCODEPAGE', 3, 'ANSI_1252')
    this.variable('$MEASUREMENT', 70, '1')
    this.variable('$INSUNITS', 70, '4')
    this.variable('$TEXTSTYLE', 7, 'STANDARD')
    this.variable('$CLAYER', 8, '0')
    this.variable('$CELTYPE', 6, 'BYLAYER')
    this.variable('$CECOLOR', 62, '256')
    const paper = this.source.paper
    if (paper) {
      const hw = (paper.width / 2) * this.mainScale
      const hh = (paper.height / 2) * this.mainScale
      this.pair(9, '$LIMMIN')
      this.pair(10, fmt(-hw))
      this.pair(20, fmt(-hh))
      this.pair(9, '$LIMMAX')
      this.pair(10, fmt(hw))
      this.pair(20, fmt(hh))
    }
    this.pair(0, 'ENDSEC')
  }

  private writeLineTypes() {
    const defined = new Map(
      (this.dxf.line_types ?? []).map(lt => [lt.name, lt] as const)
    )
    const names = new Set(['BYBLOCK', 'BYLAYER', 'CONTINUOUS'])
    const collect = (entities: EzDxfEntity[]) => {
      for (const e of entities) if (e.line_type) names.add(e.line_type)
    }
    collect(this.dxf.entities as unknown as EzDxfEntity[])
    for (const block of this.dxf.blocks ?? []) {
      collect(block.entities as unknown as EzDxfEntity[])
    }
    this.table('LTYPE', names.size)
    for (const name of names) {
      const def = defined.get(name)
      const [description, paperPattern] = def
        ? [def.description, def.pattern]
        : (BUILTIN_LINE_TYPES[name] ?? ['', []])
      // Patterns are paper millimetres; records hold them in drawing units.
      const pattern = paperPattern.map(v => v * this.mainScale)
      this.pair(0, 'LTYPE')
      this.pair(5, this.nextHandle())
      this.pair(100, 'AcDbSymbolTableRecord')
      this.pair(100, 'AcDbLinetypeTableRecord')
      this.pair(2, name)
      this.pair(70, '0')
      this.pair(3, oneLine(description))
      this.pair(72, '65')
      this.pair(73, String(pattern.length))
      this.pair(40, fmt(pattern.reduce((sum, v) => sum + Math.abs(v), 0)))
      for (const value of pattern) {
        this.pair(49, fmt(value))
        this.pair(74, '0')
      }
    }
    this.pair(0, 'ENDTAB')
  }

  private writeLayers() {
    const layers = [...this.usedLayers.values()].sort((a, b) =>
      a.name.localeCompare(b.name)
    )
    this.table('LAYER', layers.length + 1)
    this.writeLayer('0', 7, 0)
    for (const layer of layers) {
      const flags = (layer.frozen ? 1 : 0) | (layer.locked ? 4 : 0)
      this.writeLayer(layer.name, 7, flags)
    }
    this.pair(0, 'ENDTAB')
  }

  private writeLayer(name: string, color: number, flags: number) {
    this.pair(0, 'LAYER')
    this.pair(5, this.nextHandle())
    this.pair(100, 'AcDbSymbolTableRecord')
    this.pair(100, 'AcDbLayerTableRecord')
    this.pair(2, name)
    this.pair(70, String(flags))
    this.pair(62, String(color))
    this.pair(6, 'CONTINUOUS')
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
      this.pair(1000, oneLine(font))
      this.pair(1071, '0')
    }
    this.pair(0, 'ENDTAB')
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
      this.pair(3, `JW_IMAGE_${handle}`)
      this.pair(350, handle)
    }
    for (const [fileName, handle] of this.imageDefs) {
      this.pair(0, 'IMAGEDEF')
      this.pair(5, handle)
      this.pair(330, dict)
      this.pair(100, 'AcDbRasterImageDef')
      this.pair(90, '0')
      this.pair(1, oneLine(fileName))
      this.pair(10, '1.0')
      this.pair(20, '1.0')
      this.pair(11, '1.0')
      this.pair(21, '1.0')
      this.pair(280, '1')
      this.pair(281, '0')
    }
    this.pair(0, 'ENDSEC')
  }

  private writeBlockRecords() {
    const records: [string, string][] = [
      ['*Model_Space', this.nextHandle()],
      ['*Paper_Space', this.nextHandle()],
      ...this.blockRecords
    ]
    this.table('BLOCK_RECORD', records.length)
    for (const [name, handle] of records) {
      this.pair(0, 'BLOCK_RECORD')
      this.pair(5, handle)
      this.pair(100, 'AcDbSymbolTableRecord')
      this.pair(100, 'AcDbBlockTableRecord')
      this.pair(2, name)
    }
    this.pair(0, 'ENDTAB')
  }

  private writeBlockBegin(name: string, x: number, y: number) {
    this.pair(0, 'BLOCK')
    this.pair(5, this.nextHandle())
    this.pair(100, 'AcDbEntity')
    this.pair(8, '0')
    this.pair(100, 'AcDbBlockBegin')
    this.pair(2, name)
    this.pair(70, '0')
    this.point(10, x, y)
    this.pair(3, name)
    this.pair(1, '')
  }

  private writeBlockEnd() {
    this.pair(0, 'ENDBLK')
    this.pair(5, this.nextHandle())
    this.pair(100, 'AcDbEntity')
    this.pair(8, '0')
    this.pair(100, 'AcDbBlockEnd')
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

  private point(code: number, x: number, y: number) {
    this.pair(code, fmt(x))
    this.pair(code + 10, fmt(y))
    this.pair(code + 20, '0.0')
  }

  private pair(code: number, value: string) {
    this.out.push(`${code}\n${value}\n`)
  }

  private nextHandle() {
    return (this.handle++).toString(16).toUpperCase()
  }

  /** Runs `fn` and returns what it wrote instead of appending it. */
  private capture(fn: () => void) {
    const saved = this.out
    this.out = []
    fn()
    const text = this.out.join('')
    this.out = saved
    return text
  }
}

function textKey(content: unknown, x: unknown, y: unknown) {
  return `${String(content)}\u0000${Number(x)}\u0000${Number(y)}`
}
