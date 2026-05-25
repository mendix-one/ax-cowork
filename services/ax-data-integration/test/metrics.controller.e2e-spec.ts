import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { App } from 'supertest/types'

import { MainModule } from '../src/main.module'

/**
 * T2-A08 e2e: `/metrics` is `@Public()` (no x-api-key needed). Default-mode behaviour:
 * served as `text/plain` with prom-client default Node.js process metrics + the three
 * sync_run metric families (zero-valued samples are fine on a fresh boot).
 *
 * The Bearer-token gated branch is covered by a unit test inline (env override needs a
 * module rebuild that's expensive in e2e).
 */
describe('MetricsController (e2e)', () => {
  let app: INestApplication<App>

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [MainModule] }).compile()
    app = moduleFixture.createNestApplication()
    await app.init()
  }, 30_000)

  afterAll(async () => {
    if (app) await app.close()
  })

  it('GET /metrics is public (no x-api-key) and returns Prometheus text', async () => {
    const res = await request(app.getHttpServer()).get('/metrics').expect(200)
    expect(res.headers['content-type']).toMatch(/^text\/plain/)
    // Default Node.js process metrics from prom-client.
    expect(res.text).toContain('process_cpu_user_seconds_total')
    expect(res.text).toContain('nodejs_eventloop_lag_seconds')
    // Our custom sync_run families (registered up-front, zero samples is fine).
    expect(res.text).toContain('# HELP sync_run_total')
    expect(res.text).toContain('# HELP sync_run_duration_seconds')
    expect(res.text).toContain('# HELP sync_run_records_total')
  })

  it('service label is attached so multi-service scrapes can disambiguate', async () => {
    const res = await request(app.getHttpServer()).get('/metrics').expect(200)
    expect(res.text).toContain('service="ax-data-integration"')
  })
})
