import { Global, Inject, Logger, Module, OnApplicationShutdown } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Db, GridFSBucket, MongoClient } from 'mongodb'

import { GRIDFS_BUCKET, MONGO_CLIENT, MONGO_DB } from './mongo.constants'
import { GridfsService } from './gridfs.service'

const logger = new Logger('MongoModule')

@Global()
@Module({
  providers: [
    {
      provide: MONGO_CLIENT,
      inject: [ConfigService],
      useFactory: async (config: ConfigService): Promise<MongoClient> => {
        const uri = config.getOrThrow<string>('MONGO_URI')
        const poolSize = config.get<number>('MONGO_POOL_SIZE') ?? 10
        const client = new MongoClient(uri, { maxPoolSize: poolSize })
        await client.connect()
        logger.log(`Connected to MongoDB (poolSize=${poolSize})`)
        return client
      },
    },
    {
      provide: MONGO_DB,
      inject: [MONGO_CLIENT, ConfigService],
      useFactory: (client: MongoClient, config: ConfigService): Db => {
        const dbName = config.getOrThrow<string>('MONGO_DB_NAME')
        return client.db(dbName)
      },
    },
    {
      provide: GRIDFS_BUCKET,
      inject: [MONGO_DB],
      useFactory: (db: Db): GridFSBucket => new GridFSBucket(db, { bucketName: 'fs' }),
    },
    GridfsService,
  ],
  exports: [MONGO_CLIENT, MONGO_DB, GRIDFS_BUCKET, GridfsService],
})
export class MongoModule implements OnApplicationShutdown {
  constructor(@Inject(MONGO_CLIENT) private readonly client: MongoClient) {}

  async onApplicationShutdown(): Promise<void> {
    await this.client.close()
    logger.log('MongoDB connection closed')
  }
}
