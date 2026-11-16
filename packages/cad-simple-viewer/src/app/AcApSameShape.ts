import {
  AcDbAttribute,
  AcDbBlockReference,
  AcDbBlockTableRecord,
  AcDbDatabase,
  AcDbEntity,
  AcDbObjectId,
  AcDbText,
  AcGeMatrix3d,
  AcGePoint3d
} from '@mlightcad/data-model'

import { isInsertableBlockName } from '../command/draw/isInsertableBlockName'
import { acapBlockEvents } from '../service/AcApBlockExplode'
import {
  acapComposeShapeTransforms,
  acapInvertShapeTransform,
  acapMatchShapes,
  type AcApShapeMatchLimits,
  type AcApShapeMatchOptions,
  type AcApShapePart,
  acapShapeTolerance,
  type AcApShapeTransform,
  type AcApShapeUnit
} from './AcApShapeMatch'
import {
  acapBlockReferenceShapeTransform,
  type AcApShapePartCache,
  acapShapePartsOf
} from './AcApShapeParts'
import {
  acapCreateSymbolProperty,
  acapSymbolPropertyDefinitions
} from './AcApSymbolAttributes'

/**
 * "Find the same shape": the places in a space where the selected shape is
 * drawn again — the same symbol placed elsewhere, copies of loose entities,
 * symbols that were exploded — and turning the loose ones back into symbols.
 */

/** One place where the shape is found. */
export interface AcApSameShapeFound {
  /** Entities that make it up */
  ids: AcDbObjectId[]
  /** Carries the selected shape onto this place */
  transform: AcApShapeTransform
  /** Angle in radians */
  rotation: number
  /** Size compared with the selected shape */
  scale: number
  /** Drawn mirrored */
  mirrored: boolean
  /** The place is one symbol: its name */
  blockName?: string
}

/** Result of {@link acapFindSameShape}. */
export interface AcApSameShapeResult {
  /** Database searched */
  db: AcDbDatabase
  /** Space searched (block table record id) */
  spaceId: AcDbObjectId
  /** Entities of the selected shape that take part in the comparison */
  pattern: AcDbObjectId[]
  /** Selected entities that cannot be compared (left out) */
  ignored: AcDbObjectId[]
  /** The selected shape is one symbol: its name */
  patternBlockName?: string
  /** Other places, not counting the selected shape itself */
  found: AcApSameShapeFound[]
  /** A limit was reached: there may be more */
  truncated: boolean
  /** Distance under which points were taken as the same */
  tolerance: number
}

/** Block name of an entity that is one symbol, else `undefined`. */
function symbolName(entity: AcDbEntity | undefined) {
  return entity instanceof AcDbBlockReference ? entity.blockName : undefined
}

/**
 * Finds where the shape made of the given entities is drawn again in their
 * space.
 *
 * @param db - Drawing.
 * @param spaceId - Space to search (model space or a layout); entities of the
 *   pattern in other spaces are left out.
 * @param patternIds - Entities of the shape (the selection).
 * @param options - Differences that still count as the same shape.
 * @param accept - Entities that may be found (visible, not locked …).
 * @param limits - Bounds for huge drawings.
 */
export function acapFindSameShape(
  db: AcDbDatabase,
  spaceId: AcDbObjectId,
  patternIds: Iterable<AcDbObjectId>,
  options: AcApShapeMatchOptions,
  accept: (entity: AcDbEntity) => boolean = () => true,
  limits: AcApShapeMatchLimits = {}
): AcApSameShapeResult {
  const cache: AcApShapePartCache = new Map()
  const patternSet = new Set<AcDbObjectId>()
  const pattern: AcDbObjectId[] = []
  const ignored: AcDbObjectId[] = []
  const parts: AcApShapePart[] = []
  let only: AcDbEntity | undefined
  for (const id of patternIds) {
    if (patternSet.has(id)) continue
    patternSet.add(id)
    const entity = db.tables.blockTable.getEntityById(id)
    if (!entity || entity.ownerId !== spaceId) continue
    const own = acapShapePartsOf(entity, cache)
    if (!own.length) {
      ignored.push(id)
      continue
    }
    pattern.push(id)
    parts.push(...own)
    only = pattern.length === 1 ? entity : undefined
  }
  const tolerance = limits.tolerance ?? acapShapeTolerance(parts)
  const result: AcApSameShapeResult = {
    db,
    spaceId,
    pattern,
    ignored,
    patternBlockName: symbolName(only),
    found: [],
    truncated: false,
    tolerance
  }
  const space = db.getObjectById(spaceId)
  if (!parts.length || !(space instanceof AcDbBlockTableRecord)) return result

  const units: AcApShapeUnit<AcDbEntity>[] = []
  for (const entity of space.newIterator()) {
    if (patternSet.has(entity.objectId) || !accept(entity)) continue
    units.push({ key: entity, parts: acapShapePartsOf(entity, cache) })
  }
  const matched = acapMatchShapes(parts, units, options, {
    ...limits,
    tolerance
  })
  result.truncated = matched.truncated
  result.found = matched.matches.map(match => ({
    ids: match.keys.map(entity => entity.objectId),
    transform: match.transform,
    rotation: match.rotation,
    scale: match.scale,
    mirrored: match.mirrored,
    blockName: match.keys.length === 1 ? symbolName(match.keys[0]) : undefined
  }))
  return result
}

/** Places that are loose entities (not one symbol). */
export function acapLooseSameShapes(result: AcApSameShapeResult) {
  return result.found.filter(found => !found.blockName)
}

/**
 * The symbol loose copies would become: the selected symbol, else the
 * symbol most of the found symbols are, else none (a new one is made).
 */
export function acapSameShapeSymbolName(
  result: AcApSameShapeResult
): string | undefined {
  if (result.patternBlockName) return result.patternBlockName
  const counts = new Map<string, number>()
  for (const found of result.found) {
    if (found.blockName && isInsertableBlockName(found.blockName)) {
      counts.set(found.blockName, (counts.get(found.blockName) ?? 0) + 1)
    }
  }
  let best: string | undefined
  for (const [name, count] of counts) {
    if (!best || count > counts.get(best)!) best = name
  }
  return best
}

/** Whether the shape has loose copies that can be made into symbols. */
export function acapCanMakeSameShapeSymbols(result: AcApSameShapeResult) {
  // The selection itself counts when it is not one symbol.
  return (
    result.pattern.length > 0 &&
    (!result.patternBlockName || acapLooseSameShapes(result).length > 0)
  )
}

/** Options of {@link acapReplaceSameShapesWithSymbol}. */
export interface AcApSameShapeSymbolOptions {
  /**
   * Name of the symbol to make when the shape is not a symbol yet (no symbol
   * is selected or found). Must be free.
   */
  newBlockName: string
  /** Entities that may not change (on locked layers). */
  isLocked?: (entity: AcDbEntity) => boolean
}

/** Result of {@link acapReplaceSameShapesWithSymbol}. */
export interface AcApSameShapeSymbolResult {
  /** Symbol used */
  blockName: string
  /** The symbol was made now */
  created: boolean
  /** Symbols placed in place of loose copies */
  inserts: AcDbBlockReference[]
}

/** A symbol placed by a definition-to-drawing transform. */
function placeSymbol(
  name: string,
  record: AcDbBlockTableRecord,
  t: AcApShapeTransform,
  layer: string
): AcDbBlockReference {
  // M = T(position) · R(θ) · S(sx, sy) · T(-origin)
  const sx = Math.hypot(t.a, t.b)
  const rotation = Math.atan2(t.b, t.a)
  const sy = (t.a * t.d - t.b * t.c) / sx
  const origin = record.origin ?? { x: 0, y: 0, z: 0 }
  const insert = new AcDbBlockReference(name)
  insert.position = new AcGePoint3d(
    t.tx + t.a * origin.x + t.c * origin.y,
    t.ty + t.b * origin.x + t.d * origin.y,
    0
  )
  insert.rotation = rotation < 0 ? rotation + Math.PI * 2 : rotation
  insert.scaleFactors = new AcGePoint3d(sx, sy, Math.abs(sx))
  insert.layer = layer
  return insert
}

/** Bottom left of parts (the base point of a new symbol). */
function partsCorner(parts: AcApShapePart[]) {
  let x = Infinity
  let y = Infinity
  for (const part of parts) {
    const r = part.kind === 'circle' ? (part.size ?? 0) : 0
    for (const p of part.points) {
      x = Math.min(x, p.x - r)
      y = Math.min(y, p.y - r)
    }
  }
  return Number.isFinite(x) ? { x, y } : { x: 0, y: 0 }
}

/**
 * Replaces the loose copies of the shape (and the selection itself, when it
 * is not a symbol) with symbols. The symbol is the selected one, else the
 * one found most, else a new symbol made from the selection (base point:
 * its bottom left corner).
 *
 * Copies of a symbol with properties take their values from the texts an
 * explode left where the properties are (the texts are removed).
 * Places with an entity on a locked layer are left as they are.
 *
 * Call inside an undo transaction.
 */
export function acapReplaceSameShapesWithSymbol(
  result: AcApSameShapeResult,
  options: AcApSameShapeSymbolOptions
): AcApSameShapeSymbolResult | undefined {
  const { db, spaceId } = result
  const space = db.getObjectById(spaceId)
  if (!(space instanceof AcDbBlockTableRecord) || !result.pattern.length) {
    return undefined
  }
  const entityOf = (id: AcDbObjectId) => db.tables.blockTable.getEntityById(id)
  const isLocked = options.isLocked ?? (() => false)

  // Definition-to-drawing transform of the selected shape, and the symbol.
  let blockName = acapSameShapeSymbolName(result)
  let created = false
  let toPattern: AcApShapeTransform
  let layer: string
  if (blockName) {
    let ref: AcDbBlockReference | undefined
    let refFromPattern: AcApShapeTransform = {
      a: 1,
      b: 0,
      c: 0,
      d: 1,
      tx: 0,
      ty: 0
    }
    if (result.patternBlockName) {
      ref = entityOf(result.pattern[0]) as AcDbBlockReference
    } else {
      const found = result.found.find(f => f.blockName === blockName)!
      ref = entityOf(found.ids[0]) as AcDbBlockReference
      refFromPattern = found.transform
    }
    if (!ref) return undefined
    toPattern = acapComposeShapeTransforms(
      acapInvertShapeTransform(refFromPattern),
      acapBlockReferenceShapeTransform(ref)
    )
    layer = ref.layer
  } else {
    const name = options.newBlockName
    if (!name || db.tables.blockTable.has(name)) return undefined
    const entities = result.pattern
      .map(entityOf)
      .filter((entity): entity is AcDbEntity => !!entity)
    const cache: AcApShapePartCache = new Map()
    const corner = partsCorner(
      entities.flatMap(entity => acapShapePartsOf(entity, cache))
    )
    const record = new AcDbBlockTableRecord({ name })
    db.tables.blockTable.add(record)
    const shift = new AcGeMatrix3d().makeTranslation(-corner.x, -corner.y, 0)
    const copies: AcDbEntity[] = []
    for (const entity of entities) {
      const copy = entity.clone()
      if (!copy) continue
      copy.transformBy(shift)
      copies.push(copy)
    }
    if (copies.length) record.appendEntity(copies)
    blockName = name
    created = true
    toPattern = { a: 1, b: 0, c: 0, d: 1, tx: corner.x, ty: corner.y }
    const layers = new Set(entities.map(entity => entity.layer))
    layer = layers.size === 1 ? [...layers][0] : db.clayer
  }
  const record = db.tables.blockTable.getAt(blockName)
  if (!record) return undefined

  // Places to replace: the selection (unless it is the symbol) and loose
  // copies.
  const places: { ids: AcDbObjectId[]; transform: AcApShapeTransform }[] = []
  if (!result.patternBlockName) {
    places.push({
      ids: result.pattern,
      transform: { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 }
    })
  }
  for (const found of acapLooseSameShapes(result)) places.push(found)

  const definitions = acapSymbolPropertyDefinitions(record.newIterator())
  const taken = new Set<AcDbObjectId>()
  for (const place of places) for (const id of place.ids) taken.add(id)
  const texts = definitions.size ? looseTexts(space, taken) : []

  const inserts: AcDbBlockReference[] = []
  for (const place of places) {
    const entities = place.ids.map(entityOf)
    if (entities.some(entity => !entity || isLocked(entity))) continue
    const transform = acapComposeShapeTransforms(place.transform, toPattern)
    const insert = placeSymbol(blockName, record, transform, layer)
    for (const entity of entities) db.openEntityForWrite(entity!)?.erase()
    space.appendEntity(insert)
    for (const definition of definitions.values()) {
      const attribute = acapCreateSymbolProperty(definition, insert)
      const text = takeText(texts, attribute, result.tolerance * 10, isLocked)
      if (text) {
        attribute.textString = text.textString
        db.openEntityForWrite(text)?.erase()
      }
      insert.appendAttributes(attribute)
    }
    inserts.push(insert)
  }
  if (created) acapBlockEvents.blocksChanged.dispatch({ database: db })
  return { blockName, created, inserts }
}

/** Plain texts of the space that are not part of a place. */
function looseTexts(space: AcDbBlockTableRecord, taken: Set<AcDbObjectId>) {
  const texts: AcDbText[] = []
  for (const entity of space.newIterator()) {
    if (taken.has(entity.objectId)) continue
    if (entity instanceof AcDbText && !(entity instanceof AcDbAttribute)) {
      texts.push(entity)
    }
  }
  return texts
}

/**
 * The text an explode left for a property: at its place, as high. Taken out
 * of the list.
 */
function takeText(
  texts: AcDbText[],
  attribute: AcDbAttribute,
  tolerance: number,
  isLocked: (entity: AcDbEntity) => boolean
): AcDbText | undefined {
  const tol = Math.max(tolerance, attribute.height * 1e-3)
  const index = texts.findIndex(
    text =>
      !isLocked(text) &&
      Math.abs(text.position.x - attribute.position.x) <= tol &&
      Math.abs(text.position.y - attribute.position.y) <= tol &&
      Math.abs(text.height - attribute.height) <= tol
  )
  if (index < 0) return undefined
  return texts.splice(index, 1)[0]
}
