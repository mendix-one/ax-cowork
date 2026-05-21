import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDateString, IsIn, IsInt, IsMongoId, IsOptional, IsPositive } from 'class-validator'

import type { RunStatus } from '../../domain/job-config'

const RUN_STATUSES: readonly RunStatus[] = ['running', 'success', 'partial', 'failed', 'stale']

export class ListSyncRunsQuery {
  @ApiPropertyOptional({ description: 'Filter by job_config id (hex ObjectId).' })
  @IsOptional()
  @IsMongoId()
  jobConfigId?: string

  @ApiPropertyOptional({ enum: RUN_STATUSES })
  @IsOptional()
  @IsIn(RUN_STATUSES)
  status?: RunStatus

  @ApiPropertyOptional({ description: 'startedAt lower bound (ISO 8601).', example: '2026-01-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  from?: string

  @ApiPropertyOptional({ description: 'startedAt upper bound (ISO 8601).', example: '2026-12-31T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  to?: string

  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page?: number

  @ApiPropertyOptional({ minimum: 1, default: 50, description: 'Capped server-side at 200.' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  pageSize?: number
}
