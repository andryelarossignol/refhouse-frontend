import { useNavigate } from 'react-router-dom'
import { SuccessIcon } from '../components/SuccessIcon'

export function AdminEmailSentPage() {
  const navigate = useNavigate()

  return (
    <section className="success-card" aria-labelledby="admin-email-sent-title">
      <SuccessIcon />

      <div className="success-copy">
        <h1 id="admin-email-sent-title">Email enviado com sucesso!</h1>
        <p>Cheque sua caixa de entrada e spam para ter acesso a nova senha</p>
      </div>

      <button type="button" className="primary-button success-button" onClick={() => navigate('/admin/login')}>
        Voltar a Tela de Login
      </button>
    </section>
  )
}
