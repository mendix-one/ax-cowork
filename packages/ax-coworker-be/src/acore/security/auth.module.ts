import { Global, Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'

import { AuthGuard } from './auth.guard'
import { SessionService } from './session.service'
import { SsoClient } from './sso.client'

// Global so SessionService + SsoClient are injectable anywhere without re-importing.
// APP_GUARD registers AuthGuard as a request-level guard for every route; routes opt
// out individually with @SecurityBypass().
@Global()
@Module({
  providers: [SessionService, SsoClient, { provide: APP_GUARD, useClass: AuthGuard }],
  exports: [SessionService, SsoClient],
})
export class AuthModule {}
