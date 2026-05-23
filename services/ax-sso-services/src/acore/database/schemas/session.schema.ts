import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'

import { USER_STATUSES } from './user.schema'
import type { UserStatus } from './user.schema'

export type SessionDocument = HydratedDocument<Session>

// Denormalized snapshot of user fields captured at signin time.
// Lets the API answer "who owns this token?" without joining users on every request.
@Schema({ _id: false })
export class SessionUser {
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

  @Prop({ type: String, required: true, enum: USER_STATUSES })
    status!: UserStatus
}

const SessionUserSchema = SchemaFactory.createForClass(SessionUser)

@Schema({ collection: 'sessions', timestamps: { createdAt: true, updatedAt: false } })
export class Session {
  @Prop({ required: true, unique: true, index: true })
    token!: string

  @Prop({ type: SessionUserSchema, required: true })
    user!: SessionUser

  // TTL index — Mongo removes the document automatically once `expiresAt` is in the past.
  @Prop({ required: true, expires: 0 })
    expiresAt!: Date
}

export const SessionSchema = SchemaFactory.createForClass(Session)
