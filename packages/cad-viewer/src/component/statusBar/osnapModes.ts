import { AcDbOsnapMode } from '@mlightcad/data-model'

type Translate = (key: string) => string

/**
 * Object snap modes offered in the UI (status bar menu and settings dialog),
 * with their localized labels.
 */
export const ML_OSNAP_MODES: ReadonlyArray<{
  value: AcDbOsnapMode
  label: (t: Translate) => string
}> = [
  {
    value: AcDbOsnapMode.EndPoint,
    label: t => t('main.statusBar.osnap.endpoint')
  },
  {
    value: AcDbOsnapMode.MidPoint,
    label: t => t('main.statusBar.osnap.midpoint')
  },
  { value: AcDbOsnapMode.Center, label: t => t('main.statusBar.osnap.center') },
  { value: AcDbOsnapMode.Node, label: t => t('main.statusBar.osnap.node') },
  {
    value: AcDbOsnapMode.Quadrant,
    label: t => t('main.statusBar.osnap.quadrant')
  },
  {
    value: AcDbOsnapMode.Intersection,
    label: t => t('main.statusBar.osnap.intersection')
  },
  {
    value: AcDbOsnapMode.Insertion,
    label: t => t('main.statusBar.osnap.insertion')
  },
  {
    value: AcDbOsnapMode.Nearest,
    label: t => t('main.statusBar.osnap.nearest')
  }
  // Perpendicular, Tangent and Centroid are not implemented yet.
]
