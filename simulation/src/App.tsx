import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AxLoginPage } from './pages/ax-login/AxLoginPage'

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AxLoginPage />} />
      </Routes>
    </Router>
  )
}
