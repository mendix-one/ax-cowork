import { NotFoundException, UnauthorizedException } from '@nestjs/common'
import { ObjectId } from 'mongodb'

import type { JobConfigRepository, JobConfigDoc } from '../../domain/job-config'
import { WebhookController } from './webhook.controller'
import type { WebhookIngestionInput, WebhookIngestionService } from './webhook-ingestion.service'
import type { WebhookSignatureVerifier } from './webhook-signature.verifier'

interface MockRequest {
  headers: Record<string, string | string[] | undefined>
}

const webhookJob = (overrides: Partial<JobConfigDoc> = {}): JobConfigDoc => ({
  _id: new ObjectId(),
  name: 'wh-sample',
  enabled: true,
  source: { type: 'webhook', config: {} },
  schedule: {},
  identity: { strategy: 'hash', fields: [], acknowledgeHashSemantics: true },
  options: { detectDeleted: true, auditChanges: true },
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 'test',
  ...overrides,
})

function setup(jobDoc: JobConfigDoc | null) {
  const findById = jest.fn().mockResolvedValue(jobDoc)
  const ingest = jest.fn<Promise<{ runId: ObjectId }>, [WebhookIngestionInput]>().mockImplementation((input) => {
    void input
    return Promise.resolve({ runId: new ObjectId() })
  })
  const verify = jest.fn<Promise<void>, [unknown]>().mockResolvedValue(undefined)
  const repo = { findById } as unknown as JobConfigRepository
  const ingestion = { ingest } as unknown as WebhookIngestionService
  const verifier = { verify } as unknown as WebhookSignatureVerifier
  const controller = new WebhookController(repo, ingestion, verifier)
  return { controller, findById, ingest, verify }
}

describe('WebhookController', () => {
  const id = new ObjectId()
  const body = { event: 'created', id: 1 }
  const rawBody = Buffer.from(JSON.stringify(body))

  it('throws 404 when no job_config exists for the id', async () => {
    const { controller } = setup(null)
    const req = { headers: {} }
    await expect(controller.receive(id, body, rawBody, req as never)).rejects.toBeInstanceOf(NotFoundException)
  })

  it('throws 404 when the job_config exists but source.type !== "webhook"', async () => {
    const job = webhookJob({ source: { type: 'rest', config: {} } })
    const { controller } = setup(job)
    const req = { headers: {} }
    await expect(controller.receive(id, body, rawBody, req as never)).rejects.toBeInstanceOf(NotFoundException)
  })

  it('returns the ingestion runId as hex on success', async () => {
    const ingestionRunId = new ObjectId()
    const { controller, ingest } = setup(webhookJob())
    ingest.mockResolvedValueOnce({ runId: ingestionRunId })
    const req = { headers: {} }
    const res = await controller.receive(id, body, rawBody, req as never)
    expect(res).toEqual({ runId: ingestionRunId.toHexString() })
  })

  it('forwards rawBody verbatim and falls back to an empty Buffer when undefined', async () => {
    const { controller, ingest } = setup(webhookJob())
    const req = { headers: {} }
    await controller.receive(id, body, undefined, req as never)
    const call = ingest.mock.calls[0][0]
    expect(Buffer.isBuffer(call.rawBody)).toBe(true)
    expect(call.rawBody.length).toBe(0)
  })

  it('passes the parsed body and the resolved jobConfig through to the ingestion service', async () => {
    const job = webhookJob()
    const { controller, ingest } = setup(job)
    const req = { headers: {} }
    await controller.receive(id, body, rawBody, req as never)
    const call = ingest.mock.calls[0][0]
    expect(call.jobConfig).toBe(job)
    expect(call.body).toBe(body)
    expect(call.rawBody).toBe(rawBody)
  })

  it('reads the configured signature header (case-insensitive)', async () => {
    const job = webhookJob({ source: { type: 'webhook', config: { signatureHeader: 'X-Signature' } } })
    const { controller, ingest } = setup(job)
    const req: MockRequest = { headers: { 'x-signature': 'sig-value' } }
    await controller.receive(id, body, rawBody, req as never)
    expect(ingest.mock.calls[0][0].signatureHeader).toBe('sig-value')
  })

  it('defaults the signature header lookup to x-webhook-signature', async () => {
    const { controller, ingest } = setup(webhookJob())
    const req: MockRequest = { headers: { 'x-webhook-signature': 'default-sig' } }
    await controller.receive(id, body, rawBody, req as never)
    expect(ingest.mock.calls[0][0].signatureHeader).toBe('default-sig')
  })

  it('passes signatureHeader=undefined when the header is absent', async () => {
    const { controller, ingest } = setup(webhookJob())
    const req: MockRequest = { headers: {} }
    await controller.receive(id, body, rawBody, req as never)
    expect(ingest.mock.calls[0][0].signatureHeader).toBeUndefined()
  })

  it('picks the first value when the signature header arrives as an array', async () => {
    const { controller, ingest } = setup(webhookJob())
    const req: MockRequest = { headers: { 'x-webhook-signature': ['first', 'second'] } }
    await controller.receive(id, body, rawBody, req as never)
    expect(ingest.mock.calls[0][0].signatureHeader).toBe('first')
  })

  describe('signature verification (T2-B03)', () => {
    it('runs the verifier BEFORE the ingestion service', async () => {
      const calls: string[] = []
      const { controller, ingest, verify } = setup(webhookJob())
      verify.mockImplementationOnce(async () => {
        calls.push('verify')
        await Promise.resolve()
      })
      ingest.mockImplementationOnce(async (input) => {
        calls.push('ingest')
        void input
        await Promise.resolve()
        return { runId: new ObjectId() }
      })
      const req: MockRequest = { headers: { 'x-webhook-signature': 'sig' } }
      await controller.receive(id, body, rawBody, req as never)
      expect(calls).toEqual(['verify', 'ingest'])
    })

    it('skips the ingestion call when the verifier throws', async () => {
      const { controller, ingest, verify } = setup(webhookJob())
      verify.mockRejectedValueOnce(new UnauthorizedException('bad sig'))
      const req: MockRequest = { headers: { 'x-webhook-signature': 'bogus' } }
      await expect(controller.receive(id, body, rawBody, req as never)).rejects.toBeInstanceOf(UnauthorizedException)
      expect(ingest).not.toHaveBeenCalled()
    })

    it('forwards the timestamp header to the verifier', async () => {
      const { controller, verify } = setup(webhookJob())
      const req: MockRequest = { headers: { 'x-webhook-timestamp': '1700000000', 'x-webhook-signature': 'sig' } }
      await controller.receive(id, body, rawBody, req as never)
      const call = verify.mock.calls[0][0] as { timestamp: string | undefined; signature: string | undefined }
      expect(call.timestamp).toBe('1700000000')
      expect(call.signature).toBe('sig')
    })
  })
})
