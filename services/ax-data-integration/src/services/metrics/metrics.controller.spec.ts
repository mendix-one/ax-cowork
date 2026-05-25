import { UnauthorizedException } from '@nestjs/common'
import type { ConfigService } from '@nestjs/config'
import type { Request } from 'express'
import { Registry } from 'prom-client'

import { MetricsController } from './metrics.controller'

function buildConfig(token?: string): ConfigService {
  return { get: (key: string) => (key === 'INTEGRATION_METRICS_TOKEN' ? token : undefined) } as unknown as ConfigService
}

function buildReq(authHeader?: string): Request {
  return { headers: authHeader ? { authorization: authHeader } : {} } as unknown as Request
}

describe('MetricsController.scrape', () => {
  let registry: Registry

  beforeEach(() => {
    registry = new Registry()
    registry.setDefaultLabels({ service: 'ax-data-integration' })
  })

  it('returns the prom-client metrics output when no token is configured (open scrape)', async () => {
    const ctrl = new MetricsController(registry, buildConfig(undefined))
    const text = await ctrl.scrape(buildReq())
    expect(typeof text).toBe('string')
    // Empty registry is still valid Prometheus output — assert the call did not throw.
  })

  it('serves the scrape when the Bearer token matches', async () => {
    const ctrl = new MetricsController(registry, buildConfig('secret-token'))
    const text = await ctrl.scrape(buildReq('Bearer secret-token'))
    expect(typeof text).toBe('string')
  })

  it('throws 401 when the token is configured but the header is missing', async () => {
    const ctrl = new MetricsController(registry, buildConfig('secret-token'))
    await expect(ctrl.scrape(buildReq())).rejects.toBeInstanceOf(UnauthorizedException)
  })

  it('throws 401 when the Bearer token does not match', async () => {
    const ctrl = new MetricsController(registry, buildConfig('secret-token'))
    await expect(ctrl.scrape(buildReq('Bearer wrong-token'))).rejects.toBeInstanceOf(UnauthorizedException)
  })

  it('throws 401 when the auth header has the wrong scheme', async () => {
    const ctrl = new MetricsController(registry, buildConfig('secret-token'))
    await expect(ctrl.scrape(buildReq('Basic c2VjcmV0LXRva2Vu'))).rejects.toBeInstanceOf(UnauthorizedException)
  })
})
