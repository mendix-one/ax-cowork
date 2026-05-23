import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql'

import { UserStatusEnum } from '../user/user.type'
import type { UserStatus } from '../../acore/database/schemas/user.schema'

// Embedded user snapshot mirrors `SessionUser` on the Mongoose schema.
@ObjectType('SessionUser')
export class SessionUserType {
  @Field(() => ID)
    uuid!: string

  @Field()
    username!: string

  @Field()
    display!: string

  @Field({ nullable: true })
    avatar?: string

  @Field({ nullable: true })
    phone?: string

  @Field()
    email!: string

  @Field(() => UserStatusEnum)
    status!: UserStatus
}

@ObjectType('Session')
export class SessionType {
  @Field(() => ID)
    uuid!: string

  @Field()
    token!: string

  @Field(() => SessionUserType)
    user!: SessionUserType

  @Field(() => GraphQLISODateTime)
    expiresAt!: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
    createdAt?: Date
}
