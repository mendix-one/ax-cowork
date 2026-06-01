// Sim PostCSS config — Tailwind config below covers both sim source and the
// widget source it imports, so .scss in either tree gets utility classes.
export default {
  plugins: {
    tailwindcss: { config: './tailwind.config.js' },
    autoprefixer: {},
  },
}
