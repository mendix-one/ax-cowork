import { IsNotEmpty, MaxLength } from 'class-validator'

export class AttemptReqParam {
  @IsNotEmpty()
  @MaxLength(250)
  code: string
}
