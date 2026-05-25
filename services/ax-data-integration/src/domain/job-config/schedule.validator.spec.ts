import { BadRequestException } from '@nestjs/common'

import type { JobConfigSchedule, JobConfigSource } from './job-config.schema'
import { validateScheduleForSource } from './schedule.validator'

const cron: JobConfigSchedule = { cronExpression: '0 * * * *' }
const noCron: JobConfigSchedule = {}

const rest: JobConfigSource = { type: 'rest', config: {} }
const excel: JobConfigSource = { type: 'excel', config: {} }
const postgres: JobConfigSource = { type: 'postgres', config: {} }
const webhook: JobConfigSource = { type: 'webhook', config: {} }

describe('validateScheduleForSource', () => {
  describe('pull-based sources', () => {
    it('accepts when cronExpression is set', () => {
      expect(() => validateScheduleForSource(rest, cron)).not.toThrow()
      expect(() => validateScheduleForSource(excel, cron)).not.toThrow()
      expect(() => validateScheduleForSource(postgres, cron)).not.toThrow()
    })
    it('rejects when cronExpression is missing', () => {
      expect(() => validateScheduleForSource(rest, noCron)).toThrow(BadRequestException)
      expect(() => validateScheduleForSource(rest, noCron)).toThrow(/required for source\.type='rest'/)
    })
    it('rejects when cronExpression is blank', () => {
      expect(() => validateScheduleForSource(rest, { cronExpression: '   ' })).toThrow(BadRequestException)
    })
  })

  describe('push-based sources (webhook)', () => {
    it('accepts when cronExpression is missing', () => {
      expect(() => validateScheduleForSource(webhook, noCron)).not.toThrow()
    })
    it('accepts when cronExpression is provided (preserved but unused by scheduler)', () => {
      expect(() => validateScheduleForSource(webhook, cron)).not.toThrow()
    })
  })
})
