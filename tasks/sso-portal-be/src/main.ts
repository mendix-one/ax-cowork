import { join } from 'path'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'

import * as cookieSession from 'cookie-session'

import { create as createViewEngine } from 'express-handlebars'

import { AppModule } from './app.module'

import { BusinessExceptionFilter } from './core/exception/business.exception.filter'
import { TaskManager } from './core/manager/task.manager'

async function bootstrap() {
  // Instance app
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // Config service
  const configService = app.get(ConfigService)

  // Cookie Session
  app.use(
    cookieSession({
      name: configService.get('SESSION_NAME'),
      keys: [configService.get('SESSION_SECRET')],
      maxAge: 365 * 24 * 60 * 60 * 1000
    })
  )

  // View engine
  const hbs = createViewEngine({
    defaultLayout: 'main',
    extname: '.hbs'
  })
  app.engine('hbs', hbs.engine)

  // Static & Views
  app.useStaticAssets(join(__dirname, '..', 'public'))
  app.setBaseViewsDir(join(__dirname, '..', 'pages'))
  app.setViewEngine('hbs')

  // Global filter
  app.useGlobalFilters(new BusinessExceptionFilter())

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      validateCustomDecorators: true
    })
  )

  // Start listing
  app.enableCors()
  await app.listen(+configService.get('SERVER_PORT'))

  // Initialize
  const taskManager = app.get(TaskManager)
  await taskManager.initialize()
}
bootstrap()
