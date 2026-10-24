import { createI18n } from 'vue-i18n'

import arEntity from '../src/locale/ar/entity'
import csEntity from '../src/locale/cs/entity'
import enEntity from '../src/locale/en/entity'
import jaEntity from '../src/locale/ja/entity'
import { resolveLineTypeNameKey } from '../src/locale/lineTypeNameKey'
import trEntity from '../src/locale/tr/entity'
import zhEntity from '../src/locale/zh/entity'

const entities = {
  ar: arEntity,
  cs: csEntity,
  en: enEntity,
  ja: jaEntity,
  tr: trEntity,
  zh: zhEntity
}

/** Mirrors `lineTypeName()` in locale/i18n.ts without loading the viewer. */
const displayName = (name: string) => {
  const { t } = createI18n({
    legacy: false,
    locale: 'ja',
    messages: { ja: { entity: jaEntity } }
  }).global
  const resolved = resolveLineTypeNameKey(name)
  return resolved
    ? t('entity.lineTypeName.' + resolved.key) + resolved.suffix
    : name
}

describe('linetype / ByLayer display names', () => {
  it.each(Object.keys(entities) as Array<keyof typeof entities>)(
    '%s defines every symbolic and linetype key',
    code => {
      const entity = entities[code]
      expect(Object.keys(entity.symbolic).sort()).toEqual(
        Object.keys(enEntity.symbolic).sort()
      )
      expect(Object.keys(entity.lineTypeName).sort()).toEqual(
        Object.keys(enEntity.lineTypeName).sort()
      )
    }
  )

  it('maps every resolved key to a defined message', () => {
    const names = [
      'CONTINUOUS',
      'DASHED',
      'HIDDEN',
      'DOT',
      'DASHDOT',
      'CENTER',
      'DIVIDE',
      'PHANTOM',
      'BORDER',
      ...[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
        n => `ACAD_ISO${String(n).padStart(2, '0')}W100`
      ),
      'SXF_DASHED_SPACED',
      'SXF_LONG_DASH_3DOT',
      'SXF_CHAIN',
      'SXF_2DASH_2DOT'
    ]
    for (const name of names) {
      const key = resolveLineTypeNameKey(name)?.key
      expect(key && key in enEntity.lineTypeName).toBe(true)
    }
  })

  it('translates standard, SXF, ISO and variant names in Japanese', () => {
    expect(displayName('Continuous')).toBe('実線')
    expect(displayName('HIDDEN')).toBe('破線 (隠れ線)')
    expect(displayName('CENTER')).toBe('一点鎖線 (中心線)')
    expect(displayName('DASHED2')).toBe('破線 (2)')
    expect(displayName('PHANTOMX2')).toBe('二点鎖線 (想像線) (×2)')
    expect(displayName('SXF_CHAIN_2DASH')).toBe('二点鎖線')
    expect(displayName('SXF_2DASH_3DOT')).toBe('三点二短鎖線')
    expect(displayName('ACAD_ISO10W100')).toBe('一点短鎖線')
  })

  it('keeps user-defined names unchanged', () => {
    expect(resolveLineTypeNameKey('MY_FENCE')).toBeUndefined()
    expect(resolveLineTypeNameKey('LAYOUT2')).toBeUndefined()
    expect(displayName('MY_FENCE')).toBe('MY_FENCE')
  })
})
