import { MongoClient } from 'mongodb'

import { buildTtlIndexSpecs, ensureIndexes, getAllIndexSpecs, readTtlOptionsFromEnv } from '../src/acore/mongo/indexes'

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

  it('creates every expected index (static + TTL) on the first run', async () => {
    const db = client.db(dbName)
    const results = await ensureIndexes(db)
    const allSpecs = getAllIndexSpecs()
    expect(results.length).toBe(allSpecs.length)
    expect(results.every((r) => r.action === 'created')).toBe(true)
  })

  it('is idempotent — a second run creates nothing', async () => {
    const db = client.db(dbName)
    const results = await ensureIndexes(db)
    const allSpecs = getAllIndexSpecs()
    expect(results.length).toBe(allSpecs.length)
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

  it('every spec in getAllIndexSpecs() is materialized in its collection', async () => {
    const db = client.db(dbName)
    for (const spec of getAllIndexSpecs()) {
      const indexes = await db.collection(spec.collection).indexes()
      const found = indexes.find((i) => i.name === spec.name)
      expect(found).toBeDefined()
    }
  })

  it('TTL indexes carry expireAfterSeconds matching the runtime config (T2-A06, T2-A07)', async () => {
    const db = client.db(dbName)
    const ttl = readTtlOptionsFromEnv()
    const expectedTtlSpecs = buildTtlIndexSpecs(ttl)
    for (const spec of expectedTtlSpecs) {
      const indexes = (await db.collection(spec.collection).indexes()) as Array<{ name?: string; expireAfterSeconds?: number }>
      const found = indexes.find((i) => i.name === spec.name)
      expect(found).toBeDefined()
      expect(found?.expireAfterSeconds).toBe(spec.options?.expireAfterSeconds)
    }
  })

  it('recreates a TTL index when expireAfterSeconds changes (env bump path)', async () => {
    const db = client.db(dbName)
    // Bump the changelog TTL by passing an explicit value larger than the default.
    const bumped = { changelogTtlSec: 99 * 86400, syncRunTtlSec: 30 * 86400 }
    const results = await ensureIndexes(db, undefined, bumped)
    const recreated = results.find((r) => r.collection === 'raw_record_changelog' && r.name === 'createdAt_ttl')
    expect(recreated?.action).toBe('recreated')

    const indexes = (await db.collection('raw_record_changelog').indexes()) as Array<{ name?: string; expireAfterSeconds?: number }>
    const ttlIdx = indexes.find((i) => i.name === 'createdAt_ttl')
    expect(ttlIdx?.expireAfterSeconds).toBe(99 * 86400)

    // Restore default so subsequent suite ordering is deterministic.
    await ensureIndexes(db, undefined, readTtlOptionsFromEnv())
  })
})
