import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'
import { v7 as uuidv7 } from 'uuid'

export type UserDocument = HydratedDocument<User>

export const USER_STATUSES = ['ACTIVE', 'LOCKED', 'CLOSED'] as const
export type UserStatus = (typeof USER_STATUSES)[number]

@Schema({ collection: 'users', timestamps: true })
export class User {
  // UUIDv7 — time-ordered, sortable, stable external identifier.
  @Prop({ required: true, unique: true, index: true, default: () => uuidv7() })
    uuid!: string

  @Prop({ required: true, unique: true, index: true })
    username!: string

  // Bcrypt hash of the user's password. Never stored or returned in plaintext.
  @Prop({ required: true })
    passwordHash!: string

  @Prop({ type: String, required: true, enum: USER_STATUSES, default: 'ACTIVE', index: true })
    status!: UserStatus

  @Prop({ required: true })
    display!: string

  @Prop({ required: true, unique: true, index: true, lowercase: true, trim: true })
    email!: string

  @Prop()
    phone?: string

  // Public URL of the user's avatar.
  @Prop()
    avatar?: string

  // UUID of the avatar asset in the CDN service, if uploaded there.
  @Prop()
    cdnAvatarId?: string

  // UUID of the tenant/org this user belongs to in the CDN service.
  @Prop({ required: true, default: () => uuidv7() })
    cdnOwnerId!: string

  // Populated automatically by `timestamps: true` on the @Schema decorator —
  // declared here so they show on the TypeScript surface.
  @Prop()
    createdAt?: Date

  @Prop()
    updatedAt?: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
