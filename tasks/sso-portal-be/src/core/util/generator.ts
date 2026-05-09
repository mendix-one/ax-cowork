import { v4 as uuidv4 } from 'uuid'
import { Injectable } from '@nestjs/common'

@Injectable()
export class Generator {
  /**
   * Generate UUID - V4
   */
  uuid(): string {
    return uuidv4()
  }

  /**
   * Generate key
   */
  key(): string {
    return uuidv4()
  }

  /**
   * Generate code
   *
   * @param length
   */
  code(length: number = 6): string {
    let result = ''

    const characters = '0123456789'
    const charactersLength = characters.length

    let counter = 0
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
      counter += 1
    }

    return result
  }

  /**
   * Generate secret
   *
   * @param length
   */
  secret(length: number = 80): string {
    let result = ''

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length

    let counter = 0
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
      counter += 1
    }

    return result
  }
}
