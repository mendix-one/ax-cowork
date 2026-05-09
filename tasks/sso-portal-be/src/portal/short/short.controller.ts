import { Controller, Get, Param, Res, UseFilters } from '@nestjs/common'
import { Response } from 'express'
import { SystemExceptionFilter } from '../../core/exception/system.exception.filter'
import { ShortService } from './short.service'
import { AttemptReqParam } from './dto/attempt.req-param'

@Controller('short')
export class ShortController {
  constructor(private shortService: ShortService) {}

  @Get(':code')
  @UseFilters(SystemExceptionFilter)
  async index(@Param() param: AttemptReqParam, @Res() res: Response) {
    // Attempt short to get target
    const target: string = await this.shortService.attempt(param.code)

    // Redirect back
    return res.redirect(target || '/system-error')
  }
}
