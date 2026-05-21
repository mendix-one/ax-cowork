import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

import { MongoMemoryServer } from 'mongodb-memory-server'

const stateFile = path.join(os.tmpdir(), 'ax-data-integration-e2e-mongo.json')

module.exports = async (): Promise<void> => {
  const instance = await MongoMemoryServer.create()

  process.env.MONGO_URI = instance.getUri()
  process.env.MONGO_DB_NAME = 'ax_data_integration_e2e'

  // Required env for ConfigModule joi validation (see acore/config/config.module.ts).
  process.env.INTEGRATION_API_KEYS = 'e2e-test-key'
  process.env.INTEGRATION_MASTER_KEY_V1 = Buffer.alloc(32, 0).toString('base64')
  process.env.INTEGRATION_MASTER_KEY_CURRENT = '1'

  // Silence pino during e2e runs.
  process.env.LOG_LEVEL = 'silent'

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
