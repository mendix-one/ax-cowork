import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'
import { v7 as uuidv7 } from 'uuid'

export type TokenDocument = HydratedDocument<Token>

@Schema({ collection: 'tokens', timestamps: true })
export class Token {
  // UUIDv7 — time-ordered, sortable, stable external identifier for this token.
  @Prop({ required: true, unique: true, index: true, default: () => uuidv7() })
    uuid!: string

  // TTL index — Mongo removes the document automatically once `expiresAt` is in the past.
  @Prop({ required: true, expires: 0 })
    expiresAt!: Date

  // Target app's `key` — which app this token grants access to.
  @Prop({ required: true, index: true })
    app!: string

  // Owning session's `uuid`.
  @Prop({ required: true, index: true })
    session!: string

  // Owning account's `uuid`. Optional — anonymous tokens (issued for sessions that
  // haven't signed in yet) have no account attached.
  @Prop({ required: false, index: true })
    account?: string

  // Role keys (within `app`) carried by this token. Empty for anonymous tokens.
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
