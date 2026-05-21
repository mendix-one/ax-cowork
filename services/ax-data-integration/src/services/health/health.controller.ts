import { Controller, Get, HttpStatus, Inject, ServiceUnavailableException } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { MongoClient } from 'mongodb'

import { Public } from '../../acore/auth'
import { MONGO_CLIENT } from '../../acore/mongo'

@ApiTags('Service')
@Controller('health')
@Public()
export class HealthController {
  constructor(@Inject(MONGO_CLIENT) private readonly mongo: MongoClient) {}

  @Get()
  @ApiOperation({ summary: 'Liveness probe' })
  @ApiOkResponse({ description: 'Service process is up.' })
  liveness() {
    return { status: 'ok' }
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe (Mongo connected)' })
  @ApiOkResponse({ description: 'Service can serve requests.' })
  @ApiResponse({ status: HttpStatus.SERVICE_UNAVAILABLE, description: 'Mongo not reachable.' })
  async readiness() {
    try {
      await this.mongo.db().admin().ping()
      return { status: 'ready', mongo: 'connected' }
    } catch (err) {
      throw new ServiceUnavailableException({
        status: 'not-ready',
        mongo: 'disconnected',
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }
}
