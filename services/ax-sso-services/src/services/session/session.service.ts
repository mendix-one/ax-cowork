import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import type { Model } from 'mongoose'
import { v7 as uuidv7 } from 'uuid'

import { App } from '../../acore/database/schemas/app.schema'
import { Session } from '../../acore/database/schemas/session.schema'
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
}
