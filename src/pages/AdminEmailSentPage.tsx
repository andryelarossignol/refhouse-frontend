import { useNavigate } from 'react-router-dom'
import { SuccessIcon } from '../components/common/SuccessIcon'

export function AdminEmailSentPage() {
  const navigate = useNavigate()

  return (
    // Mantemos a classe success-card que já foi configurada no seu app.css
    <section className="success-card" aria-labelledby="admin-email-sent-title">
      <SuccessIcon />

      <div className="success-copy">
        <h1 id="admin-email-sent-title">E-mail enviado com sucesso!</h1>
        <p>
          Verifique sua caixa de entrada e a pasta de spam para ter acesso à nova senha.
        </p>
      </div>

      <button 
        type="button" 
        className="primary-button" 
        onClick={() => navigate('/admin/login')}
        style={{ marginTop: '0.5rem' }} // Dá um respiro elegante entre o texto e o botão
      >
        Voltar à tela de login
      </button>
    </section>
  )
}