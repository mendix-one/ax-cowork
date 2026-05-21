import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsMongoId, IsOptional, IsPositive, IsString } from 'class-validator'

export class ListSourceMetadataQuery {
  @ApiProperty({ description: 'Filter by job_config id (hex ObjectId). Required — snapshots are scoped per job_config.' })
  @IsMongoId()
  jobConfigId!: string

  @ApiPropertyOptional({ description: 'Exact match on schemaHash (sha256 hex).' })
  @IsOptional()
  @IsString()
  schemaHash?: string

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

export class LatestSourceMetadataQuery {
  @ApiProperty({ description: 'Filter by job_config id (hex ObjectId).' })
  @IsMongoId()
  jobConfigId!: string
}
