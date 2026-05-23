import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'
import { v7 as uuidv7 } from 'uuid'

export type AppRoleDocument = HydratedDocument<AppRole>

@Schema({ collection: 'app_roles', timestamps: true })
export class AppRole {
  // UUIDv7 — time-ordered, sortable, stable external identifier for this role.
  @Prop({ required: true, unique: true, index: true, default: () => uuidv7() })
  uuid!: string

  // The owning App's `key`. Indexed so "all roles for app X" is a fast query.
  @Prop({ required: true, index: true })
  app!: string

  // Stable machine identifier within the owning app (e.g. "admin", "viewer").
  // Unique-per-app — enforced by the compound index below.
  @Prop({ required: true, unique: true, index: true, trim: true })
  key!: string

  @Prop({ required: true, index: true, trim: true })
  name!: string

  @Prop()
  description?: string

  // Populated automatically by `timestamps: true` on the @Schema decorator —
  // declared here so they show on the TypeScript surface.
  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export const AppRoleSchema = SchemaFactory.createForClass(AppRole)

// (appUid, key) is unique — no two roles in the same app can share the same key.
AppRoleSchema.index({ appUid: 1, key: 1 }, { unique: true })
