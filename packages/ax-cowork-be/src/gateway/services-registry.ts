import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

export interface UpstreamService {
  // Root URL of the downstream service (e.g. http://localhost:3001).
  baseURL: string
  // App key the gateway will request a token for (passed as `scope` to SSO /token).
  appKey: string
}

// Allowlist of services the gateway can proxy to. Fail-closed: requests for any service
// not listed here are rejected with 404 before reaching the upstream.
//
// Source of truth is the GATEWAY_SERVICES env var (JSON, validated in ConfigModule). When
// it's absent or empty, we fall back to a single `sso` entry derived from SSO_BASE_URL +
// SSO_APP_KEY — the most common deployment only proxies to SSO, so that default avoids
// forcing duplicate config.
@Injectable()
export class ServicesRegistry {
  private readonly logger = new Logger(ServicesRegistry.name)
  private readonly services: Map<string, UpstreamService>

  constructor(config: ConfigService) {
    const raw = config.get<string>('GATEWAY_SERVICES') ?? ''
    if (raw === '') {
      this.services = new Map([['sso', { baseURL: config.getOrThrow<string>('SSO_BASE_URL'), appKey: config.getOrThrow<string>('SSO_APP_KEY') }]])
      this.logger.log('GATEWAY_SERVICES not set — defaulting to { sso: SSO_BASE_URL + SSO_APP_KEY }')
    } else {
      const parsed = JSON.parse(raw) as Record<string, UpstreamService>
      this.services = new Map(Object.entries(parsed))
    }
  }

  // Returns undefined for unknown services. Callers translate that to 404.
  resolve(name: string): UpstreamService | undefined {
    return this.services.get(name)
  }
}
