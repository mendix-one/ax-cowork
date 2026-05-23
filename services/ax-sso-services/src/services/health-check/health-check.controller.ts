import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { SecurityBypassAll } from '../../acore/security'
import { HealthCheckResDto } from './dto/health-check.res-dto'

@ApiTags('Service')
@SecurityBypassAll()
@Controller('health-check')
export class HealthCheckController {
  @Get()
  @ApiOperation({ summary: 'Health check' })
  @ApiOkResponse({ type: HealthCheckResDto, description: 'Returns ok when the service is up.' })
  index(): HealthCheckResDto {
    return {
      status: 'ok',
    }
  }
}
