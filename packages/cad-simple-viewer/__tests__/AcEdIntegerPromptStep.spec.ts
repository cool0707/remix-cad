import { AcEdPromptIntegerOptions } from '../src/editor/input/prompt/AcEdPromptIntegerOptions'
import {
  acedClampIntegerPromptValue,
  acedIntegerPromptRange,
  acedStepIntegerPromptValue
} from '../src/editor/input/ui/AcEdIntegerPromptStep'

describe('integer prompt wheel stepping', () => {
  it('steps within the limits and stops at both ends', () => {
    const o = new AcEdPromptIntegerOptions('sides', 3, 5)
    expect(acedIntegerPromptRange(o)).toEqual({ min: 3, max: 5, start: 3 })
    expect(acedStepIntegerPromptValue(4, 1, o)).toBe(5)
    expect(acedStepIntegerPromptValue(5, 1, o)).toBe(5)
    expect(acedStepIntegerPromptValue(3, -1, o)).toBe(3)
  })

  it('starts from the smallest allowed value without a lower limit', () => {
    const o = new AcEdPromptIntegerOptions('count')
    o.allowZero = false
    expect(acedIntegerPromptRange(o).start).toBe(1)
    expect(acedClampIntegerPromptValue(0, o)).toBe(1)
    expect(acedStepIntegerPromptValue(1, -1, o)).toBe(1)
  })

  it('skips zero when it is not allowed but negatives are', () => {
    const o = new AcEdPromptIntegerOptions('offset')
    o.allowNegative = true
    o.allowZero = false
    expect(acedStepIntegerPromptValue(1, -1, o)).toBe(-1)
    expect(acedStepIntegerPromptValue(-1, 1, o)).toBe(1)
  })

  it('clamps an out-of-range default', () => {
    const o = new AcEdPromptIntegerOptions('n', 2, 10)
    expect(acedClampIntegerPromptValue(50, o)).toBe(10)
    expect(acedClampIntegerPromptValue(Number.NaN, o)).toBe(2)
  })
})
