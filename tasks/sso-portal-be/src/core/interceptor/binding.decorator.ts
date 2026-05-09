import { Reflector } from '@nestjs/core'

export const Biding = Reflector.createDecorator<string[]>()
