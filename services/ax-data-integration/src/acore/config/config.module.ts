import * as Joi from 'joi'
import { Global, Module } from '@nestjs/common'
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config'

// Master key is base64-encoded 32 bytes (AES-256) → exactly 44 chars with padding.
const masterKeySchema = Joi.string().base64().length(44)

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      cache: true,
      expandVariables: true,
      validationSchema: Joi.object({
        // Runtime
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().port().default(3012),
        LOG_LEVEL: Joi.string().valid('trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent').default('info'),

        // MongoDB
        MONGO_URI: Joi.string().required(),
        MONGO_DB_NAME: Joi.string().required(),
        MONGO_POOL_SIZE: Joi.number().integer().min(1).default(10),
        // Auto-ensure indexes on app boot. Default true. Set false for emergency rollbacks
        // when a new index definition would block startup. Operators can still run
        // `node dist/migrate-indexes` standalone.
        INTEGRATION_AUTO_ENSURE_INDEXES: Joi.boolean().default(true),
        INTEGRATION_INDEX_ENSURE_TIMEOUT_MS: Joi.number().integer().min(1_000).default(30_000),

        // Authentication
        INTEGRATION_API_KEYS: Joi.string().min(1).required(),
        // Optional human-readable labels (CSV), parallel to INTEGRATION_API_KEYS by index.
        // Surfaces in audit attribution (createdBy/updatedBy) so log greps return labels
        // like "ci-deploy" instead of "key-<hash>". Missing label → 'key-<hash>' fallback.
        INTEGRATION_API_KEY_LABELS: Joi.string().allow('').optional(),

        // Secret encryption (additional INTEGRATION_MASTER_KEY_V<N> entries are
        // validated by SecretService at startup — see T-B01)
        INTEGRATION_MASTER_KEY_V1: masterKeySchema.required(),
        INTEGRATION_MASTER_KEY_CURRENT: Joi.number().integer().min(1).required(),

        // Job execution defaults
        INTEGRATION_DEFAULT_TIMEZONE: Joi.string().default('UTC'),
        INTEGRATION_DEFAULT_ERROR_THRESHOLD: Joi.number().integer().min(1).default(100),
        INTEGRATION_MAX_CONCURRENT_RUNS: Joi.number().integer().min(1).default(5),

        // Heartbeat / stale-sweep timings
        INTEGRATION_HEARTBEAT_INTERVAL_MS: Joi.number().integer().min(1_000).default(30_000),
        INTEGRATION_STALE_HEARTBEAT_TIMEOUT_MS: Joi.number().integer().min(1_000).default(120_000),
        INTEGRATION_STALE_SWEEP_INTERVAL_MS: Joi.number().integer().min(1_000).default(60_000),

        // Audit changelog
        INTEGRATION_CHANGELOG_BUFFER_SIZE: Joi.number().integer().min(1).default(100),

        // Prometheus metrics (T2-A08). Optional Bearer-token gate on /metrics — when unset,
        // the endpoint is open (suitable for closed-VPN / internal-only deploys); when set,
        // requires `Authorization: Bearer <token>` on every scrape.
        INTEGRATION_METRICS_TOKEN: Joi.string().min(8).optional(),

        // Retention TTL (T2-A05). Day-granularity is enough for compliance-light internal use.
        // Max 3650 (10 years) protects from typos like passing `infinity` or huge ints.
        // `raw_records` is NOT TTL'd (it's the source of truth); GridFS source_files only via DELETE.
        INTEGRATION_TTL_CHANGELOG_DAYS: Joi.number().integer().min(1).max(3650).default(90),
        INTEGRATION_TTL_SYNC_RUN_DAYS: Joi.number().integer().min(1).max(3650).default(30),
        // Test-only second-granularity overrides (honoured ONLY when NODE_ENV=test) so e2e
        // can bypass the day floor. Production callers must use the *_DAYS variants above.
        INTEGRATION_TTL_CHANGELOG_SECONDS: Joi.number()
          .integer()
          .min(1)
          .max(3650 * 86400)
          .optional(),
        INTEGRATION_TTL_SYNC_RUN_SECONDS: Joi.number()
          .integer()
          .min(1)
          .max(3650 * 86400)
          .optional(),

        // Webhook receiver (T2-B02). MAX_BYTES caps incoming JSON payload size — controller returns
        // 413 if exceeded (10 MiB default is generous for typical event-stream payloads while still
        // bounding memory pressure on the on-prem node). RATE_LIMIT_RPM = per-IP requests per minute
        // before the route returns 429 (HMAC signature is the auth boundary; rate limit is a
        // belt-and-braces guard against floods).
        INTEGRATION_WEBHOOK_MAX_BYTES: Joi.number()
          .integer()
          .min(1024)
          .max(100 * 1024 * 1024)
          .default(10 * 1024 * 1024),
        INTEGRATION_WEBHOOK_RATE_LIMIT_RPM: Joi.number().integer().min(1).max(100_000).default(60),
        // T2-B03 replay protection. When > 0 AND the request carries `x-webhook-timestamp`, the
        // controller requires that timestamp (unix seconds) to be within ±skew of the server clock.
        // Set to 0 to disable replay checks entirely (signature-only mode). Cap 3600s (1h) prevents
        // a typo from making the window functionally unbounded.
        INTEGRATION_WEBHOOK_MAX_SKEW_SEC: Joi.number().integer().min(0).max(3600).default(300),
      })
        .pattern(/^INTEGRATION_MASTER_KEY_V\d+$/, masterKeySchema)
        // T2-A10: parallel `_FILE` env var per version. Value is a filesystem path; the file's
        // content (trimmed) must be the base64 32-byte master key. Joi validates the path is a
        // non-empty string here; actual file read + decode happens in `loadMasterKeyRing`.
        .pattern(/^INTEGRATION_MASTER_KEY_V\d+_FILE$/, Joi.string().min(1))
        .unknown(true),
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
