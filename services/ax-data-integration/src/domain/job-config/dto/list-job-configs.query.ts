import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsBoolean, IsIn, IsInt, IsOptional, IsPositive } from 'class-validator'

import type { SourceType } from '../job-config.schema'
import { SOURCE_TYPES } from './create-job-config.dto'

export class ListJobConfigsQuery {
  @ApiPropertyOptional({ description: 'Filter by enabled flag.' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true
    if (value === 'false' || value === false) return false
    return value as unknown
  })
  @IsBoolean()
  enabled?: boolean

  @ApiPropertyOptional({ enum: SOURCE_TYPES })
  @IsOptional()
  @IsIn(SOURCE_TYPES)
  sourceType?: SourceType

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
