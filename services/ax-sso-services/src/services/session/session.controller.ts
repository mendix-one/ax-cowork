import { BadRequestException, Controller, Headers, Post } from '@nestjs/common'
import { ApiHeader, ApiOkResponse, ApiOperation, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'

import { APP_KEY_HEADER } from '../../acore/security'
import { SessionResDto } from './dto/session.res-dto'
import { SessionService } from './session.service'

@ApiTags('Auth')
@ApiSecurity('ax-api-key')
@ApiHeader({ name: APP_KEY_HEADER, required: true, description: 'App key (matches `App.key`) identifying which app the session is being initialized for.' })
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('initialize')
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
}
