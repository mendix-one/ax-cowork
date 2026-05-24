import { HttpException, Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { NextFunction, Request, Response } from 'express'
import { createProxyMiddleware, fixRequestBody, type RequestHandler } from 'http-proxy-middleware'

import { SessionService } from '../acore/security/session.service'
import { SsoClient } from '../acore/security/sso.client'
import { ServicesRegistry, type UpstreamService } from './services-registry'

// Context attached to the request after auth/token resolution. Read by the proxy callbacks
// (`router`, `pathRewrite`, `proxyReq`) which must be synchronous and so can't redo this work.
interface GatewayContext {
  upstream: UpstreamService
  rewrittenPath: string
  token: string
}

interface GatewayRequest extends Request {
  gateway?: GatewayContext
}

// Parses `/app/<service>/<rest><?query>` from the original URL. Returns null when the shape
// doesn't match (handled as 404). Using `originalUrl` is deliberate — Express middleware
// mounted under a sub-path may have a stripped `req.url`, but `originalUrl` is always intact.
function parseGatewayPath(originalUrl: string): { service: string; rest: string } | null {
  const match = /^\/app\/([^/?]+)(\/[^?]*)?(\?.*)?$/.exec(originalUrl)
  if (!match) return null
  const [, service, rest = '/', search = ''] = match
  return { service, rest: rest + search }
}

@Injectable()
export class GatewayMiddleware implements NestMiddleware {
  private readonly logger = new Logger(GatewayMiddleware.name)
  private readonly proxy: RequestHandler
  private readonly apiKey: string

  constructor(
    private readonly session: SessionService,
    private readonly sso: SsoClient,
    private readonly registry: ServicesRegistry,
    config: ConfigService,
  ) {
    this.apiKey = config.getOrThrow<string>('SSO_API_KEY')
    this.proxy = createProxyMiddleware({
      // `target` is required by the lib but is overridden per-request by `router`. The
      // placeholder is never actually contacted.
      target: 'http://localhost:3000',
      changeOrigin: true,
      router: (req) => (req as GatewayRequest).gateway!.upstream.baseURL,
      pathRewrite: (_path, req) => (req as GatewayRequest).gateway!.rewrittenPath,
      on: {
        proxyReq: (proxyReq, req) => {
          const ctx = (req as GatewayRequest).gateway!
          proxyReq.setHeader('authorization', `Bearer ${ctx.token}`)
          proxyReq.setHeader('ax-axios-key', this.apiKey)
          // Body was already parsed by Nest's built-in body-parser before this middleware
          // runs — re-serialize it onto the outgoing proxy stream.
          fixRequestBody(proxyReq, req)
        },
        error: (err, _req, res) => {
          this.logger.error(`Proxy error: ${err.message}`)
          // `res` here can be the upstream-side socket if the connection died mid-stream;
          // only set a JSON 502 when it's an Express response we haven't started writing yet.
          if ('status' in res && typeof res.status === 'function' && !(res as Response).headersSent) {
            ;(res as Response).status(502).json({ code: 'Upstream_Unreachable' })
          }
        },
      },
    })
  }

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const parsed = parseGatewayPath(req.originalUrl ?? req.url ?? '')
    if (!parsed) {
      res.status(404).json({ code: 'not_found' })
      return
    }

    const upstream = this.registry.resolve(parsed.service)
    if (!upstream) {
      res.status(404).json({ code: 'Unknown_Service', service: parsed.service })
      return
    }

    const sessionToken = this.session.readToken(req)
    if (!sessionToken) {
      res.status(401).json({ code: 'Unauthorized' })
      return
    }

    let token: string
    try {
      const minted = await this.sso.issueToken(sessionToken, upstream.appKey)
      token = minted.token
    } catch (err) {
      const status = err instanceof HttpException ? err.getStatus() : 502
      if (status === 401) {
        res.status(401).json({ code: 'Unauthorized' })
      } else {
        this.logger.warn(`Token exchange failed for ${parsed.service}: ${(err as Error).message}`)
        res.status(502).json({ code: 'SSO_Unreachable' })
      }
      return
    }

    ;(req as GatewayRequest).gateway = { upstream, rewrittenPath: parsed.rest, token }
    // http-proxy-middleware returns a Promise<void> in v3; fire-and-forget — internal errors
    // surface via the `on.error` callback configured in the constructor.
    void this.proxy(req, res, next)
  }
}
