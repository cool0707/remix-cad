import { AcApI18n } from '../../i18n'

/** Built-in stamps in gallery order, with their i18n badge keys. */
export const MARKUP_BUILTIN_STAMPS = [
  { id: 'approved', key: 'approved' },
  { id: 'rejected', key: 'rejected' },
  { id: 'revised', key: 'revised' },
  { id: 'for-review', key: 'forReview' }
] as const

/**
 * Localized badge text for a built-in stamp id, or `undefined` for custom /
 * unknown ids (the renderer then falls back to its own label).
 *
 * Records store only the id, so the badge follows the current UI locale.
 */
export function markupStampLabel(stampId: string): string | undefined {
  const stamp = MARKUP_BUILTIN_STAMPS.find(s => s.id === stampId)
  return stamp ? AcApI18n.t(`jig.markup.stamp.badges.${stamp.key}`) : undefined
}
