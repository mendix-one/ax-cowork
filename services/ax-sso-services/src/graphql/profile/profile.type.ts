import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql'

import { AccountType } from '../common/account.type'

// One row of the profile's "active sessions" list. Mirrors the bits we choose to expose:
// which app the session is tied to, when it was signed in, and when it expires.
@ObjectType('ProfileSessionApp')
export class ProfileSessionAppType {
  @Field(() => ID, { description: 'Stable UUIDv7 of the session.' })
  uuid!: string

  @Field({ nullable: true, description: 'App key (matches `App.key`) the session was created against.' })
  key?: string

  @Field({ nullable: true, description: 'Human-friendly app name copied from the session snapshot.' })
  name?: string

  @Field({ nullable: true, description: 'When the session expires. After this instant the JWT no longer verifies.' })
  avatar?: string

  @Field({ nullable: true, description: 'When the session was created — effectively the signin time.' })
  description?: string
}

@ObjectType('ProfileSession')
export class ProfileSessionType {
  @Field(() => ID, { description: 'Stable UUIDv7 of the session.' })
  uuid!: string

  @Field({ description: 'App key (matches `App.key`) the session was created against.' })
  app!: ProfileSessionAppType

  @Field(() => GraphQLISODateTime, { description: 'When the session expires. After this instant the JWT no longer verifies.' })
  expiresAt!: Date
}

@ObjectType('Profile')
export class ProfileType {
  @Field(() => AccountType, { description: 'The caller account record.' })
  account!: AccountType

  @Field(() => [ProfileSessionType], { description: 'Active (non-expired) sessions belonging to the caller, newest first.' })
  sessions!: ProfileSessionType[]
}
