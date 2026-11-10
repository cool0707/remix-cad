import {
  AcCmEventManager,
  AcDbAttribute,
  AcDbAttributeDefinition,
  AcDbBlockReference,
  AcDbBlockTableRecord,
  AcDbDatabase,
  AcDbEntity,
  AcDbText,
  AcGeMatrix3d,
  AcGiLineWeight
} from '@mlightcad/data-model'

import { isInsertableBlockName } from '../command/draw/isInsertableBlockName'

/** Arguments of {@link acapBlockEvents}.blocksChanged. */
export interface AcApBlocksChangedEventArgs {
  database: AcDbDatabase
}

/** Events of symbol (block) definition edits. */
export const acapBlockEvents = {
  /** Symbol definitions were removed (EXPLODE asked to drop unused ones). */
  blocksChanged: new AcCmEventManager<AcApBlocksChangedEventArgs>()
}

/** Result of {@link acapExplodeBlockReferences}. */
export interface AcApExplodeResult {
  /** Entities appended in place of the symbols. */
  created: AcDbEntity[]
  /** Number of symbols exploded */
  explodedCount: number
  /** Names of the symbols that were exploded (no duplicates) */
  blockNames: string[]
}

/**
 * Entities a symbol is made of, placed where the symbol is (one level: nested
 * symbols stay symbols, as in CAD's EXPLODE).
 *
 * - Shapes on layer "0" take the symbol's layer, ByBlock color / linetype /
 *   line weight / transparency take the symbol's.
 * - The symbol's visible properties (attributes) become plain text with
 *   their values; property definitions of the symbol are left out, except
 *   constant ones, which are drawn as their text.
 * - An arrayed symbol (MINSERT) gives the pieces of every copy.
 *
 * @param ref - Symbol to take apart.
 * @returns Detached entities (not yet in a database).
 */
export function acapExplodeBlockReference(
  ref: AcDbBlockReference
): AcDbEntity[] {
  const record = ref.blockTableRecord
  if (!record) return []
  const insert = new AcGeMatrix3d().multiplyMatrices(
    new AcGeMatrix3d().setFromExtrusionDirection(ref.normal),
    ref.blockTransform
  )
  const cols = Math.max(1, ref.columnCount || 1)
  const rows = Math.max(1, ref.rowCount || 1)
  const out: AcDbEntity[] = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const offset = new AcGeMatrix3d().makeTranslation(
        col * (ref.columnSpacing || 0),
        row * (ref.rowSpacing || 0),
        0
      )
      const matrix = new AcGeMatrix3d().multiplyMatrices(insert, offset)
      for (const child of record.newIterator()) {
        const piece = explodeChild(child)
        if (!piece) continue
        try {
          piece.transformBy(matrix)
        } catch {
          continue
        }
        inheritFromBlock(piece, ref)
        out.push(piece)
      }
    }
  }
  for (const attrib of ref.attributeIterator()) {
    if (attrib.isInvisible || !attrib.textString) continue
    // Attributes are already placed in the drawing (they move with the INSERT).
    const text = textFrom(attrib)
    inheritFromBlock(text, ref)
    out.push(text)
  }
  return out
}

/** A copy of one entity of the definition, or `undefined` to leave it out. */
function explodeChild(child: AcDbEntity): AcDbEntity | undefined {
  if (child instanceof AcDbAttributeDefinition) {
    if (!child.isConst || child.isInvisible || !child.textString) return
    return textFrom(child)
  }
  return child.clone() ?? undefined
}

/** Plain text with the look of an attribute / attribute definition. */
function textFrom(source: AcDbAttribute | AcDbAttributeDefinition): AcDbText {
  const text = new AcDbText()
  text.textString = source.textString
  text.styleName = source.styleName
  text.height = source.height
  text.widthFactor = source.widthFactor
  text.oblique = source.oblique
  text.rotation = source.rotation
  text.thickness = source.thickness
  text.generationFlag = source.generationFlag
  text.normal = source.normal
  text.horizontalMode = source.horizontalMode
  text.verticalMode = source.verticalMode
  text.position = source.position.clone()
  text.alignmentPoint = source.alignmentPoint.clone()
  text.hasAlignmentPoint = source.hasAlignmentPoint
  text.layer = source.layer
  text.color = source.color.clone()
  text.lineType = source.lineType
  text.lineWeight = source.lineWeight
  text.linetypeScale = source.linetypeScale
  text.transparency = source.transparency.clone()
  return text
}

/** Layer "0" and ByBlock properties take the symbol's. */
function inheritFromBlock(piece: AcDbEntity, ref: AcDbBlockReference) {
  if (piece.layer === '0') piece.layer = ref.layer
  if (piece.color?.isByBlock) piece.color = ref.color.clone()
  if (piece.lineType?.toLowerCase() === 'byblock') {
    piece.lineType = ref.lineType
  }
  if (piece.lineWeight === AcGiLineWeight.ByBlock) {
    piece.lineWeight = ref.lineWeight
  }
  if (piece.transparency?.isByBlock) {
    piece.transparency = ref.transparency.clone()
  }
}

/**
 * Replaces symbols by the entities they are made of, in the space each
 * symbol is in. Call inside an undo transaction (a command's, or
 * `acapRunServiceEdit`).
 *
 * @param db - Database of the symbols.
 * @param refs - Symbols to explode (opened for write here).
 */
export function acapExplodeBlockReferences(
  db: AcDbDatabase,
  refs: AcDbBlockReference[]
): AcApExplodeResult {
  const created: AcDbEntity[] = []
  const names = new Set<string>()
  let explodedCount = 0
  for (const ref of refs) {
    const pieces = acapExplodeBlockReference(ref)
    const owner =
      db.tables.blockTable.getIdAt(ref.ownerId) ??
      db.tables.blockTable.modelSpace
    const name = ref.blockName
    const opened = db.openEntityForWrite(ref)
    if (!opened) continue
    if (pieces.length) owner.appendEntity(pieces)
    opened.erase()
    created.push(...pieces)
    names.add(name)
    explodedCount++
  }
  return { created, explodedCount, blockNames: [...names] }
}

/**
 * Of the given symbol names, those no symbol in the drawing (any layout or
 * other symbol definition) refers to any more, and that the user can see in
 * the symbol list.
 *
 * @param db - Database to search.
 * @param names - Candidate symbol names.
 */
export function acapUnusedBlockNames(
  db: AcDbDatabase,
  names: Iterable<string>
): string[] {
  const candidates = new Map<string, string>()
  for (const name of names) {
    if (!isInsertableBlockName(name)) continue
    const record = db.tables.blockTable.getAt(name)
    if (!record || record.isXref) continue
    candidates.set(name.toUpperCase(), name)
  }
  if (!candidates.size) return []
  for (const record of db.tables.blockTable.newIterator()) {
    for (const entity of (record as AcDbBlockTableRecord).newIterator()) {
      if (!(entity instanceof AcDbBlockReference)) continue
      candidates.delete(entity.blockName.toUpperCase())
      if (!candidates.size) return []
    }
  }
  return [...candidates.values()]
}

/**
 * Removes symbol definitions from the drawing (the symbol list). Call inside
 * an undo transaction.
 *
 * @returns Number of definitions removed.
 */
export function acapRemoveBlockDefinitions(
  db: AcDbDatabase,
  names: string[]
): number {
  let count = 0
  for (const name of names) {
    if (db.tables.blockTable.remove(name)) count++
  }
  if (count) acapBlockEvents.blocksChanged.dispatch({ database: db })
  return count
}
