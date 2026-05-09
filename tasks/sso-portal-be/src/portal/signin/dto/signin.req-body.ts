import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator'

export class SigninReqBody {
  @IsNotEmpty()
  @MaxLength(250)
  username: string

  @IsOptional()
  @MaxLength(250)
  password: string
}
