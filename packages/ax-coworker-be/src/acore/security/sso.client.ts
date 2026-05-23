import { HttpException, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios, { AxiosError, type AxiosInstance } from 'axios'

export interface SsoSigninResponse {
  uuid: string
  token: string
  account: {
    uuid: string
    username: string
    display: string
    email: string
    status: string
    avatar?: string
    phone?: string
  }
  app: {
    uuid: string
    key?: string
    type: string
    name: string
  }
  roles: string[]
}

export interface SsoSessionResponse {
  uuid: string
  token: string
  app: {
    uuid: string
    key: string
    type: string
    name: string
    description?: string
    avatar?: string
  }
  // Serialized as ISO string over the wire.
  expiresAt: string
}

const API_KEY_HEADER = 'ax-api-key'
const APP_KEY_HEADER = 'ax-app-key'

@Injectable()
export class SsoClient {
  private readonly logger = new Logger(SsoClient.name)
  private readonly http: AxiosInstance
  private readonly appKey: string

  constructor(config: ConfigService) {
    const baseURL = config.getOrThrow<string>('SSO_BASE_URL')
    const apiKey = config.getOrThrow<string>('SSO_API_KEY')
    this.appKey = config.getOrThrow<string>('SSO_APP_KEY')

    this.http = axios.create({
      baseURL,
      timeout: 10_000,
      headers: {
        [API_KEY_HEADER]: apiKey,
        [APP_KEY_HEADER]: this.appKey,
        'content-type': 'application/json',
      },
    })
  }

  // Bootstrap an anonymous session against ax-sso-services. Returns the session uuid and a
  // bearer JWT carrying only `app` + `ses` claims (no account yet). Used by the IndexController
  // to seed first-time visitors with a session cookie before serving the SPA.
  async initialize(): Promise<SsoSessionResponse> {
    try {
      const { data } = await this.http.post<SsoSessionResponse>('/session/initialize')
      return data
    } catch (err) {
      throw this.translateError(err, 'session/initialize')
    }
  }

  async signin(username: string, password: string): Promise<SsoSigninResponse> {
    try {
      const { data } = await this.http.post<SsoSigninResponse>('/signin', { username, password })
      return data
    } catch (err) {
      throw this.translateError(err, 'signin')
    }
  }

  async signout(token: string): Promise<void> {
    try {
      await this.http.post('/signout', undefined, { headers: { authorization: `Bearer ${token}` } })
    } catch (err) {
      // Signout is best-effort — log but don't block the user from being logged out locally.
      this.logger.warn(`SSO /signout failed: ${(err as Error).message}`)
    }
  }

  private translateError(err: unknown, op: string): Error {
    if (err instanceof AxiosError && err.response) {
      const status = err.response.status
      const data = err.response.data as { message?: string } | undefined
      const message = data?.message ?? err.message
      this.logger.warn(`SSO ${op} failed: ${status} ${message}`)
      return new HttpException(message, status)
    }
    this.logger.error(`SSO ${op} error: ${(err as Error).message}`)
    return new HttpException('SSO unreachable', 502)
  }
}
