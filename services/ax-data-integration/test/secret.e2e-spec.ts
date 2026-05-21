import { ConflictException, NotFoundException } from '@nestjs/common'
import { type Db, MongoClient, ObjectId } from 'mongodb'

import { MASTER_KEY_BYTES, SecretService as CryptoSecretService } from '../src/acore/crypto'
import { ensureIndexes } from '../src/acore/mongo/indexes'
import { JobConfigRepository } from '../src/domain/job-config/job-config.repository'
import { SecretRepository } from '../src/domain/secret/secret.repository'
import { SecretsService } from '../src/domain/secret/secret.service'

describe('SecretsService (e2e)', () => {
  let client: MongoClient
  let db: Db
  let service: SecretsService

  beforeAll(async () => {
    const uri = process.env.MONGO_URI
    if (!uri) throw new Error('MONGO_URI must be set by global-setup')
    client = new MongoClient(uri)
    await client.connect()
    db = client.db(`secrets_e2e_${Date.now()}`)
    await ensureIndexes(db)

    const repo = new SecretRepository(db)
    const crypto = new CryptoSecretService({
      currentVersion: 1,
      keys: new Map([[1, Buffer.alloc(MASTER_KEY_BYTES, 0x42)]]),
    })
    service = new SecretsService(repo, crypto, new JobConfigRepository(db))
  }, 30_000)

  afterAll(async () => {
    if (client) {
      await client.db(db.databaseName).dropDatabase()
      await client.close()
    }
  })

  it('creates a secret, returns a summary with no ciphertext, and round-trips the plaintext', async () => {
    const summary = await service.create({
      name: 'oracle-prod-readonly',
      type: 'db',
      plaintext: 'super-secret-password',
      createdBy: 'test',
    })
    expect(summary.name).toBe('oracle-prod-readonly')
    expect(summary.type).toBe('db')
    expect(summary.keyVersion).toBe(1)
    expect(summary).not.toHaveProperty('encrypted')
    expect(summary).not.toHaveProperty('plaintext')

    const plaintext = await service.revealPlaintext(new ObjectId(summary.id))
    expect(plaintext).toBe('super-secret-password')
  })

  it('rejects creating a secret with a duplicate name', async () => {
    await service.create({ name: 'dup', type: 'api', plaintext: 'x', createdBy: 'test' })
    await expect(service.create({ name: 'dup', type: 'api', plaintext: 'y', createdBy: 'test' })).rejects.toBeInstanceOf(ConflictException)
  })

  it('updates plaintext → re-encrypts (new IV) and round-trip yields new value', async () => {
    const summary = await service.create({ name: 'rotate-me', type: 'api', plaintext: 'old', createdBy: 'test' })
    const id = new ObjectId(summary.id)

    const updated = await service.update(id, { plaintext: 'new' })
    expect(updated.id).toBe(summary.id)

    expect(await service.revealPlaintext(id)).toBe('new')
  })

  it('updates name without touching ciphertext when plaintext is omitted', async () => {
    const summary = await service.create({ name: 'will-rename', type: 'db', plaintext: 'unchanged', createdBy: 'test' })
    const id = new ObjectId(summary.id)
    const before = await db.collection('secrets').findOne({ _id: id })

    await service.update(id, { name: 'renamed' })

    const after = await db.collection('secrets').findOne({ _id: id })
    expect(after?.name).toBe('renamed')
    expect(after?.encrypted).toEqual(before?.encrypted)
    expect(await service.revealPlaintext(id)).toBe('unchanged')
  })

  it('delete removes the doc; further reads throw NotFound', async () => {
    const summary = await service.create({ name: 'goodbye', type: 'file', plaintext: 'x', createdBy: 'test' })
    const id = new ObjectId(summary.id)
    await service.delete(id)
    await expect(service.getById(id)).rejects.toBeInstanceOf(NotFoundException)
    await expect(service.delete(id)).rejects.toBeInstanceOf(NotFoundException)
  })

  it('list returns summaries in newest-first order', async () => {
    await service.create({ name: 'list-a', type: 'api', plaintext: 'a', createdBy: 'test' })
    await new Promise((r) => setTimeout(r, 5))
    await service.create({ name: 'list-b', type: 'api', plaintext: 'b', createdBy: 'test' })

    const all = await service.list()
    const names = all.map((s) => s.name)
    const idxA = names.indexOf('list-a')
    const idxB = names.indexOf('list-b')
    expect(idxB).toBeGreaterThanOrEqual(0)
    expect(idxA).toBeGreaterThan(idxB)
    for (const s of all) {
      expect(s).not.toHaveProperty('encrypted')
    }
  })
})
