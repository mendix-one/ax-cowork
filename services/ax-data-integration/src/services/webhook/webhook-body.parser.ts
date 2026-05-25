import { BadRequestException } from '@nestjs/common'

import type { WebhookSourceConfig } from '../../domain/job-config'

/**
 * Parses the inbound webhook body into an array of records based on `source.config.eventField`:
 *
 *   - `eventField` ABSENT — body itself is one record. Must be a plain JSON object (not array,
 *     not primitive). Returns `[body]`.
 *   - `eventField` PRESENT — body must be a plain JSON object, and `body[eventField]` must be an
 *     array of plain JSON objects. Returns that array.
 *
 * Throws `BadRequestException` (→ 400) on any structural mismatch so the caller can fail fast
 * BEFORE we create a `sync_run`. The 400 distinguishes "malformed payload" from authentication
 * failures (T2-B03 returns 401) and from infrastructure errors (500). The body bytes are
 * already JSON.parsed by Nest's body-parser; this helper only does shape checks.
 */
export function parseWebhookBody(body: unknown, config: WebhookSourceConfig | Record<string, unknown>): Array<Record<string, unknown>> {
  const eventField = (config as Record<string, unknown>).eventField
  if (typeof eventField === 'string' && eventField.length > 0) {
    if (!isPlainObject(body)) {
      throw new BadRequestException(`Webhook body must be a JSON object when source.config.eventField is set (got ${describe(body)})`)
    }
    const arr = body[eventField]
    if (!Array.isArray(arr)) {
      throw new BadRequestException(`Webhook body.${eventField} must be an array (got ${describe(arr)})`)
    }
    arr.forEach((rec, i) => {
      if (!isPlainObject(rec)) {
        throw new BadRequestException(`Webhook body.${eventField}[${i}] must be a JSON object (got ${describe(rec)})`)
      }
    })
    return arr as Array<Record<string, unknown>>
  }

  if (!isPlainObject(body)) {
    throw new BadRequestException(`Webhook body must be a JSON object when source.config.eventField is unset (got ${describe(body)})`)
  }
  return [body]
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function describe(value: unknown): string {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  return typeof value
}
