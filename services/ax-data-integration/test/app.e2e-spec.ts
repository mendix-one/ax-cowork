import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { App } from 'supertest/types'

import { MainModule } from '../src/main.module'

describe('AppController (e2e)', () => {
  let app: INestApplication<App>

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MainModule],
    }).compile()
    app = moduleFixture.createNestApplication()
    await app.init()
  }, 30_000)

  afterEach(async () => {
    await app.close()
  })

  it('GET / returns the service identity', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect({ name: 'ax-data-integration', status: 'ok' })
  })

  it('GET /health returns ok', () => {
    return request(app.getHttpServer()).get('/health').expect(200).expect({ status: 'ok' })
  })

  it('GET /health/ready reports Mongo connected', () => {
    return request(app.getHttpServer()).get('/health/ready').expect(200).expect({ status: 'ready', mongo: 'connected' })
  })
})
