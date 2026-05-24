import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import type { ObjectId } from 'mongodb'

import { ObjectIdPipe } from '../../acore/mongo'
import { CreateJobConfigDto } from './dto/create-job-config.dto'
import { ListJobConfigsQuery } from './dto/list-job-configs.query'
import { UpdateJobConfigDto } from './dto/update-job-config.dto'
import { JobConfigsService } from './job-config.service'
import type { JobConfigSummary, ListJobConfigsResult } from './job-config.schema'

// TODO: replace with the API-key principal once the guard attaches one to the request.
const PHASE_1_PRINCIPAL = 'axios-key'

@ApiTags('Job configs')
@ApiSecurity('axios-key')
@ApiUnauthorizedResponse({ description: 'Missing or invalid x-axios-key header.' })
@ApiBadRequestResponse({ description: 'Validation error in DTO or query.' })
@Controller('job-configs')
export class JobConfigController {
  constructor(private readonly jobConfigs: JobConfigsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a job config' })
  @ApiCreatedResponse()
  @ApiConflictResponse({ description: 'A job config with that name already exists.' })
  create(@Body() dto: CreateJobConfigDto): Promise<JobConfigSummary> {
    return this.jobConfigs.create({
      name: dto.name,
      description: dto.description,
      enabled: dto.enabled,
      source: dto.source,
      schedule: dto.schedule,
      identity: dto.identity,
      options: dto.options,
      credentialsRef: dto.credentialsRef,
      createdBy: PHASE_1_PRINCIPAL,
    })
  }

  @Get()
  @ApiOperation({ summary: 'List job configs', description: 'Filter by `enabled` and `sourceType`. Pagination via `page` + `pageSize` (cap 200).' })
  @ApiOkResponse()
  list(@Query() query: ListJobConfigsQuery): Promise<ListJobConfigsResult> {
    return this.jobConfigs.list({
      enabled: query.enabled,
      sourceType: query.sourceType,
      page: query.page,
      pageSize: query.pageSize,
    })
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one job config by id' })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  getById(@Param('id', ObjectIdPipe) id: ObjectId): Promise<JobConfigSummary> {
    return this.jobConfigs.getById(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a job config',
    description:
      'When `expectedUpdatedAt` is supplied and does not match the stored value, the request fails with 409. Pass `null` for `description` or `credentialsRef` to clear them.',
  })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse({ description: 'Stale `expectedUpdatedAt` or duplicate `name`.' })
  update(@Param('id', ObjectIdPipe) id: ObjectId, @Body() dto: UpdateJobConfigDto): Promise<JobConfigSummary> {
    const expected = dto.expectedUpdatedAt ? new Date(dto.expectedUpdatedAt) : undefined
    return this.jobConfigs.update(
      id,
      {
        name: dto.name,
        description: dto.description,
        source: dto.source,
        schedule: dto.schedule,
        identity: dto.identity,
        options: dto.options,
        credentialsRef: dto.credentialsRef,
      },
      expected,
    )
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft-delete a job config', description: 'Sets `enabled=false`. History is preserved.' })
  @ApiOkResponse({ description: 'The updated summary with `enabled=false`.' })
  @ApiNotFoundResponse()
  softDelete(@Param('id', ObjectIdPipe) id: ObjectId): Promise<JobConfigSummary> {
    return this.jobConfigs.softDelete(id)
  }

  @Post(':id/enable')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enable a job config' })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  enable(@Param('id', ObjectIdPipe) id: ObjectId): Promise<JobConfigSummary> {
    return this.jobConfigs.setEnabled(id, true)
  }

  @Post(':id/disable')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Disable a job config' })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  disable(@Param('id', ObjectIdPipe) id: ObjectId): Promise<JobConfigSummary> {
    return this.jobConfigs.setEnabled(id, false)
  }
}
