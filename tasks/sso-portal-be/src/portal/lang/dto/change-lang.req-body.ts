import { IsIn, IsNotEmpty, IsOptional } from 'class-validator'

export class ChangeLangReqBody {
  @IsNotEmpty()
  @IsIn(['vi', 'en'])
  lang: string

  @IsOptional()
  back: string
}
