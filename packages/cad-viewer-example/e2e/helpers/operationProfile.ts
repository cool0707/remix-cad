import type { Page } from '@playwright/test'

/** localStorage key of the example app's settings (see App.vue). */
const SETTINGS_KEY = 'mlightcad.settings.cad-viewer'

/**
 * Starts the page with the CAD (classic) operation profile, for tests that
 * drive AutoCAD-style flows (every click adds, LINE goes on until Enter).
 * Call before `page.goto`.
 */
export async function useCadProfile(page: Page) {
  await page.addInitScript(key => {
    let stored: Record<string, unknown> = {}
    try {
      stored = JSON.parse(localStorage.getItem(key) ?? '{}')
    } catch {
      // Start from scratch.
    }
    localStorage.setItem(
      key,
      JSON.stringify({
        ...stored,
        operationProfile: 'cad',
        selectionStyle: 'cad'
      })
    )
  }, SETTINGS_KEY)
}
