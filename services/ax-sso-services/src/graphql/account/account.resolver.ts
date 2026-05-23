import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql'

import { AccountService } from './account.service'
import { AccountStatusEnum, AccountType } from './account.type'
import type { AccountStatus } from '../../acore/database/schemas/account.schema'
import { UpdateAccountInfoInput } from './update-account-info.input'

@Resolver(() => AccountType)
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Query(() => AccountType, { nullable: true, description: 'Returns the account record by uuid, or null if missing.' })
  accountInfo(@Args('uuid', { type: () => ID }) uuid: string): Promise<AccountType | null> {
    return this.accountService.findByUuid(uuid)
  }

  @Query(() => [AccountType], { description: 'Returns accounts (newest first). Optionally filter by status; paginate with limit/skip.' })
  accounts(
    @Args('status', { type: () => AccountStatusEnum, nullable: true }) status?: AccountStatus,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 50 }) limit?: number,
    @Args('skip', { type: () => Int, nullable: true, defaultValue: 0 }) skip?: number,
  ): Promise<AccountType[]> {
    return this.accountService.list({ status, limit, skip })
  }

  @Mutation(() => AccountType, { description: 'Updates an account. Throws when the uuid does not exist.' })
  updateAccountInfo(@Args('uuid', { type: () => ID }) uuid: string, @Args('input') input: UpdateAccountInfoInput): Promise<AccountType> {
    return this.accountService.update(uuid, input)
  }
}
