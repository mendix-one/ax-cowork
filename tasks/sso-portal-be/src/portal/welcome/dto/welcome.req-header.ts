import { IsOptional } from 'class-validator'

export class WelcomeReqHeader {
  @IsOptional()
  lang: string

  @IsOptional()
  timezone: string
}
