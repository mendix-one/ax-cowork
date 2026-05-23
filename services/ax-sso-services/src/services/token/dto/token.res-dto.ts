import { ApiProperty } from '@nestjs/swagger'

export class TokenResDto {
  @ApiProperty({ description: 'Stable UUIDv7 of the token row.' })
  uuid!: string

  @ApiProperty({ description: 'Signed JWT. Send back as `Authorization: Bearer <token>` on subsequent requests to the target app.' })
  token!: string

  @ApiProperty({ description: 'Owning account uuid (copied from the verified session JWT claim `sub`).' })
  account!: string

  @ApiProperty({ description: 'Owning session uuid (copied from the verified session JWT claim `ses`).' })
  session!: string

  @ApiProperty({ description: 'Target app key the JWT was minted for.' })
  app!: string

  @ApiProperty({ type: [String], description: 'Role keys carried by this token (within the target app), resolved from `account_roles` at issue time.' })
  roles!: string[]

  @ApiProperty({ description: 'When this token expires. After this instant the JWT no longer verifies and the row is TTL-removed.' })
  expiresAt!: Date
}
