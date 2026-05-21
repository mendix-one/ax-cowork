import { Module } from '@nestjs/common'

import { RawRecordController } from './raw-record.controller'
import { RawRecordRepository } from './raw-record.repository'

@Module({
  controllers: [RawRecordController],
  providers: [RawRecordRepository],
  exports: [RawRecordRepository],
})
export class RawRecordModule {}
