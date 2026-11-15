import { copyFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { defineConfig } from 'vite'

import { ACADRUST_WASM_FILE, ACADRUST_WORKER_FILE } from './src/constants'

/**
 * Builds dist/acadrust-worker.js and copies the engine next to it.
 *
 * The engine (`wasm/acadrust-engine.wasm`) is built from `engine/` with
 * `pnpm build:wasm` and checked in, so building the viewer does not need a
 * Rust toolchain.
 */
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/engineWorker.ts'),
      name: 'acadrustWorker',
      formats: ['iife'],
      fileName: () => ACADRUST_WORKER_FILE
    },
    minify: true
  },
  plugins: [
    {
      name: 'copy-acadrust-wasm',
      closeBundle() {
        const source = resolve(__dirname, 'wasm', ACADRUST_WASM_FILE)
        if (!existsSync(source)) {
          throw new Error(
            `${source} is missing. Build it with: pnpm --filter @mlightcad/cad-acadrust-converter build:wasm`
          )
        }
        copyFileSync(source, resolve(__dirname, 'dist', ACADRUST_WASM_FILE))
      }
    }
  ]
})
