// Helpers for the "send the user to /auth/signin and bounce back after success" round-trip.
// The redirect target rides as a `?next=<encoded URI>` query parameter so it survives a full
// page reload (React Router's history state does not). The captured URI includes pathname,
// search, and hash so a deep link like `/projects/42?tab=settings#members` round-trips intact.

const SIGNIN_PATH = '/auth/signin'

// Same-origin, absolute-path-only sanitizer. Rejects protocol-relative URLs (`//evil.com/...`)
// and anything that would loop the user back through the auth flow.
function isSafeRedirectTarget(target: string): boolean {
  if (!target.startsWith('/')) return false
  if (target.startsWith('//')) return false
  // Don't bounce back into the auth area — that would create a redirect loop after signin.
  if (target.startsWith('/auth/')) return false
  return true
}

// Build `/auth/signin?next=<encoded current URI>`. Pass the *current* `location` from React
// Router. `next` is omitted when the current URL is itself the signin page (no point bouncing
// back to signin) or any other auth route.
export function buildSigninRedirect(location: { pathname: string; search?: string; hash?: string }): string {
  const requestUri = `${location.pathname}${location.search ?? ''}${location.hash ?? ''}`
  if (!isSafeRedirectTarget(requestUri)) {
    return SIGNIN_PATH
  }
  return `${SIGNIN_PATH}?next=${encodeURIComponent(requestUri)}`
}

// Pull the post-signin target out of `location.search`. Returns `'/'` when missing, malformed,
// or unsafe so the caller can navigate directly without re-checking.
export function readNextFromSearch(search: string): string {
  const params = new URLSearchParams(search)
  const raw = params.get('next')
  if (!raw) return '/'
  let decoded: string
  try {
    decoded = decodeURIComponent(raw)
  } catch {
    return '/'
  }
  return isSafeRedirectTarget(decoded) ? decoded : '/'
}
