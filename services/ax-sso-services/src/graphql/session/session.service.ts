import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { Model } from 'mongoose'

import { Session } from '../../acore/database/schemas/session.schema'

@Injectable()
export class SessionService {
  constructor(@InjectModel(Session.name) private readonly sessionModel: Model<Session>) {}

  findByToken(token: string): Promise<Session | null> {
    return this.sessionModel.findOne({ token }).lean<Session>().exec()
  }

  async removeByToken(token: string): Promise<boolean> {
    const result = await this.sessionModel.deleteOne({ token }).exec()
    return result.deletedCount > 0
  }
}
