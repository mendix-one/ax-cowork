import { Controller, Get, Query, Req, Res, UseFilters } from '@nestjs/common'
import { Request, Response } from 'express'
import { SystemExceptionFilter } from '../../core/exception/system.exception.filter'
import { SignoutService } from './signout.service'

@Controller()
export class SignoutController {
  constructor(private signoutService: SignoutService) {}

  getSiteHost(req: Request): string {
    const host = req.get('host')
    const proto = host.includes('localhost') ? 'http' : 'https'
    return `${proto}://${host}`
  }

  @Get('logout')
  @UseFilters(SystemExceptionFilter)
  async logout(@Req() req: Request, @Res() res: Response, @Query('action') action: string) {
    // Get site host
    const siteHost = this.getSiteHost(req)

    // @ts-expect-error - Authentication
    const auth = <Authentication>req.auth

    // Check session
    if (!auth || !auth.sid) {
      return res.redirect(`/system-error?remark=session-expired`)
    }

    // Attempt sign out
    if (auth.cid && auth.account) {
      await this.signoutService.attempt(auth)
    }

    // Redirect back
    return res.redirect(`${siteHost}/redirect?action=${encodeURIComponent(action || siteHost)}`)
  }
}
