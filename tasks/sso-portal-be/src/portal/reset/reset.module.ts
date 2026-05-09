import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Account } from '../../core/database/account.model'
import { Code } from '../../core/database/code.model'
import { ResetService } from './reset.service'
import { ResetController } from './reset.controller'

@Module({
  imports: [SequelizeModule.forFeature([Account, Code])],
  providers: [ResetService],
  controllers: [ResetController]
})
export class ResetModule {}
