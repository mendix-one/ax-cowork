import { Controller, Get, Headers, Req, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import { InquiryService } from './inquiry.service'
import { HeaderParams } from '../../core/interface/header-params.interface'

@Controller('inquiry')
export class InquiryController {
  constructor(private inquiryService: InquiryService) {}

  private getSXHeaderParams(req: Request): HeaderParams {
    return {
      type: req.get('sx-type'),
      request: req.get('sx-request'),
      method: req.get('sx-method'),
      host: req.get('sx-host'),
      xForwardedFor: req.get('sx-forwarded-for'),
      xForwardedProto: req.get('sx-forwarded-proto'),
      xForwardedPort: req.get('sx-forwarded-port'),
      userAgent: req.get('sx-user-agent'),
      metadata: req.get('sx-metadata')
    }
  }

  @Get()
  async index(@Headers('authorization') bearerToken, @Req() req: Request) {
    // Get token
    const authorizationToken = bearerToken ? bearerToken.replace('Bearer', '').trim() : undefined

    // Check token
    if (!authorizationToken) {
      throw new UnauthorizedException('Mission authorization token')
    }

    // Do authorization
    return await this.inquiryService.inquiry(authorizationToken, this.getSXHeaderParams(req))
  }
}
