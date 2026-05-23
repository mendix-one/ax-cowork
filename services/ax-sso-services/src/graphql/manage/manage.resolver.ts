import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql'

import { SecurityCheck } from '../../acore/security'
import { AccountStatusEnum, AccountType } from '../common/account.type'
import type { AccountStatus } from '../../acore/database/schemas/account.schema'
import { CreateAccountInput } from './create-account.input'
import { ManageService } from './manage.service'
import { UpdateAccountInput } from './update-account.input'

@Resolver(() => AccountType)
// ADMIN-only. The bearer JWT's `roles` claim must contain `ADMIN` — enforced by SecurityCheckGuard.
@SecurityCheck({ roles: ['ADMIN'] })
export class ManageResolver {
  constructor(private readonly manageService: ManageService) {}

  @Query(() => [AccountType], { name: 'getList', description: 'Lists accounts (newest first). Optionally filter by status; paginate with limit/skip.' })
  getList(
    @Args('status', { type: () => AccountStatusEnum, nullable: true }) status?: AccountStatus,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 50 }) limit?: number,
    @Args('skip', { type: () => Int, nullable: true, defaultValue: 0 }) skip?: number,
  ): Promise<AccountType[]> {
    return this.manageService.list({ status, limit, skip })
  }

  @Query(() => AccountType, { name: 'getDetail', nullable: true, description: 'Returns the account record by uuid, or null if missing.' })
  getDetail(@Args('uuid', { type: () => ID }) uuid: string): Promise<AccountType | null> {
    return this.manageService.findByUuid(uuid)
  }

  @Mutation(() => AccountType, { description: 'Creates a new account. Bcrypt-hashes the password server-side.' })
  createAccount(@Args('input') input: CreateAccountInput): Promise<AccountType> {
    return this.manageService.create(input)
  }

  @Mutation(() => AccountType, { description: 'Updates an existing account. Throws when the uuid does not exist.' })
  updateAccount(@Args('uuid', { type: () => ID }) uuid: string, @Args('input') input: UpdateAccountInput): Promise<AccountType> {
    return this.manageService.update(uuid, input)
  }
}
