import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'

import type { SecurityCheckOptions } from './security-check.decorator'
import { SECURITY_BYPASS_ALL_KEY, SECURITY_CHECK_KEY } from './security.constants'

interface RequestLike {
  headers: Record<string, string | string[] | undefined>
}

interface SessionTokenPayload {
  sub: string
  app: string
  ses: string
  sta: string
  roles?: string[]
  iat?: number
  exp?: number
}

// Headers the guard writes onto the request after verifying the JWT. Downstream handlers can
// read them via `@Headers('account')` / `@Headers('app')` / `@Headers('session')` / `@Headers('state')`.
// They are stripped from every incoming request first so a client can't spoof them.
const AUTH_HEADERS = ['account', 'app', 'session', 'state'] as const

@Injectable()
export class SecurityCheckGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = this.getRequest(context)

    // Defense in depth — never trust an incoming `account`/`app`/`session`/`state` header. Only the guard
    // (after verifying a JWT) is allowed to set them.
    if (req) {
      for (const h of AUTH_HEADERS) delete req.headers[h]
    }

    // `@SecurityBypassAll()` opts out of every security guard — health probes etc.
    const bypass = this.reflector.getAllAndOverride<boolean | undefined>(SECURITY_BYPASS_ALL_KEY, [context.getHandler(), context.getClass()])
    if (bypass) return true

    // If no `@SecurityCheck(...)` is present on the route, this guard is a no-op. Authentication
    // is opt-in per route via the decorator.
    const options = this.reflector.getAllAndOverride<SecurityCheckOptions | undefined>(SECURITY_CHECK_KEY, [context.getHandler(), context.getClass()])
    if (options === undefined) return true

    const token = this.extractBearer(req)
    if (!token) {
      throw new UnauthorizedException('Missing bearer token')
    }

    // `verifyAsync` checks signature AND expiry (throws on either failure).
    let payload: SessionTokenPayload
    try {
      payload = await this.jwtService.verifyAsync<SessionTokenPayload>(token)
    } catch {
      throw new UnauthorizedException('Invalid or expired token')
    }

    // Status gate. Empty/omitted `status` list = any status is allowed.
    const allowedStatuses = options.status ?? []
    if (allowedStatuses.length > 0 && !allowedStatuses.includes(payload.sta)) {
      throw new UnauthorizedException(`Account status "${payload.sta}" is not allowed`)
    }

    // Roles gate. Empty/omitted `roles` list = role check skipped.
    const requiredRoles = options.roles ?? []
    if (requiredRoles.length > 0) {
      const tokenRoles = Array.isArray(payload.roles) ? payload.roles : []
      const hasMatch = requiredRoles.some((r) => tokenRoles.includes(r))
      if (!hasMatch) {
        throw new ForbiddenException('Missing required role')
      }
    }

    // Surface the verified identity on the request so handlers (and param decorators) can
    // read it via `@Headers('account'|'app'|'session'|'state')` without re-decoding the token.
    if (req) {
      req.headers.app = payload.app
      req.headers.account = payload.sub
      req.headers.session = payload.ses
      req.headers.state = payload.sta
      req.headers.roles = payload.roles
    }
    return true
  }

  private extractBearer(req: RequestLike | undefined): string | null {
    const raw = req?.headers?.authorization
    const value = Array.isArray(raw) ? raw[0] : raw
    if (!value) return null
    const [scheme, token] = value.split(' ')
    if (scheme?.toLowerCase() !== 'bearer' || !token) return null
    return token
  }

  // Mirrors ApiKeyGuard: GraphQL contexts surface the request via GqlExecutionContext;
  // REST routes use the standard HTTP switcher.
  private getRequest(context: ExecutionContext): RequestLike | undefined {
    if (context.getType<'http' | 'graphql'>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext<{ req?: RequestLike }>().req
    }
    return context.switchToHttp().getRequest<RequestLike>()
  }
}
