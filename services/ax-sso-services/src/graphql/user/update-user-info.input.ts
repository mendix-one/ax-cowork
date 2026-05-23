import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator'

// Fields a user is allowed to mutate. `username`, `passwordHash`, `status`, and tenant identity
// (`uuid`, `cdnOwnerId`) are intentionally omitted — they need other admin endpoints.
@InputType()
export class UpdateUserInfoInput {
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
}
