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
  @ApiProperty({ description: 'Stable UUIDv7 of the newly-created session.' })
    uuid!: string

  @ApiProperty({ description: 'Signed JWT. Send back as `Authorization: Bearer <token>` on subsequent requests.' })
    token!: string

  @ApiProperty({ type: SigninResAccountDto })
    account!: SigninResAccountDto

  @ApiProperty({ type: SigninResAppDto })
    app!: SigninResAppDto

  @ApiProperty({ type: [String], description: 'Role keys carried by this session (within the target app).' })
    roles!: string[]
}
