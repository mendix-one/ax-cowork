// Reuse the repo-wide Prettier style (root .prettierrc.json) so the widget formats
// identically to react-app, then re-add the XML plugin for the Mendix .xml files
// (AxSignin.xml / package.xml) — the root config ships an empty plugins list.
const base = require('../../.prettierrc.json')

module.exports = {
  ...base,
  plugins: [require.resolve('@prettier/plugin-xml')],
}
