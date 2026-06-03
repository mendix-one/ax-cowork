/** @type {import('tailwindcss').Config} */
// Scoped to .ax-display-panel (important + no preflight) so the widget never resets or overrides the
// host Mendix page's styles. The panel SCSS uses @apply utilities; this config resolves them.
module.exports = {
  important: '.ax-display-panel',
  content: ['./src/**/*.{ts,tsx,scss,css}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        'ax-primary': '#3F51B5',
        'ax-secondary': '#009688',
        'ax-tertiary': '#673AB7',
        'ax-error': '#F44336',
        'ax-warning': '#FFC107',
        'ax-info': '#03A9F4',
        'ax-success': '#4CAF50',
      },
    },
  },
  plugins: [],
}
