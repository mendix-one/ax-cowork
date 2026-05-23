import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

import { ACCOUNT_STATUSES } from '../../acore/database/schemas/account.schema'
import type { AccountStatus } from '../../acore/database/schemas/account.schema'
import { AccountStatusEnum } from '../common/account.type'

@InputType()
export class CreateAccountInput {
  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  username!: string

  @Field({ description: 'Plaintext password. Hashed with bcrypt server-side; never stored or returned.' })
  @IsString()
  @MinLength(8)
  @MaxLength(256)
  password!: string

  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  display!: string

  @Field()
  @IsEmail()
  @MaxLength(254)
  email!: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  phone?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  avatar?: string

  @Field(() => AccountStatusEnum, { nullable: true, description: 'Defaults to ACTIVE.' })
  @IsOptional()
  @IsEnum(ACCOUNT_STATUSES)
  status?: AccountStatus
}
