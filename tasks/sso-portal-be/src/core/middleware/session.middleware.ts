import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { SessionManager } from '../manager/session.manager'

@Injectable()
export class SessionMiddleware implements NestMiddleware<Request, Response> {
  private readonly logger = new Logger(SessionMiddleware.name)

  constructor(private sessionManager: SessionManager) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-expect-error - express session
      const sid = req.session.key
      if (!sid) {
        // @ts-expect-error - Express session
        req.session.afterInitializing = req.originalUrl
        return res.redirect('/initial')
      }

      // Find session
      const auth = await this.sessionManager.get(sid)
      if (!auth) {
        // @ts-expect-error - Express session
        req.session.afterInitializing = req.originalUrl
        return res.redirect('/initial')
      }

      // @ts-expect-error - Authentication
      req.auth = auth

      // Next function
      next()
    } catch (ex) {
      this.logger.error(ex)
      return res.redirect(`/system-error`)
    }
  }
}
