import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'

import { ApiKeyGuard } from './api-key.guard'

@Module({
  imports: [
    // Globally registers `JwtService` — any provider can `@Inject(JwtService)` and call
    // `signAsync(payload)` / `verifyAsync(token)`. Secret + expiry are env-driven via ConfigService.
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        // `expiresIn` is typed as a literal `ms`-style string; cast a generic `string` env to satisfy it.
        signOptions: { expiresIn: (config.get<string>('JWT_EXPIRES_IN') ?? '24h') as `${number}h` },
      }),
    }),
  ],
  providers: [{ provide: APP_GUARD, useClass: ApiKeyGuard }],
})
export class SecurityModule {}
