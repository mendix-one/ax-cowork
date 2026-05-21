import { Inject, Injectable, Logger, type OnApplicationBootstrap, type OnApplicationShutdown } from '@nestjs/common'

import { SyncRunRepository } from '../domain/sync-run'

export const STALE_HEARTBEAT_TIMEOUT_MS = 'STALE_HEARTBEAT_TIMEOUT_MS'
export const STALE_SWEEP_INTERVAL_MS = 'STALE_SWEEP_INTERVAL_MS'

export type SweepReason = 'startup' | 'periodic' | 'manual'

/**
 * Periodically walks `sync_runs` and transitions stale `status='running'` docs to
 * `status='stale'` (P002 §8.4). A doc is "stale" when its `heartbeatAt` is older than
 * `INTEGRATION_STALE_HEARTBEAT_TIMEOUT_MS` (default 2 min).
 *
 * Runs:
 * - **Once** at `onApplicationBootstrap` so crashed runs from a previous process are
 *   reclaimed immediately on restart.
 * - **Periodically** via `setInterval(INTEGRATION_STALE_SWEEP_INTERVAL_MS, …)` (default
 *   60 s) for runs that go silent while the current process is alive.
 *
 * Marking stale releases the partial-unique `running` lock so the next scheduled fire
 * for the same `jobConfigId` can claim a fresh run.
 */
@Injectable()
export class StaleRunSweeperService implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger = new Logger(StaleRunSweeperService.name)
  private interval: ReturnType<typeof setInterval> | undefined

  constructor(
    private readonly runs: SyncRunRepository,
    @Inject(STALE_HEARTBEAT_TIMEOUT_MS) private readonly timeoutMs: number,
    @Inject(STALE_SWEEP_INTERVAL_MS) private readonly intervalMs: number,
  ) {
    if (!Number.isFinite(timeoutMs) || timeoutMs < 1) {
      throw new Error(`STALE_HEARTBEAT_TIMEOUT_MS must be a positive number (got ${timeoutMs})`)
    }
    if (!Number.isFinite(intervalMs) || intervalMs < 1) {
      throw new Error(`STALE_SWEEP_INTERVAL_MS must be a positive number (got ${intervalMs})`)
    }
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.sweepOnce('startup')
    this.interval = setInterval(() => {
      this.sweepOnce('periodic').catch((err: unknown) => {
        this.logger.error(`Periodic sweep failed: ${err instanceof Error ? err.message : String(err)}`)
      })
    }, this.intervalMs)
  }

  onApplicationShutdown(): void {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = undefined
    }
  }

  /** Performs one sweep. Returns the number of docs transitioned. Public so tests can call directly. */
  async sweepOnce(reason: SweepReason = 'manual'): Promise<number> {
    const threshold = new Date(Date.now() - this.timeoutMs)
    const count = await this.runs.markStale(threshold)
    if (count > 0) {
      this.logger.warn(`Marked ${count} sync_run(s) as stale [${reason}, heartbeat older than ${this.timeoutMs}ms]`)
    } else {
      this.logger.debug(`No stale runs found [${reason}]`)
    }
    return count
  }
}
