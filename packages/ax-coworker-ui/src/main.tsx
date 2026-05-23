import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@/acore/i18n'
import AxApp from './AxApp.tsx'

import '@fontsource/roboto/100.css'
import '@fontsource/roboto/200.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/600.css'
import '@fontsource/roboto/700.css'
import '@fontsource/roboto/800.css'
import '@fontsource/roboto/900.css'
import './styles/tailwind.scss'
import './styles/index.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AxApp />
  </StrictMode>,
)
