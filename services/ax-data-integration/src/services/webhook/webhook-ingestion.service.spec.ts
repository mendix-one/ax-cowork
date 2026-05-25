import { BadRequestException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ObjectId } from 'mongodb'

import type { JobConfigDoc } from '../../domain/job-config'
import type { SourceMetadataRepository } from '../../domain/source-metadata'
import { ZERO_COUNTS, type SyncRunDoc, type SyncRunRepository } from '../../domain/sync-run'
import type { RecordClassifierService } from '../../workers/record-classifier.service'
import { SYNC_RUN_COMPLETED_EVENT } from '../../workers/sync-executor.service'
import type { MetricsService } from '../metrics'
import { WebhookIngestionService } from './webhook-ingestion.service'

interface FinalizeArg {
  status: 'running' | 'success' | 'partial' | 'failed' | 'stale'
  counts: { read: number; inserted: number; updated: number; unchanged: number; deleted: number; errors: number }
  errors?: unknown[]
  finishedAt: Date
}

const baseJob = (overrides: Partial<JobConfigDoc> = {}): JobConfigDoc => ({
  _id: new ObjectId(),
  name: 'wh',
  enabled: true,
  source: { type: 'webhook', config: {} },
  schedule: {},
  identity: { strategy: 'hash', fields: [], acknowledgeHashSemantics: true },
  options: { detectDeleted: false, auditChanges: true },
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 'test',
  ...overrides,
})

function setup(
  opts: {
    jobOverrides?: Partial<JobConfigDoc>
    classifierImpl?: jest.Mock
    insertIfNewImpl?: jest.Mock
    emitter?: EventEmitter2
    metrics?: MetricsService
  } = {},
) {
  const job = baseJob(opts.jobOverrides)
  const runId = new ObjectId()
  const startedAt = new Date(Date.now() - 100)
  const runDoc: SyncRunDoc = {
    _id: runId,
    jobConfigId: job._id,
    triggeredBy: 'webhook',
    status: 'running',
    startedAt,
    heartbeatAt: startedAt,
    workerId: 'test-host:1',
    counts: { ...ZERO_COUNTS },
    errors: [],
    createdAt: startedAt,
  }
  const insertRunning = jest.fn<Promise<SyncRunDoc>, [unknown]>().mockResolvedValue(runDoc)
  const finalize = jest.fn<Promise<SyncRunDoc>, [ObjectId, FinalizeArg]>().mockResolvedValue(runDoc)
  const insertIfNew = opts.insertIfNewImpl ?? jest.fn().mockResolvedValue(new ObjectId())
  const classifyAndWrite = opts.classifierImpl ?? jest.fn().mockResolvedValue(undefined)
  const flushChangelog = jest.fn<Promise<void>, [unknown, unknown]>().mockResolvedValue(undefined)

  const runs = { insertRunning, finalize } as unknown as SyncRunRepository
  const sourceMetadata = { insertIfNew } as unknown as SourceMetadataRepository
  const classifier = { classifyAndWrite, flushChangelog } as unknown as RecordClassifierService

  const service = new WebhookIngestionService(runs, sourceMetadata, classifier, opts.metrics, opts.emitter)
  return { service, job, runId, insertRunning, finalize, insertIfNew, classifyAndWrite, flushChangelog }
}

describe('WebhookIngestionService.ingest', () => {
  it('parses single-record body, creates one sync_run, calls classifier once, finalizes success', async () => {
    const { service, job, runId, insertRunning, classifyAndWrite, finalize, flushChangelog } = setup()
    const res = await service.ingest({ jobConfig: job, body: { id: 1 }, rawBody: Buffer.alloc(0), signatureHeader: undefined })
    expect(res.runId.equals(runId)).toBe(true)
    expect(insertRunning).toHaveBeenCalledWith(expect.objectContaining({ jobConfigId: job._id, triggeredBy: 'webhook' }))
    expect(classifyAndWrite).toHaveBeenCalledTimes(1)
    expect(flushChangelog).toHaveBeenCalledTimes(1)
    const arg = finalize.mock.calls[0][1]
    expect(arg.status).toBe('success')
    expect(arg.counts.read).toBe(1)
  })

  it('with eventField, splits into N records and calls classifier per record', async () => {
    const job = baseJob({ source: { type: 'webhook', config: { eventField: 'events' } } })
    const { service, classifyAndWrite, finalize, runId } = setup({ jobOverrides: { source: job.source } })
    await service.ingest({
      jobConfig: job,
      body: { events: [{ id: 1 }, { id: 2 }, { id: 3 }] },
      rawBody: Buffer.alloc(0),
      signatureHeader: undefined,
    })
    expect(classifyAndWrite).toHaveBeenCalledTimes(3)
    expect(finalize.mock.calls[0][0]).toEqual(runId)
    expect(finalize.mock.calls[0][1].counts.read).toBe(3)
  })

  it('BadRequestException from parser propagates and does NOT create a sync_run', async () => {
    const { service, insertRunning } = setup()
    await expect(service.ingest({ jobConfig: baseJob(), body: 'not-an-object', rawBody: Buffer.alloc(0), signatureHeader: undefined })).rejects.toBeInstanceOf(
      BadRequestException,
    )
    expect(insertRunning).not.toHaveBeenCalled()
  })

  it('per-record classifier failure accumulates errors and finalizes as partial when under threshold', async () => {
    let call = 0
    const classifyAndWrite = jest.fn().mockImplementation(async () => {
      call++
      await Promise.resolve()
      if (call === 2) throw new Error('boom')
    })
    const { service, finalize } = setup({
      jobOverrides: {
        source: { type: 'webhook', config: { eventField: 'events' } },
        options: { detectDeleted: false, auditChanges: false, errorThreshold: 100 },
      },
      classifierImpl: classifyAndWrite,
    })
    const job = baseJob({
      source: { type: 'webhook', config: { eventField: 'events' } },
      options: { detectDeleted: false, auditChanges: false, errorThreshold: 100 },
    })
    await service.ingest({ jobConfig: job, body: { events: [{ id: 1 }, { id: 2 }, { id: 3 }] }, rawBody: Buffer.alloc(0), signatureHeader: undefined })
    expect(classifyAndWrite).toHaveBeenCalledTimes(3)
    const finalizeArg = finalize.mock.calls[0][1]
    expect(finalizeArg.status).toBe('partial')
    expect(finalizeArg.counts.errors).toBe(1)
    expect(finalizeArg.errors).toHaveLength(1)
  })

  it('aborts and finalizes as failed when error count reaches errorThreshold', async () => {
    const classifyAndWrite = jest.fn().mockRejectedValue(new Error('always fails'))
    const job = baseJob({
      source: { type: 'webhook', config: { eventField: 'events' } },
      options: { detectDeleted: false, auditChanges: false, errorThreshold: 2 },
    })
    const { service, finalize } = setup({ jobOverrides: { source: job.source, options: job.options }, classifierImpl: classifyAndWrite })
    await service.ingest({
      jobConfig: job,
      body: { events: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }] },
      rawBody: Buffer.alloc(0),
      signatureHeader: undefined,
    })
    expect(classifyAndWrite).toHaveBeenCalledTimes(2) // aborts before record 3
    const finalizeArg = finalize.mock.calls[0][1]
    expect(finalizeArg.status).toBe('failed')
  })

  it('schema persistence failure does NOT abort the run (best-effort)', async () => {
    const insertIfNew = jest.fn().mockRejectedValue(new Error('mongo down'))
    const { service, finalize, classifyAndWrite } = setup({ insertIfNewImpl: insertIfNew })
    await service.ingest({ jobConfig: baseJob(), body: { id: 1 }, rawBody: Buffer.alloc(0), signatureHeader: undefined })
    expect(insertIfNew).toHaveBeenCalled()
    expect(classifyAndWrite).toHaveBeenCalledTimes(1)
    const finalizeArg = finalize.mock.calls[0][1]
    expect(finalizeArg.status).toBe('success')
  })

  it('emits SYNC_RUN_COMPLETED_EVENT with triggeredBy="webhook"', async () => {
    const emitter = new EventEmitter2()
    const heard: unknown[] = []
    emitter.on(SYNC_RUN_COMPLETED_EVENT, (p) => heard.push(p))
    const { service, runId } = setup({ emitter })
    await service.ingest({ jobConfig: baseJob(), body: { id: 1 }, rawBody: Buffer.alloc(0), signatureHeader: undefined })
    expect(heard).toHaveLength(1)
    expect(heard[0]).toMatchObject({ triggeredBy: 'webhook', syncRunId: runId, status: 'success' })
  })

  it('observes metrics with triggeredBy-agnostic shape (uses sync run status + counts)', async () => {
    interface ObservedArg {
      status: string
      counts: { read: number; inserted: number }
    }
    const observe = jest.fn<void, [ObservedArg]>()
    const metrics = { observeSyncRunCompleted: observe } as unknown as MetricsService
    const { service } = setup({ metrics })
    await service.ingest({ jobConfig: baseJob(), body: { id: 1 }, rawBody: Buffer.alloc(0), signatureHeader: undefined })
    const observed = observe.mock.calls[0][0]
    expect(observed.status).toBe('success')
    expect(observed.counts.read).toBe(1)
    expect(observed.counts.inserted).toBe(0)
  })

  it('flushes the changelog buffer once at end of loop', async () => {
    const { service, flushChangelog } = setup()
    await service.ingest({ jobConfig: baseJob(), body: { id: 1 }, rawBody: Buffer.alloc(0), signatureHeader: undefined })
    expect(flushChangelog).toHaveBeenCalledTimes(1)
  })
})
