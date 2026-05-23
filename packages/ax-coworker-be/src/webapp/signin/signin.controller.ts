import { Body, Controller, Get, HttpException, Post, Query, Render, Res } from '@nestjs/common'
import type { Response } from 'express'

import { SecurityBypass } from '../../acore/security/security-bypass.decorator'
import { SessionService } from '../../acore/security/session.service'
import { SsoClient } from '../../acore/security/sso.client'
import type { SigninFormBody } from './signin.dto'

const SESSION_TTL_MS = 24 * 60 * 60 * 1000
const MAX_FIELD_LEN = 256

@Controller()
export class SigninController {
  constructor(
    private readonly sso: SsoClient,
    private readonly session: SessionService,
  ) {}

  @SecurityBypass()
  @Get('signin')
  @Render('signin')
  showForm(@Query('next') next?: string, @Query('error') error?: string) {
    return { next: sanitizeNext(next), error: error ?? null, username: '' }
  }

  @SecurityBypass()
  @Post('signin')
  async submit(@Body() body: SigninFormBody, @Res() res: Response) {
    const username = (body.username ?? '').trim()
    const password = body.password ?? ''
    const next = sanitizeNext(body.next)

    if (!username || !password || username.length > MAX_FIELD_LEN || password.length > MAX_FIELD_LEN) {
      return res.status(400).render('signin', { next, error: 'Please enter your account and password.', username })
    }

    try {
      const result = await this.sso.signin(username, password)
      this.session.setToken(res, result.token, SESSION_TTL_MS)
      return res.redirect(302, next)
    } catch (err) {
      const status = err instanceof HttpException ? err.getStatus() : 500
      const message =
        status === 401
          ? 'Invalid account or password.'
          : status === 502
            ? 'Sign-in service unavailable. Please try again.'
            : 'Sign-in failed. Please try again.'
      return res.status(status === 401 ? 401 : status).render('signin', { next, error: message, username })
    }
  }
}

// Only allow same-origin redirects: must start with '/' and not '//' (protocol-relative).
function sanitizeNext(next: string | undefined): string {
  if (typeof next !== 'string' || next.length === 0) return '/'
  if (!next.startsWith('/') || next.startsWith('//')) return '/'
  return next
}
