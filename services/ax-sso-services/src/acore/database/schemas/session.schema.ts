import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'
import { v7 as uuidv7 } from 'uuid'

import { ACCOUNT_STATUSES } from './account.schema'
import type { AccountStatus } from './account.schema'

export type SessionDocument = HydratedDocument<Session>

// Denormalized snapshot of account fields captured at signin time.
// Lets the API answer "who owns this token?" without joining accounts on every request.
@Schema({ _id: false })
export class SessionAccount {
  // The owning account's stable UUIDv7 — copied from the accounts collection at signin time.
  @Prop({ required: true, index: true })
    uuid!: string

  @Prop({ required: true, index: true })
    username!: string

  @Prop({ required: true })
    display!: string

  @Prop()
    avatar?: string

  @Prop()
    phone?: string

  @Prop({ required: true })
    email!: string

  @Prop({ type: String, required: true, enum: ACCOUNT_STATUSES })
    status!: AccountStatus
}

const SessionAccountSchema = SchemaFactory.createForClass(SessionAccount)

@Schema({ collection: 'sessions', timestamps: { createdAt: true, updatedAt: false } })
export class Session {
  // UUIDv7 — time-ordered, sortable, stable external identifier for this session.
  @Prop({ required: true, unique: true, index: true, default: () => uuidv7() })
    uuid!: string

  @Prop({ required: true, unique: true, index: true })
    token!: string

  @Prop({ type: SessionAccountSchema, required: true })
    account!: SessionAccount

  // TTL index — Mongo removes the document automatically once `expiresAt` is in the past.
  @Prop({ required: true, expires: 0 })
    expiresAt!: Date

  // Populated automatically by `timestamps: { createdAt: true }` on the @Schema decorator —
  // declared here so it shows on the TypeScript surface.
  @Prop()
    createdAt?: Date
}

export const SessionSchema = SchemaFactory.createForClass(Session)
