import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'
import { v7 as uuidv7 } from 'uuid'

export type TokenDocument = HydratedDocument<Token>

@Schema({ collection: 'tokens', timestamps: true })
export class Token {
  // UUIDv7 — time-ordered, sortable, stable external identifier for this token.
  @Prop({ required: true, unique: true, index: true, default: () => uuidv7() })
    uuid!: string

  // The opaque token string — what callers present in `Authorization: Bearer …`.
  @Prop({ required: true, unique: true, index: true })
    token!: string

  // TTL index — Mongo removes the document automatically once `expiresAt` is in the past.
  @Prop({ required: true, expires: 0 })
    expiresAt!: Date

  // Owning account's `uuid`.
  @Prop({ required: true, index: true })
    account!: string

  // Owning session's `uuid`.
  @Prop({ required: true, index: true })
    session!: string

  // Target app's `key` — which app this token grants access to.
  @Prop({ required: true, index: true })
    app!: string

  // Role keys (within `app`) carried by this token.
  @Prop({ type: [String], required: true, default: [] })
    roles!: string[]

  // Populated automatically by `timestamps: true` on the @Schema decorator —
  // declared here so they show on the TypeScript surface.
  @Prop()
    createdAt?: Date

  @Prop()
    updatedAt?: Date
}

export const TokenSchema = SchemaFactory.createForClass(Token)
