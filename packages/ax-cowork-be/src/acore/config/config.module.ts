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

        // Gateway upstreams — JSON map of { serviceName: { baseURL, appKey } }.
        // Example: `{"sso":{"baseURL":"http://localhost:3001","appKey":"SSO"}}`. Services
        // NOT listed here are rejected with 404 (fail-closed allowlist).
        //
        // Optional: when unset, the registry auto-derives a single `sso` entry from
        // SSO_BASE_URL + SSO_APP_KEY. Set this env to expose additional upstreams or
        // override the default mapping.
        GATEWAY_SERVICES: Joi.string()
          .optional()
          .allow('')
          .custom((value: string, helpers) => {
            if (value === '') return value
            let parsed: unknown
            try {
              parsed = JSON.parse(value)
            } catch {
              return helpers.error('any.invalid', { reason: 'must be valid JSON' })
            }
            if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
              return helpers.error('any.invalid', { reason: 'must be a JSON object' })
            }
            for (const [name, entry] of Object.entries(parsed)) {
              if (typeof entry !== 'object' || entry === null) return helpers.error('any.invalid', { reason: `service "${name}" must be an object` })
              const e = entry as Record<string, unknown>
              if (typeof e.baseURL !== 'string' || !/^https?:\/\//.test(e.baseURL))
                return helpers.error('any.invalid', { reason: `service "${name}" needs a valid baseURL` })
              if (typeof e.appKey !== 'string' || e.appKey.length === 0)
                return helpers.error('any.invalid', { reason: `service "${name}" needs a non-empty appKey` })
            }
            return value
          }),
      }).unknown(true),
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
