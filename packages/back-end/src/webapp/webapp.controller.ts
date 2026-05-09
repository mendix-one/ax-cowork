import { join } from 'path'
import { Controller, Get, Res } from '@nestjs/common'
import type { Response } from 'express'

@Controller()
export class WebappController {
  @Get('*splat')
  index(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'index.html'))
  }
}
