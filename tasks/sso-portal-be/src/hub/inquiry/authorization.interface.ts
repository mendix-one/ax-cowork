import { Account } from '../../core/database/account.model'
import { Role } from '../../core/database/role.model'

export interface Authorization {
  key?: string
  aid?: string
  eid?: string
  sid?: string
  cid?: string
  token?: string
  account?: Partial<Account>
  roles?: Partial<Role>[]
}
