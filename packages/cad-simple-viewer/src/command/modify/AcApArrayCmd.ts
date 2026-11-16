import {
  AcDbBlockTableRecord,
  AcDbEntity,
  AcGeBox3d,
  AcGeMatrix3d,
  AcGePoint3d,
  AcGePoint3dLike
} from '@mlightcad/data-model'

import { AcApContext, AcApDocManager } from '../../app'
import {
  AcEdCommand,
  AcEdOpenMode,
  AcEdPromptAngleOptions,
  AcEdPromptDistanceOptions,
  AcEdPromptIntegerOptions,
  AcEdPromptKeywordOptions,
  AcEdPromptPointOptions,
  AcEdPromptStatus
} from '../../editor'
import { AcEdSelectionTransformPreviewJig } from '../../editor/input/AcEdSelectionPreviewJig'
import { AcEdBaseView } from '../../editor/view/AcEdBaseView'
import { AcApI18n } from '../../i18n'
import { resolveSelectedEntities } from '../../service'
import { createRotationMatrix } from '../../util/AcApGeTransform'

/** Above this many preview copies × objects, the array is not previewed. */
const MAX_PREVIEW_OBJECTS = 20000
const MAX_PREVIEW_COPIES = 400

/** Rectangular array: copy matrices (the original at row 0, column 0 is left out). */
export function acapRectArrayMatrices(
  columns: number,
  rows: number,
  columnSpacing: number,
  rowSpacing: number
): AcGeMatrix3d[] {
  const out: AcGeMatrix3d[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (r === 0 && c === 0) continue
      out.push(
        new AcGeMatrix3d().makeTranslation(c * columnSpacing, r * rowSpacing, 0)
      )
    }
  }
  return out
}

/**
 * Polar array: copy matrices around `center`. A fill angle of a full turn
 * spreads the items evenly around the circle; otherwise the first and the
 * last items are `fillAngle` apart. Items are rotated with the array.
 */
export function acapPolarArrayMatrices(
  center: AcGePoint3dLike,
  count: number,
  fillAngleRad: number
): AcGeMatrix3d[] {
  if (count < 2) return []
  const full = Math.abs(Math.abs(fillAngleRad) - Math.PI * 2) < 1e-9
  const step = full ? fillAngleRad / count : fillAngleRad / (count - 1)
  const out: AcGeMatrix3d[] = []
  for (let i = 1; i < count; i++) {
    out.push(createRotationMatrix(center, step * i))
  }
  return out
}

/** Preview of all copies of an array; the value sets their placement. */
class AcApArrayPreviewJig<T> extends AcEdSelectionTransformPreviewJig<T> {
  constructor(
    view: AcEdBaseView,
    entities: AcDbEntity[],
    copyCount: number,
    private readonly matricesFor: (value: T) => AcGeMatrix3d[]
  ) {
    super(view, entities, copyCount)
  }

  get entity() {
    return this.previewEntities[0] ?? null
  }

  override update(value: T) {
    if (this.batchPreview.useBatchPreview) {
      this.batchPreview.updateMatrices(this._view, this.matricesFor(value))
      return
    }
    super.update(value)
  }

  protected buildTransforms(value: T) {
    const matrices = this.matricesFor(value)
    return this.previewEntries.map(entry => ({
      objectId: entry.entity.objectId,
      matrix: matrices[entry.copyFactor - 1] ?? new AcGeMatrix3d()
    }))
  }
}

function selectionExtents(entities: AcDbEntity[]) {
  const box = new AcGeBox3d()
  for (const entity of entities) {
    try {
      const extents = entity.geometricExtents
      if (extents && !extents.isEmpty()) box.union(extents)
    } catch {
      // Objects without extents do not count.
    }
  }
  return box
}

/**
 * ARRAY ("配列複製"): copies the selection in a grid of rows and columns, or
 * around a center point. The copies are separate objects (not an
 * associative array).
 */
export class AcApArrayCmd extends AcEdCommand {
  private static _columns = 4
  private static _rows = 3
  private static _polarCount = 6
  private static _fillAngle = 360

  constructor() {
    super()
    this.mode = AcEdOpenMode.Write
  }

  private makeJig<T>(
    context: AcApContext,
    entities: AcDbEntity[],
    copyCount: number,
    matricesFor: (value: T) => AcGeMatrix3d[]
  ) {
    if (
      copyCount <= 0 ||
      copyCount > MAX_PREVIEW_COPIES ||
      copyCount * entities.length > MAX_PREVIEW_OBJECTS
    ) {
      return undefined
    }
    return new AcApArrayPreviewJig<T>(
      context.view,
      entities,
      copyCount,
      matricesFor
    )
  }

  private async promptCount(message: string, current: number, min: number) {
    const prompt = new AcEdPromptIntegerOptions(message, min, 10000)
    prompt.allowZero = false
    prompt.allowNegative = false
    prompt.useDefaultValue = true
    prompt.defaultValue = current
    prompt.allowNone = true
    const result = await AcApDocManager.instance.editor.getInteger(prompt)
    if (result.status === AcEdPromptStatus.None) return current
    if (result.status !== AcEdPromptStatus.OK || result.value == null) {
      return undefined
    }
    return Math.max(min, Math.floor(result.value))
  }

  private async promptSpacing(
    context: AcApContext,
    entities: AcDbEntity[],
    message: string,
    basePoint: AcGePoint3d,
    defaultValue: number,
    copyCount: number,
    matricesFor: (value: number) => AcGeMatrix3d[]
  ) {
    const prompt = new AcEdPromptDistanceOptions(message)
    prompt.useBasePoint = true
    prompt.useDashedLine = true
    prompt.basePoint = basePoint
    prompt.allowNegative = true
    prompt.allowZero = true
    prompt.useDefaultValue = true
    prompt.defaultValue = defaultValue
    prompt.allowNone = true
    prompt.jig = this.makeJig(context, entities, copyCount, matricesFor)
    const result = await AcApDocManager.instance.editor.getDistance(prompt)
    if (result.status === AcEdPromptStatus.None) return defaultValue
    if (result.status !== AcEdPromptStatus.OK || result.value == null) {
      return undefined
    }
    return result.value
  }

  private async rectangular(context: AcApContext, entities: AcDbEntity[]) {
    const columns = await this.promptCount(
      AcApI18n.t('jig.array.columns'),
      AcApArrayCmd._columns,
      1
    )
    if (columns == null) return undefined
    const rows = await this.promptCount(
      AcApI18n.t('jig.array.rows'),
      AcApArrayCmd._rows,
      1
    )
    if (rows == null) return undefined
    if (columns * rows < 2) return []
    AcApArrayCmd._columns = columns
    AcApArrayCmd._rows = rows

    const box = selectionExtents(entities)
    const size = box.isEmpty() ? { x: 1, y: 1 } : box.getSize(new AcGePoint3d())
    const base = box.isEmpty()
      ? new AcGePoint3d(0, 0, 0)
      : new AcGePoint3d(box.min.x, box.min.y, 0)
    const copies = columns * rows - 1

    let columnSpacing = 0
    if (columns > 1) {
      const value = await this.promptSpacing(
        context,
        entities,
        AcApI18n.t('jig.array.columnSpacing'),
        base,
        (size.x || 1) * 1.5,
        copies,
        // Rows are previewed one spacing apart while the columns are chosen.
        d => acapRectArrayMatrices(columns, rows, d, (size.y || 1) * 1.5)
      )
      if (value == null) return undefined
      columnSpacing = value
    }
    let rowSpacing = 0
    if (rows > 1) {
      const value = await this.promptSpacing(
        context,
        entities,
        AcApI18n.t('jig.array.rowSpacing'),
        base,
        (size.y || 1) * 1.5,
        copies,
        d => acapRectArrayMatrices(columns, rows, columnSpacing, d)
      )
      if (value == null) return undefined
      rowSpacing = value
    }
    return acapRectArrayMatrices(columns, rows, columnSpacing, rowSpacing)
  }

  private async polar(context: AcApContext, entities: AcDbEntity[]) {
    const editor = AcApDocManager.instance.editor
    const centerResult = await editor.getPoint(
      new AcEdPromptPointOptions(AcApI18n.t('jig.array.center'))
    )
    if (centerResult.status !== AcEdPromptStatus.OK) return undefined
    const center = new AcGePoint3d(centerResult.value!)

    const count = await this.promptCount(
      AcApI18n.t('jig.array.items'),
      AcApArrayCmd._polarCount,
      2
    )
    if (count == null) return undefined
    AcApArrayCmd._polarCount = count

    const prompt = new AcEdPromptAngleOptions(AcApI18n.t('jig.array.fillAngle'))
    prompt.useBasePoint = true
    prompt.useDashedLine = true
    prompt.basePoint = center
    prompt.allowNegative = true
    prompt.allowZero = false
    prompt.useDefaultValue = true
    prompt.defaultValue = AcApArrayCmd._fillAngle
    prompt.allowNone = true
    prompt.jig = this.makeJig<number>(context, entities, count - 1, deg =>
      acapPolarArrayMatrices(center, count, ((deg || 360) * Math.PI) / 180)
    )
    const result = await editor.getAngle(prompt)
    let fill = AcApArrayCmd._fillAngle
    if (result.status === AcEdPromptStatus.OK && result.value != null) {
      fill = result.value
    } else if (result.status !== AcEdPromptStatus.None) {
      return undefined
    }
    if (Math.abs(fill) < 1e-9 || Math.abs(fill) > 360) fill = 360
    AcApArrayCmd._fillAngle = fill
    return acapPolarArrayMatrices(center, count, (fill * Math.PI) / 180)
  }

  async execute(context: AcApContext) {
    const editor = AcApDocManager.instance.editor
    const selectionSet = context.view.selectionSet
    const resolved = await resolveSelectedEntities(context, {
      promptKey: 'array'
    })
    if (!resolved) return
    const { entities } = resolved

    const typePrompt = new AcEdPromptKeywordOptions(
      AcApI18n.t('jig.array.type')
    )
    const rect = typePrompt.keywords.add(
      AcApI18n.t('jig.array.keywords.rectangular.display'),
      AcApI18n.t('jig.array.keywords.rectangular.global'),
      AcApI18n.t('jig.array.keywords.rectangular.local')
    )
    typePrompt.keywords.add(
      AcApI18n.t('jig.array.keywords.polar.display'),
      AcApI18n.t('jig.array.keywords.polar.global'),
      AcApI18n.t('jig.array.keywords.polar.local')
    )
    typePrompt.keywords.default = rect
    typePrompt.allowNone = true
    const typeResult = await editor.getKeywords(typePrompt)
    if (
      typeResult.status !== AcEdPromptStatus.OK &&
      typeResult.status !== AcEdPromptStatus.Keyword &&
      typeResult.status !== AcEdPromptStatus.None
    ) {
      selectionSet.clear()
      return
    }
    const polar = typeResult.stringResult === 'Polar'

    const matrices = polar
      ? await this.polar(context, entities)
      : await this.rectangular(context, entities)
    if (!matrices) {
      selectionSet.clear()
      return
    }

    const db = context.doc.database
    for (const entity of entities) {
      const owner = entity.ownerId ? db.getObjectById(entity.ownerId) : undefined
      const target =
        owner instanceof AcDbBlockTableRecord
          ? owner
          : db.tables.blockTable.modelSpace
      const copies: AcDbEntity[] = []
      for (const matrix of matrices) {
        const copy = entity.clone() as AcDbEntity | undefined
        if (!copy) continue
        copy.transformBy(matrix)
        copies.push(copy)
      }
      if (copies.length > 0) target.appendEntity(copies)
    }
    selectionSet.clear()
  }
}
