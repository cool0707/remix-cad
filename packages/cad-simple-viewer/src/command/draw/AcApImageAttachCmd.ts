import {
  AcDbDatabase,
  AcDbRasterImage,
  AcDbRasterImageDef,
  AcGePoint2d,
  AcGePoint2dLike,
  AcGePoint3d,
  AcGePoint3dLike
} from '@mlightcad/data-model'

import { AcApContext, AcApDocManager } from '../../app'
import {
  AcEdBaseView,
  AcEdCommand,
  AcEdOpenMode,
  AcEdPreviewJig,
  AcEdPromptAngleOptions,
  AcEdPromptDoubleOptions,
  AcEdPromptPointOptions,
  AcEdPromptStatus
} from '../../editor'
import { AcApI18n } from '../../i18n'
import { acapRunDatabaseEdit } from '../../util/AcApDatabaseEdit'

/** Accept list for raster image file pickers (AutoCAD IMAGEATTACH formats). */
const IMAGE_FILE_ACCEPT = '.png,.jpg,.jpeg,.bmp,.gif,.tif,.tiff'

/** Max side length (drawing units) used when scale factor is 1. */
const DEFAULT_MAX_SIDE = 100

function uniqueImageDefName(db: AcDbDatabase, fileName: string): string {
  if (!db.objects.imageDefinition.has(fileName)) return fileName
  const dot = fileName.lastIndexOf('.')
  const stem = dot > 0 ? fileName.slice(0, dot) : fileName
  const ext = dot > 0 ? fileName.slice(dot) : ''
  let index = 1
  while (db.objects.imageDefinition.has(`${stem}_${index}${ext}`)) {
    index++
  }
  return `${stem}_${index}${ext}`
}

function computeBaseSize(
  pixelWidth: number,
  pixelHeight: number
): { width: number; height: number } {
  const safeWidth = Math.max(1, pixelWidth)
  const safeHeight = Math.max(1, pixelHeight)
  const maxSide = Math.max(safeWidth, safeHeight)
  const factor = maxSide > 0 ? DEFAULT_MAX_SIDE / maxSide : 1
  return {
    width: Math.max(1, safeWidth * factor),
    height: Math.max(1, safeHeight * factor)
  }
}

async function decodeImageSize(
  file: File
): Promise<{ width: number; height: number }> {
  const objectUrl = URL.createObjectURL(file)
  try {
    return await new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () =>
        resolve({
          width: img.naturalWidth || 100,
          height: img.naturalHeight || 100
        })
      img.onerror = () => reject(new Error('Failed to decode image'))
      img.src = objectUrl
    })
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

/** Lower-case extensions (without the dot) IMAGEATTACH accepts. */
export const ACAP_IMAGE_FILE_TYPES: readonly string[] = IMAGE_FILE_ACCEPT.split(
  ','
).map(ext => ext.slice(1))

/** Whether the file looks like a raster image IMAGEATTACH can attach. */
export function acapIsImageFile(file: { name: string; type?: string }) {
  if (file.type && file.type.startsWith('image/')) return true
  const dot = file.name.lastIndexOf('.')
  if (dot < 0) return false
  return ACAP_IMAGE_FILE_TYPES.includes(file.name.slice(dot + 1).toLowerCase())
}

/** Result of {@link acapAttachImageFile}. */
export type AcApAttachImageResult =
  | 'ok'
  | 'noDocument'
  | 'readOnly'
  | 'decodeFailed'

/** Share of the visible view (shorter side) the dropped image fills. */
const DROP_IMAGE_VIEW_RATIO = 0.4

/**
 * Attaches a raster image to the current drawing without prompts (used for
 * drag & drop). The image is centered on `screenPoint` (canvas-local pixels;
 * the view center when omitted) and sized so its longer side is
 * {@link DROP_IMAGE_VIEW_RATIO} of the shorter side of the visible area, so it
 * is easy to see whatever the drawing scale is. Undoable as one edit.
 */
export async function acapAttachImageFile(
  file: File,
  screenPoint?: AcGePoint2dLike
): Promise<AcApAttachImageResult> {
  const docManager = AcApDocManager.instance
  const doc = docManager.curDocument
  if (!doc) return 'noDocument'
  if (doc.openMode !== AcEdOpenMode.Write) return 'readOnly'

  let pixelSize: { width: number; height: number }
  try {
    pixelSize = await decodeImageSize(file)
  } catch {
    return 'decodeFailed'
  }

  const view = docManager.curView
  const viewWidth = Math.max(1, view.width)
  const viewHeight = Math.max(1, view.height)
  const corner0 = view.screenToWorld({ x: 0, y: 0 })
  const corner1 = view.screenToWorld({ x: viewWidth, y: viewHeight })
  const visibleWidth = Math.abs(corner1.x - corner0.x)
  const visibleHeight = Math.abs(corner1.y - corner0.y)
  let maxSide = Math.min(visibleWidth, visibleHeight) * DROP_IMAGE_VIEW_RATIO
  if (!(maxSide > 0) || !Number.isFinite(maxSide)) maxSide = DEFAULT_MAX_SIDE

  const pw = Math.max(1, pixelSize.width)
  const ph = Math.max(1, pixelSize.height)
  const factor = maxSide / Math.max(pw, ph)
  const width = Math.max(1e-6, pw * factor)
  const height = Math.max(1e-6, ph * factor)

  const center: AcGePoint2d = view.screenToWorld(
    screenPoint ?? { x: viewWidth / 2, y: viewHeight / 2 }
  )
  const position = new AcGePoint3d(
    center.x - width / 2,
    center.y - height / 2,
    0
  )

  const db = doc.database
  const defName = uniqueImageDefName(db, file.name)
  acapRunDatabaseEdit(db, 'IMAGEATTACH', () => {
    const imageDef = new AcDbRasterImageDef()
    imageDef.sourceFileName = file.name
    db.objects.imageDefinition.setAt(defName, imageDef)

    const image = new AcDbRasterImage()
    image.position = position
    image.width = width
    image.height = height
    image.rotation = 0
    image.image = file
    image.imageDefId = imageDef.objectId
    db.tables.blockTable.modelSpace.appendEntity(image)
  })
  return 'ok'
}

function pickImageFile(): Promise<File | undefined> {
  return new Promise(resolve => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = IMAGE_FILE_ACCEPT
    input.style.display = 'none'
    document.body.appendChild(input)

    let settled = false
    const finish = (file?: File) => {
      if (settled) return
      settled = true
      input.removeEventListener('change', onChange)
      input.removeEventListener('cancel', onCancel)
      input.remove()
      resolve(file)
    }

    const onChange = () => finish(input.files?.[0])
    const onCancel = () => finish(undefined)

    input.addEventListener('change', onChange)
    input.addEventListener('cancel', onCancel)
    input.click()
  })
}

/**
 * Preview jig for IMAGEATTACH — shows the raster frame while the user picks
 * insertion point, scale, or rotation.
 */
class AcApImageAttachJig extends AcEdPreviewJig<AcGePoint3dLike | number> {
  private readonly _entity: AcDbRasterImage
  private readonly _baseWidth: number
  private readonly _baseHeight: number
  private _mode: 'point' | 'scale' | 'rotation' = 'point'
  private _position = new AcGePoint3d()
  private _scale = 1
  private _rotationRad = 0

  constructor(
    view: AcEdBaseView,
    file: File,
    baseWidth: number,
    baseHeight: number
  ) {
    super(view)
    this._baseWidth = baseWidth
    this._baseHeight = baseHeight
    this._entity = new AcDbRasterImage()
    this._entity.image = file
    this._entity.width = baseWidth
    this._entity.height = baseHeight
    this.applyGeometry()
  }

  get entity(): AcDbRasterImage {
    return this._entity
  }

  setMode(mode: 'point' | 'scale' | 'rotation') {
    this._mode = mode
  }

  setPosition(point: AcGePoint3dLike) {
    this._position = new AcGePoint3d(point)
    this.applyGeometry()
  }

  setScale(scale: number) {
    this._scale = scale
    this.applyGeometry()
  }

  setRotationRad(rotationRad: number) {
    this._rotationRad = rotationRad
    this.applyGeometry()
  }

  update(value: AcGePoint3dLike | number) {
    if (this._mode === 'point' && typeof value !== 'number') {
      this.setPosition(value)
      return
    }
    if (typeof value !== 'number') return
    if (this._mode === 'scale') {
      this.setScale(value > 0 ? value : this._scale)
      return
    }
    if (this._mode === 'rotation') {
      // Angle prompts provide degrees.
      this.setRotationRad((value * Math.PI) / 180)
    }
  }

  private applyGeometry() {
    this._entity.position = new AcGePoint3d(this._position)
    this._entity.width = Math.max(1e-6, this._baseWidth * this._scale)
    this._entity.height = Math.max(1e-6, this._baseHeight * this._scale)
    this._entity.rotation = this._rotationRad
  }
}

/**
 * IMAGEATTACH (alias: IAT) — attaches a raster image as an external reference.
 *
 * Flow (AutoCAD-aligned):
 * 1. Pick an image file (JPG / PNG / BMP / TIF / …)
 * 2. Specify insertion point
 * 3. Specify scale factor (default 1)
 * 4. Specify rotation angle (default 0)
 * 5. Append `AcDbRasterImage` linked to a new `AcDbRasterImageDef`
 */
export class AcApImageAttachCmd extends AcEdCommand {
  constructor() {
    super()
    this.mode = AcEdOpenMode.Write
  }

  async execute(context: AcApContext) {
    const file = await pickImageFile()
    if (!file) return

    let pixelSize: { width: number; height: number }
    try {
      pixelSize = await decodeImageSize(file)
    } catch {
      this.showMessage(AcApI18n.t('jig.imageattach.decodeFailed'), 'error')
      return
    }

    const baseSize = computeBaseSize(pixelSize.width, pixelSize.height)
    const jig = new AcApImageAttachJig(
      context.view,
      file,
      baseSize.width,
      baseSize.height
    )

    try {
      jig.setMode('point')
      const insertionPrompt = new AcEdPromptPointOptions(
        AcApI18n.t('jig.imageattach.insertionPoint')
      )
      insertionPrompt.jig = jig
      const insertionResult =
        await AcApDocManager.instance.editor.getPoint(insertionPrompt)
      if (
        insertionResult.status !== AcEdPromptStatus.OK ||
        !insertionResult.value
      ) {
        return
      }
      const insertionPoint = new AcGePoint3d(insertionResult.value)
      jig.setPosition(insertionPoint)

      jig.setMode('scale')
      const scalePrompt = new AcEdPromptDoubleOptions(
        AcApI18n.t('jig.imageattach.scale')
      )
      scalePrompt.allowNone = true
      scalePrompt.allowNegative = false
      scalePrompt.allowZero = false
      scalePrompt.useDefaultValue = true
      scalePrompt.defaultValue = 1
      scalePrompt.jig = jig
      const scaleResult =
        await AcApDocManager.instance.editor.getDouble(scalePrompt)
      if (
        scaleResult.status === AcEdPromptStatus.Cancel ||
        scaleResult.status === AcEdPromptStatus.Error
      ) {
        return
      }
      const scale =
        scaleResult.status === AcEdPromptStatus.OK &&
        scaleResult.value !== undefined
          ? scaleResult.value
          : 1
      if (!(scale > 0)) {
        this.showMessage(AcApI18n.t('jig.imageattach.invalidScale'), 'warning')
        return
      }
      jig.setScale(scale)

      jig.setMode('rotation')
      const rotationPrompt = new AcEdPromptAngleOptions(
        AcApI18n.t('jig.imageattach.rotation')
      )
      rotationPrompt.allowNone = true
      rotationPrompt.allowNegative = true
      rotationPrompt.allowZero = true
      rotationPrompt.useDefaultValue = true
      rotationPrompt.defaultValue = 0
      rotationPrompt.useBasePoint = true
      rotationPrompt.useDashedLine = true
      rotationPrompt.basePoint = insertionPoint
      rotationPrompt.jig = jig
      const rotationResult =
        await AcApDocManager.instance.editor.getAngle(rotationPrompt)
      if (
        rotationResult.status === AcEdPromptStatus.Cancel ||
        rotationResult.status === AcEdPromptStatus.Error
      ) {
        return
      }
      const rotationDeg =
        rotationResult.status === AcEdPromptStatus.OK &&
        rotationResult.value !== undefined
          ? rotationResult.value
          : 0
      const rotationRad = (rotationDeg * Math.PI) / 180

      const db = context.doc.database
      const defName = uniqueImageDefName(db, file.name)
      const width = Math.max(1e-6, baseSize.width * scale)
      const height = Math.max(1e-6, baseSize.height * scale)

      acapRunDatabaseEdit(db, 'IMAGEATTACH', () => {
        const imageDef = new AcDbRasterImageDef()
        imageDef.sourceFileName = file.name
        db.objects.imageDefinition.setAt(defName, imageDef)

        const image = new AcDbRasterImage()
        image.position = insertionPoint
        image.width = width
        image.height = height
        image.rotation = rotationRad
        image.image = file
        image.imageDefId = imageDef.objectId
        db.tables.blockTable.modelSpace.appendEntity(image)
      })
    } finally {
      jig.end()
    }
  }
}
