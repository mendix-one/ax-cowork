import { Controller, Get, Query, Req, Res, UseFilters } from '@nestjs/common'
import { Request, Response } from 'express'
import { ConnectExceptionFilter } from '../../core/exception/connect.exception.filter'
import { ConnectReqQuery } from './dto/connect.req-query'
import { ConnectService } from './connect.service'
import { Authentication } from '../../core/interface/authentication.interface'
import { HeaderParams } from '../../core/interface/header-params.interface'

@Controller('connect')
export class ConnectController {
  constructor(private connectService: ConnectService) {}

  @Get()
  @UseFilters(ConnectExceptionFilter)
  async index(@Query() params: ConnectReqQuery, @Req() req: Request, @Res() res: Response) {
    // @ts-expect-error - Authentication
    const auth = <Authentication>req.auth

    // Check session
    if (!auth || !auth.sid) {
      return res.redirect(`/system-error?remark=session-expired`)
    }

    // Headers
    const headers: HeaderParams = {
      host: req.get('host'),
      xForwardedFor: req.get('xx-forwarded-for') || req.get('x-forwarded-for'),
      xForwardedProto: req.get('xx-forwarded-proto') || req.get('x-forwarded-proto'),
      xForwardedPort: req.get('xx-forwarded-port') || req.get('x-forwarded-port'),
      userAgent: req.get('xx-user-agent') || req.get('user-agent')
    }

    const code = await this.connectService.connect(auth, params, headers)
    return res.redirect(`${params.redirect}${params.redirect.includes('?') ? '&code=' : '?code='}${code}`)
  }
}
