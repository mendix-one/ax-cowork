import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { MongoClient } from 'mongodb'

import { MainModule } from '../src/main.module'
import { getAllIndexSpecs } from '../src/acore/mongo/indexes'

/**
 * T2-A01: MongoModule.onApplicationBootstrap must auto-run `ensureIndexes()` so a fresh
 * deploy never lands in the "indexes missing → overlapping runs allowed" trap.
 *
 * Strategy: drop the configured e2e DB before booting MainModule, then assert every spec
 * is materialized. Stronger signal than just listing indexes (which may have been pre-warmed
 * by other e2e suites in the run).
 */
describe('MongoModule auto-ensures indexes on boot (T2-A01)', () => {
  let app: INestApplication
  let client: MongoClient

  beforeAll(async () => {
    const uri = process.env.MONGO_URI
    const dbName = process.env.MONGO_DB_NAME
    if (!uri || !dbName) throw new Error('MONGO env not set by global-setup')

    // Drop the DB first — this wipes both collections and any indexes prior tests created
    // via manual ensureIndexes calls. The only way indexes can exist after boot is via
    // MongoModule.onApplicationBootstrap.
    client = new MongoClient(uri)
    await client.connect()
    await client.db(dbName).dropDatabase()

    const moduleFixture = await Test.createTestingModule({ imports: [MainModule] }).compile()
    app = moduleFixture.createNestApplication()
    await app.init() // onApplicationBootstrap fires here
  }, 60_000)

  afterAll(async () => {
    if (app) await app.close()
    if (client) await client.close()
  })

  it('every index spec (static + TTL) is materialized in a freshly-dropped DB without anyone calling ensureIndexes manually', async () => {
    const db = client.db(process.env.MONGO_DB_NAME)
    for (const spec of getAllIndexSpecs()) {
      const indexes = (await db.collection(spec.collection).indexes()) as Array<{ name?: string; expireAfterSeconds?: number }>
      const found = indexes.find((i) => i.name === spec.name)
      expect(found).toBeDefined()
      if (spec.options?.expireAfterSeconds !== undefined) {
        expect(found?.expireAfterSeconds).toBe(spec.options.expireAfterSeconds)
      }
    }
  })

  it('the sync_runs partial-unique lock is in place — proves the recovery path from S6/S7 works', async () => {
    const db = client.db(process.env.MONGO_DB_NAME)
    const indexes = await db.collection('sync_runs').indexes()
    const lock = indexes.find((i) => i.name === 'running_lock_unique')
    expect(lock?.unique).toBe(true)
    expect(lock?.partialFilterExpression).toEqual({ status: 'running' })
  })
})
