import { IsNotEmpty, IsUUID, MaxLength, MinLength } from 'class-validator'

export class ConvertReqBody {
  @IsNotEmpty()
  @IsUUID()
  key: string

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  code: string
}
