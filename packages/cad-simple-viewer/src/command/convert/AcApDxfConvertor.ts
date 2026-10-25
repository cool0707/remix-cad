import { AcApDocManager } from '../../app'
import {
  acapHasSheetOptions,
  acapResolveDrawingSheet,
  acapSetDxfLimits,
  type AcApSheetOptions
} from '../../app/AcApDrawingSheet'

/**
 * Utility class for exporting the current CAD drawing to DXF format.
 */
export class AcApDxfConvertor {
  /**
   * Exports the current drawing database to a DXF file and downloads it.
   *
   * @param sheet - Paper / orientation / scale to write as the drawing limits
   *   (`$LIMMIN` / `$LIMMAX`). When nothing is set the limits are not written.
   */
  convert(sheet?: AcApSheetOptions) {
    const document = AcApDocManager.instance.curDocument
    let dxfContent = document.database.dxfOut(undefined, 6)
    if (typeof dxfContent === 'string' && acapHasSheetOptions(sheet)) {
      const { min, max } = acapResolveDrawingSheet(document.database, sheet)
      dxfContent = acapSetDxfLimits(dxfContent, min, max)
    }
    const baseName = this.getBaseName(document.fileName || document.docTitle)
    this.createFileAndDownloadIt(dxfContent, `${baseName}.dxf`)
  }

  private createFileAndDownloadIt(
    dxfContent: string | Uint8Array,
    fileName: string
  ) {
    const blobPart: BlobPart =
      typeof dxfContent === 'string' ? dxfContent : new Uint8Array(dxfContent)
    const dxfBlob = new Blob([blobPart], {
      type: 'application/dxf;charset=utf-8'
    })
    const url = URL.createObjectURL(dxfBlob)
    const downloadLink = document.createElement('a')
    downloadLink.href = url
    downloadLink.download = fileName
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    URL.revokeObjectURL(url)
  }

  private getBaseName(fileName: string) {
    const normalizedName = fileName?.trim() || 'drawing'
    return normalizedName.replace(/\.[^.]+$/, '') || 'drawing'
  }
}

