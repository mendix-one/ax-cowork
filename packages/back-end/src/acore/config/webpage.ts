import * as fs from 'fs'

export default () => {
  const scripts: string[] = []
  const styles: string[] = []

  const files = fs.readdirSync('public/assets')
  for (const file of files) {
    if (file.endsWith('.js')) {
      scripts.push(`/assets/${file}`)
    } else if (file.endsWith('.css')) {
      styles.push(`/assets/${file}`)
    }
  }

  return {
    WEBAPP_SCRIPTS: scripts, WEBPAGE_STYLES: styles
  }
}
