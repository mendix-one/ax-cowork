import * as Joi from 'joi'
import { Global, Module } from '@nestjs/common'
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config'

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      cache: true,
      expandVariables: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().default(3001),
        MONGODB_URI: Joi.string().uri({ scheme: ['mongodb', 'mongodb+srv'] }).required(),
        // Comma-separated list of accepted API keys. At least one non-empty key is required.
        API_KEYS: Joi.string().min(1).required(),
        // HMAC secret used to sign session JWTs. Must be at least 16 chars in production-quality setups.
        JWT_SECRET: Joi.string().min(16).required(),
        // JWT lifetime — accepts ms-format strings ("24h", "10m") or numeric seconds.
        JWT_EXPIRES_IN: Joi.string().default('24h'),
      }).unknown(true),
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
