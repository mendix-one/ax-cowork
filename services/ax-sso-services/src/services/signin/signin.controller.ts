import { Body, Controller, Headers, Post, UnauthorizedException } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'

import { ApiOkWithBusinessErrors } from '../../acore/exception'
import { SecurityCheck } from '../../acore/security'
import { SigninReqDto } from './dto/signin.req-dto'
import { SigninResDto } from './dto/signin.res-dto'
import { SIGNIN_ERR_ACCOUNT_NOT_ACTIVE, SIGNIN_ERR_INVALID_CREDENTIALS, SigninService } from './signin.service'

@ApiTags('Auth')
@ApiSecurity('ax-axios-key')
@ApiBearerAuth()
// Anonymous-session JWT required — caller must have initialized a session via /session/initialize first.
@SecurityCheck({ sign: false })
@Controller('signin')
export class SigninController {
  constructor(private readonly signinService: SigninService) {}

  @Post()
  @ApiOperation({
    summary: 'Sign in',
    description:
      'Attaches an account to the calling anonymous session and returns a signed-in JWT. The session expiry is extended to one year from the signin time.',
  })
  @ApiOkWithBusinessErrors(SigninResDto, [
    {
      code: SIGNIN_ERR_INVALID_CREDENTIALS,
      error: 'Invalid credentials',
      description: 'Account not found or wrong password (same code/message to prevent username enumeration).',
    },
    {
      code: SIGNIN_ERR_ACCOUNT_NOT_ACTIVE,
      error: 'Account is not active',
      data: { status: 'LOCKED' },
      description: 'Account status is LOCKED or CLOSED. `data.status` carries the actual status.',
    },
  ])
  @ApiUnauthorizedResponse({ description: 'Missing/invalid bearer token or API key, unknown session, or app no longer exists.' })
  signin(@Headers('session') sessionUuid: string | undefined, @Body() dto: SigninReqDto): Promise<SigninResDto> {
    if (!sessionUuid) {
      throw new UnauthorizedException('Verified token missing `app` or `ses` claim')
    }
    return this.signinService.signin(sessionUuid, dto.username, dto.password)
  }
}
