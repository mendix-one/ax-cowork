import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator'

import type { SecretType } from '../secret.schema'

const SECRET_TYPES: SecretType[] = ['db', 'api', 'file']

export class CreateSecretDto {
  @ApiProperty({ description: 'Unique name identifying the secret.', example: 'oracle-prod-readonly', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string

  @ApiProperty({ description: 'Kind of credential this secret holds.', enum: SECRET_TYPES, example: 'db' })
  @IsIn(SECRET_TYPES)
  type!: SecretType

  @ApiProperty({ description: 'Plaintext value to encrypt at rest. Never logged, never returned by any read endpoint.', example: '***' })
  @IsString()
  @IsNotEmpty()
  plaintext!: string
}
