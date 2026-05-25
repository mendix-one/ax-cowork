import { createHmac } from 'crypto'

import { UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ObjectId } from 'mongodb'

import type { JobConfigDoc } from '../../domain/job-config'
import type { SecretsService } from '../../domain/secret'
import { WebhookSignatureVerifier } from './webhook-signature.verifier'

const SECRET_PLAINTEXT = 'super-shared-secret-value'
const SECRET_ID = new ObjectId()

const signedJob: JobConfigDoc = {
  _id: new ObjectId(),
  name: 'wh-signed',
  enabled: true,
  source: { type: 'webhook', config: { secretRef: SECRET_ID.toHexString() } },
  schedule: {},
  identity: { strategy: 'hash', fields: [], acknowledgeHashSemantics: true },
  options: { detectDeleted: true, auditChanges: true },
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 'test',
}

const openJob: JobConfigDoc = {
  ...signedJob,
  source: { type: 'webhook', config: {} },
}

function buildVerifier(opts: { skewSec?: number; reveal?: () => Promise<string> } = {}) {
  const reveal = opts.reveal ?? (() => Promise.resolve(SECRET_PLAINTEXT))
  const revealMock = jest.fn().mockImplementation(reveal)
  const secrets = { revealPlaintext: revealMock } as unknown as SecretsService
  const config = { get: jest.fn().mockReturnValue(opts.skewSec ?? 300) } as unknown as ConfigService
  const verifier = new WebhookSignatureVerifier(secrets, config)
  return { verifier, revealMock }
}

function sign(body: Buffer, key = SECRET_PLAINTEXT): string {
  return createHmac('sha256', key).update(body).digest('hex')
}

describe('WebhookSignatureVerifier', () => {
  const rawBody = Buffer.from(JSON.stringify({ event: 'x' }))

  it('passes when signature matches the body', async () => {
    const { verifier } = buildVerifier()
    await expect(verifier.verify({ jobConfig: signedJob, rawBody, signature: sign(rawBody), timestamp: undefined })).resolves.toBeUndefined()
  })

  it('throws 401 when the signature header is missing', async () => {
    const { verifier } = buildVerifier()
    await expect(verifier.verify({ jobConfig: signedJob, rawBody, signature: undefined, timestamp: undefined })).rejects.toBeInstanceOf(UnauthorizedException)
  })

  it('throws 401 when the body is tampered after signing', async () => {
    const { verifier } = buildVerifier()
    const sig = sign(rawBody)
    const mutated = Buffer.from(rawBody.toString() + ' ')
    await expect(verifier.verify({ jobConfig: signedJob, rawBody: mutated, signature: sig, timestamp: undefined })).rejects.toThrow(/signature mismatch/i)
  })

  it('throws 401 when the signature is wrong length (no timingSafeEqual throw)', async () => {
    const { verifier } = buildVerifier()
    await expect(verifier.verify({ jobConfig: signedJob, rawBody, signature: 'deadbeef', timestamp: undefined })).rejects.toBeInstanceOf(UnauthorizedException)
  })

  it('open webhook (no secretRef) bypasses verification entirely', async () => {
    const { verifier, revealMock } = buildVerifier()
    await verifier.verify({ jobConfig: openJob, rawBody, signature: undefined, timestamp: undefined })
    expect(revealMock).not.toHaveBeenCalled()
  })

  it('rejects with 401 if secretRef points at a missing secret', async () => {
    const { verifier } = buildVerifier({ reveal: () => Promise.reject(new Error('not found')) })
    await expect(verifier.verify({ jobConfig: signedJob, rawBody, signature: sign(rawBody), timestamp: undefined })).rejects.toBeInstanceOf(
      UnauthorizedException,
    )
  })

  it('rejects with 401 if source.config.secretRef is malformed (historic data drift)', async () => {
    const drifted: JobConfigDoc = { ...signedJob, source: { type: 'webhook', config: { secretRef: 'not-a-mongo-id' } } }
    const { verifier } = buildVerifier()
    await expect(verifier.verify({ jobConfig: drifted, rawBody, signature: sign(rawBody), timestamp: undefined })).rejects.toBeInstanceOf(UnauthorizedException)
  })

  describe('replay protection', () => {
    it('passes when timestamp is within the skew window', async () => {
      const { verifier } = buildVerifier({ skewSec: 60 })
      const ts = String(Math.floor(Date.now() / 1000))
      await expect(verifier.verify({ jobConfig: signedJob, rawBody, signature: sign(rawBody), timestamp: ts })).resolves.toBeUndefined()
    })

    it('rejects 401 when timestamp is older than the skew window', async () => {
      const { verifier } = buildVerifier({ skewSec: 60 })
      const stale = String(Math.floor(Date.now() / 1000) - 600)
      await expect(verifier.verify({ jobConfig: signedJob, rawBody, signature: sign(rawBody), timestamp: stale })).rejects.toThrow(/skew window/)
    })

    it('rejects 401 when timestamp is in the far future', async () => {
      const { verifier } = buildVerifier({ skewSec: 60 })
      const future = String(Math.floor(Date.now() / 1000) + 600)
      await expect(verifier.verify({ jobConfig: signedJob, rawBody, signature: sign(rawBody), timestamp: future })).rejects.toThrow(/skew window/)
    })

    it('rejects 401 when timestamp header is non-numeric', async () => {
      const { verifier } = buildVerifier({ skewSec: 60 })
      await expect(verifier.verify({ jobConfig: signedJob, rawBody, signature: sign(rawBody), timestamp: 'not-a-number' })).rejects.toThrow(/malformed/)
    })

    it('tolerates missing timestamp header (signature alone is enough)', async () => {
      const { verifier } = buildVerifier({ skewSec: 60 })
      await expect(verifier.verify({ jobConfig: signedJob, rawBody, signature: sign(rawBody), timestamp: undefined })).resolves.toBeUndefined()
    })

    it('SKEW_SEC=0 disables the timestamp check even when header is stale', async () => {
      const { verifier } = buildVerifier({ skewSec: 0 })
      const stale = String(Math.floor(Date.now() / 1000) - 999_999)
      await expect(verifier.verify({ jobConfig: signedJob, rawBody, signature: sign(rawBody), timestamp: stale })).resolves.toBeUndefined()
    })
  })
})
