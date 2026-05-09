import { Account } from '../database/account.model'
import { Role } from '../database/role.model'

export interface Authentication {
  key?: string
  aid?: string
  eid?: string
  sid?: string
  cid?: string
  token?: string
  account?: Partial<Account>
  roles?: Partial<Role>[]
}
