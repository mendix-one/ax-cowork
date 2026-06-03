import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import { AxSigninPage } from './pages/ax-signin/AxSigninPage'
import { SimulationPage } from './pages/simulation/SimulationPage'

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/simulation" replace />} />
        <Route path="/signin" element={<AxSigninPage />} />
        <Route path="/simulation" element={<SimulationPage />} />
      </Routes>
    </Router>
  )
}
