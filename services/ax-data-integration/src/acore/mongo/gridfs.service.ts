import { Readable } from 'stream'
import { pipeline } from 'stream/promises'

import { Inject, Injectable } from '@nestjs/common'
import { GridFSBucket, GridFSFile, ObjectId } from 'mongodb'

import { GRIDFS_BUCKET } from './mongo.constants'

@Injectable()
export class GridfsService {
  constructor(@Inject(GRIDFS_BUCKET) private readonly bucket: GridFSBucket) {}

  async upload(stream: Readable, filename: string, metadata?: Record<string, unknown>): Promise<GridFSFile> {
    const uploadStream = this.bucket.openUploadStream(filename, { metadata })
    await pipeline(stream, uploadStream)
    if (!uploadStream.gridFSFile) {
      throw new Error('GridFS upload finished without a populated file descriptor')
    }
    return uploadStream.gridFSFile
  }

  download(fileId: ObjectId): Readable {
    return this.bucket.openDownloadStream(fileId)
  }

  async delete(fileId: ObjectId): Promise<void> {
    await this.bucket.delete(fileId)
  }

  async findById(fileId: ObjectId): Promise<GridFSFile | null> {
    return this.bucket.find({ _id: fileId }).next()
  }
}
