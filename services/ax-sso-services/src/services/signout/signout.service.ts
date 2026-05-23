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

  // Detach the account from the session, leaving the (anonymous) session record intact so the
  // same uuid can be reused. Calling on a session with no account attached returns a 400 — the
  // client likely sent a stale token or signed out twice. Tokens minted from this session are
  // cascade-deleted so old bearers can't be replayed for the signed-in role set.
  async signout(sessionUuid: string): Promise<SignoutResDto> {
    const session = await this.sessionModel.findOne({ uuid: sessionUuid }, { account: 1 }).lean<{ account?: { uuid: string } } | null>().exec()
    if (!session) {
      return { statusCode: 400, message: 'Session not found' }
    }
    if (!session.account) {
      return { statusCode: 400, message: 'Session is not signed in' }
    }

    // $unset removes the account subdocument; roles default back to an empty array so the
    // schema's `required: true` invariant on `roles` is preserved.
    await this.sessionModel.updateOne({ uuid: sessionUuid }, { $unset: { account: '' }, $set: { roles: [] } }).exec()
    await this.tokenModel.deleteMany({ session: sessionUuid }).exec()

    return { statusCode: 200, message: 'Signed out successfully' }
  }
}
