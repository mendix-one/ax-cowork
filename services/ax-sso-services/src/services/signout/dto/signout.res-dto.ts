import { ApiProperty } from '@nestjs/swagger'

export class SignoutResDto {
  @ApiProperty({ description: 'In-band status code. 200 on success; 400 when the session no longer exists.', example: 200 })
    statusCode: number = 200

  @ApiProperty({ description: 'Human-readable confirmation that the session was invalidated.', example: 'Signed out successfully' })
    message!: string
}
