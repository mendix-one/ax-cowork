import { BadRequestException, Controller, Get, Headers, InternalServerErrorException, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'

import { APP_KEY_HEADER, SecurityCheck } from '../../acore/security'
import { SessionInfoResDto } from './dto/session-info.res-dto'
import { SessionResDto } from './dto/session.res-dto'
import { SessionService } from './session.service'

@ApiTags('Auth')
@ApiSecurity('ax-api-key')
@Controller()
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('initialize')
  @ApiHeader({ name: APP_KEY_HEADER, required: true, description: 'App key (matches `App.key`) identifying which app the session is being initialized for.' })
  @ApiOperation({
    summary: 'Initialize an anonymous session',
    description:
      'Creates a new session bound to the requested app, lasting one year. No account is attached — sign-in later associates the session with an account.',
  })
  @ApiOkResponse({ type: SessionResDto, description: 'Session created.' })
  @ApiUnauthorizedResponse({ description: 'Unknown app, or missing/invalid API key.' })
  initialize(@Headers(APP_KEY_HEADER) appKey: string | undefined): Promise<SessionResDto> {
    if (!appKey) {
      throw new BadRequestException(`Missing required header: ${APP_KEY_HEADER}`)
    }
    return this.sessionService.initialize(appKey)
  }

  @Get('session')
  @ApiBearerAuth()
  @SecurityCheck({ sign: false })
  @ApiOperation({
    summary: 'Read current session info',
    description: 'Returns the current state of the calling session: uuid, app snapshot, plus (when signed in) the account snapshot, status, and roles.',
  })
  @ApiOkResponse({ type: SessionInfoResDto, description: 'Session info.' })
  @ApiUnauthorizedResponse({ description: 'Missing/invalid bearer or API key, or the backing session no longer exists.' })
  getSession(@Headers('session') sessionUuid: string | undefined): Promise<SessionInfoResDto> {
    // Guard verified the bearer and wrote `session` (from claim `ses`) onto the request. Any
    // client-supplied value was stripped beforehand, so this header is trustworthy.
    if (!sessionUuid) {
      throw new InternalServerErrorException('Verified token missing `ses` claim')
    }
    return this.sessionService.getSession(sessionUuid)
  }
}
