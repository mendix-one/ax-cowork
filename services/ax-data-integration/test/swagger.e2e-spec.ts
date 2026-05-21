import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { App } from 'supertest/types'

import { MainModule } from '../src/main.module'

interface OpenApiDoc {
  openapi: string
  info: { title: string; description?: string; version: string }
  tags?: { name: string; description?: string }[]
  paths: Record<string, Record<string, { summary?: string; tags?: string[]; security?: unknown[] }>>
  components?: { securitySchemes?: Record<string, { type: string; in?: string; name?: string }> }
}

/**
 * Smoke test for the Swagger surface. Mirrors the DocumentBuilder config from `main.ts` so we
 * verify the contract without booting on the real port. Keeps T-I01 from regressing silently
 * — every new controller should automatically show up here.
 */
describe('Swagger / OpenAPI document', () => {
  let app: INestApplication<App>
  let doc: OpenApiDoc

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [MainModule] }).compile()
    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    await app.init()

    const config = new DocumentBuilder()
      .setTitle('AX Data Integration')
      .setVersion('1.0')
      .addApiKey({ type: 'apiKey', in: 'header', name: 'x-api-key' }, 'api-key')
      .addTag('Service')
      .addTag('Job configs')
      .addTag('Secrets')
      .addTag('Source files')
      .addTag('Sync runs')
      .addTag('Raw records')
      .addTag('Source metadata')
      .build()
    // Build the document in-process — no HTTP needed. SwaggerModule.setup() mounts the JSON
    // route via Express middleware that supertest doesn't pick up cleanly in this harness, so
    // we assert directly on the document object instead.
    doc = SwaggerModule.createDocument(app, config) as unknown as OpenApiDoc
  }, 60_000)

  afterAll(async () => {
    if (app) await app.close()
  })

  it('exposes title + version + api-key security scheme', () => {
    expect(doc.info.title).toBe('AX Data Integration')
    expect(doc.info.version).toBe('1.0')
    expect(doc.components?.securitySchemes?.['api-key']).toMatchObject({ type: 'apiKey', in: 'header', name: 'x-api-key' })
  })

  it('declares all phase-1 tags', () => {
    const tagNames = new Set((doc.tags ?? []).map((t) => t.name))
    for (const expected of ['Service', 'Job configs', 'Secrets', 'Source files', 'Sync runs', 'Raw records', 'Source metadata']) {
      expect(tagNames).toContain(expected)
    }
  })

  it.each([
    // Each row: HTTP method + path the route should appear under in the OpenAPI doc.
    // Update this list whenever a new endpoint ships.
    ['get', '/'],
    ['get', '/health'],
    ['get', '/health/ready'],
    ['post', '/job-configs'],
    ['get', '/job-configs'],
    ['get', '/job-configs/{id}'],
    ['patch', '/job-configs/{id}'],
    ['delete', '/job-configs/{id}'],
    ['post', '/job-configs/{id}/trigger'],
    ['post', '/secrets'],
    ['get', '/secrets'],
    ['get', '/secrets/{id}'],
    ['patch', '/secrets/{id}'],
    ['delete', '/secrets/{id}'],
    ['post', '/source-files'],
    ['get', '/source-files'],
    ['get', '/source-files/{id}'],
    ['get', '/source-files/{id}/download'],
    ['delete', '/source-files/{id}'],
    ['get', '/sync-runs'],
    ['get', '/sync-runs/{id}'],
    ['post', '/sync-runs/{id}/retry'],
    ['get', '/raw-records'],
    ['get', '/raw-records/{id}'],
    ['get', '/source-metadata'],
    ['get', '/source-metadata/latest'],
    ['get', '/source-metadata/{id}'],
  ])('documents %s %s with a summary + tag', (method, path) => {
    const op = doc.paths[path]?.[method]
    expect(op).toBeDefined()
    expect(typeof op?.summary).toBe('string')
    expect(op?.summary?.length).toBeGreaterThan(0)
    expect(op?.tags && op.tags.length).toBeGreaterThan(0)
  })

  it('requires the api-key on every non-Service operation', () => {
    for (const methods of Object.values(doc.paths)) {
      for (const op of Object.values(methods)) {
        const tags = op.tags ?? []
        if (tags.includes('Service')) continue
        const secured = (op.security ?? []).some((s) => Object.prototype.hasOwnProperty.call(s, 'api-key'))
        expect(secured).toBe(true)
      }
    }
  })
})
