import type {
  AcDbEntityProperties,
  AcDbEntityPropertyType,
  AcDbEntityRuntimeProperty
} from '@mlightcad/data-model'

/**
 * Pure helpers behind the property inspector (`MlEntityProperties.vue`).
 *
 * They turn the `properties` of the selected entities into the rows shown in
 * the right sidebar (common rows with a "mixed" flag, symbol properties,
 * per-type counts, totals) and compute the transform for the "Selection"
 * section. Nothing here touches the database, so it can be unit tested.
 */

/** Group that holds block attributes in `AcDbBlockReference.properties`. */
export const ATTRIBUTE_GROUP = 'attribute'
/** Inspector-only group: position / rotation / scale of symbols. */
export const PLACEMENT_GROUP = 'placement'
/** Inspector-only group: symbol name. */
export const SYMBOL_GROUP = 'symbol'
/** Inspector-only group: rarely used values (Z, normal…) of symbols. */
export const ADVANCED_GROUP = 'advanced'

const SYMBOL_PLACEMENT_PROPS = [
  'positionX',
  'positionY',
  'rotation',
  'scaleFactorsX',
  'scaleFactorsY'
]
const SYMBOL_NAME_PROPS = ['blockName']

/**
 * Float properties stored in radians that the inspector shows in degrees.
 * Only names known to be radians in `@mlightcad/data-model` are listed.
 */
const RADIAN_PROPS = new Set(['rotation', 'startAngle', 'endAngle'])
const RADIAN_TYPES = new Set([
  'Arc',
  'BlockReference',
  'Ellipse',
  'MText',
  'RasterImage',
  'Shape',
  'Text'
])

/** One row of the inspector, shared by every selected entity. */
export interface MlInspectorRow {
  /** Unique key: `<source group>.<name>`. */
  key: string
  /** Group the row is shown in (may differ from `sourceGroup`). */
  groupName: string
  /** Group of the property in `entity.properties` (used for edits). */
  sourceGroup: string
  name: string
  type: AcDbEntityPropertyType
  options?: { label: string; value: unknown }[]
  editable: boolean
  skipTranslation?: boolean
  /** `true` when the selected entities do not share the same value. */
  mixed: boolean
  /** Value of the first entity (display value; degrees for angle rows). */
  value: unknown
  /** Set when the stored value is radians and the row shows degrees. */
  unit?: 'degree'
  /** Accessor of the property when only one entity is selected. */
  property?: AcDbEntityRuntimeProperty
}

export interface MlInspectorGroup {
  groupName: string
  rows: MlInspectorRow[]
}

/**
 * Returns a comparable key for a property value. Colors and transparency are
 * objects, so `===` would always report them as different.
 */
export function inspectorValueKey(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(Math.round(value * 1e9) / 1e9) : ''
  }
  if (typeof value === 'object') {
    const obj = value as { toString?: () => string }
    if (
      typeof obj.toString === 'function' &&
      obj.toString !== Object.prototype.toString
    ) {
      return obj.toString()
    }
    try {
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  }
  return String(value)
}

function readProperty(prop: AcDbEntityRuntimeProperty): unknown {
  try {
    return prop.accessor.get()
  } catch {
    return undefined
  }
}

function findProperty(
  props: AcDbEntityProperties,
  groupName: string,
  name: string
): AcDbEntityRuntimeProperty | undefined {
  return props.groups
    .find(group => group.groupName === groupName)
    ?.properties.find(prop => prop.name === name)
}

/** Whether a float row stores radians and should be shown in degrees. */
export function isRadianProperty(entityType: string, name: string): boolean {
  return RADIAN_PROPS.has(name) && RADIAN_TYPES.has(entityType)
}

export function radToDeg(value: number) {
  return (value * 180) / Math.PI
}

export function degToRad(value: number) {
  return (value * Math.PI) / 180
}

/** How a float property is rounded for display. */
export type MlNumberKind = 'length' | 'angle' | 'plain'

/** Ratios, scale factors and directions: no unit, so not rounded to LUPREC. */
const PLAIN_NUMBER = /scale|factor|ratio|^normal|unitDir/i

/**
 * Classifies a float row: angles follow the drawing's angle precision
 * (AUPREC), lengths and coordinates its linear precision (LUPREC), and
 * unitless values keep up to 6 decimals (rounding a scale of 0.5 to the
 * drawing's precision could show 1).
 */
export function numberKind(row: Pick<MlInspectorRow, 'name' | 'unit'>) {
  if (row.unit === 'degree' || row.name === 'totalAngle') return 'angle'
  if (PLAIN_NUMBER.test(row.name)) return 'plain'
  return 'length'
}

/** Formats a number with at most `decimals` digits, without trailing zeros. */
export function formatInspectorNumber(value: number, decimals = 6) {
  if (!Number.isFinite(value)) return ''
  const rounded = Number(value.toFixed(Math.min(Math.max(decimals, 0), 8)))
  // Avoid "-0".
  return String(rounded === 0 ? 0 : rounded)
}

/**
 * Display group of a property. Symbols get the layout of the plan
 * (General / Placement / Symbol); other entities keep their own groups.
 */
function displayGroup(allSymbols: boolean, group: string, name: string) {
  if (!allSymbols || group !== 'geometry') return group
  if (SYMBOL_PLACEMENT_PROPS.includes(name)) return PLACEMENT_GROUP
  if (SYMBOL_NAME_PROPS.includes(name)) return SYMBOL_GROUP
  return ADVANCED_GROUP
}

const GROUP_ORDER = ['general', PLACEMENT_GROUP, SYMBOL_GROUP]

/**
 * Builds the inspector rows shared by every entity in `list`.
 *
 * - A row is shown when every entity has a property with the same group and
 *   name (so mixed types only show the general group).
 * - `mixed` is set when the values differ.
 * - Attributes (`attribute` group) are left out; see
 *   {@link buildSymbolPropertyRows}.
 * - Array properties (vertices…) are only shown for a single entity.
 */
export function buildInspectorGroups(
  list: AcDbEntityProperties[]
): MlInspectorGroup[] {
  if (!list.length) return []
  const [first] = list
  const single = list.length === 1
  const sameType = list.every(item => item.type === first.type)
  const allSymbols = sameType && first.type === 'BlockReference'
  const groups = new Map<string, MlInspectorRow[]>()

  for (const group of first.groups) {
    if (group.groupName === ATTRIBUTE_GROUP) continue
    for (const prop of group.properties) {
      if (prop.type === 'array' && !single) continue
      // Handles always differ; only show them for a single entity.
      if (prop.name === 'handle' && !single) continue
      const others = list
        .slice(1)
        .map(item => findProperty(item, group.groupName, prop.name))
      if (others.some(other => !other)) continue

      const degree =
        sameType &&
        prop.type === 'float' &&
        isRadianProperty(first.type, prop.name)
      const raw = readProperty(prop)
      const key = inspectorValueKey(raw)
      const mixed = others.some(
        other => inspectorValueKey(readProperty(other!)) !== key
      )
      const value = degree && typeof raw === 'number' ? radToDeg(raw) : raw
      const editable =
        prop.editable !== false &&
        // No editor for transparency yet.
        prop.type !== 'transparency' &&
        (prop.type === 'array' ||
          (!!prop.accessor.set &&
            others.every(
              other => other!.editable !== false && !!other!.accessor.set
            )))

      const groupName = displayGroup(allSymbols, group.groupName, prop.name)
      const rows = groups.get(groupName) ?? []
      rows.push({
        key: `${group.groupName}.${prop.name}`,
        groupName,
        sourceGroup: group.groupName,
        name: prop.name,
        type: prop.type,
        options: prop.options,
        editable,
        skipTranslation: prop.skipTranslation,
        mixed,
        value: mixed ? undefined : value,
        unit: degree ? 'degree' : undefined,
        property: single ? prop : undefined
      })
      groups.set(groupName, rows)
    }
  }

  if (allSymbols) {
    // Keep the plan's order: position, rotation, scale.
    const placement = groups.get(PLACEMENT_GROUP)
    placement?.sort(
      (a, b) =>
        SYMBOL_PLACEMENT_PROPS.indexOf(a.name) -
        SYMBOL_PLACEMENT_PROPS.indexOf(b.name)
    )
  }

  const names = [...groups.keys()].sort((a, b) => {
    const ia = GROUP_ORDER.indexOf(a)
    const ib = GROUP_ORDER.indexOf(b)
    if (a === ADVANCED_GROUP) return 1
    if (b === ADVANCED_GROUP) return -1
    if (ia >= 0 || ib >= 0) {
      return (
        (ia < 0 ? GROUP_ORDER.length : ia) - (ib < 0 ? GROUP_ORDER.length : ib)
      )
    }
    return 0
  })
  return names.map(groupName => ({ groupName, rows: groups.get(groupName)! }))
}

/**
 * Converts a value typed in the inspector into the stored value.
 */
export function toStoredValue(
  row: Pick<MlInspectorRow, 'unit'>,
  value: unknown
) {
  if (row.unit === 'degree' && typeof value === 'number') return degToRad(value)
  return value
}

/* ===================== symbol properties ===================== */

/** Minimal view of an attribute (ATTRIB) used by the inspector. */
export interface MlInspectorAttribute {
  tag: string
  textString: string
  isConst: boolean
  isInvisible: boolean
}

/** Minimal view of a symbol (INSERT) used by the inspector. */
export interface MlInspectorSymbol {
  blockName: string
  attributes: MlInspectorAttribute[]
  /** ATTDEF prompt for a tag ('' when there is none). */
  promptOf(tag: string): string
}

export interface MlSymbolPropertyRow {
  /** Upper-cased tag, used to match attributes across symbols. */
  tagKey: string
  tag: string
  /** Prompt of the definition, or the tag when there is no prompt. */
  label: string
  value: string | undefined
  mixed: boolean
  isConst: boolean
  isInvisible: boolean
}

export function normalizeTag(tag: string) {
  return (tag || '').trim().toUpperCase()
}

/**
 * Builds the "Symbol properties" rows.
 *
 * Only tags present on every symbol are listed (in the order of the first
 * one). Values that differ are reported as `mixed`.
 */
export function buildSymbolPropertyRows(
  symbols: MlInspectorSymbol[]
): MlSymbolPropertyRow[] {
  if (!symbols.length) return []
  const maps = symbols.map(symbol => {
    const map = new Map<string, MlInspectorAttribute>()
    for (const attr of symbol.attributes) {
      const key = normalizeTag(attr.tag)
      if (!map.has(key)) map.set(key, attr)
    }
    return map
  })

  const rows: MlSymbolPropertyRow[] = []
  for (const [tagKey, attr] of maps[0]) {
    const all = maps.map(map => map.get(tagKey))
    if (all.some(item => !item)) continue
    const values = all.map(item => item!.textString ?? '')
    const mixed = values.some(value => value !== values[0])
    const prompt = symbols[0].promptOf(attr.tag).trim()
    rows.push({
      tagKey,
      tag: attr.tag,
      label: prompt || attr.tag,
      value: mixed ? undefined : values[0],
      mixed,
      isConst: all.some(item => item!.isConst),
      isInvisible: all.some(item => item!.isInvisible)
    })
  }
  return rows
}

/* ===================== selection summary ===================== */

/** Minimal view of an entity used for counts and totals. */
export interface MlInspectorMeasurable {
  type: string
  properties: AcDbEntityProperties
  closed?: boolean
  area?: number
}

export interface MlSelectionSummary {
  /** Number of entities per type, most frequent first. */
  types: { type: string; count: number }[]
  /** Sum of curve lengths (lines, arcs, circles, polylines…). */
  totalLength: number
  /** Number of entities that contributed to `totalLength`. */
  lengthCount: number
  /** Sum of the areas of closed shapes and fills. */
  totalArea: number
  /** Number of entities that contributed to `totalArea`. */
  areaCount: number
}

const LENGTH_PROPS = ['length', 'arcLength', 'perimeter']
const AREA_TYPES = new Set(['Circle', 'Ellipse', 'Hatch'])

function readNumber(props: AcDbEntityProperties, name: string) {
  for (const group of props.groups) {
    const prop = group.properties.find(item => item.name === name)
    if (!prop) continue
    const value = readProperty(prop)
    if (typeof value === 'number' && Number.isFinite(value)) return value
  }
  return undefined
}

/**
 * Counts the selected entities per type and sums lengths and areas.
 *
 * Area is only summed for closed shapes (closed polylines, circles, closed
 * ellipses) and fills; an open polyline's "area" is not meaningful.
 */
export function summarizeSelection(
  entities: MlInspectorMeasurable[]
): MlSelectionSummary {
  const counts = new Map<string, number>()
  let totalLength = 0
  let lengthCount = 0
  let totalArea = 0
  let areaCount = 0

  for (const entity of entities) {
    counts.set(entity.type, (counts.get(entity.type) ?? 0) + 1)
    const props = entity.properties

    for (const name of LENGTH_PROPS) {
      const length = readNumber(props, name)
      if (length != null) {
        totalLength += Math.abs(length)
        lengthCount++
        break
      }
    }

    const closedShape =
      entity.type === 'Hatch' ||
      (entity.closed === true &&
        (AREA_TYPES.has(entity.type) || /Polyline$/.test(entity.type)))
    if (closedShape) {
      let area: number | undefined
      try {
        area = entity.area
      } catch {
        area = undefined
      }
      if (typeof area === 'number' && Number.isFinite(area)) {
        totalArea += Math.abs(area)
        areaCount++
      }
    }
  }

  const types = [...counts.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count || a.type.localeCompare(b.type))
  return { types, totalLength, lengthCount, totalArea, areaCount }
}

/* ===================== selection box ===================== */

/** Reference point of the 9-point selector: 0 = left/bottom, 1 = right/top. */
export interface MlAnchor {
  x: 0 | 0.5 | 1
  y: 0 | 0.5 | 1
}

export interface MlBox2d {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

export type MlBoxField = 'x' | 'y' | 'width' | 'height'

/** Values shown in the X / Y / W / H fields for a box and anchor. */
export function boxFields(box: MlBox2d, anchor: MlAnchor) {
  const width = box.maxX - box.minX
  const height = box.maxY - box.minY
  return {
    x: box.minX + width * anchor.x,
    y: box.minY + height * anchor.y,
    width,
    height
  }
}

/** Translation or uniform scale needed to apply one field. */
export type MlBoxTransform =
  | { kind: 'translate'; dx: number; dy: number }
  | { kind: 'scale'; factor: number; baseX: number; baseY: number }

/**
 * Returns the transform that makes `field` equal `value`.
 *
 * Width and height scale the selection uniformly around the anchor (CAD
 * entities such as circles and text cannot be stretched in one direction),
 * so changing one also changes the other. Returns `undefined` when nothing
 * changes or the value cannot be applied (e.g. width of a vertical line).
 */
export function boxFieldTransform(
  box: MlBox2d,
  anchor: MlAnchor,
  field: MlBoxField,
  value: number
): MlBoxTransform | undefined {
  if (!Number.isFinite(value)) return undefined
  const current = boxFields(box, anchor)
  const EPS = 1e-12
  if (field === 'x' || field === 'y') {
    const delta = value - current[field]
    if (Math.abs(delta) < EPS) return undefined
    return field === 'x'
      ? { kind: 'translate', dx: delta, dy: 0 }
      : { kind: 'translate', dx: 0, dy: delta }
  }
  const size = current[field]
  if (!(value > 0) || !(size > EPS)) return undefined
  const factor = value / size
  if (Math.abs(factor - 1) < EPS) return undefined
  return { kind: 'scale', factor, baseX: current.x, baseY: current.y }
}

/* ===================== symbol content layers ===================== */

/** Minimal view of an entity used to find the layers a symbol is drawn on. */
export interface MlLayeredEntity {
  type: string
  layer: string
  /** Block definition of an INSERT. */
  blockTableRecord?: {
    objectId: string
    newIterator(): Iterable<MlLayeredEntity>
  } | null
  /** Attributes of an INSERT. */
  attributeIterator?(): Iterable<MlLayeredEntity>
}

const ATTRIBUTE_DEFINITION_TYPES = new Set(['AttDef', 'AttributeDefinition'])

/** Nested symbols deeper than this are not followed (cyclic definitions). */
const MAX_SYMBOL_DEPTH = 16

/**
 * Lists the layers the contents of the given symbols are drawn on, in the
 * order they are found (no duplicates).
 *
 * The visibility of a symbol's parts follows these layers, not the layer of
 * the symbol itself: a JWW block whose lines are on 壁 and 建具 stays
 * visible when only the symbol's own layer is hidden. Contents on layer 0
 * take the layer of the symbol that holds them (as they are drawn), nested
 * symbols are followed and attribute definitions are skipped (the INSERT's
 * attributes are shown instead).
 */
export function collectSymbolContentLayers(
  symbols: MlLayeredEntity[]
): string[] {
  const layers = new Set<string>()
  const resolve = (layer: string, inherited: string) =>
    !layer || layer === '0' ? inherited : layer
  const walk = (
    symbol: MlLayeredEntity,
    layer: string,
    path: Set<string>,
    depth: number
  ) => {
    for (const attr of symbol.attributeIterator?.() ?? []) {
      layers.add(resolve(attr.layer, layer))
    }
    const block = symbol.blockTableRecord
    if (!block || path.has(block.objectId) || depth > MAX_SYMBOL_DEPTH) return
    path.add(block.objectId)
    for (const entity of block.newIterator()) {
      if (ATTRIBUTE_DEFINITION_TYPES.has(entity.type)) continue
      const own = resolve(entity.layer, layer)
      if (entity.type === 'BlockReference') {
        walk(entity, own, path, depth + 1)
      } else {
        layers.add(own)
      }
    }
    path.delete(block.objectId)
  }
  for (const symbol of symbols) {
    walk(symbol, symbol.layer || '0', new Set(), 0)
  }
  return [...layers]
}
