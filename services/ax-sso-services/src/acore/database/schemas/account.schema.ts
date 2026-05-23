import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'
import { v7 as uuidv7 } from 'uuid'

export type AccountDocument = HydratedDocument<Account>

export const ACCOUNT_STATUSES = ['ACTIVE', 'LOCKED', 'CLOSED'] as const
export type AccountStatus = (typeof ACCOUNT_STATUSES)[number]

@Schema({ collection: 'accounts', timestamps: true })
export class Account {
  // UUIDv7 — time-ordered, sortable, stable external identifier.
  @Prop({ required: true, unique: true, index: true, default: () => uuidv7() })
  uuid!: string

  @Prop({ required: true, unique: true, index: true })
  username!: string

  // Bcrypt hash of the account's password. Never stored or returned in plaintext.
  @Prop({ required: true })
  passwordHash!: string

  @Prop({ type: String, required: true, enum: ACCOUNT_STATUSES, default: 'ACTIVE', index: true })
  status!: AccountStatus

  @Prop({ required: true })
  display!: string

  @Prop({ required: true, unique: true, index: true, lowercase: true, trim: true })
  email!: string

  @Prop()
  phone?: string

  // Public URL of the account's avatar.
  @Prop()
  avatar?: string

  // UUID of the avatar asset in the CDN service, if uploaded there.
  @Prop()
  cdnAvatarId?: string

  // UUID of the tenant/org this account belongs to in the CDN service.
  @Prop({ required: true, unique: true, index: true, trim: true, default: () => uuidv7() })
  cdnOwnerId!: string

  // Populated automatically by `timestamps: true` on the @Schema decorator —
  // declared here so they show on the TypeScript surface.
  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export const AccountSchema = SchemaFactory.createForClass(Account)
