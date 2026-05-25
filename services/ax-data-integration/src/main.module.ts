import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'

import { AuthModule } from './acore/auth'
import { ConfigModule } from './acore/config/config.module'
import { CryptoModule } from './acore/crypto'
import { LoggingModule } from './acore/logging'
import { MongoModule } from './acore/mongo'
import {
  AdaptersModule,
  CsvAdapterModule,
  ExcelAdapterModule,
  MssqlAdapterModule,
  MysqlAdapterModule,
  OracleAdapterModule,
  PostgresAdapterModule,
  RestApiAdapterModule,
} from './adapters'
import { JobConfigModule } from './domain/job-config'
import { RawRecordModule } from './domain/raw-record'
import { RawRecordChangelogModule } from './domain/raw-record-changelog'
import { SecretModule } from './domain/secret'
import { SourceFileModule } from './domain/source-file'
import { SourceMetadataModule } from './domain/source-metadata'
import { MetricsModule } from './services/metrics'
import { ServicesModule } from './services/services.module'
import { WebhookModule } from './services/webhook'
import { WorkersModule } from './workers/workers.module'

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule,
    LoggingModule,
    MongoModule,
    CryptoModule,
    AuthModule,
    AdaptersModule,
    ExcelAdapterModule,
    CsvAdapterModule,
    RestApiAdapterModule,
    PostgresAdapterModule,
    MysqlAdapterModule,
    MssqlAdapterModule,
    OracleAdapterModule,
    JobConfigModule,
    RawRecordModule,
    RawRecordChangelogModule,
    SecretModule,
    SourceFileModule,
    SourceMetadataModule,
    MetricsModule,
    ServicesModule,
    WebhookModule,
    WorkersModule,
  ],
})
export class MainModule {}
