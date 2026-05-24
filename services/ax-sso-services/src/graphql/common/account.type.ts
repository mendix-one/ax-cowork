import { Field, GraphQLISODateTime, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { ACCOUNT_STATUSES } from '../../acore/database/schemas/account.schema'
import type { AccountStatus } from '../../acore/database/schemas/account.schema'

// Build a real enum object so @nestjs/graphql can register it — `AccountStatus` itself is a TS type alias.
export const AccountStatusEnum = Object.fromEntries(ACCOUNT_STATUSES.map((s) => [s, s])) as Record<AccountStatus, AccountStatus>
registerEnumType(AccountStatusEnum, { name: 'AccountStatus' })

// Shared GraphQL projection of the `Account` Mongoose schema. Used by both the `profile` resolver
// (caller views their own record) and the `manage` resolver (admin list/detail).
@ObjectType('Account')
export class AccountType {
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

  @Field(() => AccountStatusEnum)
    status!: AccountStatus

  @Field(() => GraphQLISODateTime, { nullable: true })
    createdAt?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
    updatedAt?: Date
}
