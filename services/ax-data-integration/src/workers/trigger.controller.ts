import { ConflictException, Controller, HttpCode, HttpStatus, NotFoundException, Param, Post } from '@nestjs/common'
import { ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger'
import type { ObjectId } from 'mongodb'

import { ObjectIdPipe } from '../acore/mongo'
import { JobConfigRepository, type RunStatus } from '../domain/job-config'
import { SyncExecutorService } from './sync-executor.service'

export interface TriggerResponse {
  /** Hex string of the created `sync_runs._id`. */
  runId: string
  /** Final status the run finished with. */
  status: RunStatus
}

/**
 * Lives in `workers/` (not `domain/job-config/`) to break what would otherwise be a
 * circular module dep: `JobConfigModule` ↔ `WorkersModule`. The URL prefix and Swagger
 * tag still group it visually with the rest of the job-config CRUD.
 */
@ApiTags('Job configs')
@ApiSecurity('axios-key')
@Controller('job-configs')
export class TriggerController {
  constructor(
    private readonly executor: SyncExecutorService,
    private readonly jobConfigs: JobConfigRepository,
  ) {}

  @Post(':id/trigger')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Manually trigger a sync run',
    description:
      'Invokes the executor with `triggeredBy=manual`. Returns the created sync_run id and its final status. Use the sync-runs detail endpoint for full counts/errors.',
  })
  @ApiOkResponse({ description: 'The run was claimed and finalized (status may be success / partial / failed).' })
  @ApiNotFoundResponse({ description: 'No job_config with the given id.' })
  @ApiConflictResponse({ description: 'Another sync_run is already in flight for this job_config.' })
  async trigger(@Param('id', ObjectIdPipe) id: ObjectId): Promise<TriggerResponse> {
    const doc = await this.jobConfigs.findById(id)
    if (!doc) throw new NotFoundException(`Job config ${id.toHexString()} not found`)

    const result = await this.executor.execute(id, 'manual')
    if (result.kind === 'acquired') {
      return { runId: result.runId.toHexString(), status: result.status }
    }
    throw new ConflictException(result.reason)
  }
}
