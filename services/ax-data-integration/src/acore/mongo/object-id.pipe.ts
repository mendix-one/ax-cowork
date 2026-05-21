import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { ObjectId } from 'mongodb'

/** Validates an incoming path/query string as a Mongo `ObjectId` and converts it. */
@Injectable()
export class ObjectIdPipe implements PipeTransform<string, ObjectId> {
  transform(value: string): ObjectId {
    if (!value || !ObjectId.isValid(value)) {
      throw new BadRequestException(`Invalid ObjectId: ${value}`)
    }
    return new ObjectId(value)
  }
}
