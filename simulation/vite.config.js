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
      '@axlogin': fileURLToPath(new URL('../widgets/ax-login/src', import.meta.url)),
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
