import { Body, Controller, Headers, InternalServerErrorException, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'

import { SecurityCheck } from '../../acore/security'
import { TokenReqDto } from './dto/token.req-dto'
import { TokenResDto } from './dto/token.res-dto'
import { TokenService } from './token.service'

@ApiTags('Auth')
@ApiSecurity('ax-api-key')
@ApiBearerAuth()
// Empty roles + empty status: any valid, non-expired session bearer is accepted regardless of account status.
@SecurityCheck()
@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post()
  @ApiOperation({
    summary: 'Issue an app-scoped JWT for the calling session',
    description:
      'Exchanges the verified session bearer for a JWT scoped to the app key in the body. Reuses the existing token row for (account, session, app) when present; otherwise inserts a new row.',
  })
  @ApiBody({ type: TokenReqDto })
  @ApiOkResponse({ type: TokenResDto, description: 'Token issued (created or refreshed).' })
  @ApiUnauthorizedResponse({ description: 'Missing/invalid bearer token, or missing/invalid API key.' })
  issue(
    @Headers('account') account: string | undefined,
    @Headers('session') session: string | undefined,
    @Headers('state') state: string | undefined,
    @Body() dto: TokenReqDto,
  ): Promise<TokenResDto> {
    // The guard verified the session JWT and wrote `account` / `session` / `state` (from claims
    // `sub` / `ses` / `sta`) onto the request. Any client-supplied values for those headers were
    // stripped beforehand, so we can trust whatever the guard set.
    if (!account || !session || !state) {
      // Defensive — the guard always sets all three after a successful verify; arriving here without
      // them would mean the JWT was somehow missing a claim, which signin never does.
      throw new InternalServerErrorException('Verified token missing one of `sub`/`ses`/`sta` claims')
    }
    return this.tokenService.issue(account, session, state, dto.scope)
  }
}
