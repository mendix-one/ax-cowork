import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import type { Request, Response } from 'express'
import { verify, type JwtPayload } from 'jsonwebtoken'

import { SECURITY_BYPASS_KEY } from './security-bypass.decorator'
import { SessionService } from './session.service'

// Augment Express's Request with the verified JWT payload so downstream
// controllers can read req.auth without redoing the verification.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: JwtPayload & { sub?: string; ses?: string; app?: string; roles?: string[] }
    }
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name)
  private readonly jwtSecret: string

  constructor(
    private readonly reflector: Reflector,
    private readonly session: SessionService,
    config: ConfigService,
  ) {
    this.jwtSecret = config.getOrThrow<string>('SSO_JWT_SECRET')
  }

  canActivate(context: ExecutionContext): boolean {
    const bypass = this.reflector.getAllAndOverride<boolean>(SECURITY_BYPASS_KEY, [context.getHandler(), context.getClass()])
    if (bypass) {
      return true
    }

    const req = context.switchToHttp().getRequest<Request>()
    const res = context.switchToHttp().getResponse<Response>()

    const token = this.session.readToken(req)
    if (!token) {
      this.redirectToSignin(req, res)
      return false
    }

    try {
      const payload = verify(token, this.jwtSecret) as JwtPayload
      req.auth = payload
      return true
    } catch (err) {
      // Expired, bad signature, or malformed. Clear the bad cookie so the
      // browser doesn't keep presenting it on every navigation.
      this.logger.debug(`JWT rejected: ${(err as Error).message}`)
      this.session.clear(res)
      this.redirectToSignin(req, res)
      return false
    }
  }

  private redirectToSignin(req: Request, res: Response): void {
    // Preserve where the user was trying to go so we can bounce them back after signin.
    // Only retain same-origin GET targets — POSTs and external URLs aren't safe to replay.
    const next = req.method === 'GET' ? req.originalUrl : '/'
    const target = `/signin?next=${encodeURIComponent(next)}`
    res.redirect(302, target)
  }
}
