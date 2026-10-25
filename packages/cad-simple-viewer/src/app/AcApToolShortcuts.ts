/**
 * Single-key tool shortcuts of the simple operation profile, keyed by
 * `KeyboardEvent.code` (layout independent, works with IME on). Values are
 * the tools' command global names.
 */
export const ACAP_TOOL_SHORTCUTS: Readonly<Record<string, string>> = {
  KeyV: 'select',
  KeyH: 'pan',
  KeyL: 'line',
  KeyR: 'rectang',
  KeyT: 'mtext'
}
