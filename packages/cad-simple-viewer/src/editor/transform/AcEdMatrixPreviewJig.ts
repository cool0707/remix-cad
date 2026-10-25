import { AcGeMatrix3d } from '@mlightcad/data-model'

import { AcEdSelectionTransformPreviewJig } from '../input/AcEdSelectionPreviewJig'

/**
 * Preview of the selected entities under an arbitrary transform, for the
 * simple profile's drag move / scale / rotate.
 */
export class AcEdMatrixPreviewJig extends AcEdSelectionTransformPreviewJig<AcGeMatrix3d> {
  protected buildTransforms(matrix: AcGeMatrix3d) {
    const targets =
      this.previewEntries.length > 0
        ? this.previewEntries.map(entry => entry.entity.objectId)
        : ['']
    return targets.map(objectId => ({ objectId, matrix }))
  }
}
