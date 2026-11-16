import { AcDbEntity, AcGePoint3d, AcGePoint3dLike } from '@mlightcad/data-model'

import { AcApContext, AcApDocManager } from '../../app'
import {
  AcEdCommand,
  AcEdOpenMode,
  AcEdPromptDistanceOptions,
  AcEdPromptPointOptions,
  AcEdPromptStatus
} from '../../editor'
import {
  AcEdSelectionStaticPreviewJig,
  AcEdSelectionTransformPreviewJig
} from '../../editor/input/AcEdSelectionPreviewJig'
import { AcEdBaseView } from '../../editor/view/AcEdBaseView'
import { AcApI18n } from '../../i18n'
import { resolveSelectedEntities } from '../../service'
import { createScaleMatrix } from '../../util/AcApGeTransform'

/**
 * SCALE preview: the factor follows the cursor distance from the base point
 * (divided by the reference length in "Reference" mode).
 */
class AcApScalePreviewJig extends AcEdSelectionTransformPreviewJig<number> {
  private _basePoint: AcGePoint3d
  private _reference: number

  constructor(
    view: AcEdBaseView,
    entities: AcDbEntity[],
    basePoint: AcGePoint3dLike,
    reference = 1
  ) {
    super(view, entities)
    this._basePoint = new AcGePoint3d(basePoint)
    this._reference = reference
  }

  get entity() {
    return this.previewEntities[0] ?? null
  }

  protected buildTransforms(value: number) {
    const factor = value / this._reference
    const matrix = createScaleMatrix(
      this._basePoint,
      factor > 1e-9 ? factor : 1e-9
    )
    const targets =
      this.previewEntries.length > 0
        ? this.previewEntries
        : [{ entity: { objectId: '' } as AcDbEntity, copyFactor: 1 }]
    return targets.map(entry => ({ objectId: entry.entity.objectId, matrix }))
  }
}

type ScaleKeyword = 'copy' | 'reference' | 'points'

/**
 * SCALE ("尺度変更"): enlarges or reduces the selection around a base point by
 * a factor. "Copy" keeps the originals; "Reference" scales so that a known
 * length becomes a new length.
 */
export class AcApScaleCmd extends AcEdCommand {
  constructor() {
    super()
    this.mode = AcEdOpenMode.Write
  }

  private addKeyword(prompt: AcEdPromptDistanceOptions, key: ScaleKeyword) {
    prompt.keywords.add(
      AcApI18n.t(`jig.scale.keywords.${key}.display`),
      AcApI18n.t(`jig.scale.keywords.${key}.global`),
      AcApI18n.t(`jig.scale.keywords.${key}.local`)
    )
  }

  private distancePrompt(message: string, basePoint: AcGePoint3d) {
    const prompt = new AcEdPromptDistanceOptions(message)
    prompt.useBasePoint = true
    prompt.useDashedLine = true
    prompt.basePoint = basePoint
    prompt.allowZero = false
    prompt.allowNegative = false
    return prompt
  }

  /** Reference length: typed, or measured between two points. */
  private async promptReference(
    context: AcApContext,
    entities: AcDbEntity[],
    basePoint: AcGePoint3d
  ): Promise<number | undefined> {
    const editor = AcApDocManager.instance.editor
    const prompt = this.distancePrompt(
      AcApI18n.t('jig.scale.referenceLength'),
      basePoint
    )
    this.addKeyword(prompt, 'points')
    prompt.useDefaultValue = true
    prompt.defaultValue = 1
    prompt.jig = new AcEdSelectionStaticPreviewJig<number>(
      context.view,
      entities
    )
    const result = await editor.getDistance(prompt)
    if (result.status === AcEdPromptStatus.OK) return result.value
    if (result.status !== AcEdPromptStatus.Keyword) return undefined

    const first = await editor.getPoint(
      new AcEdPromptPointOptions(AcApI18n.t('jig.scale.firstReferencePoint'))
    )
    if (first.status !== AcEdPromptStatus.OK) return undefined
    const secondPrompt = new AcEdPromptPointOptions(
      AcApI18n.t('jig.scale.secondReferencePoint')
    )
    secondPrompt.useBasePoint = true
    secondPrompt.useDashedLine = true
    secondPrompt.basePoint = new AcGePoint3d(first.value!)
    const second = await editor.getPoint(secondPrompt)
    if (second.status !== AcEdPromptStatus.OK) return undefined
    const length = new AcGePoint3d(first.value!).distanceTo(second.value!)
    return length > 1e-12 ? length : undefined
  }

  async execute(context: AcApContext) {
    const editor = AcApDocManager.instance.editor
    const selectionSet = context.view.selectionSet
    const resolved = await resolveSelectedEntities(context, {
      promptKey: 'scale'
    })
    if (!resolved) return
    const { entities } = resolved

    const basePrompt = new AcEdPromptPointOptions(
      AcApI18n.t('jig.scale.basePoint')
    )
    basePrompt.jig = new AcEdSelectionStaticPreviewJig<AcGePoint3d>(
      context.view,
      entities
    )
    const baseResult = await editor.getPoint(basePrompt)
    if (baseResult.status !== AcEdPromptStatus.OK) {
      selectionSet.clear()
      return
    }
    const basePoint = new AcGePoint3d(baseResult.value!)

    let copyMode = false
    let factor: number | undefined
    while (factor == null) {
      const prompt = this.distancePrompt(
        AcApI18n.t('jig.scale.factorOrOptions'),
        basePoint
      )
      this.addKeyword(prompt, 'copy')
      this.addKeyword(prompt, 'reference')
      prompt.jig = new AcApScalePreviewJig(context.view, entities, basePoint)
      const result = await editor.getDistance(prompt)
      if (result.status === AcEdPromptStatus.OK) {
        factor = result.value
        break
      }
      if (result.status !== AcEdPromptStatus.Keyword) {
        selectionSet.clear()
        return
      }
      if (result.stringResult === 'Copy') {
        copyMode = true
        continue
      }
      if (result.stringResult !== 'Reference') continue

      const reference = await this.promptReference(context, entities, basePoint)
      if (reference == null) {
        selectionSet.clear()
        return
      }
      const newPrompt = this.distancePrompt(
        AcApI18n.t('jig.scale.newLength'),
        basePoint
      )
      newPrompt.jig = new AcApScalePreviewJig(
        context.view,
        entities,
        basePoint,
        reference
      )
      const newResult = await editor.getDistance(newPrompt)
      if (newResult.status !== AcEdPromptStatus.OK || newResult.value == null) {
        selectionSet.clear()
        return
      }
      factor = newResult.value / reference
    }

    if (factor == null || !(factor > 0) || !Number.isFinite(factor)) {
      this.showMessage(AcApI18n.t('jig.scale.invalidFactor'), 'warning')
      selectionSet.clear()
      return
    }
    const matrix = createScaleMatrix(basePoint, factor)
    const service = context.doc.entityService
    if (copyMode) service.cloneAndTransform(entities, matrix)
    else service.transformEntities(entities, matrix)
    selectionSet.clear()
  }
}
