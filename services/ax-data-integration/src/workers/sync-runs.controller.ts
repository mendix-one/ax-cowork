import { BadRequestException, ConflictException, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Query } from '@nestjs/common'
import { ApiBadRequestResponse, ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger'
import { ObjectId } from 'mongodb'

import { resolvePagination } from '../acore/config/pagination'
import { ObjectIdPipe } from '../acore/mongo'
import { JobConfigRepository } from '../domain/job-config'
import { SyncRunRepository, type SyncRunCounts, type SyncRunDoc, type SyncRunErrorEntry } from '../domain/sync-run'
import { ListSyncRunsQuery } from './dto/list-sync-runs.query'
import { SyncExecutorService } from './sync-executor.service'

/** Summary item returned by GET /sync-runs (no `errors` to keep list responses light). */
export interface SyncRunSummary {
  id: string
  jobConfigId: string
  triggeredBy: SyncRunDoc['triggeredBy']
  status: SyncRunDoc['status']
  parentRunId?: string
  startedAt: string
  finishedAt?: string
  counts: SyncRunCounts
}

/** Full detail returned by GET /sync-runs/:id (includes per-record errors). */
export interface SyncRunDetail extends SyncRunSummary {
  heartbeatAt: string
  workerId: string
  errors: SyncRunErrorEntry[]
  metadataSnapshotId?: string
}

export interface ListSyncRunsResponse {
  items: SyncRunSummary[]
  total: number
  page: number
  pageSize: number
}

export interface RetrySyncRunResponse {
  runId: string
  status: SyncRunDoc['status']
  parentRunId: string
}

@ApiTags('Sync runs')
@ApiSecurity('api-key')
@Controller('sync-runs')
export class SyncRunsController {
  constructor(
    private readonly runs: SyncRunRepository,
    private readonly jobConfigs: JobConfigRepository,
    private readonly executor: SyncExecutorService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'List sync runs',
    description: 'Filter by jobConfigId / status / startedAt range. Paginated, newest first.',
  })
  @ApiOkResponse({ description: 'Paginated list of sync_run summaries.' })
  async list(@Query() query: ListSyncRunsQuery): Promise<ListSyncRunsResponse> {
    const { page, pageSize, skip, limit } = resolvePagination(query)
    const { items, total } = await this.runs.list({
      jobConfigId: query.jobConfigId ? new ObjectId(query.jobConfigId) : undefined,
      status: query.status,
      from: query.from ? new Date(query.from) : undefined,
      to: query.to ? new Date(query.to) : undefined,
      skip,
      limit,
    })
    return { items: items.map(toSummary), total, page, pageSize }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a sync run detail (includes counts + errors)' })
  @ApiOkResponse({ description: 'The full sync_run document.' })
  @ApiNotFoundResponse({ description: 'No sync_run with the given id.' })
  async detail(@Param('id', ObjectIdPipe) id: ObjectId): Promise<SyncRunDetail> {
    const doc = await this.runs.findById(id)
    if (!doc) throw new NotFoundException(`Sync run ${id.toHexString()} not found`)
    return toDetail(doc)
  }

  @Post(':id/retry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retry a finished sync run',
    description:
      'Creates a new sync_run with `triggeredBy=retry` and `parentRunId=:id`, using the CURRENT job_config snapshot (not the one captured at the parent run).',
  })
  @ApiOkResponse({ description: 'A new sync_run was created and finalized.' })
  @ApiNotFoundResponse({ description: 'No sync_run (or its job_config) with the given id.' })
  @ApiBadRequestResponse({ description: 'Cannot retry a run that is still in flight.' })
  @ApiConflictResponse({ description: 'Another sync_run is already running for this job_config.' })
  async retry(@Param('id', ObjectIdPipe) id: ObjectId): Promise<RetrySyncRunResponse> {
    const parent = await this.runs.findById(id)
    if (!parent) throw new NotFoundException(`Sync run ${id.toHexString()} not found`)
    if (parent.status === 'running') {
      throw new BadRequestException('Cannot retry a sync run that is still in flight')
    }
    // Confirm the underlying job_config still exists — the executor would also fail, but
    // returning 404 here is cleaner than an `acquired + failed` result for a deleted job.
    const job = await this.jobConfigs.findById(parent.jobConfigId)
    if (!job) throw new NotFoundException(`Job config ${parent.jobConfigId.toHexString()} not found`)

    const result = await this.executor.execute(parent.jobConfigId, 'retry', { parentRunId: id })
    if (result.kind === 'acquired') {
      return { runId: result.runId.toHexString(), status: result.status, parentRunId: id.toHexString() }
    }
    throw new ConflictException(result.reason)
  }
}

function toSummary(doc: SyncRunDoc): SyncRunSummary {
  return {
    id: doc._id.toHexString(),
    jobConfigId: doc.jobConfigId.toHexString(),
    triggeredBy: doc.triggeredBy,
    status: doc.status,
    ...(doc.parentRunId ? { parentRunId: doc.parentRunId.toHexString() } : {}),
    startedAt: doc.startedAt.toISOString(),
    ...(doc.finishedAt ? { finishedAt: doc.finishedAt.toISOString() } : {}),
    counts: doc.counts,
  }
}

function toDetail(doc: SyncRunDoc): SyncRunDetail {
  return {
    ...toSummary(doc),
    heartbeatAt: doc.heartbeatAt.toISOString(),
    workerId: doc.workerId,
    errors: doc.errors,
    ...(doc.metadataSnapshotId ? { metadataSnapshotId: doc.metadataSnapshotId.toHexString() } : {}),
  }
}
