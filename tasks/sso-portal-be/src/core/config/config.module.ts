import * as Joi from 'joi'
import { Global, Module } from '@nestjs/common'
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config'

import loader from './loader'

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [loader],
      validationSchema: Joi.object({
        // Server
        SERVER_PORT: Joi.number().required()
      }).unknown(true)
    })
  ],
  providers: [ConfigService],
  exports: [ConfigService]
})
export class ConfigModule {}
