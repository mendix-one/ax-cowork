import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'

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
    allowedHeaders: ['content-type', 'authorization', 'cdn-owner-id', 'timezone', 'lang'],
    exposedHeaders: ['authorization', 'code'],
    optionsSuccessStatus: 200,
  }
  app.enableCors(options)

  // Start listing
  await app.listen(configService.get<number>('PORT') ?? 3011)
}

void bootstrap()
