import { ApiProperty } from '@nestjs/swagger'

export class SigninResDto {
  @ApiProperty({ description: 'Opaque session token. Send back as `Authorization: Bearer <token>` on subsequent requests.', example: 'a1b2c3...' })
  token!: string

  @ApiProperty({ description: 'UTC instant at which the session expires.', example: '2026-05-24T08:00:00.000Z', type: String, format: 'date-time' })
  expiresAt!: Date
}
