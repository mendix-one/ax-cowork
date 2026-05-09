import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Short } from '../../core/database/short.model'
import { ShortController } from './short.controller'
import { ShortService } from './short.service'

@Module({
  imports: [SequelizeModule.forFeature([Short])],
  providers: [ShortService],
  controllers: [ShortController]
})
export class ShortModule {}
