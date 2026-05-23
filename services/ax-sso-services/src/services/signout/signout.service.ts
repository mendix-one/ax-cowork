import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { Model } from 'mongoose'

import { Session } from '../../acore/database/schemas/session.schema'

@Injectable()
export class SignoutService {
  constructor(@InjectModel(Session.name) private readonly sessionModel: Model<Session>) {}

  async signout(token: string): Promise<void> {
    await this.sessionModel.deleteOne({ token }).exec()
  }
}
