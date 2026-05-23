import { ApiProperty } from '@nestjs/swagger'

export class SignoutResDto {
  statusCode: number = 200

  @ApiProperty({ description: 'Human-readable confirmation that the session was invalidated.', example: 'Signed out successfully' })
  message!: string
}
