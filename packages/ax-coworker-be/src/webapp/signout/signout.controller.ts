import { Controller, Get, Req, Res } from '@nestjs/common'
import type { Request, Response } from 'express'

import { SecurityBypass } from '../../acore/security/security-bypass.decorator'
import { SessionService } from '../../acore/security/session.service'
import { SsoClient } from '../../acore/security/sso.client'

@Controller()
export class SignoutController {
  constructor(
    private readonly sso: SsoClient,
    private readonly session: SessionService,
  ) {}

  @SecurityBypass()
  @Get('signout')
  async signout(@Req() req: Request, @Res() res: Response) {
    const token = this.session.readToken(req)
    if (token) {
      await this.sso.signout(token)
    }
    this.session.clear(res)
    return res.redirect(302, '/signin')
  }
}
