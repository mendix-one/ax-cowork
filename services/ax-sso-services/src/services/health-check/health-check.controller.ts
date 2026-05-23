import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { Public } from '../../acore/security'
import { HealthCheckResDto } from './dto/health-check.res-dto'

@ApiTags('Service')
@Public()
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
