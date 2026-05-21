import { Module } from '@nestjs/common'

import { JobConfigModule } from '../job-config'
import { SourceFilesController } from './source-file.controller'
import { SourceFileRepository } from './source-file.repository'
import { SourceFilesService } from './source-file.service'

@Module({
  imports: [JobConfigModule],
  controllers: [SourceFilesController],
  providers: [SourceFileRepository, SourceFilesService],
  exports: [SourceFilesService, SourceFileRepository],
})
export class SourceFileModule {}
