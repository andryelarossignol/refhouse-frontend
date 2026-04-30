import { useNavigate } from 'react-router-dom'
import { SuccessIcon } from '../components/SuccessIcon'

export function EmailSentPage() {
  const navigate = useNavigate()

  return (
    <section className="success-card" aria-labelledby="success-title">
      <SuccessIcon />

      <div className="success-copy">
        <h1 id="success-title">Email enviado com sucesso!</h1>
        <p>Cheque sua caixa de entrada e spam para ter acesso a nova senha</p>
      </div>

      <button type="button" className="primary-button success-button" onClick={() => navigate('/login')}>
        Voltar a Tela de Login
      </button>
    </section>
  )
}
