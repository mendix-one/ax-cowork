import { IsOptional } from 'class-validator'

export class ContinueReqQuery {
  @IsOptional()
  key: string

  @IsOptional()
  secret: string
}
