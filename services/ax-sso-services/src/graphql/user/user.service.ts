import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { Model } from 'mongoose'

import { User } from '../../acore/database/schemas/user.schema'
import type { UserStatus } from '../../acore/database/schemas/user.schema'
import { UpdateUserInfoInput } from './update-user-info.input'

export interface ListUsersOptions {
  status?: UserStatus
  limit?: number
  skip?: number
}

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  findByUuid(uuid: string): Promise<User | null> {
    return this.userModel.findOne({ uuid }).lean<User>().exec()
  }

  // Newest-first list with optional status filter; capped per call to keep payloads bounded.
  list({ status, limit = 50, skip = 0 }: ListUsersOptions = {}): Promise<User[]> {
    const filter: Record<string, unknown> = {}
    if (status) filter.status = status
    return this.userModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean<User[]>().exec()
  }

  async update(uuid: string, input: UpdateUserInfoInput): Promise<User> {
    // Strip undefined keys so we don't unset existing values when callers omit a field.
    const $set: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(input)) {
      if (v !== undefined) $set[k] = v
    }

    const updated = await this.userModel.findOneAndUpdate({ uuid }, { $set }, { new: true }).lean<User>().exec()
    if (!updated) throw new NotFoundException(`User ${uuid} not found`)
    return updated
  }
}
