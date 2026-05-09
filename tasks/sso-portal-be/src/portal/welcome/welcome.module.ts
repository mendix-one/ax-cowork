import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from '../../core/database/user.model'
import { Setting } from '../../core/database/setting.model'
import { Account } from '../../core/database/account.model'
import { Code } from '../../core/database/code.model'
import { WelcomeController } from './welcome.controller'
import { WelcomeService } from './welcome.service'

@Module({
  imports: [SequelizeModule.forFeature([Setting, User, Account, Code])],
  providers: [WelcomeService],
  controllers: [WelcomeController]
})
export class WelcomeModule {}
