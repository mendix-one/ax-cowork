import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { MainModule } from './main.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainModule)

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
    allowedHeaders: ['content-type', 'x-api-key'],
    optionsSuccessStatus: 200,
  })

  const swaggerConfig = new DocumentBuilder()
    .setTitle('AX Data Integration')
    .setDescription('AX Cowork Data Integration Service — pull-based sync jobs, raw data store, audit changelog.')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', in: 'header', name: 'x-api-key' }, 'api-key')
    .build()
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api-docs', app, document)

  await app.listen(configService.get<number>('PORT') ?? 3012)
}

void bootstrap()
