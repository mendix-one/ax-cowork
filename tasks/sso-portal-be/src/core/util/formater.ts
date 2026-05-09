import { Injectable } from '@nestjs/common'

@Injectable()
export class Formater {
  hidden(value): string {
    if (!value) {
      return ''
    }

    const length = value.length
    if (length <= 4) {
      return value.replace(/./g, '*')
    }

    let show = 3
    if (length <= 12) {
      show = Math.round((length - 6) / 2)
    } else if (length <= 16) {
      show = 4
    } else if (length <= 20) {
      show = 5
    } else if (length <= 24) {
      show = 6
    } else if (length <= 28) {
      show = 7
    } else {
      show = 8
    }

    const left = value.substring(0, show)
    const middle = value.substring(show, length - show)
    const right = value.substring(length - show, length)

    return `${left}${middle.replace(/./g, '*')}${right}`
  }
}
