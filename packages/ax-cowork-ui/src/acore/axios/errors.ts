// Network/transport failure — request never produced an HTTP response (DNS, offline, abort).
export class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NetworkError'
  }
}

// HTTP error — the server replied with a non-2xx status (and not a business envelope).
// `code` mirrors any application-level code returned in the body (e.g. validation errors).
export class ApiError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

// In-band business-rule failure surfaced by the BE/SSO `BusinessExceptionFilter`. HTTP is
// 200, the `code` HTTP header carries the business code, and the body shape is
// `{ code, error, data? }`. The interceptor detects this envelope and rejects with a
// BusinessError so callers can branch on `err.code` without inspecting raw responses.
export class BusinessError extends Error {
  readonly code: number
  readonly data?: unknown

  constructor(code: number, message: string, data?: unknown) {
    super(message)
    this.name = 'BusinessError'
    this.code = code
    this.data = data
  }
}
