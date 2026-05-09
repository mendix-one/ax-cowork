import { Body, Controller, Get, Post, Query, Render, Req, Res, UseFilters } from '@nestjs/common'
import { Request, Response } from 'express'
import { SystemExceptionFilter } from '../../core/exception/system.exception.filter'
import { Biding } from '../../core/interceptor/binding.decorator'
import { SigninReqBody } from './dto/signin.req-body'
import { SigninService } from './signin.service'

@Controller()
export class SigninController {
  constructor(private signinService: SigninService) {}

  getSiteHost(req: Request): string {
    const host = req.get('host')
    const proto = host.includes('localhost') ? 'http' : 'https'
    return `${proto}://${host}`
  }

  @Get('login')
  @UseFilters(SystemExceptionFilter)
  login(@Req() req: Request, @Res() res: Response, @Query('action') action: string) {
    // Get site host
    const siteHost = this.getSiteHost(req)

    // @ts-expect-error - Authentication
    const auth = <Authentication>req.auth

    // Check authentication
    if (auth.account) {
      // @ts-expect-error - authentication action
      req.session.action = undefined

      // Redirect
      return res.redirect(action || siteHost)
    }

    // @ts-expect-error - authentication action
    req.session.action = action || siteHost
    return res.redirect('/signin')
  }

  @Biding()
  @Get('signin')
  @Render('index')
  @UseFilters(SystemExceptionFilter)
  signin(@Req() req: Request) {
    // Get site host
    const siteHost = this.getSiteHost(req)

    // @ts-expect-error - Authentication
    const auth = <Authentication>req.auth

    // Check session
    if (!auth || !auth.sid) {
      return {
        mustRedirectTo: '/system-error?remark=session-expired'
      }
    }

    // @ts-expect-error - authentication action
    const action = req.session?.action || siteHost

    // Check authentication
    if (auth.account) {
      // @ts-expect-error - authentication action
      req.session.action = undefined

      // Redirect
      return {
        mustRedirectTo: action
      }
    }

    return {}
  }

  @Post('signin')
  async attempt(@Req() req: Request, @Body() body: SigninReqBody) {
    // Get site host
    const siteHost = this.getSiteHost(req)

    // @ts-expect-error - Authentication
    const auth = <Authentication>req.auth

    // Attempt signin
    const data = await this.signinService.attempt(auth, body)

    // Redirect hub
    const action = `${siteHost}/redirect`

    // Return to client to redirect
    return { ...data, action }
  }
}
