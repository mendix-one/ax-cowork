import { Inject, Injectable } from '@nestjs/common'

export const MAX_CONCURRENT_RUNS = 'MAX_CONCURRENT_RUNS'

/** Result of `ConcurrencyService.acquire`. The caller must invoke `release()` once the protected work finishes. */
export type AcquireResult = { kind: 'acquired'; release: () => void } | { kind: 'skipped-inmem'; reason: 'job already running in this process' }

/**
 * Two-level concurrency guard for SyncExecutor (P002 §8.2 + §8.5):
 *
 * 1. **Fast-path** — a `Set<jobConfigId>` rejects duplicate cron-fires within the same
 *    process before the DB is touched.
 * 2. **Semaphore** — caps total concurrent runs at `MAX_CONCURRENT_RUNS` so a midnight
 *    swarm of jobs doesn't exhaust the Mongo connection pool / spam external sources.
 *
 * Both primitives are exposed via the composite `acquire(jobConfigId)` call which
 * returns either `acquired` (with a `release` closure) or `skipped-inmem`.
 */
@Injectable()
export class ConcurrencyService {
  private readonly running = new Set<string>()
  private readonly waiters: Array<() => void> = []
  private slotsTaken = 0

  constructor(@Inject(MAX_CONCURRENT_RUNS) private readonly maxSlots: number) {
    if (!Number.isInteger(maxSlots) || maxSlots < 1) {
      throw new Error(`MAX_CONCURRENT_RUNS must be a positive integer (got ${maxSlots})`)
    }
  }

  /**
   * Attempts to claim both the fast-path slot for `jobConfigId` and a semaphore slot.
   *
   * - If `jobConfigId` is already running in this process → resolves immediately with `skipped-inmem`.
   * - Otherwise reserves the fast-path, then waits for a semaphore slot, then resolves with `acquired`.
   *   The returned `release` MUST be called in a `finally` block to free both slots.
   */
  async acquire(jobConfigId: string): Promise<AcquireResult> {
    if (this.running.has(jobConfigId)) {
      return { kind: 'skipped-inmem', reason: 'job already running in this process' }
    }
    this.running.add(jobConfigId)
    try {
      await this.acquireSlot()
    } catch (err) {
      this.running.delete(jobConfigId)
      throw err
    }
    return {
      kind: 'acquired',
      release: () => {
        this.releaseSlot()
        this.running.delete(jobConfigId)
      },
    }
  }

  /** True iff the given job is currently considered in-flight by the fast-path guard. */
  isRunning(jobConfigId: string): boolean {
    return this.running.has(jobConfigId)
  }

  /** Current count of held semaphore slots. Diagnostic. */
  get inFlight(): number {
    return this.slotsTaken
  }

  /** Current size of the fast-path Set. Diagnostic. */
  get fastPathSize(): number {
    return this.running.size
  }

  /** Configured semaphore capacity. Diagnostic. */
  get capacity(): number {
    return this.maxSlots
  }

  private acquireSlot(): Promise<void> {
    if (this.slotsTaken < this.maxSlots) {
      this.slotsTaken++
      return Promise.resolve()
    }
    return new Promise<void>((resolve) => {
      this.waiters.push(resolve)
    })
  }

  private releaseSlot(): void {
    const nextWaiter = this.waiters.shift()
    if (nextWaiter) {
      // Hand the slot directly to the next caller — slotsTaken stays unchanged.
      nextWaiter()
      return
    }
    this.slotsTaken = Math.max(0, this.slotsTaken - 1)
  }
}
