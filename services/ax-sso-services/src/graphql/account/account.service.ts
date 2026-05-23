import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { Model } from 'mongoose'

import { Account } from '../../acore/database/schemas/account.schema'
import type { AccountStatus } from '../../acore/database/schemas/account.schema'
import { UpdateAccountInfoInput } from './update-account-info.input'

export interface ListAccountsOptions {
  status?: AccountStatus
  limit?: number
  skip?: number
}

@Injectable()
export class AccountService {
  constructor(@InjectModel(Account.name) private readonly accountModel: Model<Account>) {}

  findByUuid(uuid: string): Promise<Account | null> {
    return this.accountModel.findOne({ uuid }).lean<Account>().exec()
  }

  // Newest-first list with optional status filter; capped per call to keep payloads bounded.
  list({ status, limit = 50, skip = 0 }: ListAccountsOptions = {}): Promise<Account[]> {
    const filter: Record<string, unknown> = {}
    if (status) filter.status = status
    return this.accountModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean<Account[]>().exec()
  }

  async update(uuid: string, input: UpdateAccountInfoInput): Promise<Account> {
    // Strip undefined keys so we don't unset existing values when callers omit a field.
    const $set: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(input)) {
      if (v !== undefined) $set[k] = v
    }

    const updated = await this.accountModel.findOneAndUpdate({ uuid }, { $set }, { new: true }).lean<Account>().exec()
    if (!updated) throw new NotFoundException(`Account ${uuid} not found`)
    return updated
  }
}
