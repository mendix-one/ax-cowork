import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { CRONJOB, CronjobManager } from '../acore/cronjob'
import { InitializationHandler } from './initialization/initialization.handler'

@Injectable()
export class CronjobListener {
  private readonly logger = new Logger(CronjobListener.name)

  constructor(
    private readonly manager: CronjobManager,
    private readonly initializationHandler: InitializationHandler,
  ) {}

  // Subscribes to exactly one event — `CRONJOB` — fired by `CronjobScheduler` per dispatched job.
  // Payload is the job uuid. We claim the job via `start()`; if it returns undefined the job is no
  // longer pickup-able (already claimed, completed, or aborted) and we silently no-op.
  @OnEvent(CRONJOB, { async: true })
  async handle(uuid: string): Promise<void> {
    const job = await this.manager.start(uuid)
    if (!job) return
    this.logger.log(`Started cronjob ${job.name} (${uuid}) — attempt #${job.retries}`)
    try {
      // TODO: dispatch the actual job runner per job.name here (to be implemented).
      // Anything thrown out of the runner — or by `complete()` itself — falls into the catch
      // below and the job is marked INTERRUPTED with the error context attached.
      if (job.name === 'initialization') {
        await this.initializationHandler.execute(job.parameters)
      }
      await this.manager.complete(uuid)
    } catch (err: unknown) {
      // `Error.stack` already includes the message as its first line, so it's the single most
      // useful string to record. Fall back to plain `.message` or stringification for non-Error throws.
      const detail = err instanceof Error ? (err.stack ?? err.message) : String(err)
      await this.manager.interrupt(uuid, detail)
    }
  }
}
