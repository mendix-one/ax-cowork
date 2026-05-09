import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Access } from '../../core/database/access.model'
import { AccessWorkerListener } from './access-worker.listener'
import { Connection } from '../../core/database/connection.model'

@Module({
  imports: [SequelizeModule.forFeature([Access, Connection])],
  providers: [AccessWorkerListener]
})
export class AccessWorkerModule {}
