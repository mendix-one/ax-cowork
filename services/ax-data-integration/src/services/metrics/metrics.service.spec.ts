import { Registry } from 'prom-client'

import { JOB_LABEL_CARDINALITY_LIMIT, MetricsService } from './metrics.service'

describe('MetricsService', () => {
  let registry: Registry
  let service: MetricsService

  beforeEach(() => {
    registry = new Registry()
    service = new MetricsService(registry)
  })

  it('registers the three sync_run metric families on construction', async () => {
    const text = await registry.metrics()
    expect(text).toContain('# HELP sync_run_total')
    expect(text).toContain('# HELP sync_run_duration_seconds')
    expect(text).toContain('# HELP sync_run_records_total')
  })

  it('observeSyncRunCompleted increments the counter + histogram + per-op records counter', async () => {
    service.observeSyncRunCompleted({
      jobConfigId: 'job-1',
      status: 'success',
      durationMs: 2_500,
      counts: { read: 5, inserted: 3, updated: 1, unchanged: 1, deleted: 0, errors: 0 },
    })

    const text = await registry.metrics()
    expect(text).toContain('sync_run_total{status="success",jobConfigId="job-1"} 1')
    expect(text).toContain('sync_run_duration_seconds_bucket')
    expect(text).toContain('sync_run_duration_seconds_sum{status="success",jobConfigId="job-1"} 2.5')
    expect(text).toContain('sync_run_records_total{op="inserted",jobConfigId="job-1"} 3')
    expect(text).toContain('sync_run_records_total{op="updated",jobConfigId="job-1"} 1')
    expect(text).toContain('sync_run_records_total{op="unchanged",jobConfigId="job-1"} 1')
  })

  it('does not emit a sample for an op with zero count (keeps /metrics small)', async () => {
    service.observeSyncRunCompleted({
      jobConfigId: 'job-2',
      status: 'success',
      durationMs: 100,
      counts: { read: 0, inserted: 0, updated: 0, unchanged: 0, deleted: 0, errors: 0 },
    })

    const text = await registry.metrics()
    expect(text).not.toContain('sync_run_records_total{op="inserted",jobConfigId="job-2"}')
  })

  it('cardinality guard collapses distinct jobConfigIds beyond the limit to "overflow"', () => {
    for (let i = 0; i < JOB_LABEL_CARDINALITY_LIMIT; i++) {
      expect(service.observeJobLabel(`job-${i}`)).toBe(`job-${i}`)
    }
    expect(service.observeJobLabel('one-too-many')).toBe('overflow')
    // Already-seen IDs continue to report under their real label.
    expect(service.observeJobLabel('job-0')).toBe('job-0')
  })

  it('cardinality guard does NOT mutate the underlying counter call shape (overflow still records)', async () => {
    for (let i = 0; i < JOB_LABEL_CARDINALITY_LIMIT; i++) {
      service.observeJobLabel(`pre-${i}`)
    }
    service.observeSyncRunCompleted({
      jobConfigId: 'late-1',
      status: 'success',
      durationMs: 50,
      counts: { read: 1, inserted: 1, updated: 0, unchanged: 0, deleted: 0, errors: 0 },
    })

    const text = await registry.metrics()
    expect(text).toContain('sync_run_total{status="success",jobConfigId="overflow"} 1')
  })

  it('resetCardinalityTracker clears the seen-ids set without touching counter state', async () => {
    service.observeSyncRunCompleted({
      jobConfigId: 'will-survive-reset',
      status: 'success',
      durationMs: 10,
      counts: { read: 1, inserted: 1, updated: 0, unchanged: 0, deleted: 0, errors: 0 },
    })

    service.resetCardinalityTracker()

    const text = await registry.metrics()
    // Counter values survive — only the cardinality-guard memory is reset.
    expect(text).toContain('sync_run_total{status="success",jobConfigId="will-survive-reset"} 1')
  })
})
