import { Link } from 'react-router-dom'
import { HomeBrand } from './HomeBrand'

type HomeHeaderProps = {
  onToggleMenu: () => void
  onToggleNotifications: () => void
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 4.75a4.25 4.25 0 0 0-4.25 4.25v2.11c0 .72-.24 1.42-.69 1.98L5.8 14.7c-.36.45-.1 1.13.47 1.13h11.46c.57 0 .83-.68.47-1.13l-1.26-1.61a3.18 3.18 0 0 1-.69-1.98V9A4.25 4.25 0 0 0 12 4.75Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10.3 18.15a1.9 1.9 0 0 0 3.4 0" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export function HomeHeader({ onToggleMenu, onToggleNotifications }: HomeHeaderProps) {
  return (
    <header className="dashboard-topbar">
      <div className="dashboard-topbar-left">
        <button type="button" className="icon-button" aria-label="Abrir menu" onClick={onToggleMenu}>
          <MenuIcon />
        </button>
        <Link to="/home" className="home-brand-link" aria-label="Ir para a home">
          <HomeBrand />
        </Link>
      </div>

      <div className="dashboard-topbar-right">
        <div className="user-chip">
          <div className="user-avatar" aria-hidden="true">
            IC
          </div>
          <span>Ithalo Carneiro</span>
        </div>

        <button type="button" className="icon-button notification-button" aria-label="Abrir notificacoes" onClick={onToggleNotifications}>
          <BellIcon />
          <span className="notification-dot" />
        </button>
      </div>
    </header>
  )
}
