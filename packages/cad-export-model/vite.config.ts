import { resolve } from 'path'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { defineConfig, PluginOption } from 'vite'

import {
  createLibEntryFileName,
  createLibRollupOutput
} from '../vite-config/pluginRollupOutput'

const pluginId = 'cad-export-model'

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: { index: resolve(__dirname, 'src/index.ts') },
      name: pluginId,
      // ES only, like the other converters (a UMD build conflicts with the
      // shared manualChunks output).
      formats: ['es'],
      fileName: (format, entryName) =>
        createLibEntryFileName(pluginId, format, entryName)
    },
    minify: true,
    rollupOptions: {
      output: createLibRollupOutput(pluginId)
    }
  },
  plugins: [peerDepsExternal() as PluginOption]
})
