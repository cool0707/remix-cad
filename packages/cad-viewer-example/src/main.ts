// UI font (self-hosted, unicode-range subsets): keeps Japanese UI text out of
// Chinese system fonts. Drawing text uses the CAD font catalog instead.
import '@fontsource-variable/noto-sans-jp'
import 'element-plus/dist/index.css'

import {
  JWW_PARSER_WORKER_FILE,
  registerJwwConverter
} from '@mlightcad/cad-jww-converter'
import { LIBREDWG_PARSER_WORKER_FILE } from '@mlightcad/cad-simple-viewer'
import { registerSxfConverter } from '@mlightcad/cad-sxf-converter'
import { i18n } from '@mlightcad/cad-viewer'
import ElementPlus from 'element-plus'
import { createApp } from 'vue'

import App from './App.vue'
import { registerDrawingExporters } from './registerExporters'
import { registerLibreDwgConverter } from './registerLibreDwg'

const initApp = () => {
  // Opt into GPL DWG support before the viewer mounts.
  registerLibreDwgConverter(`./assets/${LIBREDWG_PARSER_WORKER_FILE}`)
  // Jw_cad (.jww) through ezjww (MIT, WebAssembly) in a worker.
  const jww = registerJwwConverter(`./assets/${JWW_PARSER_WORKER_FILE}`)
  // SXF (.sfc): TypeScript parser (MIT), no extra assets.
  registerSxfConverter()
  // Save as JWW (same worker) and SXF (SFC / P21).
  registerDrawingExporters(jww)

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
