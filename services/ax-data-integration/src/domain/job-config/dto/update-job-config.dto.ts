import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsBoolean, IsISO8601, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateIf, ValidateNested } from 'class-validator'

import { IdentityDto, OptionsDto, ScheduleDto, SourceDto } from './create-job-config.dto'

export class UpdateJobConfigDto {
  @ApiPropertyOptional({ maxLength: 100 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name?: string

  @ApiPropertyOptional({ description: 'Pass `null` to clear the description.', nullable: true })
  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsString()
  description?: string | null

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  enabled?: boolean

  @ApiPropertyOptional({ type: SourceDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => SourceDto)
  source?: SourceDto

  @ApiPropertyOptional({ type: ScheduleDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ScheduleDto)
  schedule?: ScheduleDto

  @ApiPropertyOptional({ type: IdentityDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => IdentityDto)
  identity?: IdentityDto

  @ApiPropertyOptional({ type: OptionsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OptionsDto)
  options?: OptionsDto

  @ApiPropertyOptional({ description: 'Pass `null` to clear, a hex ObjectId to set/replace.', nullable: true })
  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsMongoId()
  credentialsRef?: string | null

  @ApiPropertyOptional({
    description: 'ISO 8601 datetime of the doc snapshot the client read. PATCH fails with 409 if the stored updatedAt no longer matches.',
  })
  @IsOptional()
  @IsISO8601()
  expectedUpdatedAt?: string
}
