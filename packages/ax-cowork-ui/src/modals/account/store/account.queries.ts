import { gql } from '@apollo/client'

// Fetches the caller's account + the list of active sessions (one per app the caller is
// currently signed into). Mirrors `ProfileType` on the SSO `profile.resolver.ts` side; widen
// the projection here if the modal grows to surface more fields.
export const GET_PROFILE_QUERY = gql`
  query AccountProfile {
    getProfile {
      account {
        uuid
        username
        display
        email
        phone
        avatar
        status
      }
      sessions {
        uuid
        expiresAt
        app {
          uuid
          key
          name
          description
          avatar
        }
      }
      appRoles {
        app {
          uuid
          key
          name
          avatar
          description
        }
        roles {
          key
          name
          description
        }
      }
    }
  }
`

export interface ProfileQueryAccount {
  uuid: string
  username: string
  display: string
  email: string
  phone?: string | null
  avatar?: string | null
  status: 'ACTIVE' | 'LOCKED' | 'CLOSED'
}

export interface ProfileQuerySessionApp {
  uuid: string
  key?: string | null
  name?: string | null
  description?: string | null
  avatar?: string | null
}

export interface ProfileQuerySession {
  uuid: string
  expiresAt: string
  app: ProfileQuerySessionApp
}

export interface ProfileQueryAppInfo {
  uuid: string
  key: string
  name: string
  avatar?: string | null
  description?: string | null
}

export interface ProfileQueryRole {
  key: string
  name: string
  description?: string | null
}

export interface ProfileQueryAppRoles {
  app: ProfileQueryAppInfo
  roles: ProfileQueryRole[]
}

export interface GetProfileResult {
  getProfile: {
    account: ProfileQueryAccount
    sessions: ProfileQuerySession[]
    appRoles: ProfileQueryAppRoles[]
  }
}
