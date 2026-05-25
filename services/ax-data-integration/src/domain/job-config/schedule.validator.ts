import { BadRequestException } from '@nestjs/common'

import { isPushSourceType, type JobConfigSchedule, type JobConfigSource } from './job-config.schema'

/**
 * Cross-field rule between `source.type` and `schedule.cronExpression`:
 *
 * - Pull-based sources (file, DB, REST, GraphQL, SOAP, …) MUST declare a `cronExpression`. The scheduler
 *   needs it to register a cron job. Missing → BadRequest.
 * - Push-based sources (webhook, MQTT, …) MAY omit `cronExpression`. When present it is preserved but
 *   ignored by the scheduler (T2-B05 skips registration for cron-less jobs).
 *
 * Thrown errors carry a field-level message so the controller's BadRequestException response is
 * actionable.
 */
export function validateScheduleForSource(source: JobConfigSource, schedule: JobConfigSchedule): void {
  const cron = schedule.cronExpression
  if (isPushSourceType(source.type)) return
  if (typeof cron !== 'string' || cron.trim().length === 0) {
    throw new BadRequestException(`schedule.cronExpression is required for source.type='${source.type}' (only push-based sources may omit it)`)
  }
}
