import { IsOptional } from 'class-validator'

export class IndexReqQuery {
  @IsOptional()
  token: string
}
