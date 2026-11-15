import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { brandThemeHtml } from '../vite-config/pluginBrandTheme'
import { exampleRollupOutput } from '../vite-config/pluginRollupOutput'
import {
  ACADRUST_CONVERTER_PACKAGE,
  ACADRUST_WASM_FILE,
  ACADRUST_WORKER_FILE,
  MTEXT_RENDERER_WORKER_FILE
} from '../../tools/worker-assets.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const realdwgRoot = resolve(__dirname, '../../../realdwg-web')
const acadrustDist = `./node_modules/${ACADRUST_CONVERTER_PACKAGE}/dist`

export default defineConfig({
  base: './',
  server: {
    fs: {
      allow: [resolve(__dirname, '../..'), realdwgRoot]
    },
    watch: {
      ignored: ['**/realdwg-web/**']
    }
  },
  build: {
    modulePreload: false,
    minify: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: exampleRollupOutput
    }
  },
  plugins: [
    brandThemeHtml(),
    viteStaticCopy({
      targets: [
        {
          // Fonts and drawing templates (resources/cad-data) served as ./cad-data/
          src: '../../resources/cad-data/**/*',
          dest: 'cad-data',
          rename: { stripBase: 2 }
        },
        {
          src: `./node_modules/@mlightcad/cad-simple-viewer/dist/${MTEXT_RENDERER_WORKER_FILE}`,
          dest: 'workers',
          rename: { stripBase: true }
        },
        {
          // DWG: acadrust worker + wasm (MPL-2.0 engine, MIT wrapper).
          src: [
            `${acadrustDist}/${ACADRUST_WORKER_FILE}`,
            `${acadrustDist}/${ACADRUST_WASM_FILE}`
          ],
          dest: 'workers',
          rename: { stripBase: true }
        }
      ]
    })
  ]
})
