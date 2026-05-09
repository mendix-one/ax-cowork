import * as fs from 'fs'

export default () => {
  let scriptFile = null
  let stylesFile = null

  if (fs.existsSync('public/.vite/manifest.json')) {
    const manifest = JSON.parse(fs.readFileSync('public/.vite/manifest.json', 'utf8'))
    scriptFile = manifest['index.html']['file']
    stylesFile = manifest['index.html']['css']
  }

  let displayLanguages = []
  if (fs.existsSync('data/display.json')) {
    displayLanguages = JSON.parse(fs.readFileSync('data/display.json', 'utf8'))
  }

  return {
    ASSETS: {
      script: scriptFile,
      styles: stylesFile
    },
    DISPLAY_LANGUAGES: displayLanguages
  }
}
