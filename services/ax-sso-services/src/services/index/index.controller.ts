import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger'

import { IndexResDto } from './dto/index.res-dto'

@ApiTags('Service')
@ApiSecurity('ax-api-key')
@Controller()
export class IndexController {
  @Get()
  @ApiOperation({ summary: 'Service identity' })
  @ApiOkResponse({ type: IndexResDto, description: 'Returns the service name and status.' })
  index(): IndexResDto {
    return {
      name: 'ax-sso-services',
      status: 'ok',
    }
  }
}
