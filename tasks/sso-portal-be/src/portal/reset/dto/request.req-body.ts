import { IsEmail, IsNotEmpty } from 'class-validator'

export class RequestReqBody {
  @IsNotEmpty()
  @IsEmail()
  email: string
}
