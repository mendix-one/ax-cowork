import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'

export type SessionDocument = HydratedDocument<Session>

@Schema({ collection: 'sessions', timestamps: { createdAt: true, updatedAt: false } })
export class Session {
  @Prop({ required: true, unique: true, index: true })
    token!: string

  @Prop({ required: true, index: true })
    username!: string

  // TTL index — Mongo removes the document automatically once `expiresAt` is in the past.
  @Prop({ required: true, expires: 0 })
    expiresAt!: Date
}

export const SessionSchema = SchemaFactory.createForClass(Session)
