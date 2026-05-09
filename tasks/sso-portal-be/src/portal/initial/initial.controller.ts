import { Controller, Get, Logger, Req, Res, UseFilters } from '@nestjs/common'
import { Request, Response } from 'express'
import { SystemExceptionFilter } from '../../core/exception/system.exception.filter'
import { SessionManager } from '../../core/manager/session.manager'
import { HeaderParams } from '../../core/interface/header-params.interface'

@Controller('initial')
export class InitialController {
  private readonly logger = new Logger(InitialController.name)

  constructor(private sessionManager: SessionManager) {}

  getSiteHost(req: Request): string {
    const host = req.get('host')
    const proto = host.includes('localhost') ? 'http' : 'https'
    return `${proto}://${host}`
  }

  getHeaderParams(req: Request): HeaderParams {
    const host = req.get('host')
    const protocol = req.get('xx-forwarded-proto') || req.get('x-forwarded-proto') || req.protocol
    let port = host.includes(':') ? host.split(':')[1] : '80'
    port = protocol && protocol.startsWith('https') ? '443' : port

    return {
      type: 'WEBSITE',
      request: req.originalUrl,
      method: req.method,
      host: req.get('host'),
      xForwardedFor: req.get('xx-forwarded-for') || req.get('x-forwarded-for') || req.socket.remoteAddress,
      xForwardedProto: req.get('xx-forwarded-proto') || req.get('x-forwarded-proto') || req.protocol,
      xForwardedPort: req.get('xx-forwarded-port') || req.get('x-forwarded-port') || port,
      userAgent: req.get('xx-user-agent') || req.get('user-agent') || 'n/a',
      metadata: '{}'
    }
  }

  @Get()
  @UseFilters(SystemExceptionFilter)
  async index(@Req() req: Request, @Res() res: Response) {
    // Get site host
    const siteHost = this.getSiteHost(req)

    // @ts-expect-error - express session
    const sid = req.session.key

    // @ts-expect-error - express session
    const afterInitializing = req.session.afterInitializing

    // Find session
    let auth = await this.sessionManager.get(sid)

    // Check session
    if (!!auth) {
      // User current session
      this.logger.log(`User current session: ${auth?.sid}`)

      // @ts-expect-error - express session
      req.session.key = auth.sid

      // @ts-expect-error - express session
      req.session.afterInitializing = undefined

      // Redirect back
      return res.redirect(afterInitializing || siteHost)
    }

    // Initial session
    auth = await this.sessionManager.initial(this.getHeaderParams(req))

    // Initialize new session
    this.logger.log(`Initialize new session: ${auth?.sid}`)

    // @ts-expect-error - express session
    req.session.key = auth.sid

    // @ts-expect-error - express session
    req.session.afterInitializing = undefined

    // Redirect back
    return res.redirect(afterInitializing || siteHost)
  }
}
