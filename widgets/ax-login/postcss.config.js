// Consumed by the Mendix rollup build (rollup-plugin-postcss is patched with `config: true`
// so it loads this file) and by any tooling that reads a PostCSS config. tailwindcss expands
// the @tailwind directives in src/ui/styles; autoprefixer adds vendor prefixes.
module.exports = {
  plugins: {
    tailwindcss: { config: './tailwind.config.js' },
    autoprefixer: {},
  },
}
