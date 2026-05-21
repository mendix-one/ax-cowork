import { BadRequestException, Logger } from '@nestjs/common'

import type { JobConfigIdentity, JobConfigSource, SourceType } from './job-config.schema'

const FILE_SOURCE_TYPES: ReadonlySet<SourceType> = new Set(['excel', 'csv'])

/**
 * Enforces the per-strategy invariants described in P002 §9.1. Pure function — pass an
 * optional logger to emit the `hash`-strategy warning (Phase 1 §15.8 / §9.1 caveat).
 *
 * Throws BadRequestException on any violation. Service layer calls this on create and
 * whenever a PATCH changes `source` or `identity` so the saved doc always satisfies the
 * combined invariant.
 */
export function validateJobConfigIdentity(source: JobConfigSource, identity: JobConfigIdentity, logger?: Logger): void {
  switch (identity.strategy) {
    case 'primary-key':
      if (identity.fields.length !== 1) {
        throw new BadRequestException(`identity.strategy='primary-key' requires exactly 1 field (got ${identity.fields.length})`)
      }
      break

    case 'composite':
      if (identity.fields.length < 2) {
        throw new BadRequestException(`identity.strategy='composite' requires at least 2 fields (got ${identity.fields.length})`)
      }
      break

    case 'hash':
      if (identity.acknowledgeHashSemantics !== true) {
        throw new BadRequestException(
          "identity.strategy='hash' treats every payload change as insert+delete (P002 §9.1). Set identity.acknowledgeHashSemantics: true to confirm.",
        )
      }
      logger?.warn(
        `hash strategy chosen for source.type=${source.type}: every payload change will be classified as insert+delete; counts.updated will always be 0`,
      )
      break

    case 'row-number':
      if (!FILE_SOURCE_TYPES.has(source.type)) {
        throw new BadRequestException(`identity.strategy='row-number' is only valid for file sources (excel|csv), not '${source.type}'`)
      }
      break
  }
}
