import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminAuthShell } from './components/AdminAuthShell'
import { AuthShell } from './components/AuthShell'
import { AdminEmailSentPage } from './pages/AdminEmailSentPage'
import { AdminForgotPasswordPage } from './pages/AdminForgotPasswordPage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AvailabilityPage } from './pages/AvailabilityPage'
import { EmailSentPage } from './pages/EmailSentPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { MyScalesPage } from './pages/MyScalesPage'
import { ProfilePage } from './pages/ProfilePage'
import { SupportPage } from './pages/SupportPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route
        path="/login"
        element={
          <AuthShell>
            <LoginPage />
          </AuthShell>
        }
      />
      <Route
        path="/recuperar-senha"
        element={
          <AuthShell>
            <ForgotPasswordPage />
          </AuthShell>
        }
      />
      <Route
        path="/email-enviado"
        element={
          <AuthShell>
            <EmailSentPage />
          </AuthShell>
        }
      />
      <Route
        path="/admin/login"
        element={
          <AdminAuthShell>
            <AdminLoginPage />
          </AdminAuthShell>
        }
      />
      <Route
        path="/admin/recuperar-senha"
        element={
          <AdminAuthShell>
            <AdminForgotPasswordPage />
          </AdminAuthShell>
        }
      />
      <Route
        path="/admin/email-enviado"
        element={
          <AdminAuthShell>
            <AdminEmailSentPage />
          </AdminAuthShell>
        }
      />
      <Route path="/home" element={<HomePage />} />
      <Route path="/disponibilidade" element={<AvailabilityPage />} />
      <Route path="/minhas-escalas" element={<MyScalesPage />} />
      <Route path="/meu-perfil" element={<ProfilePage />} />
      <Route path="/suporte" element={<SupportPage />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

export default App
