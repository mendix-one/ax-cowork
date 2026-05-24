import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'
import { v7 as uuidv7 } from 'uuid'

import { ACCOUNT_STATUSES } from './account.schema'
import type { AccountStatus } from './account.schema'
import { APP_TYPES } from './app.schema'
import type { AppType } from './app.schema'

export type SessionDocument = HydratedDocument<Session>

// Denormalized snapshot of account fields. Written by signin when an account attaches to
// the session; absent on freshly initialized (anonymous) sessions. Lets downstream services
// answer "who owns this session?" without joining the accounts collection.
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

// Denormalized snapshot of app fields. Captured when the session is initialized and
// pinned for the session's entire lifetime — signin and signout don't touch it.
@Schema({ _id: false })
export class SessionApp {
  // The target app's stable UUIDv7 — copied from the apps collection at initialize time.
  @Prop({ required: true, index: true })
    uuid!: string

  // The target app's key — the lookup field used by signin / session services.
  @Prop({ required: true, index: true })
    key!: string

  @Prop({ type: String, required: true, enum: APP_TYPES })
    type!: AppType

  @Prop({ required: true })
    name!: string

  @Prop()
    description?: string

  @Prop()
    avatar?: string
}

const SessionAppSchema = SchemaFactory.createForClass(SessionApp)

@Schema({ collection: 'sessions', timestamps: { createdAt: true, updatedAt: false } })
export class Session {
  // UUIDv7 — time-ordered, sortable, stable external identifier for this session.
  @Prop({ required: true, unique: true, index: true, default: () => uuidv7() })
    uuid!: string

  // TTL index — Mongo removes the document automatically once `expiresAt` is in the past.
  @Prop({ required: true, expires: 0 })
    expiresAt!: Date

  // Target app snapshot. Pinned at initialize and never overwritten thereafter.
  @Prop({ type: SessionAppSchema, required: true })
    app!: SessionApp

  // Account snapshot. Set by signin, cleared by signout. Absent on anonymous sessions.
  @Prop({ type: SessionAccountSchema, required: false })
    account?: SessionAccount

  // Role keys (within `app`) granted to the signed-in account. Empty when the session is anonymous.
  @Prop({ type: [String], required: true, default: [] })
    roles!: string[]

  // Populated automatically by `timestamps: { createdAt: true }` on the @Schema decorator —
  // declared here so it shows on the TypeScript surface. `updatedAt` is disabled at the schema
  // level so the field is never written.
  @Prop()
    createdAt?: Date
}

export const SessionSchema = SchemaFactory.createForClass(Session)
