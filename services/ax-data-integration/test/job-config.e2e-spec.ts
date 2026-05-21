import { ConflictException, NotFoundException } from '@nestjs/common'
import { type Db, MongoClient, ObjectId } from 'mongodb'

import { ensureIndexes } from '../src/acore/mongo/indexes'
import { JobConfigRepository } from '../src/domain/job-config/job-config.repository'
import { JobConfigsService } from '../src/domain/job-config/job-config.service'

const baseInput = {
  name: 'sales-api',
  source: { type: 'rest' as const, config: { baseUrl: 'https://api.example', endpoint: '/sales', method: 'GET' as const, pageSize: 100 } },
  schedule: { cronExpression: '0 * * * *' },
  identity: { strategy: 'primary-key' as const, fields: ['id'] },
  createdBy: 'test',
}

describe('JobConfigsService (e2e)', () => {
  let client: MongoClient
  let db: Db
  let service: JobConfigsService
  let repo: JobConfigRepository

  beforeAll(async () => {
    const uri = process.env.MONGO_URI
    if (!uri) throw new Error('MONGO_URI must be set by global-setup')
    client = new MongoClient(uri)
    await client.connect()
    db = client.db(`job_config_e2e_${Date.now()}`)
    await ensureIndexes(db)
    repo = new JobConfigRepository(db)
    service = new JobConfigsService(repo)
  }, 30_000)

  afterAll(async () => {
    if (client) {
      await client.db(db.databaseName).dropDatabase()
      await client.close()
    }
  })

  beforeEach(async () => {
    await db.collection('job_configs').deleteMany({})
  })

  it('create applies defaults: enabled=true, detectDeleted=true, auditChanges=true', async () => {
    const summary = await service.create(baseInput)
    expect(summary.enabled).toBe(true)
    expect(summary.options.detectDeleted).toBe(true)
    expect(summary.options.auditChanges).toBe(true)
    expect(summary.options.errorThreshold).toBeUndefined()
    expect(summary.createdAt.getTime()).toBeCloseTo(summary.updatedAt.getTime(), -2)
  })

  it('create honours explicit option overrides', async () => {
    const summary = await service.create({
      ...baseInput,
      enabled: false,
      options: { detectDeleted: false, auditChanges: false, errorThreshold: 50, rateLimit: { rps: 5 } },
    })
    expect(summary.enabled).toBe(false)
    expect(summary.options).toEqual({ detectDeleted: false, auditChanges: false, errorThreshold: 50, rateLimit: { rps: 5 } })
  })

  it('create with duplicate name throws ConflictException', async () => {
    await service.create(baseInput)
    await expect(service.create(baseInput)).rejects.toBeInstanceOf(ConflictException)
  })

  it('list filters by enabled and source.type, supports pagination', async () => {
    await service.create({ ...baseInput, name: 'a', source: { type: 'excel', config: {} } })
    await service.create({ ...baseInput, name: 'b', source: { type: 'rest', config: {} }, enabled: false })
    await service.create({ ...baseInput, name: 'c', source: { type: 'rest', config: {} } })

    const all = await service.list({})
    expect(all.total).toBe(3)
    expect(all.items).toHaveLength(3)

    const restOnly = await service.list({ sourceType: 'rest' })
    expect(restOnly.total).toBe(2)
    expect(restOnly.items.every((i) => i.source.type === 'rest')).toBe(true)

    const enabledOnly = await service.list({ enabled: true })
    expect(enabledOnly.total).toBe(2)
    expect(enabledOnly.items.every((i) => i.enabled)).toBe(true)

    const paged = await service.list({ page: 2, pageSize: 1 })
    expect(paged.pageSize).toBe(1)
    expect(paged.page).toBe(2)
    expect(paged.items).toHaveLength(1)
  })

  it('update merges partial options with existing values and bumps updatedAt', async () => {
    const created = await service.create({ ...baseInput, options: { detectDeleted: false, auditChanges: true, errorThreshold: 100 } })
    await new Promise((r) => setTimeout(r, 5))

    const updated = await service.update(new ObjectId(created.id), { options: { auditChanges: false } })

    expect(updated.options).toEqual({ detectDeleted: false, auditChanges: false, errorThreshold: 100, rateLimit: undefined })
    expect(updated.updatedAt.getTime()).toBeGreaterThan(created.updatedAt.getTime())
  })

  it('update with credentialsRef=null unsets the field', async () => {
    const secretId = new ObjectId()
    const created = await service.create({ ...baseInput, credentialsRef: secretId.toHexString() })
    expect(created.credentialsRef).toBe(secretId.toHexString())

    const cleared = await service.update(new ObjectId(created.id), { credentialsRef: null })
    expect(cleared.credentialsRef).toBeUndefined()
  })

  it('setEnabled toggles enabled flag', async () => {
    const created = await service.create(baseInput)
    const disabled = await service.setEnabled(new ObjectId(created.id), false)
    expect(disabled.enabled).toBe(false)
    const reenabled = await service.setEnabled(new ObjectId(created.id), true)
    expect(reenabled.enabled).toBe(true)
  })

  it('softDelete is equivalent to setEnabled(false)', async () => {
    const created = await service.create(baseInput)
    const after = await service.softDelete(new ObjectId(created.id))
    expect(after.enabled).toBe(false)
  })

  it('updateLastRun sets the lastRun fields without bumping updatedAt', async () => {
    const created = await service.create(baseInput)
    const runId = new ObjectId()
    const runAt = new Date()

    await service.updateLastRun(new ObjectId(created.id), { lastRunId: runId, lastRunStatus: 'success', lastRunAt: runAt })

    const fetched = await service.getById(new ObjectId(created.id))
    expect(fetched.lastRunId).toBe(runId.toHexString())
    expect(fetched.lastRunStatus).toBe('success')
    expect(fetched.lastRunAt?.getTime()).toBe(runAt.getTime())
    expect(fetched.updatedAt.getTime()).toBe(created.updatedAt.getTime())
  })

  it('getById and update on a missing id throw NotFound', async () => {
    const missing = new ObjectId()
    await expect(service.getById(missing)).rejects.toBeInstanceOf(NotFoundException)
    await expect(service.update(missing, { name: 'x' })).rejects.toBeInstanceOf(NotFoundException)
  })

  it('countReferencesToSecret counts only docs referencing the given secret', async () => {
    const secretA = new ObjectId()
    const secretB = new ObjectId()
    await service.create({ ...baseInput, name: 'one', credentialsRef: secretA.toHexString() })
    await service.create({ ...baseInput, name: 'two', credentialsRef: secretA.toHexString() })
    await service.create({ ...baseInput, name: 'three', credentialsRef: secretB.toHexString() })
    await service.create({ ...baseInput, name: 'four' })

    expect(await service.countReferencesToSecret(secretA)).toBe(2)
    expect(await service.countReferencesToSecret(secretB)).toBe(1)
    expect(await service.countReferencesToSecret(new ObjectId())).toBe(0)
  })
})
