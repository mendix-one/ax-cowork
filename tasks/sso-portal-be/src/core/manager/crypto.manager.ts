import { Injectable } from '@nestjs/common'
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto'
import { promisify } from 'util'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class CryptoManager {
  constructor(private configService: ConfigService) {}

  async iv() {
    const iv = randomBytes(16)
    return iv.toString('base64')
  }

  async secret() {
    const password = this.configService.get('CRYPTO_PASS')
    const salt = this.configService.get('CRYPTO_SALT')
    const key = (await promisify(scrypt)(password, salt, 32)) as Buffer

    return key.toString('base64')
  }

  async encrypt(plainText: string) {
    const iv = this.configService.get('CRYPTO_IV')
    const secret = this.configService.get('CRYPTO_SECRET')

    const cipher = createCipheriv('aes-256-ctr', Buffer.from(secret, 'base64'), Buffer.from(iv, 'base64'))

    let encryptedText = cipher.update(plainText, 'utf-8', 'base64')
    encryptedText += cipher.final('base64')

    return encryptedText
  }

  async decrypt(encryptedText: any) {
    const iv = this.configService.get('CRYPTO_IV')
    const secret = this.configService.get('CRYPTO_SECRET')

    const decipher = createDecipheriv('aes-256-ctr', Buffer.from(secret, 'base64'), Buffer.from(iv, 'base64'))

    let decryptedText = decipher.update(encryptedText, 'base64', 'utf-8')
    decryptedText += decipher.final('utf-8')

    return decryptedText
  }
}
