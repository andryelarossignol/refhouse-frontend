import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import type { Aviso } from '../../types'

// ==========================================
// ÍCONES SVG DO LAYOUT DO ÁRBITRO
// ==========================================
const DashIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const DisponibilidadeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
const EscalasIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/></svg>
const LogoutIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
const UserCircleIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const NotificationIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="24" height="24"><path d="M12 4.75a4.25 4.25 0 0 0-4.25 4.25v2.11c0 .72-.24 1.42-.69 1.98L5.8 14.7c-.36.45-.1 1.13.47 1.13h11.46c.57 0 .83-.68.47-1.13l-1.26-1.61a3.18 3.18 0 0 1-.69-1.98V9A4.25 4.25 0 0 0 12 4.75Z" /><path d="M10.3 18.15a1.9 1.9 0 0 0 3.4 0" /></svg>
const MenuIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>

// ==========================================
// PROPS DO LAYOUT
// ==========================================
type BreadcrumbItem = {
  label: string;
  path?: string;
}

interface ArbitroLayoutProps {
  children: React.ReactNode;
  nomeUsuario: string;
  avisos?: Aviso[];
  breadcrumbs?: BreadcrumbItem[];
}

export function ArbitroLayout({ children, nomeUsuario, avisos, breadcrumbs = [] }: ArbitroLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  // Pega as 2 primeiras iniciais para o avatar
  const iniciais = nomeUsuario ? nomeUsuario.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'AR'
  const temAvisos = avisos && avisos.length > 0

  const handleLogout = () => {
    localStorage.removeItem('@Refhouse:token')
    localStorage.removeItem('@Refhouse:user')
    navigate('/login')
  }

  // Função auxiliar para marcar o menu ativo
  const isActive = (path: string) => location.pathname.includes(path)

  return (
    <div className="dashboard-page dashboard-shell">
      
      {/* ========================================== */}
      {/* HEADER DO ÁRBITRO                          */}
      {/* ========================================== */}
      <header className="dashboard-topbar">
        <div className="dashboard-topbar-left">
          {/* Botão de Menu Mobile */}
          <button className="icon-button" onClick={() => setSidebarOpen(true)}>
            <MenuIcon />
          </button>

          {/* Logo Clicável */}
          <Link to="/home" className="home-brand-link" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src="/logo-refhouse.svg" alt="RefHouse" style={{ height: '32px', width: 'auto' }} />
          </Link>
        </div>

        <div className="dashboard-topbar-right">
          
          {/* Dropdown de Perfil Unificado */}
          <div style={{ position: 'relative' }}>
            <div 
              className="user-chip" 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              <div className="user-avatar" style={{ backgroundColor: '#ea580c', color: 'white' }}>{iniciais}</div>
              <span>{nomeUsuario}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{ marginLeft: '4px', opacity: 0.6 }}>
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>

            {isProfileMenuOpen && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', minWidth: '180px', zIndex: 100, overflow: 'hidden' }}>
                <button 
                  onClick={() => navigate('/meu-perfil')} 
                  style={{ width: '100%', textAlign: 'left', padding: '1rem', background: 'none', border: 'none', borderBottom: '1px solid #e5e7eb', cursor: 'pointer', fontSize: '0.95rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <UserCircleIcon /> Meu Perfil
                </button>
                <button 
                  onClick={handleLogout} 
                  style={{ width: '100%', textAlign: 'left', padding: '1rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <LogoutIcon /> Sair
                </button>
              </div>
            )}
          </div>

          {/* Sininho de Notificações */}
          <button type="button" className="icon-button notification-button" style={{ position: 'relative' }} onClick={() => navigate('/avisos')}>
            <NotificationIcon />
            {temAvisos && <span style={{ position: 'absolute', top: '2px', right: '4px', width: '8px', height: '8px', backgroundColor: '#ea580c', borderRadius: '50%' }} />}
          </button>
        </div>
      </header>

      {/* ========================================== */}
      {/* SIDEBAR DO ÁRBITRO                         */}
      {/* ========================================== */}
      <div className={`dashboard-sidebar-backdrop ${isSidebarOpen ? 'dashboard-sidebar-backdrop-visible' : ''}`} onClick={() => setSidebarOpen(false)} />
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'dashboard-sidebar-open' : ''}`}>
        <div style={{ padding: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
          <img src="/logo-refhouse.svg" alt="RefHouse" style={{ height: '36px', filter: 'brightness(0) invert(1)' }} />
        </div>
        <nav className="dashboard-sidebar-nav">
          <button className={`sidebar-link ${location.pathname === '/home' ? 'sidebar-link-active' : ''}`} onClick={() => navigate('/home')}>
            <DashIcon /> Início
          </button>
          <button className={`sidebar-link ${isActive('/disponibilidade') ? 'sidebar-link-active' : ''}`} onClick={() => navigate('/disponibilidade')}>
            <DisponibilidadeIcon /> Disponibilidade
          </button>
          <button className={`sidebar-link ${isActive('/minhas-escalas') ? 'sidebar-link-active' : ''}`} onClick={() => navigate('/minhas-escalas')}>
            <EscalasIcon /> Minhas Escalas
          </button>
          <button className={`sidebar-link ${isActive('/meu-perfil') ? 'sidebar-link-active' : ''}`} onClick={() => navigate('/meu-perfil')}>
            <UserCircleIcon /> Meu Perfil
          </button>
        </nav>
      </aside>

      {/* ========================================== */}
      {/* CONTEÚDO PRINCIPAL CENTRALIZADO            */}
      {/* ========================================== */}
      <main className="dashboard-content">
        
        {/* Sistema Unificado de Migalhas de Pão (Breadcrumbs) */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#6b7280' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>Início</span>
            
            {breadcrumbs.map((crumb, index) => (
              <span key={index}>
                <span style={{ margin: '0 8px' }}>/</span>
                <span 
                  style={{ 
                    fontWeight: crumb.path ? 'normal' : 600, 
                    color: crumb.path ? '#6b7280' : '#111',
                    cursor: crumb.path ? 'pointer' : 'default'
                  }}
                  onClick={() => crumb.path && navigate(crumb.path)}
                >
                  {crumb.label}
                </span>
              </span>
            ))}
          </div>
        )}

        {/* Aqui entra o conteúdo de cada página do árbitro */}
        {children}

      </main>
    </div>
  )
}