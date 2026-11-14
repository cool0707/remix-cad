// UI font (self-hosted, unicode-range subsets): keeps Japanese UI text out of
// Chinese system fonts. Drawing text uses the CAD font catalog instead.
import '@fontsource-variable/noto-sans-jp'
import 'element-plus/dist/index.css'

import {
  ACADRUST_WORKER_FILE,
  registerAcadrustConverter
} from '@mlightcad/cad-acadrust-converter'
import {
  JWW_PARSER_WORKER_FILE,
  registerJwwConverter
} from '@mlightcad/cad-jww-converter'
import { registerSxfConverter } from '@mlightcad/cad-sxf-converter'
import { i18n } from '@mlightcad/cad-viewer'
import ElementPlus from 'element-plus'
import { createApp } from 'vue'

import App from './App.vue'
import { registerDrawingExporters } from './registerExporters'

const initApp = () => {
  // DWG through acadrust (MPL-2.0, WebAssembly) in a worker. DXF keeps the
  // viewer's own reader, which is faster; `?dxf=acadrust` sends DXF through
  // acadrust too (for comparing the two, or for a damaged file).
  const dxfThroughAcadrust =
    new URLSearchParams(window.location.search).get('dxf') === 'acadrust'
  const acadrust = registerAcadrustConverter(
    `./assets/${ACADRUST_WORKER_FILE}`,
    { dxf: dxfThroughAcadrust ? 'engine' : 'native' }
  )
  // Jw_cad (.jww) through ezjww (MIT, WebAssembly) in a worker.
  const jww = registerJwwConverter(`./assets/${JWW_PARSER_WORKER_FILE}`)
  // SXF (.sfc): TypeScript parser (MIT), no extra assets.
  registerSxfConverter()
  // Save as DWG / other DXF versions (acadrust), JWW (ezjww) and SXF.
  registerDrawingExporters(jww, acadrust)

  const app = createApp(App)
  // Required when Vite aliases `@mlightcad/ui-components` to source: those SFCs
  // use `<el-*>` tags without local imports (their own build auto-imports them).
  app.use(ElementPlus)
  app.use(i18n)
  app.mount('#app')
  // Hide the loading spinner
  const loader = document.getElementById('loader')
  if (loader) {
    loader.style.display = 'none'
  }
}

initApp()
