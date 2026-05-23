// Sync the freshly-built UI assets into ax-cowork-be's static folder so the
// Nest server can serve them from /assets/*. Runs as the last step of `pnpm build`.
import { cpSync, existsSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const uiRoot = resolve(here, '..')
const src = resolve(uiRoot, 'dist/assets')
const dst = resolve(uiRoot, '../ax-coworker-be/public/assets')

if (!existsSync(src)) {
  console.error(`postbuild: source not found: ${src}`)
  process.exit(1)
}

rmSync(dst, { recursive: true, force: true })
cpSync(src, dst, { recursive: true })

console.log(`postbuild: ${src} -> ${dst}`)
