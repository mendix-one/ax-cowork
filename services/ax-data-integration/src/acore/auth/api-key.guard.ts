import { createHash } from 'crypto'

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'

import { API_KEY_HEADER, PUBLIC_ROUTE_KEY } from './api-key.constants'
import { PRINCIPAL_REQUEST_KEY, type Principal } from './principal'

interface RequestLike {
  headers: Record<string, string | string[] | undefined>
  [PRINCIPAL_REQUEST_KEY]?: Principal
}

@Injectable()
export class ApiKeyGuard implements CanActivate {
  /** Lookup table from raw key → Principal. Built at boot from INTEGRATION_API_KEYS + INTEGRATION_API_KEY_LABELS. */
  private readonly principals: ReadonlyMap<string, Principal>

  constructor(
    private readonly reflector: Reflector,
    config: ConfigService,
  ) {
    const rawKeys = config.getOrThrow<string>('INTEGRATION_API_KEYS')
    const rawLabels = config.get<string>('INTEGRATION_API_KEY_LABELS') ?? ''

    const keys = rawKeys
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0)
    if (keys.length === 0) {
      throw new Error('INTEGRATION_API_KEYS must contain at least one non-empty key')
    }

    // Labels are positional — index `i` of labels corresponds to index `i` of keys.
    // Missing / blank labels fall back to `key-<hash>`. Extra labels beyond the key count
    // are ignored (configuration drift — operator can fix without re-deploy).
    const labels = rawLabels.split(',').map((l) => l.trim())

    const map = new Map<string, Principal>()
    for (const [i, key] of keys.entries()) {
      const keyHash = sha256Prefix(key, 8)
      const label = labels[i] && labels[i].length > 0 ? labels[i] : `key-${keyHash}`
      map.set(key, { keyHash, label })
    }
    this.principals = map
  }

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean | undefined>(PUBLIC_ROUTE_KEY, [context.getHandler(), context.getClass()])
    if (isPublic) return true

    const req = context.switchToHttp().getRequest<RequestLike>()
    const headerValue = req.headers[API_KEY_HEADER]
    const key = Array.isArray(headerValue) ? headerValue[0] : headerValue

    if (!key) {
      throw new UnauthorizedException('Missing or invalid API key')
    }
    const principal = this.principals.get(key)
    if (!principal) {
      throw new UnauthorizedException('Missing or invalid API key')
    }
    req[PRINCIPAL_REQUEST_KEY] = principal
    return true
  }
}

function sha256Prefix(input: string, hexChars: number): string {
  return createHash('sha256').update(input).digest('hex').slice(0, hexChars)
}
