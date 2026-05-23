import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { Model } from 'mongoose'

import { Session } from '../../acore/database/schemas/session.schema'
import { Token } from '../../acore/database/schemas/token.schema'
import { SignoutResDto } from './dto/signout.res-dto'

@Injectable()
export class SignoutService {
  constructor(
    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
  ) {}

  // Verifies the session exists before deleting. Calling with a uuid that has no matching
  // session (e.g. already signed out elsewhere, or TTL-expired) raises NotFoundException
  // so the client sees a concrete error rather than a silent success.
  async signout(sessionUuid: string): Promise<SignoutResDto> {
    const existing = await this.sessionModel.findOne({ uuid: sessionUuid }, { uuid: 1 }).lean<{ uuid: string } | null>().exec()
    if (!existing) {
      return { statusCode: 400, message: 'Session not found' }
    }

    await this.sessionModel.deleteOne({ uuid: sessionUuid }).exec()
    await this.tokenModel.deleteMany({ session: sessionUuid }).exec()

    return { statusCode: 200, message: 'Signed out successfully' }
  }
}
