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

  @Field({ nullable: true, description: 'Public URL of the app avatar/icon.' })
  avatar?: string

  @Field({ nullable: true, description: 'Free-form description of the app.' })
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

// App snapshot used by the appRoles section — same shape as the session app, declared
// as a separate type so the role-listing surface can evolve independently of the session
// surface without breaking either side's clients.
@ObjectType('ProfileAppInfo')
export class ProfileAppInfoType {
  @Field(() => ID, { description: 'Stable UUIDv7 of the app.' })
  uuid!: string

  @Field({ description: 'App key (matches `App.key`).' })
  key!: string

  @Field({ description: 'Human-friendly app name.' })
  name!: string

  @Field({ nullable: true, description: 'Public URL of the app avatar/icon.' })
  avatar?: string

  @Field({ nullable: true, description: 'Free-form description of the app.' })
  description?: string
}

// One role granted to the caller within a specific app. `key` is the AppRole identifier
// (e.g. "admin"); `name` and `description` are the friendly fields from the AppRole record.
@ObjectType('ProfileRole')
export class ProfileRoleType {
  @Field({ description: 'AppRole key — stable identifier within the owning app.' })
  key!: string

  @Field({ description: 'Human-friendly role name.' })
  name!: string

  @Field({ nullable: true, description: 'Free-form description of what this role grants.' })
  description?: string
}

// One row of the "what apps + roles is this account assigned to?" list. Only apps the
// caller has at least one role in appear here; cross-app role keys with the same name
// are kept distinct because they're scoped under their owning `app`.
@ObjectType('ProfileAppRoles')
export class ProfileAppRolesType {
  @Field(() => ProfileAppInfoType, { description: 'App snapshot the roles below belong to.' })
  app!: ProfileAppInfoType

  @Field(() => [ProfileRoleType], { description: 'Roles granted to the caller within this app.' })
  roles!: ProfileRoleType[]
}

@ObjectType('Profile')
export class ProfileType {
  @Field(() => AccountType, { description: 'The caller account record.' })
  account!: AccountType

  @Field(() => [ProfileSessionType], { description: 'Active (non-expired) sessions belonging to the caller, newest first.' })
  sessions!: ProfileSessionType[]

  @Field(() => [ProfileAppRolesType], { description: 'Apps the caller has at least one role in, with the list of granted roles per app.' })
  appRoles!: ProfileAppRolesType[]
}
