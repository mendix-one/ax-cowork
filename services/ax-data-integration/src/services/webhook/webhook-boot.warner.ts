import { Injectable, Logger, type OnApplicationBootstrap } from '@nestjs/common'

import { JobConfigRepository } from '../../domain/job-config'

/**
 * Boot-time scan: any enabled webhook job_config whose `source.config.secretRef` is absent runs as an
 * "open webhook" — accepts payloads without HMAC verification (T2-B03). The verifier silently bypasses
 * those per-request to avoid log noise; this scanner emits a single `warn` per open job at startup so
 * operators see them in one place when the service comes up.
 *
 * Intentionally narrow scope — does NOT block boot, does NOT touch disabled jobs. Pure observability.
 */
@Injectable()
export class WebhookBootWarner implements OnApplicationBootstrap {
  private readonly logger = new Logger(WebhookBootWarner.name)

  constructor(private readonly jobConfigs: JobConfigRepository) {}

  async onApplicationBootstrap(): Promise<void> {
    const { items } = await this.jobConfigs.list({ enabled: true, sourceType: 'webhook', skip: 0, limit: 1000 })
    let openCount = 0
    for (const doc of items) {
      const ref = doc.source.config.secretRef
      if (ref !== undefined && ref !== null) continue
      openCount += 1
      this.logger.warn(`open webhook (no HMAC) jobConfigId=${doc._id.toHexString()} name="${doc.name}" — payloads accepted without signature verification`)
    }
    if (items.length > 0) {
      this.logger.log(`webhook jobs scanned: ${items.length} enabled, ${openCount} open (unsigned)`)
    }
  }
}
