import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { hash } from 'bcryptjs'
import type { Model } from 'mongoose'

import { Account } from '../../acore/database/schemas/account.schema'
import type { AccountStatus } from '../../acore/database/schemas/account.schema'
import { CreateAccountInput } from './create-account.input'
import { UpdateAccountInput } from './update-account.input'

export interface ListAccountsOptions {
  status?: AccountStatus
  limit?: number
  skip?: number
}

const BCRYPT_COST = 12

@Injectable()
export class ManageService {
  constructor(@InjectModel(Account.name) private readonly accountModel: Model<Account>) {}

  // Newest-first list with optional status filter; capped per call to keep payloads bounded.
  list({ status, limit = 50, skip = 0 }: ListAccountsOptions = {}): Promise<Account[]> {
    const filter: Record<string, unknown> = {}
    if (status) filter.status = status
    return this.accountModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean<Account[]>().exec()
  }

  findByUuid(uuid: string): Promise<Account | null> {
    return this.accountModel.findOne({ uuid }).lean<Account>().exec()
  }

  // Hashes the password with bcrypt and inserts a fresh account row. Surface unique-key collisions
  // (username/email) as a 409 so callers can distinguish them from generic validation failures.
  async create(input: CreateAccountInput): Promise<Account> {
    const passwordHash = await hash(input.password, BCRYPT_COST)
    try {
      const doc = await this.accountModel.create({
        username: input.username,
        passwordHash,
        display: input.display,
        email: input.email,
        phone: input.phone,
        avatar: input.avatar,
        status: input.status ?? 'ACTIVE',
      })
      return doc.toObject()
    } catch (err) {
      if (err instanceof Error && 'code' in err && (err as { code?: number }).code === 11000) {
        throw new ConflictException('Account with that username or email already exists')
      }
      throw err
    }
  }

  async update(uuid: string, input: UpdateAccountInput): Promise<Account> {
    const $set: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(input)) {
      if (v !== undefined) $set[k] = v
    }

    const updated = await this.accountModel.findOneAndUpdate({ uuid }, { $set }, { new: true }).lean<Account>().exec()
    if (!updated) throw new NotFoundException(`Account ${uuid} not found`)
    return updated
  }
}
