import { BadRequestException, Logger } from '@nestjs/common'
import { ObjectId } from 'mongodb'

import type { JobConfigSource } from './job-config.schema'

const DEFAULT_SIGNATURE_HEADER = 'x-webhook-signature'

/**
 * Recognised fields on `source.config` for a webhook job. Loose at the DTO layer (`Record<string, unknown>`,
 * same as every other source type); shape-checked here at the service boundary on create / update.
 */
export interface WebhookSourceConfig {
  secretRef?: string
  signatureHeader?: string
  eventField?: string
}

/**
 * Validates a webhook job's `source.config`. Throws `BadRequestException` on shape or value violations.
 *
 * - `secretRef` (optional): must be a 24-hex ObjectId string when present. Missing = open webhook, which
 *   is allowed but logged at `warn` (the actual boot-time warning lives in T2-B02; here we just trace).
 * - `signatureHeader` (optional): non-empty string. Defaults to `'x-webhook-signature'` when omitted at runtime.
 * - `eventField` (optional): non-empty string; identifies the root JSON field that holds the records array.
 * - **No unknown keys** — surfaces operator typos (e.g. `secret_ref`) instead of silently ignoring them.
 */
export function validateWebhookSourceConfig(source: JobConfigSource, logger?: Logger): void {
  if (source.type !== 'webhook') return
  const cfg = source.config

  for (const key of Object.keys(cfg)) {
    if (!ALLOWED_KEYS.has(key)) {
      throw new BadRequestException(`source.config.${key} is not a recognised webhook config field (allowed: ${[...ALLOWED_KEYS].join(', ')})`)
    }
  }

  if (cfg.secretRef !== undefined) {
    if (typeof cfg.secretRef !== 'string' || !ObjectId.isValid(cfg.secretRef)) {
      throw new BadRequestException('source.config.secretRef must be a 24-hex ObjectId string')
    }
  } else {
    logger?.warn(`webhook source.config.secretRef is not set — signatures will not be verified (open webhook). Consider attaching a secret for production use.`)
  }

  if (cfg.signatureHeader !== undefined) {
    if (typeof cfg.signatureHeader !== 'string' || cfg.signatureHeader.trim().length === 0) {
      throw new BadRequestException('source.config.signatureHeader must be a non-empty string')
    }
  }

  if (cfg.eventField !== undefined) {
    if (typeof cfg.eventField !== 'string' || cfg.eventField.trim().length === 0) {
      throw new BadRequestException('source.config.eventField must be a non-empty string')
    }
  }
}

/** Resolves the signature header name for a webhook job config — falls back to the documented default. */
export function resolveWebhookSignatureHeader(cfg: WebhookSourceConfig | Record<string, unknown> | undefined): string {
  const v = (cfg as Record<string, unknown> | undefined)?.signatureHeader
  return typeof v === 'string' && v.trim().length > 0 ? v : DEFAULT_SIGNATURE_HEADER
}

const ALLOWED_KEYS: ReadonlySet<string> = new Set(['secretRef', 'signatureHeader', 'eventField'])
