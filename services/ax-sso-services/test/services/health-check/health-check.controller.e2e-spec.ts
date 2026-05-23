import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { App } from 'supertest/types'

import { MainModule } from '../../../src/main.module'

describe('HealthCheckController (e2e)', () => {
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

  it('is publicly reachable without an API key', async () => {
    const res = await request(app.getHttpServer()).get('/health-check').expect(200)
    expect(res.body).toEqual({ status: 'ok' })
  })
})
