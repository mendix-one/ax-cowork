import dts from 'rollup-plugin-dts'
import { defineConfig } from 'rollup'

export default defineConfig([
  {
    input: 'dist/types/index.d.ts',

    output: {
      file: 'dist/dhtmlxgantt.react.es.d.ts',
      format: 'es',
    },
    plugins: [
      dts({
        respectExternal: true,
      }),
    ],
    external: ['react', 'react-dom'],
  },
])
