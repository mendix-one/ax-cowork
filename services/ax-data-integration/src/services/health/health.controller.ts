import { Controller, Get, HttpStatus, Inject, ServiceUnavailableException } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { MongoClient } from 'mongodb'

import { Public } from '../../acore/auth'
import { MONGO_CLIENT, MONGO_DB } from '../../acore/mongo'
import { findMissingCriticalIndexes } from '../../acore/mongo/indexes'
import type { Db } from 'mongodb'

@ApiTags('Service')
@Controller('health')
@Public()
export class HealthController {
  constructor(
    @Inject(MONGO_CLIENT) private readonly mongo: MongoClient,
    @Inject(MONGO_DB) private readonly db: Db,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Liveness probe' })
  @ApiOkResponse({ description: 'Service process is up.' })
  liveness() {
    return { status: 'ok' }
  }

  /**
   * Readiness checks two layers (T2-A02):
   *
   *   1. Mongo is reachable (ping). Failure → 503 `{mongo: 'disconnected'}`.
   *   2. Every critical index (unique / partial-unique) is materialized. Failure → 503
   *      `{mongo: 'connected', indexes: 'missing', missing: [...]}` so the operator knows
   *      the DB is up but the service is mis-configured (forgot `migrate-indexes` or
   *      `INTEGRATION_AUTO_ENSURE_INDEXES=false`).
   *
   * Non-critical indexes (sort/lookup) are NOT checked — their absence degrades performance
   * but not correctness, and would noisily flap readiness during deploys.
   */
  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe (Mongo connected + critical indexes present)' })
  @ApiOkResponse({ description: 'Service can serve requests.' })
  @ApiResponse({ status: HttpStatus.SERVICE_UNAVAILABLE, description: 'Mongo not reachable OR a critical index is missing.' })
  async readiness() {
    try {
      await this.mongo.db().admin().ping()
    } catch (err) {
      throw new ServiceUnavailableException({
        status: 'not-ready',
        mongo: 'disconnected',
        error: err instanceof Error ? err.message : String(err),
      })
    }

    const missing = await findMissingCriticalIndexes(this.db)
    if (missing.length > 0) {
      throw new ServiceUnavailableException({
        status: 'not-ready',
        mongo: 'connected',
        indexes: 'missing',
        missing: missing.map((m) => `${m.collection}.${m.name}`),
      })
    }

    return { status: 'ready', mongo: 'connected', indexes: 'ok' }
  }
}
