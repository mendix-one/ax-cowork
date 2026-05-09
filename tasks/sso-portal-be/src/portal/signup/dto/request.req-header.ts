import { IsOptional } from 'class-validator'

export class RequestReqHeader {
  @IsOptional()
  lang: string

  @IsOptional()
  timezone: string
}
