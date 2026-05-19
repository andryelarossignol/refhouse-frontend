import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthCard } from '../components/AuthCard'
import api from '../services/api' 

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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

function ErrorIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" style={{ marginRight: '4px' }}>
      <path fill="#E53E3E" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
    </svg>
  )
}

// NOVO: Ícone para Mostrar Senha
function EyeOpenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

// NOVO: Ícone para Esconder Senha
function EyeClosedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

export function LoginPage() {
  const navigate = useNavigate()
  
  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [temErro, setTemErro] = useState(false)
  const [mensagemErro, setMensagemErro] = useState('CPF ou senha incorretos')
  
  // NOVO: Estado que controla se a senha está visível ou não
  const [mostrarSenha, setMostrarSenha] = useState(false)

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, '')
    if (valor.length > 11) valor = valor.slice(0, 11)
    
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    
    setCpf(valor)
    setTemErro(false)
  }

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!cpf || !senha) {
      setTemErro(true)
      setMensagemErro('Preencha todos os campos')
      return
    }

    setLoading(true)
    setTemErro(false)

    try {
      const response = await api.post('/auth/arbitro/login', { 
        cpf, 
        senha 
      })

      const { token, nome } = response.data

      localStorage.setItem('@Refhouse:token', token)
      localStorage.setItem('@Refhouse:user', JSON.stringify({ nome, role: 'arbitro' }))

      navigate('/home')
      
    } catch (error: any) {
      setTemErro(true)
      setMensagemErro(
        error.response?.data?.erro || 
        error.response?.data?.message || 
        'CPF ou senha incorretos'
      )
    } finally {
      setLoading(false)
    }
  }

  const erroEstilo = temErro ? { borderColor: '#E53E3E', color: '#E53E3E' } : {}

  return (
    <AuthCard>
      <form className="auth-form" onSubmit={handleLogin}>
        
        <label className="auth-field" style={erroEstilo}>
          <span className="auth-field-icon"><UserIcon /></span>
          <input 
            type="text" 
            name="cpf" 
            placeholder="CPF" 
            value={cpf}
            onChange={handleCpfChange}
            disabled={loading}
            style={{ 
              borderColor: temErro ? '#E53E3E' : undefined, 
              color: temErro ? '#E53E3E' : undefined 
            }}
          />
        </label>

        {/* O campo de senha agora abraça o botão do olho */}
        <label className="auth-field" style={{ ...erroEstilo, marginBottom: temErro ? '-6px' : undefined }}>
          <span className="auth-field-icon"><LockIcon /></span>
          
          <input 
            type={mostrarSenha ? "text" : "password"} /* Mágica acontece aqui */
            name="password" 
            placeholder="Senha"
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value)
              setTemErro(false)
            }}
            disabled={loading}
            style={{ 
              borderColor: temErro ? '#E53E3E' : undefined, 
              color: temErro ? '#E53E3E' : undefined,
              paddingRight: '3rem' // Evita que a senha encoste no ícone do olho
            }}
          />

          {/* NOVO: Botão para mostrar/ocultar senha */}
          <button
            type="button" // Essencial não ser type="submit", senão ele tenta logar
            onClick={() => setMostrarSenha(!mostrarSenha)}
            disabled={loading}
            title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
            style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              color: temErro ? '#E53E3E' : '#b0b5bd', // Fica vermelho se der erro, cinza normalmente
              display: 'grid',
              placeItems: 'center'
            }}
          >
            {mostrarSenha ? <EyeClosedIcon /> : <EyeOpenIcon />}
          </button>
        </label>

        {temErro && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', color: '#E53E3E', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
            <ErrorIcon />
            <span>{mensagemErro}</span>
          </div>
        )}

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Acessando...' : 'Acessar'}
        </button>
      </form>

      <button 
        type="button" 
        className="text-button" 
        onClick={() => navigate('/recuperar-senha')}
        disabled={loading}
      >
        Esqueceu sua senha?
      </button>
    </AuthCard>
  )
}