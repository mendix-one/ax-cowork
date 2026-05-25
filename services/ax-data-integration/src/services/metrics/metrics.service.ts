import { Inject, Injectable } from '@nestjs/common'
import { Counter, Histogram, Registry } from 'prom-client'

import type { SyncRunCounts } from '../../domain/sync-run'
import type { RunStatus } from '../../domain/job-config'
import { PROMETHEUS_REGISTRY } from './metrics.constants'

/**
 * Cardinality guard threshold (T2-A09): once we've seen this many distinct `jobConfigId`
 * label values, additional ones collapse to `'overflow'`. Prometheus best-practice — see
 * https://github.com/siimon/prom-client.
 */
export const JOB_LABEL_CARDINALITY_LIMIT = 100

const OVERFLOW_LABEL = 'overflow'
const SYNC_RUN_DURATION_BUCKETS_SEC = [0.5, 1, 5, 10, 30, 60, 300, 600, 1800, 3600]

type RecordOp = keyof SyncRunCounts

/**
 * Holds the prom-client counters/histograms instrumented by `SyncExecutorService` (T2-A09).
 *
 * Counters/histograms are created up-front at module bootstrap so that scraping `/metrics`
 * before the first run returns the metric families with zero-valued samples (Prometheus
 * convention: a metric should appear with its label set as soon as it's known to exist).
 *
 * The `jobConfigId` label is cardinality-guarded — see {@link observeJobLabel}.
 */
@Injectable()
export class MetricsService {
  readonly syncRunTotal: Counter<'status' | 'jobConfigId'>
  readonly syncRunDurationSeconds: Histogram<'status' | 'jobConfigId'>
  readonly syncRunRecordsTotal: Counter<'op' | 'jobConfigId'>
  private readonly seenJobIds = new Set<string>()

  constructor(@Inject(PROMETHEUS_REGISTRY) private readonly registry: Registry) {
    this.syncRunTotal = new Counter({
      name: 'sync_run_total',
      help: 'Total number of sync runs that reached a terminal status (success / partial / failed). Labeled by status + jobConfigId.',
      labelNames: ['status', 'jobConfigId'],
      registers: [registry],
    })
    this.syncRunDurationSeconds = new Histogram({
      name: 'sync_run_duration_seconds',
      help: 'Wall-clock duration of a sync run from startedAt to finishedAt, observed when the run finalizes. Labeled by status + jobConfigId.',
      labelNames: ['status', 'jobConfigId'],
      buckets: SYNC_RUN_DURATION_BUCKETS_SEC,
      registers: [registry],
    })
    this.syncRunRecordsTotal = new Counter({
      name: 'sync_run_records_total',
      help: 'Total records processed per operation (inserted / updated / unchanged / deleted / errors). Labeled by op + jobConfigId.',
      labelNames: ['op', 'jobConfigId'],
      registers: [registry],
    })
  }

  /**
   * Records the outcome of a single sync run. Called by `SyncExecutorService` immediately
   * after `runs.finalize` (T2-A09).
   */
  observeSyncRunCompleted(params: { jobConfigId: string; status: RunStatus; durationMs: number; counts: SyncRunCounts }): void {
    const jobLabel = this.observeJobLabel(params.jobConfigId)
    const labels = { status: params.status, jobConfigId: jobLabel }
    this.syncRunTotal.inc(labels)
    this.syncRunDurationSeconds.observe(labels, params.durationMs / 1000)
    for (const op of Object.keys(params.counts) as RecordOp[]) {
      const value = params.counts[op]
      if (value > 0) this.syncRunRecordsTotal.inc({ op, jobConfigId: jobLabel }, value)
    }
  }

  /**
   * Cardinality guard: keeps the per-job label set bounded so a job_config churn / loop
   * can't blow up Prometheus storage. After the limit is reached, every new id reports
   * as `'overflow'` — existing ids still produce real samples.
   */
  observeJobLabel(jobConfigId: string): string {
    if (this.seenJobIds.has(jobConfigId)) return jobConfigId
    if (this.seenJobIds.size >= JOB_LABEL_CARDINALITY_LIMIT) return OVERFLOW_LABEL
    this.seenJobIds.add(jobConfigId)
    return jobConfigId
  }

  /** Test seam — resets the in-memory cardinality tracker (does NOT reset counters). */
  resetCardinalityTracker(): void {
    this.seenJobIds.clear()
  }
}
