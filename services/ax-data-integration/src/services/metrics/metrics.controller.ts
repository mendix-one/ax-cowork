import { Controller, Get, Header, Inject, Req, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import type { Request } from 'express'
import { Registry } from 'prom-client'

import { Public } from '../../acore/auth'
import { PROMETHEUS_REGISTRY } from './metrics.constants'

const PROMETHEUS_TEXT_CONTENT_TYPE = 'text/plain; version=0.0.4; charset=utf-8'

@ApiTags('Service')
@Controller('metrics')
@Public()
export class MetricsController {
  constructor(
    @Inject(PROMETHEUS_REGISTRY) private readonly registry: Registry,
    private readonly config: ConfigService,
  ) {}

  /**
   * Prometheus scrape endpoint (T2-A08).
   *
   * Two authentication modes:
   *  - **Open** (default): `INTEGRATION_METRICS_TOKEN` unset → any caller can scrape. Suitable
   *    for closed-VPN / internal-only deploys.
   *  - **Bearer-protected**: `INTEGRATION_METRICS_TOKEN=<token>` set → requires
   *    `Authorization: Bearer <token>`. Use this when `/metrics` is reachable from outside
   *    a trust boundary (e.g. shared cluster, ingress without IP allowlist).
   *
   * Always `@Public()` (no x-api-key) — Prometheus scrape pollers don't carry the service's
   * API key. The bearer-token gate is the equivalent for this endpoint.
   */
  @Get()
  @Header('Content-Type', PROMETHEUS_TEXT_CONTENT_TYPE)
  @ApiOperation({
    summary: 'Prometheus metrics scrape',
    description:
      'Returns text/plain (Prometheus 0.0.4 format). Always public to API-key auth. If `INTEGRATION_METRICS_TOKEN` is set, requires `Authorization: Bearer <token>` instead.',
  })
  @ApiOkResponse({ description: 'Prometheus exposition format.' })
  @ApiUnauthorizedResponse({ description: 'Bearer token mismatch (only when `INTEGRATION_METRICS_TOKEN` is configured).' })
  async scrape(@Req() req: Request): Promise<string> {
    const expected = this.config.get<string>('INTEGRATION_METRICS_TOKEN')
    if (expected) {
      const header = req.headers.authorization ?? ''
      const presented = header.startsWith('Bearer ') ? header.slice('Bearer '.length).trim() : ''
      if (presented !== expected) {
        throw new UnauthorizedException('Invalid or missing Bearer token for /metrics')
      }
    }
    return this.registry.metrics()
  }
}
