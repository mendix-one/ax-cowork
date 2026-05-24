import { Controller, Headers, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'

import { ApiOkWithBusinessErrors } from '../../acore/exception'
import { SecurityCheck } from '../../acore/security'
import { SignoutResDto } from './dto/signout.res-dto'
import { SIGNOUT_ERR_NOT_SIGNED_IN, SIGNOUT_ERR_SESSION_NOT_FOUND, SignoutService } from './signout.service'

@ApiTags('Auth')
@ApiSecurity('ax-api-key')
@ApiBearerAuth()
// Empty roles + empty status: any valid, non-expired bearer is accepted regardless of account status.
@SecurityCheck()
@Controller('signout')
export class SignoutController {
  constructor(private readonly signoutService: SignoutService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Sign out',
    description:
      'Detaches the account from the session referenced by the bearer (claim `ses`) and cascade-deletes any tokens minted from it. The session row itself stays so the same uuid can be reused anonymously.',
  })
  @ApiOkWithBusinessErrors(SignoutResDto, [
    {
      code: SIGNOUT_ERR_SESSION_NOT_FOUND,
      error: 'Session not found',
      description: 'No session matches the bearer (already TTL-expired or removed elsewhere).',
    },
    {
      code: SIGNOUT_ERR_NOT_SIGNED_IN,
      error: 'Session is not signed in',
      description: 'Session exists but is anonymous — likely a second signout call on the same bearer.',
    },
  ])
  @ApiUnauthorizedResponse({ description: 'Missing/invalid bearer token, or missing/invalid API key.' })
  signout(@Headers('session') session: string | undefined): Promise<SignoutResDto> {
    // `SecurityCheckGuard` verified the bearer and wrote the JWT's `ses` claim onto this header.
    // Any client-supplied `session` header is stripped by the guard up front, so we can trust this value.
    if (!session) {
      // Defensive — the guard always sets `session` after a successful verify; arriving here without
      // it would mean the JWT was somehow missing the claim, which signin never does.
      throw new UnauthorizedException('Verified token missing `ses` claim')
    }
    return this.signoutService.signout(session)
  }
}
