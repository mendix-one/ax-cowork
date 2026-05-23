import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

import { MongoMemoryServer } from 'mongodb-memory-server'

const stateFile = path.join(os.tmpdir(), 'ax-sso-services-e2e-mongo.json')

module.exports = async (): Promise<void> => {
  const instance = await MongoMemoryServer.create()

  process.env.MONGODB_URI = instance.getUri()
  process.env.API_KEYS = 'e2e-test-key'
  // Deterministic JWT secret for e2e — long enough to satisfy the joi `min(16)` rule.
  process.env.JWT_SECRET = 'e2e-jwt-secret-do-not-use-in-production'
  process.env.JWT_EXPIRES_IN = '24h'

  const info = instance.instanceInfo as { pid?: number; dbPath?: string } | undefined

  fs.writeFileSync(
    stateFile,
    JSON.stringify({
      uri: instance.getUri(),
      pid: info?.pid,
      dbPath: info?.dbPath,
    }),
  )
}
