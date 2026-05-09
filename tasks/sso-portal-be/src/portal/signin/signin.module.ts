import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Account } from '../../core/database/account.model'
import { Session } from '../../core/database/session.model'
import { Connection } from '../../core/database/connection.model'
import { SessionHistory } from '../../core/database/session-history.model'
import { SigninService } from './signin.service'
import { SigninController } from './signin.controller'

@Module({
  imports: [SequelizeModule.forFeature([Account, Session, Connection, SessionHistory])],
  providers: [SigninService],
  controllers: [SigninController]
})
export class SigninModule {}
