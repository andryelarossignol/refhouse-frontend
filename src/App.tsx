import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import { AdminAuthShell } from './components/auth/AdminAuthShell'
import { AuthShell } from './components/auth/AuthShell'
import { AdminEmailSentPage } from './pages/AdminEmailSentPage'
import { AdminForgotPasswordPage } from './pages/AdminForgotPasswordPage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage' // <-- 1. Adicionamos a importação aqui
import { AvailabilityPage } from './pages/AvailabilityPage'
import { EmailSentPage } from './pages/EmailSentPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { MyScalesPage } from './pages/MyScalesPage'
import { ProfilePage } from './pages/ProfilePage'
import { SupportPage } from './pages/SupportPage'
import { GerenciarArbitrosPage } from './pages/GerenciarArbitrosPage'
import { GerenciarAvisosPage } from './pages/GerenciarAvisosPage'
import { GerenciarDisponibilidadesPage } from './pages/GerenciarDisponibilidadesPage'
import { GerenciarEscalasPage } from './pages/GerenciarEscalasPage'
import { HistoricoPage } from './pages/HistoricoPage'
import { AdminPerfilPage } from './pages/AdminPerfilPage'

function App() {
  return (
    <ToastProvider>
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
      
      {/* --- ROTAS DO ADMINISTRADOR --- */}
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
      <Route path="/admin/escalas" element={<GerenciarEscalasPage />} />
      <Route path="/admin/avisos" element={<GerenciarAvisosPage />} />
      <Route path="/admin/historico" element={<HistoricoPage />} />
      <Route path="/admin/disponibilidades" element={<GerenciarDisponibilidadesPage />} />
      {/* 2. Adicionamos a Rota do Dashboard do Admin aqui */}
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/perfil" element={<AdminPerfilPage />} />
      <Route path="/admin/arbitros" element={<GerenciarArbitrosPage />} />
      {/* --- ROTAS DO ÁRBITRO --- */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/disponibilidade" element={<AvailabilityPage />} />
      <Route path="/minhas-escalas" element={<MyScalesPage />} />
      <Route path="/meu-perfil" element={<ProfilePage />} />
      <Route path="/suporte" element={<SupportPage />} />
      
      <Route path="*" element={<Navigate to="/home" replace />} />
        
    </Routes>
    </ToastProvider>
  )
}

export default App