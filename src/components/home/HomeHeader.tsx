import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

type HomeHeaderProps = {
  onToggleMenu: () => void
  onToggleNotifications: () => void
  nomeUsuario?: string
  temAvisos?: boolean
}

export function HomeHeader({ onToggleMenu, onToggleNotifications, nomeUsuario, temAvisos }: HomeHeaderProps) {
  const navigate = useNavigate()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const nomeExibicao = nomeUsuario || 'Árbitro'
  
  const iniciais = nomeExibicao.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  const handleLogout = () => {
    localStorage.removeItem('@Refhouse:token')
    localStorage.removeItem('@Refhouse:user')
    navigate('/login')
  }

  return (
    <header className="dashboard-topbar">
      <div className="dashboard-topbar-left">
        <button type="button" className="icon-button" onClick={onToggleMenu}>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
        
        {/* Logo Clicável */}
        <Link to="/home" className="home-brand-link" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src="/logo-refhouse.svg" alt="RefHouse" style={{ height: '32px', width: 'auto' }} />
        </Link>
      </div>

      <div className="dashboard-topbar-right">
        {/* Menu Dropdown de Perfil */}
        <div style={{ position: 'relative' }}>
          <div 
            className="user-chip" 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            <div className="user-avatar">{iniciais}</div>
            <span>{nomeExibicao}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{ marginLeft: '4px', opacity: 0.6 }}>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>

          {isProfileMenuOpen && (
            <div className="profile-dropdown-panel" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', minWidth: '180px', zIndex: 100, overflow: 'hidden' }}>
              <button 
                onClick={() => navigate('/meu-perfil')} 
                style={{ width: '100%', textAlign: 'left', padding: '1rem', background: 'none', border: 'none', borderBottom: '1px solid #e5e7eb', cursor: 'pointer', fontSize: '0.95rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                Meu Perfil
              </button>
              <button 
                onClick={handleLogout} 
                style={{ width: '100%', textAlign: 'left', padding: '1rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                Sair
              </button>
            </div>
          )}
        </div>

        <button type="button" className="icon-button notification-button" onClick={onToggleNotifications}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="24" height="24"><path d="M12 4.75a4.25 4.25 0 0 0-4.25 4.25v2.11c0 .72-.24 1.42-.69 1.98L5.8 14.7c-.36.45-.1 1.13.47 1.13h11.46c.57 0 .83-.68.47-1.13l-1.26-1.61a3.18 3.18 0 0 1-.69-1.98V9A4.25 4.25 0 0 0 12 4.75Z" /><path d="M10.3 18.15a1.9 1.9 0 0 0 3.4 0" /></svg>
          {temAvisos && <span className="notification-dot" />}
        </button>
      </div>
    </header>
  )
}