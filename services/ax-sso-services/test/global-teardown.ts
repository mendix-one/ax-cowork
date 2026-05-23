import { execSync } from 'child_process'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

const stateFile = path.join(os.tmpdir(), 'ax-sso-services-e2e-mongo.json')

module.exports = (): void => {
  if (!fs.existsSync(stateFile)) return
  const state = JSON.parse(fs.readFileSync(stateFile, 'utf-8')) as { pid?: number }
  fs.unlinkSync(stateFile)
  if (!state.pid) return
  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /F /PID ${state.pid}`, { stdio: 'ignore' })
    } else {
      process.kill(state.pid)
    }
  } catch {
    // mongod already exited — ignore
  }
}
