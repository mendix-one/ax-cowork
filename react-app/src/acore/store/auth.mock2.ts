import { makeAutoObservable, runInAction } from 'mobx'
import { axios, BusinessError } from '@/acore/axios'

// Mirrors `SessionInfoResDto` from ax-sso-services. `account` + `status` are absent on
// anonymous sessions; `roles` is empty in that case.
export type SessionAppInfo = {
  uuid: string
  key: string
  type: string
  name: string
  description?: string
  avatar?: string
}

export type SessionAccountInfo = {
  uuid: string
  username: string
  display: string
  email: string
  avatar?: string
  phone?: string
}

export type SessionInfo = {
  uuid: string
  app: SessionAppInfo
  account?: SessionAccountInfo
  status?: 'ACTIVE' | 'LOCKED' | 'CLOSED'
  roles: string[]
  expiresAt: string
}

export type SigninPayload = {
  username: string
  password: string
}

export class AuthStore {
  // Server-side state, hydrated by init() / refreshed after signin/signout. The session
  // cookie is the source of truth — nothing is persisted to localStorage on the client.
  session: SessionInfo | null = null

  // App-boot flag. `initialized` flips to true once `init()` has finished its first call
  // (success or failure) so the AxApp can gate the router behind a loading screen.
  isInitialized = false
  isInterrupted = false

  // Per-action flags. `loading` is set during signin/signout/init so the UI can disable
  // form controls; `error` carries the most recent failure message (cleared on next attempt).
  isLoading = false
  errorCode: number | 0 = 0

  constructor() {
    makeAutoObservable(this)
  }

  get isAuthed(): boolean {
    return this.session?.account != null
  }

  get currentAccount(): SessionAccountInfo | null {
    return this.session?.account ?? null
  }

  // Pulls the current session state from the BE gateway → SSO /session. Runs at app boot
  // and after signin/signout. Idempotent for the init-only call site (re-entry returns early
  // once `initialized` is true); the post-signin/signout call sites invoke `refreshSession`
  // directly to bypass that guard.
  async init(): Promise<void> {
    if (this.isInitialized) return
    await this.refreshSession()
    runInAction(() => {
      this.isInitialized = true
    })
  }

  // POST credentials to BE (which forwards to SSO /signin with the minted bearer), then
  // refresh the local session. Throws on failure so the caller can react (e.g. focus the
  // password field); the error message is also stashed on `auth.error` for shared UI.
  async signin(payload: SigninPayload): Promise<void> {
    this.isLoading = true
    this.errorCode = 0
    try {
      await axios.post('/sso/signin', payload)
      await this.refreshSession()
    } catch (err) {
      console.error(err)
      if (err instanceof BusinessError) {
        runInAction(() => {
          this.errorCode = err.code
        })
        throw err
      }
    } finally {
      runInAction(() => {
        this.isLoading = false
      })
    }
  }

  // POST to BE (which forwards to SSO /signout). Whether the upstream call succeeds or
  // fails, refresh the session afterwards — the session row stays put but its account
  // snapshot is detached, so the refresh shows the now-anonymous state.
  async signout(): Promise<void> {
    this.isLoading = true
    this.errorCode = 0
    try {
      await axios.post('/sso/signout')
    } catch (err) {
      if (err instanceof BusinessError) {
        runInAction(() => {
          this.errorCode = (err as BusinessError).code
        })
      }
    } finally {
      await this.refreshSession()
      runInAction(() => {
        this.isLoading = false
      })
    }
  }

  // Shared loader used by init / signin / signout. Captures errors into `auth.error` but
  // never throws — downstream code (route guards, page-level loaders) handles missing session.
  private async refreshSession(): Promise<void> {
    try {
      const session = {
        uuid: '019e5cce-e78c-7334-88d8-2da6a0d79321',
        app: {
          uuid: '019e5c83-76b8-733b-b516-66bf564213aa',
          key: 'APLANNER',
          type: 'WEB_APP',
          name: 'AX aPlanner',
          description: 'aPlanner - WebApp',
        },
        account: undefined,
        status: undefined,
        roles: [],
        expiresAt: '2027-05-25T02:27:58.660Z',
      } as SessionInfo
      // await axios.get<SessionInfo>('/sso/session')
      console.log('Session:', session)
      runInAction(() => {
        this.session = session
      })
    } catch (err) {
      if (err instanceof BusinessError) {
        runInAction(() => {
          this.errorCode = (err as BusinessError).code
        })
      }
      runInAction(() => {
        this.session = null
        this.isInterrupted = true
      })
    }
  }
}
