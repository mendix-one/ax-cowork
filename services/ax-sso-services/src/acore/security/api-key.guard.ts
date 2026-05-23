import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'

import { API_KEY_HEADER, SECURITY_BYPASS_ALL_KEY } from './security.constants'

interface RequestLike {
  method?: string
  url?: string
  path?: string
  headers: Record<string, string | string[] | undefined>
}

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly validKeys: ReadonlySet<string>

  constructor(
    private readonly reflector: Reflector,
    config: ConfigService,
  ) {
    const raw = config.getOrThrow<string>('API_KEYS')
    this.validKeys = new Set(
      raw
        .split(',')
        .map((k) => k.trim())
        .filter((k) => k.length > 0),
    )
    if (this.validKeys.size === 0) {
      throw new Error('API_KEYS must contain at least one non-empty key')
    }
  }

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean | undefined>(SECURITY_BYPASS_ALL_KEY, [context.getHandler(), context.getClass()])
    if (isPublic) return true

    const req = this.getRequest(context)

    // Let Apollo Sandbox render in the browser without the key. Only the landing-page HTML
    // (GET /graphql with no query string) is whitelisted — actual operations come in via POST
    // and still need the API key set in Sandbox's "Connection settings → Headers" panel.
    if (this.isGraphqlLandingPage(req)) return true

    const headerValue = req?.headers?.[API_KEY_HEADER]
    const key = Array.isArray(headerValue) ? headerValue[0] : headerValue

    if (!key || !this.validKeys.has(key)) {
      throw new UnauthorizedException('Missing or invalid API key')
    }
    return true
  }

  private isGraphqlLandingPage(req: RequestLike | undefined): boolean {
    if (!req || req.method !== 'GET') return false
    const path = req.path ?? req.url?.split('?')[0]
    if (path !== '/graphql') return false
    // GET /graphql?query=… would be a real (unauth) operation — never bypass auth for that.
    return !req.url?.includes('?')
  }

  // GraphQL resolvers and REST controllers route through the same guard chain — the underlying
  // HTTP request lives in different places depending on the execution-context type.
  private getRequest(context: ExecutionContext): RequestLike | undefined {
    if (context.getType<'http' | 'graphql'>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext<{ req?: RequestLike }>().req
    }
    return context.switchToHttp().getRequest<RequestLike>()
  }
}
