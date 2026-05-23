import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import preserveDirectives from 'rollup-plugin-preserve-directives'

import dts from 'vite-plugin-dts'
import pkg from './package.json'

const env = process.env

const type = (env && env.type) || 'enterprise'
//const sources = !!(env && env.sources);
const sources = false
//let production = sources ? false : true;
let production = false

const defineValues = {
  VERSION: `"${pkg.version}"`,
  LICENSE: `"${type}"`,
  PRODUCTION: production,
  GPL: type === 'gpl',
}

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      outDir: 'dist/types',
      tsconfigPath: 'tsconfig.build.json',
    }),
    preserveDirectives(),
  ],
  define: defineValues,
  build: {
    sourcemap: true,
    minify: false,
    lib: {
      entry: './src/index.tsx',
      name: 'GanttReact',
      formats: ['es'],
      fileName: (format) => `dhtmlxgantt.react.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJsxRuntime',
        },
        banner: '"use client";', // nextjs compatibility
      },
    },
    esbuild: {
      banner: '"use client";',
      legalComments: 'none',
    },
  },
})
