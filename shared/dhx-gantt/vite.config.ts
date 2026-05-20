import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const defineValues = {
  VERSION: '"1.0.0"',
  LICENSE: '"gpl"',
  PRODUCTION: 'false',
  GPL: 'true',
  BUILD_TIMESTAMP: String(Date.now()),
}

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      outDir: 'dist',
      include: ['src/**/*.ts'],
      exclude: ['node_modules', 'dist', 'vite.config.ts'],
      rollupTypes: true,
    }),
  ],
  define: defineValues,
  resolve: {
    alias: [{ find: 'remote-client', replacement: path.resolve(__dirname, 'stubs/remote-client.js') }],
  },
  build: {
    sourcemap: true,
    minify: false,
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: './src/dhtmlxgantt.web.ts',
      formats: ['es'],
      fileName: () => 'dhtmlxgantt.es.js',
    },
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        assetFileNames: (asset) => (asset.name?.endsWith('.css') ? 'dhtmlxgantt.css' : (asset.name ?? '[name][extname]')),
      },
    },
  },
})
