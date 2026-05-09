import { Controller, Get, Query, Render, Req, Res, UseFilters } from '@nestjs/common'
import { Request, Response } from 'express'
import { SystemExceptionFilter } from '../../core/exception/system.exception.filter'
import { Biding } from '../../core/interceptor/binding.decorator'
import { IndexRes } from './index.interface'

@Controller('/')
export class IndexController {
  constructor() {}

  getSiteHost(req: Request): string {
    const host = req.get('host')
    const proto = host.includes('localhost') ? 'http' : 'https'
    return `${proto}://${host}`
  }

  @Get()
  @Biding()
  @Render('index')
  @UseFilters(SystemExceptionFilter)
  index() {
    return {}
  }

  @Get('redirect')
  redirect(@Query('action') action: string, @Req() req: Request, @Res() res: Response) {
    // Get site host
    const siteHost = this.getSiteHost(req)

    // @ts-expect-error - authentication action
    const url = action || req.session?.action || siteHost

    // @ts-expect-error - authentication action
    req.session.action = undefined

    // Return to client to redirect
    return res.redirect(url)
  }

  @Get('/health-check')
  async check(): Promise<IndexRes> {
    return <IndexRes>{
      code: 200,
      message: "Hi! I'm working well...",
      timestamp: new Date()
    }
  }
}
