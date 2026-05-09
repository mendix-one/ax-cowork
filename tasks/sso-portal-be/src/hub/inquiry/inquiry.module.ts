import { Module } from '@nestjs/common'
import { InquiryController } from './inquiry.controller'
import { InquiryService } from './inquiry.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Client } from '../../core/database/client.model'
import { Connection } from '../../core/database/connection.model'
import { Session } from '../../core/database/session.model'
import { Artifact } from '../../core/database/artifact.model'
import { Account } from '../../core/database/account.model'
import { AccountRole } from '../../core/database/account-role.model'
import { ArtifactAccount } from '../../core/database/artifact-account.model'

@Module({
  imports: [SequelizeModule.forFeature([Account, AccountRole, Artifact, ArtifactAccount, Client, Session, Connection])],
  controllers: [InquiryController],
  providers: [InquiryService]
})
export class InquiryModule {}
