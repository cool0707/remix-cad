import {
  AcDbAttribute,
  AcDbAttributeDefinition,
  AcDbBlockReference,
  AcDbBlockTableRecord,
  AcDbDatabase,
  AcDbEntity,
  AcGeMatrix3d
} from '@mlightcad/data-model'

/** Tags are compared without case, as AutoCAD does. */
function tagKey(tag: string | undefined) {
  return (tag ?? '').trim().toUpperCase()
}

function isAttributeDefinition(
  entity: AcDbEntity
): entity is AcDbAttributeDefinition {
  return entity instanceof AcDbAttributeDefinition
}

/**
 * The symbol properties a definition asks each placed symbol to carry:
 * its attribute definitions that are not constant, by tag.
 */
export function acapSymbolPropertyDefinitions(
  entities: Iterable<AcDbEntity>
): Map<string, AcDbAttributeDefinition> {
  const definitions = new Map<string, AcDbAttributeDefinition>()
  for (const entity of entities) {
    if (!isAttributeDefinition(entity) || entity.isConst) continue
    const key = tagKey(entity.tag)
    if (key && !definitions.has(key)) definitions.set(key, entity)
  }
  return definitions
}

/** Transform of a placed symbol, from its definition to the drawing. */
function placementTransform(reference: AcDbBlockReference) {
  return new AcGeMatrix3d().multiplyMatrices(
    new AcGeMatrix3d().setFromExtrusionDirection(reference.normal),
    reference.blockTransform
  )
}

/**
 * Creates the property (ATTRIB) a placed symbol carries for a definition
 * (ATTDEF), with the definition's default value and placed by the symbol.
 */
export function acapCreateSymbolProperty(
  definition: AcDbAttributeDefinition,
  reference: AcDbBlockReference
): AcDbAttribute {
  const attribute = new AcDbAttribute()
  // On layer 0 a definition follows the layer its symbol is placed on.
  attribute.layer = definition.layer === '0' ? reference.layer : definition.layer
  attribute.color = definition.color
  attribute.lineType = definition.lineType
  attribute.lineWeight = definition.lineWeight
  attribute.textString = definition.textString
  attribute.height = definition.height
  attribute.position = definition.position.clone()
  if (definition.hasAlignmentPoint) {
    attribute.alignmentPoint = definition.alignmentPoint.clone()
    attribute.hasAlignmentPoint = true
  }
  attribute.rotation = definition.rotation
  attribute.oblique = definition.oblique
  attribute.horizontalMode = definition.horizontalMode
  attribute.verticalMode = definition.verticalMode
  attribute.styleName = definition.styleName
  attribute.widthFactor = definition.widthFactor
  attribute.generationFlag = definition.generationFlag
  attribute.normal = definition.normal
  attribute.tag = definition.tag
  attribute.isInvisible = definition.isInvisible
  attribute.isVerifiable = definition.isVerifiable
  attribute.isPreset = definition.isPreset
  attribute.fieldLength = definition.fieldLength
  attribute.lockPositionInBlock = definition.lockPositionInBlock
  attribute.transformBy(placementTransform(reference))
  return attribute
}

/**
 * Brings the properties of every placed symbol in line with an edited
 * definition: a property that was added to the definition is added to each
 * symbol (with the default value), one that was removed is removed. Values
 * and positions of the properties a symbol keeps are not touched.
 *
 * Run inside the undoable edit that changes the definition.
 *
 * @param db - Drawing that holds the symbol.
 * @param block - Definition, already holding its new contents.
 * @param before - Property definitions before the edit, by tag.
 * @returns The symbols whose properties changed.
 */
export function acapSyncSymbolProperties(
  db: AcDbDatabase,
  block: AcDbBlockTableRecord,
  before: ReadonlyMap<string, unknown>
): AcDbBlockReference[] {
  const after = acapSymbolPropertyDefinitions(block.newIterator())
  const added = [...after.keys()].filter(key => !before.has(key))
  const removed = new Set([...before.keys()].filter(key => !after.has(key)))
  if (added.length === 0 && removed.size === 0) return []

  const changed: AcDbBlockReference[] = []
  for (const record of db.tables.blockTable.newIterator()) {
    // A symbol cannot hold itself.
    if (record === block) continue
    for (const entity of record.newIterator()) {
      if (!(entity instanceof AcDbBlockReference)) continue
      if (entity.blockTableRecord !== block) continue

      const present = new Map<string, AcDbAttribute>()
      for (const attribute of entity.attributeIterator()) {
        present.set(tagKey(attribute.tag), attribute)
      }
      const toAdd = added.filter(key => !present.has(key))
      const toRemove = [...present.keys()].filter(key => removed.has(key))
      if (toAdd.length === 0 && toRemove.length === 0) continue

      const opened = db.openEntityForWrite(entity) as
        | AcDbBlockReference
        | undefined
      if (!opened) continue
      if (toRemove.length > 0) {
        // The data model has no call to remove one attribute.
        const attributes = (
          opened as unknown as { _attribs: Map<string, AcDbAttribute> }
        )._attribs
        for (const [id, attribute] of [...attributes]) {
          if (removed.has(tagKey(attribute.tag))) attributes.delete(id)
        }
      }
      for (const key of toAdd) {
        opened.appendAttributes(
          acapCreateSymbolProperty(after.get(key)!, opened)
        )
      }
      changed.push(opened)
    }
  }
  return changed
}
