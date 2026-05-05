import { Route, Routes } from 'react-router-dom'
import { ResetPage } from './auth/reset/views'
import { SigninPage } from './auth/signin/views'
import { SignupPage } from './auth/signup/views'
import { VerifyPage } from './auth/verify/views'
import { ErrorPage } from './pages/error/views'
import { HomePage } from './pages/home/views'
import { MainPage } from './pages/main/views'

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="main" element={<MainPage />} />
      <Route path="signin" element={<SigninPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="reset" element={<ResetPage />} />
      <Route path="verify" element={<VerifyPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  )
}

export default App
