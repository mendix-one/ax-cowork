import { InternalServerErrorException } from '@nestjs/common'
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql'

import { SecurityCheck } from '../../acore/security'
import { AccountType } from '../common/account.type'
import { GqlHeader } from '../common/gql-header.decorator'
import { ProfileService } from './profile.service'
import { ProfileType } from './profile.type'
import { UpdateProfileInput } from './update-profile.input'

@Resolver(() => ProfileType)
// `@SecurityCheck()` with no options: any valid, non-expired bearer is accepted regardless of status/roles.
// Identity-side enforcement happens at the service layer (each method scopes to `callerAccountUuid`).
@SecurityCheck()
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => ProfileType, { name: 'getProfile', description: "Returns the caller's account record + active sessions." })
  getProfile(@GqlHeader('account') callerAccountUuid: string | undefined): Promise<ProfileType> {
    return this.profileService.getProfile(this.requireAccount(callerAccountUuid))
  }

  @Mutation(() => AccountType, { description: "Updates the caller's own account record." })
  updateProfile(@GqlHeader('account') callerAccountUuid: string | undefined, @Args('input') input: UpdateProfileInput): Promise<AccountType> {
    return this.profileService.updateProfile(this.requireAccount(callerAccountUuid), input)
  }

  @Mutation(() => Boolean, { description: "Invalidates one of the caller's own active sessions. Returns true when a session was removed." })
  killSession(@GqlHeader('account') callerAccountUuid: string | undefined, @Args('uuid', { type: () => ID }) uuid: string): Promise<boolean> {
    return this.profileService.killSession(this.requireAccount(callerAccountUuid), uuid)
  }

  private requireAccount(callerAccountUuid: string | undefined): string {
    if (!callerAccountUuid) {
      // Defensive — the guard always writes `account` after a successful verify; arriving here without
      // it would mean the JWT was somehow missing the `sub` claim, which signin never does.
      throw new InternalServerErrorException('Verified token missing `sub` claim')
    }
    return callerAccountUuid
  }
}
