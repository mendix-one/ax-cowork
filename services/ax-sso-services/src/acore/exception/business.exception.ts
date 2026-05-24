// Raised by service methods to signal an *expected* business-rule failure (bad credentials,
// quota exceeded, item not found in a domain sense, etc.) — as opposed to an HTTP-protocol
// error (4xx/5xx) which we still throw via Nest's built-in HttpException subclasses.
//
// BusinessExceptions are caught by `BusinessExceptionFilter` and serialized into a 200 OK
// response with an in-band `code` header + `{ code, error, data? }` body. The HTTP status
// stays 200 deliberately so clients can branch on the business code without conflating
// "the request reached the server and was understood" with "the operation succeeded".
export class BusinessException extends Error {
  // Numeric business-error code. Stable enum the client switches on. Distinct from HTTP status.
  readonly code: number
  // Human-readable summary of the failure. Suitable to surface in logs or developer tooling.
  readonly error: string
  // Optional structured detail — anything the client may need to render the failure.
  readonly data?: unknown

  constructor(code: number, error: string, data?: unknown) {
    super(error)
    this.name = 'BusinessException'
    this.code = code
    this.error = error
    this.data = data
  }
}
