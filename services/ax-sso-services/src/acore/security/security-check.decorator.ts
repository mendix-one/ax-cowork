import { SetMetadata } from '@nestjs/common'

import { SECURITY_CHECK_KEY } from './security.constants'

export interface SecurityCheckOptions {
  // Role keys allowed for this route. Empty/omitted = role check skipped.
  roles?: string[]
  // Account status values allowed for this route (matches the token's `sta` claim).
  // Empty/omitted = any status is allowed (i.e. status check skipped).
  status?: string[]
}

// Marks a controller or route handler as requiring an authenticated bearer token (JWT).
//
// - `@SecurityCheck()` — only requires a valid, non-expired token. No role or status restriction.
// - `@SecurityCheck({ roles: ['ADMIN'] })` — token's `roles` must contain at least one listed key.
// - `@SecurityCheck({ status: ['ACTIVE'] })` — token's `sta` must be in the listed values.
// - `@SecurityCheck({ roles: ['ADMIN'], status: ['ACTIVE'] })` — both gates apply (logical AND between
//   roles and status; logical OR within each list).
//
// Routes without this decorator are NOT checked by `SecurityCheckGuard` (it falls through).
// Use `@SecurityBypassAll()` to also bypass `ApiKeyGuard` for health probes etc.
export const SecurityCheck = (options: SecurityCheckOptions = {}): MethodDecorator & ClassDecorator => SetMetadata(SECURITY_CHECK_KEY, options)
