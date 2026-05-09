export interface JwtPayload {
  key?: string
  secret?: string
  cid?: string
  username?: string
  password?: string
  displayName?: string
  email?: string
  phoneNumber?: string
  lang?: string
  timezone?: string
}
