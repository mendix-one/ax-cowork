import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class SigninReqDto {
  @ApiProperty({ description: 'Account username.', example: 'admin', maxLength: 256 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  username!: string

  @ApiProperty({ description: 'Plaintext password. Sent over TLS, never logged.', example: '***', maxLength: 256 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  password!: string
}
