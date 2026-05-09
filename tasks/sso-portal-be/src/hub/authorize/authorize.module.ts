import { Module } from '@nestjs/common'
import { AuthorizeController } from './authorize.controller'
import { AuthorizeService } from './authorize.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Client } from '../../core/database/client.model'
import { Connection } from '../../core/database/connection.model'

@Module({
  imports: [SequelizeModule.forFeature([Client, Connection])],
  controllers: [AuthorizeController],
  providers: [AuthorizeService]
})
export class AuthorizeModule {}
