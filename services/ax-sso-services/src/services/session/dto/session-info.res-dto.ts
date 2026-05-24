import { ApiProperty } from '@nestjs/swagger'

import { ACCOUNT_STATUSES } from '../../../acore/database/schemas/account.schema'
import type { AccountStatus } from '../../../acore/database/schemas/account.schema'
import { APP_TYPES } from '../../../acore/database/schemas/app.schema'
import type { AppType } from '../../../acore/database/schemas/app.schema'

// Mirrors `SessionApp` (embedded subdocument) — the snapshot pinned at session initialize.
export class SessionInfoAppDto {
  @ApiProperty({ description: 'Stable UUIDv7 of the app.' })
    uuid!: string

  @ApiProperty({ description: 'App key (matches `App.key`).' })
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

// Mirrors `SessionAccount` (embedded subdocument). Absent when the session is anonymous.
export class SessionInfoAccountDto {
  @ApiProperty({ description: 'Stable UUIDv7 of the account.' })
    uuid!: string

  @ApiProperty()
    username!: string

  @ApiProperty()
    display!: string

  @ApiProperty()
    email!: string

  @ApiProperty({ required: false })
    avatar?: string

  @ApiProperty({ required: false })
    phone?: string
}

export class SessionInfoResDto {
  @ApiProperty({ description: 'Stable UUIDv7 of the session.' })
    uuid!: string

  @ApiProperty({ type: SessionInfoAppDto, description: 'Snapshot of the target app captured at session creation.' })
    app!: SessionInfoAppDto

  @ApiProperty({ type: SessionInfoAccountDto, required: false, description: 'Snapshot of the account attached to the session. Absent on anonymous sessions.' })
    account?: SessionInfoAccountDto

  @ApiProperty({ enum: ACCOUNT_STATUSES, required: false, description: 'Account status (mirrors `account.status`). Absent on anonymous sessions.' })
    status?: AccountStatus

  @ApiProperty({ type: [String], description: 'Role keys granted to the account within the target app. Empty on anonymous sessions.' })
    roles!: string[]

  @ApiProperty({ description: 'When this session expires.' })
    expiresAt!: Date
}
