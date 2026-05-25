import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'

import { JobConfigModule } from '../../domain/job-config'
import { SecretModule } from '../../domain/secret'
import { WebhookBootWarner } from './webhook-boot.warner'
import { WebhookController } from './webhook.controller'
import { WebhookIngestionService } from './webhook-ingestion.service'
import { WebhookSignatureVerifier } from './webhook-signature.verifier'

/**
 * T2-B02 receiver module. Scope is intentionally narrow: HTTP plumbing (controller + per-route
 * throttle) + a stub `WebhookIngestionService` whose body T2-B04 replaces with the real
 * `sync_run` + `classifyAndWrite` path.
 *
 * Throttle config is resolved from `INTEGRATION_WEBHOOK_RATE_LIMIT_RPM` at module-init time via
 * `forRootAsync` so operators can tune it without code changes. `@Throttle(...)` on the controller
 * pins per-route values evaluated at class load — the async factory below configures the GLOBAL
 * default which serves as the fallback if the per-route decorator is removed in future refactors.
 */
@Module({
  imports: [
    JobConfigModule,
    SecretModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: 60_000,
          limit: config.get<number>('INTEGRATION_WEBHOOK_RATE_LIMIT_RPM') ?? 60,
        },
      ],
    }),
  ],
  controllers: [WebhookController],
  providers: [WebhookIngestionService, WebhookSignatureVerifier, WebhookBootWarner],
  exports: [WebhookIngestionService, WebhookSignatureVerifier],
})
export class WebhookModule {}
