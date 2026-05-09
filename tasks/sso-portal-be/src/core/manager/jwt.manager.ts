import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { JwtPayload } from '../interface/jwt-payload.interface'

@Injectable()
export class JwtManager {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async sign(payload: JwtPayload): Promise<string> {
    const options = {
      secret: this.configService.get('JWT_SECRET'),
      issuer: this.configService.get('JWT_ISSUER'),
      audience: this.configService.get('JWT_AUDIENCE')
    }

    return this.jwtService.sign(payload, options)
  }

  async signCode(payload: JwtPayload): Promise<string> {
    const options = {
      secret: this.configService.get('JWT_SECRET'),
      issuer: this.configService.get('JWT_ISSUER'),
      audience: this.configService.get('JWT_AUDIENCE'),
      expiresIn: this.configService.get('JWT_CODE_EXPIRES_IN')
    }

    return this.jwtService.sign(payload, options)
  }

  async signToken(payload: JwtPayload): Promise<string> {
    const options = {
      secret: this.configService.get('JWT_SECRET'),
      issuer: this.configService.get('JWT_ISSUER'),
      audience: this.configService.get('JWT_AUDIENCE'),
      expiresIn: this.configService.get('JWT_TOKEN_EXPIRES_IN')
    }

    return this.jwtService.sign(payload, options)
  }

  async signRefreshToken(payload: JwtPayload): Promise<string> {
    const options = {
      secret: this.configService.get('JWT_SECRET'),
      issuer: this.configService.get('JWT_ISSUER'),
      audience: this.configService.get('JWT_AUDIENCE'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN')
    }

    return this.jwtService.sign(payload, options)
  }

  async verify(token: string): Promise<boolean | JwtPayload> {
    try {
      const options = {
        secret: this.configService.get('JWT_SECRET'),
        issuer: this.configService.get('JWT_ISSUER'),
        audience: this.configService.get('JWT_AUDIENCE')
      }

      return this.jwtService.verify(token, options)
    } catch (e) {
      return false
    }
  }

  async decode(token: string): Promise<JwtPayload> {
    try {
      const options = {
        json: true
      }

      return this.jwtService.decode(token, options)
    } catch (e) {
      return undefined
    }
  }
}
