import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n/i18n.ts'
import './index.css'
import './styles/utilities.css'
import App from './App.tsx'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
