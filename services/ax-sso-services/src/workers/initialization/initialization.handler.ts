import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class InitializationHandler {
  private readonly logger = new Logger(InitializationHandler.name)

  // Runs the one-shot service initialization routine. Invoked by `CronjobListener` when a
  // cronjob named "initialization" fires. Throw to signal failure — the listener will catch
  // it and transition the cronjob to INTERRUPTED with the stack trace recorded.
  async execute(parameters: Record<string, unknown> = {}): Promise<void> {
    this.logger.log(`Running initialization (parameters=${JSON.stringify(parameters)})`)
    // TODO: real initialization steps go here (seed data, warm caches, sanity checks, etc.).
    await Promise.resolve()
  }
}
