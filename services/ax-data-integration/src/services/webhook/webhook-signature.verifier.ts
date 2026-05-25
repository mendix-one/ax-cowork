import { createHmac, timingSafeEqual } from 'crypto'

import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ObjectId } from 'mongodb'

import { SecretsService } from '../../domain/secret'
import type { JobConfigDoc } from '../../domain/job-config'

/** Header carrying the unix-seconds timestamp of the request, when the sender opts into replay protection. */
export const WEBHOOK_TIMESTAMP_HEADER = 'x-webhook-timestamp'

export interface VerifyInput {
  jobConfig: JobConfigDoc
  rawBody: Buffer
  signature: string | undefined
  timestamp: string | undefined
}

/**
 * Verifies the HMAC-SHA256 signature carried on an inbound webhook request.
 *
 * - **Open webhook** (`source.config.secretRef` absent) — skipped. The boot-time scanner emits a warn
 *   so operators see which jobs run without authentication; per-request work here is a no-op.
 * - **Signed webhook** — fetch the secret plaintext via `SecretsService.revealPlaintext`, compute
 *   `HMAC-SHA256(rawBody, plaintext)` as hex, constant-time compare against the value in the configured
 *   header. Mismatch → `UnauthorizedException` (401). Plaintext lives in RAM only for the compare —
 *   no caching (per CLAUDE.md "Plaintext of secrets — only exists in RAM during one decrypt").
 * - **Replay protection** — when `INTEGRATION_WEBHOOK_MAX_SKEW_SEC > 0` AND the request carries
 *   `x-webhook-timestamp` (unix seconds), the timestamp must fall within ±skew of `Date.now()`.
 *   Missing header is tolerated (signature already authenticates the body); a malformed or stale value
 *   throws 401. Skew = 0 disables replay checks entirely.
 */
@Injectable()
export class WebhookSignatureVerifier {
  private readonly logger = new Logger(WebhookSignatureVerifier.name)
  private readonly maxSkewSec: number

  constructor(
    private readonly secrets: SecretsService,
    config: ConfigService,
  ) {
    this.maxSkewSec = config.get<number>('INTEGRATION_WEBHOOK_MAX_SKEW_SEC') ?? 300
  }

  async verify(input: VerifyInput): Promise<void> {
    const secretRef = input.jobConfig.source.config.secretRef
    if (secretRef === undefined || secretRef === null) {
      // Open webhook — no authentication. Boot-time scanner warns once; per-request silence avoids
      // log spam.
      return
    }
    if (typeof secretRef !== 'string' || !ObjectId.isValid(secretRef)) {
      // T2-B01 validates the shape on create/update; reaching here implies historic data drift.
      throw new UnauthorizedException('Webhook secretRef is malformed; signature cannot be verified')
    }

    if (!input.signature || input.signature.length === 0) {
      throw new UnauthorizedException('Missing webhook signature header')
    }

    this.assertTimestampFresh(input.timestamp)

    const plaintext = await this.safeRevealPlaintext(new ObjectId(secretRef))
    const expected = createHmac('sha256', plaintext).update(input.rawBody).digest('hex')

    if (!constantTimeEqualsHex(expected, input.signature.trim())) {
      throw new UnauthorizedException('Webhook signature mismatch')
    }
  }

  private assertTimestampFresh(timestamp: string | undefined): void {
    if (this.maxSkewSec === 0) return
    if (timestamp === undefined) return // header is optional; signature alone suffices when absent
    const parsed = Number.parseInt(timestamp, 10)
    if (!Number.isFinite(parsed) || String(parsed) !== timestamp.trim()) {
      throw new UnauthorizedException('Webhook timestamp header is malformed')
    }
    const drift = Math.abs(Math.floor(Date.now() / 1000) - parsed)
    if (drift > this.maxSkewSec) {
      throw new UnauthorizedException(`Webhook timestamp outside ±${this.maxSkewSec}s skew window`)
    }
  }

  private async safeRevealPlaintext(id: ObjectId): Promise<string> {
    try {
      return await this.secrets.revealPlaintext(id)
    } catch (err) {
      // Surfaces as 401 (not 500): the caller's signature is unverifiable when the referenced secret is
      // gone / unreadable. Log full reason at warn for operator triage; the response stays generic so we
      // don't leak missing-secret state to unauthenticated callers.
      this.logger.warn(`webhook secret resolution failed for ${id.toHexString()}: ${err instanceof Error ? err.message : String(err)}`)
      throw new UnauthorizedException('Webhook secret could not be resolved')
    }
  }
}

/** Constant-time hex compare: equal length AND byte-wise timingSafeEqual. Returns false on any error. */
function constantTimeEqualsHex(expected: string, candidate: string): boolean {
  if (expected.length !== candidate.length) return false
  try {
    return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(candidate, 'hex'))
  } catch {
    return false
  }
}
