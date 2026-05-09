import { Module } from '@nestjs/common'
import { ConnectController } from './connect.controller'
import { ConnectService } from './connect.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Connection } from '../../core/database/connection.model'
import { Client } from '../../core/database/client.model'

@Module({
  imports: [SequelizeModule.forFeature([Client, Connection])],
  controllers: [ConnectController],
  providers: [ConnectService]
})
export class ConnectModule {}
