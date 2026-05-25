import { Inject, Injectable, Logger, type OnApplicationBootstrap, type OnApplicationShutdown } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { SchedulerRegistry } from '@nestjs/schedule'
import { CronJob } from 'cron'
import { ObjectId } from 'mongodb'

import { JobConfigRepository, type JobConfigDoc } from '../domain/job-config'
import { SyncExecutorService } from './sync-executor.service'

export const DEFAULT_TIMEZONE = 'DEFAULT_TIMEZONE'

/** Payload emitted by `JobConfigsService` whenever a job config is created, updated, enabled/disabled, or soft-deleted. */
export interface JobConfigChangedEvent {
  id: ObjectId
}

export const JOB_CONFIG_CHANGED_EVENT = 'jobConfig.changed'

/**
 * Owns the live mapping `jobConfigId → CronJob`. At bootstrap it loads every enabled
 * `job_configs` doc and registers one cron job per row. Whenever `JobConfigsService`
 * emits `jobConfig.changed`, this service re-fetches the doc and either (re-)registers
 * its cron or unregisters if it has been disabled.
 *
 * Cron callbacks invoke `SyncExecutorService.execute(id, 'schedule')` fire-and-forget —
 * the scheduler must never block on a single sync run (P002 §6.2).
 */
@Injectable()
export class SchedulerService implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger = new Logger(SchedulerService.name)
  private readonly registered = new Set<string>()

  constructor(
    private readonly jobConfigs: JobConfigRepository,
    private readonly executor: SyncExecutorService,
    private readonly scheduler: SchedulerRegistry,
    @Inject(DEFAULT_TIMEZONE) private readonly defaultTimezone: string,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const { items } = await this.jobConfigs.list({ enabled: true, skip: 0, limit: 1000 })
    for (const doc of items) {
      this.register(doc)
    }
    this.logger.log(`Bootstrap: registered ${this.registered.size} enabled cron job(s)`)
  }

  onApplicationShutdown(): void {
    for (const name of this.registered) {
      try {
        this.scheduler.deleteCronJob(name)
      } catch {
        // ignore — the registry may already be torn down
      }
    }
    this.registered.clear()
  }

  /** Registers (or re-registers) a cron for the given job config. Skips if `enabled=false` or there is no `cronExpression`. */
  register(doc: JobConfigDoc): void {
    const name = this.cronName(doc._id)
    if (this.registered.has(name)) this.unregister(doc._id)
    if (!doc.enabled) return
    const cronExpression = doc.schedule.cronExpression
    if (typeof cronExpression !== 'string' || cronExpression.trim().length === 0) {
      // Push-based sources (webhook, MQTT — see PUSH_SOURCE_TYPES) intentionally skip cron registration; ingestion is receiver-driven.
      return
    }

    const timezone = doc.schedule.timezone ?? this.defaultTimezone
    try {
      const cronJob = CronJob.from({
        cronTime: cronExpression,
        onTick: () => {
          this.executor.execute(doc._id, 'schedule').catch((err: unknown) => {
            this.logger.error(`scheduled execute failed for ${name}: ${err instanceof Error ? err.message : String(err)}`)
          })
        },
        timeZone: timezone,
        start: false,
      })
      this.scheduler.addCronJob(name, cronJob)
      cronJob.start()
      this.registered.add(name)
      this.logger.debug(`Registered ${name}: ${cronExpression} [${timezone}]`)
    } catch (err) {
      this.logger.error(`Failed to register ${name}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  /** Removes the cron for the given job config id (no-op if not registered). */
  unregister(jobConfigId: ObjectId): void {
    const name = this.cronName(jobConfigId)
    if (!this.registered.has(name)) return
    try {
      this.scheduler.deleteCronJob(name)
    } catch (err) {
      this.logger.warn(`deleteCronJob(${name}) failed: ${err instanceof Error ? err.message : String(err)}`)
    }
    this.registered.delete(name)
  }

  /** True when the cron for this jobConfigId is currently registered. Useful for tests + diagnostics. */
  isRegistered(jobConfigId: ObjectId): boolean {
    return this.registered.has(this.cronName(jobConfigId))
  }

  registeredCount(): number {
    return this.registered.size
  }

  @OnEvent(JOB_CONFIG_CHANGED_EVENT)
  async onJobConfigChanged(payload: JobConfigChangedEvent): Promise<void> {
    const doc = await this.jobConfigs.findById(payload.id)
    if (!doc || !doc.enabled) {
      this.unregister(payload.id)
      return
    }
    this.register(doc)
  }

  private cronName(id: ObjectId): string {
    return `sync:${id.toHexString()}`
  }
}
