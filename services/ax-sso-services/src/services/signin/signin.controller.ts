import { BadRequestException, Body, Controller, Headers, Post } from '@nestjs/common'
import { ApiHeader, ApiOkResponse, ApiOperation, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'

import { APP_KEY_HEADER } from '../../acore/security'
import { SigninReqDto } from './dto/signin.req-dto'
import { SigninResDto } from './dto/signin.res-dto'
import { SigninService } from './signin.service'

@ApiTags('Auth')
@ApiSecurity('ax-api-key')
@ApiHeader({ name: APP_KEY_HEADER, required: true, description: 'App key (matches `App.key`) identifying which app the user is signing into.' })
@Controller('signin')
export class SigninController {
  constructor(private readonly signinService: SigninService) {}

  @Post()
  @ApiOperation({
    summary: 'Sign in',
    description: 'Validates credentials against the requested app and returns a session token with the account/app snapshots and granted roles.',
  })
  @ApiOkResponse({ type: SigninResDto, description: 'Session created.' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials or unknown app.' })
  signin(@Headers(APP_KEY_HEADER) appKey: string | undefined, @Body() dto: SigninReqDto): Promise<SigninResDto> {
    if (!appKey) {
      throw new BadRequestException(`Missing required header: ${APP_KEY_HEADER}`)
    }
    return this.signinService.signin(appKey, dto.username, dto.password)
  }
}
