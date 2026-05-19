import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

// ==========================================
// ÍCONES SVG DO LAYOUT
// ==========================================
const MenuIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
const DashIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const EscalasIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/></svg>
const DisponibilidadeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
const ArbitrosIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const AvisosIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/><path d="M5.8 15.2 2 22l6.8-3.8"/><path d="M12 2A7 7 0 0 0 5 9v3l-3 4h20l-3-4V9a7 7 0 0 0-7-7z"/></svg>
const HistoricoIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
const LogoutIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
const UserCircleIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>

// ==========================================
// PROPS DO LAYOUT
// ==========================================
type BreadcrumbItem = {
  label: string;
  path?: string; // Se tiver path, vira link. Se não, é a página atual (negrito).
}

interface AdminLayoutProps {
  children: React.ReactNode;
  breadcrumbs: BreadcrumbItem[];
}

export function AdminLayout({ children, breadcrumbs }: AdminLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation() // Pega a URL atual para marcar o menu lateral
  
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const user = JSON.parse(localStorage.getItem('@Refhouse:user') || '{}')
  const nomeAdmin = user?.nome_completo || user?.nome || 'Admin'

  const handleLogout = () => {
    localStorage.removeItem('@Refhouse:token')
    localStorage.removeItem('@Refhouse:user')
    navigate('/admin/login')
  }

  // Função auxiliar para marcar o menu ativo
  const isActive = (path: string) => location.pathname.includes(path)

  return (
    <div className="dashboard-page dashboard-shell">
      
      {/* ========================================== */}
      {/* HEADER PADRONIZADO                         */}
      {/* ========================================== */}
      <header className="dashboard-topbar">
        <div className="dashboard-topbar-left">
          <button className="icon-button" onClick={() => setSidebarOpen(true)}>
            <MenuIcon />
          </button>
          
          <div 
            className="home-brand" 
            onClick={() => navigate('/admin/dashboard')} 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Voltar para a Home"
          >
            <img src="/logo-refhouse.svg" alt="RefHouse" style={{ height: '32px', marginRight: '6px' }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#5d6169' }}>Admin</span>
          </div>
        </div>

        <div className="dashboard-topbar-right">
          <div style={{ position: 'relative' }}>
            <div 
              className="user-chip" 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #ff6b23, #d7b496)' }}>
                {nomeAdmin.charAt(0).toUpperCase()}
              </div>
              <span>{nomeAdmin}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{ marginLeft: '4px', opacity: 0.6 }}>
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>

            {isProfileMenuOpen && (
              <div style={{ 
                position: 'absolute', top: '100%', right: 0, marginTop: '8px', 
                backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', minWidth: '180px', 
                zIndex: 100, overflow: 'hidden' 
              }}>
                <button 
                  onClick={() => navigate('/admin/perfil')} 
                  style={{ width: '100%', textAlign: 'left', padding: '1rem', background: 'none', border: 'none', borderBottom: '1px solid #e5e7eb', cursor: 'pointer', fontSize: '0.95rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <UserCircleIcon /> Meu Perfil
                </button>
                <button 
                  onClick={handleLogout} 
                  style={{ width: '100%', textAlign: 'left', padding: '1rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <LogoutIcon /> Sair da Conta
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========================================== */}
      {/* SIDEBAR PADRONIZADA                        */}
      {/* ========================================== */}
      <div className={`dashboard-sidebar-backdrop ${isSidebarOpen ? 'dashboard-sidebar-backdrop-visible' : ''}`} onClick={() => setSidebarOpen(false)} />
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'dashboard-sidebar-open' : ''}`}>
        <div style={{ padding: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
          <img src="/logo-refhouse.svg" alt="RefHouse" style={{ height: '36px', filter: 'brightness(0) invert(1)' }} />
        </div>
        <nav className="dashboard-sidebar-nav">
          <button className={`sidebar-link ${isActive('/dashboard') ? 'sidebar-link-active' : ''}`} onClick={() => navigate('/admin/dashboard')}><DashIcon /> Dashboard</button>
          <button className={`sidebar-link ${isActive('/escalas') ? 'sidebar-link-active' : ''}`} onClick={() => navigate('/admin/escalas')}><EscalasIcon /> Gerenciar Escalas</button>
          <button className={`sidebar-link ${isActive('/disponibilidades') ? 'sidebar-link-active' : ''}`} onClick={() => navigate('/admin/disponibilidades')}><DisponibilidadeIcon /> Gerenciar Disponibilidades</button>
          <button className={`sidebar-link ${isActive('/arbitros') ? 'sidebar-link-active' : ''}`} onClick={() => navigate('/admin/arbitros')}><ArbitrosIcon /> Gerenciar Árbitros</button>
          <button className={`sidebar-link ${isActive('/avisos') ? 'sidebar-link-active' : ''}`} onClick={() => navigate('/admin/avisos')}><AvisosIcon /> Gerenciar Avisos</button>
          <button className={`sidebar-link ${isActive('/historico') ? 'sidebar-link-active' : ''}`} onClick={() => navigate('/admin/historico')}><HistoricoIcon /> Histórico</button>
        </nav>
      </aside>

      {/* ========================================== */}
      {/* CONTEÚDO PRINCIPAL (COM BREADCRUMBS INCLUSO) */}
      {/* ========================================== */}
      <main className="dashboard-content">
        
        {/* Sistema Unificado de Migalhas de Pão */}
        <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/dashboard')}>Início</span>
          
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

        {/* Aqui entra o conteúdo específico de cada página! */}
        {children}

      </main>
    </div>
  )
}