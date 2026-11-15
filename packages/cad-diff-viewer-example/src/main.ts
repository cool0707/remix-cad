// UI font (self-hosted, unicode-range subsets): keeps Japanese UI text out of
// Chinese system fonts. Drawing text uses the CAD font catalog instead.
import '@fontsource-variable/noto-sans-jp'

import {
  ACADRUST_WORKER_FILE,
  registerAcadrustConverter
} from '@mlightcad/cad-acadrust-converter'
import { AcApDiffViewer } from '@mlightcad/cad-diff-viewer'
import {
  AcApI18n,
  type AcApLocale,
  MTEXT_RENDERER_WORKER_FILE
} from '@mlightcad/cad-simple-viewer'

/** Picks an {@link AcApLocale} from `navigator.language`. */
function detectLocale(): AcApLocale {
  const lang = (
    new URLSearchParams(window.location.search).get('lang') ??
    navigator.language
  ).toLowerCase()
  if (lang.startsWith('ja')) return 'ja'
  if (lang.startsWith('zh')) return 'zh'
  if (lang.startsWith('tr')) return 'tr'
  if (lang.startsWith('cs')) return 'cs'
  if (lang.startsWith('ar')) return 'ar'
  return 'en'
}

const locale = detectLocale()
AcApI18n.setCurrentLocale(locale)
document.documentElement.lang = locale

const host = document.getElementById('diff-host')
if (!host) {
  throw new Error('Diff viewer demo markup is missing')
}

// DWG through acadrust (MPL-2.0, WebAssembly) in a worker.
const dwgParserUrl = `./workers/${ACADRUST_WORKER_FILE}`
registerAcadrustConverter(dwgParserUrl)

new AcApDiffViewer({
  container: host,
  baseUrl: './cad-data/',
  webworkerFileUrls: {
    mtextRender: `./workers/${MTEXT_RENDERER_WORKER_FILE}`,
    dwgParser: dwgParserUrl
  }
})
