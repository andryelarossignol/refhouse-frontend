import { useNavigate } from 'react-router-dom'
import { AuthCard } from '../components/AuthCard'

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="6" width="17" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="m5.5 8 6.5 5 6.5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4.5" y="10" width="15" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10V7.5a4 4 0 1 1 8 0V10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function LoginPage() {
  const navigate = useNavigate()

  return (
    <AuthCard>
      <form
        className="auth-form"
        onSubmit={(event) => {
          event.preventDefault()
          navigate('/home')
        }}
      >
        <label className="auth-field">
          <span className="auth-field-icon"><MailIcon /></span>
          <input type="email" name="email" placeholder="Email" />
        </label>

        <label className="auth-field">
          <span className="auth-field-icon"><LockIcon /></span>
          <input type="password" name="password" placeholder="Senha" />
        </label>

        <button type="submit" className="primary-button">
          Entrar
        </button>
      </form>

      <button type="button" className="text-button" onClick={() => navigate('/recuperar-senha')}>
        Esqueceu sua senha?
      </button>
    </AuthCard>
  )
}
