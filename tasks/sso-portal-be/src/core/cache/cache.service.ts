import { Inject, Injectable, Logger } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { ConfigService } from '@nestjs/config'
import { Cache } from 'cache-manager'

@Injectable({})
export class CacheService {
  private readonly logger = new Logger(CacheService.name)

  constructor(
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache
  ) {}

  async get<T = unknown>(key: string) {
    return await this.cache.get<T>(key)
  }

  async set(key: string, value: any, seconds: number = +this.configService.get<number>('CACHE_TTL')) {
    if (!this.configService.get<string>('CACHE') || this.configService.get<string>('CACHE') === 'DISABLED') {
      return undefined
    }

    return await this.cache.set(key, value, seconds)
  }

  async del(key: string) {
    return await this.cache.del(key)
  }

  async getSilent<T = unknown>(key: string) {
    try {
      return await this.cache.get<T>(key)
    } catch (ex) {
      this.logger.error(`${ex.message || ex} \n ${ex.stack}`)
      return undefined
    }
  }

  async setSilent(key: string, value: any, seconds: number = +this.configService.get<number>('CACHE_TTL')) {
    if (!this.configService.get<string>('CACHE') || this.configService.get<string>('CACHE') === 'DISABLED') {
      return undefined
    }

    try {
      return await this.cache.set(key, value, seconds || 0)
    } catch (ex) {
      this.logger.error(`${ex.message || ex} \n ${ex.stack}`)
      return undefined
    }
  }

  async delSilent(key: string) {
    try {
      return await this.cache.del(key)
    } catch (ex) {
      this.logger.error(`${ex.message || ex} \n ${ex.stack}`)
      return undefined
    }
  }
}
