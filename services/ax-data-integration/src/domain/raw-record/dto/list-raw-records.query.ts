import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsIn, IsInt, IsMongoId, IsOptional, IsPositive, IsString } from 'class-validator'

import type { RawRecordStatus } from '../raw-record.schema'

const RAW_RECORD_STATUSES: readonly RawRecordStatus[] = ['active', 'deleted']

export class ListRawRecordsQuery {
  @ApiProperty({ description: 'Filter by job_config id (hex ObjectId). Required — list scans are scoped per job_config for indexing.' })
  @IsMongoId()
  jobConfigId!: string

  @ApiPropertyOptional({ enum: RAW_RECORD_STATUSES })
  @IsOptional()
  @IsIn(RAW_RECORD_STATUSES)
  status?: RawRecordStatus

  @ApiPropertyOptional({ description: 'Exact match on recordKey.' })
  @IsOptional()
  @IsString()
  recordKey?: string

  @ApiPropertyOptional({ description: 'Filter to records touched by this sync_run id (matches firstSeen / lastUpdated / deleted in that run).' })
  @IsOptional()
  @IsMongoId()
  runId?: string

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
