/**
 * Single source of truth for paginated list-endpoint defaults. Every admin list endpoint
 * (job-configs, secrets, source-files, sync-runs, raw-records, source-metadata) shares the
 * same caps so payload size is bounded uniformly across the service.
 */
export const DEFAULT_PAGE = 1
export const DEFAULT_PAGE_SIZE = 50
export const MAX_PAGE_SIZE = 200

/**
 * Computes `{skip, limit}` from optional `page` / `pageSize` query params, applying defaults
 * and clamping `pageSize` to `MAX_PAGE_SIZE`. Returns the resolved `page` / `pageSize` too
 * so the response can echo them back to the client.
 */
export function resolvePagination(input: { page?: number; pageSize?: number }): {
  page: number
  pageSize: number
  skip: number
  limit: number
} {
  // Clamps to a sane floor of 1 even if the DTO validation is bypassed by a non-HTTP caller.
  const page = Math.max(1, input.page ?? DEFAULT_PAGE)
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, input.pageSize ?? DEFAULT_PAGE_SIZE))
  return { page, pageSize, skip: (page - 1) * pageSize, limit: pageSize }
}
