import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common'
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { ObjectId } from 'mongodb'

import { resolvePagination } from '../../acore/config/pagination'
import { ObjectIdPipe } from '../../acore/mongo'
import { ListRawRecordsQuery } from './dto/list-raw-records.query'
import { RawRecordRepository } from './raw-record.repository'
import type { RawRecordDoc } from './raw-record.schema'

/** Summary item returned by GET /raw-records (no `payload` to keep list responses light). */
export interface RawRecordSummary {
  id: string
  jobConfigId: string
  recordKey: string
  status: RawRecordDoc['status']
  version: number
  payloadHash: string
  firstSeenAt: string
  lastSeenAt: string
  firstSeenRunId: string
  lastUpdatedRunId: string
  deletedInRunId?: string
}

/** Full detail returned by GET /raw-records/:id (includes the payload). */
export interface RawRecordDetail extends RawRecordSummary {
  payload: Record<string, unknown>
  payloadRef?: string
  createdAt: string
}

export interface ListRawRecordsResponse {
  items: RawRecordSummary[]
  total: number
  page: number
  pageSize: number
}

@ApiTags('Raw records')
@ApiSecurity('axios-key')
@ApiUnauthorizedResponse({ description: 'Missing or invalid x-api-key header.' })
@ApiBadRequestResponse({ description: 'Validation error in DTO or query.' })
@Controller('raw-records')
export class RawRecordController {
  constructor(private readonly rawRecords: RawRecordRepository) {}

  @Get()
  @ApiOperation({
    summary: 'List raw records for a job config',
    description: 'Filter by status / recordKey / runId. `jobConfigId` is required. Paginated, newest-touched first (lastSeenAt DESC).',
  })
  @ApiOkResponse({ description: 'Paginated list of raw_record summaries (no payload).' })
  async list(@Query() query: ListRawRecordsQuery): Promise<ListRawRecordsResponse> {
    const { page, pageSize, skip, limit } = resolvePagination(query)
    const { items, total } = await this.rawRecords.list({
      jobConfigId: new ObjectId(query.jobConfigId),
      status: query.status,
      recordKey: query.recordKey,
      runId: query.runId ? new ObjectId(query.runId) : undefined,
      skip,
      limit,
    })
    return { items: items.map(toSummary), total, page, pageSize }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a raw record detail (includes payload)' })
  @ApiOkResponse({ description: 'The full raw_record document.' })
  @ApiNotFoundResponse({ description: 'No raw_record with the given id.' })
  async detail(@Param('id', ObjectIdPipe) id: ObjectId): Promise<RawRecordDetail> {
    const doc = await this.rawRecords.findById(id)
    if (!doc) throw new NotFoundException(`Raw record ${id.toHexString()} not found`)
    return toDetail(doc)
  }
}

function toSummary(doc: RawRecordDoc): RawRecordSummary {
  return {
    id: doc._id.toHexString(),
    jobConfigId: doc.jobConfigId.toHexString(),
    recordKey: doc.recordKey,
    status: doc.status,
    version: doc.version,
    payloadHash: doc.payloadHash,
    firstSeenAt: doc.firstSeenAt.toISOString(),
    lastSeenAt: doc.lastSeenAt.toISOString(),
    firstSeenRunId: doc.firstSeenRunId.toHexString(),
    lastUpdatedRunId: doc.lastUpdatedRunId.toHexString(),
    ...(doc.deletedInRunId ? { deletedInRunId: doc.deletedInRunId.toHexString() } : {}),
  }
}

function toDetail(doc: RawRecordDoc): RawRecordDetail {
  return {
    ...toSummary(doc),
    payload: doc.payload,
    ...(doc.payloadRef ? { payloadRef: doc.payloadRef.toHexString() } : {}),
    createdAt: doc.createdAt.toISOString(),
  }
}
