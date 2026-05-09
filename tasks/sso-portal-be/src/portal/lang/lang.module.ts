import { Module } from '@nestjs/common'
import { LangController } from './lang.controller'

@Module({
  controllers: [LangController]
})
export class LanguageModule {}
