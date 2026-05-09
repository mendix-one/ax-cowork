import { IsNotEmpty } from 'class-validator'

export class DisplayReqQuery {
  @IsNotEmpty()
  token: string
}
