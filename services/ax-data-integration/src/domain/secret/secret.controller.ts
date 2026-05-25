import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common'
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import type { ObjectId } from 'mongodb'

import { ObjectIdPipe } from '../../acore/mongo'
import { CreateSecretDto } from './dto/create-secret.dto'
import { UpdateSecretDto } from './dto/update-secret.dto'
import type { SecretSummary } from './secret.schema'
import { SecretsService } from './secret.service'

// TODO: derive a real principal from the authenticated API key (hash / index)
// once the guard attaches it to the request. For phase 1 the API key set is small
// and shared across the internal team, so a single literal is acceptable.
const PHASE_1_PRINCIPAL = 'axios-key'

@ApiTags('Secrets')
@ApiSecurity('axios-key')
@ApiUnauthorizedResponse({ description: 'Missing or invalid x-api-key header.' })
@Controller('secrets')
export class SecretsController {
  constructor(private readonly secrets: SecretsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a secret', description: 'Encrypts the supplied plaintext at rest using the current master key.' })
  @ApiCreatedResponse({ description: 'The new secret (without plaintext or ciphertext).' })
  @ApiConflictResponse({ description: 'A secret with that name already exists.' })
  create(@Body() dto: CreateSecretDto): Promise<SecretSummary> {
    return this.secrets.create({
      name: dto.name,
      type: dto.type,
      plaintext: dto.plaintext,
      createdBy: PHASE_1_PRINCIPAL,
    })
  }

  @Get()
  @ApiOperation({ summary: 'List secrets', description: 'Returns metadata only — never plaintext or ciphertext.' })
  @ApiOkResponse({ description: 'Newest-first list of secret summaries.' })
  list(): Promise<SecretSummary[]> {
    return this.secrets.list()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one secret by id (metadata only)' })
  @ApiOkResponse()
  @ApiNotFoundResponse({ description: 'No secret with the given id.' })
  getById(@Param('id', ObjectIdPipe) id: ObjectId): Promise<SecretSummary> {
    return this.secrets.getById(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a secret', description: 'When `plaintext` is supplied, the secret is re-encrypted under the current master key version.' })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse({ description: 'The new name collides with an existing secret.' })
  update(@Param('id', ObjectIdPipe) id: ObjectId, @Body() dto: UpdateSecretDto): Promise<SecretSummary> {
    return this.secrets.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a secret', description: 'Hard delete. Rejected with 409 when any job_config still references the secret.' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse({ description: 'The secret is still referenced by one or more job_configs.' })
  async delete(@Param('id', ObjectIdPipe) id: ObjectId): Promise<void> {
    // Referential check + delete happen inside the service so any future caller (worker,
    // CLI, etc.) gets the same protection — mirrors SourceFilesService.delete.
    await this.secrets.delete(id)
  }
}
