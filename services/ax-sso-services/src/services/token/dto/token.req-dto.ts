import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class TokenReqDto {
  @ApiProperty({ description: 'Target app key (matches `App.key`). The minted JWT will grant access to this app.', example: 'SSO', maxLength: 256 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  scope!: string
}
