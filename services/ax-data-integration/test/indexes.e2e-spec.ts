import { MongoClient } from 'mongodb'

import { INDEX_SPECS, ensureIndexes } from '../src/acore/mongo/indexes'

describe('ensureIndexes (e2e)', () => {
  let client: MongoClient
  let dbName: string

  beforeAll(async () => {
    const uri = process.env.MONGO_URI
    if (!uri) throw new Error('MONGO_URI must be set by global-setup')
    dbName = `indexes_e2e_${Date.now()}`
    client = new MongoClient(uri)
    await client.connect()
  }, 30_000)

  afterAll(async () => {
    if (client) {
      await client.db(dbName).dropDatabase()
      await client.close()
    }
  })

  it('creates every expected index on the first run', async () => {
    const db = client.db(dbName)
    const results = await ensureIndexes(db)
    expect(results.length).toBe(INDEX_SPECS.length)
    expect(results.every((r) => r.action === 'created')).toBe(true)
  })

  it('is idempotent — a second run creates nothing', async () => {
    const db = client.db(dbName)
    const results = await ensureIndexes(db)
    expect(results.length).toBe(INDEX_SPECS.length)
    expect(results.every((r) => r.action === 'existed')).toBe(true)
  })

  it('sync_runs.running_lock_unique is a partial unique index gated on status=running', async () => {
    const db = client.db(dbName)
    const indexes = await db.collection('sync_runs').indexes()
    const running = indexes.find((i) => i.name === 'running_lock_unique')
    expect(running).toBeDefined()
    expect(running?.unique).toBe(true)
    expect(running?.partialFilterExpression).toEqual({ status: 'running' })
  })

  it('every spec in INDEX_SPECS is materialized in its collection', async () => {
    const db = client.db(dbName)
    for (const spec of INDEX_SPECS) {
      const indexes = await db.collection(spec.collection).indexes()
      const found = indexes.find((i) => i.name === spec.name)
      expect(found).toBeDefined()
    }
  })
})
