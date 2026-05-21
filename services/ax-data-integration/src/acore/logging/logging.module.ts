import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'

import { deepRedact } from './redact'

@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const level = config.get<string>('LOG_LEVEL') ?? 'info'
        const isDevelopment = config.get<string>('NODE_ENV') === 'development'

        return {
          pinoHttp: {
            level,
            autoLogging: true,
            formatters: {
              log: (obj: Record<string, unknown>) => deepRedact(obj) as Record<string, unknown>,
            },
            transport: isDevelopment ? { target: 'pino-pretty', options: { singleLine: true, translateTime: 'SYS:HH:MM:ss.l' } } : undefined,
          },
        }
      },
    }),
  ],
  exports: [LoggerModule],
})
export class LoggingModule {}
