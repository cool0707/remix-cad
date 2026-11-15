import { resolve } from 'path'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { defineConfig, PluginOption } from 'vite'

import { createLibEntryFileName } from '../vite-config/pluginRollupOutput'

const pluginId = 'cad-acadrust-converter'

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        node: resolve(__dirname, 'src/node.ts')
      },
      name: pluginId,
      formats: ['es'],
      fileName: (format, entryName) =>
        entryName === 'node'
          ? 'node.js'
          : createLibEntryFileName(pluginId, format, entryName)
    },
    minify: true,
    rollupOptions: {
      // `node.ts` is the only user of Node built-ins and stays a separate
      // entry, so the browser bundle never references them.
      external: [/^node:/]
    }
  },
  plugins: [peerDepsExternal() as PluginOption]
})
