import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { EVENT_NAME } from '../../core/event/event-name.enum'
import { EventDataDto } from '../../core/event/event-data.dto'
import { JobManager } from '../../core/manager/job.manager'
import { InitialWorkerService } from './initial-worker.service'

@Injectable()
export class InitialWorkerListener {
  private readonly logger = new Logger(InitialWorkerListener.name)

  constructor(
    private jobManager: JobManager,
    private initializeService: InitialWorkerService
  ) {}

  @OnEvent(EVENT_NAME.INITIALIZE)
  async handleInitializeSubject(eventDataDto: EventDataDto) {
    try {
      this.logger.log(
        `Handle job: ${eventDataDto.id}|${eventDataDto.name}|${eventDataDto.status}|${eventDataDto.attempt}`
      )

      const job = await this.jobManager.start(eventDataDto.id)

      if (job) {
        eventDataDto.attempt = job.attempt

        await this.initializeService.handle()

        await this.jobManager.complete(eventDataDto.id)

        this.logger.log(
          `Completed job: ${eventDataDto.id}|${eventDataDto.name}|${eventDataDto.status}|${eventDataDto.attempt}`
        )
      } else {
        this.logger.log(
          `Skip job: ${eventDataDto.id}|${eventDataDto.name}|${eventDataDto.status}|${eventDataDto.attempt}`
        )
      }
    } catch (e) {
      await this.jobManager.failed(eventDataDto.id, e.toString())
      this.logger.log(
        `Failed job: ${eventDataDto.id}|${eventDataDto.name}|${eventDataDto.status}|${eventDataDto.attempt}`
      )
    }
  }
}
