import { IsOptional } from 'class-validator'

export class ConnectReqQuery {
  @IsOptional()
  key: string

  @IsOptional()
  code: string

  @IsOptional()
  redirect: string
}
