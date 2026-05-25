import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator'

import { ACCOUNT_STATUSES } from '../../acore/database/schemas/account.schema'
import type { AccountStatus } from '../../acore/database/schemas/account.schema'
import { AccountStatusEnum } from '../common/account.type'

// Admin-only update surface. Wider than the self-service `UpdateProfileInput` — admins can
// adjust `status` (LOCK/CLOSE/REACTIVATE) and rotate the `display`/contact fields.
@InputType()
export class UpdateAccountInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  display?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  @MaxLength(254)
  email?: string

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

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  cdnAvatarId?: string

  @Field(() => AccountStatusEnum, { nullable: true })
  @IsOptional()
  @IsEnum(ACCOUNT_STATUSES)
  status?: AccountStatus
}
