// Plain interface — the controller does manual trimming/length checks rather than
// pulling in class-validator just for two fields.
export interface SigninFormBody {
  username?: string
  password?: string
  next?: string
}
