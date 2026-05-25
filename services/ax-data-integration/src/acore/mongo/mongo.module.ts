import { Global, Inject, Logger, Module, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Db, GridFSBucket, MongoClient } from 'mongodb'

import { ensureIndexes, type IndexEnsureResult } from './indexes'
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
export class MongoModule implements OnApplicationBootstrap, OnApplicationShutdown {
  constructor(
    @Inject(MONGO_CLIENT) private readonly client: MongoClient,
    @Inject(MONGO_DB) private readonly db: Db,
    private readonly config: ConfigService,
  ) {}

  /**
   * Auto-runs `ensureIndexes()` on every boot so a fresh deploy never lands in the
   * "indexes missing → overlapping runs allowed" trap. Falls back to a warning + no-op
   * if the ensure takes longer than `INTEGRATION_INDEX_ENSURE_TIMEOUT_MS` (default 30s)
   * so a slow Mongo doesn't block readiness indefinitely. Operators can still run
   * `node dist/migrate-indexes` standalone for debugging / back-fill.
   *
   * Set `INTEGRATION_AUTO_ENSURE_INDEXES=false` to disable (emergency rollback path).
   */
  async onApplicationBootstrap(): Promise<void> {
    const enabled = this.config.get<boolean>('INTEGRATION_AUTO_ENSURE_INDEXES') ?? true
    if (!enabled) {
      logger.warn('ensureIndexes skipped — INTEGRATION_AUTO_ENSURE_INDEXES=false. Run `node dist/migrate-indexes` before serving real traffic.')
      return
    }
    const timeoutMs = this.config.get<number>('INTEGRATION_INDEX_ENSURE_TIMEOUT_MS') ?? 30_000

    let timeoutHandle: ReturnType<typeof setTimeout> | undefined
    const timeoutPromise = new Promise<'timeout'>((resolve) => {
      timeoutHandle = setTimeout(() => resolve('timeout'), timeoutMs)
    })
    const ensurePromise: Promise<IndexEnsureResult[]> = ensureIndexes(this.db, (msg) => logger.debug(msg))

    const result = await Promise.race([ensurePromise, timeoutPromise])
    if (timeoutHandle) clearTimeout(timeoutHandle)

    if (result === 'timeout') {
      logger.warn(`ensureIndexes did not finish within ${timeoutMs}ms — boot continues but indexes may be incomplete. Check Mongo health.`)
      // The ensure promise still resolves in the background — let it finish without awaiting.
      ensurePromise.catch((err: unknown) => {
        logger.error(`ensureIndexes failed after boot timeout: ${err instanceof Error ? err.message : String(err)}`)
      })
      return
    }

    const created = result.filter((r) => r.action === 'created').length
    const existed = result.filter((r) => r.action === 'existed').length
    const recreated = result.filter((r) => r.action === 'recreated').length
    logger.log(`ensureIndexes done: created=${created} existed=${existed} recreated=${recreated} total=${result.length}`)
  }

  async onApplicationShutdown(): Promise<void> {
    await this.client.close()
    logger.log('MongoDB connection closed')
  }
}
