import { IsNotEmpty } from 'class-validator'

export class CheckReqQuery {
  @IsNotEmpty()
  token: string
}
