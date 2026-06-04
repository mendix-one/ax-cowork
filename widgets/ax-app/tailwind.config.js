/** @type {import('tailwindcss').Config} */
// Scoped to .ax-sim (important + no preflight) so the widget never resets or overrides the
// host Mendix page's styles. The layout SCSS currently uses no Tailwind utilities, but the
// config is kept for parity with the other widgets and future use.
module.exports = {
  important: '.ax-sim',
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
