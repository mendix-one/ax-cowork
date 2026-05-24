import { makeAutoObservable, runInAction } from 'mobx'
import { apolloClient } from '@/acore/apollo'
import type { SessionAccountInfo } from '@/acore/store/auth.store'
import { GET_PROFILE_QUERY, type GetProfileResult, type ProfileQueryAccount, type ProfileQueryAppRoles, type ProfileQuerySession } from './account.queries'

// Sidebar menu keys. String-literal union (not an enum — `erasableSyntaxOnly` forbids those).
export type AccountMenuKey = 'profile' | 'setting' | 'roles' | 'session'

// Local store scoped to the AccountModal — not on RootStore. Owns:
//   - the profile snapshot (account + sessions) fetched from SSO via GraphQL,
//   - which sidebar menu item is active,
//   - loading / error flags for the fetch.
// The modal calls `init()` on open to refresh against fresh upstream data, falling back to
// `syncFromAuth(...)` so the avatar/display render immediately while the network call lands.
export class AccountStore {
  account: ProfileQueryAccount | SessionAccountInfo | null = null
  sessions: ProfileQuerySession[] = []
  appRoles: ProfileQueryAppRoles[] = []
  activeMenu: AccountMenuKey = 'profile'
  isLoading = false
  errorMessage: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  // Seed the store from the auth snapshot so the modal can paint instantly with the data
  // already on hand. `init()` then overwrites it with fresher GraphQL data when the network
  // call completes.
  syncFromAuth(account: SessionAccountInfo | null): void {
    this.account = account
  }

  setActiveMenu(key: AccountMenuKey): void {
    this.activeMenu = key
  }

  // Reset to the default menu so the next open of the modal lands on the profile tab.
  reset(): void {
    this.activeMenu = 'profile'
    this.account = null
    this.sessions = []
    this.appRoles = []
    this.errorMessage = null
  }

  // Fetch the caller's profile (account + sessions) from SSO via the BE gateway. The gateway
  // mints an upstream-scoped Bearer for the session cookie and forwards POST /graphql to SSO
  // — no extra auth wiring needed on this side. Errors are stashed onto `errorMessage` but
  // never thrown; the modal stays usable with whatever `account` was seeded via syncFromAuth.
  async init(): Promise<void> {
    this.isLoading = true
    this.errorMessage = null
    try {
      const { data, error } = await apolloClient.query<GetProfileResult>({
        query: GET_PROFILE_QUERY,
        fetchPolicy: 'network-only',
      })
      if (error) {
        runInAction(() => {
          this.errorMessage = error.message
        })
        return
      }
      if (!data) {
        runInAction(() => {
          this.errorMessage = 'Empty profile response'
        })
        return
      }
      runInAction(() => {
        this.account = data.getProfile.account
        this.sessions = data.getProfile.sessions
        this.appRoles = data.getProfile.appRoles
      })
    } catch (err) {
      runInAction(() => {
        this.errorMessage = err instanceof Error ? err.message : 'Failed to load profile'
      })
    } finally {
      runInAction(() => {
        this.isLoading = false
      })
    }
  }
}
