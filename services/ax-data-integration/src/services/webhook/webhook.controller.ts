import { Body, Controller, HttpCode, HttpStatus, NotFoundException, Param, Post, RawBody, Req, UseGuards } from '@nestjs/common'
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiPayloadTooLargeResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { ThrottlerGuard } from '@nestjs/throttler'
import type { Request } from 'express'
import type { ObjectId } from 'mongodb'

import { Public } from '../../acore/auth'
import { ObjectIdPipe } from '../../acore/mongo'
import { JobConfigRepository, resolveWebhookSignatureHeader } from '../../domain/job-config'
import { WebhookIngestionService } from './webhook-ingestion.service'
import { WEBHOOK_TIMESTAMP_HEADER, WebhookSignatureVerifier } from './webhook-signature.verifier'

@ApiTags('Webhooks')
@Controller('webhooks')
@UseGuards(ThrottlerGuard)
export class WebhookController {
  constructor(
    private readonly jobConfigs: JobConfigRepository,
    private readonly ingestion: WebhookIngestionService,
    private readonly verifier: WebhookSignatureVerifier,
  ) {}

  /**
   * Receives a JSON push for a webhook-source job_config and accepts it for ingestion.
   *
   * T2-B02 scope: HTTP plumbing only — `@Public()` (HMAC is the auth boundary, added in T2-B03),
   * per-route rate limiting via `ThrottlerGuard`, 10 MiB body cap (configurable). Payload classification
   * + sync_run persistence lands in T2-B04; `runId` returned here is a placeholder until then.
   */
  @Post(':jobConfigId')
  @Public()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Submit a webhook payload',
    description: [
      'Public endpoint — no `x-api-key`; HMAC signature is the auth boundary (T2-B03).',
      'Rate-limited per source IP via `INTEGRATION_WEBHOOK_RATE_LIMIT_RPM` (default 60/min).',
      'Max body size: `INTEGRATION_WEBHOOK_MAX_BYTES` (default 10 MiB) — exceeding returns 413.',
      'Returns 202 with a `runId` once the payload is accepted; the actual `sync_run` persistence lands in T2-B04.',
    ].join(' '),
  })
  @ApiParam({ name: 'jobConfigId', description: 'Hex ObjectId of a `job_config` whose `source.type` is `webhook`.' })
  @ApiAcceptedResponse({ description: 'Payload accepted. Body contains `runId` for correlation.' })
  @ApiBadRequestResponse({ description: 'Malformed JSON or malformed `jobConfigId`.' })
  @ApiUnauthorizedResponse({ description: 'HMAC signature missing / invalid (added in T2-B03).' })
  @ApiNotFoundResponse({ description: 'No `job_config` with that id, or its `source.type` is not `webhook`.' })
  @ApiPayloadTooLargeResponse({ description: 'Body exceeded `INTEGRATION_WEBHOOK_MAX_BYTES`.' })
  @ApiTooManyRequestsResponse({ description: 'Per-IP rate limit exceeded.' })
  @ApiInternalServerErrorResponse({ description: 'Unexpected error while ingesting.' })
  async receive(
    @Param('jobConfigId', ObjectIdPipe) jobConfigId: ObjectId,
    @Body() body: unknown,
    @RawBody() rawBody: Buffer | undefined,
    @Req() req: Request,
  ): Promise<{ runId: string }> {
    const jobConfig = await this.jobConfigs.findById(jobConfigId)
    if (!jobConfig || jobConfig.source.type !== 'webhook') {
      // Surfacing both "no doc" and "wrong source type" as 404 — operators reading the response
      // see the same shape whether the id was wrong or pointed at a non-webhook job. Distinguishing
      // would leak the existence of unrelated configs to callers that already have the URL guessed.
      throw new NotFoundException(`No webhook job_config with id ${jobConfigId.toHexString()}`)
    }

    const signatureHeader = resolveWebhookSignatureHeader(jobConfig.source.config)
    const signature = readHeader(req, signatureHeader)
    const timestamp = readHeader(req, WEBHOOK_TIMESTAMP_HEADER)

    // `RawBody()` returns undefined when express body-parser didn't capture the raw bytes (test
    // contexts that send a non-application/json content-type, etc). Default to an empty buffer so
    // downstream code (signature verify, classifyAndWrite) has a stable Buffer type.
    const rawBytes = rawBody ?? Buffer.alloc(0)

    // T2-B03: HMAC verify runs BEFORE ingestion. Open webhooks (no secretRef) silently pass through;
    // signed webhooks throw `UnauthorizedException` (→ 401) on missing / mismatched / replayed sig.
    await this.verifier.verify({ jobConfig, rawBody: rawBytes, signature, timestamp })

    const result = await this.ingestion.ingest({
      jobConfig,
      body,
      rawBody: rawBytes,
      signatureHeader: signature,
    })

    return { runId: result.runId.toHexString() }
  }
}

function readHeader(req: Request, name: string): string | undefined {
  const raw = req.headers[name.toLowerCase()]
  if (raw === undefined) return undefined
  return Array.isArray(raw) ? raw[0] : raw
}
