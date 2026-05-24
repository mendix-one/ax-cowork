import { Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseFilePipeBuilder, Post, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import type { ObjectId } from 'mongodb'

import { ObjectIdPipe } from '../../acore/mongo'
import { SourceFilesService } from './source-file.service'
import type { SourceFileSummary } from './source-file.schema'

const MAX_FILE_BYTES = 100 * 1024 * 1024 // 100 MiB
const PHASE_1_PRINCIPAL = 'axios-key'

@ApiTags('Source files')
@ApiSecurity('axios-key')
@ApiUnauthorizedResponse({ description: 'Missing or invalid x-axios-key header.' })
@Controller('source-files')
export class SourceFilesController {
  constructor(private readonly files: SourceFilesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_FILE_BYTES } }))
  @ApiOperation({
    summary: 'Upload a file',
    description: 'Multipart form-data with a single `file` field. Duplicate uploads (same sha256) return the existing metadata.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @ApiCreatedResponse({ description: 'The uploaded file metadata. Same response shape for a deduped upload (existing record returned).' })
  upload(
    @UploadedFile(new ParseFilePipeBuilder().addMaxSizeValidator({ maxSize: MAX_FILE_BYTES }).build({ errorHttpStatusCode: HttpStatus.PAYLOAD_TOO_LARGE }))
    file: Express.Multer.File,
  ): Promise<SourceFileSummary> {
    return this.files.upload({
      fileName: file.originalname,
      contentType: file.mimetype,
      size: file.size,
      content: file.buffer,
      uploadedBy: PHASE_1_PRINCIPAL,
    })
  }

  @Get()
  @ApiOperation({ summary: 'List source files (newest first)' })
  @ApiOkResponse({ description: 'Array of source file metadata; no file bytes.' })
  list(): Promise<SourceFileSummary[]> {
    return this.files.list()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one source file (metadata)' })
  @ApiOkResponse({ description: 'Source file metadata (no file bytes).' })
  @ApiNotFoundResponse({ description: 'No source file with the given id.' })
  getById(@Param('id', ObjectIdPipe) id: ObjectId): Promise<SourceFileSummary> {
    return this.files.getById(id)
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download file content', description: 'Streams the file bytes with the original Content-Type and Content-Disposition.' })
  @ApiProduces('application/octet-stream')
  @ApiOkResponse({ description: 'Streamed file bytes.' })
  @ApiNotFoundResponse({ description: 'No source file with the given id.' })
  async download(@Param('id', ObjectIdPipe) id: ObjectId): Promise<StreamableFile> {
    const { meta, stream } = await this.files.openDownload(id)
    return new StreamableFile(stream, {
      type: meta.contentType,
      disposition: `attachment; filename="${meta.fileName}"`,
      length: meta.size,
    })
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a source file',
    description: 'Rejected with 409 if any job_config still references the file via `source.config.sourceFileId`.',
  })
  @ApiNoContentResponse({ description: 'Source file deleted (metadata + GridFS payload).' })
  @ApiNotFoundResponse({ description: 'No source file with the given id.' })
  @ApiConflictResponse({ description: 'A job_config still references this source file via source.config.sourceFileId.' })
  async delete(@Param('id', ObjectIdPipe) id: ObjectId): Promise<void> {
    await this.files.delete(id)
  }
}
