import { SetMetadata } from '@nestjs/common'

import { PUBLIC_ROUTE_KEY } from './api-key.constants'

// Marks a controller or route handler as exempt from `ApiKeyGuard`.
// Use for health probes and any endpoint that infrastructure must call
// without knowing the API key.
export const Public = (): MethodDecorator & ClassDecorator => SetMetadata(PUBLIC_ROUTE_KEY, true)
