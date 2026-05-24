import { ApiProperty } from '@nestjs/swagger'

import { ACCOUNT_STATUSES } from '../../../acore/database/schemas/account.schema'
import type { AccountStatus } from '../../../acore/database/schemas/account.schema'
import { APP_TYPES } from '../../../acore/database/schemas/app.schema'
import type { AppType } from '../../../acore/database/schemas/app.schema'

// Mirrors `SessionAccount` (embedded subdocument) — the snapshot copied onto the session at signin.
export class SigninResAccountDto {
  @ApiProperty({ description: 'Stable UUIDv7 of the account.' })
  uuid!: string

  @ApiProperty()
  username!: string

  @ApiProperty()
  display!: string

  @ApiProperty({ required: false })
  avatar?: string

  @ApiProperty({ required: false })
  phone?: string

  @ApiProperty()
  email!: string

  @ApiProperty({ enum: ACCOUNT_STATUSES })
  status!: AccountStatus
}

// Mirrors `SessionApp` (embedded subdocument).
export class SigninResAppDto {
  @ApiProperty({ description: 'Stable UUIDv7 of the app.' })
  uuid!: string

  @ApiProperty({ description: 'App key — the lookup field used by signin / session services.' })
  key!: string

  @ApiProperty({ enum: APP_TYPES })
  type!: AppType

  @ApiProperty()
  name!: string

  @ApiProperty({ required: false })
  description?: string

  @ApiProperty({ required: false })
  avatar?: string
}

export class SigninResDto {
  @ApiProperty({ description: 'Stable UUIDv7 of the session the account was attached to.' })
  uuid!: string

  @ApiProperty({ description: 'Freshly minted signed-in JWT. Replace the anonymous bearer with this one for all subsequent requests.' })
  token!: string

  @ApiProperty({ type: SigninResAccountDto, description: 'Snapshot of the account attached to the session.' })
  account!: SigninResAccountDto

  @ApiProperty({ type: SigninResAppDto, description: 'Snapshot of the target app (pinned at session initialize).' })
  app!: SigninResAppDto

  @ApiProperty({ type: [String], description: 'Role keys granted to the account within the target app.' })
  roles!: string[]
}
