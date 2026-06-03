// Reuse the repo-wide Prettier style (root .prettierrc.json), then re-add the XML plugin for
// the Mendix .xml files (AxDisplayPanel.xml / package.xml) — the root config ships no plugins.
const base = require('../../.prettierrc.json')

module.exports = {
  ...base,
  plugins: [require.resolve('@prettier/plugin-xml')],
}
