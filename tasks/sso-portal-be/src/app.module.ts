import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { NotFoundExceptionFilter } from './core/exception/not-found.exception.filter'
import { SessionMiddleware } from './core/middleware/session.middleware'
import { BindingInterceptor } from './core/interceptor/binding.interceptor'
import { ConfigModule } from './core/config/config.module'
import { UtilModule } from './core/util/util.module'
import { EventModule } from './core/event/event.module'
import { CallerModule } from './core/connect/caller.module'
import { CachingModule } from './core/cache/cache.module'
import { ManagerModule } from './core/manager/manager.module'
import { IndexModule } from './portal/index/index.module'
import { ConnectModule } from './hub/connect/connect.module'
import { SigninModule } from './portal/signin/signin.module'
import { DatabaseModule } from './core/database/database.module'
import { GeneratorModule } from './hub/generator/generator.module'
import { InitialModule } from './portal/initial/initial.module'
import { LanguageModule } from './portal/lang/lang.module'
import { ErrorModule } from './portal/error/error.module'
import { AuthorizeModule } from './hub/authorize/authorize.module'
import { InquiryModule } from './hub/inquiry/inquiry.module'
import { SignoutModule } from './portal/signout/signout.module'
import { ResetModule } from './portal/reset/reset.module'
import { SignupModule } from './portal/signup/signup.module'
import { WelcomeModule } from './portal/welcome/welcome.module'
import { InitialWorkerModule } from './worker/initialize/initial-worker.module'
import { AccessWorkerModule } from './worker/accessing/access-worker.module'
import { ShortModule } from './portal/short/short.module'

@Module({
  imports: [
    ConfigModule,
    UtilModule,
    CallerModule,
    CachingModule,
    DatabaseModule,
    EventModule,
    ManagerModule,
    IndexModule,
    InitialModule,
    LanguageModule,
    AuthorizeModule,
    GeneratorModule,
    ConnectModule,
    InquiryModule,
    SigninModule,
    SignoutModule,
    SignupModule,
    ResetModule,
    ShortModule,
    ErrorModule,
    WelcomeModule,
    InitialWorkerModule,
    AccessWorkerModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: BindingInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SessionMiddleware)
      .exclude(
        'health-check',
        'initial',
        'inquiry',
        'authorize',
        'system-error',
        'connect-error',
        'authorize-error',
        'not-found',
        'generator(.*)',
        'api(.*)'
      )
      .forRoutes('/')
  }
}
