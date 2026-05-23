import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema({ collection: 'users', timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true })
    username!: string

  @Prop({ required: true })
    passwordHash!: string
}

export const UserSchema = SchemaFactory.createForClass(User)
