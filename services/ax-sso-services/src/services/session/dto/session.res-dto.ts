import { ApiProperty } from '@nestjs/swagger'

import { APP_TYPES } from '../../../acore/database/schemas/app.schema'
import type { AppType } from '../../../acore/database/schemas/app.schema'

// Mirrors `SessionApp` (embedded subdocument) — the snapshot copied onto the session at init.
export class SessionResAppDto {
  @ApiProperty({ description: 'Stable UUIDv7 of the app.' })
  uuid!: string

  @ApiProperty()
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

export class SessionResDto {
  @ApiProperty({ description: 'Stable UUIDv7 of the newly-created session.' })
  uuid!: string

  @ApiProperty({ description: 'Signed JWT identifying this session. Send back as `Authorization: Bearer <token>` on subsequent requests.' })
  token!: string

  @ApiProperty({ type: SessionResAppDto, description: 'Snapshot of the target app captured at session creation.' })
  app!: SessionResAppDto

  @ApiProperty({ description: 'When this session expires (one year from creation).' })
  expiresAt!: Date
}
