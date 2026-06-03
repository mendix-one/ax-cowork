import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import { AxLoginPage } from './pages/ax-login/AxLoginPage'
import { SimulationPage } from './pages/simulation/SimulationPage'

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/simulation" replace />} />
        <Route path="/login" element={<AxLoginPage />} />
        <Route path="/simulation" element={<SimulationPage />} />
      </Routes>
    </Router>
  )
}
