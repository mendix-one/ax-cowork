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

        // Authentication
        INTEGRATION_API_KEYS: Joi.string().min(1).required(),

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
      })
        .pattern(/^INTEGRATION_MASTER_KEY_V\d+$/, masterKeySchema)
        .unknown(true),
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
