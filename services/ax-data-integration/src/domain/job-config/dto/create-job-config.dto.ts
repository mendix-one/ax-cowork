import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsIn, IsInt, IsMongoId, IsNotEmpty, IsObject, IsOptional, IsPositive, IsString, MaxLength, ValidateNested } from 'class-validator'

import type { IdentityStrategy, SourceType } from '../job-config.schema'

export const SOURCE_TYPES: readonly SourceType[] = ['excel', 'csv', 'mysql', 'postgres', 'mssql', 'oracle', 'rest', 'graphql', 'soap']
export const IDENTITY_STRATEGIES: readonly IdentityStrategy[] = ['primary-key', 'composite', 'hash', 'row-number']

export class SourceDto {
  @ApiProperty({ enum: SOURCE_TYPES, example: 'rest' })
  @IsIn(SOURCE_TYPES)
  type!: SourceType

  @ApiProperty({ type: 'object', additionalProperties: true, description: 'Type-specific config (see P002 §6).' })
  @IsObject()
  config!: Record<string, unknown>
}

export class ScheduleDto {
  @ApiProperty({ example: '0 * * * *', description: 'Standard 5-field cron expression.' })
  @IsString()
  @IsNotEmpty()
  cronExpression!: string

  @ApiPropertyOptional({ example: 'UTC', description: 'Overrides INTEGRATION_DEFAULT_TIMEZONE.' })
  @IsOptional()
  @IsString()
  timezone?: string
}

export class IdentityDto {
  @ApiProperty({ enum: IDENTITY_STRATEGIES })
  @IsIn(IDENTITY_STRATEGIES)
  strategy!: IdentityStrategy

  @ApiProperty({ type: [String], description: 'Field names used by primary-key / composite strategies.' })
  @IsArray()
  @IsString({ each: true })
  fields!: string[]

  @ApiPropertyOptional({ description: 'Required when strategy=hash — acknowledges that every payload change becomes insert+delete (see P002 §9.1).' })
  @IsOptional()
  @IsBoolean()
  acknowledgeHashSemantics?: boolean
}

export class RateLimitDto {
  @ApiProperty({ description: 'Requests per second cap when calling external APIs.' })
  @IsInt()
  @IsPositive()
  rps!: number
}

export class OptionsDto {
  @ApiPropertyOptional({ default: true, description: 'Mark records absent from the source as deleted after each sync.' })
  @IsOptional()
  @IsBoolean()
  detectDeleted?: boolean

  @ApiPropertyOptional({ default: true, description: 'Write a raw_record_changelog entry for every insert/update/delete.' })
  @IsOptional()
  @IsBoolean()
  auditChanges?: boolean

  @ApiPropertyOptional({ description: 'Override INTEGRATION_DEFAULT_ERROR_THRESHOLD for this job.' })
  @IsOptional()
  @IsInt()
  @IsPositive()
  errorThreshold?: number

  @ApiPropertyOptional({ type: RateLimitDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => RateLimitDto)
  rateLimit?: RateLimitDto
}

export class CreateJobConfigDto {
  @ApiProperty({ maxLength: 100, example: 'daily-sales-axios' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean

  @ApiProperty({ type: SourceDto })
  @ValidateNested()
  @Type(() => SourceDto)
  source!: SourceDto

  @ApiProperty({ type: ScheduleDto })
  @ValidateNested()
  @Type(() => ScheduleDto)
  schedule!: ScheduleDto

  @ApiProperty({ type: IdentityDto })
  @ValidateNested()
  @Type(() => IdentityDto)
  identity!: IdentityDto

  @ApiPropertyOptional({ type: OptionsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OptionsDto)
  options?: OptionsDto

  @ApiPropertyOptional({ description: 'ObjectId hex string of a stored secret.', example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsMongoId()
  credentialsRef?: string
}
