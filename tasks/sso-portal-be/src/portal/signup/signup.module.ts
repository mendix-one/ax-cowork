import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from '../../core/database/user.model'
import { Setting } from '../../core/database/setting.model'
import { Account } from '../../core/database/account.model'
import { Code } from '../../core/database/code.model'
import { SignupController } from './signup.controller'
import { SignupService } from './signup.service'

@Module({
  imports: [SequelizeModule.forFeature([Setting, User, Account, Code])],
  providers: [SignupService],
  controllers: [SignupController]
})
export class SignupModule {}
