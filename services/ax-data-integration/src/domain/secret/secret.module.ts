import { Module } from '@nestjs/common'

import { JobConfigModule } from '../job-config'
import { SecretsController } from './secret.controller'
import { SecretRepository } from './secret.repository'
import { SecretsService } from './secret.service'

@Module({
  imports: [JobConfigModule],
  controllers: [SecretsController],
  providers: [SecretRepository, SecretsService],
  exports: [SecretsService, SecretRepository],
})
export class SecretModule {}
