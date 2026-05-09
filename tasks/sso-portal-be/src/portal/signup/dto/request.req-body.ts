import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator'

export class RequestReqBody {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(250)
  username: string

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(250)
  displayName: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsOptional()
  @MaxLength(20)
  phoneNumber: string
}
