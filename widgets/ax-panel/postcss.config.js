// Consumed by the Mendix rollup build (rollup-plugin-postcss is patched with `config: true`
// so it loads this file). tailwindcss resolves the @apply utilities in the SCSS; autoprefixer
// adds vendor prefixes.
module.exports = {
  plugins: {
    tailwindcss: { config: './tailwind.config.js' },
    autoprefixer: {},
  },
}
