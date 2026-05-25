import { ApiProperty } from '@nestjs/swagger'

export class HealthCheckResDto {
  @ApiProperty({ description: 'Service status.', example: 'ok' })
  status!: string
}
