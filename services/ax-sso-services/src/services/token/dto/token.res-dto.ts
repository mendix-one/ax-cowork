import { ApiProperty } from '@nestjs/swagger'

export class TokenResDto {
  @ApiProperty({ description: 'Stable UUIDv7 of the token row.' })
  uuid!: string

  @ApiProperty({ description: 'Signed JWT. Send back as `Authorization: Bearer <token>` on subsequent requests to the target app.' })
  token!: string

  @ApiProperty({
    required: false,
    description: "Owning account uuid (read from the session's account snapshot). Absent for tokens issued from anonymous sessions.",
  })
  account?: string

  @ApiProperty({ description: "Owning session uuid (read from the verified bearer's `ses` claim)." })
  session!: string

  @ApiProperty({ description: 'Target app key the JWT was minted for.' })
  app!: string

  @ApiProperty({
    type: [String],
    description: 'Role keys carried by this token (within the target app), resolved from `account_roles` at issue time. Empty for anonymous tokens.',
  })
  roles!: string[]

  @ApiProperty({ description: 'When this token expires. After this instant the JWT no longer verifies and the row is TTL-removed.' })
  expiresAt!: Date
}
