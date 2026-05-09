import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Service')
@Controller('health-check')
export class HealthCheckController {
  @Get()
  @ApiOperation({ summary: 'Health check' })
  @ApiOkResponse({ description: 'Returns ok when the service is up.' })
  index() {
    return {
      status: 'ok',
    }
  }
}
