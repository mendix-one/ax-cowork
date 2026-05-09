import { Global, Module } from '@nestjs/common'
import { Generator } from './generator'
import { Paginator } from './paginator'
import { Formater } from './formater'
import { Normalizer } from './normalizer'

@Global()
@Module({
  providers: [Formater, Generator, Normalizer, Paginator],
  exports: [Formater, Generator, Normalizer, Paginator]
})
export class UtilModule {}
