import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Logger } from 'nestjs-pino'

import { MainModule } from './main.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainModule, { bufferLogs: true })
  app.useLogger(app.get(Logger))

  const configService = app.get(ConfigService)

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
    allowedHeaders: ['content-type', 'x-axios-key'],
    optionsSuccessStatus: 200,
  })

  const port = configService.get<number>('PORT') ?? 3012

  const swaggerConfig = new DocumentBuilder()
    .setTitle('AX Data Integration')
    .setDescription(
      [
        'AX Cowork Data Integration Service — pull-based sync jobs, raw data store, audit changelog.',
        '',
        'All non-health endpoints require the `x-axios-key` header. Set `INTEGRATION_API_KEYS` (comma-separated) to provision keys.',
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
    .build()
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('axios-docs', app, document)

  await app.listen(port)
}

void bootstrap()
