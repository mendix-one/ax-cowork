import { Controller, Headers, HttpCode, HttpStatus, InternalServerErrorException, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiNoContentResponse, ApiOperation, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'

import { SecurityCheck } from '../../acore/security'
import { SignoutService } from './signout.service'

@ApiTags('Auth')
@ApiSecurity('ax-api-key')
@ApiBearerAuth()
// Empty roles + empty status: any valid, non-expired bearer is accepted regardless of account status.
@SecurityCheck()
@Controller('signout')
export class SignoutController {
  constructor(private readonly signoutService: SignoutService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Sign out',
    description: 'Invalidates the session referenced by the bearer token (claim `ses`) and any tokens minted from that session.',
  })
  @ApiNoContentResponse({ description: 'Session invalidated.' })
  @ApiUnauthorizedResponse({ description: 'Missing/invalid bearer token, or missing/invalid API key.' })
  async signout(@Headers('session') session: string | undefined): Promise<void> {
    // `SecurityCheckGuard` verified the bearer and wrote the JWT's `ses` claim onto this header.
    // Any client-supplied `ses` header is stripped by the guard up front, so we can trust this value.
    if (!session) {
      // Defensive — the guard always sets `ses` after a successful verify; arriving here without
      // it would mean the JWT was somehow missing the claim, which signin never does.
      throw new InternalServerErrorException('Verified token missing `ses` claim')
    }
    await this.signoutService.signout(session)
  }
}
