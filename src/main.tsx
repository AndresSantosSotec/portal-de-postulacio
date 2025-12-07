import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import "@github/spark/spark" // ⚠️ Spark deshabilitado - no se usa en este proyecto

import App from './App.tsx'
import ResetPasswordPage from './pages/ResetPasswordPage.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <BrowserRouter>
      <Routes>
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
   </ErrorBoundary>
)
