import { Body, Controller, Get, Post, Query, Render, Req, Res, UseFilters } from '@nestjs/common'
import { Request, Response } from 'express'
import { MyHeaders } from '../../core/decorator/my-headers.decorator'
import { SystemExceptionFilter } from '../../core/exception/system.exception.filter'
import { Biding } from '../../core/interceptor/binding.decorator'
import { SignupService } from './signup.service'
import { RequestReqBody } from './dto/request.req-body'
import { ConvertReqBody } from './dto/convert.req-body'
import { SubmitReqBody } from './dto/submit.req-body'
import { DisplayReqQuery } from './dto/display.req-query'
import { ContinueReqQuery } from './dto/continue.req-query'
import { RequestReqHeader } from './dto/request.req-header'

@Controller('signup')
export class SignupController {
  constructor(private resetService: SignupService) {}

  @Get()
  @Biding()
  @Render('index')
  @UseFilters(SystemExceptionFilter)
  index() {
    return {}
  }

  @Biding()
  @Get('verify-code')
  @Render('index')
  @UseFilters(SystemExceptionFilter)
  code() {
    return {}
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

  @Get('continue')
  @UseFilters(SystemExceptionFilter)
  async continue(@Query() query: ContinueReqQuery, @Res() res: Response) {
    if (!query.key || !query.secret) {
      return res.redirect('/invalid-request')
    }

    const result: any = await this.resetService.check(query.key, query.secret)

    if (result?.code === '1' || result?.code === '2' || result?.code === '3') {
      return res.redirect('/duplicated-info')
    }

    if (result?.code === '9') {
      return res.redirect('/code-expired')
    }

    if (!result || !result?.key || !result?.secret) {
      return res.redirect('/code-expired')
    }

    const path =
      `/signup/set-password` + `?key=${encodeURIComponent(result.key)}&secret=${encodeURIComponent(result.secret)}`

    return res.redirect(path)
  }

  @Post('request')
  async request(@Body() body: RequestReqBody, @MyHeaders() headers: RequestReqHeader) {
    const key = await this.resetService.request(body, headers)
    return { key, email: body.email }
  }

  @Post('verify')
  async verify(@Body() body: ConvertReqBody, @MyHeaders() headers: RequestReqHeader) {
    const secret = await this.resetService.verify(body.key, body.code, headers)
    return {
      key: body.key,
      secret
    }
  }

  @Post('password')
  async submit(@Body() body: SubmitReqBody, @MyHeaders() headers: RequestReqHeader) {
    const token = await this.resetService.submit(body.key, body.secret, body.newPassword, headers)
    return {
      token
    }
  }

  @Get('extract')
  async extract(@Query() query: DisplayReqQuery) {
    return await this.resetService.extract(query.token)
  }
}
