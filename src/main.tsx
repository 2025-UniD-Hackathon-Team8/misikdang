import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import OwnerRegisteredMenuPage from './pages/OwnerRegisteredMenuPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OwnerRegisteredMenuPage />
  </StrictMode>,
)
