import { BadRequestException, Logger } from '@nestjs/common'

import { validateJobConfigIdentity } from './identity.validator'
import type { JobConfigIdentity, JobConfigSource } from './job-config.schema'

const restSource: JobConfigSource = { type: 'rest', config: {} }
const excelSource: JobConfigSource = { type: 'excel', config: {} }
const postgresSource: JobConfigSource = { type: 'postgres', config: {} }

describe('validateJobConfigIdentity', () => {
  describe('primary-key', () => {
    it('accepts exactly 1 field', () => {
      expect(() => validateJobConfigIdentity(restSource, { strategy: 'primary-key', fields: ['id'] })).not.toThrow()
    })
    it('rejects 0 fields', () => {
      expect(() => validateJobConfigIdentity(restSource, { strategy: 'primary-key', fields: [] })).toThrow(BadRequestException)
    })
    it('rejects more than 1 field (use composite instead)', () => {
      expect(() => validateJobConfigIdentity(restSource, { strategy: 'primary-key', fields: ['a', 'b'] })).toThrow(/exactly 1 field/)
    })
  })

  describe('composite', () => {
    it('accepts 2 or more fields', () => {
      expect(() => validateJobConfigIdentity(restSource, { strategy: 'composite', fields: ['a', 'b'] })).not.toThrow()
      expect(() => validateJobConfigIdentity(restSource, { strategy: 'composite', fields: ['a', 'b', 'c'] })).not.toThrow()
    })
    it('rejects fewer than 2 fields', () => {
      expect(() => validateJobConfigIdentity(restSource, { strategy: 'composite', fields: ['only'] })).toThrow(/at least 2 fields/)
      expect(() => validateJobConfigIdentity(restSource, { strategy: 'composite', fields: [] })).toThrow(/at least 2 fields/)
    })
  })

  describe('hash', () => {
    it('requires explicit acknowledgeHashSemantics=true', () => {
      const identity: JobConfigIdentity = { strategy: 'hash', fields: [] }
      expect(() => validateJobConfigIdentity(restSource, identity)).toThrow(/acknowledgeHashSemantics/)
    })
    it('rejects acknowledge=false', () => {
      const identity: JobConfigIdentity = { strategy: 'hash', fields: [], acknowledgeHashSemantics: false }
      expect(() => validateJobConfigIdentity(restSource, identity)).toThrow(/acknowledgeHashSemantics/)
    })
    it('accepts when acknowledge=true', () => {
      const identity: JobConfigIdentity = { strategy: 'hash', fields: [], acknowledgeHashSemantics: true }
      expect(() => validateJobConfigIdentity(restSource, identity)).not.toThrow()
    })
    it('emits a warn log when accepted', () => {
      const warn = jest.fn()
      const logger = { warn } as unknown as Logger
      const identity: JobConfigIdentity = { strategy: 'hash', fields: [], acknowledgeHashSemantics: true }
      validateJobConfigIdentity(restSource, identity, logger)
      expect(warn).toHaveBeenCalledTimes(1)
      const args = warn.mock.calls[0] as unknown[]
      expect(args[0]).toMatch(/insert\+delete/)
    })
  })

  describe('row-number', () => {
    it('accepts excel and csv sources', () => {
      const identity: JobConfigIdentity = { strategy: 'row-number', fields: [] }
      expect(() => validateJobConfigIdentity(excelSource, identity)).not.toThrow()
      expect(() => validateJobConfigIdentity({ type: 'csv', config: {} }, identity)).not.toThrow()
    })
    it('rejects DB sources', () => {
      const identity: JobConfigIdentity = { strategy: 'row-number', fields: [] }
      expect(() => validateJobConfigIdentity(postgresSource, identity)).toThrow(/only valid for file sources/)
    })
    it('rejects REST API sources', () => {
      const identity: JobConfigIdentity = { strategy: 'row-number', fields: [] }
      expect(() => validateJobConfigIdentity(restSource, identity)).toThrow(/only valid for file sources/)
    })
  })
})
