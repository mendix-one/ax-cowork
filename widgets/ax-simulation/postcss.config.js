// Consumed by the Mendix rollup build (rollup-plugin-postcss is patched with `config: true`
// so it loads this file). The layout SCSS is plain (no @tailwind directives), so tailwindcss
// is a no-op here; autoprefixer adds vendor prefixes. Kept for build parity with ax-signin.
module.exports = {
  plugins: {
    tailwindcss: { config: './tailwind.config.js' },
    autoprefixer: {},
  },
}
