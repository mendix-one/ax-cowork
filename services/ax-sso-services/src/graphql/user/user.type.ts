import { Field, GraphQLISODateTime, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { USER_STATUSES } from '../../acore/database/schemas/user.schema'
import type { UserStatus } from '../../acore/database/schemas/user.schema'

// Build a real enum object so @nestjs/graphql can register it — `UserStatus` itself is a TS type alias.
export const UserStatusEnum = Object.fromEntries(USER_STATUSES.map((s) => [s, s])) as Record<UserStatus, UserStatus>
registerEnumType(UserStatusEnum, { name: 'UserStatus' })

@ObjectType('User')
export class UserType {
  @Field(() => ID)
    uuid!: string

  @Field()
    username!: string

  @Field()
    display!: string

  @Field()
    email!: string

  @Field({ nullable: true })
    phone?: string

  @Field({ nullable: true })
    avatar?: string

  @Field({ nullable: true })
    cdnAvatarId?: string

  @Field()
    cdnOwnerId!: string

  @Field(() => UserStatusEnum)
    status!: UserStatus

  @Field(() => GraphQLISODateTime, { nullable: true })
    createdAt?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
    updatedAt?: Date
}
