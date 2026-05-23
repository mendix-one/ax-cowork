import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql'

import { AccountStatusEnum } from '../account/account.type'
import type { AccountStatus } from '../../acore/database/schemas/account.schema'

// Embedded account snapshot mirrors `SessionAccount` on the Mongoose schema.
@ObjectType('SessionAccount')
export class SessionAccountType {
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

  @Field(() => AccountStatusEnum)
    status!: AccountStatus
}

@ObjectType('Session')
export class SessionType {
  @Field(() => ID)
    uuid!: string

  @Field()
    token!: string

  @Field(() => SessionAccountType)
    account!: SessionAccountType

  @Field(() => GraphQLISODateTime)
    expiresAt!: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
    createdAt?: Date
}
