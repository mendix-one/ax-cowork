import { SetMetadata } from '@nestjs/common'

export const SECURITY_BYPASS_KEY = 'security:bypass'

// Routes decorated with @SecurityBypass() skip the global AuthGuard.
// Use sparingly — only on the signin / signout endpoints and any other
// genuinely anonymous surface (health checks, etc.).
export const SecurityBypass = () => SetMetadata(SECURITY_BYPASS_KEY, true)
