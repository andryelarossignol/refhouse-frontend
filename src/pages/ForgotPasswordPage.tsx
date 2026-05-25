import { useNavigate } from 'react-router-dom'
import { AuthCard } from '../components/auth/AuthCard'

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="6" width="17" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="m5.5 8 6.5 5 6.5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ForgotPasswordPage() {
  const navigate = useNavigate()

  return (
    <AuthCard title="Recuperar senha" description="Informe seu e-mail para enviarmos as instrucoes de redefinicao de senha.">
      <form className="auth-form" onSubmit={(event) => event.preventDefault()}>
        <label className="auth-field">
          <span className="auth-field-icon"><MailIcon /></span>
          <input type="email" name="recoveryEmail" placeholder="Email" />
        </label>

        <button type="button" className="primary-button" onClick={() => navigate('/email-enviado')}>
          Enviar e-mail
        </button>
      </form>

      <button type="button" className="text-button" onClick={() => navigate('/login')}>
        Voltar para login
      </button>
    </AuthCard>
  )
}
