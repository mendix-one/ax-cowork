import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { Session, SessionSchema } from './schemas/session.schema'
import { User, UserSchema } from './schemas/user.schema'

const FEATURE_MODELS = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
  { name: Session.name, schema: SessionSchema },
])

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGODB_URI'),
      }),
    }),
    FEATURE_MODELS,
  ],
  exports: [FEATURE_MODELS],
})
export class DatabaseModule {}
