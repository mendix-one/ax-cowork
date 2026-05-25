import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'

import { JobConfigModule } from '../../domain/job-config'
import { SecretModule } from '../../domain/secret'
import { SourceMetadataModule } from '../../domain/source-metadata'
import { SyncRunModule } from '../../domain/sync-run'
import { WorkersModule } from '../../workers/workers.module'
import { WebhookBootWarner } from './webhook-boot.warner'
import { WebhookController } from './webhook.controller'
import { WebhookIngestionService } from './webhook-ingestion.service'
import { WebhookSignatureVerifier } from './webhook-signature.verifier'

/**
 * T2-B02 (receiver) + T2-B03 (HMAC) + T2-B04 (ingestion) module.
 *
 * Wiring:
 *   - `JobConfigModule` — controller resolves the target job_config via `JobConfigRepository`.
 *   - `SecretModule` — `WebhookSignatureVerifier` decrypts the HMAC secret via `SecretsService`.
 *   - `SyncRunModule` + `SourceMetadataModule` — `WebhookIngestionService` writes sync_runs and
 *     persists inferred schema metadata.
 *   - `WorkersModule` — provides `RecordClassifierService`, the SAME classifier the cron path uses,
 *     so webhook writes have identical insert/update/unchanged semantics with no duplicated logic.
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
    SourceMetadataModule,
    SyncRunModule,
    WorkersModule,
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
