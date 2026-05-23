import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { Model } from 'mongoose'

import { Session } from '../../acore/database/schemas/session.schema'
import { Token } from '../../acore/database/schemas/token.schema'

@Injectable()
export class SignoutService {
  constructor(
    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
  ) {}

  // Removes the session and any tokens minted from it. Idempotent — calling with a uuid that
  // no longer exists deletes nothing and resolves silently (the controller still returns 204).
  async signout(sessionUuid: string): Promise<void> {
    await this.sessionModel.deleteOne({ uuid: sessionUuid }).exec()
    await this.tokenModel.deleteMany({ session: sessionUuid }).exec()
  }
}
