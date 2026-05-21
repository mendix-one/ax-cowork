import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { loadMasterKeyRing } from './secret.loader'
import { SecretService } from './secret.service'
import { MASTER_KEY_RING } from './secret.types'

@Global()
@Module({
  providers: [
    {
      provide: MASTER_KEY_RING,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => loadMasterKeyRing(process.env, Number(config.getOrThrow<string | number>('INTEGRATION_MASTER_KEY_CURRENT'))),
    },
    SecretService,
  ],
  exports: [SecretService],
})
export class CryptoModule {}
