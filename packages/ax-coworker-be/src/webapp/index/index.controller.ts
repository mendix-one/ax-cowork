import { Controller, Get, Logger, Render, Req, Res } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Request, Response } from 'express'
import { verify, type JwtPayload } from 'jsonwebtoken'

import { SessionService } from '../../acore/security/session.service'
import { SsoClient } from '../../acore/security/sso.client'

@Controller()
export class IndexController {
  private readonly logger = new Logger(IndexController.name)
  private readonly jwtSecret: string

  constructor(
    private readonly configService: ConfigService,
    private readonly session: SessionService,
    private readonly sso: SsoClient,
  ) {
    this.jwtSecret = configService.getOrThrow<string>('SSO_JWT_SECRET')
  }

  extract(token: string | null | undefined): JwtPayload | undefined {
    if (!token) return undefined
    try {
      return verify(token, this.jwtSecret) as JwtPayload
    } catch (err) {
      this.logger.warn(`JWT was rejected: ${(err as Error).message}`)
      return undefined
    }
  }

  @Get(['', '/*'])
  @Render('index')
  async index(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = this.session.readToken(req)
    let payload = this.extract(token)
    if (!payload) {
      try {
        const initialized = await this.sso.initialize()
        const ttlMs = Math.max(0, new Date(initialized.expiresAt).getTime() - Date.now())
        this.session.setToken(res, initialized.token, ttlMs)
        payload = this.extract(initialized.token)
      } catch (err) {
        this.logger.warn(`Failed to initialize SSO session, serving without cookie: ${(err as Error).message}`)
        return res.redirect(301, '/system-error?message=SSO+Unavailable')
      }
    }

    const scripts = this.configService.get<string[]>('WEBAPP_SCRIPTS')
    const styles = this.configService.get<string[]>('WEBPAGE_STYLES')

    return { meta: JSON.stringify(payload), scripts, styles }
  }
}
