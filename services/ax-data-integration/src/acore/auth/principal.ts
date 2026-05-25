import { createParamDecorator, type ExecutionContext } from '@nestjs/common'

/**
 * Stable identifier attached to every authenticated request by `ApiKeyGuard`. Audit fields
 * (`createdBy`, `updatedBy`, etc.) consume `label` so log greps surface human-friendly strings
 * like `ci-deploy` instead of raw key material.
 *
 * Never store the raw API key on the request — only `keyHash` (first 8 hex chars of SHA-256).
 */
export interface Principal {
  /** First 8 hex chars of SHA-256(rawKey). Stable across reboots; safe to log. */
  keyHash: string
  /**
   * Operator-supplied label from `INTEGRATION_API_KEY_LABELS` (CSV, parallel to
   * `INTEGRATION_API_KEYS` by index). Falls back to `key-<keyHash>` when no label provided.
   */
  label: string
}

/** Request property name where `ApiKeyGuard` stores the resolved principal. */
export const PRINCIPAL_REQUEST_KEY = 'principal'

interface RequestWithPrincipal {
  [PRINCIPAL_REQUEST_KEY]?: Principal
}

/**
 * Controller param decorator that extracts the request's principal. Throws at runtime if
 * used on a `@Public()` route — by contract, only authenticated endpoints have a principal.
 */
export const CurrentPrincipal = createParamDecorator((_: unknown, ctx: ExecutionContext): Principal => {
  const req = ctx.switchToHttp().getRequest<RequestWithPrincipal>()
  const principal = req[PRINCIPAL_REQUEST_KEY]
  if (!principal) {
    throw new Error('No principal attached to request — is the route guarded by ApiKeyGuard? @Public() routes do not carry a principal.')
  }
  return principal
})
