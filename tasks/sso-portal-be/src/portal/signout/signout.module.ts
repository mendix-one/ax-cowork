import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Session } from '../../core/database/session.model'
import { Connection } from '../../core/database/connection.model'
import { SessionHistory } from '../../core/database/session-history.model'
import { SignoutService } from './signout.service'
import { SignoutController } from './signout.controller'

@Module({
  imports: [SequelizeModule.forFeature([Session, Connection, SessionHistory])],
  providers: [SignoutService],
  controllers: [SignoutController]
})
export class SignoutModule {}
