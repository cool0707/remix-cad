/**
 * @jest-environment jsdom
 */
import { AcEdFloatingInputBoxes } from '../src/editor/input/ui/AcEdFloatingInputBoxes'

function createBoxes(onKeyword: (text: string) => boolean) {
  const parent = document.createElement('div')
  document.body.appendChild(parent)
  const onCommit = jest.fn()
  new AcEdFloatingInputBoxes<number>({
    parent,
    twoInputs: true,
    validate: raw => {
      const x = Number(raw.x)
      const y = Number(raw.y)
      const ok = raw.x !== '' && Number.isFinite(x) && Number.isFinite(y)
      return { isValid: ok, value: ok ? x : undefined }
    },
    onCommit,
    onKeyword,
    autoFocus: false
  })
  const [xInput] = Array.from(parent.querySelectorAll('input'))
  return { xInput, onCommit }
}

function typeAndEnter(input: HTMLInputElement, text: string) {
  input.value = text
  input.dispatchEvent(new Event('input'))
  input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
}

describe('AcEdFloatingInputBoxes keyword input', () => {
  it('passes non-numeric text to onKeyword on Enter (PLINE "A" = Arc)', () => {
    const onKeyword = jest.fn(() => true)
    const { xInput, onCommit } = createBoxes(onKeyword)
    typeAndEnter(xInput, ' A ')
    expect(onKeyword).toHaveBeenCalledWith('A')
    expect(onCommit).not.toHaveBeenCalled()
    expect(xInput.classList.contains('invalid')).toBe(false)
  })

  it('marks the input invalid when the text is not a keyword', () => {
    const onKeyword = jest.fn(() => false)
    const { xInput } = createBoxes(onKeyword)
    typeAndEnter(xInput, 'Q')
    expect(onKeyword).toHaveBeenCalledWith('Q')
    expect(xInput.classList.contains('invalid')).toBe(true)
  })

  it('picks a keyword as soon as its letter is pressed', () => {
    const onKeyword = jest.fn((text: string, instant?: boolean) =>
      Boolean(instant && text === 'a')
    )
    const { xInput, onCommit } = createBoxes(onKeyword)
    const press = (key: string, init: KeyboardEventInit = {}) => {
      const event = new KeyboardEvent('keydown', {
        key,
        cancelable: true,
        ...init
      })
      xInput.dispatchEvent(event)
      return event
    }

    expect(press('a').defaultPrevented).toBe(true)
    expect(onKeyword).toHaveBeenLastCalledWith('a', true)

    // Not a keyword: the letter is typed as usual.
    expect(press('q').defaultPrevented).toBe(false)
    // Digits, Ctrl shortcuts and IME composition never trigger keywords.
    onKeyword.mockClear()
    press('5')
    press('a', { ctrlKey: true })
    press('a', { isComposing: true })
    expect(onKeyword).not.toHaveBeenCalled()
    expect(onCommit).not.toHaveBeenCalled()
  })
})
