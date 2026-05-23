import { Body, Controller, Post } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'

import { SigninReqDto } from './dto/signin.req-dto'
import { SigninResDto } from './dto/signin.res-dto'
import { SigninService } from './signin.service'

@ApiTags('Auth')
@Controller('signin')
export class SigninController {
  constructor(private readonly signinService: SigninService) {}

  @Post()
  @ApiOperation({ summary: 'Sign in', description: 'Validates credentials and returns a session token.' })
  @ApiOkResponse({ type: SigninResDto, description: 'Session created.' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
  signin(@Body() dto: SigninReqDto): Promise<SigninResDto> {
    return this.signinService.signin(dto.username, dto.password)
  }
}
