import { BadRequestException, Logger } from '@nestjs/common'

import type { JobConfigSource } from './job-config.schema'
import { resolveWebhookSignatureHeader, validateWebhookSourceConfig } from './webhook-source.validator'

const webhook = (config: Record<string, unknown>): JobConfigSource => ({ type: 'webhook', config })
const restSource: JobConfigSource = { type: 'rest', config: { secretRef: 'this would be ignored' } }

describe('validateWebhookSourceConfig', () => {
  it('is a no-op for non-webhook sources', () => {
    expect(() => validateWebhookSourceConfig(restSource)).not.toThrow()
  })

  it('accepts an empty config (open webhook with default header)', () => {
    const warn = jest.fn()
    const logger = { warn } as unknown as Logger
    expect(() => validateWebhookSourceConfig(webhook({}), logger)).not.toThrow()
    // Open-webhook warning logged so operators can spot it in service logs.
    expect(warn).toHaveBeenCalledTimes(1)
    const args = warn.mock.calls[0] as unknown[]
    expect(args[0]).toMatch(/open webhook/i)
  })

  it('accepts a complete config', () => {
    const cfg = { secretRef: '507f1f77bcf86cd799439011', signatureHeader: 'x-signature', eventField: 'data' }
    expect(() => validateWebhookSourceConfig(webhook(cfg))).not.toThrow()
  })

  it('rejects unknown keys', () => {
    expect(() => validateWebhookSourceConfig(webhook({ secret_ref: 'typo' }))).toThrow(/not a recognised webhook config field/)
  })

  describe('secretRef', () => {
    it('rejects non-string', () => {
      expect(() => validateWebhookSourceConfig(webhook({ secretRef: 42 }))).toThrow(BadRequestException)
    })
    it('rejects malformed ObjectId', () => {
      expect(() => validateWebhookSourceConfig(webhook({ secretRef: 'not-a-mongo-id' }))).toThrow(/24-hex/)
    })
    it('accepts valid 24-hex ObjectId', () => {
      expect(() => validateWebhookSourceConfig(webhook({ secretRef: '507f1f77bcf86cd799439011' }))).not.toThrow()
    })
    it('does NOT warn when secretRef is present', () => {
      const warn = jest.fn()
      const logger = { warn } as unknown as Logger
      validateWebhookSourceConfig(webhook({ secretRef: '507f1f77bcf86cd799439011' }), logger)
      expect(warn).not.toHaveBeenCalled()
    })
  })

  describe('signatureHeader', () => {
    it('rejects empty string', () => {
      expect(() => validateWebhookSourceConfig(webhook({ signatureHeader: '' }))).toThrow(/non-empty/)
    })
    it('rejects whitespace-only', () => {
      expect(() => validateWebhookSourceConfig(webhook({ signatureHeader: '   ' }))).toThrow(/non-empty/)
    })
    it('rejects non-string', () => {
      expect(() => validateWebhookSourceConfig(webhook({ signatureHeader: true }))).toThrow(BadRequestException)
    })
  })

  describe('eventField', () => {
    it('rejects empty string', () => {
      expect(() => validateWebhookSourceConfig(webhook({ eventField: '' }))).toThrow(/non-empty/)
    })
    it('rejects non-string', () => {
      expect(() => validateWebhookSourceConfig(webhook({ eventField: ['data'] }))).toThrow(BadRequestException)
    })
  })
})

describe('resolveWebhookSignatureHeader', () => {
  it('returns the configured header when set', () => {
    expect(resolveWebhookSignatureHeader({ signatureHeader: 'x-foo' })).toBe('x-foo')
  })
  it('falls back to the default for missing config', () => {
    expect(resolveWebhookSignatureHeader(undefined)).toBe('x-webhook-signature')
  })
  it('falls back to the default for blank values', () => {
    expect(resolveWebhookSignatureHeader({ signatureHeader: '   ' })).toBe('x-webhook-signature')
  })
})
