import { ResetStore } from '../../auth/reset/store/ResetStore'
import { SigninStore } from '../../auth/signin/store/SigninStore'
import { SignupStore } from '../../auth/signup/store/SignupStore'
import { VerifyStore } from '../../auth/verify/store/VerifyStore'
import { ErrorStore } from '../../pages/error/store/ErrorStore'
import { CounterStore } from '../../pages/home/store/CounterStore'
import { MainStore } from '../../pages/main/store/MainStore'

export class RootStore {
  counter = new CounterStore()
  main = new MainStore()
  signin = new SigninStore()
  signup = new SignupStore()
  reset = new ResetStore()
  verify = new VerifyStore()
  error = new ErrorStore()
}

export const rootStore = new RootStore()
