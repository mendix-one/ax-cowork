import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { CronjobManager } from './acore/cronjob'
import { API_KEY_HEADER } from './acore/security'
import { MainModule } from './main.module'

async function bootstrap() {
  // Instance app
  const app = await NestFactory.create<NestExpressApplication>(MainModule)

  // Config service
  const configService = app.get(ConfigService)

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      validateCustomDecorators: true,
    }),
  )

  // CORS
  const options = {
    origin: '*',
    methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['content-type', 'authorization', API_KEY_HEADER, 'cdn-owner-id', 'timezone', 'lang'],
    exposedHeaders: ['authorization', 'code'],
    optionsSuccessStatus: 200,
  }
  app.enableCors(options)

  // OpenAPI / Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('AX SSO Services')
    .setDescription('AX SSO Services API')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: API_KEY_HEADER, in: 'header' }, 'ax-api-key')
    .build()
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api-docs', app, document)

  // Start listing
  await app.listen(configService.get<number>('PORT') ?? 3001)

  // Seed the one-shot initialization cronjob. `checkDuplicated: true` makes the call idempotent
  // across restarts — if a job named "initialization" already exists, nothing is inserted.
  // The next cron tick picks it up via the regular scan/start/listener pipeline.
  const cronjobManager = app.get(CronjobManager)
  await cronjobManager.create('initialization', {}, true)
}

void bootstrap()
