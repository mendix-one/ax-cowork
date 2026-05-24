import { Body, Controller, Headers, InternalServerErrorException, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'

import { SecurityCheck } from '../../acore/security'
import { TokenReqDto } from './dto/token.req-dto'
import { TokenResDto } from './dto/token.res-dto'
import { TokenService } from './token.service'

@ApiTags('Auth')
@ApiSecurity('ax-axios-key')
@ApiBearerAuth()
// sign:false — any valid session bearer is accepted (signed-in or anonymous). Anonymous callers
// receive tokens with no `sub`/`sta`/roles claims.
@SecurityCheck({ sign: false })
@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post()
  @ApiOperation({
    summary: 'Issue an app-scoped JWT for the calling session',
    description:
      'Exchanges the verified session bearer for a JWT scoped to the app key in the body. Reuses the existing token row for (session, app) when present; otherwise inserts a new row. Anonymous sessions receive tokens with no account/roles.',
  })
  @ApiBody({ type: TokenReqDto })
  @ApiOkResponse({ type: TokenResDto, description: 'Token issued (created or refreshed).' })
  @ApiUnauthorizedResponse({ description: 'Missing/invalid bearer token, or missing/invalid API key.' })
  issue(@Headers('session') session: string | undefined, @Body() dto: TokenReqDto): Promise<TokenResDto> {
    // The guard verified the session JWT and wrote `session` (from claim `ses`) onto the request.
    // Any client-supplied value for that header was stripped beforehand, so we can trust whatever
    // the guard set.
    if (!session) {
      // Defensive — the guard always sets `session` after a successful verify; arriving here without
      // it would mean the JWT was missing the `ses` claim, which signin/initialize never does.
      throw new InternalServerErrorException('Verified token missing `ses` claim')
    }
    return this.tokenService.issue(session, dto.scope)
  }
}
