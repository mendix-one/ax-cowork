import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

import { MongoMemoryServer } from 'mongodb-memory-server'

const stateFile = path.join(os.tmpdir(), 'ax-sso-services-e2e-mongo.json')

module.exports = async (): Promise<void> => {
  const instance = await MongoMemoryServer.create()

  process.env.MONGODB_URI = instance.getUri()
  process.env.API_KEYS = 'e2e-test-key'

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
