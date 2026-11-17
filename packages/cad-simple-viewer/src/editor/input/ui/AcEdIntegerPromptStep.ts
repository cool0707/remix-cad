import type { AcEdPromptIntegerOptions } from '../prompt/AcEdPromptIntegerOptions'

/**
 * Range and wheel stepping of an integer prompt (counts such as polygon
 * sides or array items), following its limits and zero / negative rules.
 */
type AcEdIntegerPromptRules = Pick<
  AcEdPromptIntegerOptions,
  'lowerLimit' | 'upperLimit' | 'allowZero' | 'allowNegative'
>

/**
 * Smallest and largest values the prompt accepts (either end may be
 * infinite), and `start`: the value to open with when there is no default.
 */
export function acedIntegerPromptRange(options: AcEdIntegerPromptRules) {
  let min =
    options.lowerLimit ?? (options.allowNegative ? Number.NEGATIVE_INFINITY : 0)
  if (!options.allowNegative) min = Math.max(min, 0)
  if (min === 0 && !options.allowZero) min = 1
  const max = options.upperLimit ?? Number.POSITIVE_INFINITY
  // An open lower end still needs somewhere to start.
  const start = Number.isFinite(min) ? min : Math.min(1, max)
  return { min, max, start }
}

/** Nearest value the prompt accepts. */
export function acedClampIntegerPromptValue(
  value: number,
  options: AcEdIntegerPromptRules
) {
  const { min, max, start } = acedIntegerPromptRange(options)
  let v = Number.isFinite(value) ? Math.round(value) : start
  v = Math.min(max, Math.max(min, v))
  if (v === 0 && !options.allowZero) v = 1
  return Math.min(max, v)
}

/** Value after one wheel notch (+1 up / -1 down), skipping a disallowed 0. */
export function acedStepIntegerPromptValue(
  value: number,
  direction: 1 | -1,
  options: AcEdIntegerPromptRules
) {
  let next = Math.round(value) + direction
  if (next === 0 && !options.allowZero) next += direction
  const { min, max } = acedIntegerPromptRange(options)
  if (next < min || next > max)
    return acedClampIntegerPromptValue(value, options)
  return next
}
