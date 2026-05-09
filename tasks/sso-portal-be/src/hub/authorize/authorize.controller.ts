import { Body, Controller, Headers, Post, UnauthorizedException } from '@nestjs/common'
import { AuthorizeReqBody } from './dto/authorize.req-body'
import { AuthorizeService } from './authorize.service'

@Controller('authorize')
export class AuthorizeController {
  constructor(private authorizeService: AuthorizeService) {}

  @Post()
  async index(@Headers('authorization') bearerToken: string, @Body() body: AuthorizeReqBody) {
    // Get token
    const clientToken = bearerToken ? bearerToken.replace('Bearer', '').trim() : undefined

    // Check token
    if (!clientToken) {
      throw new UnauthorizedException('Mission authorization token')
    }

    // Do authorization
    return await this.authorizeService.authorize(clientToken, body)
  }
}
