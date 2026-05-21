import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { Public } from '../../acore/auth'

@ApiTags('Service')
@Controller()
@Public()
export class IndexController {
  @Get()
  @ApiOperation({ summary: 'Service identity' })
  @ApiOkResponse({ description: 'Returns the service name and status.' })
  index() {
    return {
      name: 'ax-data-integration',
      status: 'ok',
    }
  }
}
