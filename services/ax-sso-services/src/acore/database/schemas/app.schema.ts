import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'
import { v7 as uuidv7 } from 'uuid'

export type AppDocument = HydratedDocument<App>

@Schema({ collection: 'apps', timestamps: true })
export class App {
  // UUIDv7 — time-ordered, sortable, stable external identifier.
  @Prop({ required: true, unique: true, index: true, default: () => uuidv7() })
    uuid!: string

  @Prop({ required: true, unique: true, index: true, trim: true })
    key!: string

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
  @Prop({ required: true, index: true })
    cdnOwnerId!: string

  // Populated automatically by `timestamps: true` on the @Schema decorator —
  // declared here so they show on the TypeScript surface.
  @Prop()
    createdAt?: Date

  @Prop()
    updatedAt?: Date
}

export const AppSchema = SchemaFactory.createForClass(App)
