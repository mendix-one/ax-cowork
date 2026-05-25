import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { createHash } from 'crypto'
import { MongoClient } from 'mongodb'
import request from 'supertest'
import { App } from 'supertest/types'

import { MainModule } from '../src/main.module'
import { JOB_CONFIGS_COLLECTION } from '../src/domain/job-config/job-config.schema'
import { SOURCE_FILES_COLLECTION } from '../src/domain/source-file/source-file.schema'

const API_KEY = 'e2e-test-key'

describe('SourceFilesController (e2e)', () => {
  let app: INestApplication<App>

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [MainModule] }).compile()
    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    await app.init()
  }, 30_000)

  afterAll(async () => {
    if (app) await app.close()
  })

  beforeEach(async () => {
    const uri = process.env.MONGO_URI
    const dbName = process.env.MONGO_DB_NAME
    if (!uri || !dbName) throw new Error('MONGO env not set by global-setup')
    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db(dbName)
    await Promise.all([
      db.collection(SOURCE_FILES_COLLECTION).deleteMany({}),
      db.collection(JOB_CONFIGS_COLLECTION).deleteMany({}),
      db.collection('fs.files').deleteMany({}),
      db.collection('fs.chunks').deleteMany({}),
    ])
    await client.close()
  })

  it('401 without API key', async () => {
    await request(app.getHttpServer()).get('/source-files').expect(401)
  })

  it('POST uploads a file and returns a summary with sha256 checksum', async () => {
    const content = Buffer.from('hello world')
    const expectedChecksum = createHash('sha256').update(content).digest('hex')

    const res = await request(app.getHttpServer())
      .post('/source-files')
      .set('x-api-key', API_KEY)
      .attach('file', content, { filename: 'greeting.txt', contentType: 'text/plain' })
      .expect(201)

    const body = res.body as { id: string; fileName: string; size: number; checksum: string }
    expect(body.fileName).toBe('greeting.txt')
    expect(body.size).toBe(content.length)
    expect(body.checksum).toBe(expectedChecksum)
    expect(typeof body.id).toBe('string')
  })

  it('uploading the same content twice returns the existing id (dedup by checksum)', async () => {
    const content = Buffer.from('identical bytes')
    const first = await request(app.getHttpServer()).post('/source-files').set('x-api-key', API_KEY).attach('file', content, 'a.bin').expect(201)
    const second = await request(app.getHttpServer()).post('/source-files').set('x-api-key', API_KEY).attach('file', content, 'b.bin').expect(201)
    expect((second.body as { id: string }).id).toBe((first.body as { id: string }).id)
  })

  it('GET /:id/download streams the original bytes', async () => {
    const content = Buffer.from('payload bytes here')
    const upload = await request(app.getHttpServer())
      .post('/source-files')
      .set('x-api-key', API_KEY)
      .attach('file', content, { filename: 'payload.bin', contentType: 'application/octet-stream' })
      .expect(201)
    const { id } = upload.body as { id: string }

    const downloaded = await request(app.getHttpServer())
      .get(`/source-files/${id}/download`)
      .set('x-api-key', API_KEY)
      .buffer(true)
      .parse((res, cb) => {
        const chunks: Buffer[] = []
        res.on('data', (c: Buffer) => chunks.push(c))
        res.on('end', () => cb(null, Buffer.concat(chunks)))
      })
      .expect(200)

    expect(Buffer.compare(downloaded.body as Buffer, content)).toBe(0)
  })

  it('GET list returns newest-first summaries; no GridFS internals exposed', async () => {
    await request(app.getHttpServer()).post('/source-files').set('x-api-key', API_KEY).attach('file', Buffer.from('one'), 'one.txt').expect(201)
    await new Promise((r) => setTimeout(r, 5))
    await request(app.getHttpServer()).post('/source-files').set('x-api-key', API_KEY).attach('file', Buffer.from('two'), 'two.txt').expect(201)

    const res = await request(app.getHttpServer()).get('/source-files').set('x-api-key', API_KEY).expect(200)
    const items = res.body as { fileName: string }[]
    expect(items).toHaveLength(2)
    expect(items[0].fileName).toBe('two.txt')
    for (const item of items) expect(item).not.toHaveProperty('gridFsFileId')
  })

  it('GET malformed id → 400, missing id → 404', async () => {
    await request(app.getHttpServer()).get('/source-files/not-an-id').set('x-api-key', API_KEY).expect(400)
    await request(app.getHttpServer()).get('/source-files/507f1f77bcf86cd799439011').set('x-api-key', API_KEY).expect(404)
  })

  it('DELETE 204; subsequent GET → 404; second DELETE → 404', async () => {
    const upload = await request(app.getHttpServer()).post('/source-files').set('x-api-key', API_KEY).attach('file', Buffer.from('bye'), 'bye.txt').expect(201)
    const { id } = upload.body as { id: string }

    await request(app.getHttpServer()).delete(`/source-files/${id}`).set('x-api-key', API_KEY).expect(204)
    await request(app.getHttpServer()).get(`/source-files/${id}`).set('x-api-key', API_KEY).expect(404)
    await request(app.getHttpServer()).delete(`/source-files/${id}`).set('x-api-key', API_KEY).expect(404)
  })

  it('DELETE returns 409 when a job_config references the file', async () => {
    const upload = await request(app.getHttpServer())
      .post('/source-files')
      .set('x-api-key', API_KEY)
      .attach('file', Buffer.from('referenced'), 'r.xlsx')
      .expect(201)
    const { id } = upload.body as { id: string }

    // Plant a job_config that references the file via source.config.sourceFileId (hex string per repo contract).
    const uri = process.env.MONGO_URI!
    const dbName = process.env.MONGO_DB_NAME!
    const client = new MongoClient(uri)
    await client.connect()
    try {
      await client
        .db(dbName)
        .collection(JOB_CONFIGS_COLLECTION)
        .insertOne({
          name: 'excel-job',
          enabled: true,
          source: { type: 'excel', config: { sourceFileId: id, sheetName: 'Sheet1', headerRow: 1, startRow: 2 } },
          schedule: { cronExpression: '0 0 * * *' },
          identity: { strategy: 'primary-key', fields: ['id'] },
          options: { detectDeleted: true, auditChanges: true },
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'test',
        })
    } finally {
      await client.close()
    }

    await request(app.getHttpServer()).delete(`/source-files/${id}`).set('x-api-key', API_KEY).expect(409)
  })
})
