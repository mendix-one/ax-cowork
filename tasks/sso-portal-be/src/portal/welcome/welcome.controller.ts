import { Body, Controller, Get, Post, Query, Render, Req, UseFilters } from '@nestjs/common'
import { MyHeaders } from '../../core/decorator/my-headers.decorator'
import { SystemExceptionFilter } from '../../core/exception/system.exception.filter'
import { Biding } from '../../core/interceptor/binding.decorator'
import { WelcomeService } from './welcome.service'
import { SubmitReqBody } from './dto/submit.req-body'
import { DisplayReqQuery } from './dto/display.req-query'
import { WelcomeReqHeader } from './dto/welcome.req-header'
import { CheckReqQuery } from './dto/check.req-query'
import { Request } from 'express'
import { IndexReqQuery } from './dto/index.req-query'

@Controller('welcome')
export class WelcomeController {
  constructor(private resetService: WelcomeService) {}

  @Get()
  @Biding()
  @Render('index')
  @UseFilters(SystemExceptionFilter)
  async index(@Query() query: IndexReqQuery, @Req() req: Request) {
    // Parse data
    const data = await this.resetService.extract(query.token)

    // @ts-expect-error - Set session language & timezone
    req.session.lang = data?.lang || req.session.lang

    // @ts-expect-error - Set session language & timezone
    req.session.timezone = data?.timezone || req.session.timezone

    return data
  }

  @Biding()
  @Get('set-password')
  @Render('index')
  @UseFilters(SystemExceptionFilter)
  password() {
    return {}
  }

  @Biding()
  @Get('display')
  @Render('index')
  @UseFilters(SystemExceptionFilter)
  display() {
    return {}
  }

  @Get('check')
  async check(@Query() query: CheckReqQuery) {
    return await this.resetService.check(query.token)
  }

  @Get('extract')
  async extract(@Query() query: DisplayReqQuery) {
    return await this.resetService.extract(query.token)
  }

  @Post('password')
  async submit(@Body() body: SubmitReqBody, @MyHeaders() headers: WelcomeReqHeader) {
    const token = await this.resetService.submit(body.key, body.secret, body.newPassword, headers)
    return {
      token
    }
  }
}
