import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    allowedHosts: ['dev.amoza.xyz'],
    // Proxy BE paths so the browser sees everything as same-origin in dev — keeps
    // the HttpOnly session cookie attached without CORS / SameSite=None gymnastics.
    proxy: {
      '/api': { target: 'http://localhost:3000', changeOrigin: true },
      '/signin': { target: 'http://localhost:3000', changeOrigin: true },
      '/signout': { target: 'http://localhost:3000', changeOrigin: true },
    },
  },
})
