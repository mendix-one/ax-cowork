import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'
import { v7 as uuidv7 } from 'uuid'

export type AppDocument = HydratedDocument<App>

export const APP_TYPES = ['WEB_APP', 'WEB_SERVICES', 'INTERNAL_SERVICES'] as const
export type AppType = (typeof APP_TYPES)[number]

@Schema({ collection: 'apps', timestamps: true })
export class App {
  // UUIDv7 — time-ordered, sortable, stable external identifier.
  @Prop({ required: true, unique: true, index: true, default: () => uuidv7() })
    uuid!: string

  @Prop({ required: true, unique: true, index: true, trim: true })
    key!: string

  @Prop({ type: String, required: true, enum: APP_TYPES, default: 'INTERNAL_SERVICES', index: true })
    status!: AppType

  @Prop({ required: true, index: true, trim: true })
    name!: string

  @Prop()
    description?: string

  // Public URL of the app's avatar/icon.
  @Prop()
    avatar?: string

  // UUID of the avatar asset in the CDN service, if uploaded there.
  @Prop()
    cdnAvatarId?: string

  // UUID of the tenant/org this app belongs to in the CDN service.
  @Prop({ required: true, unique: true, index: true, trim: true, default: () => uuidv7() })
    cdnOwnerId!: string

  // Populated automatically by `timestamps: true` on the @Schema decorator —
  // declared here so they show on the TypeScript surface.
  @Prop()
    createdAt?: Date

  @Prop()
    updatedAt?: Date
}

export const AppSchema = SchemaFactory.createForClass(App)
