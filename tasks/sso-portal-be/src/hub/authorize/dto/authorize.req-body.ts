import { IsNotEmpty } from 'class-validator'

export class AuthorizeReqBody {
  @IsNotEmpty()
  key: string

  @IsNotEmpty()
  secret: string
}
