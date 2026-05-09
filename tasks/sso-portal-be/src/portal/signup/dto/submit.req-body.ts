import { IsNotEmpty, IsUUID, MaxLength, MinLength } from 'class-validator'

export class SubmitReqBody {
  @IsNotEmpty()
  @IsUUID()
  key: string

  @IsNotEmpty()
  @MaxLength(500)
  secret: string

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(250)
  newPassword: string

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(250)
  confirmPassword: string
}
