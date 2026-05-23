import { ApiProperty } from '@nestjs/swagger'

export class IndexResDto {
  @ApiProperty({ description: 'Service name.', example: 'ax-sso-services' })
  name!: string

  @ApiProperty({ description: 'Service status.', example: 'ok' })
  status!: string
}
