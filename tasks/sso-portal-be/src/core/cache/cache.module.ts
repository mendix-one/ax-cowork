import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule } from '../config/config.module'
import * as redisStore from 'cache-manager-ioredis'
import { CacheService } from './cache.service'

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const mode = configService.get<string>('CACHE')

        // Disabled
        if (mode === 'DISABLED') {
          return {
            isGlobal: true,
            max: 1,
            ttl: 1
          }
        }

        // Memory
        if (mode === 'MEMORY') {
          return {
            isGlobal: true,
            max: +configService.get<number>('CACHE_MAX') || 1000,
            ttl: +configService.get<number>('CACHE_TTL') || 3600
          }
        }

        // Redis (Single instance)
        if (mode === 'REDIS') {
          return {
            isGlobal: true,
            store: redisStore,
            max: +configService.get<number>('CACHE_MAX') || 10000000,
            ttl: +configService.get<number>('CACHE_TTL') || 43200,
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
            password: configService.get<string>('REDIS_PWD'),
            database: configService.get<number>('REDIS_DB')
          }
        }

        // Redis Sentinel
        if (mode === 'SENTINEL') {
          const sentinels = configService
            .get<string>('SENTINEL_SERVERS')
            .split(';')
            .filter(x => !!x && !!x.trim())
            .map(x => {
              const temp = x.split(':')
              return {
                host: temp[0],
                port: +temp[1]
              }
            })

          return {
            isGlobal: true,
            store: redisStore,
            sentinels,
            max: +configService.get<number>('CACHE_MAX') || 10000000,
            ttl: +configService.get<number>('CACHE_TTL') || 43200,
            name: configService.get<string>('SENTINEL_MASTER_NAME'),
            sentinelPassword: configService.get<string>('SENTINEL_PASSWORD'),
            password: configService.get<string>('SENTINEL_REDIS_PWD'),
            database: configService.get<number>('SENTINEL_REDIS_DB')
          }
        }

        // Default
        return {
          isGlobal: true,
          max: +configService.get<number>('CACHE_MAX') || 1,
          ttl: +configService.get<number>('CACHE_TTL') || 1
        }
      }
    })
  ],
  providers: [CacheService],
  exports: [CacheService]
})
export class CachingModule {}
