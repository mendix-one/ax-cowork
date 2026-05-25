import { BadRequestException } from '@nestjs/common'

import { parseWebhookBody } from './webhook-body.parser'

describe('parseWebhookBody', () => {
  describe('eventField absent (single-record mode)', () => {
    it('wraps a JSON object into a one-element array', () => {
      expect(parseWebhookBody({ id: 1, name: 'a' }, {})).toEqual([{ id: 1, name: 'a' }])
    })

    it('rejects a top-level array', () => {
      expect(() => parseWebhookBody([{ id: 1 }], {})).toThrow(BadRequestException)
    })

    it('rejects a primitive body', () => {
      expect(() => parseWebhookBody('hello', {})).toThrow(BadRequestException)
      expect(() => parseWebhookBody(42, {})).toThrow(BadRequestException)
      expect(() => parseWebhookBody(true, {})).toThrow(BadRequestException)
    })

    it('rejects null', () => {
      expect(() => parseWebhookBody(null, {})).toThrow(BadRequestException)
    })
  })

  describe('eventField present (array-extraction mode)', () => {
    it('returns body[eventField] when it is an array of objects', () => {
      const out = parseWebhookBody({ events: [{ id: 1 }, { id: 2 }] }, { eventField: 'events' })
      expect(out).toEqual([{ id: 1 }, { id: 2 }])
    })

    it('rejects when body[eventField] is missing', () => {
      expect(() => parseWebhookBody({ other: 1 }, { eventField: 'events' })).toThrow(/must be an array/)
    })

    it('rejects when body[eventField] is not an array', () => {
      expect(() => parseWebhookBody({ events: { id: 1 } }, { eventField: 'events' })).toThrow(/must be an array/)
    })

    it('rejects when an element of the array is not a plain object', () => {
      expect(() => parseWebhookBody({ events: [{ id: 1 }, 'oops'] }, { eventField: 'events' })).toThrow(/events\[1\] must be a JSON object/)
    })

    it('rejects when the outer body is not a JSON object', () => {
      expect(() => parseWebhookBody([1, 2, 3], { eventField: 'events' })).toThrow(BadRequestException)
    })

    it('treats empty-string eventField as unset (single-record mode)', () => {
      expect(parseWebhookBody({ id: 1 }, { eventField: '' })).toEqual([{ id: 1 }])
    })

    it('returns an empty array when body[eventField] is []', () => {
      expect(parseWebhookBody({ events: [] }, { eventField: 'events' })).toEqual([])
    })
  })
})
