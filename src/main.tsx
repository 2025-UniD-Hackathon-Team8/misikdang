import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RegisterMenu1 from './pages/registerMenu_1.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RegisterMenu1 />
  </StrictMode>,
)
