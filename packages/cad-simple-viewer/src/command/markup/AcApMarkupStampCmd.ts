import { AC_TR_HTML_STAMP_LABELS } from '@mlightcad/three-renderer'

import { AcApContext } from '../../app'
import { AcEdPromptPointOptions, AcEdPromptStatus } from '../../editor'
import { resolveUiTheme } from '../../editor/global/AcEdUiTheme'
import { AcApI18n } from '../../i18n'
import {
  AcUiStampPickerDialog,
  type AcUiStampPickerResult
} from '../../ui/AcUiStampPickerDialog'
import type { AcTrView2d } from '../../view'
import { createMarkupMeta } from './AcApMarkupCmdUtil'
import { AcApMarkupDrawCmd } from './AcApMarkupDrawCmd'
import { commitMarkup } from './AcApMarkupPresenter'
import type { AcApMarkupRecord } from './AcApMarkupTypes'
import {
  defaultMarkupColor,
  defaultMarkupStyle,
  markupColorToCss
} from './AcApMarkupUtil'

/** Built-in stamps in gallery order, with their i18n name keys. */
const BUILTIN_STAMPS = [
  { id: 'approved', nameKey: 'approved' },
  { id: 'rejected', nameKey: 'rejected' },
  { id: 'revised', nameKey: 'revised' },
  { id: 'for-review', nameKey: 'forReview' }
] as const

/** Last stamp picked in this session (highlighted next time). */
let lastStampId: string = BUILTIN_STAMPS[0].id

/** Open the stamp gallery with localized labels. */
function pickStamp(view: AcTrView2d): Promise<AcUiStampPickerResult | null> {
  const t = (key: string) => AcApI18n.t(`jig.markup.stamp.${key}`)
  return AcUiStampPickerDialog.open({
    host: view.container,
    theme: resolveUiTheme(view.container),
    accentColor: markupColorToCss(defaultMarkupColor()),
    initialStampId: lastStampId,
    items: BUILTIN_STAMPS.map(stamp => ({
      id: stamp.id,
      badge: AC_TR_HTML_STAMP_LABELS[stamp.id] ?? stamp.id.toUpperCase(),
      name: t(`names.${stamp.nameKey}`)
    })),
    labels: {
      title: t('picker.title'),
      close: t('picker.close'),
      cancel: t('picker.cancel'),
      caption: t('picker.caption'),
      captionPlaceholder: t('picker.captionPlaceholder'),
      custom: t('picker.custom'),
      customHint: t('picker.customHint')
    }
  })
}

/**
 * Place a review stamp picked from a gallery (or an image stamp) at a point.
 */
export class AcApMarkupStampCmd extends AcApMarkupDrawCmd {
  async execute(context: AcApContext) {
    const view = context.view as AcTrView2d
    const picked = await pickStamp(view)
    if (!picked) return
    if (picked.stampId !== 'custom') lastStampId = picked.stampId

    await this.withMarkupInput(context, async () => {
      const pointPrompt = new AcEdPromptPointOptions(
        AcApI18n.t('jig.markup.stamp.point')
      )
      const pointResult = await context.view.editor.getPoint(pointPrompt)
      if (pointResult.status !== AcEdPromptStatus.OK) return
      const position = pointResult.value!

      const meta = createMarkupMeta('stamp', view, context, {
        text: picked.caption
      })
      const record: AcApMarkupRecord = {
        ...meta,
        type: 'stamp',
        style: defaultMarkupStyle(),
        geometry: {
          type: 'stamp',
          position: { x: position.x, y: position.y },
          stampId: picked.stampId,
          imageUrl: picked.imageUrl
        }
      }
      commitMarkup(context.view, record)
    })
  }
}
