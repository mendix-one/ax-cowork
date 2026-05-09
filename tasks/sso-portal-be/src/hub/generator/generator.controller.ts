import { Controller, Get } from '@nestjs/common'
import { HashingManager } from '../../core/manager/hashing.manager'
import { CryptoManager } from '../../core/manager/crypto.manager'
import { JwtManager } from '../../core/manager/jwt.manager'
import { Generator } from '../../core/util/generator'

@Controller('generator')
export class GeneratorController {
  constructor(
    private hashingManager: HashingManager,
    private cryptoManager: CryptoManager,
    private jwtManager: JwtManager,
    private generator: Generator
  ) {}

  @Get()
  async index() {
    const key = this.generator.uuid()
    const secret = this.generator.secret()
    const salt = await this.hashingManager.salt()
    const hash = await this.hashingManager.hash(secret, salt)
    const token = await this.jwtManager.sign({
      key,
      secret: hash
    })

    return {
      key,
      secret,
      salt,
      token
    }
  }

  @Get('crypto')
  async crypto() {
    const iv = await this.cryptoManager.iv()
    const secret = await this.cryptoManager.secret()

    return {
      iv,
      secret
    }
  }

  @Get('account')
  async account() {
    const cid = this.generator.uuid()
    const plain = this.generator.secret(20)
    const password = await this.hashingManager.hash(plain)

    return {
      cid,
      username: 'username',
      password,
      plain,
      email: 'email',
      displayName: 'My Name',
      user: {
        cid,
        fullName: 'My Name',
        email: 'email'
      }
    }
  }

  @Get('artifact')
  async artifact() {
    const aid = this.generator.uuid()
    const apiKey = this.generator.secret()
    const cdnOwnerId = this.generator.uuid()

    return {
      idx: 1,
      aid,
      name: 'VCID',
      apiKey,
      type: 'INTERNAL',
      cdnOwnerId
    }
  }

  @Get('client')
  async client() {
    const eid = this.generator.uuid()
    const secret = this.generator.secret()
    const cdnOwnerId = this.generator.uuid()

    return {
      idx: 1,
      aid: '375fb9fb-23f3-4c6e-9e0d-1a535bda9361',
      eid,
      secret,
      name: 'VCID SSO Portal',
      type: 'WEB_SERVER',
      cdnOwnerId
    }
  }

  @Get('random/:id')
  async random() {
    const eid = this.generator.uuid()
    const secret = this.generator.secret()
    const cdnOwnerId = this.generator.uuid()

    return {
      idx: 1,
      aid: '375fb9fb-23f3-4c6e-9e0d-1a535bda9361',
      eid,
      secret,
      name: 'VCID SSO Portal',
      type: 'WEB_SERVER',
      cdnOwnerId
    }
  }
}
