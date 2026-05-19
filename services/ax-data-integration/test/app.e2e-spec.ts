import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
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
  })

  it('/ (GET) returns service identity', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect({ name: 'ax-data-integration', status: 'ok' })
  })

  it('/health-check (GET) returns ok', () => {
    return request(app.getHttpServer()).get('/health-check').expect(200).expect({ status: 'ok' })
  })

  afterEach(async () => {
    await app.close()
  })
})
