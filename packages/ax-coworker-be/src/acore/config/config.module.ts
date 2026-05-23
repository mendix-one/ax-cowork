import * as Joi from 'joi'
import { Global, Module } from '@nestjs/common'
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config'

import webpage from './webpage'

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      cache: true,
      load: [webpage],
      expandVariables: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().default(3000),

        // SSO upstream (ax-sso-services)
        SSO_BASE_URL: Joi.string().uri().required(),
        SSO_API_KEY: Joi.string().min(1).required(),
        SSO_APP_KEY: Joi.string().min(1).default('APLANNER'),
        SSO_JWT_SECRET: Joi.string().min(16).required(),

        // Session cookie
        SESSION_COOKIE_NAME: Joi.string().min(1).default('ax_session'),
        // 64-hex-char string == 32 bytes for AES-256-GCM
        SESSION_COOKIE_SECRET: Joi.string().length(64).hex().required(),
        SESSION_COOKIE_SECURE: Joi.boolean().default(false),
      }).unknown(true),
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
