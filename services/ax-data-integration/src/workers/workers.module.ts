import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'

import { JobConfigModule } from '../domain/job-config'
import { RawRecordChangelogModule } from '../domain/raw-record-changelog'
import { RawRecordModule } from '../domain/raw-record'
import { SecretModule } from '../domain/secret'
import { SourceFileModule } from '../domain/source-file'
import { SourceMetadataModule } from '../domain/source-metadata'
import { SyncRunModule } from '../domain/sync-run'
import { ConcurrencyService, MAX_CONCURRENT_RUNS } from './concurrency.service'
import { DEFAULT_TIMEZONE, SchedulerService } from './scheduler.service'
import { STALE_HEARTBEAT_TIMEOUT_MS, STALE_SWEEP_INTERVAL_MS, StaleRunSweeperService } from './stale-run-sweeper.service'
import { SyncRunsController } from './sync-runs.controller'
import { RecordClassifierService } from './record-classifier.service'
import { CHANGELOG_BUFFER_SIZE, DEFAULT_ERROR_THRESHOLD, HEARTBEAT_INTERVAL_MS, SyncExecutorService } from './sync-executor.service'
import { TriggerController } from './trigger.controller'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    SyncRunModule,
    JobConfigModule,
    RawRecordModule,
    RawRecordChangelogModule,
    SourceMetadataModule,
    SourceFileModule,
    SecretModule,
  ],
  controllers: [TriggerController, SyncRunsController],
  providers: [
    {
      provide: MAX_CONCURRENT_RUNS,
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => Number(cfg.get<string | number>('INTEGRATION_MAX_CONCURRENT_RUNS') ?? 5),
    },
    {
      provide: HEARTBEAT_INTERVAL_MS,
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => Number(cfg.get<string | number>('INTEGRATION_HEARTBEAT_INTERVAL_MS') ?? 30_000),
    },
    {
      provide: DEFAULT_ERROR_THRESHOLD,
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => Number(cfg.get<string | number>('INTEGRATION_DEFAULT_ERROR_THRESHOLD') ?? 100),
    },
    {
      provide: CHANGELOG_BUFFER_SIZE,
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => Number(cfg.get<string | number>('INTEGRATION_CHANGELOG_BUFFER_SIZE') ?? 100),
    },
    {
      provide: STALE_HEARTBEAT_TIMEOUT_MS,
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => Number(cfg.get<string | number>('INTEGRATION_STALE_HEARTBEAT_TIMEOUT_MS') ?? 120_000),
    },
    {
      provide: STALE_SWEEP_INTERVAL_MS,
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => Number(cfg.get<string | number>('INTEGRATION_STALE_SWEEP_INTERVAL_MS') ?? 60_000),
    },
    {
      provide: DEFAULT_TIMEZONE,
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => cfg.get<string>('INTEGRATION_DEFAULT_TIMEZONE') ?? 'UTC',
    },
    ConcurrencyService,
    RecordClassifierService,
    SyncExecutorService,
    StaleRunSweeperService,
    SchedulerService,
  ],
  exports: [ConcurrencyService, RecordClassifierService, SyncExecutorService, StaleRunSweeperService, SchedulerService],
})
export class WorkersModule {}
