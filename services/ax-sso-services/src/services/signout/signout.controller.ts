import { Controller, Headers, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common'
import { ApiBearerAuth, ApiNoContentResponse, ApiOperation, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'

import { SignoutService } from './signout.service'

@ApiTags('Auth')
@ApiSecurity('ax-api-key')
@ApiBearerAuth()
@Controller('signout')
export class SignoutController {
  constructor(private readonly signoutService: SignoutService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Sign out', description: 'Invalidates the session identified by the `Authorization: Bearer <token>` header.' })
  @ApiNoContentResponse({ description: 'Session invalidated.' })
  @ApiUnauthorizedResponse({ description: 'Missing or malformed Authorization header, or missing/invalid API key.' })
  async signout(@Headers('authorization') authHeader?: string): Promise<void> {
    const token = parseBearerToken(authHeader)
    if (!token) throw new UnauthorizedException('Missing bearer token')
    await this.signoutService.signout(token)
  }
}

function parseBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader) return null
  const [scheme, value] = authHeader.split(' ')
  if (scheme?.toLowerCase() !== 'bearer' || !value) return null
  return value
}
