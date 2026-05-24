import { Global, Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'

import { BusinessExceptionFilter } from './business-exception.filter'

// Registers BusinessExceptionFilter globally via APP_FILTER so every HTTP request is covered
// without needing per-controller `@UseFilters(...)` decorators. APP_FILTER is DI-aware in
// case the filter ever needs to inject services (logging adapter, metrics, etc.).
@Global()
@Module({
  providers: [{ provide: APP_FILTER, useClass: BusinessExceptionFilter }],
})
export class ExceptionModule {}
