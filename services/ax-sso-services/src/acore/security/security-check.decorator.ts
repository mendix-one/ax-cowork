import { SetMetadata } from '@nestjs/common'

import { SECURITY_CHECK_KEY } from './security.constants'

export interface SecurityCheckOptions {
  // When true (default): require a signed-in session — JWT's `sub` (account) must be present,
  // and the role + status gates below apply.
  // When false: accept anonymous-session JWTs (e.g. from /session/initialize). Only `app`
  // and `ses` claims are required; `sub`, `sta`, and `roles` are not checked.
  sign?: boolean
  // Role keys allowed for this route. Empty/omitted = role check skipped.
  // Ignored when `sign: false`.
  roles?: string[]
  // Account status values allowed for this route (matches the token's `sta` claim).
  // Empty/omitted = any status is allowed (i.e. status check skipped).
  // Ignored when `sign: false`.
  status?: string[]
}

// Marks a controller or route handler as requiring an authenticated bearer token (JWT).
//
// - `@SecurityCheck()` — signed-in token; no role or status restriction.
// - `@SecurityCheck({ roles: ['ADMIN'] })` — token's `roles` must contain at least one listed key.
// - `@SecurityCheck({ status: ['ACTIVE'] })` — token's `sta` must be in the listed values.
// - `@SecurityCheck({ sign: false })` — accept anonymous-session JWTs (no account yet).
//
// Routes without this decorator are NOT checked by `SecurityCheckGuard` (it falls through).
// Use `@SecurityBypassAll()` to also bypass `ApiKeyGuard` for health probes etc.
export const SecurityCheck = (options: SecurityCheckOptions = {}): MethodDecorator & ClassDecorator => SetMetadata(SECURITY_CHECK_KEY, options)
