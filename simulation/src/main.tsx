import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import { App } from './App'

import './styles/tailwind.scss'
import './styles/index.scss'

const root = createRoot(document.getElementById('root')!)
root.render(
  <StrictMode>
    <ConfigProvider theme={{ token: { colorPrimary: '#3F51B5' } }}>
      <App />
    </ConfigProvider>
  </StrictMode>,
)
