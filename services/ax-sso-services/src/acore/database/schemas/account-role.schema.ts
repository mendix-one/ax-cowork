import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'
import { v7 as uuidv7 } from 'uuid'

export type AccountRoleDocument = HydratedDocument<AccountRole>

@Schema({ collection: 'account_roles', timestamps: true })
export class AccountRole {
  // UUIDv7 — time-ordered, sortable, stable external identifier.
  @Prop({ required: true, unique: true, index: true, default: () => uuidv7() })
    uuid!: string

  // The owning App's `key`.
  @Prop({ required: true, index: true })
    app!: string

  // The AppRole's `key` (the role identifier within the app).
  @Prop({ required: true, index: true })
    role!: string

  // Populated automatically by `timestamps: true` on the @Schema decorator —
  // declared here so they show on the TypeScript surface.
  @Prop()
    createdAt?: Date

  @Prop()
    updatedAt?: Date
}

export const AccountRoleSchema = SchemaFactory.createForClass(AccountRole)
