import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// The widget packages export their source TSX files directly — Vite compiles them
// on the fly. The path alias lets sim pages import widget container components
// without going through the Mendix build pipeline.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@axsignin': fileURLToPath(new URL('../widgets/ax-signin/src', import.meta.url)),
      '@axsimulation': fileURLToPath(new URL('../widgets/ax-simulation/src', import.meta.url)),
      '@axpanel': fileURLToPath(new URL('../widgets/ax-panel/src', import.meta.url)),
      // Resolve the shared lib to its TS source too, so Vite compiles real ESM on
      // the fly instead of serving the CommonJS dist build (whose named exports
      // aren't statically analyzable as native browser ESM).
      '@ax/common': fileURLToPath(new URL('../shared/ax-common/src', import.meta.url)),
      // AxDisplayPanel imports the Mendix `<Icon>` component. Alias the subpath to our mock —
      // this entry must precede the bare `mendix` alias so it wins the more specific match.
      'mendix/components/web/Icon': fileURLToPath(new URL('./src/mock/mendix-icon.tsx', import.meta.url)),
      // The Mendix widget's typings import from "mendix" — alias to our mock so
      // type stripping has a real module to resolve when Vite walks the imports.
      mendix: fileURLToPath(new URL('./src/mock/mendix.ts', import.meta.url)),
    },
  },
  server: {
    port: 5174,
    // Pre-warm the widget source so the first navigation isn't slow.
    warmup: {
      clientFiles: ['./src/main.tsx'],
    },
  },
})
