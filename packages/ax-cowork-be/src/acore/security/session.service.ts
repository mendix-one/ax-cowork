import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { CookieOptions, Request, Response } from 'express'

// Envelope format written into the cookie:
//   base64url(iv) . base64url(authTag) . base64url(ciphertext)
// AES-256-GCM with a 12-byte IV. Both confidentiality and integrity come from GCM.
const ENVELOPE_PARTS = 3
const IV_LENGTH = 12

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name)
  private readonly cookieName: string
  private readonly key: Buffer
  private readonly secure: boolean

  constructor(config: ConfigService) {
    this.cookieName = config.get<string>('SESSION_COOKIE_NAME', 'ax_session')
    this.secure = config.get<boolean>('SESSION_COOKIE_SECURE', false)
    const hexKey = config.getOrThrow<string>('SESSION_COOKIE_SECRET')
    this.key = Buffer.from(hexKey, 'hex')
  }

  // Encrypts the SSO JWT and writes it to an HttpOnly cookie on the response.
  // maxAgeMs is best-effort — the guard ultimately trusts the JWT's `exp` claim.
  setToken(res: Response, token: string, maxAgeMs: number): void {
    const sealed = this.seal(token)
    res.cookie(this.cookieName, sealed, this.cookieOptions(maxAgeMs))
  }

  // Reads + decrypts the cookie. Returns null when missing, malformed, or tampered.
  // We never throw to the caller — auth failures fall through to the redirect path.
  readToken(req: Request): string | null {
    const cookies = req.cookies as Record<string, string | undefined> | undefined
    const sealed = cookies?.[this.cookieName]
    if (typeof sealed !== 'string' || sealed.length === 0) {
      return null
    }
    return this.unseal(sealed)
  }

  clear(res: Response): void {
    res.clearCookie(this.cookieName, this.cookieOptions(0))
  }

  private cookieOptions(maxAgeMs: number): CookieOptions {
    return {
      httpOnly: true,
      secure: this.secure,
      sameSite: 'lax',
      path: '/',
      maxAge: maxAgeMs,
    }
  }

  private seal(plaintext: string): string {
    const iv = randomBytes(IV_LENGTH)
    const cipher = createCipheriv('aes-256-gcm', this.key, iv)
    const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
    const tag = cipher.getAuthTag()
    return [iv.toString('base64url'), tag.toString('base64url'), ciphertext.toString('base64url')].join('.')
  }

  private unseal(envelope: string): string | null {
    const parts = envelope.split('.')
    if (parts.length !== ENVELOPE_PARTS) {
      return null
    }
    try {
      const iv = Buffer.from(parts[0], 'base64url')
      const tag = Buffer.from(parts[1], 'base64url')
      const ciphertext = Buffer.from(parts[2], 'base64url')
      const decipher = createDecipheriv('aes-256-gcm', this.key, iv)
      decipher.setAuthTag(tag)
      const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()])
      return plaintext.toString('utf8')
    } catch (err) {
      // Bad key, tampered ciphertext, or truncated envelope. Treat as "no session".
      this.logger.debug(`Cookie unseal failed: ${(err as Error).message}`)
      return null
    }
  }
}
