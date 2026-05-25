import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Logger } from 'nestjs-pino'

import { MainModule } from './main.module'

async function bootstrap() {
  // `rawBody: true` preserves the raw request bytes on `req.rawBody` (HMAC signature verify
  // in T2-B03 needs the exact wire bytes — re-serialising the parsed body would change whitespace
  // or key order and break the signature).
  const app = await NestFactory.create<NestExpressApplication>(MainModule, { bufferLogs: true, rawBody: true })
  app.useLogger(app.get(Logger))

  const configService = app.get(ConfigService)

  // T2-B02: raise the global JSON body-parser limit to the webhook payload cap. Default 10 MiB is
  // generous for typical event-stream pushes while still bounding the on-prem node's memory.
  // Non-webhook JSON endpoints inherit the same cap; DTO whitelisting on those routes still trims
  // unknown fields, so the practical attack surface is unchanged.
  const webhookMaxBytes = configService.get<number>('INTEGRATION_WEBHOOK_MAX_BYTES') ?? 10 * 1024 * 1024
  app.useBodyParser('json', { limit: webhookMaxBytes })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      validateCustomDecorators: true,
    }),
  )

  app.enableCors({
    origin: '*',
    methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['content-type', 'x-api-key'],
    optionsSuccessStatus: 200,
  })

  const port = configService.get<number>('PORT') ?? 3012

  const swaggerConfig = new DocumentBuilder()
    .setTitle('AX Data Integration')
    .setDescription(
      [
        'AX Cowork Data Integration Service — pull-based sync jobs, raw data store, audit changelog.',
        '',
        'All non-health endpoints require the `x-api-key` header. Set `INTEGRATION_API_KEYS` (comma-separated) to provision keys.',
        'Authoritative design lives in `services/ax-data-integration/docs/` (O001/P001/P002/T001).',
      ].join('\n'),
    )
    .setVersion('1.0')
    .addServer(`http://localhost:${port}`, 'Local dev')
    .addApiKey({ type: 'apiKey', in: 'header', name: 'x-api-key', description: 'Match one of the keys in INTEGRATION_API_KEYS.' }, 'axios-key')
    .addTag('Service', 'Liveness/readiness probes and the service identity endpoint. Public — no API key required.')
    .addTag('Job configs', 'CRUD + manual trigger for sync jobs. A job_config wires a source + identity strategy + schedule together.')
    .addTag('Secrets', 'AES-256-GCM-encrypted credentials referenced by job_configs.credentialsRef. Plaintext is never returned by any read endpoint.')
    .addTag('Source files', 'Multipart upload of files (Excel/CSV) stored in GridFS. Referenced by file-source job_configs.')
    .addTag('Sync runs', 'Read sync_run history, drill into a run, or retry a failed one against the CURRENT job_config snapshot.')
    .addTag('Raw records', 'The synced data store, classified per sync (active/deleted) with full payload + per-run lineage.')
    .addTag('Source metadata', 'Schema snapshots detected at each sync. Deduped by (jobConfigId, schemaHash) — also serves as a schema-drift audit trail.')
    .addTag('Webhooks', 'Inbound JSON push endpoints for webhook-source job_configs. Public (no x-api-key) — HMAC signature is the auth boundary (T2-B03).')
    .build()
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api-docs', app, document)

  await app.listen(port)
}

void bootstrap()
