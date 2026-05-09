import { Global, Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { ConfigModule } from '../config/config.module'
import { MailerService } from './mailer.service'

@Global()
@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: +configService.get('HTTP_TIMEOUT') || 5000,
        maxRedirects: +configService.get('HTTP_MAX_REDIRECTS') || 1
      }),
      inject: [ConfigService]
    })
  ],
  providers: [MailerService],
  exports: [MailerService]
})
export class CallerModule {}
