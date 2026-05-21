import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

import type { SecretType } from '../secret.schema'

const SECRET_TYPES: SecretType[] = ['db', 'api', 'file']

export class UpdateSecretDto {
  @ApiPropertyOptional({ description: 'New unique name.', maxLength: 100 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name?: string

  @ApiPropertyOptional({ description: 'New credential kind.', enum: SECRET_TYPES })
  @IsOptional()
  @IsIn(SECRET_TYPES)
  type?: SecretType

  @ApiPropertyOptional({ description: 'Replacement plaintext. When provided, the secret is re-encrypted under the current master key.' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  plaintext?: string
}
