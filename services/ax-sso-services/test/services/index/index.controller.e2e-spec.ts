import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { App } from 'supertest/types'

import { API_KEY_HEADER } from '../../../src/acore/security'
import { MainModule } from '../../../src/main.module'

const API_KEY = 'e2e-test-key'

describe('IndexController (e2e)', () => {
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

  it('rejects requests without the API key', async () => {
    await request(app.getHttpServer()).get('/').expect(401)
  })

  it('returns service identity when authenticated', async () => {
    const res = await request(app.getHttpServer()).get('/').set(API_KEY_HEADER, API_KEY).expect(200)
    expect(res.body).toEqual({ name: 'ax-sso-services', status: 'ok' })
  })
})
