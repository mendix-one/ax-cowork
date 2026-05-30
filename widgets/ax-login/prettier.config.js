// Keep in sync with the workspace root .prettierrc.json.
// (The Mendix-shipped @prettier/plugin-xml@1.2.0 isn't compatible with Prettier 3
// and crashes on .tsx, so we don't include it here. Run prettier --plugin=...
// on XML files explicitly if you need them reformatted.)
module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  useTabs: false,
  printWidth: 160,
  arrowParens: 'always',
  endOfLine: 'lf',
  bracketSpacing: true,
  jsxSingleQuote: false,
  bracketSameLine: false,
}
