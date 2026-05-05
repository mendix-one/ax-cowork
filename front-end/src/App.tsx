import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './routes/Home'
import { About } from './routes/About'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  )
}

export default App
