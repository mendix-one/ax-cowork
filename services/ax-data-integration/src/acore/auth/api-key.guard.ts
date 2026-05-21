import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'

import { API_KEY_HEADER, PUBLIC_ROUTE_KEY } from './api-key.constants'

interface RequestLike {
  headers: Record<string, string | string[] | undefined>
}

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly validKeys: ReadonlySet<string>

  constructor(
    private readonly reflector: Reflector,
    config: ConfigService,
  ) {
    const raw = config.getOrThrow<string>('INTEGRATION_API_KEYS')
    this.validKeys = new Set(
      raw
        .split(',')
        .map((k) => k.trim())
        .filter((k) => k.length > 0),
    )
    if (this.validKeys.size === 0) {
      throw new Error('INTEGRATION_API_KEYS must contain at least one non-empty key')
    }
  }

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean | undefined>(PUBLIC_ROUTE_KEY, [context.getHandler(), context.getClass()])
    if (isPublic) return true

    const req = context.switchToHttp().getRequest<RequestLike>()
    const headerValue = req.headers[API_KEY_HEADER]
    const key = Array.isArray(headerValue) ? headerValue[0] : headerValue

    if (!key || !this.validKeys.has(key)) {
      throw new UnauthorizedException('Missing or invalid API key')
    }
    return true
  }
}
