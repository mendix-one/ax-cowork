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
      }).unknown(true),
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
