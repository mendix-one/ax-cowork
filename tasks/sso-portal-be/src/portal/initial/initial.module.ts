import { Module } from '@nestjs/common'
import { InitialController } from './initial.controller'

@Module({
  controllers: [InitialController]
})
export class InitialModule {}
