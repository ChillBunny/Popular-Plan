import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ui/ErrorBoundary.tsx'
import { ProveedorTema } from './theme/tema.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ProveedorTema>
        <App />
      </ProveedorTema>
    </ErrorBoundary>
  </StrictMode>,
)
