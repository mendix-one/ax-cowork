import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import type { Model } from 'mongoose'
import { v7 as uuidv7 } from 'uuid'

import { App } from '../../acore/database/schemas/app.schema'
import { Session } from '../../acore/database/schemas/session.schema'
import { SessionInfoResDto } from './dto/session-info.res-dto'
import { SessionResDto } from './dto/session.res-dto'

// Sessions initialized by /session/initialize last a year. Subsequent signin will
// populate the `account` snapshot on the same session document.
const SESSION_TTL_MS = 365 * 24 * 60 * 60 * 1000

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(App.name) private readonly appModel: Model<App>,
    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
    private readonly jwtService: JwtService,
  ) {}

  // Creates an anonymous session bound to the requested app. No account is attached yet —
  // signin later updates the same session document with an account snapshot.
  async initialize(appKey: string): Promise<SessionResDto> {
    const app = await this.appModel.findOne({ key: appKey }).lean().exec()
    if (!app) {
      throw new UnauthorizedException('Unknown app')
    }

    const expiresAt = new Date(Date.now() + SESSION_TTL_MS)
    const sessionUuid = uuidv7()
    const appSnapshot = {
      uuid: app.uuid,
      key: app.key,
      type: app.type,
      name: app.name,
      description: app.description,
      avatar: app.avatar,
    }

    await this.sessionModel.create({
      uuid: sessionUuid,
      app: appSnapshot,
      roles: [],
      expiresAt,
    })

    // JWT carries only the session uuid + app key — no account yet. JWT `exp` mirrors session expiry.
    const remainingSec = Math.max(1, Math.floor((expiresAt.getTime() - Date.now()) / 1000))
    const token = await this.jwtService.signAsync(
      {
        ses: sessionUuid,
        app: app.key,
      },
      { expiresIn: remainingSec },
    )

    return {
      uuid: sessionUuid,
      token,
      app: appSnapshot,
      expiresAt,
    }
  }

  // Materializes the current state of a session for the caller — uuid, app snapshot, and
  // (when signed in) account snapshot + status + roles. Used by GET /session as a "who am I /
  // what's my context" lookup so the UI can rehydrate after a page reload from the cookie alone.
  async getSession(sessionUuid: string): Promise<SessionInfoResDto> {
    const session = await this.sessionModel.findOne({ uuid: sessionUuid }).lean().exec()
    if (!session) {
      throw new UnauthorizedException('Session no longer exists')
    }

    const account = session.account
      ? {
          uuid: session.account.uuid,
          username: session.account.username,
          display: session.account.display,
          email: session.account.email,
          avatar: session.account.avatar,
          phone: session.account.phone,
        }
      : undefined

    return {
      uuid: session.uuid,
      app: {
        uuid: session.app.uuid,
        key: session.app.key,
        type: session.app.type,
        name: session.app.name,
        description: session.app.description,
        avatar: session.app.avatar,
      },
      account,
      status: session.account?.status,
      roles: session.roles ?? [],
      expiresAt: session.expiresAt,
    }
  }
}
