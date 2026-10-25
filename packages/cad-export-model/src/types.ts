/**
 * Format-neutral 2D drawing that the JWW and SXF writers consume.
 *
 * Everything is flattened into model space: block references are expanded,
 * dimensions, leaders, splines and other complex entities are reduced to the
 * lines, curves, text and fills they draw. Coordinates are real-world
 * millimetres (the drawing units converted with `$INSUNITS`).
 *
 * The structure is deliberately plain data (JSON-serializable apart from
 * image bytes) so that a future command-line converter can produce or consume
 * the same model.
 */

export type Vec2 = [number, number]
export type Rgb = [number, number, number]

export interface ExportStyle {
  /** Layer name as in the drawing. */
  layer: string
  /** Resolved colour. */
  color: Rgb
  /**
   * True for ACI 7 (white on dark, black on light backgrounds) and for pure
   * black / white: writers map it to their "default ink" colour.
   */
  foreground: boolean
  /** Resolved line type name, upper-case. `CONTINUOUS` for solid lines. */
  lineType: string
  /**
   * Dash pattern in model millimetres (positive = dash, negative = gap,
   * 0 = dot), including the global and entity line type scales. Empty for
   * solid lines.
   */
  lineTypePattern: number[]
  /** Printed line width in millimetres, 0 when not specified. */
  lineWeight: number
}

/**
 * Circle, ellipse or an arc of either: `center + u·cos(t) + v·sin(t)` for `t`
 * from `start` to `end` (radians, `start < end`, counter-clockwise when
 * `u × v > 0`). `u` and `v` are conjugate semi-diameters; use
 * {@link principalCurve} to get the axes.
 */
export interface ExportCurve {
  center: Vec2
  u: Vec2
  v: Vec2
  start: number
  end: number
}

interface EntityBase {
  style: ExportStyle
}

/** Open or closed polyline; a two-point open polyline is a line. */
export interface ExportPolyline extends EntityBase {
  kind: 'polyline'
  points: Vec2[]
  closed: boolean
}

export interface ExportCurveEntity extends EntityBase {
  kind: 'curve'
  curve: ExportCurve
}

/** Single-line text. */
export interface ExportText extends EntityBase {
  kind: 'text'
  text: string
  /** Left end of the baseline. */
  position: Vec2
  /** DXF text height: the height of a capital letter. */
  height: number
  /** Width factor (1 = the font's natural width). */
  widthFactor: number
  /** Direction of the baseline, radians. */
  rotation: number
  /** Oblique angle, radians. */
  oblique: number
  /**
   * Font family (TrueType family or SHX file name of the text style). A
   * leading `@` marks a Windows vertical font.
   */
  font: string
  /** Vertical text (AutoCAD vertical text style). */
  vertical: boolean
}

export interface ExportPoint extends EntityBase {
  kind: 'point'
  position: Vec2
}

/** Solid fill; loops use the even-odd rule (holes are inner loops). */
export interface ExportFill extends EntityBase {
  kind: 'fill'
  loops: Vec2[][]
}

/**
 * Raster image: the parallelogram `origin + a·u + b·v` (0 ≤ a, b ≤ 1) with
 * the lower-left corner of the picture at `origin`.
 */
export interface ExportImage extends EntityBase {
  kind: 'image'
  origin: Vec2
  u: Vec2
  v: Vec2
  /** File name (no directories). */
  fileName: string
  /** Image file bytes, when the drawing has them (see {@link resolveExportImages}). */
  data?: Uint8Array
  mimeType?: string
  /** The image as the viewer holds it, until it is read into {@link data}. */
  blob?: Blob
}

export type ExportEntity =
  | ExportPolyline
  | ExportCurveEntity
  | ExportText
  | ExportPoint
  | ExportFill
  | ExportImage

export interface ExportLayer {
  name: string
  color: Rgb
  foreground: boolean
  /** Off or frozen. */
  hidden: boolean
  locked: boolean
}

export type ExportPaperName = 'A0' | 'A1' | 'A2' | 'A3' | 'A4'

/**
 * The sheet the drawing is laid out on. Model millimetres `m` map to paper
 * millimetres `p = (m − origin) / scale` with the sheet's lower-left corner
 * at paper (0, 0).
 */
export interface ExportSheet {
  paper: ExportPaperName
  /** True when the sheet is taller than wide. */
  portrait: boolean
  /** Paper width and height in millimetres (orientation applied). */
  width: number
  height: number
  /** Scale denominator (100 for 1:100). */
  scale: number
  /** Model millimetres at the lower-left corner of the sheet. */
  origin: Vec2
}

export interface ExportDrawing {
  /** Drawing title (file name without extension). */
  title: string
  layers: ExportLayer[]
  entities: ExportEntity[]
  sheet: ExportSheet
  /** Parts of the drawing that could only be exported approximately. */
  warnings: string[]
}
