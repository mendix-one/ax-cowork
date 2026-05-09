import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class HashingManager {
  constructor(private readonly configService: ConfigService) {}

  async salt(): Promise<string> {
    try {
    } catch (e) {
      return undefined
    }
    return await bcrypt.genSalt(8)
  }

  async hash(password: string, salt?: string | number): Promise<string> {
    try {
      return await bcrypt.hash(password, salt || this.configService.get('HASHING_SALT'))
    } catch (e) {
      return undefined
    }
  }

  async compare(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash)
    } catch (e) {
      return false
    }
  }
}
