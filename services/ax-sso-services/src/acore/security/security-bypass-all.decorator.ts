import { SetMetadata } from '@nestjs/common'

import { SECURITY_BYPASS_ALL_KEY } from './security.constants'

// Marks a controller or route handler as exempt from `ApiKeyGuard` (and any future
// security guards keyed on `SECURITY_BYPASS_ALL_KEY`). Use for health probes and any
// endpoint that infrastructure must call without knowing the API key.
export const SecurityBypassAll = (): MethodDecorator & ClassDecorator => SetMetadata(SECURITY_BYPASS_ALL_KEY, true)
