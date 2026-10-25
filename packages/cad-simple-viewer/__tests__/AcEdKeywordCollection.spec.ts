import { AcEdKeywordCollection } from '../src/editor/input/prompt/AcEdKeywordCollection'
import { AcEdPromptKeywordOptions } from '../src/editor/input/prompt/AcEdPromptKeywordOptions'

describe('AcEdKeywordCollection prompt format', () => {
  test('formats as [Keywords] <Default>:', () => {
    const keywords = new AcEdKeywordCollection()
    const yes = keywords.add('Yes', 'Yes', 'Yes')
    keywords.add('No', 'No', 'No')
    keywords.default = yes

    const format = keywords.getPromptFormat()
    expect(format.visibleKeywords).toEqual(['Yes', 'No'])
    expect(format.defaultKeyword).toBe('Yes')
    expect(format.formattedTail).toBe('[Yes/No] <Yes>:')
  })

  test('omits default segment when no default is set', () => {
    const keywords = new AcEdKeywordCollection()
    keywords.add('Yes', 'Yes', 'Yes')
    keywords.add('No', 'No', 'No')

    const format = keywords.getPromptFormat()
    expect(format.defaultKeyword).toBeUndefined()
    expect(format.formattedTail).toBe('[Yes/No]:')
  })

  test('PromptOptions delegates format through getKeywordPromptFormat()', () => {
    const options = new AcEdPromptKeywordOptions('Specify option')
    const yes = options.keywords.add('Yes', 'Yes', 'Yes')
    options.keywords.add('No', 'No', 'No')
    options.keywords.default = yes

    const format = options.getKeywordPromptFormat()
    expect(format.formattedTail).toBe('[Yes/No] <Yes>:')
  })

  test('valueDefaultDisplayText is preferred after keywords when no keyword default', () => {
    const options = new AcEdPromptKeywordOptions('Specify distance')
    options.keywords.add('Through', 'Through', 'Through')
    options.valueDefaultDisplayText = '10.5'

    expect(options.getKeywordPromptFormat().defaultKeyword).toBeUndefined()
    expect(options.valueDefaultDisplayText).toBe('10.5')
  })
})

describe('AcEdKeywordCollection.findByName shortcuts', () => {
  const pline = () => {
    const keywords = new AcEdKeywordCollection()
    keywords.add('角度(A)', 'Angle', '角度')
    keywords.add('中心(CE)', 'Center', '中心')
    keywords.add('線分(L)', 'Line', '線分')
    keywords.add('閉じる(C)', 'Close', '閉じる')
    return keywords
  }

  test('parses the display shortcut', () => {
    const keywords = pline()
    expect(keywords.findByName('Center')?.shortcut).toBe('CE')
    expect(keywords.findByName('Line')?.shortcut).toBe('L')
  })

  test('prefers a display shortcut over another keyword alias', () => {
    const keywords = pline()
    // Center's alias is also "C"; Close shows C, Center shows CE.
    expect(keywords.findByName('C')?.globalName).toBe('Close')
    expect(keywords.findByName('ce')?.globalName).toBe('Center')
    expect(keywords.findByName('a')?.globalName).toBe('Angle')
  })

  test('still matches global, local and alias names', () => {
    const keywords = pline()
    expect(keywords.findByName('center')?.globalName).toBe('Center')
    expect(keywords.findByName('中心')?.globalName).toBe('Center')
    expect(keywords.findByName('_Close')?.globalName).toBe('Close')
    expect(keywords.findByName('_C')).toBeUndefined()

    const plain = new AcEdKeywordCollection()
    plain.add('Merkez(M)', 'Center', 'Merkez')
    expect(plain.findByName('M')?.globalName).toBe('Center')
    expect(plain.findByName('C')?.globalName).toBe('Center')
  })
})
