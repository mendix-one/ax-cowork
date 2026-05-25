import { Injectable, Logger } from '@nestjs/common'
import { ObjectId } from 'mongodb'

import type { JobConfigDoc } from '../../domain/job-config'

/**
 * Result returned from `WebhookController` once a payload has been accepted.
 *
 * The phase-2 contract surfaces `runId` so the caller can correlate the push with the eventual
 * `sync_runs` document. **T2-B02 (this task) returns a placeholder `ObjectId`** — actual `sync_run`
 * persistence + record classification lands in T2-B04 (`extend TriggerSource` union + write through
 * the executor's `classifyAndWrite` path). Keeping the signature stable here so T2-B03/B04 do not
 * re-shape the controller response.
 */
export interface WebhookIngestionResult {
  runId: ObjectId
}

/**
 * Inputs to `WebhookIngestionService.ingest`.
 *
 * - `jobConfig`: the resolved webhook-source job_config (controller already verified `source.type==='webhook'`)
 * - `body`: parsed JSON body. Type is kept as `unknown` because the executor's `classifyAndWrite`
 *   path (T2-B04) walks `eventField` itself; up-front type narrowing here would just move duplication
 *   into the controller.
 * - `rawBody`: exact wire bytes — needed by T2-B03 (HMAC verify). Stored here so the service signature
 *   does not change between T2-B02 and T2-B03.
 * - `signatureHeader`: value of the configured signature header on the incoming request. `undefined`
 *   when the request did not carry the header. Used by T2-B03 for HMAC verify; ignored in T2-B02.
 */
export interface WebhookIngestionInput {
  jobConfig: JobConfigDoc
  body: unknown
  rawBody: Buffer
  signatureHeader: string | undefined
}

/**
 * Stub implementation: returns a synthesised `runId` without persisting a `sync_run`. T2-B04 swaps the
 * body of this method for the real path (create `sync_run`, run records through `classifyAndWrite`).
 * The HMAC check from T2-B03 hooks in BEFORE this call (rejected requests never reach here), so this
 * method can assume the payload is authenticated.
 */
@Injectable()
export class WebhookIngestionService {
  private readonly logger = new Logger(WebhookIngestionService.name)

  ingest(input: WebhookIngestionInput): Promise<WebhookIngestionResult> {
    const runId = new ObjectId()
    this.logger.debug(
      `T2-B02 stub ingest: jobConfig=${input.jobConfig._id.toHexString()} rawBytes=${input.rawBody.length} runId=${runId.toHexString()} (persistence lands in T2-B04)`,
    )
    return Promise.resolve({ runId })
  }
}
