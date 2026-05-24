import { Body, Controller, Headers, Post, UnauthorizedException } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'

import { SecurityCheck } from '../../acore/security'
import { SigninReqDto } from './dto/signin.req-dto'
import { SigninResDto } from './dto/signin.res-dto'
import { SigninService } from './signin.service'

@ApiTags('Auth')
@ApiSecurity('ax-api-key')
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
  @ApiOkResponse({ type: SigninResDto, description: 'Session signed in.' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials, unknown app, or session/app mismatch.' })
  signin(@Headers('session') sessionUuid: string | undefined, @Body() dto: SigninReqDto): Promise<SigninResDto> {
    if (!sessionUuid) {
      throw new UnauthorizedException('Verified token missing `app` or `ses` claim')
    }
    return this.signinService.signin(sessionUuid, dto.username, dto.password)
  }
}
