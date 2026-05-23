import { ApiProperty } from '@nestjs/swagger'

export class SignoutResDto {
  @ApiProperty({ description: 'In-band status code. 200 on success; 400 when the session no longer exists or is already anonymous.', example: 200 })
    statusCode: number = 200

  @ApiProperty({ description: 'Human-readable result. On success: the account was detached from the session and its tokens were cleared.', example: 'Signed out successfully' })
    message!: string
}
