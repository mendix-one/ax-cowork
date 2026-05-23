import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql'

import { UpdateUserInfoInput } from './update-user-info.input'
import { UserService } from './user.service'
import { UserStatusEnum, UserType } from './user.type'
import type { UserStatus } from '../../acore/database/schemas/user.schema'

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserType, { nullable: true, description: 'Returns the user record by uuid, or null if missing.' })
  userInfo(@Args('uuid', { type: () => ID }) uuid: string): Promise<UserType | null> {
    return this.userService.findByUuid(uuid)
  }

  @Query(() => [UserType], { description: 'Returns users (newest first). Optionally filter by status; paginate with limit/skip.' })
  users(
    @Args('status', { type: () => UserStatusEnum, nullable: true }) status?: UserStatus,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 50 }) limit?: number,
    @Args('skip', { type: () => Int, nullable: true, defaultValue: 0 }) skip?: number,
  ): Promise<UserType[]> {
    return this.userService.list({ status, limit, skip })
  }

  @Mutation(() => UserType, { description: 'Updates a user. Throws when the uuid does not exist.' })
  updateUserInfo(@Args('uuid', { type: () => ID }) uuid: string, @Args('input') input: UpdateUserInfoInput): Promise<UserType> {
    return this.userService.update(uuid, input)
  }
}
