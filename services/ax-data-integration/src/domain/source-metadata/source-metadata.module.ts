import { Module } from '@nestjs/common'

import { SourceMetadataController } from './source-metadata.controller'
import { SourceMetadataRepository } from './source-metadata.repository'

@Module({
  controllers: [SourceMetadataController],
  providers: [SourceMetadataRepository],
  exports: [SourceMetadataRepository],
})
export class SourceMetadataModule {}
