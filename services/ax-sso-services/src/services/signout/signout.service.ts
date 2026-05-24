import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { Model } from 'mongoose'

import { Session } from '../../acore/database/schemas/session.schema'
import { Token } from '../../acore/database/schemas/token.schema'
import { BusinessException } from '../../acore/exception'
import { SignoutResDto } from './dto/signout.res-dto'

// Business-error codes surfaced by signout. Stable contract for clients to branch on.
export const SIGNOUT_ERR_SESSION_NOT_FOUND = 1
export const SIGNOUT_ERR_NOT_SIGNED_IN = 2

@Injectable()
export class SignoutService {
  constructor(
    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
  ) {}

  // Detach the account from the session, leaving the (anonymous) session record intact so the
  // same uuid can be reused. Throws BusinessException when the session is missing (likely a
  // stale token) or already anonymous (signed out twice). Tokens minted from this session are
  // cascade-deleted on success so old bearers can't be replayed for the signed-in role set.
  async signout(sessionUuid: string): Promise<SignoutResDto> {
    const session = await this.sessionModel.findOne({ uuid: sessionUuid }, { account: 1 }).lean<{ account?: { uuid: string } } | null>().exec()
    if (!session) {
      throw new BusinessException(SIGNOUT_ERR_SESSION_NOT_FOUND, 'Session not found')
    }
    if (!session.account) {
      throw new BusinessException(SIGNOUT_ERR_NOT_SIGNED_IN, 'Session is not signed in')
    }

    // $unset removes the account subdocument; roles default back to an empty array so the
    // schema's `required: true` invariant on `roles` is preserved.
    await this.sessionModel.updateOne({ uuid: sessionUuid }, { $unset: { account: '' }, $set: { roles: [] } }).exec()
    await this.tokenModel.deleteMany({ session: sessionUuid }).exec()

    return { statusCode: 200, message: 'Signed out successfully' }
  }
}
