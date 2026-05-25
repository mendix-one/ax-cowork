import { MongoClient } from 'mongodb'

import { ensureIndexes } from './acore/mongo/indexes'

async function main(): Promise<void> {
  const uri = process.env.MONGO_URI
  const dbName = process.env.MONGO_DB_NAME
  if (!uri) throw new Error('MONGO_URI is required')
  if (!dbName) throw new Error('MONGO_DB_NAME is required')

  const client = new MongoClient(uri)
  await client.connect()
  try {
    const db = client.db(dbName)
    const results = await ensureIndexes(db, (msg) => console.log(msg))
    const created = results.filter((r) => r.action === 'created').length
    const existed = results.filter((r) => r.action === 'existed').length
    const recreated = results.filter((r) => r.action === 'recreated').length
    console.log(`Done. created=${created} existed=${existed} recreated=${recreated} total=${results.length}`)
  } finally {
    await client.close()
  }
}

main().catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})
