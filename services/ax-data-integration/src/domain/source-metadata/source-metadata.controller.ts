import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common'
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { ObjectId } from 'mongodb'

import { resolvePagination } from '../../acore/config/pagination'
import { ObjectIdPipe } from '../../acore/mongo'
import { LatestSourceMetadataQuery, ListSourceMetadataQuery } from './dto/list-source-metadata.query'
import { SourceMetadataRepository } from './source-metadata.repository'
import type { SourceMetadataDoc } from './source-metadata.schema'

/** Summary returned by list (no full `schema.raw`, only field count + schemaHash). */
export interface SourceMetadataSummary {
  id: string
  jobConfigId: string
  syncRunId: string
  schemaHash: string
  fieldCount: number
  detectedAt: string
  createdAt: string
}

/** Full detail returned by GET /:id and /latest. */
export interface SourceMetadataDetail extends SourceMetadataSummary {
  schema: SourceMetadataDoc['schema']
}

export interface ListSourceMetadataResponse {
  items: SourceMetadataSummary[]
  total: number
  page: number
  pageSize: number
}

@ApiTags('Source metadata')
@ApiSecurity('axios-key')
@ApiUnauthorizedResponse({ description: 'Missing or invalid x-api-key header.' })
@ApiBadRequestResponse({ description: 'Validation error in DTO or query.' })
@Controller('source-metadata')
export class SourceMetadataController {
  constructor(private readonly metadata: SourceMetadataRepository) {}

  @Get()
  @ApiOperation({
    summary: 'List source metadata snapshots for a job config',
    description: 'Filter by schemaHash. `jobConfigId` is required. Paginated, newest detected first.',
  })
  @ApiOkResponse({ description: 'Paginated list of source_metadata summaries (no full schema).' })
  async list(@Query() query: ListSourceMetadataQuery): Promise<ListSourceMetadataResponse> {
    const { page, pageSize, skip, limit } = resolvePagination(query)
    const { items, total } = await this.metadata.list({
      jobConfigId: new ObjectId(query.jobConfigId),
      schemaHash: query.schemaHash,
      skip,
      limit,
    })
    return { items: items.map(toSummary), total, page, pageSize }
  }

  @Get('latest')
  @ApiOperation({
    summary: 'Get the most recent source metadata snapshot for a job config',
    description: 'Convenience for the common "what schema is this job currently seeing?" lookup. Returns 404 if no snapshot has been recorded yet.',
  })
  @ApiOkResponse({ description: 'The newest source_metadata document for the job_config.' })
  @ApiNotFoundResponse({ description: 'No metadata snapshot has been recorded for this job_config yet.' })
  async latest(@Query() query: LatestSourceMetadataQuery): Promise<SourceMetadataDetail> {
    const doc = await this.metadata.findLatest(new ObjectId(query.jobConfigId))
    if (!doc) throw new NotFoundException(`No source_metadata for job_config ${query.jobConfigId}`)
    return toDetail(doc)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a source metadata snapshot detail (includes full schema)' })
  @ApiOkResponse({ description: 'The full source_metadata document.' })
  @ApiNotFoundResponse({ description: 'No source_metadata with the given id.' })
  async detail(@Param('id', ObjectIdPipe) id: ObjectId): Promise<SourceMetadataDetail> {
    const doc = await this.metadata.findById(id)
    if (!doc) throw new NotFoundException(`Source metadata ${id.toHexString()} not found`)
    return toDetail(doc)
  }
}

function toSummary(doc: SourceMetadataDoc): SourceMetadataSummary {
  return {
    id: doc._id.toHexString(),
    jobConfigId: doc.jobConfigId.toHexString(),
    syncRunId: doc.syncRunId.toHexString(),
    schemaHash: doc.schemaHash,
    fieldCount: doc.schema.fields.length,
    detectedAt: doc.detectedAt.toISOString(),
    createdAt: doc.createdAt.toISOString(),
  }
}

function toDetail(doc: SourceMetadataDoc): SourceMetadataDetail {
  return {
    ...toSummary(doc),
    schema: doc.schema,
  }
}
