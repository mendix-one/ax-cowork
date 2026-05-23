import { Injectable, Logger } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Cron, CronExpression } from '@nestjs/schedule'

import { CRONJOB } from './cronjob.events'
import { CronjobManager } from './cronjob.manager'

@Injectable()
export class CronjobScheduler {
  private readonly logger = new Logger(CronjobScheduler.name)

  constructor(
    private readonly manager: CronjobManager,
    private readonly events: EventEmitter2,
  ) {}

  // Every minute: pull jobs eligible for pickup and emit one `CRONJOB` event per job.
  // Payload is the job's `uuid` so the listener can claim it via `start()`.
  @Cron(CronExpression.EVERY_MINUTE)
  async tick(): Promise<void> {
    const jobs = await this.manager.scan()
    for (const job of jobs) {
      this.events.emit(CRONJOB, job.uuid)
    }
    if (jobs.length > 0) {
      this.logger.log(`Dispatched ${jobs.length} cronjob event(s)`)
    }
  }
}
