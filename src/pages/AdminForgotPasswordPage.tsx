import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthCard } from '../components/auth/AuthCard'
import { esqueciSenha } from '../services/authService'

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
      <rect x="3.5" y="6" width="17" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="m5.5 8 6.5 5 6.5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" style={{ marginRight: '4px' }}>
      <path fill="#E53E3E" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
    </svg>
  )
}

export function AdminForgotPasswordPage() {
  const navigate = useNavigate()
  
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [temErro, setTemErro] = useState(false)
  const [mensagemErro, setMensagemErro] = useState('E-mail não encontrado.')

  const handleRecovery = async (event: React.FormEvent) => {
    event.preventDefault() // Impede a página de recarregar
    
    if (!email) {
      setTemErro(true)
      setMensagemErro('Por favor, informe seu e-mail.')
      return
    }

    setLoading(true)
    setTemErro(false)

    try {
      await esqueciSenha(email)
      navigate('/admin/email-enviado')
      
    } catch (error: any) {
      setTemErro(true)
      setMensagemErro(
        error.response?.data?.erro || 
        error.response?.data?.message || 
        'Erro ao tentar enviar o e-mail. Tente novamente.'
      )
    } finally {
      setLoading(false)
    }
  }

  const erroEstilo = temErro ? { borderColor: '#E53E3E', color: '#E53E3E' } : {}

  return (
    <AuthCard 
      title="Recuperar senha" 
      description="Informe seu e-mail para enviarmos as instruções de redefinição de senha."
    >
      {/* Mudamos para disparar a função handleRecovery no onSubmit */}
      <form className="auth-form" onSubmit={handleRecovery}>
        
        <label className="auth-field" style={erroEstilo}>
          <span className="auth-field-icon"><MailIcon /></span>
          <input 
            type="email" 
            name="recoveryEmail" 
            placeholder="Email" 
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setTemErro(false) // Limpa o erro ao digitar
            }}
            disabled={loading}
            style={{ 
              borderColor: temErro ? '#E53E3E' : undefined, 
              color: temErro ? '#E53E3E' : undefined 
            }}
          />
        </label>

        {/* MENSAGEM DE ERRO VISUAL NO MESMO PADRÃO DO LOGIN */}
        {temErro && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', color: '#E53E3E', fontSize: '12px', fontWeight: '500', marginBottom: '8px', marginTop: '-6px' }}>
            <ErrorIcon />
            <span>{mensagemErro}</span>
          </div>
        )}

        {/* Transformamos em type="submit" para funcionar apertando "Enter" no teclado */}
        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar e-mail'}
        </button>
      </form>

      <button 
        type="button" 
        className="text-button" 
        onClick={() => navigate('/admin/login')}
        disabled={loading}
      >
        Voltar para login
      </button>
    </AuthCard>
  )
}