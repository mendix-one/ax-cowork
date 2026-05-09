import { join } from 'path'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { NestExpressApplication } from '@nestjs/platform-express'

import { MainModule } from './main.module'

async function bootstrap() {
  // Instance app
  const app = await NestFactory.create<NestExpressApplication>(MainModule)

  // Config service
  const configService = app.get(ConfigService)

  // Static & Views
  app.useStaticAssets(join(__dirname, '..', 'public'))
  app.setBaseViewsDir(join(__dirname, '..', 'pages'))
  app.setViewEngine('hbs')

  // Start listing
  await app.listen(configService.get<number>('PORT') ?? 3000)
}
void bootstrap()
