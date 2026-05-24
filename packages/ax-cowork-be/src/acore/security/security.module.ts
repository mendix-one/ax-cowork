import { Global, Module } from '@nestjs/common'

import { SessionService } from './session.service'
import { SsoClient } from './sso.client'

// Global so SessionService + SsoClient are injectable anywhere without re-importing.
//
// Global request-level auth is currently OFF — the APP_GUARD registration was removed
// while the upstream contract changes. Re-register `AuthGuard` here once we're ready
// to gate the SPA again; the guard class itself is preserved for that purpose.
@Global()
@Module({
  providers: [SessionService, SsoClient],
  exports: [SessionService, SsoClient],
})
export class SecurityModule {}
