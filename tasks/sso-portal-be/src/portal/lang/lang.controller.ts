import { Body, Controller, Post, Req, Res, UseFilters } from '@nestjs/common'
import { Request, Response } from 'express'
import { SystemExceptionFilter } from '../../core/exception/system.exception.filter'
import { ChangeLangReqBody } from './dto/change-lang.req-body'

@Controller('language')
export class LangController {
  constructor() {}

  getSiteHost(req: Request): string {
    const host = req.get('host')
    const proto = host.includes('localhost') ? 'http' : 'https'
    return `${proto}://${host}`
  }

  @Post()
  @UseFilters(SystemExceptionFilter)
  async index(@Body() body: ChangeLangReqBody, @Req() req: Request, @Res() res: Response) {
    // Get site host
    const siteHost = this.getSiteHost(req)

    // Set session language
    // @ts-expect-error - Express session
    req.session.lang = body.lang

    // Redirect back
    return res.redirect(body.back || siteHost)
  }
}
