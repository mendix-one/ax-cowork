import { Injectable, Logger } from '@nestjs/common'
import { EVENT_NAME } from '../event/event-name.enum'
import { JobManager } from './job.manager'

@Injectable()
export class TaskManager {
  private readonly logger = new Logger(TaskManager.name)

  constructor(private jobManager: JobManager) {}

  /**
   * Initialize - insert sample data
   */
  async initialize() {
    this.logger.log('Initialize...')

    const listJobs = await this.jobManager.scan(EVENT_NAME.INITIALIZE)

    if (!!listJobs[0]) {
      if (listJobs[0].status === 'READY' || listJobs[0].status === 'FAILED') {
        this.logger.log('Retry initializing...')
        await this.jobManager.retry(listJobs[0])
      } else {
        this.logger.log('Skip initializing...')
      }
    } else {
      this.logger.log('Start initializing...')
      await this.jobManager.create(EVENT_NAME.INITIALIZE, {})
    }
  }
}
