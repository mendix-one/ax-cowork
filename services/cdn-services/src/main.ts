import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { NestExpressApplication } from '@nestjs/platform-express'

import { MainModule } from './main.module'

async function bootstrap() {
  // Instance app
  const app = await NestFactory.create<NestExpressApplication>(MainModule)

  // Config service
  const configService = app.get(ConfigService)

  // Start listing
  await app.listen(configService.get<number>('PORT') ?? 3011)
}
void bootstrap()
