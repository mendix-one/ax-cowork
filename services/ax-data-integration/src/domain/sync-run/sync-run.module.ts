import { Module } from '@nestjs/common'

import { SyncRunRepository } from './sync-run.repository'

@Module({
  providers: [SyncRunRepository],
  exports: [SyncRunRepository],
})
export class SyncRunModule {}
