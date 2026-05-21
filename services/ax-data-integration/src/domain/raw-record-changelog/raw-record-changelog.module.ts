import { Module } from '@nestjs/common'

import { RawRecordChangelogRepository } from './raw-record-changelog.repository'

@Module({
  providers: [RawRecordChangelogRepository],
  exports: [RawRecordChangelogRepository],
})
export class RawRecordChangelogModule {}
