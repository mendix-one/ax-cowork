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
      }).unknown(true),
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
