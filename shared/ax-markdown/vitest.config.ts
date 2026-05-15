import { defineConfig } from 'vitest/config'

// Schemas + source-ops are pure TS — node env is enough.
// If a future test mounts a component, switch to jsdom + add @vitejs/plugin-react.
export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: ['src/**/*.{test,spec}.ts'],
  },
})
